import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { debounce } from 'lodash';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';

interface Localidade {
    ger_localidades_id: number;
    ger_localidades_nome: string;
    ativo: boolean;
}

interface Props {
    localidades: {
        data: Localidade[];
        links: any[];
    };
    filters: {
        search: string;
    };
}

export default function Index({ localidades, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = debounce((value: string) => {
        router.get(
            route('administracao.localidades.index'),
            { search: value },
            { preserveState: true, preserveScroll: true }
        );
    }, 300);

    const handleDelete = (id: number) => {
        router.delete(route('administracao.localidades.destroy', id));
    };

    return (
        <AppLayout>
            <Head title="Localidades" />
            <div className="space-y-6 p-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Localidades</CardTitle>
                    <div className="flex items-center gap-4">
                        <Input
                            type="search"
                            placeholder="Buscar localidades..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            className="w-64"
                        />
                        <Button asChild>
                            <Link href={route('administracao.localidades.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Localidade
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {localidades.data.map((localidade) => (
                                <TableRow key={localidade.ger_localidades_id}>
                                    <TableCell>{localidade.ger_localidades_nome}</TableCell>
                                    <TableCell>{localidade.ger_localidades_id}</TableCell>
                                    <TableCell>
                                        <Badge variant={localidade.ativo ? 'default' : 'destructive'}>
                                            {localidade.ativo ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={route('administracao.localidades.edit', localidade.ger_localidades_id)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tem certeza que deseja excluir esta localidade? Esta ação não pode ser desfeita.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(localidade.ger_localidades_id)}>
                                                            Confirmar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            </div>
            
        </AppLayout>
    );
} 