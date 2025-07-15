import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Calendar, User, MapPin, Clock, Eye, Hash, ArrowLeft, Plus, Edit, Archive, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { DataTable } from '@/pages/Administracao/Pessoas/TabelaStack/Tabela';
import { GrupoProcedimento } from '@/types';

interface Atendimento {
  reg_ate_id: number;
  reg_ate_protocolo: string;
  reg_ate_prioridade: boolean;
  reg_ate_datendimento: string;
  reg_ate_drequerente: string;
  reg_ate_obs: string | null;
  reg_ate_arquivado: boolean;
  reg_ate_agendado: boolean;
  reg_ate_pos_atual: number | null;
  reg_ate_pos_inicial: number | null;
  reg_ate_protoc_solicitante: string | null;
  reg_ate_retroativo: boolean;
  pessoa: {
    ger_pessoas_id: number;
    ger_pessoas_nome: string;
    ger_pessoas_cpf: string;
  };
  procedimento: {
    reg_proc_id: number;
    reg_proc_nome: string;
  };
  grupo_procedimento: {
    reg_gpro_id: number;
    reg_gpro_nome: string;
  };
  tipo_atendimento: {
    reg_tipo_id: number;
    reg_tipo_nome: string;
    reg_tipo_peso: number;
  };
  unidade_saude: {
    reg_uni_id: number;
    reg_uni_nome: string;
  } | null;
  medico: {
    reg_med_id: number;
    reg_med_nome: string;
  } | null;
  acs: {
    reg_acs_id: number;
    reg_acs_nome: string;
  } | null;
  created_at: string;
}
type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}
interface ListaEsperaProps {
  atendimentos: {
    data: Atendimento[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  grupos: GrupoProcedimento[];
  filters: {
    search?: string;
  };
}
 
export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  
  // ...
]

export default function ListaEspera({ grupos,atendimentos, filters }: ListaEsperaProps) {

  const { data, setData } = useForm({
    search: filters.search || ''
  });


  const [pageIndex, setPageIndex] = useState(atendimentos.current_page - 1);
  const [sort, setSort] = useState<{ id: string; desc: boolean } | null>(null);

  // Removido searchTerm, usaremos o campo controlado do useForm
  const [selectedProcedimento, setSelectedProcedimento] = useState('todos');
  const [selectedGrupoProcedimento, setSelectedGrupoProcedimento] = useState('todos');
  const [selectedPrioridade, setSelectedPrioridade] = useState('todos');

  // Extrair dados únicos para filtros
  // Agora usamos o array de grupos diretamente para montar o select
  const procedimentos = [...new Set(atendimentos.data.map(a => a.procedimento.reg_proc_nome))];

  // Handler para busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGrupoProcedimento !== 'todos') {
      router.get(route('regulacao.atendimentos.index'), { grupo: selectedGrupoProcedimento, search: data.search }, { preserveState: true, replace: true });
    }
  };

  // Paginação
  const handlePageChange = (page: number) => {
    setPageIndex(page);
    router.get(route('regulacao.atendimentos.index'), { grupo: selectedGrupoProcedimento, search: data.search, page: page + 1, sort: sort?.id, direction: sort?.desc ? 'desc' : 'asc' }, { preserveState: true, replace: true });
  };
  // Ordenação
  const handleSortingChange = (sorting: any) => {
    if (sorting.length > 0) {
      setSort(sorting[0]);
      router.get(route('regulacao.atendimentos.index'), { grupo: selectedGrupoProcedimento, search: data.search, page: 1, sort: sorting[0].id, direction: sorting[0].desc ? 'desc' : 'asc' }, { preserveState: true, replace: true });
    } else {
      setSort(null);
      router.get(route('regulacao.atendimentos.index'), { grupo: selectedGrupoProcedimento, search: data.search, page: 1 }, { preserveState: true, replace: true });
    }
  };

  // Handler: atualiza o grupo selecionado e faz reload
  const handleGrupoChange = (grupoId: string) => {
    setSelectedGrupoProcedimento(grupoId);
    // Filtra a tabela imediatamente ao selecionar
    if (grupoId !== 'todos') {
      router.get(route('regulacao.atendimentos.index'), { grupo: grupoId }, { preserveState: true, replace: true });
    } else {
      router.get(route('regulacao.atendimentos.index'), {}, { preserveState: true, replace: true });
    }
  };

  // Definição das colunas para TanStack Table
  const columns: ColumnDef<Atendimento>[] = [
      {
        header: 'Ações',
        cell: ({ row }) => {
          const atendimento = row.original;
          return (
            <div className="flex items-center space-x-2">
              <Link href={route('regulacao.atendimentos.edit', atendimento.reg_ate_id)}>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              {!atendimento.reg_ate_arquivado ? (
                <Button variant="ghost" size="sm">
                  <Archive className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4" />
                </Button>
              )}
              {!atendimento.reg_ate_agendado ? (
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
      {
        header: 'Posição',
        cell: ({ row }) => (
          <div className={`flex items-center ${getPosicaoColor(row.index + 1)}`}>
            <Hash className="h-4 w-4 mr-1" />
            {row.index + 1}
          </div>
        ),
      },
      {
        header: 'Protocolo',
        accessorKey: 'reg_ate_protocolo',
        cell: info => <div className="font-mono text-sm">{info.getValue() as string}</div>,
      },
      {
        header: 'Paciente',
        cell: ({ row }) => (
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            <div>
              <div className="font-medium">{row.original.pessoa.ger_pessoas_nome}</div>
              {row.original.unidade_saude && (
                <div className="text-sm text-gray-500 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {row.original.unidade_saude.reg_uni_nome}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        header: 'CPF',
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.pessoa.ger_pessoas_cpf}</span>
        ),
      },
      {
        header: 'Procedimento',
        cell: ({ row }) => row.original.procedimento.reg_proc_nome,
      },
      {
        header: 'Grupo',
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.grupo_procedimento.reg_gpro_nome}</Badge>
        ),
      },
      {
        header: 'Tipo',
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.tipo_atendimento.reg_tipo_nome}</Badge>
        ),
      },
      {
        header: 'Prioridade',
        cell: ({ row }) => (
          <Badge className={getPrioridadeColor(row.original.reg_ate_prioridade)}>
            {getPrioridadeText(row.original.reg_ate_prioridade)}
          </Badge>
        ),
      },
      {
        header: 'Data Inclusão',
        cell: ({ row }) => (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            {formatDate(row.original.created_at)}
          </div>
        ),
      },
      {
        header: 'Tempo Espera',
        cell: ({ row }) => (
          <div className={`flex items-center font-medium ${getTempoEsperaColor(row.original.created_at)}`}>
            <Clock className="h-4 w-4 mr-1" />
            {getTempoEspera(row.original.created_at)} dias
          </div>
        ),
      },
    ];
  

  const getPrioridadeColor = (prioridade: boolean) => {
    return prioridade ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const getPrioridadeText = (prioridade: boolean) => {
    return prioridade ? 'Prioritário' : 'Normal';
  };

  const getTempoEsperaColor = (dataCriacao: string) => {
    const dias = Math.floor((new Date().getTime() - new Date(dataCriacao).getTime()) / (1000 * 60 * 60 * 24));
    if (dias > 30) return 'text-red-600';
    if (dias > 15) return 'text-orange-600';
    return 'text-green-600';
  };

  const getTempoEspera = (dataCriacao: string) => {
    const dias = Math.floor((new Date().getTime() - new Date(dataCriacao).getTime()) / (1000 * 60 * 60 * 24));
    return dias;
  };

  const getPosicaoColor = (posicao: number) => {
    if (posicao <= 3) return 'text-red-600 font-bold';
    if (posicao <= 10) return 'text-orange-600 font-semibold';
    return 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const clearFilters = () => {
    setData('search', ''); // Limpa o campo de busca
    setSelectedProcedimento('todos');
    setSelectedGrupoProcedimento('todos');
    setSelectedPrioridade('todos');
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Atendimentos</h1>
              <p className="text-gray-600">Gerenciamento da fila de atendimentos</p>
            </div>
          </div>
          <Link href={route('regulacao.atendimentos.create')}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                    Novo Atendimento
                </Button>
            </Link>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Busca */}
              <form className="relative" onSubmit={handleSearch}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar paciente, CPF..."
                  value={data.search}
                  onChange={e => setData('search', e.target.value)}
                  className="pl-10"
                  disabled={selectedGrupoProcedimento === 'todos'}
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  disabled={selectedGrupoProcedimento === 'todos'}
                  variant="outline"
                  size="sm"
                >Buscar</Button>
              </form>

              {/* Grupo de Procedimento */}
              <Select value={selectedGrupoProcedimento} onValueChange={handleGrupoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Grupo de Procedimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os grupos</SelectItem>
                  {grupos.map((grupo) => (
                    <SelectItem key={grupo.reg_gpro_id} value={String(grupo.reg_gpro_id)}>{grupo.reg_gpro_nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Procedimento */}
              <Select value={selectedProcedimento} onValueChange={setSelectedProcedimento}>
                <SelectTrigger>
                  <SelectValue placeholder="Procedimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os procedimentos</SelectItem>
                  {procedimentos.map((procedimento) => (
                    <SelectItem key={procedimento} value={procedimento}>{procedimento}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Prioridade */}
              <Select value={selectedPrioridade} onValueChange={setSelectedPrioridade}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as prioridades</SelectItem>
                  <SelectItem value="prioritario">Prioritário</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>

              {/* Botão limpar filtros */}
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Atendimentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Hash className="h-6 w-6 mr-2" />
              Atendimentos na Fila de Espera
            </CardTitle>
            <div className="text-sm text-gray-600">
                Total: {atendimentos.total} atendimentos
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {selectedGrupoProcedimento !== 'todos' ? (
                <DataTable 
                  columns={columns} 
                  data={atendimentos.data} 
                  pageIndex={pageIndex}
                  pageCount={atendimentos.last_page}
                  onPageChange={handlePageChange}
                  onSortingChange={handleSortingChange}
                />
              ) : (
                <div className="text-center py-8">
                  <Hash className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione um grupo de procedimento</h3>
                  <p className="text-gray-500 mb-4">
                    Para visualizar os atendimentos, selecione um grupo de procedimento no filtro acima.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 