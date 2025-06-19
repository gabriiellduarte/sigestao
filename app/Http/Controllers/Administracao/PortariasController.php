<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Cargo;
use App\Models\Pessoa;
use App\Models\Portaria;
use App\Models\Servidores;
use App\Models\TipoPortaria;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return Inertia::render('Portarias/index', [
            'cargos' => Cargo::all()
        ]);
    }
    public function show(){

    }
    public function create()
    {
        $servidores = Servidores::all();
        $tipos = TipoPortaria::where('doc_tiposportaria_status',true)->get();
        return Inertia::render('Portarias/criar',['tipos'=>$tipos]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'adm_argos_nome' => 'required|string|max:100',
            'adm_cargos_abreviacao' => 'required|string|max:100',
        ]);

        Cargo::create($validated);

        return redirect()->route('administracao.cargos.index')
            ->with('success', 'Cargo cadastrado com sucesso!');
    }

    public function edit(Cargo $cargo)
    {
        return Inertia::render('Administracao/Cargos/Edit', [
            'cargo' => $cargo
        ]);
    }

    public function update(Request $request, Cargo $cargo)
    {
        $validated = $request->validate([
            'adm_argos_nome' => 'required|string|max:100',
            'adm_cargos_abreviacao' => 'required|string|max:100',
        ]);

        $cargo->update($validated);

        return redirect()->route('administracao.cargos.index')
            ->with('success', 'Cargo atualizado com sucesso!');
    }

    public function destroy(Cargo $cargo)
    {
        $cargo->delete();

        return redirect()->route('administracao.cargos.index')
            ->with('success', 'Cargo excluído com sucesso!');
    }

    public function listaporservidor() {
        return Inertia::render('Portarias/listaporservidor', [
            'cargos' => Cargo::all()
        ]);
    }
} 