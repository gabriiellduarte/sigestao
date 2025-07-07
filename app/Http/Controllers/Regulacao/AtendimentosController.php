<?php

namespace App\Http\Controllers\Regulacao;

use App\Http\Controllers\Controller;
use App\Models\Regulacao\RegAtendimento;
use App\Models\Regulacao\RegGrupoProcedimento;
use App\Models\Regulacao\RegProcedimento;
use App\Models\Regulacao\RegMedico;
use App\Models\Regulacao\RegUnidadeSaude;
use App\Models\Regulacao\RegAcs;
use App\Models\Regulacao\RegTipoAtendimento;
use App\Models\Pessoa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AtendimentosController extends Controller
{
    public function index()
    {
        $atendimentos = RegAtendimento::with([
            'pessoa',
            'procedimento',
            'grupoProcedimento',
            'tipoAtendimento',
            'unidadeSaude',
            'medico',
            'acs'
        ])
        ->orderBy('created_at', 'desc')
        ->paginate(15);

        return Inertia::render('regulacao/Atendimentos/ListaEspera', [
            'atendimentos' => $atendimentos
        ]);
    }

    public function create()
    {
        //$pessoas = Pessoa::select('ger_pessoas_id', 'ger_pessoas_nome', 'ger_pessoas_cpf')
        //    ->orderBy('ger_pessoas_nome')->limit(10)
        //    ->get();

        $gruposProcedimentos = RegGrupoProcedimento::orderBy('reg_gpro_nome')->get();
        $procedimentos = RegProcedimento::with('grupoProcedimento')->orderBy('reg_proc_nome')->get();
        $medicos = RegMedico::orderBy('reg_med_nome')->get();
        $unidadesSaude = RegUnidadeSaude::orderBy('reg_uni_nome')->get();
        $acs = RegAcs::orderBy('reg_acs_nome')->get();
        $tiposAtendimento = RegTipoAtendimento::orderBy('reg_tipo_peso')->get();

        return Inertia::render('regulacao/Atendimentos/Create', [
            //'pessoas' => $pessoas,
            'gruposProcedimentos' => $gruposProcedimentos,
            'procedimentos' => $procedimentos,
            'medicos' => $medicos,
            'unidadesSaude' => $unidadesSaude,
            'acs' => $acs,
            'tiposAtendimento' => $tiposAtendimento
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ger_pessoas_id' => 'required|exists:ger_pessoas,ger_pessoas_id',
            'reg_proc_id' => 'required|exists:reg_procedimentos,reg_proc_id',
            'reg_gpro_id' => 'required|exists:reg_gprocedimentos,reg_gpro_id',
            'reg_tipo_id' => 'required|exists:reg_tiposatendimento,reg_tipo_id',
            'reg_ate_datendimento' => 'required|date',
            'reg_ate_drequerente' => 'required|date',
            'reg_ate_obs' => 'nullable|string',
            'reg_uni_id' => 'nullable|exists:reg_unidadessaude,reg_uni_id',
            'reg_med_id' => 'nullable|exists:reg_medicos,reg_med_id',
            'reg_ate_protoc_solicitante' => 'nullable|string|max:50',
            'reg_acs_id' => 'nullable|exists:reg_acs,reg_acs_id',
            'reg_ate_pos_atual' => 'nullable|integer',
            'reg_ate_pos_inicial' => 'nullable|integer',
        ]);

        // Gerar protocolo único
        $protocolo = 'REG' . date('Ymd') . Str::random(6);

        $atendimento = RegAtendimento::create([
            'ger_pessoas_id' => $request->ger_pessoas_id,
            'reg_proc_id' => $request->reg_proc_id,
            'reg_gpro_id' => $request->reg_gpro_id,
            'reg_ate_prioridade' => $request->reg_ate_prioridade ?? false,
            'reg_tipo_id' => $request->reg_tipo_id,
            'reg_ate_datendimento' => $request->reg_ate_datendimento,
            'reg_ate_drequerente' => $request->reg_ate_drequerente,
            'reg_ate_obs' => $request->reg_ate_obs,
            'reg_uni_id' => $request->reg_uni_id,
            'reg_ate_usuario' => auth()->id(),
            'reg_ate_retroativo' => $request->reg_ate_retroativo ?? false,
            'reg_med_id' => $request->reg_med_id,
            'reg_ate_protoc_solicitante' => $request->reg_ate_protoc_solicitante,
            'reg_ate_arquivado' => false,
            'reg_acs_id' => $request->reg_acs_id,
            'reg_ate_pos_atual' => $request->reg_ate_pos_atual,
            'reg_ate_pos_inicial' => $request->reg_ate_pos_inicial,
            'reg_ate_agendado' => false,
        ]);

        $id = $atendimento->reg_ate_id;
        $protocolo = $id.date('dmY');
        $atendimento->update(['reg_ate_protocolo'=>$protocolo]);

        return redirect()->route('regulacao.atendimentos.index')
            ->with('sucesso', 'Atendimento criado com sucesso! Protocolo: ' . $protocolo);
    }

    public function show(RegAtendimento $atendimento)
    {
        $atendimento->load([
            'pessoa',
            'procedimento',
            'grupoProcedimento',
            'tipoAtendimento',
            'unidadeSaude',
            'medico',
            'acs',
            'usuario'
        ]);

        return Inertia::render('regulacao/Atendimentos/Show', [
            'atendimento' => $atendimento
        ]);
    }

    public function edit(RegAtendimento $atendimento)
    {
        $pessoas = Pessoa::select('ger_pessoas_id', 'ger_pessoas_nome', 'ger_pessoas_cpf')
            ->where('ger_pessoas_id', $atendimento->ger_pessoas_id)
            ->get();

        $gruposProcedimentos = RegGrupoProcedimento::orderBy('reg_gpro_nome')->get();
        $procedimentos = RegProcedimento::with('grupoProcedimento')->orderBy('reg_proc_nome')->get();
        $medicos = RegMedico::orderBy('reg_med_nome')->get();
        $unidadesSaude = RegUnidadeSaude::orderBy('reg_uni_nome')->get();
        $acs = RegAcs::orderBy('reg_acs_nome')->get();
        $tiposAtendimento = RegTipoAtendimento::orderBy('reg_tipo_peso')->get();

        return Inertia::render('regulacao/Atendimentos/Edit', [
            'atendimento' => $atendimento,
            'pessoas' => $pessoas,
            'gruposProcedimentos' => $gruposProcedimentos,
            'procedimentos' => $procedimentos,
            'medicos' => $medicos,
            'unidadesSaude' => $unidadesSaude,
            'acs' => $acs,
            'tiposAtendimento' => $tiposAtendimento
        ]);
    }

    public function update(Request $request, RegAtendimento $atendimento)
    {
        $request->validate([
            'ger_pessoas_id' => 'required|exists:ger_pessoas,ger_pessoas_id',
            'reg_proc_id' => 'required|exists:reg_procedimentos,reg_proc_id',
            'reg_gpro_id' => 'required|exists:reg_gprocedimentos,reg_gpro_id',
            'reg_tipo_id' => 'required|exists:reg_tiposatendimento,reg_tipo_id',
            'reg_ate_datendimento' => 'required|date',
            'reg_ate_drequerente' => 'required|date',
            'reg_ate_obs' => 'nullable|string',
            'reg_uni_id' => 'nullable|exists:reg_unidadessaude,reg_uni_id',
            'reg_med_id' => 'nullable|exists:reg_medicos,reg_med_id',
            'reg_ate_protoc_solicitante' => 'nullable|string|max:50',
            'reg_acs_id' => 'nullable|exists:reg_acs,reg_acs_id',
            'reg_ate_pos_atual' => 'nullable|integer',
            'reg_ate_pos_inicial' => 'nullable|integer',
        ]);

        $atendimento->update([
            'ger_pessoas_id' => $request->ger_pessoas_id,
            'reg_proc_id' => $request->reg_proc_id,
            'reg_gpro_id' => $request->reg_gpro_id,
            'reg_ate_prioridade' => $request->reg_ate_prioridade ?? false,
            'reg_tipo_id' => $request->reg_tipo_id,
            'reg_ate_datendimento' => $request->reg_ate_datendimento,
            'reg_ate_drequerente' => $request->reg_ate_drequerente,
            'reg_ate_obs' => $request->reg_ate_obs,
            'reg_uni_id' => $request->reg_uni_id,
            'reg_ate_retroativo' => $request->reg_ate_retroativo ?? false,
            'reg_med_id' => $request->reg_med_id,
            'reg_ate_protoc_solicitante' => $request->reg_ate_protoc_solicitante,
            'reg_acs_id' => $request->reg_acs_id,
            'reg_ate_pos_atual' => $request->reg_ate_pos_atual,
            'reg_ate_pos_inicial' => $request->reg_ate_pos_inicial,
        ]);

        return redirect()->route('regulacao.atendimentos.edit',$atendimento->reg_ate_id)
            ->with('sucesso', 'Atendimento atualizado com sucesso!');
    }

    public function destroy(RegAtendimento $atendimento)
    {
        $atendimento->delete();

        return redirect()->route('regulacao.atendimentos.index')
            ->with('sucesso', 'Atendimento excluído com sucesso!');
    }

    public function espera()
    {
        $atendimentos = RegAtendimento::with([
            'pessoa',
            'procedimento',
            'grupoProcedimento',
            'tipoAtendimento',
            'unidadeSaude',
            'medico',
            'acs'
        ])
        ->where('reg_ate_arquivado', false)
        ->orderBy('reg_ate_prioridade', 'desc')
        ->orderBy('created_at', 'asc')
        ->paginate(50);

        return Inertia::render('regulacao/Atendimentos/ListaEspera', [
            'atendimentos' => $atendimentos
        ]);
    }

    public function arquivar(RegAtendimento $atendimento)
    {
        $atendimento->update(['reg_ate_arquivado' => true]);

        return redirect()->route('regulacao.atendimentos.index')
            ->with('sucesso', 'Atendimento arquivado com sucesso!');
    }

    public function desarquivar(RegAtendimento $atendimento)
    {
        $atendimento->update(['reg_ate_arquivado' => false]);

        return redirect()->route('regulacao.atendimentos.index')
            ->with('sucesso', 'Atendimento desarquivado com sucesso!');
    }

    public function agendar(RegAtendimento $atendimento)
    {
        $atendimento->update(['reg_ate_agendado' => true]);

        return redirect()->route('regulacao.atendimentos.index')
            ->with('sucesso', 'Atendimento agendado com sucesso!');
    }

    public function desagendar(RegAtendimento $atendimento)
    {
        $atendimento->update(['reg_ate_agendado' => false]);

        return redirect()->route('regulacao.atendimentos.index')
            ->with('sucesso', 'Agendamento cancelado com sucesso!');
    }

    public function comprovante($atendimento)
    {

        $atendimentoConsulta = RegAtendimento::where('reg_ate_id', $atendimento)->with([
            'pessoa',
            'procedimento',
            'grupoProcedimento',
            'tipoAtendimento',
            'usuario'
        ])->get();

        $atendimento = $atendimentoConsulta->map(function($item){
            return [
                'pacienteNome'=>$item->pessoa->ger_pessoas_nome,
                'procedimentoNome'=>$item->procedimento->reg_proc_nome,
                'pacienteCNS'=>$item->pessoa->ger_pessoas_cns,
                'pacienteTelefone1'=>$item->pessoa->ger_pessoas_telefone1,
                'pacienteTelefone2'=>$item->pessoa->ger_pessoas_telefone2,
                'pacienteNascimento'=>$item->pessoa->ger_pessoas_nascimento,
                'pacienteEndereco'=>$item->pessoa->ger_pessoas_endereco,
                'pacienteEnderecoN'=>$item->pessoa->ger_pessoas_endereco_n,
                'pacienteCPF'=>$item->pessoa->ger_pessoas_cpf,
                'usuarioNome'=>$item->usuario->name,
                'dataSolicitacao'=>$item->reg_ate_datendimento,
                'protocolo'=>$item->reg_ate_protocolo
    
            ];
        });

        return Inertia::render('regulacao/Atendimentos/DocumentoPrint', [
            'atendimento' => $atendimento[0]
        ]);
    }
} 