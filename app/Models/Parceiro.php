<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parceiro extends Model
{
    protected $table = 'bug_parceiros';
    protected $fillable = [
        'nome',
        'contato',
    ];
}
