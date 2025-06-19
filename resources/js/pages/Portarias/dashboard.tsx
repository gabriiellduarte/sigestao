import React from 'react';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Calendar,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { PageProps } from '@/types';
import CountUp from 'react-countup';

interface DashboardProps extends PageProps {
  stats: {
    totalPortarias: { value: number; change: string };
    servidoresAtivos: { value: number; change: string };
    portariasPendentes: { value: number; change: string };
    processadasHoje: { value: number; change: string };
  };
  portariasRecentes: Array<{
    id: number;
    servidor: string;
    tipo: string;
    data: string;
    status: string;
  }>;
  tiposPortariaStats: Array<{
    tipo: string;
    quantidade: number;
    cor: string;
  }>;
}

type StatKey = 'totalPortarias' | 'servidoresAtivos' | 'portariasPendentes' | 'processadasHoje';

const statsCards: Array<{
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  key: StatKey;
}> = [
  {
    title: 'Total de Portarias',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    key: 'totalPortarias'
  },
  {
    title: 'Servidores Ativos',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    key: 'servidoresAtivos'
  },
  {
    title: 'Portarias Pendentes',
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    key: 'portariasPendentes'
  },
  {
    title: 'Processadas Hoje',
    icon: CheckCircle,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    key: 'processadasHoje'
  }
];

export default function DashboardPortarias({ stats, portariasRecentes, tiposPortariaStats, ...props }: DashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'text-green-600 bg-green-50';
      case 'pendente': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  function criarNova() {
    router.visit(route('documentos.portarias.create'));
  }

  function verTodas() {
    router.visit(route('documentos.portarias.index'));
  }

  function verPorServidor() {
    router.visit(route('documentos.portarias.porservidor'));
  } 

  console.log(props);

  return (
    <AppLayout>
      <div className="space-y-4 p-4 md:space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard - Portarias</h2>
            <p className="text-sm md:text-base text-gray-600">Visão geral das portarias municipais</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Button onClick={criarNova} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nova Portaria
            </Button>
            <Button variant="outline" onClick={verTodas} className="w-full md:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              Ver Todas
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsCards.map((card) => (
            <Card key={card.key} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{card.title}</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">
                      <CountUp
                        end={stats[card.key].value}
                        duration={2.5}
                        separator="."
                        decimal=","
                        prefix={card.key === 'totalPortarias' ? 'R$ ' : ''}
                      />
                    </p>
                    <p className={`text-xs md:text-sm ${card.color}`}>{stats[card.key].change}</p>
                  </div>
                  <div className={`p-2 md:p-3 rounded-full ${card.bgColor} flex-shrink-0`}>
                    <card.icon className={`h-5 w-5 md:h-6 md:w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Portarias Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Portarias Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {portariasRecentes.map((portaria) => (
                <div key={portaria.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{portaria.servidor}</p>
                    <p className="text-sm text-gray-600">{portaria.tipo} - {portaria.data}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(portaria.status)}`}>
                    {portaria.status.charAt(0).toUpperCase() + portaria.status.slice(1)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tipos de Portaria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Portarias por Tipo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tiposPortariaStats.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.cor}`}></div>
                    <span className="font-medium text-gray-900">{item.tipo}</span>
                  </div>
                  <span className="text-gray-600 font-semibold">{item.quantidade}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={criarNova}
                className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Nova Portaria</span>
                </div>
                <span className="text-blue-600">→</span>
              </button>
              
              <button 
                onClick={verTodas}
                className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Listar Portarias</span>
                </div>
                <span className="text-green-600">→</span>
              </button>
              
              <button 
                onClick={verPorServidor}
                className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Por Servidor</span>
                </div>
                <span className="text-purple-600">→</span>
              </button>
              
              <button className="flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Relatórios</span>
                </div>
                <span className="text-orange-600">→</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}