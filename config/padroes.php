<?php

return [
    'modulos'=>[
        'administracao'=>[
            'prefixo'=>'administracao',
            'nome'=>'Administração',
            'urlinicial'=>'/administracao/secretarias',
            'menus'=>[
                [
                    'nome'=>'Pessoas',
                    'prefixo_rota'=>'pessoas.index',
                    'middleware'=>'auth',
                    'permissoes'=>['viewAny', 'view', 'create', 'update', 'delete'],
                ],
                [
                    'nome'=>'Cargos',
                    'prefixo_rota'=>'cargos.index',
                    'middleware'=>'auth',
                    'permissoes'=>['viewAny', 'view', 'create', 'update', 'delete'],
                ],
                // Add other administration menus here
            ]
        ],
        'documentos'=>[
            'prefixo'=>'documentos',
            'nome'=>'Documentos',
            'urlinicial'=>'/documentos/portarias',
            'menus'=>[
                [
                    'nome'=>'Portarias',
                    'prefixo_rota'=>'portarias.index',
                    'permissoes'=>['portarias.visualizar', 'portarias.criar', 'portarias.editar', 'portarias.excluir'],
                    'submenus'=>[
                        [
                            'nome'=>'Dashboard',
                            'prefixo_rota'=>'documentos.portarias.dashboard',
                            'permissoes'=>['documentos.portarias.visualizar'],
                        ],
                        [
                            'nome'=>'Portarias Listagem',
                            'prefixo_rota'=>'documentos.portarias.index',
                            'permissoes'=>['documentos.portarias.visualizar'],
                        ],
                        [
                            'nome'=>'Por Servidor',
                            'prefixo_rota'=>'documentos.portarias.porservidor',
                            'permissoes'=>['documentos.portarias.porservidor.visualizar'],
                        ]
                    ]
                ],
                
            ]
        ],
        'regulacao'=>[
            'prefixo'=>'regulacao',
            'nome'=>'Regulação',
            'urlinicial'=>'/regulacao/dashboard',
            'menus'=>[
                [
                    'nome'=>'Dashboard',
                    'prefixo_rota'=>'dashboard',
                    'permissoes'=>['regulacao.dashboard.visualizar'],
                ],
                [
                    'nome'=>'Atendimentos',
                    'prefixo_rota'=>'regulacao.atendimentos.index',
                    'permissoes'=>['regulacao.atendimentos.visualizar', 'regulacao.atendimentos.editar', 'regulacao.atendimentos.criar'],
                    'submenus'=>[
                        [
                            'nome'=>'Lista de Espera',
                            'prefixo_rota'=>'regulacao.atendimentos.espera',
                            'permissoes'=>['regulacao.atendimentos.ver', 'regulacao.atendimentos.editar', 'regulacao.atendimentos.criar'],
                        ],
                    ]
                ],
                [
                    'nome'=>'Agendamentos',
                    'prefixo_rota'=>'agendamentos.index',
                    'permissoes'=>['regulacao.agendamentos.visualizar'],
                ],
                [
                    'nome'=>'Pacientes',
                    'prefixo_rota'=>'pacientes.index',
                    'permissoes'=>['regulacao.pacientes.visualizar', 'regulacao.pacientes.editar', 'regulacao.pacientes.criar'],
                ],
                [
                    'nome'=>'Grupos de Procedimentos',
                    'prefixo_rota'=>'grupos.index',
                    'permissoes'=>['regulacao.gprocedimentos.visualizar', 'regulacao.gprocedimentos.editar', 'regulacao.gprocedimentos.criar'],
                ],
                [
                    'nome'=>'Procedimentos',
                    'prefixo_rota'=>'procedimentos.index',
                    'permissoes'=>['regulacao.procedimentos.visualizar', 'regulacao.procedimentos.editar', 'regulacao.procedimentos.criar'],
                ],
                [
                    'nome'=>'Configurações',
                    'prefixo_rota'=>'configuracoes.index',
                    'permissoes'=>['regulacao.configuracoes.visualizar', 'regulacao.configuracoes.editar'],
                ],
                [
                    'nome'=>'Médicos',
                    'prefixo_rota'=>'medicos.index',
                    'permissoes'=>['regulacao.medicos.visualizar', 'regulacao.medicos.editar', 'regulacao.medicos.criar'],
                ],
                [
                    'nome'=>'Únidades de Saúde',
                    'prefixo_rota'=>'unidades.index',
                    'permissoes'=>['regulacao.unidades.visualizar', 'regulacao.unidades.editar', 'regulacao.unidades.criar'],
                ],
                [
                    'nome'=>'ACS',
                    'prefixo_rota'=>'acs.index',
                    'permissoes'=>['regulacao.acs.visualizar', 'regulacao.acs.editar', 'regulacao.acs.criar'],
                ],
                [
                    'nome'=>'Tipos de Atendimento',
                    'prefixo_rota'=>'tiposatendimento.index',
                    'permissoes'=>['regulacao.tiposatendimento.visualizar', 'regulacao.tiposatendimento.editar', 'regulacao.tiposatendimento.criar'],
                ],
                
                // Add other regulation menus here
            ]
        ],
        'bugueiros'=>[
            'prefixo'=>'bugueiros',
            'nome'=>'Bugueiros',
            'urlinicial'=>'/bugueiros/dashboard',
            'menus'=>[
                    [
                        'nome'=>'Dashboard',
                        'prefixo_rota'=>'dashboard',
                        'permissoes'=>['bugueiros.visualizar'],
                    ],
                    [
                        'nome'=>'Filas',
                        'prefixo_rota'=>'bugueiros.filas.index',
                        'permissoes'=>['bugueiros.visualizar'],
                    ],
                    [
                        'nome'=>'Cadastros',
                        'prefixo_rota'=>'bugueiros.cadastro.index',
                        'permissoes'=>['bugueiros.visualizar'],
                        'submenus'=>[
                            [
                                'nome'=>'Novo Bugueiro',
                                'prefixo_rota'=>'bugueiros.cadastro.index',
                                'permissoes'=>['bugueiros.visualizar'],
                            ],
                            [
                                'nome'=>'Parceiros',
                                'prefixo_rota'=>'bugueiros.parceiros.index',
                                'permissoes'=>['bugueiros.visualizar'],
                            ],
                        ]
                    ],
                    
                    [
                        'nome'=>'Passeios',
                        'prefixo_rota'=>'bugueiros.passeios.index',
                        'permissoes'=>['bugueiros.visualizar'],
                    ],
                    
                    
                    // Add other bugueiros menus here
                
            ]
            
        ],
        'configuracoes'=>[
            'prefixo'=>'configuracoes',
            'nome'=>'Configurações',
        ]
    ]
];