<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Secretaria;
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

        $secretarias = [
            ['nome' => 'CASA CIVIL', 'abreviacao' => 'CC'],
            ['nome' => 'CIDADANIA E DESENVOLVIMENTO SOCIAL', 'abreviacao' => 'SCDS'],
            ['nome' => 'CONTROLADORIA E OUVIDORIA', 'abreviacao' => 'CONTROL'],
            ['nome' => 'DESENVOLVIMENTO AGRÁRIO E RECURSO HÍDRICOS', 'abreviacao' => 'DARH'],
            ['nome' => 'DESENVOLVIMENTO ECONÔMICO, TRABALHO E RENDA', 'abreviacao' => 'DETR'],
            ['nome' => 'CULTURA', 'abreviacao' => 'CULT'],
            ['nome' => 'EDUCAÇÃO', 'abreviacao' => 'EDUC'],
            ['nome' => 'ESPORTE E LAZER', 'abreviacao' => 'ESP'],
            ['nome' => 'FINANÇAS', 'abreviacao' => 'FIN'],
            ['nome' => 'FUNDO MUNICIPAL DE SEGURIDADE SOCIAL', 'abreviacao' => 'FMSS'],
            ['nome' => 'GABINETE', 'abreviacao' => 'GAB'],
            ['nome' => 'INSTITUTO DE QUALIDADE DO MEIO AMBIENTE', 'abreviacao' => 'IQMA'],
            ['nome' => 'INFRAESTRUTURA E DESENVOLVIMENTO URBANO', 'abreviacao' => 'IDU'],
            ['nome' => 'LICITAÇÕES E CONTRATOS ADMINISTRATIVOS', 'abreviacao' => 'LCA'],
            ['nome' => 'MEIO AMBIENTE E CONTROLE URBANO', 'abreviacao' => 'MACU'],
            ['nome' => 'PLANEJAMENTO E ADMINISTRAÇÃO', 'abreviacao' => 'SEPLAD'],
            ['nome' => 'PROCURADORIA GERAL', 'abreviacao' => 'PG'],
            ['nome' => 'SAÚDE', 'abreviacao' => 'SAU'],
            ['nome' => 'SEGURANÇA CIDADÃ E ORDEM PÚBLICA', 'abreviacao' => 'SCOP'],
            ['nome' => 'TURISMO', 'abreviacao' => 'TUR']
        ];
        
        foreach ($secretarias as $sec) {
            Secretaria::firstOrCreate([
                'adm_secretarias_nome' => $sec['nome'],
                'adm_secretarias_abreviacao' => $sec['abreviacao'],
            ], [
                'adm_secretarias_status' => 1,
            ]);
        }
    }
}
