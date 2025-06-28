<?php

namespace App\Models\Regulacao;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegProcedimento extends Model
{
    use HasFactory;

    protected $table = 'reg_procedimentos';
    protected $primaryKey = 'reg_proc_id';

    protected $fillable = [
        'reg_proc_nome',
        'reg_gpro_id'
    ];

    public function grupoProcedimento()
    {
        return $this->belongsTo(RegGrupoProcedimento::class, 'reg_gpro_id', 'reg_gpro_id');
    }
} 