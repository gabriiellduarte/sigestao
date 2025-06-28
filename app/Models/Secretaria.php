<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Secretaria extends Model
{
    use HasFactory;

    protected $table = 'adm_secretarias';
    protected $primaryKey = 'adm_secretarias_id';

    protected $fillable = [
        'adm_secretarias_nome',
        'adm_secretarias_abreviacao',
        'adm_secretarias_status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
}