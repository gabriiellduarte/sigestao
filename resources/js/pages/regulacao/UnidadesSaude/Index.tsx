import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';

interface UnidadeSaude {
  reg_uni_id: number;
  reg_uni_nome: string;
}

interface IndexProps {
  unidades: {
    data: UnidadeSaude[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function Index({ unidades }: IndexProps) {
  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta unidade?')) {
      router.delete(route('regulacao.unidadessaude.destroy', id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-800">Unidades de Saúde</h1>
          <Link href={route('regulacao.unidadessaude.create')}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Unidade
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Unidades</CardTitle>
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
                {unidades.data.map((unidade) => (
                  <TableRow key={unidade.reg_uni_id}>
                    <TableCell>{unidade.reg_uni_id}</TableCell>
                    <TableCell>{unidade.reg_uni_nome}</TableCell>
                    <TableCell>
                      <Link href={route('regulacao.unidadessaude.edit', unidade.reg_uni_id)}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(unidade.reg_uni_id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {unidades.data.length === 0 && (
              <div className="text-center py-8 text-gray-500">Nenhuma unidade cadastrada.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 