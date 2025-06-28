<?php

namespace App\Http\Controllers\Regulacao;

use App\Http\Controllers\Controller;
use App\Models\Regulacao\RegMedico;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegMedicoController extends Controller
{
    public function index()
    {
        $medicos = RegMedico::orderBy('reg_med_nome')->paginate(15);
        return Inertia::render('regulacao/Medicos/Index', ['medicos' => $medicos]);
    }

    public function create()
    {
        return Inertia::render('regulacao/Medicos/Create');
    }

    public function store(Request $request)
    {
        $request->validate(['reg_med_nome' => 'required|string|max:255|unique:reg_medicos,reg_med_nome']);
        RegMedico::create($request->all());
        return redirect()->route('regulacao.medicos.index')->with('success', 'Médico criado com sucesso.');
    }

    public function edit(RegMedico $medico)
    {
        return Inertia::render('regulacao/Medicos/Edit', ['medico' => $medico]);
    }

    public function update(Request $request, RegMedico $medico)
    {
        $request->validate(['reg_med_nome' => 'required|string|max:255|unique:reg_medicos,reg_med_nome,' . $medico->reg_med_id . ',reg_med_id']);
        $medico->update($request->all());
        return redirect()->route('regulacao.medicos.index')->with('success', 'Médico atualizado com sucesso.');
    }

    public function destroy(RegMedico $medico)
    {
        $medico->delete();
        return redirect()->route('regulacao.medicos.index')->with('success', 'Médico excluído com sucesso.');
    }
} 