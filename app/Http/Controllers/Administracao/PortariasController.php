<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Cargo;
use App\Models\Pessoa;
use App\Models\Portaria;
use App\Models\Servidores;
use App\Models\TipoPortaria;
use App\Services\GoogleDocsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Secretaria;

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

    public function index()
    {
        $portarias = Portaria::with(['servidor.pessoa', 'cargo', 'secretaria', 'tipoPortaria', 'user'])
            ->orderByDesc('doc_portarias_data')
            ->paginate(10);

        return Inertia::render('Portarias/index', [
            'portarias' => $portarias
        ]);
    }

    public function show(){

    }

    public function create()
    {
        $servidores = Servidores::with('pessoa')->get();
        $cargos = Cargo::all();
        $secretarias = Secretaria::all();
        $tipos = TipoPortaria::where('doc_tiposportaria_status', true)->get();
        // Buscar a quantidade de portarias do dia
        $hoje = now();
        $qtdPortariasHoje = Portaria::whereDate('doc_portarias_data', $hoje->toDateString())->where('doc_portarias_status', '!=', 'cancelado')->count();
        $proximoNumero = str_pad($qtdPortariasHoje + 1, 3, '0', STR_PAD_LEFT);
        $numeroFormatado = $proximoNumero . '.' . $hoje->format('d') . '.' . $hoje->format('m') . '/' . $hoje->format('Y');
        
        return Inertia::render('Portarias/criar', [
            'servidores' => $servidores,
            'cargos' => $cargos,
            'secretarias' => $secretarias,
            'tipos' => $tipos,
            'next_numero_portaria' => $numeroFormatado
        ]);
    }

    public function store(Request $request)
    {
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
        $templateId = '1D-wczn9PkD7QStim_NbHQ44yDhXiq9as4HI9em5gFfw'; // ID do template
        $dados = [
            'tipo' => optional($portaria->tipoPortaria)->doc_tiposportaria_nome ?? '',
            'nome' => $portaria->doc_portarias_servidor_nome,
            'cpf' => $portaria->doc_portarias_servidor_cpf,
            'cargo' => optional($portaria->cargo)->adm_argos_nome ?? '',
            'secretaria' => optional($portaria->secretaria)->adm_secretarias_nome ?? '',
            'numero' => $portaria->doc_portarias_numero,
            'data' => $portaria->doc_portarias_data,
            // Adicione outros campos se necessário
        ];
        try {
            $googleDocs = new GoogleDocsService($user->access_token, $user->refresh_token);
            $link = $googleDocs->gerarDocumentoPortaria($templateId, $dados);
            $portaria->update(['doc_portarias_link_documento' => $link]);
        } catch (\Exception $e) {
            // Logar erro, mas não impedir o cadastro
            \Log::error('Usuario:'.$user->id.' Erro ao gerar documento Google Docs: ' . $e->getMessage());
        }

        return redirect()->route('documentos.portarias.index')
            ->with('success', 'Portaria cadastrada com sucesso!');
    }

    public function edit($id)
    {
        $portaria = Portaria::with(['servidor.pessoa', 'cargo', 'secretaria', 'tipoPortaria', 'user'])->findOrFail($id);
        $servidores = Servidores::with('pessoa')->get();
        $cargos = Cargo::all();
        $secretarias = Secretaria::all();
        $tipos = TipoPortaria::where('doc_tiposportaria_status', true)->get();
        return Inertia::render('Portarias/criar', [
            'portaria' => $portaria,
            'servidores' => $servidores,
            'cargos' => $cargos,
            'secretarias' => $secretarias,
            'tipos' => $tipos
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'doc_portarias_numero' => 'required|string|max:255',
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

        // Gerar documento no Google Docs após update
        $user = Auth::user();
        $templateId = '1D-wczn9PkD7QStim_NbHQ44yDhXiq9as4HI9em5gFfw'; // ID do template
        $dados = [
            'tipo' => optional($portaria->tipoPortaria)->doc_tiposportaria_nome ?? '',
            'nome' => $portaria->doc_portarias_servidor_nome,
            'cpf' => $portaria->doc_portarias_servidor_cpf,
            'cargo' => optional($portaria->cargo)->adm_argos_nome ?? '',
            'secretaria' => optional($portaria->secretaria)->adm_secretarias_nome ?? '',
            'numero' => $portaria->doc_portarias_numero,
            'data' => $portaria->doc_portarias_data,
            // Adicione outros campos se necessário
        ];
        try {
            $googleDocs = new GoogleDocsService($user->access_token, $user->refresh_token);
            $link = $googleDocs->gerarDocumentoPortaria($templateId, $dados);
            $portaria->update(['doc_portarias_link_documento' => $link]);
        } catch (\Exception $e) {
            \Log::error('Erro ao gerar documento Google Docs (update): ' . $e->getMessage());
        }

        return redirect()->route('documentos.portarias.index')
            ->with('success', 'Portaria atualizada com sucesso!');
    }

    public function destroy($id)
    {
        $portaria = Portaria::findOrFail($id);
        $portaria->delete();
        return redirect()->route('documentos.portarias.index')
            ->with('success', 'Portaria excluída com sucesso!');
    }

    public function listaporservidor() {
        return Inertia::render('Portarias/listaporservidor', [
            'cargos' => Cargo::all()
        ]);
    }
} 