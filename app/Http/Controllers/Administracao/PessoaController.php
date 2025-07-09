<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Pessoa;
use App\Models\Localidade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PessoaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'ger_pessoas_nome');
        $direction = $request->input('direction', 'asc');
        $query = Pessoa::query()->limit(100);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('ger_pessoas_nome', 'like', "%{$search}%")
                  ->orWhere('ger_pessoas_cpf', 'like', "%{$search}%")
                  ->orWhere('ger_pessoas_cns', 'like', "%{$search}%");
            });
        }

        // Permitir ordenação apenas por campos válidos
        $allowedSorts = ['ger_pessoas_nome', 'ger_pessoas_cns', 'ger_pessoas_cpf', 'ger_pessoas_telefone1'];
        if (!in_array($sort, $allowedSorts)) {
            $sort = 'ger_pessoas_nome';
        }
        $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

        $pessoas = $query->with('localidade')->orderBy($sort, $direction)->paginate(10)->withQueryString();

        // Se for requisição JSON (ag-grid), retorna apenas os dados e o total
        if (request()->wantsJson()) {
            return response()->json([
                'data' => $pessoas->items(),
                'total' => $pessoas->total(),
            ]);
        }

        return Inertia::render('Administracao/Pessoas/Index', [
            'pessoas' => $pessoas,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Administracao/Pessoas/Create', [
            'localidades' => Localidade::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ger_pessoas_nome' => 'required|string|max:100',
            'ger_pessoas_cns' => 'nullable|string',
            'ger_pessoas_cpf' => 'required|string|max:11|unique:ger_pessoas',
            'ger_pessoas_telefone1' => 'nullable|string|max:15',
            'ger_pessoas_telefone2' => 'nullable|string|max:15',
            'ger_pessoas_nascimento' => 'nullable|date',
            'ger_pessoas_endereco' => 'nullable|string',
            'ger_pessoas_endereco_bairro' => 'nullable|string|max:255',
            'ger_pessoas_mae' => 'nullable|string|max:10',
            'ger_localidades_id' => 'nullable|integer|max:255'
        ], Pessoa::getValidationMessages());

        $pessoa = Pessoa::create($validated);

        // Se for uma requisição AJAX, retorna JSON
        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'pessoa' => $pessoa->only(['ger_pessoas_id', 'ger_pessoas_nome', 'ger_pessoas_cpf'])
            ]);
        }

        return redirect()->route('administracao.pessoas.index')
            ->with('sucesso', 'Pessoa cadastrada com sucesso!');
    }

    public function edit(Pessoa $pessoa)
    {
        return Inertia::render('Administracao/Pessoas/Edit', [
            'pessoa' => $pessoa->load('localidade'),
            'localidades' => Localidade::all()
        ]);
    }

    public function update(Request $request, Pessoa $pessoa)
    {
        $validated = $request->validate([
            'ger_pessoas_nome' => 'required|string|max:100',
            'ger_pessoas_cpf' => 'required|string|max:11|unique:ger_pessoas,ger_pessoas_cpf,'.$pessoa->ger_pessoas_id.',ger_pessoas_id',
            'ger_pessoas_cns' => 'nullable|string|max:15|unique:ger_pessoas,ger_pessoas_cns,'.$pessoa->ger_pessoas_id.',ger_pessoas_id',
            'ger_pessoas_telefone1' => 'nullable|string|max:15',
            'ger_pessoas_telefone2' => 'nullable|string|max:15',
            'ger_pessoas_nascimento' => 'nullable|date',
            'ger_pessoas_endereco' => 'nullable|string',
            'ger_pessoas_endereco_n' => 'nullable',
            'ger_pessoas_endereco_bairro' => 'nullable|string|max:255',
            'ger_pessoas_mae' => 'nullable|string|max:10',
            'ger_localidades_id' => 'nullable|integer|max:255'
        ]);

        $pessoa->update($validated);

        return redirect()->route('administracao.pessoas.index')
            ->with('sucesso', 'Pessoa atualizada com sucesso!');
    }

    public function destroy(Pessoa $pessoa)
    {
        $pessoa->delete();

        return redirect()->route('administracao.pessoas.index')
            ->with('sucesso', 'Pessoa excluída com sucesso!');
    }

    public function search(Request $request)
    {
        $term = $request->get('term');
        $id = $request->get('id');
        
        if ($id) {
            // Busca por ID específico
            $pessoa = Pessoa::where('ger_pessoas_id', $id)
                ->get(['ger_pessoas_id', 'ger_pessoas_nome', 'ger_pessoas_cpf']);
            return response()->json($pessoa);
        }
        
        if ($term) {
            // Busca por termo (nome ou CPF)
            $pessoas = Pessoa::where('ger_pessoas_nome', 'like', "%{$term}%")
                ->orWhere('ger_pessoas_cpf', 'like', "%{$term}%")
                ->limit(10)
                ->get(['ger_pessoas_id', 'ger_pessoas_nome', 'ger_pessoas_cpf']);
            return response()->json($pessoas);
        }
        
        return response()->json([]);
    }
} 