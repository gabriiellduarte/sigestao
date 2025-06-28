<?php

namespace App\Http\Controllers\Regulacao;

use App\Http\Controllers\Controller;
use App\Models\Regulacao\RegTipoAtendimento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegTipoAtendimentoController extends Controller
{
    public function index()
    {
        $tipos = RegTipoAtendimento::orderBy('reg_tipo_peso')->paginate(15);
        return Inertia::render('regulacao/TiposAtendimento/Index', ['tipos' => $tipos]);
    }

    public function create()
    {
        return Inertia::render('regulacao/TiposAtendimento/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'reg_tipo_nome' => 'required|string|max:255',
            'reg_tipo_peso' => 'required|integer'
        ]);
        RegTipoAtendimento::create($request->all());
        return redirect()->route('regulacao.tiposatendimento.index')->with('success', 'Tipo de Atendimento criado com sucesso.');
    }

    public function edit(RegTipoAtendimento $tiposatendimento)
    {
        return Inertia::render('regulacao/TiposAtendimento/Edit', ['tipo' => $tiposatendimento]);
    }

    public function update(Request $request, RegTipoAtendimento $tiposatendimento)
    {
        $request->validate([
            'reg_tipo_nome' => 'required|string|max:255',
            'reg_tipo_peso' => 'required|integer'
        ]);
        $tiposatendimento->update($request->all());
        return redirect()->route('regulacao.tiposatendimento.index')->with('success', 'Tipo de Atendimento atualizado com sucesso.');
    }

    public function destroy(RegTipoAtendimento $tiposatendimento)
    {
        $tiposatendimento->delete();
        return redirect()->route('regulacao.tiposatendimento.index')->with('success', 'Tipo de Atendimento excluído com sucesso.');
    }
} 