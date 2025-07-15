import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Calendar, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Agendamento {
  id: number;
  dataAgendamento: string;
  horario: string;
  procedimento: string;
  medico: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'realizado';
  unidade: string;
  observacoes: string;
}

interface AgendamentosPacienteProps {
  pacienteId?: number;
}

const mockAgendamentos: Agendamento[] = [
  {
    id: 1,
    dataAgendamento: '2024-02-15',
    horario: '14:30',
    procedimento: 'Retorno Cardiológico',
    medico: 'Dr. João Silva',
    status: 'confirmado',
    unidade: 'Hospital Central',
    observacoes: 'Trazer exames anteriores'
  },
  {
    id: 2,
    dataAgendamento: '2024-02-20',
    horario: '09:00',
    procedimento: 'Fisioterapia',
    medico: 'Ft. Ana Costa',
    status: 'agendado',
    unidade: 'Clínica de Reabilitação',
    observacoes: '6ª sessão do tratamento'
  },
  {
    id: 3,
    dataAgendamento: '2024-03-01',
    horario: '16:00',
    procedimento: 'Consulta Neurológica',
    medico: 'Dr. Carlos Medeiros',
    status: 'agendado',
    unidade: 'Hospital Central',
    observacoes: 'Primeira consulta - encaminhamento'
  },
  {
    id: 4,
    dataAgendamento: '2024-01-10',
    horario: '10:30',
    procedimento: 'Exame de Ultrassom',
    medico: 'Dr. Roberto Lima',
    status: 'realizado',
    unidade: 'Centro de Diagnóstico',
    observacoes: 'Exame realizado com sucesso'
  }
];

export const AgendamentosPaciente: React.FC<AgendamentosPacienteProps> = ({ pacienteId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [agendamentos] = useState<Agendamento[]>(mockAgendamentos);

  const filteredAgendamentos = agendamentos.filter(agendamento =>
    agendamento.procedimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agendamento.medico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agendamento.unidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'agendado':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Agendado</Badge>;
      case 'confirmado':
        return <Badge variant="default" className="bg-green-100 text-green-800">Confirmado</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'realizado':
        return <Badge variant="default" className="bg-gray-100 text-gray-800">Realizado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isUpcoming = (dateString: string) => {
    const agendamentoDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return agendamentoDate >= today;
  };

  const upcomingAgendamentos = agendamentos.filter(a => 
    isUpcoming(a.dataAgendamento) && (a.status === 'agendado' || a.status === 'confirmado')
  );

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        {/* Header com estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{agendamentos.length}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Próximos</p>
                  <p className="text-2xl font-bold text-blue-600">{upcomingAgendamentos.length}</p>
                </div>
                <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {agendamentos.filter(a => a.status === 'confirmado').length}
                  </p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Realizados</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {agendamentos.filter(a => a.status === 'realizado').length}
                  </p>
                </div>
                <div className="bg-gray-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-gray-600" />
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

        {/* Tabela de agendamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Procedimento</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgendamentos
                  .sort((a, b) => new Date(b.dataAgendamento).getTime() - new Date(a.dataAgendamento).getTime())
                  .map((agendamento) => (
                  <TableRow key={agendamento.id}>
                    <TableCell>{formatDate(agendamento.dataAgendamento)}</TableCell>
                    <TableCell>{agendamento.horario}</TableCell>
                    <TableCell className="font-medium">{agendamento.procedimento}</TableCell>
                    <TableCell>{agendamento.medico}</TableCell>
                    <TableCell>{agendamento.unidade}</TableCell>
                    <TableCell>{getStatusBadge(agendamento.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAgendamentos.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Este paciente ainda não possui agendamentos.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
    
  );
};

export default AgendamentosPaciente;