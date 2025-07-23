<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Servidores;
use App\Models\Pessoa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServidoresController extends Controller
{
    public function index(Request $request)
    {

        $search = $request->input('buscar');
        $sort = $request->input('sort', 'adm_servidores_id');
        
        $direction = $request->input('direction', 'asc');
        $query = Servidores::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('pessoa.ger_pessoas_nome', 'like', "%{$search}%")
                  ->orWhere('pessoa.ger_pessoas_cpf', 'like', "%{$search}%");
            });
        }

        // Permitir ordenação apenas por campos válidos
        $allowedSorts = ['pessoa.ger_pessoas_nome', 'pessoa.ger_pessoas_cpf'];
        if (!in_array($sort, $allowedSorts)) {
            $sort = 'adm_servidores_id';
        }
        $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

        $pessoas = $query->with(    'pessoa')->orderBy($sort, $direction)->paginate(10)->withQueryString();

        // Se for requisição JSON (ag-grid), retorna apenas os dados e o total
        if (request()->wantsJson()) {
            return response()->json([
                'data' => $pessoas->items(),
                'total' => $pessoas->total(),
            ]);
        }

        return Inertia::render('Administracao/Servidores/index', [
            'servidores' => $pessoas,
            'filters' => $request->only('buscar'),
        ]);


        // Buscar todos os servidores com dados da pessoa relacionada
        $servidores = Servidores::with('pessoa')->limit(10)->get();

        return Inertia::render('Administracao/Servidores/index', [
            'servidores' => $servidores
        ]);
    }

    public function create()
    {
        $pessoas = Pessoa::all();
        return Inertia::render('Administracao/Servidores/criar', [
            'pessoas' => $pessoas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ger_pessoas_id' => 'required|exists:ger_pessoas,ger_pessoas_id',
        ]);

        Servidores::create($validated);

        return redirect()->route('administracao.servidores.index')
            ->with('sucesso', 'Servidor cadastrado com sucesso!');
    }

    public function edit($id)
    {
        $servidor = Servidores::with('pessoa')->findOrFail($id);
        $pessoas = Pessoa::all();
        return Inertia::render('Administracao/Servidores/criar', [
            'servidor' => $servidor,
            'pessoas' => $pessoas
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'ger_pessoas_id' => 'required|exists:ger_pessoas,ger_pessoas_id',
        ]);

        $servidor = Servidores::findOrFail($id);
        $servidor->update($validated);

        return redirect()->route('administracao.servidores.index')
            ->with('sucesso', 'Servidor atualizado com sucesso!');
    }

    public function destroy($id)
    {
        $servidor = Servidores::findOrFail($id);
        $servidor->delete();
        return redirect()->route('administracao.servidores.index')
            ->with('sucesso', 'Servidor excluído com sucesso!');
    }

    public function search(Request $request)
    {
        $term = $request->input('term');
        $query = Servidores::with('pessoa');
        if ($term) {
            $query->whereHas('pessoa', function ($q) use ($term) {
                $q->where('ger_pessoas_nome', 'like', "%$term%")
                  ->orWhere('ger_pessoas_cpf', 'like', "%$term%") ;
            });
        }
        $servidores = $query->limit(20)->get();
        $result = $servidores->map(function ($servidor) {
            return [
                'adm_servidores_id' => $servidor->adm_servidores_id,
                'ger_pessoas_nome' => $servidor->pessoa->ger_pessoas_nome,
                'ger_pessoas_cpf' => $servidor->pessoa->ger_pessoas_cpf,
            ];
        });
        return response()->json($result);
    }
}
