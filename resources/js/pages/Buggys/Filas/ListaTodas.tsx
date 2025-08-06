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
  titulo?: string;
}

interface PageProps {
  filas: Fila[];
}

const ListaTodasFilas: React.FC = () => {
  const { props } = usePage<PageProps>();
  const filas = props.filas || [];

  const [showModal, setShowModal] = React.useState(false);

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Todas as Filas</h1>
          <Button onClick={() => setShowModal(true)} size="sm">Nova Fila</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Filas</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Título</th>
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
                    <td className="p-2">{fila.titulo || '-'}</td>
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
                    <td colSpan={6} className="text-center p-4 text-gray-500">Nenhuma fila encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Modal de Nova Fila */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Criar Nova Fila</h2>
              <form>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <input type="text" className="border rounded w-full p-2" placeholder="Título da fila" />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Observação</label>
                  <input type="text" className="border rounded w-full p-2" placeholder="Observação" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                  <Button type="submit">Criar</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ListaTodasFilas; 