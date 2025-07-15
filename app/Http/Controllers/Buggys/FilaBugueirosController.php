<?php
namespace App\Http\Controllers\Buggys;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Buggys\Filas;
use App\Models\Buggys\Bugueiros;
use App\Models\Buggys\FilaBugueiro;

class FilaBugueirosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $props = [];
        // Busca fila aberta
        $fila = Filas::where('fila_status', 'aberta')->with('bugueirosFila')->first();
        $bugueiros = FilaBugueiro::where('fila_id', $fila->fila_id)->with('bugueiro')->orderBy('posicao_fila')->get();
        // Se não existir, cria uma nova
        if (!$fila) {
            $fila = Filas::create([
                'fila_data' => now(),
                'fila_qntd_normal' => 0,
                'fila_qntd_adiantados' => 0,
                'fila_qntd_atrasados' => 0,
                'fila_obs' => null,
                'fila_status' => 'aberta',
            ]);
            $bugueiros = [];
        }else{

        }
        return Inertia::render('Buggys/Fila/Lista', [
            'bugueiros_fila' => $bugueiros,
            'fila_id'=>$fila->fila_id,
            'fila_status'=>$fila->fila_status
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
            'fila_data' => 'required|date',
            'fila_qntd_normal' => 'required|integer',
            'fila_qntd_adiantados' => 'required|integer',
            'fila_qntd_atrasados' => 'required|integer',
            'fila_obs' => 'nullable|string',
            'fila_status' => 'required|in:cancelada,finalizada,aberta',
        ]);
        $fila = Filas::create($validated);
        return response()->json($fila, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $fila = Filas::with('bugueiros')->findOrFail($id);
        return response()->json($fila);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $fila = Filas::findOrFail($id);
        $validated = $request->validate([
            'fila_data' => 'sometimes|date',
            'fila_qntd_normal' => 'sometimes|integer',
            'fila_qntd_adiantados' => 'sometimes|integer',
            'fila_qntd_atrasados' => 'sometimes|integer',
            'fila_obs' => 'nullable|string',
            'fila_status' => 'sometimes|in:cancelada,finalizada,aberta',
        ]);
        $fila->update($validated);
        return response()->json($fila);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $fila = Filas::findOrFail($id);
        $fila->delete();
        return response()->json(['message' => 'Fila deletada com sucesso.']);
    }

    // Listar bugueiros de uma fila específica (com dados da pivô)
    public function bugueiros($fila_id)
    {
        $fila = Filas::with(['bugueiros'])->findOrFail($fila_id);
        return response()->json($fila->bugueiros);
    }

    // Página principal da fila (Inertia)
    public function lista($fila_id)
    {
        $fila = FilaBugueiro::with('bugueiro')
            ->where('fila_id', $fila_id)
            ->orderBy('posicao_fila')
            ->get();
        $bugueirosDisponiveis = Bugueiros::where('bugueiro_status', 'disponivel')->get()
            ->map(fn($b) => [
                'id' => $b->bugueiro_id,
                'nome' => $b->bugueiro_nome,
                'telefone' => $b->bugueiro_contato,
                'status' => $b->bugueiro_status,
            ]);
        $filaModel = Filas::find($fila_id);
        $statusFila = $filaModel ? $filaModel->fila_status : null;
        return Inertia::render('Buggys/Fila/Lista', [
            'fila' => $fila,
            'bugueirosDisponiveis' => $bugueirosDisponiveis,
            'fila_id' => (int)$fila_id,
            'statusFila' => $statusFila,
        ]);
    }

    // Adicionar bugueiro(s) à fila
    public function adicionarBugueiro(Request $request, $fila_id)
    {
        $filaModel = Filas::find($fila_id);
        if (!$filaModel || $filaModel->fila_status !== 'aberta') {
            return redirect()->back()->with('error', 'Só é possível adicionar bugueiros em uma fila aberta.');
        }
        $request->validate([
            'bugueiro_id' => 'required|array',
            'bugueiro_id.*' => 'exists:bug_bugueiros,bugueiro_id',
        ]);
        $maxPos = FilaBugueiro::where('fila_id', $fila_id)->max('posicao_fila') ?? 0;
        foreach ($request->bugueiro_id as $i => $bugueiroId) {
            FilaBugueiro::create([
                'fila_id' => $fila_id,
                'bugueiro_id' => $bugueiroId,
                'posicao_fila' => $maxPos + $i + 1,
                'atraso' => 0,
                'adiantamento' => 0,
                'fez_passeio' => false,
                'hora_entrada' => now()->format('H:i'),
                'status' => 'na-fila',
            ]);
        }
        return redirect()->route('bugueiros.filas.index');
    }

    // Adicionar todos os bugueiros cadastrados à fila aberta
    public function adicionarTodosBugueiros($fila_id)
    {
        $filaModel = Filas::find($fila_id);
        if (!$filaModel || $filaModel->fila_status !== 'aberta') {
            return redirect()->back()->with('error', 'Só é possível adicionar bugueiros em uma fila aberta.');
        }
        $bugueirosIds = Bugueiros::pluck('bugueiro_id')->toArray();
        $jaNaFila = FilaBugueiro::where('fila_id', $fila_id)->pluck('bugueiro_id')->toArray();
        $novos = array_diff($bugueirosIds, $jaNaFila);
        $maxPos = FilaBugueiro::where('fila_id', $fila_id)->max('posicao_fila') ?? 0;
        $i = 1;
        foreach ($novos as $bugueiroId) {
            FilaBugueiro::create([
                'fila_id' => $fila_id,
                'bugueiro_id' => $bugueiroId,
                'posicao_fila' => $maxPos + $i,
                'atraso' => 0,
                'adiantamento' => 0,
                'fez_passeio' => false,
                'hora_entrada' => now(),
                'status' => 'na-fila',
            ]);
            $i++;
        }
        return redirect()->back();
    }

    // Atualizar dados do bugueiro na fila
    public function atualizarBugueiro(Request $request, $fila_id, $id)
    {
        $bugueiroFila = FilaBugueiro::where('fila_id', $fila_id)->findOrFail($id);
        $bugueiroFila->update($request->only(['posicao_fila', 'atraso', 'adiantamento', 'fez_passeio', 'status']));
        return redirect()->back();
    }

    // Remover bugueiro da fila
    public function removerBugueiro($fila_id, $id)
    {
        $bugueiroFila = FilaBugueiro::where('fila_id', $fila_id)->findOrFail($id);
        $bugueiroFila->delete();
        return redirect()->back();
    }

    // Mover bugueiro para cima na fila
    public function moverCima($fila_id, $id)
    {
        $atual = FilaBugueiro::where('fila_id', $fila_id)->findOrFail($id);
        $acima = FilaBugueiro::where('fila_id', $fila_id)
            ->where('posicao_fila', $atual->posicao_fila - 1)
            ->first();
        if ($acima) {
            $acima->posicao_fila++;
            $acima->save();
            $atual->posicao_fila--;
            $atual->save();
            return redirect()->route('bugueiros.filas.index')->with('sucesso', value: 'Bugueiro Atualizado!');
        }else{
            return redirect()->route('bugueiros.filas.index')->with('erro', value: 'Erro ao atualizar bugueiro.');

        }
    }

    // Mover bugueiro para baixo na fila
    public function moverBaixo($fila_id, $id)
    {
        $atual = FilaBugueiro::where('fila_id', $fila_id)->findOrFail($id);
        $abaixo = FilaBugueiro::where('fila_id', $fila_id)
            ->where('posicao_fila', $atual->posicao_fila + 1)
            ->first();
        if ($abaixo) {
            $abaixo->posicao_fila--;
            $abaixo->save();
            $atual->posicao_fila++;
            $atual->save();
            return redirect()->route('bugueiros.filas.index')->with('sucesso', value: 'Bugueiro Atualizado!');
        }else{
            return redirect()->route('bugueiros.filas.index')->with('erro', value: 'Erro ao atualizar bugueiro.');

        }
    }
}
