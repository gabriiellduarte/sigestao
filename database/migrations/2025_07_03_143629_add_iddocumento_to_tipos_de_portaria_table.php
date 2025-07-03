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
        Schema::table('doc_tiposportaria', function (Blueprint $table) {
            $table->string('doc_tiposportaria_iddocumento')->nullable()->after('doc_tiposportaria_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doc_tiposportaria', function (Blueprint $table) {
            $table->dropColumn('doc_tiposportaria_iddocumento');
        });
    }
};
