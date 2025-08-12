<?php

use App\Http\Controllers\Administracao\LogsController;
use App\Http\Controllers\Administracao\PortariasController;
use App\Http\Controllers\Administracao\ServidoresController;
use App\Http\Controllers\Buggys\BugueirosController;
use App\Http\Controllers\Buggys\FilaBugueirosController;
use App\Http\Controllers\Buggys\PasseiosController;
use App\Http\Controllers\Buggys\TipoDePasseioController;
use App\Http\Controllers\Regulacao\AgendamentosController;
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
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\Regulacao\AtendimentosController;
use App\Http\Controllers\Regulacao\RegGrupoProcedimentoController;
use App\Http\Controllers\Regulacao\RegProcedimentoController;
use App\Http\Controllers\Regulacao\RegMedicoController;
use App\Http\Controllers\Regulacao\RegUnidadeSaudeController;
use App\Http\Controllers\Regulacao\RegAcsController;
use App\Http\Controllers\Regulacao\RegTipoAtendimentoController;
use App\Http\Controllers\ParceirosController;
use Google\Service\Docs\Request;

Route::get('cracha', function(){
    return Inertia::render('Buggys/CrachaVirtual');
   });


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        // Recupera os módulos ativos da sessão
        $modulosAtivos = session('modulos_ativos', []);
        // Se for array associativo, transforma em array simples de valores
        if (!empty($modulosAtivos)) {
            //$modulosArray = array_values($modulosAtivos); // Garante que todos os valores sejam strings
            $configModulos = json_encode(config('padroes.modulos', []));
            $primeiroModulo = reset($modulosAtivos);
            return redirect($primeiroModulo['urlinicial']);
        }
        // Fallback: redireciona para login ou dashboard
        return redirect('/login');
    });

    Route::get('/atualizamenussessao', function () {
        // Atualiza os menus na sessão
        $user = Auth::user();
        $menus = AuthenticatedSessionController::geraMenusModulosNaSessao($user);
        return redirect()->back()->with('success', 'Menus atualizados com sucesso!');
    })->name('atualizamenussen');

    Route::get('/dashboard', function () {
        // Redireciona para a rota de dashboard
        return Inertia::render('dashboard');
    })->name('dashboard');
    

    // Rotas de Administração
    Route::prefix(config('padroes.modulos.administracao.prefixo'))->name('administracao.')->group(function () {
        Route::resource('pessoas', PessoaController::class);
        Route::get('pessoas-search', [PessoaController::class, 'search'])->name('pessoas.search');
        Route::resource('cargos', CargoController::class);
        Route::resource('secretarias', SecretariaController::class);
        Route::resource('localidades', LocalidadeController::class);
        Route::resource('servidores', ServidoresController::class);
        Route::resource('logs', LogsController::class);
        Route::get('servidores-search', [ServidoresController::class, 'search'])->name('servidores.search');
    });
    Route::prefix(config('padroes.modulos.documentos.prefixo'))->name('documentos.')->group(function () {
        Route::get('portarias/dashboard', [PortariasController::class,'dashboard'])->name('portarias.dashboard');
        Route::get('portarias/porservidor', [PortariasController::class,'listaporservidor'])->name('portarias.porservidor');
        // Cadastro rápido de pessoa/servidor para portarias
        Route::get('portarias/cadastro-servidor', [PortariasController::class, 'cadastroPessoaServidorForm'])->name('portarias.cadastro-servidor');
        Route::post('portarias/cadastro-servidor', [PortariasController::class, 'cadastroPessoaServidor'])->name('portarias.cadastro-servidor');

        Route::resource('tiposdeportaria', TipoPortariaController::class);
        Route::get('/portarias/proximonumero', [PortariasController::class, 'proximoNumero'])->name('portarias.proximonumero');

        Route::resource('portarias', PortariasController::class);
        Route::post('portarias/import', [PortariasController::class, 'import'])->name('portarias.import');

    });


    // Rotas Regulação
    Route::prefix(config('padroes.modulos.regulacao.prefixo'))->name('regulacao.')->group(function () {
        Route::get('listaatendimentos', function(){
            return Inertia::render('regulacao/atendimentos_lista',['nome'=>'testss']);
        });
        Route::get('novoatendimento', function(){
            return Inertia::render('regulacao/atendimentos_novo');
        })->name('atendimento.novo');

        Route::get('dashboard', function(){
            return Inertia::render('regulacao/dashboard');
        });

        // Rotas de Atendimentos
        Route::get('atendimentos/espera/{grupo?}', [AtendimentosController::class, 'espera'])->name('atendimentos.espera');

        Route::resource('atendimentos', AtendimentosController::class);
        Route::put('atendimentos/{atendimento}/arquivar', [AtendimentosController::class, 'arquivar'])->name('atendimentos.arquivar');
        Route::put('atendimentos/{atendimento}/desarquivar', [AtendimentosController::class, 'desarquivar'])->name('atendimentos.desarquivar');
        Route::put('atendimentos/{atendimento}/agendar', [AtendimentosController::class, 'agendar'])->name('atendimentos.agendar');
        Route::put('atendimentos/{atendimento}/desagendar', [AtendimentosController::class, 'desagendar'])->name('atendimentos.desagendar');
        Route::get('atendimentos/{atendimento}/comprovante', [AtendimentosController::class, 'comprovante'])->name('atendimentos.comprovante');
        //Rotas de Agendamentos
        Route::resource('agendamentos', AgendamentosController::class);

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

    Route::prefix(config('padroes.modulos.bugueiros.prefixo'))->name('bugueiros.')->group(function () {
       Route::resource('cadastro', BugueirosController::class);
       Route::post('passeios/adicionarpasseioemgrupo', [FilaBugueirosController::class, 'adicionarPasseioEmGrupo']);
       Route::resource('passeios', PasseiosController::class);
       // Rotas de Parceiros
       Route::resource('parceiros', ParceirosController::class);
       Route::resource('filas', FilaBugueirosController::class);
       // Rota para buscar bugueiros disponíveis para uma fila
       Route::get('filas/{fila_id}/bugueiros-disponiveis', [FilaBugueirosController::class, 'bugueirosDisponiveis']);
       Route::get('dashboard', [FilaBugueirosController::class, 'dashboard']);
       Route::get('dashboard-dados-reais', [FilaBugueirosController::class, 'dashboardDadosReais']);
       Route::get('todas-filas', [FilaBugueirosController::class, 'listarFilas'])->name('filas.todas');
       Route::get('filas/{fila}/ver-completa', [FilaBugueirosController::class, 'verFilaCompleta'])->name('filas.verCompleta');
       Route::post('filas/nova-com-todos', [FilaBugueirosController::class, 'novaFilaComTodos'])->name('filas.novaComTodos');
       Route::post('filas/{fila}/reordenar', [FilaBugueirosController::class, 'reordenarFila'])->name('filas.reordenar');
       Route::post('filas/{fila}/remover-simples/{id}', [FilaBugueirosController::class, 'removerSimples'])->name('filas.removerSimples');
       Route::post('filas/{fila}/remover-com-atraso/{id}', [FilaBugueirosController::class, 'removerComAtraso'])->name('filas.removerComAtraso');
       
        
       Route::resource('tipodepasseio', TipoDePasseioController::class);

       Route::post('filas/{fila_id}/adicionar', [FilaBugueirosController::class, 'adicionarBugueiro']);
       Route::post('filas/{fila_id}/adicionartodos', [FilaBugueirosController::class, 'adicionarTodosBugueiros']);
       Route::put('filas/{fila_id}/atualizar/{id}', [FilaBugueirosController::class, 'atualizarBugueiro']);
       Route::delete('filas/{fila_id}/remover/{id}', [FilaBugueirosController::class, 'removerBugueiro']);
       Route::post('filas/{fila_id}/mover-cima/{id}', [FilaBugueirosController::class, 'moverCima']);
       Route::post('filas/{fila_id}/mover-baixo/{id}', [FilaBugueirosController::class, 'moverBaixo']);

       

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
