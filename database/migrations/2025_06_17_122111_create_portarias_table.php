<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doc_portarias', function (Blueprint $table) {
            $table->id('doc_portarias_id');
            $table->string('doc_portarias_numero')->unique();
            $table->string('doc_portarias_servidor_nome');
            $table->string('doc_portarias_servidor_cpf');
            $table->enum('doc_portarias_status', ['publicado', 'pendente', 'cancelado']);
            $table->unsignedBigInteger('adm_servidores_id');
            $table->unsignedBigInteger('adm_cargos_id');
            $table->unsignedBigInteger('adm_secretarias_id');
            $table->unsignedBigInteger('doc_tiposportaria_id');
            $table->date('doc_portarias_data');
            $table->text('doc_portarias_descricao')->nullable();
            $table->string('doc_portarias_link_documento')->nullable();
            $table->timestamp('doc_portarias_criadoem')->useCurrent();
            $table->timestamp('doc_portarias_publicadoem')->nullable();
            $table->unsignedBigInteger('user_id');
        
            $table->timestamps();
        
            // Relacionamentos
            $table->foreign('adm_servidores_id')->references('adm_servidores_id')->on('adm_servidores');
            $table->foreign('adm_cargos_id')->references('adm_cargos_id')->on('adm_cargos');
            $table->foreign('adm_secretarias_id')->references('adm_secretarias_id')->on('adm_secretarias');
            $table->foreign('doc_tiposportaria_id')->references('doc_tiposportaria_id')->on('doc_tiposportaria');
            $table->foreign('user_id')->references('id')->on('users');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doc_portarias');
    }
};
