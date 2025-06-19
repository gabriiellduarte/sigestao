<?php

namespace App\Models\Regulacao;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RegPaciente extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'reg_pacientes';
    protected $primaryKey = 'reg_paciente_id';

    protected $fillable = [
        'reg_paciente_nome',
        'reg_paciente_cns',
        'reg_paciente_cpf',
        'reg_paciente_nascimento',
        'reg_paciente_telefone1',
        'reg_paciente_telefone2',
        'reg_paciente_endereco',
        'reg_paciente_endereco_n',
        'reg_paciente_endereco_bairro',
        'reg_paciente_mae',
        'reg_loc_id'
    ];

    protected $dates = [
        'reg_paciente_nascimento',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function localidade()
    {
        return $this->belongsTo(RegLocalidade::class, 'reg_loc_id', 'reg_loc_id');
    }
} 