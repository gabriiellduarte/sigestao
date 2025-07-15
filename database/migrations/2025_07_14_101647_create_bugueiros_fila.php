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
        Schema::create('bug_filas', function (Blueprint $table) {
            $table->id('fila_id');
            $table->dateTime('fila_data');
            $table->integer('fila_qntd_normal')->default(111);
            $table->integer('fila_qntd_adiantados')->default(0);
            $table->integer('fila_qntd_atrasados')->default(0);
            $table->string('fila_obs')->nullable();
            $table->enum('fila_status',['cancelada','finalizada','aberta','progresso']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bug_filas');
    }
};
