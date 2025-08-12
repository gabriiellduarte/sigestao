<?php

namespace App\Models\Buggys;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Filas extends Model
{
    protected $table = 'bug_filas';
    protected $primaryKey = 'fila_id';
    protected $fillable = [
        'fila_data',
        'fila_titulo',
        'fila_qntd_normal',
        'fila_qntd_adiantados',
        'fila_qntd_atrasados',
        'fila_obs',
        'fila_status',
    ];

    // Relacionamento com a tabela pivô bug_fila_x_bugueiro
    public function bugueirosFila(): HasMany
    {
        return $this->hasMany(
            \App\Models\Buggys\FilaBugueiro::class,
            'fila_id',
            'fila_id'
        );
    }
}
