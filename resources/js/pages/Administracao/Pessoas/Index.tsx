import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Pessoa } from '@/types/pessoa';
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
    pessoas: Pessoa[];
}

export default function Index({ auth, pessoas }: Props) {
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

                    <Card>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>CNS</TableHead>
                                        <TableHead>CPF</TableHead>
                                        <TableHead>Telefone</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pessoas.map((pessoa) => (
                                        <TableRow key={pessoa.ger_pessoas_id}>
                                            <TableCell>{pessoa.ger_pessoas_nome}</TableCell>
                                            <TableCell>{pessoa.ger_pessoas_cns}</TableCell>
                                            <TableCell>{pessoa.ger_pessoas_cpf}</TableCell>
                                            <TableCell>{pessoa.ger_pessoas_telefone1}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={route('administracao.pessoas.edit', pessoa.ger_pessoas_id)}
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