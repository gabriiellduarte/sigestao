import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarCheck, 
  Clock, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Activity,
  Building,
  Stethoscope
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export const DashboardRegulacao = () => {
  // Mock data para o dashboard
  const stats = {
    totalAtendimentos: 1250,
    agendamentosHoje: 45,
    aguardandoAprovacao: 23,
    aprovadosHoje: 32,
    canceladosHoje: 5,
    tempoMedioAprovacao: '2.5 horas'
  };

  const procedimentosMaisSolicitados = [
    { nome: 'Consulta Cardiológica', quantidade: 89 },
    { nome: 'Ultrassom Abdominal', quantidade: 67 },
    { nome: 'Ressonância Magnética', quantidade: 45 },
    { nome: 'Tomografia Computadorizada', quantidade: 34 },
    { nome: 'Ecocardiograma', quantidade: 28 }
  ];

  const unidadesMaisAtivas = [
    { nome: 'Hospital Municipal', atendimentos: 156 },
    { nome: 'UBS Central', atendimentos: 134 },
    { nome: 'UBS Norte', atendimentos: 98 },
    { nome: 'UBS Sul', atendimentos: 87 },
    { nome: 'Hospital Regional', atendimentos: 76 }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Dashboard - Regulação</h1>
            <p className="text-gray-600">Visão geral dos atendimentos e regulações</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Última atualização</p>
            <p className="text-sm font-medium">Hoje, 14:30</p>
          </div>
        </div>

        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Atendimentos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAtendimentos}</p>
                  <p className="text-xs text-green-600">↗ +12% este mês</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CalendarCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.agendamentosHoje}</p>
                  <p className="text-xs text-blue-600">23 confirmados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aguardando Aprovação</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.aguardandoAprovacao}</p>
                  <p className="text-xs text-orange-600">5 urgentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aprovados Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.aprovadosHoje}</p>
                  <p className="text-xs text-emerald-600">Tempo médio: {stats.tempoMedioAprovacao}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status dos Atendimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovados Hoje</p>
                  <p className="text-3xl font-bold text-green-600">{stats.aprovadosHoje}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.aguardandoAprovacao}</p>
                </div>
                <AlertCircle className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelados Hoje</p>
                  <p className="text-3xl font-bold text-red-600">{stats.canceladosHoje}</p>
                </div>
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Procedimentos Mais Solicitados e Unidades Mais Ativas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Procedimentos Mais Solicitados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Stethoscope className="h-6 w-6 mr-2" />
                Procedimentos Mais Solicitados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {procedimentosMaisSolicitados.map((procedimento, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{procedimento.nome}</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{procedimento.quantidade}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Unidades Mais Ativas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Building className="h-6 w-6 mr-2" />
                Unidades Mais Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unidadesMaisAtivas.map((unidade, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-green-500' : 
                        index === 1 ? 'bg-blue-500' : 
                        index === 2 ? 'bg-purple-500' : 'bg-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{unidade.nome}</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{unidade.atendimentos}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métricas de Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-purple-700">
              <TrendingUp className="h-6 w-6 mr-2" />
              Métricas de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Tempo Médio de Aprovação</p>
                <p className="text-2xl font-bold text-purple-600">{stats.tempoMedioAprovacao}</p>
                <p className="text-xs text-green-600">↗ Melhorou 15min</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-purple-600">89%</p>
                <p className="text-xs text-green-600">↗ +2% esta semana</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Pacientes Únicos</p>
                <p className="text-2xl font-bold text-purple-600">892</p>
                <p className="text-xs text-blue-600">Este mês</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Médicos Ativos</p>
                <p className="text-2xl font-bold text-purple-600">45</p>
                <p className="text-xs text-gray-600">Em 8 unidades</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <FileText className="h-6 w-6 mr-2" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Novo Atendimento</h3>
                <p className="text-sm text-gray-600">Criar nova solicitação</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <CalendarCheck className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Ver Agendados</h3>
                <p className="text-sm text-gray-600">Consultar agendamentos</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <Clock className="h-8 w-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Pendências</h3>
                <p className="text-sm text-gray-600">Revisar solicitações</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <FileText className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Relatórios</h3>
                <p className="text-sm text-gray-600">Gerar relatórios</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
    
  );
};

export default DashboardRegulacao;