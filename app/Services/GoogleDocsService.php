<?php

namespace App\Services;

use Google_Client;
use Google_Service_Docs;
use Google_Service_Drive;
use Google_Service_Docs_BatchUpdateDocumentRequest;
use Google_Service_Drive_DriveFile;
use Google_Service_Docs_Request;
use Google_Service_Docs_ReplaceAllTextRequest;

class GoogleDocsService
{
    protected $client;
    protected $docsService;
    protected $driveService;

    public function __construct($accessToken, $refreshToken = null)
    {
        $this->client = new Google_Client();
        $this->client->setClientId(env('GOOGLE_CLIENT_ID'));
        $this->client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $this->client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $this->client->setAccessToken([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
        ]);
        $this->client->setScopes([
            Google_Service_Docs::DOCUMENTS,
            Google_Service_Drive::DRIVE,
        ]);
        $this->client->setAccessType('offline');
        $this->docsService = new Google_Service_Docs($this->client);
        $this->driveService = new Google_Service_Drive($this->client);
    }

    public function gerarDocumentoPortaria($templateId, $dados)
    {
        // 1. Verificar se existe pasta com o nome do dia da portaria
        $dataPortaria = $dados['data'];
        $nomePastaDia = $dataPortaria->format('d-m-Y'); // Formato: 15-12-2024
        
        // Buscar pasta com o nome do dia na pasta raiz
        $pastaDiaId = $this->buscarOuCriarPastaDia($nomePastaDia);
        
        // 2. Copiar o template para dentro da pasta do dia
        $copy = $this->driveService->files->copy($templateId, new Google_Service_Drive_DriveFile([
            'name' => 'Portaria ' . ($dados['numero'] ?? date('YmdHis')),
            'parents' => [$pastaDiaId] // Usar a pasta do dia encontrada/criada
        ]));
        $documentId = $copy->id;

        // 3. Substituir variáveis no novo documento
        $requests = [];
        foreach ($dados as $chave => $valor) {
            $requests[] = new Google_Service_Docs_Request([
                'replaceAllText' => new Google_Service_Docs_ReplaceAllTextRequest([
                    'containsText' => [
                        'text' => '{{' . $chave . '}}',
                        'matchCase' => true,
                    ],
                    'replaceText' => $valor,
                ]),
            ]);
        }
        $batchUpdateRequest = new Google_Service_Docs_BatchUpdateDocumentRequest([
            'requests' => $requests,
        ]);
        $this->docsService->documents->batchUpdate($documentId, $batchUpdateRequest);

        // 4. Retornar o link do documento
        return 'https://docs.google.com/document/d/' . $documentId . '/edit';
    }

    /**
     * Busca ou cria uma pasta com o nome do dia na pasta raiz
     */
    private function buscarOuCriarPastaDia($nomePastaDia)
    {
        $pastaRaizId = '1bLa81qtMt4favX5DUsABTaKJ0Hwn34iX'; // PORTARIAS GERADAS
        
        // Buscar se já existe uma pasta com o nome do dia
        $query = "name = '{$nomePastaDia}' and '{$pastaRaizId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
        
        $result = $this->driveService->files->listFiles([
            'q' => $query,
            'fields' => 'files(id, name)',
            'pageSize' => 1
        ]);
        
        // Se encontrou a pasta, retorna o ID
        if (!empty($result->getFiles())) {
            return $result->getFiles()[0]->getId();
        }
        
        // Se não encontrou, cria a pasta
        $pastaDia = $this->driveService->files->create(new Google_Service_Drive_DriveFile([
            'name' => $nomePastaDia,
            'mimeType' => 'application/vnd.google-apps.folder',
            'parents' => [$pastaRaizId]
        ]));
        
        return $pastaDia->getId();
    }
} 