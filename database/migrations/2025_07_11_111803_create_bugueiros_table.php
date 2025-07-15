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
        Schema::create('bug_bugueiros', function (Blueprint $table) {
            $table->id('bugueiro_id'); // bugueiro_id (chave primária, auto-incremento)
            $table->string('bugueiro_nome');
            $table->date('bugueiro_nascimento');
            $table->string('bugueiro_cpf',11);
            $table->string('bugueiro_email')->nullable();
            $table->string('bugueiro_cor')->nullable();
            $table->string('bugueiro_contato')->nullable(); // Contato pode ser opcional
            $table->string('bugueiro_placa_buggy');
            $table->enum('bugueiro_status', ['disponivel', 'em_passeio', 'adiantado', 'atrasado'])->default('disponivel');
            $table->integer('bugueiro_posicao_oficial');
            $table->integer('bugueiro_posicao_atual')->nullable(); // Posição na fila, pode ser nula se em passeio
            $table->integer('bugueiro_fila_atrasos')->default(0); // Número de passeios que deve à fila
            $table->integer('bugueiro_fila_adiantamentos')->default(0); // Número de passeios de crédito
            $table->timestamps(); // created_at e updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bug_bugueiros');
    }
};
