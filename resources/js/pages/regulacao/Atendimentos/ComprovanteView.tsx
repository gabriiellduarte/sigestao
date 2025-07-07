import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import ComprovanteAtendimento from './Comprovante';

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

interface ComprovanteViewProps {
  atendimento: AtendimentoData;
}

export default function ComprovanteView({ atendimento }: ComprovanteViewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Implementar download como PDF se necessário
    alert('Funcionalidade de download PDF será implementada em breve');
  };

  return (
      <div className="space-y-6 p-4">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={route('regulacao.atendimentos.show', atendimento.reg_ate_id)}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Atendimento
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Comprovante de Atendimento</h1>
              <p className="text-gray-600">Protocolo: {atendimento.reg_ate_protocolo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>

        {/* Informações Rápidas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informações do Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Paciente</span>
                <p className="font-semibold">{atendimento.pessoa.ger_pessoas_nome}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Procedimento</span>
                <p className="font-semibold">{atendimento.procedimento.reg_proc_nome}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Data</span>
                <p className="font-semibold">
                  {new Date(atendimento.reg_ate_datendimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comprovante */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <ComprovanteAtendimento atendimento={atendimento} />
          </div>
        </div>

        {/* Instruções de Impressão */}
        <Card className="mt-6 print:hidden">
          <CardHeader>
            <CardTitle className="text-lg">Instruções de Impressão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Clique em "Imprimir" para abrir a janela de impressão</p>
              <p>• Certifique-se de que a orientação está configurada como "Retrato"</p>
              <p>• O tamanho do papel deve ser A4</p>
              <p>• Desmarque a opção "Cabeçalhos e rodapés" se disponível</p>
              <p>• As margens devem estar configuradas como "Mínimas" ou "Nenhuma"</p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
} 