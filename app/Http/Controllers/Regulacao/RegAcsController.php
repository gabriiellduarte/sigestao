<?php

namespace App\Http\Controllers\Regulacao;

use App\Http\Controllers\Controller;
use App\Models\Regulacao\RegAcs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegAcsController extends Controller
{
    public function index()
    {
        $acs = RegAcs::orderBy('reg_acs_nome')->paginate(15);
        return Inertia::render('regulacao/Acs/Index', ['acs' => $acs]);
    }

    public function create()
    {
        return Inertia::render('regulacao/Acs/Create');
    }

    public function store(Request $request)
    {
        $request->validate(['reg_acs_nome' => 'required|string|max:255|unique:reg_acs,reg_acs_nome']);
        RegAcs::create($request->all());
        return redirect()->route('regulacao.acs.index')->with('success', 'ACS criado com sucesso.');
    }

    public function edit(RegAcs $ac)
    {
        return Inertia::render('regulacao/Acs/Edit', ['ac' => $ac]);
    }

    public function update(Request $request, RegAcs $ac)
    {
        $request->validate(['reg_acs_nome' => 'required|string|max:255|unique:reg_acs,reg_acs_nome,' . $ac->reg_acs_id . ',reg_acs_id']);
        $ac->update($request->all());
        return redirect()->route('regulacao.acs.index')->with('success', 'ACS atualizado com sucesso.');
    }

    public function destroy(RegAcs $ac)
    {
        $ac->delete();
        return redirect()->route('regulacao.acs.index')->with('success', 'ACS excluído com sucesso.');
    }
} 