import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Pessoa } from '@/types/pessoa';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import { DataTable } from "./TabelaStack/Tabela"
import { ColumnDef } from "@tanstack/react-table";

import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';

import { useRef, useCallback, useState } from 'react';

interface Props extends PageProps {
    pessoas: {
        data: Pessoa[];
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
export default function Index({ auth, pessoas, filters }: Props) {

    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const gridRef = useRef<any>(null);

    // Estado para paginação e ordenação
    const [pageIndex, setPageIndex] = useState(pessoas.current_page - 1);
    const [sort, setSort] = useState<{ id: string; desc: boolean } | null>(null);

    // Definição das colunas para pessoas
    const columns: ColumnDef<Pessoa>[] = [
        {
            accessorKey: 'ger_pessoas_nome',
            header: 'Nome',
            enableSorting: true,
            sortingFn: 'alphanumeric',
        },
        {
            accessorKey: 'ger_pessoas_cns',
            header: 'CNS',
        },
        {
            accessorKey: 'ger_pessoas_cpf',
            header: 'CPF',
        },
        {
            accessorKey: 'ger_pessoas_telefone1',
            header: 'Telefone',
        },
        {
            id: 'acoes',
            header: 'Ações',
            cell: ({ row }) => (
                <div className="flex justify-end space-x-2">
                    <Link href={route('administracao.pessoas.edit', row.original.ger_pessoas_id)}>
                        <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    // Atualiza busca
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Sempre volta para a primeira página ao buscar
        setPageIndex(0);
        window.location.href = route('administracao.pessoas.index') + '?search=' + encodeURIComponent(data.search);
    };

    // Paginação
    const handlePageChange = (page: number) => {
        setPageIndex(page);
        let url = route('administracao.pessoas.index') + `?page=${page + 1}`;
        if (data.search) url += `&search=${encodeURIComponent(data.search)}`;
        if (sort) url += `&sort=${sort.id}&direction=${sort.desc ? 'desc' : 'asc'}`;
        window.location.href = url;
    };

    // Ordenação
    const handleSortingChange = (sorting: any) => {
        if (sorting.length > 0) {
            setSort(sorting[0]);
            let url = route('administracao.pessoas.index') + `?page=1`;
            if (data.search) url += `&search=${encodeURIComponent(data.search)}`;
            url += `&sort=${sorting[0].id}&direction=${sorting[0].desc ? 'desc' : 'asc'}`;
            window.location.href = url;
        } else {
            setSort(null);
            let url = route('administracao.pessoas.index') + `?page=1`;
            if (data.search) url += `&search=${encodeURIComponent(data.search)}`;
            window.location.href = url;
        }
    };

    return (
        <AppLayout>
            <Head title="Pessoas" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Pessoas</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Lista de todas as pessoas cadastradas no sistema
                            </p>
                        </div>
                        <Link href={route('administracao.pessoas.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Pessoa
                            </Button>
                        </Link>
                    </div>
                    <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                        <Input
                            type="text"
                            name="search"
                            value={data.search}
                            onChange={e => setData('search', e.target.value)}
                            placeholder="Buscar por nome, CPF ou CNS"
                        />
                        <Button type="submit">Buscar</Button>
                    </form>
                    <div className="mt-4">
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
            </div>
        </AppLayout>
    );
} 