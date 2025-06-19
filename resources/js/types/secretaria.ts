export interface Secretaria {
    adm_secretarias_id: number;
    adm_secretarias_nome: string;
    adm_secretarias_abreviacao: string | null;
    adm_secretarias_status: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface SecretariaFormData {
    adm_secretarias_nome: string;
    adm_secretarias_abreviacao: string | null;
    adm_secretarias_status: boolean;
} 