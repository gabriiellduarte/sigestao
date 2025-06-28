<?php

namespace App\Models\Regulacao;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegAcs extends Model
{
    use HasFactory;

    protected $table = 'reg_acs';
    protected $primaryKey = 'reg_acs_id';

    protected $fillable = [
        'reg_acs_nome'
    ];
} 