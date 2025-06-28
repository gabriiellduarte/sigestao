import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Plus, Calendar, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';

interface Atendimento {
  id: number;
  protocolo: string;
  cidadao: string;
  cpf: string;
  tipo: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta';
  dataAbertura: string;
  funcionario: string;
  descricao: string;
}

const mockAtendimentos: Atendimento[] = [
  {
    id: 1,
    protocolo: '2024001234',
    cidadao: 'Maria Silva Santos',
    cpf: '123.456.789-00',
    tipo: 'Licença Sanitária',
    status: 'em_andamento',
    prioridade: 'alta',
    dataAbertura: '2024-01-15',
    funcionario: 'João Oliveira',
    descricao: 'Solicitação de licença sanitária para estabelecimento comercial'
  },
  {
    id: 2,
    protocolo: '2024001235',
    cidadao: 'Carlos Alberto Ferreira',
    cpf: '987.654.321-00',
    tipo: 'Fiscalização',
    status: 'pendente',
    prioridade: 'media',
    dataAbertura: '2024-01-16',
    funcionario: 'Ana Costa',
    descricao: 'Denúncia de funcionamento irregular de estabelecimento'
  },
  {
    id: 3,
    protocolo: '2024001236',
    cidadao: 'Fernanda Lima',
    cpf: '456.789.123-00',
    tipo: 'Alvará',
    status: 'concluido',
    prioridade: 'baixa',
    dataAbertura: '2024-01-10',
    funcionario: 'Pedro Santos',
    descricao: 'Renovação de alvará de funcionamento'
  }
];

interface NovoAtendimentoProps {
  onNovoAtendimento?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pendente': return 'bg-yellow-100 text-yellow-800';
    case 'em_andamento': return 'bg-blue-100 text-blue-800';
    case 'concluido': return 'bg-green-100 text-green-800';
    case 'cancelado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPrioridadeColor = (prioridade: string) => {
  switch (prioridade) {
    case 'alta': return 'bg-red-100 text-red-800';
    case 'media': return 'bg-yellow-100 text-yellow-800';
    case 'baixa': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pendente': return <Clock className="h-4 w-4" />;
    case 'em_andamento': return <AlertCircle className="h-4 w-4" />;
    case 'concluido': return <CheckCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

export default function NovoAtendimento({ ...props }){
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [atendimentos] = useState<Atendimento[]>(mockAtendimentos);
  function onNovoAtendimento(){
    
  }
  const filteredAtendimentos = atendimentos.filter(atendimento => {
    const matchesSearch = atendimento.cidadao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atendimento.protocolo.includes(searchTerm) ||
                         atendimento.cpf.includes(searchTerm);
    const matchesStatus = selectedStatus === '' || atendimento.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  console.log(props);
  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Atendimentos</h1>
            <p className="text-gray-600 mt-2">Gerencie os atendimentos de regulação municipal</p>
          </div>
          
          <Link href={route('regulacao.atendimento.novo')}>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="h-5 w-5" />
              <span>Novo Atendimento</span>
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{atendimentos.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {atendimentos.filter(a => a.status === 'pendente').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">
                  {atendimentos.filter(a => a.status === 'em_andamento').length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">
                  {atendimentos.filter(a => a.status === 'concluido').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, protocolo ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocolo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cidadão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Abertura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funcionário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAtendimentos.map((atendimento) => (
                  <tr key={atendimento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {atendimento.protocolo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{atendimento.cidadao}</div>
                        <div className="text-sm text-gray-500">{atendimento.cpf}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {atendimento.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(atendimento.status)}`}>
                        {getStatusIcon(atendimento.status)}
                        <span className="ml-1 capitalize">{atendimento.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadeColor(atendimento.prioridade)}`}>
                        {atendimento.prioridade.charAt(0).toUpperCase() + atendimento.prioridade.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(atendimento.dataAbertura).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {atendimento.funcionario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900 p-1 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAtendimentos.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum atendimento encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou adicione um novo atendimento.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};