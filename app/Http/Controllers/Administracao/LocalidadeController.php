<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Localidade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocalidadeController extends Controller
{
    public function index()
    {
        $localidades = Localidade::query()
            ->when(request('search'), function($query, $search) {
                $query->where('nome', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Administracao/Localidades/Index', [
            'localidades' => $localidades,
            'filters' => request()->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Administracao/Localidades/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ger_localidades_nome' => 'required|string',
            'ativo' => 'boolean'
        ]);

        Localidade::create($validated);

        return redirect()->route('administracao.localidades.index')
            ->with('sucesso', 'Localidade criada com sucesso.');
    }

    public function edit(Localidade $localidade)
    {
        return Inertia::render('Administracao/Localidades/Edit', [
            'localidade' => $localidade
        ]);
    }

    public function update(Request $request, Localidade $localidade)
    {
        $validated = $request->validate([
            'ger_localidades_nome' => 'required|string',
            'ativo' => 'boolean'
        ]);

        $localidade->update($validated);

        return redirect()->route('administracao.localidades.index')
            ->with('sucesso', 'Localidade atualizada com sucesso.');
    }

    public function destroy(Localidade $localidade)
    {
        $localidade->delete();

        return redirect()->route('administracao.localidades.index')
            ->with('sucesso', 'Localidade excluída com sucesso.');
    }
} 