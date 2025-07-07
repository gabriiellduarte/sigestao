import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, FileText, Calendar } from 'lucide-react';

interface Atendimento {
  id: number;
  dataAtendimento: string;
  procedimento: string;
  medico: string;
  status: 'concluido' | 'em_andamento' | 'cancelado';
  observacoes: string;
  unidade: string;
}

interface AtendimentosPacienteProps {
  pacienteId?: number;
}

const mockAtendimentos: Atendimento[] = [
  {
    id: 1,
    dataAtendimento: '2024-01-15',
    procedimento: 'Consulta Cardiológica',
    medico: 'Dr. João Silva',
    status: 'concluido',
    observacoes: 'Paciente apresentou melhora significativa',
    unidade: 'Hospital Central'
  },
  {
    id: 2,
    dataAtendimento: '2024-01-20',
    procedimento: 'Exame de Sangue',
    medico: 'Dra. Maria Santos',
    status: 'concluido',
    observacoes: 'Resultados dentro da normalidade',
    unidade: 'Laboratório São Lucas'
  },
  {
    id: 3,
    dataAtendimento: '2024-02-01',
    procedimento: 'Fisioterapia',
    medico: 'Ft. Ana Costa',
    status: 'em_andamento',
    observacoes: 'Sessão de reabilitação - 5ª sessão',
    unidade: 'Clínica de Reabilitação'
  }
];

export const AtendimentosPaciente: React.FC<AtendimentosPacienteProps> = ({ pacienteId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [atendimentos] = useState<Atendimento[]>(mockAtendimentos);

  const filteredAtendimentos = atendimentos.filter(atendimento =>
    atendimento.procedimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    atendimento.medico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    atendimento.unidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluido':
        return <Badge variant="default" className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'em_andamento':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Atendimentos</p>
                <p className="text-2xl font-bold text-gray-900">{atendimentos.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">
                  {atendimentos.filter(a => a.status === 'concluido').length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">
                  {atendimentos.filter(a => a.status === 'em_andamento').length}
                </p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por procedimento, médico ou unidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de atendimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Atendimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Procedimento</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAtendimentos.map((atendimento) => (
                <TableRow key={atendimento.id}>
                  <TableCell>{formatDate(atendimento.dataAtendimento)}</TableCell>
                  <TableCell className="font-medium">{atendimento.procedimento}</TableCell>
                  <TableCell>{atendimento.medico}</TableCell>
                  <TableCell>{atendimento.unidade}</TableCell>
                  <TableCell>{getStatusBadge(atendimento.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAtendimentos.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum atendimento encontrado</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Este paciente ainda não possui atendimentos registrados.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};