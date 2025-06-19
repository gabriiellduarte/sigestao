import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Paciente } from '@/types/paciente';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Trash, Pencil, Plus } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface Props extends PageProps {
    pacientes: {
        data: Paciente[];
        links: any[];
    };
}

export default function Index({ auth, pacientes }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este paciente?')) {
            router.delete(route('regulacao.pacientes.destroy', id));
        }
    };

    const filteredPacientes = pacientes.data.filter(paciente =>
        paciente.ger_pessoas_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.reg_paciente_cns.includes(searchTerm) ||
        (paciente.reg_paciente_cpf && paciente.reg_paciente_cpf.includes(searchTerm))
    );

    return (
        <AppLayout>
            <Head title="Pacientes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Pacientes</CardTitle>
                                <Button
                                    onClick={() => router.visit(route('regulacao.pacientes.create'))}
                                    className="flex items-center gap-2"
                                >
                                    <Plus /> Novo Paciente
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6">
                                <Input
                                    type="text"
                                    placeholder="Buscar por nome, CNS ou CPF..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="max-w-sm"
                                />
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>CNS</TableHead>
                                        <TableHead>CPF</TableHead>
                                        <TableHead>Nascimento</TableHead>
                                        <TableHead>Telefone</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPacientes.map((paciente) => (
                                        <TableRow key={paciente.reg_paciente_id}>
                                            <TableCell>{paciente.ger_pessoas_nome}</TableCell>
                                            <TableCell>{paciente.reg_paciente_cns}</TableCell>
                                            <TableCell>{paciente.reg_paciente_cpf}</TableCell>
                                            <TableCell>
                                                {new Date(paciente.reg_paciente_nascimento).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{paciente.reg_paciente_telefone1}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => router.visit(route('regulacao.pacientes.edit', paciente.reg_paciente_id))}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(paciente.reg_paciente_id)}
                                                    >
                                                        <Trash className="h-4 w-4" />
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