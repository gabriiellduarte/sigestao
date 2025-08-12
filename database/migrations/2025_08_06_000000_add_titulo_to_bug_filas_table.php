<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bug_filas', function (Blueprint $table) {
            $table->string('fila_titulo')->nullable()->after('fila_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bug_filas', function (Blueprint $table) {
            $table->dropColumn('fila_titulo');
        });
    }
};
