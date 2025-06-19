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
        Schema::create('adm_secretarias', function (Blueprint $table) {
            $table->id('adm_secretarias_id');
            $table->string('adm_secretarias_nome');
            $table->string('adm_secretarias_abreviacao')->nullable();
            $table->boolean('adm_secretarias_status')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adm_secretarias');
    }
};
