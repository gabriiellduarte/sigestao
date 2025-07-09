<?php

namespace App\Models\Regulacao;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Pessoa;
use App\Models\User;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class RegAtendimento extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $table = 'reg_atendimentos';
    protected $primaryKey = 'reg_ate_id';

    protected $fillable = [
        'ger_pessoas_id',
        'reg_proc_id',
        'reg_gpro_id',
        'reg_ate_protocolo',
        'reg_ate_prioridade',
        'reg_tipo_id',
        'reg_ate_datendimento',
        'reg_ate_drequerente',
        'reg_ate_obs',
        'reg_uni_id',
        'reg_ate_usuario',
        'reg_ate_retroativo',
        'reg_med_id',
        'reg_ate_protoc_solicitante',
        'reg_ate_arquivado',
        'reg_acs_id',
        'reg_ate_pos_atual',
        'reg_ate_pos_inicial',
        'reg_ate_agendado'
    ];

    protected $casts = [
        'reg_ate_prioridade' => 'boolean',
        'reg_ate_datendimento' => 'datetime',
        'reg_ate_drequerente' => 'date',
        'reg_ate_retroativo' => 'boolean',
        'reg_ate_arquivado' => 'boolean',
        'reg_ate_agendado' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*'])
        ->useLogName('regulacao.atendimentos');
        // Chain fluent methods for configuration options
    }

    // Relacionamentos
    public function pessoa()
    {
        return $this->belongsTo(Pessoa::class, 'ger_pessoas_id', 'ger_pessoas_id');
    }

    public function procedimento()
    {
        return $this->belongsTo(RegProcedimento::class, 'reg_proc_id', 'reg_proc_id');
    }

    public function grupoProcedimento()
    {
        return $this->belongsTo(RegGrupoProcedimento::class, 'reg_gpro_id', 'reg_gpro_id');
    }

    public function tipoAtendimento()
    {
        return $this->belongsTo(RegTipoAtendimento::class, 'reg_tipo_id', 'reg_tipo_id');
    }

    public function unidadeSaude()
    {
        return $this->belongsTo(RegUnidadeSaude::class, 'reg_uni_id', 'reg_uni_id');
    }

    public function medico()
    {
        return $this->belongsTo(RegMedico::class, 'reg_med_id', 'reg_med_id');
    }

    public function acs()
    {
        return $this->belongsTo(RegAcs::class, 'reg_acs_id', 'reg_acs_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'reg_ate_usuario', 'id');
    }

    // Scopes
    public function scopeArquivados($query)
    {
        return $query->where('reg_ate_arquivado', true);
    }

    public function scopePrioritarios($query)
    {
        return $query->where('reg_ate_prioridade', true);
    }

    public function scopeAgendados($query)
    {
        return $query->where('reg_ate_agendado', true);
    }

    public static function getValidationMessages()
    {
        return [
            'ger_pessoas_id.required' => 'O campo paciente é obrigatório.',
            'ger_pessoas_id.exists' => 'O paciente selecionado não existe.',
            'reg_proc_id.required' => 'O campo procedimento é obrigatório.',
            'reg_proc_id.exists' => 'O procedimento selecionado não existe.',
            'reg_gpro_id.required' => 'O campo grupo de procedimento é obrigatório.',
            'reg_gpro_id.exists' => 'O grupo de procedimento selecionado não existe.',
            'reg_tipo_id.required' => 'O campo tipo de atendimento é obrigatório.',
            'reg_tipo_id.exists' => 'O tipo de atendimento selecionado não existe.',
            'reg_ate_datendimento.required' => 'A data do atendimento é obrigatória.',
            'reg_ate_datendimento.date' => 'A data do atendimento deve ser uma data válida.',
            'reg_ate_drequerente.required' => 'A data de solicitação é obrigatória.',
            'reg_ate_drequerente.date' => 'A data de solicitação deve ser uma data válida.',
            'reg_ate_obs.string' => 'O campo observações deve ser um texto.',
            'reg_uni_id.exists' => 'A unidade de saúde selecionada não existe.',
            'reg_med_id.exists' => 'O médico selecionado não existe.',
            'reg_ate_protoc_solicitante.max' => 'O protocolo solicitante deve ter no máximo 50 caracteres.',
            'reg_acs_id.exists' => 'O ACS selecionado não existe.',
            'reg_ate_pos_atual.integer' => 'A posição atual deve ser um número inteiro.',
            'reg_ate_pos_inicial.integer' => 'A posição inicial deve ser um número inteiro.',
        ];
    }
} 