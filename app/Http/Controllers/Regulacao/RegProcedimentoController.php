<?php

namespace App\Http\Controllers\Regulacao;

use App\Http\Controllers\Controller;
use App\Models\Regulacao\RegProcedimento;
use App\Models\Regulacao\RegGrupoProcedimento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegProcedimentoController extends Controller
{
    public function index()
    {
        $procedimentos = RegProcedimento::with('grupoProcedimento')->orderBy('reg_proc_nome')->paginate(15);
        return Inertia::render('regulacao/Procedimentos/Index', ['procedimentos' => $procedimentos]);
    }

    public function create()
    {
        $grupos = RegGrupoProcedimento::orderBy('reg_gpro_nome')->get();
        return Inertia::render('regulacao/Procedimentos/Create', ['grupos' => $grupos]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'reg_proc_nome' => 'required|string|max:255',
            'reg_gpro_id' => 'required|exists:reg_gprocedimentos,reg_gpro_id'
        ]);
        RegProcedimento::create($request->all());
        return redirect()->route('regulacao.procedimentos.index')->with('success', 'Procedimento criado com sucesso.');
    }

    public function edit(RegProcedimento $procedimento)
    {
        $grupos = RegGrupoProcedimento::orderBy('reg_gpro_nome')->get();
        return Inertia::render('regulacao/Procedimentos/Edit', [
            'procedimento' => $procedimento,
            'grupos' => $grupos
        ]);
    }

    public function update(Request $request, RegProcedimento $procedimento)
    {
        $request->validate([
            'reg_proc_nome' => 'required|string|max:255',
            'reg_gpro_id' => 'required|exists:reg_gprocedimentos,reg_gpro_id'
        ]);
        $procedimento->update($request->all());
        return redirect()->route('regulacao.procedimentos.index')->with('success', 'Procedimento atualizado com sucesso.');
    }

    public function destroy(RegProcedimento $procedimento)
    {
        $procedimento->delete();
        return redirect()->route('regulacao.procedimentos.index')->with('success', 'Procedimento excluído com sucesso.');
    }
} 