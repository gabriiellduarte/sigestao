import React, { useState } from 'react';
import { ArrowLeft, User, Calendar, FileText, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Portaria {
  id: number;
  servidor: string;
  tipoPortaria: string;
  data: string;
  funcao: string;
  secretaria: string;
  status: 'ativa' | 'inativa' | 'pendente';
}

interface ServidorPortariasProps {
  onBack: () => void;
}

const mockPortarias: Portaria[] = [
  {
    id: 1,
    servidor: 'João Silva Santos',
    tipoPortaria: 'Nomeação',
    data: '2024-01-15',
    funcao: 'Diretor de Educação',
    secretaria: 'Secretaria de Educação',
    status: 'ativa'
  },
  {
    id: 2,
    servidor: 'João Silva Santos',
    tipoPortaria: 'Designação',
    data: '2023-12-10',
    funcao: 'Coordenador Pedagógico',
    secretaria: 'Secretaria de Educação',
    status: 'inativa'
  },
  {
    id: 3,
    servidor: 'Maria Oliveira Costa',
    tipoPortaria: 'Nomeação',
    data: '2024-01-10',
    funcao: 'Assessora Jurídica',
    secretaria: 'Secretaria de Administração',
    status: 'ativa'
  },
  {
    id: 4,
    servidor: 'João Silva Santos',
    tipoPortaria: 'Exoneração',
    data: '2023-11-30',
    funcao: 'Professor',
    secretaria: 'Secretaria de Educação',
    status: 'inativa'
  },
  {
    id: 5,
    servidor: 'Carlos Pereira Lima',
    tipoPortaria: 'Designação',
    data: '2024-01-08',
    funcao: 'Coordenador de Saúde',
    secretaria: 'Secretaria de Saúde',
    status: 'pendente'
  }
];

export const ServidorPortarias: React.FC<ServidorPortariasProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServidor, setSelectedServidor] = useState<string>('');

  // Agrupar portarias por servidor
  const portariasPorServidor = mockPortarias.reduce((acc, portaria) => {
    if (!acc[portaria.servidor]) {
      acc[portaria.servidor] = [];
    }
    acc[portaria.servidor].push(portaria);
    return acc;
  }, {} as Record<string, Portaria[]>);

  // Filtrar servidores com base na busca
  const servidoresFiltrados = Object.keys(portariasPorServidor).filter(servidor =>
    servidor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800';
      case 'inativa': return 'bg-red-100 text-red-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Nomeação': return 'bg-blue-100 text-blue-800';
      case 'Exoneração': return 'bg-red-100 text-red-800';
      case 'Designação': return 'bg-green-100 text-green-800';
      case 'Dispensa': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout>

    
    <div className="space-y-4 md:space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Portarias por Servidor</h2>
          <p className="text-sm md:text-base text-gray-600">Visualize o histórico de portarias de cada servidor</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar servidor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>
      </div>

      {!selectedServidor ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servidoresFiltrados.map((servidor) => {
            const portarias = portariasPorServidor[servidor];
            const portariasAtivas = portarias.filter(p => p.status === 'ativa').length;
            const totalPortarias = portarias.length;

            return (
              <Card key={servidor} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedServidor(servidor)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{servidor}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total de Portarias:</span>
                      <span className="font-semibold">{totalPortarias}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Portarias Ativas:</span>
                      <span className="font-semibold text-green-600">{portariasAtivas}</span>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Timeline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedServidor}</h3>
                <p className="text-gray-600">Timeline de Portarias</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setSelectedServidor('')}>
              Ver Todos os Servidores
            </Button>
          </div>

          <div className="relative">
            {/* Linha da timeline */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {portariasPorServidor[selectedServidor]
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                .map((portaria, index) => (
                <div key={portaria.id} className="relative flex items-start space-x-4">
                  {/* Ponto da timeline */}
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white border-4 border-blue-200 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  {/* Conteúdo da timeline */}
                  <div className="flex-1 min-w-0">
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge className={getTipoColor(portaria.tipoPortaria)}>
                              {portaria.tipoPortaria}
                            </Badge>
                            <Badge className={getStatusColor(portaria.status)}>
                              {portaria.status.charAt(0).toUpperCase() + portaria.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(portaria.data).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">{portaria.funcao}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">{portaria.secretaria}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {servidoresFiltrados.length === 0 && !selectedServidor && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum servidor encontrado.</p>
        </div>
      )}
    </div>
    </AppLayout>
  );
};

export default ServidorPortarias;