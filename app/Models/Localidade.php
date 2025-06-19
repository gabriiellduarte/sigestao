<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Localidade extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ger_localidades';
    protected $primaryKey = 'ger_localidades_id';

    protected $fillable = [
        'ger_localidades_nome',
        'ativo'
    ];

    protected $casts = [
        'ativo' => 'boolean',
    ];
} 