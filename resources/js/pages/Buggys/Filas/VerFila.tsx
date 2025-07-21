import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BugueiroFila {
  id: number;
  bugueiro_id: number;
  posicao_fila: number;
  fez_passeio: boolean;
  removido: boolean;
  hora_entrada: string;
  hora_passeio: string;
  bugueiro: {
    bugueiro_nome: string;
    bugueiro_posicao_oficial: number;
  };
}

interface PageProps {
  fila: {
    fila_id: number;
    fila_data: string;
    fila_status: string;
    fila_obs?: string;
  };
  bugueiros_fila: BugueiroFila[];
}

const VerFila: React.FC = () => {
  const { props } = usePage<PageProps>();
  const { fila, bugueiros_fila } = props;

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold mb-4">Fila #{fila.fila_id} - {fila.fila_data ? new Date(fila.fila_data).toLocaleString('pt-BR') : ''}</h1>
        <Card>
          <CardHeader>
            <CardTitle>Bugueiros da Fila</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Posição</th>
                  <th className="text-left p-2">Bugueiro</th>
                  <th className="text-left p-2">Oficial</th>
                  <th className="text-left p-2">Hora Entrada</th>
                  <th className="text-left p-2">Hora Passeio</th>
                  <th className="text-left p-2">Fez Passeio</th>
                  <th className="text-left p-2">Removido</th>
                </tr>
              </thead>
              <tbody>
                {bugueiros_fila.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.posicao_fila}</td>
                    <td className="p-2">{item.bugueiro?.bugueiro_nome}</td>
                    <td className="p-2">{item.bugueiro?.bugueiro_posicao_oficial}</td>
                    <td className="p-2">{item.hora_entrada}</td>
                    <td className="p-2">{item.hora_passeio || '-'}</td>
                    <td className="p-2">{item.fez_passeio ? 'Sim' : 'Não'}</td>
                    <td className="p-2">{item.removido ? 'Sim' : 'Não'}</td>
                  </tr>
                ))}
                {bugueiros_fila.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">Nenhum bugueiro nesta fila.</td>
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

export default VerFila; 