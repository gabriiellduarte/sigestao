<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Atendimentos
            'regulacao.atendimentos.visualizar',
            'regulacao.atendimentos.criar',
            'regulacao.atendimentos.editar',
            'regulacao.atendimentos.excluir',
            'regulacao.atendimentos.comprovante',
            'regulacao.atendimentos.proprios',
            // Agendamentos
            'regulacao.agendamentos.visualizar',
            'regulacao.agendamentos.criar',
            'regulacao.agendamentos.editar',
            'regulacao.agendamentos.excluir',
            'regulacao.agendamentos.proprios',
            // Arquivamentos
            'regulacao.arquivamentos.visualizar',
            'regulacao.arquivamentos.arquivar',
            'regulacao.arquivamentos.desarquivar',
            'regulacao.arquivamentos.proprios',
            // Pacientes
            'regulacao.pacientes.visualizar',
            'regulacao.pacientes.cadastrar',
            'regulacao.pacientes.editar',
            'regulacao.pacientes.excluir',
            // Procedimentos
            'regulacao.procedimentos.visualizar',
            'regulacao.procedimentos.cadastrar',
            'regulacao.procedimentos.editar',
            'regulacao.procedimentos.excluir',
            // Grupo de procedimentos
            'regulacao.gprocedimentos.visualizar',
            'regulacao.gprocedimentos.cadastrar',
            'regulacao.gprocedimentos.editar',
            'regulacao.gprocedimentos.excluir',
            // Vagas
            'regulacao.vagas.visualizar',
            'regulacao.vagas.gerenciar',
            'regulacao.vagas.exluir',
            // Outros
            'regulacao.relatorios.gerar',
            'regulacao.dashboard.visualizar',

            //Portarias
            'documentos.portarias.visualizar',
            'documentos.portarias.criar',
            'documentos.portarias.editar',
            'documentos.portarias.excluir',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission
            ], [
                'guard_name' => 'web',
                'descricao' => ucfirst(str_replace('.', ' ', $permission)),
            ]);
        }
    }
} 