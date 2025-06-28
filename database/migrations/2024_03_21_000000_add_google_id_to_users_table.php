<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGoogleIdToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('user',191)->nullable()->after('email');
            $table->string('google_id')->nullable()->after('user');
            $table->string('avatar')->nullable()->after('google_id');
            $table->string('access_token')->nullable()->after('avatar');
            $table->string('refresh_token')->nullable()->after('access_token');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('google_id');
            $table->dropColumn('avatar');
            $table->dropColumn('user');
        });
    }
} 