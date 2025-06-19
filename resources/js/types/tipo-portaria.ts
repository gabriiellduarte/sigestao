export interface TipoPortaria {
  doc_tiposportaria_id: number;
  doc_tiposportaria_nome: string;
  doc_tiposportaria_status: boolean;
  created_at: string;
  updated_at: string;
}

export interface TipoPortariaFormData {
  doc_tiposportaria_nome: string;
  doc_tiposportaria_status: boolean;
  [key: string]: any;
} 