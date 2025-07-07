import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Log {
  id: number;
  log_name: string | null;
  description: string;
  subject_type: string | null;
  subject_id: number | null;
  causer_type: string | null;
  causer_id: number | null;
  properties: any;
  created_at: string;
}

interface LogsIndexProps {
  logs: Log[];
}

const LogsIndex: React.FC<LogsIndexProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [descFilter, setDescFilter] = useState('');
  const [logNameFilter, setLogNameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredLogs = logs.filter(log => {
    const descMatch = descFilter ? log.description.toLowerCase().includes(descFilter.toLowerCase()) : true;
    const logNameMatch = logNameFilter ? (log.log_name || '').toLowerCase().includes(logNameFilter.toLowerCase()) : true;
    const dateMatch = dateFilter ? log.created_at.slice(0, 10) === dateFilter : true;
    return descMatch && logNameMatch && dateMatch;
  });

  return (
    <AppLayout>
<div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Logs de Atividades</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <Input
              placeholder="Filtrar por descrição"
              value={descFilter}
              onChange={e => setDescFilter(e.target.value)}
              className="w-64"
            />
            <Input
              placeholder="Filtrar por log"
              value={logNameFilter}
              onChange={e => setLogNameFilter(e.target.value)}
              className="w-48"
            />
            <Input
              type="date"
              placeholder="Filtrar por data"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-48"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Log</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>{log.log_name}</TableCell>
                  <TableCell>{new Date(log.created_at).toLocaleString('pt-BR')}</TableCell>
                  <TableCell>
                    <Link href={route('administracao.logs.show', log.id)}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">Nenhum log encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de visualização do log (opcional, pode ser removido se preferir só a tela de detalhes) */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedLog(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Detalhes do Log #{selectedLog.id}</h2>
            <div className="mb-2"><strong>Descrição:</strong> {selectedLog.description}</div>
            <div className="mb-2"><strong>Log:</strong> {selectedLog.log_name}</div>
            <div className="mb-2"><strong>Data:</strong> {new Date(selectedLog.created_at).toLocaleString('pt-BR')}</div>
            <div className="mb-2"><strong>Subject:</strong> {selectedLog.subject_type} #{selectedLog.subject_id}</div>
            <div className="mb-2"><strong>Causer:</strong> {selectedLog.causer_type} #{selectedLog.causer_id}</div>
            <div className="mb-2">
              <strong>Properties (JSON):</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-1">
                {JSON.stringify(selectedLog.properties, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
    </AppLayout>
    
  );
};

export default LogsIndex; 