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
        Schema::create('doc_tiposportaria', function (Blueprint $table) {
            $table->id('doc_tiposportaria_id');
            $table->string('doc_tiposportaria_nome');
            $table->boolean('doc_tiposportaria_status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doc_tiposportaria');
    }
};
