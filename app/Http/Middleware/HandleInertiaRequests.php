<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Spatie\Permission\Models\Permission;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $sessao = $request->session();

        $user = $request->user();
        $isAdmin = $user && $user->hasPermissionTo('Super Administrador');
        $allModulos = config('padroes.modulos');
        $userPermissions = $user ? $user->getAllPermissions()->pluck('name')->toArray() : [];

        // Filtra módulos conforme permissões do usuário
        $filteredModulos = [];
        if ($isAdmin) {
            $filteredModulos = $allModulos; // Admin vê todos os módulos
        } else {
            foreach ($allModulos as $key => $modulo) {
                $prefixo = $modulo['prefixo'] ?? null;
                if (!$prefixo) continue;
                // Verifica se alguma permissão do usuário contém o prefixo do módulo
                $temPermissao = false;
                foreach ($userPermissions as $perm) {
                    if (stripos($perm, $prefixo) !== false) {
                        $temPermissao = true;
                        break;
                    }
                }
                if ($temPermissao) {
                    $filteredModulos[$key] = $modulo;
                }
            }
        }

        // Captura a url base do sistema
        $baseUrl = $request->getSchemeAndHttpHost();

        // Descobre o módulo atual pelo primeiro segmento da URL
        $moduloAtualKey = $request->uri()->pathSegments()[0] ?? null;
        $menusFiltrados = [];
        if ($moduloAtualKey && isset($filteredModulos[$moduloAtualKey])) {
            $menus = $filteredModulos[$moduloAtualKey]['menus'] ?? [];
            // Se admin, mostra todos os menus
            if ($isAdmin) {
                $menusFiltrados = $menus;
            } else {
                foreach ($menus as $menu) {
                    // Se não houver permissão definida, mostra
                    if (empty($menu['permissoes'])) {
                        $menusFiltrados[] = $menu;
                        continue;
                    }
                    // Se o usuário tem pelo menos uma permissão do menu, mostra
                    $perms = is_array($menu['permissoes']) ? $menu['permissoes'] : [$menu['permissoes']];
                    foreach ($perms as $perm) {
                        foreach ($userPermissions as $userPerm) {
                            if (stripos($userPerm, $perm) !== false) {
                                $menusFiltrados[] = $menu;
                                break 2;
                            }
                        }
                    }
                }
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                'can'=>  $user?->getAllPermissions()?->pluck('name')?->flatMap(function ($permissionName) use ($user) {
                    return [$permissionName => $user->can($permissionName)];
                }) ?? [],
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'erro' => fn () => $request->session()->get('erro'),
                'sucesso' => fn()=> $request->session()->get('sucesso')
            ],
            'modulos'=> fn() => $filteredModulos,
            'moduloatual'=> $moduloAtualKey,
            'menuatual'=> fn() => $menusFiltrados,
            'baseUrl' => $baseUrl,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
