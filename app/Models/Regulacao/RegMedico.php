<?php

namespace App\Models\Regulacao;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegMedico extends Model
{
    use HasFactory;

    protected $table = 'reg_medicos';
    protected $primaryKey = 'reg_med_id';

    protected $fillable = [
        'reg_med_nome'
    ];
} 