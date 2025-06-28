<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Secretaria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SecretariaController extends Controller
{
    public function index()
    {
        return Inertia::render('Administracao/Secretarias/Index', [
            'secretarias' => Secretaria::all()
        ]);
    }

    public function create()
    {
        return Inertia::render('Administracao/Secretarias/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'adm_secretarias_nome' => 'required|string|max:255',
            'adm_secretarias_status' => 'required|boolean',
        ]);

        Secretaria::create($validated);

        return redirect()->route('administracao.secretarias.index')
            ->with('success', 'Secretaria cadastrada com sucesso!');
    }

    public function edit(Secretaria $secretaria)
    {
        return Inertia::render('Administracao/Secretarias/Edit', [
            'secretaria' => $secretaria
        ]);
    }

    public function update(Request $request, Secretaria $secretaria)
    {
        $validated = $request->validate([
            'adm_secretarias_nome' => 'required|string|max:255',
            'adm_secretarias_status' => 'required|boolean'
        ]);

        $secretaria->update($validated);

        return redirect()->route('administracao.secretarias.index')
            ->with('success', 'Secretaria atualizada com sucesso!');
    }

    public function destroy(Secretaria $secretaria)
    {
        $secretaria->delete();

        return redirect()->route('administracao.secretarias.index')
            ->with('success', 'Secretaria excluída com sucesso!');
    }
} 