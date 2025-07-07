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
import Modal from '@/components/Modal';
import { toast } from 'sonner';
import AtendimentoForm from './Form';

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
  [key: string]: any; // Adicionar índice de assinatura para satisfazer FormDataType
}

interface CreateProps {
  pessoas: Pessoa[];
  gruposProcedimentos: Array<{ reg_gpro_id: number; reg_gpro_nome: string }>;
  procedimentos: Array<{ reg_proc_id: number; reg_proc_nome: string; reg_gpro_id: number }>;
  medicos: Array<{ reg_med_id: number; reg_med_nome: string }>;
  unidadesSaude: Array<{ reg_uni_id: number; reg_uni_nome: string }>;
  acs: Array<{ reg_acs_id: number; reg_acs_nome: string }>;
  tiposAtendimento: Array<{ reg_tipo_id: number; reg_tipo_nome: string; reg_tipo_peso: number }>;
}

export default function Create({ 
  pessoas, 
  gruposProcedimentos, 
  procedimentos, 
  medicos, 
  unidadesSaude, 
  acs, 
  tiposAtendimento 
}: CreateProps) {
  // Função para obter data e hora atual no formato datetime-local
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const { data, setData, post, processing, errors } = useForm<AtendimentoFormData>({
    ger_pessoas_id: 0,
    reg_proc_id: 0,
    reg_gpro_id: 0,
    reg_tipo_id: 0,
    reg_ate_datendimento: getCurrentDateTime(),
    reg_ate_drequerente: '',
    reg_ate_obs: '',
    reg_uni_id: null,
    reg_med_id: null,
    reg_ate_protoc_solicitante: '',
    reg_acs_id: null,
    reg_ate_pos_atual: null,
    reg_ate_pos_inicial: null,
    reg_ate_prioridade: false,
    reg_ate_retroativo: false,
  });

  // Estados para busca dinâmica de pacientes
  const [pacientesFiltrados, setPacientesFiltrados] = useState<Pessoa[]>([]);
  const [buscaPaciente, setBuscaPaciente] = useState('');
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Pessoa | null>(null);

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
      buscarPacientes(buscaPaciente).then((resultados) => {
        setPacientesFiltrados(resultados);
      });
    } else {
      setPacientesFiltrados([]);
    }
  }, [buscaPaciente]);

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
    post(route('regulacao.atendimentos.store'));
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
              <h1 className="text-3xl font-bold text-blue-800">Novo Atendimento</h1>
              <p className="text-gray-600">Cadastro de solicitação de atendimento</p>
            </div>
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
            modo="create"
            onCancel={() => window.history.back()}
          />
        </Card>
      </div>
    </AppLayout>
  );
} 