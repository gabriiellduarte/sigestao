import React from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Fila {
  fila_id: number;
  fila_data: string;
  fila_status: string;
  fila_obs?: string;
}

interface PageProps {
  filas: Fila[];
}

const ListaTodasFilas: React.FC = () => {
  const { props } = usePage<PageProps>();
  const filas = props.filas || [];

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold mb-4">Todas as Filas</h1>
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Filas</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Obs</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filas.map(fila => (
                  <tr key={fila.fila_id} className="border-b">
                    <td className="p-2">{fila.fila_id}</td>
                    <td className="p-2">{fila.fila_data ? new Date(fila.fila_data).toLocaleString('pt-BR') : '-'}</td>
                    <td className="p-2">{fila.fila_status}</td>
                    <td className="p-2">{fila.fila_obs || '-'}</td>
                    <td className="p-2">
                      <Button size="sm" onClick={() => router.get(`/bugueiros/filas/${fila.fila_id}/ver-completa`)}>
                        Ver detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
                {filas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">Nenhuma fila encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ListaTodasFilas; 