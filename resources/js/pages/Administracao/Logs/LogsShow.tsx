import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

interface LogsShowProps {
  log: Log;
}

const LogsShow: React.FC<LogsShowProps> = ({ log }) => {
  return (
    <div className="p-6 flex justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Detalhes do Log #{log.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2"><strong>Descrição:</strong> {log.description}</div>
          <div className="mb-2"><strong>Log:</strong> {log.log_name}</div>
          <div className="mb-2"><strong>Data:</strong> {new Date(log.created_at).toLocaleString('pt-BR')}</div>
          <div className="mb-2"><strong>Subject:</strong> {log.subject_type} #{log.subject_id}</div>
          <div className="mb-2"><strong>Causer:</strong> {log.causer_type} #{log.causer_id}</div>
          <div className="mb-2">
            <strong>Properties (JSON):</strong>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-1">
              {JSON.stringify(log.properties, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsShow; 