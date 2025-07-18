<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('bug_passeios', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bugueiro_id');
            $table->unsignedBigInteger('fila_id');
            $table->string('bugueiro_nome');
            $table->string('nome_passeio');
            $table->enum('tipoPasseio', ['normal', 'cortesia', 'parceria'])->default('normal');
            $table->dateTime('data_hora');
            $table->decimal('duracao', 4, 2);
            $table->decimal('valor', 8, 2);
            $table->string('parceiro')->nullable();
            $table->decimal('comissao_parceiro', 8, 2)->nullable();
            $table->text('observacoes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bug_passeios');
    }
}; 