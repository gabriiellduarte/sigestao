<?php

return [
    'modulos'=>[
        'administracao'=>[
            'prefixo'=>'administracao',
            'nome'=>'Administração',
            'urlinicial'=>'/administracao/dashboard',
            'menus'=>[
                'pessoas'=>[
                    'nome'=>'Pessoas',
                    'prefixo_rota'=>'pessoas.index',
                    'middleware'=>'auth',
                    'permissoes'=>['viewAny', 'view', 'create', 'update', 'delete'],
                ],
                'cargos'=>[
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
        ],
        'regulacao'=>[
            'prefixo'=>'regulacao',
            'nome'=>'Regulação',
            'urlinicial'=>'/regulacao/dashboard',
            'menus'=>[
                'atendimentos'=>[
                    'nome'=>'Atendimentos',
                    'prefixo_rota'=>'atendimentos.index',
                ],
                // Add other regulation menus here
            ]
        ],
        'bugueiros'=>[
            'prefixo'=>'bugueiros',
            'nome'=>'Bugueiros',
        ],
        'configuracoes'=>[
            'prefixo'=>'configuracoes',
            'nome'=>'Configurações',
        ]
    ]
];