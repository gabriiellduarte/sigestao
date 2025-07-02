<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // srg_g_procedimentos
        Schema::create('reg_gprocedimentos', function (Blueprint $table) {
            $table->id('reg_gpro_id');
            $table->string('reg_gpro_nome');
            $table->timestamps();
        });
        // srg_procedimentos (agora vinculado a grupo)
        Schema::create('reg_procedimentos', function (Blueprint $table) {
            $table->id('reg_proc_id');
            $table->string('reg_proc_nome');
            $table->unsignedBigInteger('reg_gpro_id');
            $table->foreign('reg_gpro_id')->references('reg_gpro_id')->on('reg_gprocedimentos');
            $table->timestamps();
        });
        // srg_medicos
        Schema::create('reg_medicos', function (Blueprint $table) {
            $table->id('reg_med_id');
            $table->string('reg_med_nome');
            $table->timestamps();
        });
        // srg_unidade_de_atendimento
        Schema::create('reg_unidadessaude', function (Blueprint $table) {
            $table->id('reg_uni_id');
            $table->string('reg_uni_nome');
            $table->timestamps();
        });
        Schema::create('reg_acs', function (Blueprint $table) {
            $table->id('reg_acs_id');
            $table->string('reg_acs_nome');
            $table->timestamps();
        });
        Schema::create('reg_tiposatendimento', function (Blueprint $table) {
            $table->id('reg_tipo_id');
            $table->string('reg_tipo_nome');
            $table->integer('reg_tipo_peso');
            $table->timestamps();
        });
        // srg_agenda_de_pacientes
        Schema::create('reg_atendimentos', function (Blueprint $table) {
            $table->id('reg_ate_id');
            $table->unsignedBigInteger('ger_pessoas_id');
            $table->unsignedBigInteger('reg_proc_id');
            $table->unsignedBigInteger('reg_gpro_id');
            $table->string('reg_ate_protocolo',16)->nullable();
            $table->boolean('reg_ate_prioridade')->default(false);
            $table->unsignedBigInteger('reg_tipo_id');
            $table->dateTime('reg_ate_datendimento');
            $table->date('reg_ate_drequerente');
            $table->longText('reg_ate_obs')->nullable();
            $table->unsignedBigInteger('reg_uni_id')->nullable();
            $table->unsignedBigInteger('reg_ate_usuario')->nullable();
            $table->boolean('reg_ate_retroativo')->nullable();
            $table->unsignedBigInteger('reg_med_id')->nullable();
            $table->string('reg_ate_protoc_solicitante', 50)->nullable();
            $table->boolean('reg_ate_arquivado')->default(false);
            $table->unsignedBigInteger('reg_acs_id')->nullable();
            $table->integer('reg_ate_pos_atual')->nullable();
            $table->integer('reg_ate_pos_inicial')->nullable();
            $table->boolean('reg_ate_agendado')->default(false);
            $table->timestamps();
            $table->softDeletes();
            // Foreign Keys
            $table->foreign('ger_pessoas_id')->references('ger_pessoas_id')->on('ger_pessoas');
            $table->foreign('reg_gpro_id')->references('reg_gpro_id')->on('reg_gprocedimentos');
            $table->foreign('reg_proc_id')->references('reg_proc_id')->on('reg_procedimentos');
            $table->foreign('reg_uni_id')->references('reg_uni_id')->on('reg_unidadessaude');
            $table->foreign('reg_med_id')->references('reg_med_id')->on('reg_medicos');
            $table->foreign('reg_tipo_id')->references('reg_tipo_id')->on('reg_tiposatendimento');
            $table->foreign('reg_ate_usuario')->references('id')->on('users');
            $table->foreign('reg_acs_id')->references('reg_acs_id')->on('reg_acs');

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reg_atendimentos');
        Schema::dropIfExists('reg_unidadessaude');
        Schema::dropIfExists('reg_medicos');
        Schema::dropIfExists('reg_procedimentos');
        Schema::dropIfExists('reg_gprocedimentos');
        Schema::dropIfExists('reg_acs');
        Schema::dropIfExists('reg_tiposatendimento');
    }
};
