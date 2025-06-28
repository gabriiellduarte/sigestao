<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        // Desabilitar verificação SSL temporariamente
        config(['curl.verify' => false]);
        
        try {
            //ADICIONAR ISSO NA FUNÇÃO DO SOCIALITE PARA FORÇAR A SOLICTAÇÂO DE PERMISSÃO DO GOOGLE E GERAR O REFRESH TOKEN
            //->with([
            //    'access_type' => 'offline',
            //    'prompt' => 'consent select_account'])
            return Socialite::driver('google')
                ->scopes(['email', 'profile','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/documents'])
                ->redirect();
        } catch (\Exception $e) {
            Log::error('Erro no redirecionamento do Google: ' . $e->getMessage());
            return redirect()->route('login')->with('error', 'Erro ao iniciar autenticação com Google: ' . $e->getMessage());
        }
    }

    public function handleGoogleCallback()
    {
        try {
            Log::info('Iniciando callback do Google');
            Log::info('URL de callback: ' . request()->fullUrl());
            Log::info('Parâmetros recebidos: ' . json_encode(request()->all()));
            
            $usergoogle = Socialite::driver('google')->stateless()->user();
            Log::info('Usuário do Google recebido: ' . json_encode($usergoogle));

            $finduser = User::where('google_id', $usergoogle->id)->first();

            if ($finduser) {
                Auth::login($finduser);
                
                $finduser->name = $usergoogle->name;
                $finduser->access_token = $usergoogle->token;
                $finduser->refresh_token = $usergoogle->refreshToken;
                $finduser->update();
                    
                
                Log::info('Usuário existente encontrado e logado: ' . $finduser->email);
                
                // Verifica se o usuário é super adm ou tem acesso liberado no sistema.
                $tempermissao = $finduser->hasAnyPermission(['Super Administrador','Acesso Liberado']);
                if (!$tempermissao) {
                    Auth::logout();
                    Log::info('Usuário não tem permissão para acessar o sistema: ' . $finduser->email);
                    return redirect()->route('login')
                        ->with('message', 'Seu acesso está pendente de liberação pelo administrador. Por favor, aguarde.');
                }
            } else {
                $emailsepara = explode('@',string: $usergoogle->getEmail())[0];
                $newUser = User::where('user', $emailsepara)->first();
                if (!$newUser) {
                    $newUser = User::create([
                        'name' => $usergoogle->name,
                        'user' => $emailsepara,
                        'email' => $usergoogle->email,
                        'google_id' => $usergoogle->id,
                        'avatar'=>$usergoogle->getAvatar(),
                        'password' => bcrypt(Str::random(24))
                    ]);
                    Log::info('Novo usuário criado e logado: ' . $newUser->email);

                }else{
                    $newUser['google_id'] = $usergoogle->id;
                    $newUser['email'] = $usergoogle->getEmail();
                    $newUser['avatar'] = $usergoogle->getAvatar();
                    $newUser->save();
                }
                
                Auth::login($newUser);
                
                // Verifica se o novo usuário tem permissão para acessar o sistema
                if (!$newUser->hasAllRoles(Role::all())) {
                    Auth::logout();
                    Log::info('Novo usuário não tem permissão para acessar o sistema: ' . $newUser->email);
                    return redirect()->route('login')
                        ->with('error', 'Seu acesso está pendente de liberação pelo administrador. Por favor, aguarde.');
                }
            }

            return redirect()->intended('/');
        } catch (\Exception $e) {
            Log::error('Erro no callback do Google: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            Log::error('Request URL: ' . request()->fullUrl());
            Log::error('Request Method: ' . request()->method());
            Log::error('Request Input: ' . json_encode(request()->all()));
            
            return redirect()->route('login')
                ->with('error', 'Erro ao fazer login com Google. Por favor, tente novamente.');
        }
    }
} 