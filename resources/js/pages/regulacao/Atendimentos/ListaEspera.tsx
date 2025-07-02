import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Calendar, User, MapPin, Clock, Eye, Hash, ArrowLeft, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

interface Atendimento {
  reg_ate_id: number;
  reg_ate_protocolo: string;
  reg_ate_prioridade: boolean;
  reg_ate_datendimento: string;
  reg_ate_drequerente: string;
  reg_ate_obs: string | null;
  reg_ate_arquivado: boolean;
  reg_ate_agendado: boolean;
  reg_ate_pos_atual: number | null;
  reg_ate_pos_inicial: number | null;
  reg_ate_protoc_solicitante: string | null;
  reg_ate_retroativo: boolean;
  pessoa: {
    ger_pessoas_id: number;
    ger_pessoas_nome: string;
    ger_pessoas_cpf: string;
  };
  procedimento: {
    reg_proc_id: number;
    reg_proc_nome: string;
  };
  grupo_procedimento: {
    reg_gpro_id: number;
    reg_gpro_nome: string;
  };
  tipo_atendimento: {
    reg_tipo_id: number;
    reg_tipo_nome: string;
    reg_tipo_peso: number;
  };
  unidade_saude: {
    reg_uni_id: number;
    reg_uni_nome: string;
  } | null;
  medico: {
    reg_med_id: number;
    reg_med_nome: string;
  } | null;
  acs: {
    reg_acs_id: number;
    reg_acs_nome: string;
  } | null;
  created_at: string;
}

interface ListaEsperaProps {
  atendimentos: {
    data: Atendimento[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function ListaEspera({ atendimentos }: ListaEsperaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcedimento, setSelectedProcedimento] = useState('todos');
  const [selectedGrupoProcedimento, setSelectedGrupoProcedimento] = useState('todos');
  const [selectedPrioridade, setSelectedPrioridade] = useState('todos');

  // Extrair dados únicos para filtros
  const gruposProcedimento = [...new Set(atendimentos.data.map(a => a.grupo_procedimento.reg_gpro_nome))];
  const procedimentos = [...new Set(atendimentos.data.map(a => a.procedimento.reg_proc_nome))];

  const filteredAtendimentos = atendimentos.data.filter(atendimento => {
    const matchesSearch = atendimento.pessoa.ger_pessoas_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atendimento.pessoa.ger_pessoas_cpf.includes(searchTerm) ||
                         atendimento.procedimento.reg_proc_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atendimento.reg_ate_protocolo.includes(searchTerm);
    
    const matchesProcedimento = selectedProcedimento === 'todos' || atendimento.procedimento.reg_proc_nome === selectedProcedimento;
    const matchesGrupoProcedimento = selectedGrupoProcedimento === 'todos' || atendimento.grupo_procedimento.reg_gpro_nome === selectedGrupoProcedimento;
    const matchesPrioridade = selectedPrioridade === 'todos' || 
                             (selectedPrioridade === 'prioritario' && atendimento.reg_ate_prioridade) ||
                             (selectedPrioridade === 'normal' && !atendimento.reg_ate_prioridade);

    return matchesSearch && matchesProcedimento && matchesGrupoProcedimento && matchesPrioridade;
  });

  // Ordenar por prioridade, peso do tipo de atendimento e data de criação
  const sortedAtendimentos = [...filteredAtendimentos].sort((a, b) => {
    // Prioridade: prioritário > normal
    if (a.reg_ate_prioridade && !b.reg_ate_prioridade) return -1;
    if (!a.reg_ate_prioridade && b.reg_ate_prioridade) return 1;
    
    // Se mesma prioridade, ordenar por peso do tipo de atendimento (maior peso = maior prioridade)
    const pesoDiff = b.tipo_atendimento.reg_tipo_peso - a.tipo_atendimento.reg_tipo_peso;
    if (pesoDiff !== 0) return pesoDiff;
    
    // Se mesmo peso, ordenar por data de criação (mais antigo = maior prioridade)
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const getPrioridadeColor = (prioridade: boolean) => {
    return prioridade ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const getPrioridadeText = (prioridade: boolean) => {
    return prioridade ? 'Prioritário' : 'Normal';
  };

  const getTempoEsperaColor = (dataCriacao: string) => {
    const dias = Math.floor((new Date().getTime() - new Date(dataCriacao).getTime()) / (1000 * 60 * 60 * 24));
    if (dias > 30) return 'text-red-600';
    if (dias > 15) return 'text-orange-600';
    return 'text-green-600';
  };

  const getTempoEspera = (dataCriacao: string) => {
    const dias = Math.floor((new Date().getTime() - new Date(dataCriacao).getTime()) / (1000 * 60 * 60 * 24));
    return dias;
  };

  const getPosicaoColor = (posicao: number) => {
    if (posicao <= 3) return 'text-red-600 font-bold';
    if (posicao <= 10) return 'text-orange-600 font-semibold';
    return 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedProcedimento('todos');
    setSelectedGrupoProcedimento('todos');
    setSelectedPrioridade('todos');
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Atendimentos</h1>
              <p className="text-gray-600">Gerenciamento da fila de atendimentos</p>
            </div>
          </div>
          <Link href={route('regulacao.atendimentos.create')}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                    Novo Atendimento
                </Button>
            </Link>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar paciente, CPF, protocolo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Grupo de Procedimento */}
              <Select value={selectedGrupoProcedimento} onValueChange={setSelectedGrupoProcedimento}>
                <SelectTrigger>
                  <SelectValue placeholder="Grupo de Procedimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os grupos</SelectItem>
                  {gruposProcedimento.map((grupo) => (
                    <SelectItem key={grupo} value={grupo}>{grupo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Procedimento */}
              <Select value={selectedProcedimento} onValueChange={setSelectedProcedimento}>
                <SelectTrigger>
                  <SelectValue placeholder="Procedimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os procedimentos</SelectItem>
                  {procedimentos.map((procedimento) => (
                    <SelectItem key={procedimento} value={procedimento}>{procedimento}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Prioridade */}
              <Select value={selectedPrioridade} onValueChange={setSelectedPrioridade}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as prioridades</SelectItem>
                  <SelectItem value="prioritario">Prioritário</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>

              {/* Botão limpar filtros */}
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Atendimentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Hash className="h-6 w-6 mr-2" />
              Atendimentos na Fila de Espera
            </CardTitle>
            <div className="text-sm text-gray-600">
                Total: {filteredAtendimentos.length} atendimentos
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posição</TableHead>
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Procedimento</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Data Inclusão</TableHead>
                    <TableHead>Tempo Espera</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAtendimentos.map((atendimento, index) => (
                    <TableRow key={atendimento.reg_ate_id}>
                      <TableCell>
                        <div className={`flex items-center ${getPosicaoColor(index + 1)}`}>
                          <Hash className="h-4 w-4 mr-1" />
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {atendimento.reg_ate_protocolo}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <div className="font-medium">{atendimento.pessoa.ger_pessoas_nome}</div>
                            {atendimento.unidade_saude && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {atendimento.unidade_saude.reg_uni_nome}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{atendimento.pessoa.ger_pessoas_cpf}</TableCell>
                      <TableCell>{atendimento.procedimento.reg_proc_nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{atendimento.grupo_procedimento.reg_gpro_nome}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {atendimento.tipo_atendimento.reg_tipo_nome}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPrioridadeColor(atendimento.reg_ate_prioridade)}>
                          {getPrioridadeText(atendimento.reg_ate_prioridade)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(atendimento.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center font-medium ${getTempoEsperaColor(atendimento.created_at)}`}>
                          <Clock className="h-4 w-4 mr-1" />
                          {getTempoEspera(atendimento.created_at)} dias
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={route('regulacao.atendimentos.show', atendimento.reg_ate_id)}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAtendimentos.length === 0 && (
              <div className="text-center py-8">
                <Hash className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum atendimento encontrado</h3>
                <p className="text-gray-500 mb-4">
                  Não há atendimentos na fila de espera com os filtros aplicados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 