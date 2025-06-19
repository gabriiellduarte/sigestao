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
        Schema::create('adm_servidores', function (Blueprint $table) {
            $table->id('adm_servidores_id');
            $table->unsignedBigInteger('ger_pessoas_id');
            // Índices e chaves estrangeiras
            $table->foreign('ger_pessoas_id')
                  ->references('ger_pessoas_id')
                  ->on('ger_pessoas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adm_servidores');
    }
};
