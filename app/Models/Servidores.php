<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Servidores extends Model
{
    use HasFactory;

    protected $table = 'adm_servidores';
    protected $primaryKey = 'adm_servidores_id';

    protected $fillable = [
        'ger_pessoas_id',
    ];

    public function pessoa()
    {
        return $this->belongsTo(Pessoa::class, 'ger_pessoas_id', 'ger_pessoas_id');
    }
}