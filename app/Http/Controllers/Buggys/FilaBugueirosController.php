<?php
namespace App\Http\Controllers\Buggys;

use App\Http\Controllers\Controller;

use App\Models\Buggys\Passeio;
use App\Models\Buggys\TipoPasseio;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Buggys\Filas;
use App\Models\Buggys\Bugueiros;
use App\Models\Buggys\FilaBugueiro;
use App\Models\Parceiro;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FilaBugueirosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function dashboard(){
        // Dados reais para o dashboard
        $totalPasseios = Passeio::count();
        $bugueirosAtivos = Passeio::distinct('bugueiro_id')->count('bugueiro_id');
        $receitaTotal = Passeio::sum('valor');
        $avaliacaoMedia = 4.7;
        $passeiosPorMes = Passeio::selectRaw('YEAR(data_hora) as ano, MONTH(data_hora) as mes_num, COUNT(*) as passeios, SUM(valor) as receita')
            ->whereNotNull('data_hora')
            ->groupByRaw('YEAR(data_hora), MONTH(data_hora)')
            ->orderByRaw('YEAR(data_hora) DESC, MONTH(data_hora) DESC')
            ->limit(6)
            ->get()
            ->map(function($item) {
                $meses = ['','Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                $item->mes = $meses[intval($item->mes_num)];
                return $item;
        });
        $rankingBugueiros = Passeio::selectRaw('bugueiro_nome, bugueiro_id, COUNT(*) as passeios')
            ->groupBy('bugueiro_id', 'bugueiro_nome')
            ->orderByDesc('passeios')
            ->limit(5)
            ->get();
        $tiposPasseios = Passeio::selectRaw('tipoPasseio as tipo, COUNT(*) as quantidade')
            ->groupBy('tipoPasseio')
            ->get();
        return Inertia::render('Buggys/Dashboard', [
            'totalPasseios' => $totalPasseios,
            'bugueirosAtivos' => $bugueirosAtivos,
            'receitaTotal' => $receitaTotal,
            'avaliacaoMedia' => $avaliacaoMedia,
            'passeiosPorMes' => $passeiosPorMes,
            'rankingBugueiros' => $rankingBugueiros,
            'tiposPasseios' => $tiposPasseios,
        ]);
    }   
    /**
     * Retorna bugueiros disponíveis para adicionar à fila (não vinculados à fila atual)
     */
    public function bugueirosDisponiveis($fila_id)
    {
        // IDs dos bugueiros já na fila
        $idsNaFila = FilaBugueiro::where('fila_id', $fila_id)->pluck('bugueiro_id')->toArray();
        // Bugueiros disponíveis = todos menos os já na fila
        $bugueiros = Bugueiros::whereNotIn('bugueiro_id', $idsNaFila)
            ->orderBy('bugueiro_nome')
            ->get(['bugueiro_id', 'bugueiro_nome']);
        return response()->json($bugueiros);
    }
    public function index()
    {
        // Busca fila aberta
        $tipopasseio = TipoPasseio::all();
        $parceiros = Parceiro::all();
        $fila = Filas::where('fila_status', 'aberta')->with('bugueirosFila')->first();
        
        // Se não existir, cria uma nova
        if (!$fila) {
            $fila = Filas::create([
                'fila_data' => now(),
                'fila_titulo' => 'GERAL',
                'fila_qntd_normal' => 0,
                'fila_qntd_adiantados' => 0,
                'fila_qntd_atrasados' => 0,
                'fila_obs' => null,
                'fila_status' => 'aberta',
            ]);
            $bugueiros = [];
        }else{
            $bugueiros = FilaBugueiro::where('fila_id', $fila->fila_id)->with('bugueiro')->orderBy('posicao_fila')->get();
        }
        return Inertia::render('Buggys/Fila/Lista', [
            'bugueiros_fila' => $bugueiros,
            'fila_id'=>$fila->fila_id,
            'fila_status'=>$fila->fila_status,
            'passeios_tipo'=>$tipopasseio,
            'parceiros'=>$parceiros,
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
            'titulo' => 'required|string|max:255',
            'fila_obs' => 'nullable|string',
        ]);
        $fila = Filas::create([
            'fila_titulo' => $validated['titulo'],
            'fila_obs' => $validated['fila_obs'] ?? null,
            'fila_data' => now(),
            'fila_status' => 'aberta',
            'fila_qntd_normal' => 0,
            'fila_qntd_adiantados' => 0,
            'fila_qntd_atrasados' => 0,
        ]);
        return redirect(route('bugueiros.filas.todas'))->with('successo', 'Fila criada com sucesso.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {

        // Busca fila aberta
        $tipopasseio = TipoPasseio::all();
        $parceiros = Parceiro::all();
        $fila = Filas::with('bugueirosFila')->find($id);
        

        //dd($fila);
        // Se não existir, cria uma nova
        if (!$fila) {
            return redirect()->back()->with('erro', 'Fila não encontrada.');
        }else{
            $bugueiros = FilaBugueiro::where('fila_id', $fila->fila_id)->with('bugueiro')->orderBy('posicao_fila')->get();
        }
        return Inertia::render('Buggys/Fila/Lista', [
            'bugueiros_fila' => $bugueiros,
            'fila_id'=>$fila->fila_id,
            'fila_status'=>$fila->fila_status,
            'fila_titulo'=>$fila->fila_titulo,
            'passeios_tipo'=>$tipopasseio,
            'parceiros'=>$parceiros,
        ]);

        return "ok";
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
        try {
            DB::beginTransaction();
            // Tenta criar o passeio antes de atualizar a fila
            $passeio = new Passeio();
            $passeio->bugueiro_id = $request->bugueiro_id;
            $passeio->bugueiro_nome = $request->bugueiro_nome;
            $passeio->tipoPasseio = $request->tipoPasseio ?? 'normal';
            $passeio->nome_passeio = $request->nome_passeio ?? '';
            $passeio->data_hora = $request->data_hora ?? now();
            $passeio->duracao = $request->duracao ?? 1;
            $passeio->valor = $request->valor ?? 0;
            $passeio->parceiro = $request->parceiro ?? null;
            $passeio->comissao_parceiro = $request->comissao_parceiro ?? null;
            $passeio->observacoes = $request->observacoes ?? null;
            $passeio->save();

            // Se chegou aqui, passeio foi criado com sucesso, pode atualizar a fila
            $validated = $request->validate([
                'fila_data' => 'sometimes|date',
                'fila_qntd_normal' => 'sometimes|integer',
                'fila_qntd_adiantados' => 'sometimes|integer',
                'fila_qntd_atrasados' => 'sometimes|integer',
                'fila_obs' => 'nullable|string',
                'fila_status' => 'sometimes|in:cancelada,finalizada,aberta',
            ]);
            $fila->update($validated);
            DB::commit();
            return response()->json($fila);
        } catch (Exception $e) {
            DB::rollBack();
            // Se der erro ao criar o passeio, não atualiza nada
            return response()->json(['error' => 'Erro ao criar passeio: ' . $e->getMessage()], 500);
        }
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
        $parceiros = Parceiro::all();
        return Inertia::render('Buggys/Fila/Lista', [
            'fila' => $fila,
            'bugueirosDisponiveis' => $bugueirosDisponiveis,
            'fila_id' => (int)$fila_id,
            'statusFila' => $statusFila,
            'parceiros' => $parceiros,
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
                'hora_entrada' => now(),
                'status' => 'na-fila',
            ]);
        }
        return redirect()->back()->with('successo', 'Bugueiro(s) adicionado(s) à fila com sucesso.');
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
        $fila = FilaBugueiro::where([['fila_id', $fila_id],['id',$id]])->with('bugueiro')->first();
        $tipopasseio = TipoPasseio::find($request->tipo_passeio_id);
        try {
            DB::beginTransaction();

            // Verifica se o bugueiro não é o primeiro da fila (menor posicao_fila entre os que não fizeram passeio)
            if ($fila->posicao_fila > 1) {
                // Incrementa o campo bugueiro_fila_adiantamentos no cadastro do bugueiro
                $bugueiro = $fila->bugueiro;
                if ($bugueiro) {
                    $bugueiro->bugueiro_fila_adiantamentos = $bugueiro->bugueiro_fila_adiantamentos + 1;
                    $bugueiro->save();
                }
                // Adiciona o campo adiantamento ao request para poder ele adicionar no update da fila logo abaixo
                $request->merge(['adiantamento' => 1]);
            }
            if($request->usa_adiantamento){
                $fila->update(['removido'=>true, 'obs'=>'1 ADIANTAMENTO UTILIZADO']);
                // Se usou adiantamento, desconta 1 do bugueiro
                $bugueiro = $fila->bugueiro;
                if($bugueiro->bugueiro_fila_adiantamentos > 0) {
                    $bugueiro->bugueiro_fila_adiantamentos -= 1;
                    $bugueiro->save();
                }
                //$this->reordenarFila($fila_id,true);
            }else{
                // Tenta criar o passeio antes de atualizar a fila
                $passeio = new Passeio();
                $passeio->bugueiro_id = $fila->bugueiro_id;
                $passeio->fila_id = $fila_id;
                $passeio->bugueiro_nome = $fila->bugueiro->bugueiro_nome;
                $passeio->tipoPasseio = $request->tipoPasseio;
                $passeio->nome_passeio = $tipopasseio->nome;
                $passeio->data_hora = $request->data_hora ?? now();
                $passeio->duracao = $tipopasseio->duracao;
                $passeio->valor = $tipopasseio->preco ?? 0;
                $passeio->parceiro = $request->parceiro ?? null;
                $passeio->comissao_parceiro = $request->comissao_parceiro ?? null;
                $passeio->observacoes = $request->observacoes ?? null;
                $passeio->save();

                $request->merge(['hora_passeio' => Carbon::now()]);

                $fila->update($request->only(['posicao_fila', 'atraso', 'adiantamento', 'fez_passeio', 'obs','removido','hora_passeio']));
            }
            DB::commit();

            $this->reordenarFila($fila_id,true);
            //return redirect()->back()->with('sucesso', 'Sucesso ao criar passeio ');
        } catch (Exception $e) {
            DB::rollBack();
            // Se der erro ao criar o passeio, não atualiza nada
            return redirect()->back()->with('erro', 'Erro ao criar passeio ');
        }
    }

    // Atualizar dados do bugueiro na fila
    public function salvaPasseioGrupo(Request $request, $id)
    {
        $fila = FilaBugueiro::where('id',$id)->with('bugueiro')->first();
        $tipopasseio = TipoPasseio::find($request->tipo_passeio_id);
        try {
            DB::beginTransaction();
            
            // Tenta criar o passeio antes de atualizar a fila
            $passeio = new Passeio();
            $passeio->bugueiro_id = $fila->bugueiro_id;
            $passeio->fila_id = $fila->fila_id;
            $passeio->bugueiro_nome = $fila->bugueiro->bugueiro_nome;
            $passeio->tipoPasseio = $request->tipoPasseio;
            $passeio->nome_passeio = $tipopasseio->nome;
            $passeio->data_hora = $request->data_hora ?? now();
            $passeio->duracao = $tipopasseio->duracao;
            $passeio->valor = $tipopasseio->preco ?? 0;
            $passeio->parceiro = $request->parceiro ?? null;
            $passeio->comissao_parceiro = $request->comissao_parceiro ?? null;
            $passeio->observacoes = $request->observacoes ?? null;
            $passeio->save();

            $request->merge(['hora_passeio' => Carbon::now()]);
            $request->merge(['fez_passeio' => true]);
            $request->merge(['obs' => 'PASSEIO EM GRUPO']);

            $fila->update($request->only(['posicao_fila', 'atraso', 'adiantamento', 'fez_passeio', 'obs','removido','hora_passeio']));
            
            DB::commit();
            

            //return redirect()->back()->with('sucesso', 'Sucesso ao criar passeio ');
        } catch (Exception $e) {
            DB::rollBack();
            // Se der erro ao criar o passeio, não atualiza nada
            return redirect()->back()->with('erro', 'Erro ao criar passeio ');
        }
    }

    // Remover bugueiro da fila
    public function removerBugueiro($fila_id, $id)
    {
        $bugueiroFila = FilaBugueiro::where('fila_id', $fila_id)->findOrFail($id);
        $bugueiroFila->delete();
        return redirect()->back();
    }

    // Remover bugueiro da fila (simples)
    public function removerSimples(Request $request, $fila_id, $id)
    {
        $bugueiroFila = FilaBugueiro::where('fila_id', $fila_id)->findOrFail($id);
        $bugueiroFila->removido = true;
        if ($request->has('obs')) {
            $bugueiroFila->obs = $request->input('obs');
        }
        $bugueiroFila->save();
        $this->reordenarFila($fila_id,true);
        //return redirect()->route('bugueiros.filas.index')->with('sucesso', 'Bugueiro removido da fila.');
    }

    // Remover bugueiro da fila com atraso e observação
    public function removerComAtraso(Request $request, $fila_id, $id)
    {
        $request->validate([
            'observacao' => 'required|string',
        ]);
        $bugueiroFila = FilaBugueiro::where('fila_id', $fila_id)->findOrFail($id);
        $bugueiroFila->removido = true;
        $bugueiroFila->obs = $request->input('observacao');
        $bugueiroFila->save();
        // Atualiza atraso no cadastro do bugueiro
        $bugueiro = $bugueiroFila->bugueiro;
        if ($bugueiro) {
            $bugueiro->bugueiro_fila_atrasos = $bugueiro->bugueiro_fila_atrasos + 1;
            $bugueiro->save();
        }
        $this->reordenarFila($fila_id,true);
        //return redirect()->route('bugueiros.filas.index')->with('sucesso', 'Bugueiro removido da fila com atraso registrado.');
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

    // Criar nova fila e adicionar todos os bugueiros cadastrados
    public function novaFilaComTodos()
    {
        // Fecha a fila aberta, se houver
        $filaAberta = Filas::where('fila_status', 'aberta')->first();
        if ($filaAberta) {
            $filaAberta->update(['fila_status' => 'finalizada']);
        }
        // Cria nova fila
        $fila = Filas::create([
            'fila_data' => now(),
            'fila_titulo' => 'GERAL',
            'fila_qntd_normal' => 0,
            'fila_qntd_adiantados' => 0,
            'fila_qntd_atrasados' => 0,
            'fila_obs' => null,
            'fila_status' => 'aberta',
        ]);
        // Adiciona todos os bugueiros cadastrados
        $bugueiros = Bugueiros::all();
        foreach ($bugueiros as $bugueiro) {
            FilaBugueiro::create([
                'fila_id' => $fila->fila_id,
                'bugueiro_id' => $bugueiro->bugueiro_id,
                'posicao_fila' => $bugueiro->bugueiro_posicao_oficial,
                'atraso' => 0,
                'adiantamento' => 0,
                'fez_passeio' => false,
                'hora_entrada' => now(),
                'status' => 'na-fila',
            ]);
        }
        return redirect()->route('bugueiros.filas.index');
    }

    // Reordenar fila conforme bugueiro_posicao_oficial
    public function reordenarFila($fila_id, $apenasFilaAtual = false)
    {
        $query = FilaBugueiro::where('fila_id', $fila_id);
        //Só ordena os que ainda não fizeram passeio
        $query->where('fez_passeio', false)->where('removido',false);
        $bugueirosFila = $query->with('bugueiro')->orderBy('posicao_fila')->get();

        if($apenasFilaAtual){
            foreach ($bugueirosFila as $key => $item) {
                $item->posicao_fila = $key + 1;
                $item->save();
            }
        }else{
            foreach ($bugueirosFila as $key => $item) {
                $item->posicao_fila = $item->bugueiro->bugueiro_posicao_oficial;
                $item->save();
            }
        }
        
        return redirect()->back()->with('sucesso', 'Fila reordenada com sucesso!');
    }

    /**
     * Retorna dados reais para o dashboard dos buggys
     */
    public function dashboardDadosReais()
    {
        // Total de passeios
        $totalPasseios = \App\Models\Buggys\Passeio::count();
        // Bugueiros ativos (com pelo menos 1 passeio)
        $bugueirosAtivos = \App\Models\Buggys\Passeio::distinct('bugueiro_id')->count('bugueiro_id');
        // Receita total
        $receitaTotal = \App\Models\Buggys\Passeio::sum('valor');
        // Avaliação média (mock, pois não há campo de avaliação)
        $avaliacaoMedia = 4.7;
        // Passeios por mês (últimos 6 meses)
        $passeiosPorMes = \App\Models\Buggys\Passeio::selectRaw('DATE_FORMAT(data_hora, "%b") as mes, COUNT(*) as passeios, SUM(valor) as receita')
            ->whereNotNull('data_hora')
            ->groupByRaw('YEAR(data_hora), MONTH(data_hora)')
            ->orderByRaw('YEAR(data_hora) DESC, MONTH(data_hora) DESC')
            ->limit(6)
            ->get();
        // Ranking de bugueiros (top 5)
        $rankingBugueiros = \App\Models\Buggys\Passeio::selectRaw('bugueiro_nome, bugueiro_id, COUNT(*) as passeios')
            ->groupBy('bugueiro_id', 'bugueiro_nome')
            ->orderByDesc('passeios')
            ->limit(5)
            ->get();
        // Tipos de passeios
        $tiposPasseios = \App\Models\Buggys\Passeio::selectRaw('tipoPasseio as tipo, COUNT(*) as quantidade')
            ->groupBy('tipoPasseio')
            ->get();
        return response()->json([
            'totalPasseios' => $totalPasseios,
            'bugueirosAtivos' => $bugueirosAtivos,
            'receitaTotal' => $receitaTotal,
            'avaliacaoMedia' => $avaliacaoMedia,
            'passeiosPorMes' => $passeiosPorMes,
            'rankingBugueiros' => $rankingBugueiros,
            'tiposPasseios' => $tiposPasseios,
        ]);
    }

    /**
     * Lista todas as filas com dados básicos
     */
    public function listarFilas()
    {
        $filas = \App\Models\Buggys\Filas::orderBy('fila_data', 'desc')->get();
        return Inertia::render('Buggys/Filas/ListaTodas', [
            'filas' => $filas
        ]);
    }

    /**
     * Mostra todos os bugueiros de uma fila específica (incluindo removidos e quem já fez passeio)
     */
    public function verFilaCompleta($fila_id)
    {
        $fila = \App\Models\Buggys\Filas::with(['bugueirosFila.bugueiro'])->findOrFail($fila_id);
        return Inertia::render('Buggys/Filas/VerFila', [
            'fila' => $fila,
            'bugueiros_fila' => $fila->bugueirosFila
        ]);
    }

    public function adicionarPasseioEmGrupo(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
            'descricao' => 'required|string',
        ]);

        // Salva o passeio em grupo conforme sua lógica de negócio
        foreach ($data['ids'] as $idfila) {
            $this->salvaPasseioGrupo($request, $idfila);
        }
        $this->reordenarFila($request->filaId, true);

        // Monta mensagem do grupo para WhatsApp
        $bugueiros = \App\Models\Buggys\FilaBugueiro::with('bugueiro')
            ->whereIn('id', $data['ids'])
            ->get();
        $nomes = $bugueiros->map(function($item) {
            return $item->bugueiro ? $item->bugueiro->bugueiro_nome : 'Desconhecido';
        })->implode(", ");
        $msg = "🚨 Passeio em Grupo Iniciado!\n";
        $msg .= "Descrição: " . $data['descricao'] . "\n";
        $msg .= "Participantes: " . $nomes . "\n";
        $msg .= "Data/Hora: " . now()->format('d/m/Y H:i');

        // Chama o método de envio WhatsApp
        $this->enviarMensagemWhatsapp(new Request(['mensagem' => $msg]));

        return to_route('bugueiros.filas.index')->with('sucesso', 'Passeio em grupo adicionado com sucesso!');
    }
    /**
     * Envia mensagem WhatsApp para API externa (similar ao frontend)
     */
    public function enviarMensagemWhatsapp(Request $request)
    {
        $mensagem = $request->input('mensagem');
        if (!$mensagem) {
            return response()->json(['error' => 'Mensagem não informada'], 400);
        }
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post('https://n8n.aracati.ce.gov.br/webhook/25739f51-29e1-4dfe-9954-51fb559b56e9', [
                'mensagem' => $mensagem
            ]);
            if ($response->successful()) {
                Log::info('Mensagem enviada com sucesso', [
                    'mensagem' => $mensagem,
                    'response' => $response->json()
                ]);
            } else {
                Log::error('Erro ao enviar mensagem', [
                    'mensagem' => $mensagem,
                    'response' => $response->body()
                ]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao enviar mensagem: ' . $e->getMessage()], 500);
        }
    }
}
