<?php

use App\Http\Controllers\Administracao\PortariasController;
use App\Http\Controllers\Administracao\ServidoresController;
use App\Http\Controllers\TipoPortariaController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Administracao\LocalidadeController;
use App\Http\Controllers\Regulacao\RegPacienteController;
use App\Http\Controllers\Administracao\PessoaController;
use App\Http\Controllers\Administracao\CargoController;
use App\Http\Controllers\Administracao\SecretariaController;
use App\Http\Controllers\Regulacao\AtendimentosController;
use App\Http\Controllers\Regulacao\RegGrupoProcedimentoController;
use App\Http\Controllers\Regulacao\RegProcedimentoController;
use App\Http\Controllers\Regulacao\RegMedicoController;
use App\Http\Controllers\Regulacao\RegUnidadeSaudeController;
use App\Http\Controllers\Regulacao\RegAcsController;
use App\Http\Controllers\Regulacao\RegTipoAtendimentoController;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('/', 'settings/profile');
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $permissoes = $user->getAllPermissions();

        return Inertia::render('dashboard');
    })->name('dashboard');

    // Rotas de Administração
    Route::prefix('administracao')->name('administracao.')->group(function () {
        Route::resource('pessoas', PessoaController::class);
        Route::resource('cargos', CargoController::class);
        Route::resource('secretarias', SecretariaController::class);
        Route::resource('localidades', LocalidadeController::class);
        Route::resource('servidores', ServidoresController::class);

    });
    Route::prefix('documentos')->name('documentos.')->group(function () {
        Route::get('portarias/dashboard', [PortariasController::class,'dashboard'])->name('portarias.dashboard');
        Route::get('portarias/porservidor', [PortariasController::class,'listaporservidor'])->name('portarias.porservidor');
        
        Route::resource('tiposdeportaria', TipoPortariaController::class);

        Route::resource('portarias', PortariasController::class);
        

    });


    // Rotas Regulação
    Route::prefix('regulacao')->name('regulacao.')->group(function () {
        Route::get('listaatendimentos', function(){
            return Inertia::render('regulacao/atendimentos_lista',['nome'=>'testss']);
        });
        Route::get('novoatendimento', function(){
            return Inertia::render('regulacao/atendimentos_novo');
        })->name('atendimento.novo');

        Route::get('pacientes', function(){
            return Inertia::render('regulacao/pacientes',['nome'=>'testss']);
        });

        Route::get('dashboard', function(){
            return Inertia::render('regulacao/dashboard');
        });

        // Rotas de Atendimentos
        Route::resource('atendimentos', AtendimentosController::class);
        Route::put('atendimentos/{atendimento}/arquivar', [AtendimentosController::class, 'arquivar'])->name('atendimentos.arquivar');
        Route::put('atendimentos/{atendimento}/desarquivar', [AtendimentosController::class, 'desarquivar'])->name('atendimentos.desarquivar');
        Route::put('atendimentos/{atendimento}/agendar', [AtendimentosController::class, 'agendar'])->name('atendimentos.agendar');
        Route::put('atendimentos/{atendimento}/desagendar', [AtendimentosController::class, 'desagendar'])->name('atendimentos.desagendar');

        // Rotas de Pacientes
        Route::resource('pacientes', RegPacienteController::class);

        // Rotas de cadastros auxiliares da Regulação
        Route::resource('grupoprocedimentos', RegGrupoProcedimentoController::class)->parameters(['grupoprocedimentos' => 'grupoprocedimento']);
        Route::resource('procedimentos', RegProcedimentoController::class)->parameters(['procedimentos' => 'procedimento']);
        Route::resource('medicos', RegMedicoController::class)->parameters(['medicos' => 'medico']);
        Route::resource('unidadessaude', RegUnidadeSaudeController::class)->parameters(['unidadessaude' => 'unidadessaude']);
        Route::resource('acs', RegAcsController::class)->parameters(['acs' => 'ac']);
        Route::resource('tiposatendimento', RegTipoAtendimentoController::class)->parameters(['tiposatendimento' => 'tiposatendimento']);
    });
    Route::get('home', function () {
        return Inertia::render('home');
    });
    Route::get('tasks', function () {
        return Inertia::render('tasks');
    });

    // Rotas de Permissões
    Route::resource('permissions', PermissionController::class);
    
    // Rotas de Perfis
    Route::resource('roles', RoleController::class);

    // Rotas de usuários
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
