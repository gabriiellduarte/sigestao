<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(125);

        //GD Se for ativar dnv ver a questão de um loop que estava dando no handleinertia pode ser que seja por causa disso dava problema no usuário da relciana dos bugueiros
        //Gate::before(function ($user, $ability) {
        //    $permissao = $user->can('Super Administrador');
        //    return $user->can('Super Administrador') ? true : null;
        //});
    }
}
