import React from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, } from '@/components/ui/alert-dialog';

interface Fila {
  fila_id: number;
  fila_data: string;
  fila_status: string;
  fila_obs?: string;
  fila_titulo?: string;
}

interface PageProps {
  filas: Fila[];
}

const ListaTodasFilas: React.FC = () => {
  const { props } = usePage<PageProps>();
  const filas = props.filas || [];

  const [showModal, setShowModal] = React.useState(false);
  const [titulo, setTitulo] = React.useState("");
  const [obs, setObs] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    router.post(
      '/bugueiros/filas',
      { titulo, fila_obs: obs },
      {
        onSuccess: () => {
          setShowModal(false);
          setTitulo("");
          setObs("");
        },
        onError: (errors: any) => {
          setError(errors?.titulo || 'Erro ao criar fila.');
        },
        preserveScroll: true,
        preserveState: false,
      }
    );
    setLoading(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Todas as Filas</h1>
            {/* Botão para abrir o AlertDialog */}
            <AlertDialog open={showModal} onOpenChange={setShowModal}>
              <AlertDialogTrigger asChild>
                <Button onClick={() => setShowModal(true)} size="sm">Nova Fila</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Criar Nova Fila</AlertDialogTitle>
                </AlertDialogHeader>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3"
                  // Evita submit duplo pelo enter no AlertDialog
                  autoComplete="off"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">Título</label>
                    <input
                      type="text"
                      className="border rounded w-full p-2"
                      placeholder="Título da fila"
                      value={titulo}
                      onChange={e => setTitulo(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Observação</label>
                    <input
                      type="text"
                      className="border rounded w-full p-2"
                      placeholder="Observação"
                      value={obs}
                      onChange={e => setObs(e.target.value)}
                    />
                  </div>
                  {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
                  <AlertDialogFooter>
                    <AlertDialogCancel type="button" disabled={loading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Criando...' : 'Criar'}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
        </div>
        {/* ...restante do código da tabela... */}
      
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
                    <td className="p-2">{fila.fila_titulo || '-'}</td>
                    <td className="p-2">{fila.fila_data ? new Date(fila.fila_data).toLocaleString('pt-BR') : '-'}</td>
                    <td className="p-2">{fila.fila_status}</td>
                    <td className="p-2">{fila.fila_obs || '-'}</td>
                    <td className="flex p-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.get(route('bugueiros.filas.verCompleta',fila.fila_id))}>
                        Ver Histórico
                      </Button>
                      <Button size="sm" onClick={() => router.get(route('bugueiros.filas.show',fila.fila_id))}>
                        Ver Fila
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

                
        
      </div>
    </AppLayout>
  );
};

export default ListaTodasFilas; 