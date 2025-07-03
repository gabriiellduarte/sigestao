import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Cargo } from '@/types/cargo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Props extends PageProps {
    cargos: Cargo[];
}

export default function Index({ auth, cargos }: Props) {
    return (
        <AppLayout>
            <Head title="Cargos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Cargos</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Lista de todos os cargos cadastrados no sistema
                            </p>
                        </div>
                        <Link href={route('administracao.cargos.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Novo Cargo
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Abreviação</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cargos.map((cargo) => (
                                        <TableRow key={cargo.adm_cargos_id}>
                                            <TableCell>{cargo.adm_cargos_nome}</TableCell>
                                            <TableCell>{cargo.adm_cargos_abreviacao}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={route('administracao.cargos.edit', cargo.adm_cargos_id)}
                                                    >
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="destructive" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 