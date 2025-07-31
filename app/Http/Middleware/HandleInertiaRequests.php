<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
        $baseUrl = $request->getSchemeAndHttpHost();
        $moduloAtualKey = $request->segment(1); // caminho atual
        $modulos = session('modulos_ativos', []);
        $menusPorModulo = session('menus_por_modulo', []);
        $permissions = session('permissoes_usuario', []);
        $menusFiltrados = $menusPorModulo[$moduloAtualKey] ?? [];

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                'can'=> collect($permissions)->flatMap(function ($perm) use ($user) {
                    return [$perm => $user->can($perm)];
                }),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'erro' => fn () => $request->session()->get('erro'),
                'sucesso' => fn()=> $request->session()->get('sucesso')
            ],
            'modulos'=> fn() => $modulos,
            'moduloatual'=> $moduloAtualKey,
            'menuatual'=> fn() => $menusFiltrados,
            'baseUrl' => $baseUrl,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
