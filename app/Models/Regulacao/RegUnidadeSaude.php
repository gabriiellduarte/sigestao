<?php

namespace App\Models\Regulacao;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegUnidadeSaude extends Model
{
    use HasFactory;

    protected $table = 'reg_unidadessaude';
    protected $primaryKey = 'reg_uni_id';

    protected $fillable = [
        'reg_uni_nome'
    ];
} 