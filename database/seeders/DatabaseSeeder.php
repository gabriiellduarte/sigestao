<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Cria as permissões se não existirem
        $permissoes = ['Super Administrador', 'Acesso Bloqueado', 'Acesso Liberado'];

        foreach ($permissoes as $permissao) {
            Permission::firstOrCreate(['name' => $permissao]);
        }

        // 2. Cria ou atualiza o usuário
        $user = User::firstOrCreate(
            ['email' => 'gabriel.duarte@aracati.ce.gov.br'],
            [
                'name' => 'Gabriel Duarte',
                'password' => Hash::make('pma[nuti]'), // Altere para uma senha segura
            ]
        );

        // 3. Atribui as permissões diretamente ao usuário
        $user->givePermissionTo('Super Administrador');
    }
}
