<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Pessoa;
use App\Models\Localidade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PessoaController extends Controller
{
    public function index()
    {
        return Inertia::render('Administracao/Pessoas/Index', [
            'pessoas' => Pessoa::with('localidade')->get()
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
            'ger_pessoas_cns' => 'required|string|max:15|unique:ger_pessoas',
            'ger_pessoas_cpf' => 'required|string|max:11|unique:ger_pessoas',
            'ger_pessoas_telefone1' => 'required|string|max:15',
            'ger_pessoas_telefone2' => 'required|string|max:15',
            'ger_pessoas_nascimento' => 'required|date',
            'ger_pessoas_endereco' => 'required|string',
            'ger_pessoas_endereco_bairro' => 'required|string|max:255',
            'ger_pessoas_mae' => 'required|string|max:10',
            'ger_localidades_id' => 'nullable|integer|max:255'
        ]);

        Pessoa::create($validated);

        return redirect()->route('administracao.pessoas.index')
            ->with('success', 'Pessoa cadastrada com sucesso!');
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
            'ger_pessoas_cns' => 'required|string|max:15|unique:ger_pessoas,ger_pessoas_cns,'.$pessoa->ger_pessoas_id.',ger_pessoas_id',
            'ger_pessoas_telefone1' => 'required|string|max:15',
            'ger_pessoas_telefone2' => 'required|string|max:15',
            'ger_pessoas_nascimento' => 'required|date',
            'ger_pessoas_endereco' => 'required|string',
            'ger_pessoas_endereco_n' => 'required',
            'ger_pessoas_endereco_bairro' => 'required|string|max:255',
            'ger_pessoas_mae' => 'required|string|max:10',
            'ger_localidades_id' => 'nullable|integer|max:255'
        ]);

        $pessoa->update($validated);

        return redirect()->route('administracao.pessoas.index')
            ->with('success', 'Pessoa atualizada com sucesso!');
    }

    public function destroy(Pessoa $pessoa)
    {
        $pessoa->delete();

        return redirect()->route('administracao.pessoas.index')
            ->with('success', 'Pessoa excluída com sucesso!');
    }
} 