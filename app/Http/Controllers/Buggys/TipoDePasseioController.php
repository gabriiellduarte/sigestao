<?php

namespace App\Http\Controllers\Buggys;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Buggys\TipoPasseio;
use Inertia\Inertia;

class TipoDePasseioController extends Controller
{
    public function index()
    {
        $tiposPasseio = TipoPasseio::all();
        return Inertia::render('Buggys/Passeios/TipodePasseio/Cadastro', [
            'tiposPasseios' => $tiposPasseio
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'duracao' => 'required|numeric',
            'preco' => 'required|numeric',
            'ativo' => 'required|boolean',
        ]);
        $tipo = TipoPasseio::create($validated);
        return redirect()->route('bugueiros.tipodepasseio.index')->with('sucesso', 'Tipo de passeio cadastrado com sucesso.');
    }

    public function update(Request $request, $id)
    {
        $tipo = TipoPasseio::findOrFail($id);
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'duracao' => 'required|numeric',
            'preco' => 'required|numeric',
            'ativo' => 'required|boolean',
        ]);
        $tipo->update($validated);
        return redirect()->route('bugueiros.tipodepasseio.index')->with('sucesso', 'Tipo de passeio atualizado com sucesso.');
    }

    public function destroy($id)
    {
        $tipo = TipoPasseio::findOrFail($id);
        $tipo->delete();
        return redirect()->route('bugueiros.tipodepasseio.index')->with('sucesso', 'Tipo de passeio excluído com sucesso.');

    }
}
