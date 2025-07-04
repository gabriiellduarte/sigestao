<?php

namespace App\Http\Controllers;

use App\Models\TipoPortaria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class TipoPortariaController extends Controller
{
    public function index()
    {
        $tiposPortaria = TipoPortaria::orderBy('doc_tiposportaria_nome')->get();
        
        return Inertia::render('Documentos/TiposPortaria/Index', [
            'tiposPortaria' => $tiposPortaria
        ]);
    }

    public function create()
    {   
        return Inertia::render('Documentos/TiposPortaria/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'doc_tiposportaria_nome' => 'required|string',
            'doc_tiposportaria_status' => 'boolean',
            'doc_tiposportaria_iddocumento' => 'string',
        ]);

        TipoPortaria::create([
            'doc_tiposportaria_nome' => $request->doc_tiposportaria_nome,
            'doc_tiposportaria_status' => $request->doc_tiposportaria_status ?? true,
            'doc_tiposportaria_iddocumento' => $request->doc_tiposportaria_iddocumento,
        ]);

        return redirect()->route('documentos.tiposdeportaria.index')
            ->with('sucesso', 'Tipo de portaria criado com sucesso!');
    }

    public function edit($id)
    {
        $tipoPortaria = TipoPortaria::findOrFail($id);
        return Inertia::render('Documentos/TiposPortaria/Edit', [
            'tipoPortaria' => $tipoPortaria
        ]);
    }

    public function update(Request $request, $id)
    {
        $tipoportaria = TipoPortaria::find($id);
        $request->validate([
            'doc_tiposportaria_nome' => [
                'required',
                'string',
                'max:255',
                Rule::unique('doc_tiposportaria', 'doc_tiposportaria_nome')->ignore($id, 'doc_tiposportaria_id'),
            ],
            'doc_tiposportaria_status' => 'boolean',
            'doc_tiposportaria_iddocumento' => 'string',
        ]);

        $tipoportaria->update([
            'doc_tiposportaria_nome' => $request->doc_tiposportaria_nome,
            'doc_tiposportaria_status' => $request->doc_tiposportaria_status,
            'doc_tiposportaria_iddocumento' => $request->doc_tiposportaria_iddocumento,
        ]);

        return redirect()->route('documentos.tiposdeportaria.index')
            ->with('sucesso', 'Tipo de portaria atualizado com sucesso!');
    }

    public function destroy(TipoPortaria $tipoPortaria)
    {
        // Verificar se há portarias usando este tipo
        if ($tipoPortaria->portarias()->count() > 0) {
            return back()->with('erro', 'Não é possível excluir este tipo de portaria pois existem portarias vinculadas a ele.');
        }

        $tipoPortaria->delete();

        return redirect()->route('documentos.tiposdeportaria.index')
            ->with('sucesso', 'Tipo de portaria excluído com sucesso!');
    }
} 