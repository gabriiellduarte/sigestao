<?php

namespace App\Http\Controllers\Buggys;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Buggys\Passeio;
use Inertia\Inertia;

class PasseiosController extends Controller
{
    public function index()
    {
        $passeios = Passeio::all();
        return Inertia::render('Buggys/Passeios/Cadastro', [
            'passeios' => $passeios
        ]);
    }

    

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bugueiro_id' => 'required|integer',
            'bugueiro_nome' => 'required|string',
            'tipoPasseio' => 'required|in:normal,cortesia,parceria',
            'data_hora' => 'required|date',
            'duracao' => 'required|numeric',
            'valor' => 'required|numeric',
            'parceiro' => 'nullable|string',
            'bug_passeios' => 'nullable|numeric',
            'observacoes' => 'nullable|string',
        ]);
        $passeio = Passeio::create($validated);
        return redirect()->route('bugueiros.passeios.index')->with('sucesso','Passeio cadastrado com sucesso!');
    }

    public function update(Request $request, $id)
    {
        $passeio = Passeio::findOrFail($id);
        $validated = $request->validate([
            'bugueiro_id' => 'required|integer',
            'bugueiro_nome' => 'required|string',
            'nome_passeio'=>'required|string',
            'tipoPasseio' => 'required|in:normal,cortesia,parceria',
            'data_hora' => 'required|date',
            'duracao' => 'required|numeric',
            'valor' => 'required|numeric',
            'parceiro' => 'nullable|string',
            'bug_passeios' => 'nullable|numeric',
            'observacoes' => 'nullable|string',
        ]);
        $passeio->update($validated);
        return redirect()->route('bugueiros.passeios.index')->with('sucesso','Passeio atualizado com sucesso!');
    }
    public function show(){

    }

    public function destroy($id)
    {
        $passeio = Passeio::findOrFail($id);
        $passeio->delete();
        return redirect()->route('bugueiros.passeios.index')->with('sucesso','Passeio apagado com sucesso!');
    }
}
