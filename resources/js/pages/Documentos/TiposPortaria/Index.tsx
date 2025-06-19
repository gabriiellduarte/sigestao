import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { TipoPortaria } from '@/types/tipo-portaria';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Props extends PageProps {
  tiposPortaria: TipoPortaria[];
}

export default function Index({ tiposPortaria }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este tipo de portaria?')) {
      router.delete(route('documentos.tiposdeportaria.destroy', id));
    }
  };

  return (
    <AppLayout>
      <Head title="Tipos de Portaria" />
      
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tipos de Portaria</h1>
            <p className="text-gray-600">Gerencie os tipos de portaria disponíveis</p>
          </div>
          <Link href={route('documentos.tiposdeportaria.create')}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Tipos de Portaria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Nome</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tiposPortaria.map((tipo) => (
                    <tr key={tipo.doc_tiposportaria_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{tipo.doc_tiposportaria_nome}</td>
                      <td className="py-3 px-4">
                        <Badge variant={tipo.doc_tiposportaria_status ? "default" : "secondary"}>
                          {tipo.doc_tiposportaria_status ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link href={route('documentos.tiposdeportaria.edit', tipo.doc_tiposportaria_id)}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tipo.doc_tiposportaria_id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {tiposPortaria.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum tipo de portaria encontrado.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 