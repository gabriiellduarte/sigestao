import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Archive, 
  Calendar,
  User,
  Building,
  Stethoscope,
  AlertTriangle,
  FileText,
  Hash
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';

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

interface IndexProps {
  atendimentos: {
    data: Atendimento[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function Index({ atendimentos }: IndexProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este atendimento?')) {
      router.delete(route('regulacao.atendimentos.destroy', id));
    }
  };

  const handleArquivar = (id: number) => {
    router.put(route('regulacao.atendimentos.arquivar', id));
  };

  const handleDesarquivar = (id: number) => {
    router.put(route('regulacao.atendimentos.desarquivar', id));
  };

  const handleAgendar = (id: number) => {
    router.put(route('regulacao.atendimentos.agendar', id));
  };

  const handleDesagendar = (id: number) => {
    router.put(route('regulacao.atendimentos.desagendar', id));
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Atendimentos</h1>
            <p className="text-gray-600">Gerenciamento de atendimentos de regulação</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={route('regulacao.atendimentos.espera')}>
              <Button variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                <Hash className="h-4 w-4 mr-2" />
                Lista de Espera
              </Button>
            </Link>
            <Link href={route('regulacao.atendimentos.create')}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Atendimento
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <FileText className="h-6 w-6 mr-2" />
              Lista de Atendimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Procedimento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data Atendimento</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atendimentos.data.map((atendimento) => (
                    <TableRow key={atendimento.reg_ate_id}>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {atendimento.reg_ate_protocolo}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{atendimento.pessoa.ger_pessoas_nome}</div>
                          <div className="text-sm text-gray-500">{atendimento.pessoa.ger_pessoas_cpf}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{atendimento.procedimento.reg_proc_nome}</div>
                          <div className="text-sm text-gray-500">{atendimento.grupo_procedimento.reg_gpro_nome}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {atendimento.tipo_atendimento.reg_tipo_nome}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{formatDateTime(atendimento.reg_ate_datendimento)}</div>
                          <div className="text-xs text-gray-500">
                            Solicitado: {formatDate(atendimento.reg_ate_drequerente)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {atendimento.unidade_saude ? (
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="text-sm">{atendimento.unidade_saude.reg_uni_nome}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {atendimento.reg_ate_arquivado ? (
                            <Badge variant="secondary">Arquivado</Badge>
                          ) : (
                            <Badge variant="default">Ativo</Badge>
                          )}
                          {atendimento.reg_ate_agendado && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Agendado
                            </Badge>
                          )}
                          {atendimento.reg_ate_pos_atual && (
                            <Badge variant="outline">
                              Posição: {atendimento.reg_ate_pos_atual}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {atendimento.reg_ate_prioridade ? (
                          <Badge variant="destructive" className="flex items-center w-fit">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Prioritário
                          </Badge>
                        ) : (
                          <Badge variant="outline">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link href={route('regulacao.atendimentos.show', atendimento.reg_ate_id)}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={route('regulacao.atendimentos.edit', atendimento.reg_ate_id)}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          {!atendimento.reg_ate_arquivado ? (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleArquivar(atendimento.reg_ate_id)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDesarquivar(atendimento.reg_ate_id)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}

                          {!atendimento.reg_ate_agendado ? (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleAgendar(atendimento.reg_ate_id)}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDesagendar(atendimento.reg_ate_id)}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          )}

                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(atendimento.reg_ate_id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {atendimentos.data.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum atendimento encontrado</h3>
                <p className="text-gray-500 mb-4">
                  Comece criando um novo atendimento para gerenciar a regulação.
                </p>
                <Link href={route('regulacao.atendimentos.create')}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Atendimento
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 