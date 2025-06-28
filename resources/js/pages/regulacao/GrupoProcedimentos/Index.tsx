import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';

interface GrupoProcedimento {
  reg_gpro_id: number;
  reg_gpro_nome: string;
}

interface IndexProps {
  grupos: {
    data: GrupoProcedimento[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function Index({ grupos }: IndexProps) {
  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este grupo?')) {
      router.delete(route('regulacao.grupoprocedimentos.destroy', id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-800">Grupos de Procedimentos</h1>
          <Link href={route('regulacao.grupoprocedimentos.create')}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Grupo
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Grupos</CardTitle>
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
                {grupos.data.map((grupo) => (
                  <TableRow key={grupo.reg_gpro_id}>
                    <TableCell>{grupo.reg_gpro_id}</TableCell>
                    <TableCell>{grupo.reg_gpro_nome}</TableCell>
                    <TableCell>
                      <Link href={route('regulacao.grupoprocedimentos.edit', grupo.reg_gpro_id)}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(grupo.reg_gpro_id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {grupos.data.length === 0 && (
              <div className="text-center py-8 text-gray-500">Nenhum grupo cadastrado.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 