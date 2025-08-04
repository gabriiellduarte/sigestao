<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login2', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            $request->authenticate();
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Retorna com flash 'erro' se falhar autenticação
            return redirect()->route('login')->with('erro', 'Email ou senha incorretos.');
        }

        $user = Auth::user();

        // Verifica se o usuário é super adm ou tem acesso liberado no sistema.
        $tempermissao = $user->hasAnyPermission(['Super Administrador','Acesso Liberado']);
        if (!$tempermissao) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->with('erro', 'Você não tem permissão para acessar o sistema.');
        }
        
        $request->session()->regenerate();
        $geraMenus = $this->geraMenusModulosNaSessao($user);

        return redirect()->intended(route('documentos.portarias.index', absolute: false));
    }

    public static function geraMenusModulosNaSessao($user){
        $isAdmin = $user->hasPermissionTo('Super Administrador');
        $allModulos = config('padroes.modulos');
        $userPermissions = $user->getAllPermissions()->pluck('name')->toArray();

        $filteredModulos = [];

        if ($isAdmin) {
            $filteredModulos = $allModulos;
        } else {
            foreach ($allModulos as $key => $modulo) {
                $prefixo = $modulo['prefixo'] ?? null;
                if (!$prefixo) continue;

                foreach ($userPermissions as $perm) {
                    if (stripos($perm, $prefixo) !== false) {
                        $filteredModulos[$key] = $modulo;
                        break;
                    }
                }
            }
        }

        // Monta todos os menus possíveis por módulo
        $menusPorModulo = [];

        foreach ($filteredModulos as $key => $modulo) {
            $menus = $modulo['menus'] ?? [];

            if ($isAdmin) {
                $menusPorModulo[$key] = $menus;
            } else {
                foreach ($menus as $menu) {
                    if (empty($menu['permissoes'])) {
                        $menusPorModulo[$key][] = $menu;
                        continue;
                    }

                    $perms = is_array($menu['permissoes']) ? $menu['permissoes'] : [$menu['permissoes']];
                    foreach ($perms as $perm) {
                        foreach ($userPermissions as $userPerm) {
                            if (stripos($userPerm, $perm) !== false) {
                                $menusPorModulo[$key][] = $menu;
                                break 2;
                            }
                        }
                    }
                }
            }
        }
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();

        // Salva tudo na sessão
        session([
            'modulos_ativos' => $filteredModulos,
            'menus_por_modulo' => $menusPorModulo,
            'permissoes_usuario' => $permissions,
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
