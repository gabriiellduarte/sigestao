<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoPortaria extends Model
{
    use HasFactory;

    protected $table = 'doc_tiposportaria';
    protected $primaryKey = 'doc_tiposportaria_id';

    protected $fillable = [
        'doc_tiposportaria_nome',
        'doc_tiposportaria_status'
    ];

    protected $casts = [
        'doc_tiposportaria_status' => 'boolean'
    ];

    public function portarias(): HasMany
    {
        return $this->hasMany(Portaria::class, 'doc_tiposportaria_id', 'doc_tiposportaria_id');
    }
} 