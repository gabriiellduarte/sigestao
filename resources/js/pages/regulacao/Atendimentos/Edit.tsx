import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, User, Building, Stethoscope, AlertTriangle, Save, ArrowLeft, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import { Pessoa } from '@/types/pessoa';
import AtendimentoForm from './Form';
import Modal from '@/components/Modal';
import { toast } from 'sonner';

interface AtendimentoFormData {
  ger_pessoas_id: number;
  reg_proc_id: number;
  reg_gpro_id: number;
  reg_tipo_id: number;
  reg_ate_datendimento: string;
  reg_ate_drequerente: string;
  reg_ate_obs: string;
  reg_uni_id: number | null;
  reg_med_id: number | null;
  reg_ate_protoc_solicitante: string;
  reg_acs_id: number | null;
  reg_ate_pos_atual: number | null;
  reg_ate_pos_inicial: number | null;
  reg_ate_prioridade: boolean;
  reg_ate_retroativo: boolean;
  [key: string]: any;
}

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
  ger_pessoas_id: number;
  reg_proc_id: number;
  reg_gpro_id: number;
  reg_tipo_id: number;
  reg_uni_id: number | null;
  reg_med_id: number | null;
  reg_acs_id: number | null;
}

interface EditProps {
  atendimento: Atendimento;
  pessoas: Pessoa[];
  gruposProcedimentos: Array<{ reg_gpro_id: number; reg_gpro_nome: string }>;
  procedimentos: Array<{ reg_proc_id: number; reg_proc_nome: string; reg_gpro_id: number }>;
  medicos: Array<{ reg_med_id: number; reg_med_nome: string }>;
  unidadesSaude: Array<{ reg_uni_id: number; reg_uni_nome: string }>;
  acs: Array<{ reg_acs_id: number; reg_acs_nome: string }>;
  tiposAtendimento: Array<{ reg_tipo_id: number; reg_tipo_nome: string; reg_tipo_peso: number }>;
}

export default function Edit({ 
  atendimento,
  pessoas, 
  gruposProcedimentos, 
  procedimentos, 
  medicos, 
  unidadesSaude, 
  acs, 
  tiposAtendimento 
}: EditProps) {
  // Função para formatar data para datetime-local
  const formatDateTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Função para formatar data para date
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data, setData, put, processing, errors } = useForm<AtendimentoFormData>({
    ger_pessoas_id: atendimento.ger_pessoas_id,
    reg_proc_id: atendimento.reg_proc_id,
    reg_gpro_id: atendimento.reg_gpro_id,
    reg_tipo_id: atendimento.reg_tipo_id,
    reg_ate_datendimento: formatDateTimeForInput(atendimento.reg_ate_datendimento),
    reg_ate_drequerente: formatDateForInput(atendimento.reg_ate_drequerente),
    reg_ate_obs: atendimento.reg_ate_obs || '',
    reg_uni_id: atendimento.reg_uni_id,
    reg_med_id: atendimento.reg_med_id,
    reg_ate_protoc_solicitante: atendimento.reg_ate_protoc_solicitante || '',
    reg_acs_id: atendimento.reg_acs_id,
    reg_ate_pos_atual: atendimento.reg_ate_pos_atual,
    reg_ate_pos_inicial: atendimento.reg_ate_pos_inicial,
    reg_ate_prioridade: atendimento.reg_ate_prioridade,
    reg_ate_retroativo: atendimento.reg_ate_retroativo,
  });

  // Estados para busca dinâmica de pacientes
  const [pacientesFiltrados, setPacientesFiltrados] = useState<Pessoa[]>([]);
  const [buscaPaciente, setBuscaPaciente] = useState('');
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Pessoa | null>(null);
  const [primeiraCarga, setPrimeiraCarga] = useState(true);

  // Estados para modal de cadastro rápido de paciente
  const [showModalPaciente, setShowModalPaciente] = useState(false);
  const [novoPacienteNome, setNovoPacienteNome] = useState('');
  const [novoPacienteCpf, setNovoPacienteCpf] = useState('');
  const [salvandoPaciente, setSalvandoPaciente] = useState(false);
  const [erroPaciente, setErroPaciente] = useState('');

  const [procedimentosFiltrados, setProcedimentosFiltrados] = useState(procedimentos);

  // Função para buscar pacientes
  const buscarPacientes = async (termo: string) => {
    setLoadingPacientes(true);
    try {
      const response = await fetch(`/administracao/pessoas-search?term=${encodeURIComponent(termo)}`);
      const data = await response.json();
      setLoadingPacientes(false);
      return data;
    } catch (e) {
      setLoadingPacientes(false);
      return [];
    }
  };

  // Buscar pacientes ao digitar, garantindo que o selecionado sempre aparece
  useEffect(() => {
    if (buscaPaciente.length >= 3) {
      setPrimeiraCarga(false); // Marca que não é mais a primeira carga
      buscarPacientes(buscaPaciente).then((resultados) => {
        setPacientesFiltrados(resultados);
      });
    } else if (buscaPaciente.length === 0 && !primeiraCarga) {
      // Se limpou a busca e não é primeira carga, limpa os filtrados
      setPacientesFiltrados([]);
    }
  }, [buscaPaciente, primeiraCarga]);

  // Sempre que o ID do paciente mudar, buscar o paciente selecionado se necessário
  useEffect(() => {
    if (data.ger_pessoas_id) {
      // Primeiro tenta encontrar nos pacientes filtrados
      let paciente = pacientesFiltrados.find(p => p.ger_pessoas_id === data.ger_pessoas_id);
      if (paciente) {
        setPacienteSelecionado(paciente);
      } else {
        // Busca na API se não estiver nos filtrados
        fetch(`/administracao/pessoas-search?id=${data.ger_pessoas_id}`)
          .then(res => res.json())
          .then(result => {
            if (Array.isArray(result) && result.length > 0) {
              setPacienteSelecionado(result[0]);
            } else {
              setPacienteSelecionado(null);
            }
          })
          .catch(() => setPacienteSelecionado(null));
      }
    } else {
      setPacienteSelecionado(null);
    }
  }, [data.ger_pessoas_id, pacientesFiltrados]);

  // Na primeira carga, usar o paciente que vem do backend
  useEffect(() => {
    if (primeiraCarga && pessoas.length > 0) {
      // Encontra o paciente atual nos dados do backend
      const pacienteAtual = pessoas.find(p => p.ger_pessoas_id === data.ger_pessoas_id);
      if (pacienteAtual) {
        setPacienteSelecionado(pacienteAtual);
        setPacientesFiltrados([pacienteAtual]); // Inclui o paciente atual na lista inicial
      }
    }
  }, [primeiraCarga, pessoas, data.ger_pessoas_id]);

  // Filtrar procedimentos quando grupo é selecionado
  useEffect(() => {
    if (data.reg_gpro_id > 0) {
      const filtrados = procedimentos.filter(p => p.reg_gpro_id === data.reg_gpro_id);
      setProcedimentosFiltrados(filtrados);
      // Resetar procedimento se não estiver no grupo selecionado
      if (!filtrados.find(p => p.reg_proc_id === data.reg_proc_id)) {
        setData('reg_proc_id', 0);
      }
    } else {
      setProcedimentosFiltrados(procedimentos);
    }
  }, [data.reg_gpro_id, procedimentos]);

  // Função para cadastrar paciente rápido
  const cadastrarPacienteRapido = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoPaciente(true);
    setErroPaciente('');
    try {
      const formData = new FormData();
      formData.append('ger_pessoas_nome', novoPacienteNome);
      formData.append('ger_pessoas_cpf', novoPacienteCpf);

      const response = await fetch('/administracao/pessoas', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
        },
        body: formData
      });

      const responseData = await response.json();
      if (responseData && responseData.pessoa) {
        // Adicionar nova pessoa à lista
        pessoas.push(responseData.pessoa);
        setPacientesFiltrados([responseData.pessoa]);
        setData('ger_pessoas_id', responseData.pessoa.ger_pessoas_id);
        setShowModalPaciente(false);
        setNovoPacienteNome('');
        setNovoPacienteCpf('');
        setSalvandoPaciente(false);
        setErroPaciente('');
        toast.success('Paciente cadastrado com sucesso!');
      } else {
        setErroPaciente('Erro ao cadastrar paciente');
        setSalvandoPaciente(false);
      }
    } catch (err) {
      setErroPaciente('Erro ao cadastrar paciente');
      setSalvandoPaciente(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('regulacao.atendimentos.update', atendimento.reg_ate_id));
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
              <h1 className="text-3xl font-bold text-blue-800">Editar Atendimento</h1>
              <p className="text-gray-600">Protocolo: {atendimento.reg_ate_protocolo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            
            <a href={route('regulacao.atendimentos.comprovante', atendimento.reg_ate_id)} target='_blank'>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Ver Comprovante
              </Button>
            </a>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <User className="h-6 w-6 mr-2" />
              Dados do Atendimento
            </CardTitle>
          </CardHeader>
          <AtendimentoForm
            data={data}
            setData={setData}
            onSubmit={handleSubmit}
            errors={errors as Record<string, string>}
            processing={processing}
            pessoas={pessoas}
            gruposProcedimentos={gruposProcedimentos}
            procedimentos={procedimentos}
            medicos={medicos}
            unidadesSaude={unidadesSaude}
            acs={acs}
            tiposAtendimento={tiposAtendimento}
            pacientesFiltrados={pacientesFiltrados}
            buscaPaciente={buscaPaciente}
            setBuscaPaciente={setBuscaPaciente}
            loadingPacientes={loadingPacientes}
            showModalPaciente={showModalPaciente}
            setShowModalPaciente={setShowModalPaciente}
            cadastrarPacienteRapido={cadastrarPacienteRapido}
            novoPacienteNome={novoPacienteNome}
            setNovoPacienteNome={setNovoPacienteNome}
            novoPacienteCpf={novoPacienteCpf}
            setNovoPacienteCpf={setNovoPacienteCpf}
            salvandoPaciente={salvandoPaciente}
            erroPaciente={erroPaciente}
            modo="edit"
            onCancel={() => window.history.back()}
          />
        </Card>

        {/* Modal de Cadastro Rápido de Paciente */}
        <Modal
          show={showModalPaciente}
          onClose={() => setShowModalPaciente(false)}
          title="Cadastrar Novo Paciente"
        >
          <form onSubmit={cadastrarPacienteRapido} className="space-y-4">
            <div>
              <Label htmlFor="novoPacienteNome">Nome Completo *</Label>
              <Input
                id="novoPacienteNome"
                value={novoPacienteNome}
                onChange={(e) => setNovoPacienteNome(e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="novoPacienteCpf">CPF *</Label>
              <Input
                id="novoPacienteCpf"
                value={novoPacienteCpf}
                onChange={(e) => setNovoPacienteCpf(e.target.value)}
                placeholder="Digite o CPF (apenas números)"
                required
              />
            </div>
            {erroPaciente && (
              <p className="text-sm text-red-500">{erroPaciente}</p>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModalPaciente(false)}
                disabled={salvandoPaciente}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={salvandoPaciente}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {salvandoPaciente ? 'Salvando...' : 'Cadastrar Paciente'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
} 