<?php

namespace App\Models\Buggys;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Passeio extends Model
{
    use HasFactory;

    protected $table = 'bug_passeios';

    protected $fillable = [
        'bugueiro_id',
        'fila_id',
        'bugueiro_nome',
        'tipoPasseio',
        'nome_passeio',
        'data_hora',
        'duracao',
        'valor',
        'parceiro',
        'comissao_parceiro',
        'observacoes',
    ];
} 