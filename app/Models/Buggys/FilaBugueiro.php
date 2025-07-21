<?php

namespace App\Models\Buggys;

use Illuminate\Database\Eloquent\Model;

class FilaBugueiro extends Model
{
    protected $table = 'bug_fila_x_bugueiro';
    public $timestamps = true;
    protected $fillable = [
        'fila_id',
        'bugueiro_id',
        'posicao_fila',
        'atraso',
        'adiantamento',
        'hora_entrada',
        'hora_passeio',
        'fez_passeio',
        'obs',
        'removido',
    ];

    protected $casts = [
        'fez_passeio' => 'boolean', // Mapeia para booleano em PHP
    ];


    public function fila()
    {
        return $this->belongsTo(Filas::class, 'fila_id', 'fila_id');
    }

    public function bugueiro()
    {
        return $this->belongsTo(Bugueiros::class, 'bugueiro_id', 'bugueiro_id');
    }
} 