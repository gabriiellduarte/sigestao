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
        Schema::table('bug_fila_x_bugueiro', function (Blueprint $table) {
            $table->string('obs')->nullable();
            $table->boolean('removido')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bug_fila_x_bugueiro', function (Blueprint $table) {
            $table->dropColumn('removido');
            $table->dropColumn('obs');
        });
    }
};
