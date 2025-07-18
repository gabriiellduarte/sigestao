<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\Parceiro;
use Inertia\Inertia;

class ParceirosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $parceiros = Parceiro::all();
        return Inertia::render('Buggys/Parceiros/Cadastro', [
            'parceiros' => $parceiros,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Administracao/Parceiros/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $validated = $request->validate([
                'nome' => 'required|string|max:255',
                'contato' => 'nullable|string|max:255',
            ]);
            $parceiro = Parceiro::create($validated);
            return redirect()->route('bugueiros.parceiros.index')->with('sucesso', 'Parceiro cadastrado com sucesso!');

        }catch(Exception $e){
            return redirect()->route('bugueiros.parceiros.index')->with('erro', 'Erro ao cadastrar parceiro.');
        }
        
        
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $parceiro = Parceiro::findOrFail($id);
        return response()->json($parceiro);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $parceiro = Parceiro::findOrFail($id);
        return Inertia::render('Administracao/Parceiros/Edit', [
            'parceiro' => $parceiro,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $parceiro = Parceiro::findOrFail($id);
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'contato' => 'nullable|string|max:255',
        ]);
        $parceiro->update($validated);
        return redirect()->route('bugueiros.parceiros.index')->with('successo', 'Parceiro atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $parceiro = Parceiro::findOrFail($id);
        $parceiro->delete();
        return redirect()->route('bugueiros.parceiros.index')->with('successo', 'Parceiro removido com sucesso!');
    }
}
