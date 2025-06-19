export interface Paciente {
    ger_pessoas_id: number;
    ger_pessoas_nome: string;
    ger_pessoas_cns: string;
    ger_pessoas_cpf: string | null;
    ger_pessoas_nascimento: string;
    ger_pessoas_telefone1: string;
    ger_pessoas_telefone2: string | null;
    ger_pessoas_endereco: string | null;
    ger_pessoas_endereco_n: string | null;
    ger_pessoas_endereco_bairro: string | null;
    ger_pessoas_mae: string | null;
    ger_localidades_id: number | null;
    localidade?: {
        ger_localidades_id: number;
        ger_localidades_nome: string;
    };
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface PacienteFormData {
    ger_pessoas_nome: string;
    ger_pessoas_cns: string;
    ger_pessoas_cpf: string | null;
    ger_pessoas_nascimento: string;
    ger_pessoas_telefone1: string;
    ger_pessoas_telefone2: string | null;
    ger_pessoas_endereco: string | null;
    ger_pessoas_endereco_n: string | null;
    ger_pessoas_endereco_bairro: string | null;
    ger_pessoas_mae: string | null;
    ger_localidades_id: number | null;
    [key: string]: string | number | null;
}

export interface Localidade {
    ger_localidades_id: number;
    ger_localidades_nome: string;
} 