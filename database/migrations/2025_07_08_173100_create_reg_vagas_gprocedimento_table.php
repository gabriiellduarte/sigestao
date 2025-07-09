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
        Schema::create('reg_vagas_gprocedimentos', function (Blueprint $table) {
            $table->unsignedBigInteger('reg_vaga_id');
            $table->unsignedBigInteger('reg_gpro_id');

            $table->foreign('reg_vaga_id')->references('reg_vaga_id')->on('reg_vagas')->cascadeOnDelete();
            $table->foreign('reg_gpro_id')->references('reg_gpro_id')->on('reg_gprocedimentos')->cascadeOnDelete();

            $table->unique(['reg_vaga_id', 'reg_gpro_id'], 'vaga_grupo_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('srg_vagas_gprocedimentos');
    }
};
