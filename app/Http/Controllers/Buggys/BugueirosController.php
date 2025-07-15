<?php

namespace App\Http\Controllers\Buggys;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Buggys\Bugueiros;

class BugueirosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bugueiros = Bugueiros::all();

        

        return Inertia::render('Buggys/Bugueiros/Cadastro', [
            'bugueiros' => $bugueiros
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bugueiro_nome' => 'required|string|max:255',
            'bugueiro_nascimento' => 'required|date',
            'bugueiro_cpf' => 'required|string|max:11',
            'bugueiro_email' => 'nullable|email',
            'bugueiro_cor' => 'nullable|string|max:255',
            'bugueiro_contato' => 'nullable|string|max:255',
            'bugueiro_placa_buggy' => 'required|string|max:255',
            'bugueiro_status' => 'required|in:disponivel,em_passeio,adiantado,atrasado',
            'bugueiro_posicao_oficial' => 'required|integer',
            'bugueiro_posicao_atual' => 'nullable|integer',
            'bugueiro_fila_atrasos' => 'nullable|integer',
            'bugueiro_fila_adiantamentos' => 'nullable|integer',
        ]);
        $bugueiro = Bugueiros::create($validated);

        // Se for requisição JSON (ag-grid), retorna apenas os dados e o total
        if (request()->wantsJson()) {
            return response()->json([
                'data' => $bugueiro->items(),
                'total' => $bugueiro->total(),
            ]);
        }
        return redirect()->back()->with('sucesso', 'Bugueiro cadastrado com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $bugueiro = Bugueiros::findOrFail($id);
        return response()->json($bugueiro);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $bugueiro = Bugueiros::findOrFail($id);
        return Inertia::render('Buggys/Bugueiros/Cadastro', [
            'bugueiro' => $bugueiro
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'bugueiro_nome' => 'required|string|max:255',
            'bugueiro_nascimento' => 'required|date',
            'bugueiro_cpf' => 'required|string|max:11',
            'bugueiro_email' => 'nullable|email',
            'bugueiro_cor' => 'nullable|string|max:255',
            'bugueiro_contato' => 'nullable|string|max:255',
            'bugueiro_placa_buggy' => 'required|string|max:255',
            'bugueiro_status' => 'required|in:disponivel,em_passeio,adiantado,atrasado',
            'bugueiro_posicao_oficial' => 'required|integer',
            'bugueiro_posicao_atual' => 'nullable|integer',
            'bugueiro_fila_atrasos' => 'nullable|integer',
            'bugueiro_fila_adiantamentos' => 'nullable|integer',
        ]);
        $bugueiro = Bugueiros::findOrFail($id);
        $bugueiro->update($validated);
        return redirect()->back()->with('sucesso', 'Bugueiro atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $bugueiro = Bugueiros::findOrFail($id);
        $bugueiro->delete();
        return redirect()->back()->with('sucesso', 'Bugueiro removido com sucesso!');
    }
}
