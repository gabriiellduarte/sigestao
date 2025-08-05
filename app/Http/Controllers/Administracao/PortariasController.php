<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Cargo;
use App\Models\Pessoa;
use App\Models\Portaria;
use App\Models\Servidores;
use App\Models\TipoPortaria;
use App\Services\GoogleDocsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Secretaria;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PortariasController extends Controller
{

    public function dashboard(){
        // Total de portarias
        $totalPortarias = Portaria::count();
        $portariasEsteMes = Portaria::whereMonth('doc_portarias_data', now()->month)->count();

        // Servidores ativos
        //$servidoresAtivos = Servidor::where('adm_servidores_status', true)->count();
        $servidoresAtivos = 22;
        //$novosServidoresEsteMes = Servidor::whereMonth('created_at', now()->month)->count();
        $novosServidoresEsteMes = 33;
        // Portarias pendentes
        $portariasPendentes = Portaria::whereNull('doc_portarias_publicadoem')->count();
        $portariasPendentesOntem = Portaria::whereNull('doc_portarias_publicadoem')
            ->whereDate('created_at', now()->subDay())
            ->count();

        // Processadas hoje
        $processadasHoje = Portaria::whereDate('doc_portarias_publicadoem', now())->count();
        $processadasOntem = Portaria::whereDate('doc_portarias_publicadoem', now()->subDay())->count();

        // Portarias recentes
        $portariasRecentes = Portaria::with(['servidor', 'tipoPortaria'])
            ->latest('doc_portarias_data')
            ->take(4)
            ->get()
            ->map(function ($portaria) {
                return [
                    'id' => $portaria->doc_portarias_id,
                    'servidor' => $portaria->doc_portarias_servidor_nome,
                    'tipo' => $portaria->tipoPortaria->doc_tiposportaria_nome,
                    'data' => $portaria->doc_portarias_data->format('d/m/Y'),
                    'status' => $portaria->doc_portarias_publicadoem ? 'ativa' : 'pendente'
                ];
            });

        // Estatísticas por tipo de portaria
        $tiposPortariaStats = TipoPortaria::withCount(['portarias' => function ($query) {
            $query->whereYear('doc_portarias_data', now()->year);
        }])->get()->map(function ($tipo) {
            return [
                'tipo' => $tipo->doc_tiposportaria_nome,
                'quantidade' => $tipo->portarias_count,
                'cor' => $this->getCorForTipo($tipo->doc_tiposportaria_nome)
            ];
        });

        return Inertia::render('Portarias/dashboard', [
            'stats' => [
                'totalPortarias' => [
                    'value' => $totalPortarias,
                    'change' => $portariasEsteMes > 0 ? "+{$portariasEsteMes} este mês" : "0 este mês"
                ],
                'servidoresAtivos' => [
                    'value' => $servidoresAtivos,
                    'change' => $novosServidoresEsteMes > 0 ? "+{$novosServidoresEsteMes} este mês" : "0 este mês"
                ],
                'portariasPendentes' => [
                    'value' => $portariasPendentes,
                    'change' => $portariasPendentesOntem > 0 ? "-{$portariasPendentesOntem} desde ontem" : "0 desde ontem"
                ],
                'processadasHoje' => [
                    'value' => $processadasHoje,
                    'change' => $processadasHoje > $processadasOntem ? "+" . ($processadasHoje - $processadasOntem) . " vs ontem" : "0 vs ontem"
                ]
            ],
            'portariasRecentes' => $portariasRecentes,
            'tiposPortariaStats' => $tiposPortariaStats
        ]);
    }

    // Exibe o formulário de cadastro rápido de pessoa/servidor
    public function cadastroPessoaServidorForm()
    {
        return Inertia::render('Portarias/CadastroPessoaServidor');
    }

    // Salva pessoa e servidor
    public function cadastroPessoaServidor(Request $request)
    {

        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'nome' => 'required|string|max:255',
                'cpf' => [
                    'required',
                    'string',
                    'max:14',
                    'unique:ger_pessoas,ger_pessoas_cpf',
                    function($attribute, $value, $fail) {
                        if (!preg_match('/^\d{11}$/', preg_replace('/[^0-9]/', '', $value))) {
                            $fail('O CPF deve conter exatamente 11 números.');
                        }
                    }
                ],
            ]);

            // Limpa o CPF para conter apenas números
            $cpfNumeros = preg_replace('/[^0-9]/', '', $validated['cpf']);

            // Cria pessoa
            $pessoa = new \App\Models\Pessoa();
            $pessoa->ger_pessoas_nome = $validated['nome'];
            $pessoa->ger_pessoas_cpf = $cpfNumeros;
            $pessoa->save();

            // Cria servidor vinculado à pessoa
            $servidor = new \App\Models\Servidores();
            $servidor->ger_pessoas_id = $pessoa->ger_pessoas_id;
            $servidor->save();

            DB::commit();
            return redirect()->back()->with('sucesso', 'Cadastro realizado com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('documentos.portarias.cadastro-servidor')->with('erro', 'Erro ao cadastrar: ' . $e->getMessage());
        }
    }

    public function proximoNumero(Request $request){
        $data = $request->input('data');
        try {
            $dataCarbon = \Carbon\Carbon::parse($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Data inválida'], 400);
        }
        $numeroFormatado = $this->formataProximoNumero($dataCarbon);
        // Redireciona para a rota de criação passando os parâmetros
        return response()->json([
            'next_numero_portaria' => $numeroFormatado,
            'data' => $dataCarbon->toDateString()
        ]);
    }

    private function getCorForTipo($tipo)
    {
        $cores = [
            'Nomeação' => 'bg-blue-500',
            'Designação' => 'bg-green-500',
            'Exoneração' => 'bg-red-500',
            'Aposentadoria' => 'bg-purple-500',
            'Licença' => 'bg-yellow-500'
        ];

        return $cores[$tipo] ?? 'bg-gray-500';
    }

    public function index(Request $request)
    {
        if ($request->hasHeader('X-Inertia')) {
            $search = $request->input('buscar');
            $sort = $request->input('sort');
            
            $direction = $request->input('direction', 'desc');
            $query = Portaria::query();

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('doc_portarias_servidor_nome', 'like', "%{$search}%")
                    ->orWhere('doc_portarias_servidor_cpf', 'like', "%{$search}%")
                    ->orWhere('doc_portarias_numero','like',"%{$search}%");
                });
            }

            // Permitir ordenação apenas por campos válidos
            $allowedSorts = ['doc_portarias_servidor_nome', 'doc_portarias_numero', 'adm_cargos_id', 'adm_secretarias_id'];
            
            $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

            if (!$sort) {
                // Ordenação padrão se sort estiver vazio
                $query->orderBy('doc_portarias_data', $direction)
                    ->orderBy('doc_portarias_numero', $direction);
            } else {
                // Validação do campo sort
                if (!in_array($sort, $allowedSorts)) {
                    $sort = 'doc_portarias_data';
                }
                $query->orderBy($sort, $direction);
            }

            $pessoas = $query->with(['cargo','secretaria'])->paginate(10)->withQueryString();

            // Se for requisição JSON (ag-grid), retorna apenas os dados e o total
            if (request()->wantsJson()) {
                return response()->json([
                    'data' => $pessoas->items(),
                    'total' => $pessoas->total(),
                ]);
            }
            return Inertia::render('Portarias/index2', [
            'pessoas' => $pessoas,
            'filters' => $request->only('buscar'),
        ]);
        }else{
            return Inertia::render('Portarias/index2', [
            'pessoas' => ['data' => [], 'last_page' => 0,'current_page' => 1],
            'filters' => $request->only('buscar'),
        ]);
        }
        

        
    }

    public function show(){

    }

    public function formataProximoNumero($data)
    {
        // Garantir que $data é um objeto Carbon
        if (!$data instanceof \Carbon\Carbon) {
            try {
                $data = \Carbon\Carbon::parse($data);
            } catch (\Exception $e) {
                return '';
            }
        }
        $qtdPortariasHoje = Portaria::whereDate('doc_portarias_data', $data)->where('doc_portarias_status', '!=', 'cancelado')->count();
        $proximoNumero = str_pad($qtdPortariasHoje + 1, 3, '0', STR_PAD_LEFT);
        $numeroFormatado = $proximoNumero . '.' . $data->format('d') . '.' . $data->format('m') . '/' . $data->format('Y');
        return $numeroFormatado;
    }

    public function create(Request $request)
    {
        //$servidores = Servidores::with('pessoa')->get();
        //$request->session()->flash('error', 'Oh no!');
        //return redirect()->route('dashboard')->with('sucesso','Operação realizada com sucesso!');
        $cargos = Cargo::all();
        $secretarias = Secretaria::all();
        $tipos = TipoPortaria::where('doc_tiposportaria_status', true)->get();
        
        if (!$request->has('data')) {
            $numeroFormatado = $this->formataProximoNumero($request->input('data', now()));
        }else{
            $numeroFormatado = $request->input('next_numero_portaria');
        }
        
        return Inertia::render('Portarias/criar', [
            //'servidores' => $servidores,
            'cargos' => $cargos,
            'secretarias' => $secretarias,
            'tipos' => $tipos,
            'next_numero_portaria' => $numeroFormatado
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'doc_portarias_numero' => 'required|string|max:255|unique:doc_portarias,doc_portarias_numero',
                'doc_portarias_servidor_nome' => 'required|string|max:255',
                'doc_portarias_servidor_cpf' => 'required|string|max:20',
                'doc_portarias_status' => 'required|string|max:30',
                'adm_servidores_id' => 'required|exists:adm_servidores,adm_servidores_id',
                'adm_cargos_id' => 'required|exists:adm_cargos,adm_cargos_id',
                'adm_secretarias_id' => 'required|exists:adm_secretarias,adm_secretarias_id',
                'doc_tiposportaria_id' => 'required|exists:doc_tiposportaria,doc_tiposportaria_id',
                'doc_portarias_data' => 'required|date',
                'doc_portarias_descricao' => 'nullable|string',
                'doc_portarias_link_documento' => 'nullable|string',
            ]);
            $validated['user_id'] = Auth::id();
            $portaria = Portaria::create($validated);

            // Gerar documento no Google Docs
            $user = Auth::user();
            // Buscar o templateId do tipo de portaria
            $tipoPortaria = TipoPortaria::find($portaria->doc_tiposportaria_id);
            $templateId = $tipoPortaria && $tipoPortaria->doc_tiposportaria_iddocumento ? $tipoPortaria->doc_tiposportaria_iddocumento : '1e_CAQ3B1dGyUwWbuA0HDtvaLr3QttSszCwvQc5PNuBU'; // fallback
            $dados = [
                'tipo' => optional($portaria->tipoPortaria)->doc_tiposportaria_nome ?? '',
                'nome' => $portaria->doc_portarias_servidor_nome,
                'cpf' => $portaria->doc_portarias_servidor_cpf,
                'cargo' => optional($portaria->cargo)->adm_cargos_nome ?? '',
                'secretaria' => optional($portaria->secretaria)->adm_secretarias_nome ?? '',
                'numero' => $portaria->doc_portarias_numero,
                'data' => $portaria->doc_portarias_data,
                'ano' => $portaria->doc_portarias_data->format('Y'),
                'mes' => $portaria->doc_portarias_data->translatedFormat('F'),
                'dia' => $portaria->doc_portarias_data->format('d'),
                'descricao' =>$portaria->doc_portarias_descricao,
                'mesupper' => strtoupper($portaria->doc_portarias_data->translatedFormat('F')),
                'diaLiteral' => $this->getDiaLiteral($portaria->doc_portarias_data),
                // Adicione outros campos se necessário
            ];
            try {
                $googleDocs = new GoogleDocsService($user->access_token, $user->refresh_token);
                $link = $googleDocs->gerarDocumentoPortaria($templateId, $dados);
                $portaria->update(['doc_portarias_link_documento' => $link]);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Usuario:'.$user->id.' Erro ao gerar documento Google Docs: ' . $e->getMessage());
                return redirect()->back()->with('erro', 'Erro ao gerar o documento da portaria. Nenhuma portaria foi salva. Detalhe: ' . $e->getMessage());
            }
            DB::commit();
            return redirect()->route('documentos.portarias.edit',$portaria->doc_portarias_id)
                ->with('sucesso', 'Portaria cadastrada com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('erro', 'Erro ao cadastrar portaria: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        $portaria = Portaria::with(['servidor.pessoa', 'cargo', 'secretaria', 'tipoPortaria', 'user'])->findOrFail($id);
    //    $servidores = Servidores::with('pessoa')->get();
        $cargos = Cargo::all();
        $secretarias = Secretaria::all();
        $tipos = TipoPortaria::where('doc_tiposportaria_status', true)->get();
        return Inertia::render('Portarias/criar', [
            'portaria' => $portaria,
            //'servidores' => $servidores,
            'cargos' => $cargos,
            'secretarias' => $secretarias,
            'tipos' => $tipos
        ]);
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'doc_portarias_servidor_nome' => 'required|string|max:255',
                'doc_portarias_servidor_cpf' => 'required|string|max:20',
                'doc_portarias_status' => 'required|string|max:30',
                'adm_servidores_id' => 'required|exists:adm_servidores,adm_servidores_id',
                'adm_cargos_id' => 'required|exists:adm_cargos,adm_cargos_id',
                'adm_secretarias_id' => 'required|exists:adm_secretarias,adm_secretarias_id',
                'doc_tiposportaria_id' => 'required|exists:doc_tiposportaria,doc_tiposportaria_id',
                'doc_portarias_data' => 'required|date',
                'doc_portarias_descricao' => 'nullable|string',
                'doc_portarias_link_documento' => 'nullable|string',
            ]);
            $validated['user_id'] = Auth::id();
            $portaria = Portaria::findOrFail($id);
            $portaria->update($validated);

            // Antes de criar o novo documento, excluir o antigo se existir
            if ($portaria->doc_portarias_link_documento) {
                try {
                    if (preg_match('/\/d\/([a-zA-Z0-9-_]+)/', $portaria->doc_portarias_link_documento, $matches)) {
                        $docId = $matches[1];
                        $user = Auth::user();
                        $googleDocs = new GoogleDocsService($user->access_token, $user->refresh_token);
                        $googleDocs->excluirDocumento($docId);
                    }
                } catch (\Exception $e) {
                    Log::error('Erro ao excluir Google Docs antigo (update): ' . $e->getMessage());
                }
            }
            $user = Auth::user();
            // Buscar o templateId do tipo de portaria
            $tipoPortaria = TipoPortaria::find($portaria->doc_tiposportaria_id);
            $templateId = $tipoPortaria && $tipoPortaria->doc_tiposportaria_iddocumento ? $tipoPortaria->doc_tiposportaria_iddocumento : '1D-wczn9PkD7QStim_NbHQ44yDhXiq9as4HI9em5gFfw'; // fallback
            $dados = [
                'tipo' => optional($portaria->tipoPortaria)->doc_tiposportaria_nome ?? '',
                'nome' => $portaria->doc_portarias_servidor_nome,
                'cpf' => $portaria->doc_portarias_servidor_cpf,
                'cargo' => optional($portaria->cargo)->adm_cargos_nome ?? '',
                'secretaria' => optional($portaria->secretaria)->adm_secretarias_nome ?? '',
                'numero' => $portaria->doc_portarias_numero,
                'data' => $portaria->doc_portarias_data,
                'ano' => $portaria->doc_portarias_data->format('Y'),
                'mes' => $portaria->doc_portarias_data->translatedFormat('F'),
                'dia' => $portaria->doc_portarias_data->format('d'),
                'descricao' =>$portaria->doc_portarias_descricao,
                'mesupper' => strtoupper($portaria->doc_portarias_data->translatedFormat('F')),
                'diaLiteral' => $this->getDiaLiteral($portaria->doc_portarias_data),
                // Adicione outros campos se necessário
            ];
            try {
                $googleDocs = new GoogleDocsService($user->access_token, $user->refresh_token);
                $link = $googleDocs->gerarDocumentoPortaria($templateId, $dados);
                $portaria->update(['doc_portarias_link_documento' => $link]);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Usuario:'.$user->id.' Erro ao gerar documento Google Docs (update): ' . $e->getMessage());
                return redirect()->back()->with('erro', 'Erro ao gerar o documento da portaria. Nenhuma alteração foi salva. Detalhe: ' . $e->getMessage());
            }
            DB::commit();
            return redirect()->route('documentos.portarias.index')
                ->with('sucesso', 'Portaria atualizada com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('erro', 'Erro ao atualizar portaria: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, $id)
    {
        $portaria = Portaria::findOrFail($id);
        $excluirGoogleDocs = $request->input('excluir_google_docs', false);
        $erroGoogle = false;
        $mensagemErroGoogle = '';
        if ($excluirGoogleDocs && $portaria->doc_portarias_link_documento) {
            try {
                // Extrair o ID do documento do link (assumindo padrão do Google Docs)
                if (preg_match('/\/d\/([a-zA-Z0-9-_]+)/', $portaria->doc_portarias_link_documento, $matches)) {
                    $docId = $matches[1];
                    $user = Auth::user();
                    $googleDocs = new GoogleDocsService($user->access_token, $user->refresh_token);
                    $googleDocs->excluirDocumento($docId);
                }
            } catch (\Exception $e) {
                $erroGoogle = true;
                $mensagemErroGoogle = $e->getMessage();
                Log::error('Erro ao excluir Google Docs: ' . $e->getMessage());
            }
        }
        $portaria->delete();
        if ($erroGoogle) {
            return redirect()->route('documentos.portarias.index')
                ->with('erro', 'Portaria excluída, mas houve erro ao excluir o arquivo do Google Docs: ' . $mensagemErroGoogle);
        }
        return redirect()->route('documentos.portarias.index')
            ->with('sucesso', 'Portaria excluída com sucesso!');
    }

    public function listaporservidor() {
        return Inertia::render('Portarias/listaporservidor', [
            'cargos' => Cargo::all()
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx',
        ]);
        

        //$mapping = json_decode($request->input('mapping', '{}'), true);
        //if (!is_array($mapping) || empty($mapping)) {
        //    return response()->json(['file' => 'Mapeamento de colunas inválido ou ausente.'], 422);
        //}

        try {
            $path = $request->file('file')->getRealPath();
            $data = Excel::toArray([], $path);
            $rows = $data[0] ?? [];
            $header = $rows[0] ?? [];
            unset($rows[0]);

            // Verifica se todos os campos obrigatórios do banco estão mapeados
            $required = [
                'numero', 'servidor_nome', 'servidor_cpf', 'status', 'servidores_id', 'cargos_id', 'secretarias_id', 'tiposportaria_id', 'data'
            ];
            //foreach ($required as $field) {
            //    if (empty($mapping[$field])) {
            //        return response()->json(['file' => "Campo obrigatório não mapeado: $field"], 422);
            //    }
            //}

            foreach ($rows as $row) {
                $rowAssoc = array_combine($header, $row);
                if (!$rowAssoc) continue;
                $portaria = Portaria::where('doc_portarias_numero', $rowAssoc['numero'])->first();
                if($portaria){
                    continue;
                }
                // Remover pontuações do CPF
                if (isset($rowAssoc['CPF'])) {
                    $rowAssoc['CPF'] = preg_replace('/[^0-9]/', '', $rowAssoc['CPF']);
                }
                $portariaData = Carbon::createFromFormat('Y-m-d', '1899-12-30')->addDays($rowAssoc['PortariaData']);

                // Buscar ou criar o cargo pelo nome
                $cargo = Cargo::where('adm_cargos_nome', $rowAssoc['Cargo'])->first();
                if (!$cargo) {
                    $cargo = Cargo::create([
                        'adm_cargos_nome' => $rowAssoc['Cargo'],
                        'adm_cargos_abreviacao' => '', // ou defina conforme necessário
                    ]);
                }
                $cargoId = $cargo->adm_cargos_id;
                
                $servidor = Servidores::with('pessoa')
                ->whereHas('pessoa',function($query) use ($rowAssoc){
                    $query->where('ger_pessoas_cpf', $rowAssoc['CPF']);
                })->first();
                if(!$servidor){
                    
                }
                try {
                    Portaria::create([
                        'doc_portarias_numero' => $rowAssoc['numero'],
                        'doc_portarias_servidor_nome' => $rowAssoc['Nome'],
                        'doc_portarias_servidor_cpf' => $rowAssoc['CPF'],
                        'doc_portarias_status' => 'publicado',
                        'adm_servidores_id' => $servidor->adm_servidores_id,
                        'adm_cargos_id' => $cargoId,
                        'adm_secretarias_id' => $rowAssoc['Secretaria'],
                        'doc_tiposportaria_id' => $rowAssoc['Tipo'],
                        'doc_portarias_data' => $portariaData,
                        // Remover uso de $mapping pois não está definido
                        'doc_portarias_descricao' => $rowAssoc['Descricao'],
                        'doc_portarias_link_documento' => $rowAssoc['LinkDocumento'],
                        'user_id' => Auth::id(),
                    ]);
                } catch (\Exception $e) {
                    Log::error('Erro ao importar portaria: '.$rowAssoc['numero'].' ' . $e->getMessage());
                }
            }
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['file' => 'Erro ao processar o arquivo: ' . $e->getMessage()], 422);
        }
    }

    // Função para retornar o dia por extenso no formato literal
    private function getDiaLiteral($data)
    {
        $dias = [
            'primeiro', 'dois dias', 'três dias', 'quatro dias',
            'cinco dias', 'seis dias', 'sete dias', 'oito dias',
            'nove dias', 'dez dias', 'onze dias', 'doze dias', 'treze dias','quatorze dias','quinze dias',
            'dezesseis dias','dezessete dias','dezoito dias','dezenove dias','vinte dias','vinte e um dias','vinte e dois dias',
            'vinte e três dias','vinte e quatro dias','vinte e cinco dias','vinte e seis dias','vinte e sete dias','vinte e oito dias',
            'vinte e nove dias','trinta dias','trinta e um dias'
        ];
        $diaIndex = date('j', strtotime($data)) - 1;
        return $dias[$diaIndex] ?? '';
    }
} 