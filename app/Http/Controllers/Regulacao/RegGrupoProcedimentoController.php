<?php

namespace App\Http\Controllers\Regulacao;

use App\Http\Controllers\Controller;
use App\Models\Regulacao\RegGrupoProcedimento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegGrupoProcedimentoController extends Controller
{
    public function index()
    {
        $grupos = RegGrupoProcedimento::orderBy('reg_gpro_nome')->paginate(15);
        return Inertia::render('regulacao/GrupoProcedimentos/Index', ['grupos' => $grupos]);
    }

    public function create()
    {
        return Inertia::render('regulacao/GrupoProcedimentos/Create');
    }

    public function store(Request $request)
    {
        $request->validate(['reg_gpro_nome' => 'required|string|max:255|unique:reg_gprocedimentos,reg_gpro_nome']);
        RegGrupoProcedimento::create($request->all());
        return redirect()->route('regulacao.grupoprocedimentos.index')->with('success', 'Grupo de Procedimento criado com sucesso.');
    }

    public function edit(RegGrupoProcedimento $grupoprocedimento)
    {
        return Inertia::render('regulacao/GrupoProcedimentos/Edit', ['grupo' => $grupoprocedimento]);
    }

    public function update(Request $request, RegGrupoProcedimento $grupoprocedimento)
    {
        $request->validate(['reg_gpro_nome' => 'required|string|max:255|unique:reg_gprocedimentos,reg_gpro_nome,' . $grupoprocedimento->reg_gpro_id . ',reg_gpro_id']);
        $grupoprocedimento->update($request->all());
        return redirect()->route('regulacao.grupoprocedimentos.index')->with('success', 'Grupo de Procedimento atualizado com sucesso.');
    }

    public function destroy(RegGrupoProcedimento $grupoprocedimento)
    {
        if ($grupoprocedimento->procedimentos()->exists()) {
            return redirect()->route('regulacao.grupoprocedimentos.index')->with('error', 'Não é possível excluir. Existem procedimentos associados a este grupo.');
        }
        $grupoprocedimento->delete();
        return redirect()->route('regulacao.grupoprocedimentos.index')->with('success', 'Grupo de Procedimento excluído com sucesso.');
    }
} 