<?php

namespace App\Models\Regulacao;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegGrupoProcedimento extends Model
{
    use HasFactory;

    protected $table = 'reg_gprocedimentos';
    protected $primaryKey = 'reg_gpro_id';

    protected $fillable = [
        'reg_gpro_nome'
    ];

    public function procedimentos()
    {
        return $this->hasMany(RegProcedimento::class, 'reg_gpro_id', 'reg_gpro_id');
    }
} 