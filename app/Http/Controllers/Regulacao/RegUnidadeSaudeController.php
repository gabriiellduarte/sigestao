<?php

namespace App\Http\Controllers\Regulacao;

use App\Http\Controllers\Controller;
use App\Models\Regulacao\RegUnidadeSaude;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegUnidadeSaudeController extends Controller
{
    public function index()
    {
        $unidades = RegUnidadeSaude::orderBy('reg_uni_nome')->paginate(15);
        return Inertia::render('regulacao/UnidadesSaude/Index', ['unidades' => $unidades]);
    }

    public function create()
    {
        return Inertia::render('regulacao/UnidadesSaude/Create');
    }

    public function store(Request $request)
    {
        $request->validate(['reg_uni_nome' => 'required|string|max:255|unique:reg_unidadessaude,reg_uni_nome']);
        RegUnidadeSaude::create($request->all());
        return redirect()->route('regulacao.unidadessaude.index')->with('success', 'Unidade de Saúde criada com sucesso.');
    }

    public function edit(RegUnidadeSaude $unidadessaude)
    {
        return Inertia::render('regulacao/UnidadesSaude/Edit', ['unidade' => $unidadessaude]);
    }

    public function update(Request $request, RegUnidadeSaude $unidadessaude)
    {
        $request->validate(['reg_uni_nome' => 'required|string|max:255|unique:reg_unidadessaude,reg_uni_nome,' . $unidadessaude->reg_uni_id . ',reg_uni_id']);
        $unidadessaude->update($request->all());
        return redirect()->route('regulacao.unidadessaude.index')->with('success', 'Unidade de Saúde atualizada com sucesso.');
    }

    public function destroy(RegUnidadeSaude $unidadessaude)
    {
        $unidadessaude->delete();
        return redirect()->route('regulacao.unidadessaude.index')->with('success', 'Unidade de Saúde excluída com sucesso.');
    }
} 