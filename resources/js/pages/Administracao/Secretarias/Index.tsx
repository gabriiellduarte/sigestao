import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Secretaria } from '@/types/secretaria';
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
import { Badge } from '@/components/ui/badge';

interface Props extends PageProps {
    secretarias: Secretaria[];
}

export default function Index({ auth, secretarias }: Props) {
    return (
        <AppLayout>
            <Head title="Secretarias" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Secretarias</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Lista de todas as secretarias cadastradas no sistema
                            </p>
                        </div>
                        <Link href={route('administracao.secretarias.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Secretaria
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
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {secretarias.map((secretaria) => (
                                        <TableRow key={secretaria.adm_secretarias_id}>
                                            <TableCell>{secretaria.adm_secretarias_nome}</TableCell>
                                            <TableCell>{secretaria.adm_secretarias_abreviacao}</TableCell>
                                            <TableCell>
                                                <Badge variant={secretaria.adm_secretarias_status ? "success" : "destructive"}>
                                                    {secretaria.adm_secretarias_status ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link href={route('administracao.secretarias.edit', secretaria.adm_secretarias_id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('administracao.secretarias.destroy', secretaria.adm_secretarias_id)} method='put'>
                                                        <Button variant="destructive" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
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