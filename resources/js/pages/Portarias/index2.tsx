import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ChevronDown, FileText, Building, ExternalLink, PersonStanding, Users, Gauge, Pencil, BookUser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { TablePortarias } from './componentes/tabelalistaportarias';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../Administracao/Pessoas/TabelaStack/Tabela';
import { PageProps } from '@/types';
import { Pessoa } from '@/types/pessoa';
import { Badge } from '@/components/ui/badge';

interface Portaria {
  doc_portarias_id: number;
  doc_portarias_numero: string;
  doc_portarias_servidor_nome: string;
  doc_portarias_servidor_cpf: string;
  adm_servidores_id: number;
  adm_cargos_id: number;
  adm_secretarias_id: number;
  doc_tiposportaria_id: number;
  doc_portarias_data: string;
  doc_portarias_descricao?: string;
  doc_portarias_link_documento?: string;
  doc_portarias_status: string;
  doc_portarias_publicadoem?: string | null;
  servidor?: any;
  cargo?: any;
  secretaria?: any;
  tipo_portaria?: any;
  user?: any;
}


  const getStatusColor = (portaria: string) => {
    if (portaria == 'cancelado'){
      return 'bg-red-100 text-red-800';
    }else if(portaria == 'publicado'){
      return 'bg-green-100 text-green-800';
    }else{
      return 'bg-yellow-100 text-yellow-800';
    }
    
  };

  const getStatusLabel = (portaria: string) => {
    if (portaria == 'cancelado'){
      return 'Cancelada';
    }else if(portaria == 'publicado'){
      return 'Publicada';
    }else{
      return 'Pendente';
    }
  };
  const columns: ColumnDef<Portaria>[] = [
    
    {
        accessorKey: 'doc_portarias_numero',
        header: 'Número',
    },
    {
        accessorKey: 'doc_portarias_servidor_nome',
        header: 'Servidor',
        enableSorting: true,
        cell:({row}) => {
            const cpf = row.original.doc_portarias_servidor_cpf;
            return <div className='text-left font-medium'>
                {row.getValue("doc_portarias_servidor_nome")} <br/>{cpf}
            </div>
        }
    },
    {
        accessorKey: 'cargo.adm_cargos_nome',
        header: 'Cargo',
    },
    {
        accessorKey: 'doc_portarias_status',
        header: 'Status',
        cell: ({row})=>{
            const portaria:string  = row.getValue("doc_portarias_status");
            return <Badge className={getStatusColor(portaria)}>
                {getStatusLabel(portaria)}
            </Badge>
        }
    },
    {
        id: 'acoes',
        header: 'Ações',
        cell: ({ row }) => (
            <div className="flex justify-end space-x-2">
                {row.original.doc_portarias_link_documento && (
                    <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(row.original.doc_portarias_link_documento, '_blank')}
                            title="Visualizar documento"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                    </Button>
                )}
                <Link href={route('documentos.portarias.edit', row.original.doc_portarias_id)}>
                    <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        ),
    },
];

  interface Props extends PageProps {
    pessoas: {
        data: Portaria[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        links: Array<any>;
    };
    filters: {
        search?: string;
    };
}
export default function ListaPortarias({pessoas, filters}: Props) {
    const [pageIndex, setPageIndex] = useState(pessoas.current_page - 1);
    const [sort, setSort] = useState<{ id: string; desc: boolean } | null>(null);
  const { portarias } = (usePage().props as any).portarias ? (usePage().props as any) : { portarias: { data: [] } };
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string|null>(null);
  const [importSuccess, setImportSuccess] = useState<string|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('tem index: ',pessoas.current_page);

  // Ordenação
  const handleSortingChange = (sorting: any) => {
    if (sorting.length > 0) {
        setSort(sorting[0]);
        router.get(route('documentos.portarias.index'), { buscar: data.search, page: 1, sort: sorting[0].id, direction: sorting[0].desc ? 'desc' : 'asc' }, { preserveState: true, replace: true });
    } else {
        setSort(null);
        router.get(route('documentos.portarias.index'), { buscar: data.search, page: 1 }, { preserveState: true, replace: true });
    }
};
  // Buscar no backend ao digitar
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      //if (searchTerm && searchTerm.trim().length >= 3) {
        router.get(route('documentos.portarias.index', { buscar: searchTerm }), undefined, { preserveState: true, replace: true });
      //}
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

    const { data, setData } = useForm({
        search: filters.search || '',
    });

  const handlePageChange = (page: number) => {
    setPageIndex(page);
    router.get(route('documentos.portarias.index'), { buscar: data.search, page: page + 1, sort: sort?.id, direction: sort?.desc ? 'desc' : 'asc' }, { preserveState: true, replace: true });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.xlsx')) {
      setImportError('O arquivo deve ser do tipo XLSX.');
      return;
    }
    setImportLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await router.post(route('documentos.portarias.import'), formData, {
        forceFormData: true,
        onSuccess: () => {
          setImportSuccess('Importação realizada com sucesso!');
          setShowImportModal(false);
        },
        onError: (errors: any) => {
          setImportError(errors?.file || 'Erro ao importar arquivo.');
        },
        onFinish: () => setImportLoading(false),
      });
    } catch (e) {
      setImportError('Erro inesperado ao importar.');
      setImportLoading(false);
    }
  };

  const handleImport = async () => {
    setImportError(null);
    setImportSuccess(null);
    if (!fileInputRef.current?.files?.length) {
      setImportError('Selecione um arquivo XLSX para importar.');
      return;
    }
    setImportLoading(true);
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      await router.post(route('documentos.portarias.import'), formData, {
        forceFormData: true,
        onSuccess: () => {
          setImportSuccess('Importação realizada com sucesso!');
          setShowImportModal(false);
        },
        onError: (errors: any) => {
          setImportError(errors?.file || 'Erro ao importar arquivo.');
        },
        onFinish: () => setImportLoading(false),
      });
    } catch (e) {
      setImportError('Erro inesperado ao importar.');
      setImportLoading(false);
    }
  };
    

    return(
        <AppLayout>
            <div className="space-y-4 md:space-y-6 p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Portarias</h2>
                    <p className="text-sm md:text-base text-gray-600">Gerencie as portarias do município</p>
                </div>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Link href={route('documentos.portarias.dashboard')}>
                <Button className="w-full md:w-auto">
                    <Gauge className="h-4 w-4 mr-2" />
                    Dashboard
                </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full md:w-auto">
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Outros
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={route('documentos.tiposdeportaria.index')} className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Tipos de Portaria
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={route('administracao.secretarias.index')} className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            Secretarias
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={route('administracao.servidores.index')} className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Servidores
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={route('administracao.pessoas.index')} className="flex items-center">
                            <BookUser className="h-4 w-4 mr-2" />
                            Pessoas
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={route('documentos.portarias.cadastro-servidor')} className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Cadastrar Pessoa/Servidor
                        </Link>
                      </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href={route('documentos.portarias.create')}>
                <Button className="w-full md:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Portaria
                </Button>
                </Link>
                <Button className="w-full md:w-auto" variant="secondary" onClick={() => setShowImportModal(true)}>
                Importar Portarias
                </Button>
            </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                placeholder="Buscar por servidor, tipo, função ou secretaria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                />
            </div>
            </div>
            <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
                {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                <span>Carregando...</span>
                            </div>
                        )}
                        <DataTable
                            columns={columns}
                            data={pessoas.data}
                            pageCount={pessoas.last_page}
                            pageIndex={pageIndex}
                            onPageChange={handlePageChange}
                            onSortingChange={handleSortingChange}
                        />
            </div>
            </div>
          
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h3 className="text-lg font-bold mb-4">Importar Portarias</h3>
              <input ref={fileInputRef} type="file" accept=".xlsx" className="mb-4" />
              {importError && <div className="text-red-600 mb-2 text-sm">{importError}</div>}
              {importSuccess && <div className="text-green-600 mb-2 text-sm">{importSuccess}</div>}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowImportModal(false)} disabled={importLoading}>Cancelar</Button>
                <Button onClick={handleImport} disabled={importLoading}>
                  {importLoading ? 'Importando...' : 'Importar'}
                </Button>
              </div>
            </div>
          </div>
        )}
            </div>
        </AppLayout>
    );
    
  }


