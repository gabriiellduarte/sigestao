import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';

interface TipoAtendimento {
  reg_tipo_id: number;
  reg_tipo_nome: string;
  reg_tipo_peso: number;
}

interface IndexProps {
  tipos: {
    data: TipoAtendimento[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function Index({ tipos }: IndexProps) {
  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este tipo de atendimento?')) {
      router.delete(route('regulacao.tiposatendimento.destroy', id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-800">Tipos de Atendimento</h1>
          <Link href={route('regulacao.tiposatendimento.create')}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Tipos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tipos.data.map((tipo) => (
                  <TableRow key={tipo.reg_tipo_id}>
                    <TableCell>{tipo.reg_tipo_id}</TableCell>
                    <TableCell>{tipo.reg_tipo_nome}</TableCell>
                    <TableCell>{tipo.reg_tipo_peso}</TableCell>
                    <TableCell>
                      <Link href={route('regulacao.tiposatendimento.edit', tipo.reg_tipo_id)}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(tipo.reg_tipo_id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {tipos.data.length === 0 && (
              <div className="text-center py-8 text-gray-500">Nenhum tipo cadastrado.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 