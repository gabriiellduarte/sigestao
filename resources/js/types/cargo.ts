export interface Cargo {
    adm_cargos_id: number;
    adm_argos_nome: string;
    adm_cargos_abreviacao: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CargoFormData {
    adm_cargos_nome: string;
    adm_cargos_abreviacao: string | null;
    [key: string]: any;
} 