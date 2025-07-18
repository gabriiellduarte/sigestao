<?php

namespace App\Models\Buggys;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoPasseio extends Model
{
    use HasFactory;

    protected $table = 'bug_tipos_passeio';

    protected $fillable = [
        'nome',
        'descricao',
        'duracao',
        'preco',
        'ativo',
    ];
} 