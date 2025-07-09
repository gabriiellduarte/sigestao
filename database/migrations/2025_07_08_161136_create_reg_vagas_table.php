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
        Schema::create('reg_turnos', function (Blueprint $table) {
            $table->id('reg_turno_id');
            $table->string('reg_turno_valor',40);
            $table->timestamps();
        });
        Schema::create('reg_vagas', function (Blueprint $table) {
            $table->id('reg_vaga_id');
            $table->unsignedBigInteger('reg_proc_id');
            $table->unsignedBigInteger('reg_med_id');
            $table->unsignedBigInteger('reg_turno_id');

            $table->integer('reg_vaga_quantidade');
            $table->date('reg_vaga_data');
            $table->boolean('reg_vaga_aberta')->default(true);
            $table->string('reg_vaga_local_atendimento', 210)->nullable();

            // FK
            $table->foreign('reg_proc_id')->references('reg_proc_id')->on('reg_procedimentos');
            $table->foreign('reg_med_id')->references('reg_med_id')->on('reg_medicos');
            $table->foreign('reg_turno_id')->references('reg_turno_id')->on(table: 'reg_turnos');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {   
        Schema::dropIfExists('reg_vagas');
        Schema::dropIfExists('reg_turnos');
    }
};
