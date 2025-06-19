<?php

namespace App\Models;

use App\Models\Localidade;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pessoa extends Model
{
    use HasFactory;

    protected $table = 'ger_pessoas';
    protected $primaryKey = 'ger_pessoas_id';

    protected $fillable = [
        'ger_pessoas_nome',
        'ger_pessoas_cns',
        'ger_pessoas_cpf',
        'ger_pessoas_nascimento',
        'ger_pessoas_telefone1',
        'ger_pessoas_telefone2',
        'ger_pessoas_endereco',
        'ger_pessoas_endereco_n',
        'ger_pessoas_endereco_bairro',
        'ger_pessoas_mae',
        'ger_localidades_id'
    ];

    protected $casts = [
        'data_nascimento' => 'date',
    ];

    public function localidade(): BelongsTo
    {
        return $this->belongsTo(Localidade::class,'ger_localidades_id','ger_localidades_id');
    }
} 