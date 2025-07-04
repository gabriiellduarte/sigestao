<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Servidores;
use App\Models\Pessoa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServidoresController extends Controller
{
    public function index()
    {
        // Buscar todos os servidores com dados da pessoa relacionada
        $servidores = Servidores::with('pessoa')->get();

        return Inertia::render('Administracao/Servidores/index', [
            'servidores' => $servidores
        ]);
    }

    public function create()
    {
        $pessoas = Pessoa::all();
        return Inertia::render('Administracao/Servidores/criar', [
            'pessoas' => $pessoas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ger_pessoas_id' => 'required|exists:ger_pessoas,ger_pessoas_id',
        ]);

        Servidores::create($validated);

        return redirect()->route('administracao.servidores.index')
            ->with('sucesso', 'Servidor cadastrado com sucesso!');
    }

    public function edit($id)
    {
        $servidor = Servidores::with('pessoa')->findOrFail($id);
        $pessoas = Pessoa::all();
        return Inertia::render('Administracao/Servidores/criar', [
            'servidor' => $servidor,
            'pessoas' => $pessoas
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'ger_pessoas_id' => 'required|exists:ger_pessoas,ger_pessoas_id',
        ]);

        $servidor = Servidores::findOrFail($id);
        $servidor->update($validated);

        return redirect()->route('administracao.servidores.index')
            ->with('sucesso', 'Servidor atualizado com sucesso!');
    }

    public function destroy($id)
    {
        $servidor = Servidores::findOrFail($id);
        $servidor->delete();
        return redirect()->route('administracao.servidores.index')
            ->with('sucesso', 'Servidor excluído com sucesso!');
    }

    public function search(Request $request)
    {
        $term = $request->input('term');
        $query = Servidores::with('pessoa');
        if ($term) {
            $query->whereHas('pessoa', function ($q) use ($term) {
                $q->where('ger_pessoas_nome', 'like', "%$term%")
                  ->orWhere('ger_pessoas_cpf', 'like', "%$term%") ;
            });
        }
        $servidores = $query->limit(20)->get();
        $result = $servidores->map(function ($servidor) {
            return [
                'adm_servidores_id' => $servidor->adm_servidores_id,
                'ger_pessoas_nome' => $servidor->pessoa->ger_pessoas_nome,
                'ger_pessoas_cpf' => $servidor->pessoa->ger_pessoas_cpf,
            ];
        });
        return response()->json($result);
    }
}
