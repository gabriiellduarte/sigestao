<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ger_pessoas', function (Blueprint $table) {
            $table->id('ger_pessoas_id');
            $table->string('ger_pessoas_nome', 100);
            $table->string('ger_pessoas_sexo', 20);
            $table->string('ger_pessoas_cns', 15)->nullable();
            $table->string('ger_pessoas_cpf', 11)->unique();
            $table->date('ger_pessoas_nascimento')->nullable();
            $table->string('ger_pessoas_telefone1', 11)->default('8899999999');
            $table->string('ger_pessoas_telefone2', 11)->nullable();
            $table->string('ger_pessoas_endereco',80)->nullable();
            $table->string('ger_pessoas_endereco_n', 10)->nullable();
            $table->string('ger_pessoas_endereco_bairro', 40)->nullable();
            $table->string('ger_pessoas_mae', 100)->nullable();
            $table->unsignedBigInteger('ger_localidades_id')->nullable();
            // Índices e chaves estrangeiras
            $table->foreign('ger_localidades_id')
                  ->references('ger_localidades_id')
                  ->on('ger_localidades');

            // Laravel padrão
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('srg_pacientes');
    }
};
