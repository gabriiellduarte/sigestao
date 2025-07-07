import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Building, 
  Stethoscope, 
  Calendar, 
  FileText, 
  AlertTriangle,
  Edit,
  Archive,
  Trash2,
  Printer
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import ComprovanteAtendimento from './Comprovante';

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
  usuario: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface ShowProps {
  atendimento: Atendimento;
}

export default function Show({ atendimento }: ShowProps) {
  const [showComprovante, setShowComprovante] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este atendimento?')) {
      router.delete(route('regulacao.atendimentos.destroy', atendimento.reg_ate_id));
    }
  };

  const handleArquivar = () => {
    router.put(route('regulacao.atendimentos.arquivar', atendimento.reg_ate_id));
  };

  const handleDesarquivar = () => {
    router.put(route('regulacao.atendimentos.desarquivar', atendimento.reg_ate_id));
  };

  const handlePrintComprovante = () => {
    setShowComprovante(true);
    setTimeout(() => {
      window.print();
      setShowComprovante(false);
    }, 100);
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={route('regulacao.atendimentos.index')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Detalhes do Atendimento</h1>
              <p className="text-gray-600">Protocolo: {atendimento.reg_ate_protocolo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrintComprovante}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir Comprovante
            </Button>
            <Link href={route('regulacao.atendimentos.comprovante', atendimento.reg_ate_id)}>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Ver Comprovante
              </Button>
            </Link>
            <Link href={route('regulacao.atendimentos.edit', atendimento.reg_ate_id)}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            {!atendimento.reg_ate_arquivado ? (
              <Button variant="outline" size="sm" onClick={handleArquivar}>
                <Archive className="h-4 w-4 mr-2" />
                Arquivar
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleDesarquivar}>
                <FileText className="h-4 w-4 mr-2" />
                Desarquivar
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Paciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <User className="h-6 w-6 mr-2" />
                Dados do Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <p className="text-lg font-semibold">{atendimento.pessoa.ger_pessoas_nome}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">CPF</label>
                <p className="text-lg">{atendimento.pessoa.ger_pessoas_cpf}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Procedimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Stethoscope className="h-6 w-6 mr-2" />
                Procedimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Procedimento</label>
                <p className="text-lg font-semibold">{atendimento.procedimento.reg_proc_nome}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Grupo</label>
                <p className="text-lg">{atendimento.grupo_procedimento.reg_gpro_nome}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo de Atendimento</label>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {atendimento.tipo_atendimento.reg_tipo_nome}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    (Peso: {atendimento.tipo_atendimento.reg_tipo_peso})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datas e Horários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Calendar className="h-6 w-6 mr-2" />
                Datas e Horários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Data do Atendimento</label>
                <p className="text-lg font-semibold">{formatDateTime(atendimento.reg_ate_datendimento)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Data de Solicitação</label>
                <p className="text-lg">{formatDate(atendimento.reg_ate_drequerente)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Criado em</label>
                <p className="text-sm text-gray-500">{formatDateTime(atendimento.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Última atualização</label>
                <p className="text-sm text-gray-500">{formatDateTime(atendimento.updated_at)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <FileText className="h-6 w-6 mr-2" />
                Informações Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {atendimento.unidade_saude && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Unidade Solicitante</label>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-lg">{atendimento.unidade_saude.reg_uni_nome}</p>
                  </div>
                </div>
              )}
              
              {atendimento.medico && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Médico Solicitante</label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-lg">{atendimento.medico.reg_med_nome}</p>
                  </div>
                </div>
              )}

              {atendimento.acs && (
                <div>
                  <label className="text-sm font-medium text-gray-500">ACS</label>
                  <p className="text-lg">{atendimento.acs.reg_acs_nome}</p>
                </div>
              )}

              {atendimento.reg_ate_protoc_solicitante && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Protocolo Solicitante</label>
                  <p className="text-lg font-mono">{atendimento.reg_ate_protoc_solicitante}</p>
                </div>
              )}

              {atendimento.usuario && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Usuário Responsável</label>
                  <p className="text-lg">{atendimento.usuario.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status e Posição */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Status e Posição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="flex flex-wrap gap-2 mt-2">
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
                  {atendimento.reg_ate_retroativo && (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Retroativo
                    </Badge>
                  )}
                </div>
              </div>

              {atendimento.reg_ate_prioridade && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Prioridade</label>
                  <Badge variant="destructive" className="flex items-center w-fit">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Prioritário
                  </Badge>
                </div>
              )}

              {atendimento.reg_ate_pos_atual && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Posição Atual</label>
                  <p className="text-lg font-semibold">{atendimento.reg_ate_pos_atual}</p>
                </div>
              )}

              {atendimento.reg_ate_pos_inicial && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Posição Inicial</label>
                  <p className="text-lg">{atendimento.reg_ate_pos_inicial}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observações */}
          {atendimento.reg_ate_obs && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <FileText className="h-6 w-6 mr-2" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{atendimento.reg_ate_obs}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal do Comprovante para Impressão */}
      {showComprovante && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Comprovante de Atendimento</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowComprovante(false)}>
                  Fechar
                </Button>
              </div>
            </div>
            <div className="p-4">
              <ComprovanteAtendimento atendimento={atendimento} />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
} 