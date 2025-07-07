import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar, User, Building, Stethoscope, Clock, Hash, AlertTriangle, CheckCircle } from 'lucide-react';

interface AtendimentoData {
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

interface ComprovanteAtendimentoProps {
  atendimento: AtendimentoData;
  onPrint?: () => void;
}

export const ComprovanteAtendimento: React.FC<ComprovanteAtendimentoProps> = ({ 
  atendimento 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div 
      className="comprovante-atendimento bg-white print:shadow-none print:m-0" 
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        padding: '20mm',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4',
        margin: '0 auto'
      }}
    >
      {/* Cabeçalho */}
      <div className="text-center mb-8 border-b-2 border-blue-800 pb-4">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-blue-800 mb-2">
          COMPROVANTE DE ATENDIMENTO
        </h1>
        <p className="text-gray-600 text-sm mb-2">
          Sistema de Regulação Municipal de Saúde
        </p>
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
          <span>Protocolo: {atendimento.reg_ate_protocolo}</span>
          <span>•</span>
          <span>ID: #{atendimento.reg_ate_id.toString().padStart(6, '0')}</span>
        </div>
      </div>

      {/* Informações do Paciente */}
      <Card className="mb-6 border-2 border-blue-100">
        <CardHeader className="pb-3 bg-blue-50">
          <CardTitle className="text-sm flex items-center text-blue-700 font-bold">
            <User className="h-5 w-5 mr-2" />
            DADOS DO PACIENTE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">Nome Completo:</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">{atendimento.pessoa.ger_pessoas_nome}</p>
            </div>
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">CPF:</span>
              <p className="text-sm font-mono text-gray-800 mt-1">{formatCPF(atendimento.pessoa.ger_pessoas_cpf)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Atendimento */}
      <Card className="mb-6 border-2 border-green-100">
        <CardHeader className="pb-3 bg-green-50">
          <CardTitle className="text-sm flex items-center text-green-700 font-bold">
            <Stethoscope className="h-5 w-5 mr-2" />
            DADOS DO ATENDIMENTO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Data do Atendimento:
              </span>
              <p className="text-sm font-semibold text-gray-800 mt-1">{formatDate(atendimento.reg_ate_datendimento)}</p>
              <p className="text-xs text-gray-500">às {formatTime(atendimento.reg_ate_datendimento)}</p>
            </div>
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">Data de Solicitação:</span>
              <p className="text-sm text-gray-800 mt-1">{formatDate(atendimento.reg_ate_drequerente)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">Procedimento:</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">{atendimento.procedimento.reg_proc_nome}</p>
            </div>
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">Grupo:</span>
              <p className="text-sm text-gray-800 mt-1">{atendimento.grupo_procedimento.reg_gpro_nome}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">Tipo de Atendimento:</span>
              <div className="flex items-center mt-1">
                <span className="text-sm font-semibold text-gray-800">{atendimento.tipo_atendimento.reg_tipo_nome}</span>
                <span className="text-xs text-gray-500 ml-2">(Peso: {atendimento.tipo_atendimento.reg_tipo_peso})</span>
              </div>
            </div>
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">Prioridade:</span>
              <div className="flex items-center mt-1">
                {atendimento.reg_ate_prioridade ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Prioritário
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Normal
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Unidade e Profissionais */}
      <Card className="mb-6 border-2 border-purple-100">
        <CardHeader className="pb-3 bg-purple-50">
          <CardTitle className="text-sm flex items-center text-purple-700 font-bold">
            <Building className="h-5 w-5 mr-2" />
            UNIDADE E PROFISSIONAIS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {atendimento.unidade_saude && (
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase flex items-center">
                <Building className="h-3 w-3 mr-1" />
                Unidade de Saúde:
              </span>
              <p className="text-sm font-semibold text-gray-800 mt-1">{atendimento.unidade_saude.reg_uni_nome}</p>
            </div>
          )}
          
          {atendimento.medico && (
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase flex items-center">
                <User className="h-3 w-3 mr-1" />
                Médico Solicitante:
              </span>
              <p className="text-sm font-semibold text-gray-800 mt-1">{atendimento.medico.reg_med_nome}</p>
            </div>
          )}

          {atendimento.acs && (
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">ACS:</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">{atendimento.acs.reg_acs_nome}</p>
            </div>
          )}

          {atendimento.usuario && (
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">Usuário Responsável:</span>
              <p className="text-sm text-gray-800 mt-1">{atendimento.usuario.name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status e Posição */}
      <Card className="mb-6 border-2 border-orange-100">
        <CardHeader className="pb-3 bg-orange-50">
          <CardTitle className="text-sm flex items-center text-orange-700 font-bold">
            <Hash className="h-5 w-5 mr-2" />
            STATUS E POSIÇÃO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">Status:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {atendimento.reg_ate_arquivado ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Arquivado
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ativo
                  </span>
                )}
                {atendimento.reg_ate_agendado && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Agendado
                  </span>
                )}
                {atendimento.reg_ate_retroativo && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Retroativo
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">Posição:</span>
              <div className="mt-1">
                {atendimento.reg_ate_pos_atual && (
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">Atual:</span> {atendimento.reg_ate_pos_atual}
                  </p>
                )}
                {atendimento.reg_ate_pos_inicial && (
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">Inicial:</span> {atendimento.reg_ate_pos_inicial}
                  </p>
                )}
              </div>
            </div>
          </div>

          {atendimento.reg_ate_protoc_solicitante && (
            <div>
              <span className="font-semibold text-xs text-gray-600 uppercase">Protocolo Solicitante:</span>
              <p className="text-sm font-mono text-gray-800 mt-1">{atendimento.reg_ate_protoc_solicitante}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Observações */}
      {atendimento.reg_ate_obs && (
        <Card className="mb-6 border-2 border-yellow-100">
          <CardHeader className="pb-3 bg-yellow-50">
            <CardTitle className="text-sm text-yellow-700 font-bold">OBSERVAÇÕES</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{atendimento.reg_ate_obs}</p>
          </CardContent>
        </Card>
      )}

      {/* Rodapé */}
      <div className="mt-8 text-center border-t-2 border-gray-300 pt-6">
        <div className="grid grid-cols-2 gap-8 text-xs text-gray-500 mb-4">
          <div>
            <p className="font-semibold">Gerado em:</p>
            <p>{formatDateTime(new Date().toISOString())}</p>
          </div>
          <div>
            <p className="font-semibold">Sistema:</p>
            <p>SIA Inertia - Regulação</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">
            Este documento comprova o atendimento realizado no Sistema Municipal de Saúde
          </p>
          <p className="text-xs text-gray-400">
            Documento oficial - Válido para fins administrativos e legais
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComprovanteAtendimento;