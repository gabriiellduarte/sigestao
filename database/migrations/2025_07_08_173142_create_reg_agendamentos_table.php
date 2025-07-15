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
        Schema::create('reg_agendamentos', function (Blueprint $table) {
            $table->id('reg_age_id');
            $table->unsignedBigInteger('reg_vaga_id');
            $table->unsignedBigInteger('reg_ate_id');
            $table->string('reg_age_usuario');
            $table->longText('reg_age_obs')->nullable();
            $table->enum('reg_age_status', ['Confirmada', 'Cancelada', 'Desistência','Realizado','Não Compareceu','Não Realizou']);

            
            // Relacionamentos com FK
            $table->foreign('reg_vaga_id')->references('reg_vaga_id')->on('reg_vagas');
            $table->foreign('reg_ate_id')->references('reg_ate_id')->on('reg_atendimentos');
            
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reg_agendamentos');
    }
};
