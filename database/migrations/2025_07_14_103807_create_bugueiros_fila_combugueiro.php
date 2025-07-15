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
        Schema::create('bug_fila_x_bugueiro', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('fila_id');
            $table->unsignedBigInteger('bugueiro_id');

            $table->foreign('fila_id')->references('fila_id')->on('bug_filas');
            $table->foreign('bugueiro_id')->references('bugueiro_id')->on('bug_bugueiros');

            // Atributos específicos do bugueiro NESSA fila
            $table->integer('posicao_fila')->nullable(); // Posição do bugueiro nesta fila específica
            $table->integer('adiantamento')->default(0); // Débitos nesta fila
            $table->integer('atraso')->default(0); // Créditos nesta fila
            $table->dateTime('hora_entrada');
            $table->dateTime('hora_passeio')->nullable();
            $table->boolean('fez_passeio')->default(false); // Já fez passeio na rodada atual desta fila

            $table->timestamps(); // created_at e updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bug_fila_x_bugueiro');
    }
};
