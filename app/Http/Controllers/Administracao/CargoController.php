<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Cargo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CargoController extends Controller
{
    public function index()
    {
        return Inertia::render('Administracao/Cargos/Index', [
            'cargos' => Cargo::all()
        ]);
    }

    public function create()
    {
        return Inertia::render('Administracao/Cargos/Create');
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
} 