<?php

namespace App\Models\Regulacao;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegTipoAtendimento extends Model
{
    use HasFactory;

    protected $table = 'reg_tiposatendimento';
    protected $primaryKey = 'reg_tipo_id';

    protected $fillable = [
        'reg_tipo_nome',
        'reg_tipo_peso'
    ];
} 