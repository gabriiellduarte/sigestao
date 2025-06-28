import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';

interface Medico {
  reg_med_id: number;
  reg_med_nome: string;
}

interface IndexProps {
  medicos: {
    data: Medico[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function Index({ medicos }: IndexProps) {
  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este médico?')) {
      router.delete(route('regulacao.medicos.destroy', id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-800">Médicos</h1>
          <Link href={route('regulacao.medicos.create')}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Médico
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Médicos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicos.data.map((medico) => (
                  <TableRow key={medico.reg_med_id}>
                    <TableCell>{medico.reg_med_id}</TableCell>
                    <TableCell>{medico.reg_med_nome}</TableCell>
                    <TableCell>
                      <Link href={route('regulacao.medicos.edit', medico.reg_med_id)}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(medico.reg_med_id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {medicos.data.length === 0 && (
              <div className="text-center py-8 text-gray-500">Nenhum médico cadastrado.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 