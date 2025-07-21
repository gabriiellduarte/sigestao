import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calendar, Users, Truck, TrendingUp, DollarSign } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

const chartConfig = {
  passeios: {
    label: "Passeios",
    color: "#8884d8",
  },
  receita: {
    label: "Receita",
    color: "#82ca9d",
  },
};

export const DashboardBuggy: React.FC = () => {
  const { props } = usePage<any>();
  const dados = props;
  const loading = !dados || typeof dados.totalPasseios === 'undefined';

  // Conversão para os gráficos
  const passeioPorMes = (dados.passeiosPorMes || []).map((item: any) => ({
    mes: item.mes,
    passeios: Number(item.passeios),
    receita: Number(item.receita)
  })).reverse();
  const bugueiroPorPasseios = (dados.rankingBugueiros || []).map((item: any) => ({
    nome: item.bugueiro_nome,
    passeios: Number(item.passeios),
    avaliacao: 4.7 // mock, pois não há campo
  }));
  const tiposPasseios = (dados.tiposPasseios || []).map((item: any, idx: number) => ({
    tipo: item.tipo,
    quantidade: Number(item.quantidade),
    cor: ['#8884d8','#82ca9d','#ffc658','#ff7c7c','#ffb347','#bada55'][idx % 6]
  }));

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-gray-500">Carregando dados do dashboard...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard - Passeios de Buggy</h1>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Passeios</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dados.totalPasseios}</div>
            <p className="text-xs text-muted-foreground">&nbsp;</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugueiros Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dados.bugueirosAtivos}</div>
            <p className="text-xs text-muted-foreground">&nbsp;</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {Number(dados.receitaTotal).toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
            <p className="text-xs text-muted-foreground">&nbsp;</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dados.avaliacaoMedia}</div>
            <p className="text-xs text-muted-foreground">⭐ Excelente avaliação</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Passeios por Mês */}
        <Card>
          <CardHeader>
            <CardTitle>Passeios por Mês</CardTitle>
            <CardDescription>Evolução mensal de passeios realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={passeioPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="passeios" fill="var(--color-passeios)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Receita por Mês */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Mês</CardTitle>
            <CardDescription>Evolução da receita mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart data={passeioPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="receita" stroke="var(--color-receita)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking de Bugueiros */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Bugueiros</CardTitle>
            <CardDescription>Por número de passeios realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bugueiroPorPasseios.map((bugueiro: any, index: number) => (
                <div key={bugueiro.nome} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{bugueiro.nome}</p>
                      <p className="text-sm text-gray-500">⭐ {bugueiro.avaliacao}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{bugueiro.passeios}</p>
                    <p className="text-sm text-gray-500">passeios</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Passeios */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Passeios</CardTitle>
            <CardDescription>Distribuição por tipo de passeio</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={tiposPasseios}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tipo, percent }) => `${tipo} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {tiposPasseios.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
    </AppLayout>
    
  );
};

export default DashboardBuggy;