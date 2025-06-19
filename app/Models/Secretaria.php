<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Secretaria extends Model
{
    use HasFactory;

    protected $table = 'ger_secretarias';

    protected $fillable = [
        'nome',
        'abreviacao',
        'descricao',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
}