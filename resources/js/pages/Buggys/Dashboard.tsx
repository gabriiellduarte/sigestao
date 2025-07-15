import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calendar, Users, Truck, TrendingUp, DollarSign } from 'lucide-react';

const passeioPorMes = [
  { mes: 'Jan', passeios: 45, receita: 4500 },
  { mes: 'Fev', passeios: 52, receita: 5200 },
  { mes: 'Mar', passeios: 38, receita: 3800 },
  { mes: 'Abr', passeios: 61, receita: 6100 },
  { mes: 'Mai', passeios: 73, receita: 7300 },
  { mes: 'Jun', passeios: 68, receita: 6800 }
];

const bugueiroPorPasseios = [
  { nome: 'João Silva', passeios: 28, avaliacao: 4.8 },
  { nome: 'Maria Santos', passeios: 31, avaliacao: 4.9 },
  { nome: 'Pedro Costa', passeios: 24, avaliacao: 4.7 },
  { nome: 'Ana Lima', passeios: 35, avaliacao: 4.6 },
  { nome: 'Carlos Souza', passeios: 22, avaliacao: 4.5 }
];

const tiposPasseios = [
  { tipo: 'Dunas', quantidade: 89, cor: '#8884d8' },
  { tipo: 'Praia', quantidade: 67, cor: '#82ca9d' },
  { tipo: 'Trilha', quantidade: 43, cor: '#ffc658' },
  { tipo: 'Sunset', quantidade: 34, cor: '#ff7c7c' }
];

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
  return (
    <div className="space-y-6">
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
            <div className="text-2xl font-bold">337</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugueiros Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 novos este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 33.700</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
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
              {bugueiroPorPasseios.map((bugueiro, index) => (
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
                  label={({ tipo, percent }) => `${tipo} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {tiposPasseios.map((entry, index) => (
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
  );
};

export default DashboardBuggy;