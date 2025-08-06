<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Portaria extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $table = 'doc_portarias';
    protected $primaryKey = 'doc_portarias_id';

    protected $fillable = [
        'doc_portarias_numero',
        'doc_portarias_servidor_nome',
        'doc_portarias_servidor_cpf',
        'doc_portarias_status',
        'adm_servidores_id',
        'adm_cargos_id',
        'adm_secretarias_id',
        'doc_tiposportaria_id',
        'doc_portarias_data',
        'doc_portarias_descricao',
        'doc_portarias_link_documento',
        'doc_portarias_publicadoem',
        'user_id'
    ];

    protected $casts = [
        'doc_portarias_data' => 'date',
        'doc_portarias_criadoem' => 'datetime',
        'doc_portarias_publicadoem' => 'datetime',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*'])
        ->useLogName('documentos.portarias');
        // Chain fluent methods for configuration options
    }

    public function servidor(): BelongsTo
    {
        return $this->belongsTo(Servidores::class, 'adm_servidores_id', 'adm_servidores_id');
    }

    public function cargo(): BelongsTo
    {
        return $this->belongsTo(Cargo::class, 'adm_cargos_id', 'adm_cargos_id');
    }

    public function secretaria(): BelongsTo
    {
        return $this->belongsTo(Secretaria::class, 'adm_secretarias_id', 'adm_secretarias_id');
    }

    public function tipoPortaria(): BelongsTo
    {
        return $this->belongsTo(TipoPortaria::class, 'doc_tiposportaria_id', 'doc_tiposportaria_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 