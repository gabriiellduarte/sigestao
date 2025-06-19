<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cargo extends Model
{
    use HasFactory;

    protected $table = 'adm_cargos';
    protected $primaryKey = 'adm_cargos_id';
    protected $fillable = [
        'adm_argos_nome',
        'adm_cargos_abreviacao',
    ];
}
