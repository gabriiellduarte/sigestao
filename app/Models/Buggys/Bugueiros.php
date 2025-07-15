<?php

namespace App\Models\Buggys;

use Illuminate\Database\Eloquent\Model;

class Bugueiros extends Model
{
    protected $table = 'bug_bugueiros';
    protected $primaryKey = 'bugueiro_id';
    protected $fillable = [
        'bugueiro_nome',
        'bugueiro_nascimento',
        'bugueiro_cpf',
        'bugueiro_email',
        'bugueiro_cor',
        'bugueiro_contato',
        'bugueiro_placa_buggy',
        'bugueiro_status',
        'bugueiro_posicao_oficial',
        'bugueiro_posicao_atual',
        'bugueiro_fila_atrasos',
        'bugueiro_fila_adiantamentos',
    ];

    public function filas()
    {
        return $this->belongsToMany(
            Filas::class,
            'bug_fila_x_bugueiro',
            'bugueiro_id',
            'fila_id'
        )->withPivot([
            'posicao_fila',
            'debitos_fila',
            'creditos_fila',
            'fez_passeio',
            'created_at',
            'updated_at'
        ]);
    }
}
