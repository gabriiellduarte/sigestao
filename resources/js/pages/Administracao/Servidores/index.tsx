import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, ExternalLink, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { DataTable } from '../Pessoas/TabelaStack/Tabela';
import { ColumnDef } from '@tanstack/react-table';

interface Pessoa {
  ger_pessoas_id: number;
  ger_pessoas_nome: string;
  ger_pessoas_cpf: string;
  ger_pessoas_telefone1?: string;
  ger_pessoas_email?: string;
  status?: 'ativo' | 'inativo';
}

interface Servidor {
  adm_servidores_id: number;
  ger_pessoas_id: number;
  pessoa: Pessoa;
}

interface ServidoresPageProps extends PageProps {
  servidores: {
    data: Servidor[];
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
const columns: ColumnDef<Servidor>[] = [
    
  {
      accessorKey: 'adm_servidores_id',
      header: 'Número',
  },
  {
      accessorKey: 'pessoa.ger_pessoas_nome',
      header: 'Servidor',
      enableSorting: true,
  },
  {
    accessorKey: 'pessoa.ger_pessoas_cpf',
    header: 'CPF'
  },
  {
      id: 'acoes',
      header: 'Ações',
      cell: ({ row }) => (
          <div className="flex justify-end space-x-2">
              <Link href={route('administracao.servidores.edit', row.original.adm_servidores_id)}>
                  <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                  </Button>
              </Link>
          </div>
      ),
  },
  ];

export default function ListaServidores({servidores, filters}: ServidoresPageProps){
  const [searchTerm, setSearchTerm] = useState('');

  const [pageIndex, setPageIndex] = useState(servidores.current_page - 1);
  const [sort, setSort] = useState<{ id: string; desc: boolean } | null>(null);

  const { data, setData } = useForm({
    search: filters.search || '',
  });
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(route('administracao.servidores.index', { buscar: searchTerm }), undefined, { preserveState: true, replace: true });
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
  const handleSortingChange = (sorting: any) => {
    if (sorting.length > 0) {
        setSort(sorting[0]);
        router.get(route('administracao.servidores.index'), { buscar: data.search, page: 1, sort: sorting[0].id, direction: sorting[0].desc ? 'desc' : 'asc' }, { preserveState: true, replace: true });
    } else {
        setSort(null);
        router.get(route('administracao.servidores.index'), { buscar: data.search, page: 1 }, { preserveState: true, replace: true });
    }
};
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir este servidor?')) {
      router.delete(route('administracao.servidores.destroy', id));
    }
  };

  const handleEdit = (id: number) => {
    router.get(route('administracao.servidores.edit', id));
  };

  const handlePageChange = (page: number) => {
    setPageIndex(page);
    router.get(route('administracao.servidores.index'), { buscar: data.search, page: page + 1, sort: sort?.id, direction: sort?.desc ? 'desc' : 'asc' }, { preserveState: true, replace: true });
  };
  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Servidores</h2>
            <p className="text-sm md:text-base text-gray-600">Gerencie os servidores do município</p>
          </div>
          <Link href={route('administracao.servidores.create')}>
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Servidor
            </Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CPF, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <DataTable
              columns={columns} data={servidores.data}
              pageCount={servidores.last_page}
              pageIndex={pageIndex}
              onPageChange={handlePageChange}
              onSortingChange={handleSortingChange}
            />
            
          </div>
        </div>
        
      </div>
    </AppLayout>
  );
};