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
        if (data.ger_pessoas_id && !resultados.some((p: any) => p.ger_pessoas_id === data.ger_pessoas_id)) {
          const pacienteSelecionado = pessoas.find(p => p.ger_pessoas_id === data.ger_pessoas_id);
          if (pacienteSelecionado) {
            setPacientesFiltrados([pacienteSelecionado, ...resultados]);
          } else {
            setPacientesFiltrados(resultados);
          }
        } else {
          setPacientesFiltrados(resultados);
        }
      });
    } else {
      if (data.ger_pessoas_id) {
        const pacienteSelecionado = pessoas.find(p => p.ger_pessoas_id === data.ger_pessoas_id);
        if (pacienteSelecionado) {
          setPacientesFiltrados([pacienteSelecionado]);
        } else {
          setPacientesFiltrados([]);
        }
      } else {
        setPacientesFiltrados([]);
      }
    }
  }, [buscaPaciente, data.ger_pessoas_id, pessoas]);

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
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Paciente */}
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="paciente">Paciente *</Label>
                  <div className="flex gap-2 items-center">
                    <Select 
                      value={data.ger_pessoas_id.toString()} 
                      onValueChange={(value) => setData('ger_pessoas_id', parseInt(value))}
                    >
                      <SelectTrigger className={errors.ger_pessoas_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <Input
                            placeholder="Buscar paciente"
                            value={buscaPaciente}
                            onChange={e => setBuscaPaciente(e.target.value)}
                            autoFocus
                          />
                        </div>
                        {loadingPacientes ? (
                          <div className="p-2 text-sm text-gray-500">Carregando pacientes...</div>
                        ) : (
                          pacientesFiltrados.map((pessoa) => (
                            <SelectItem key={pessoa.ger_pessoas_id} value={pessoa.ger_pessoas_id.toString()}>
                              {pessoa.ger_pessoas_nome} - {pessoa.ger_pessoas_cpf}
                            </SelectItem>
                          ))
                        )}
                        {pacientesFiltrados.length === 0 && buscaPaciente && !loadingPacientes && (
                          <div className="p-2 text-sm text-gray-500">Nenhum paciente encontrado</div>
                        )}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowModalPaciente(true)}>
                      + Novo
                    </Button>
                  </div>
                  {errors.ger_pessoas_id && (
                    <p className="text-sm text-red-500">{errors.ger_pessoas_id}</p>
                  )}
                </div>

                {/* Data do Atendimento */}
                <div className="space-y-2">
                  <Label htmlFor="reg_ate_datendimento">Data do Atendimento na regulação *</Label>
                  <div className="relative">
                    <Input
                      id="reg_ate_datendimento"
                      type="datetime-local"
                      value={data.reg_ate_datendimento}
                      onChange={(e) => setData('reg_ate_datendimento', e.target.value)}
                      className={`pl-10 ${errors.reg_ate_datendimento ? 'border-red-500' : ''}`}
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.reg_ate_datendimento && (
                    <p className="text-sm text-red-500">{errors.reg_ate_datendimento}</p>
                  )}
                </div>

                {/* Unidade Solicitante */}
                <div className="space-y-2">
                  <Label htmlFor="reg_uni_id">Unidade Solicitante</Label>
                  <Select 
                    value={data.reg_uni_id?.toString() || ''} 
                    onValueChange={(value) => setData('reg_uni_id', value ? parseInt(value) : null)}
                  >
                    <SelectTrigger className={errors.reg_uni_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidadesSaude.map((unidade) => (
                        <SelectItem key={unidade.reg_uni_id} value={unidade.reg_uni_id.toString()}>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            {unidade.reg_uni_nome}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.reg_uni_id && (
                    <p className="text-sm text-red-500">{errors.reg_uni_id}</p>
                  )}
                </div>

                {/* Grupo de Procedimentos */}
                <div className="space-y-2">
                  <Label htmlFor="reg_gpro_id">Grupo de Procedimentos *</Label>
                  <Select 
                    value={data.reg_gpro_id.toString()} 
                    onValueChange={(value) => setData('reg_gpro_id', parseInt(value))}
                  >
                    <SelectTrigger className={errors.reg_gpro_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {gruposProcedimentos.map((grupo) => (
                        <SelectItem key={grupo.reg_gpro_id} value={grupo.reg_gpro_id.toString()}>
                          {grupo.reg_gpro_nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.reg_gpro_id && (
                    <p className="text-sm text-red-500">{errors.reg_gpro_id}</p>
                  )}
                </div>

                {/* Procedimento */}
                <div className="space-y-2">
                  <Label htmlFor="reg_proc_id">Procedimento *</Label>
                  <Select 
                    value={data.reg_proc_id.toString()} 
                    onValueChange={(value) => setData('reg_proc_id', parseInt(value))}
                  >
                    <SelectTrigger className={errors.reg_proc_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o procedimento" />
                    </SelectTrigger>
                    <SelectContent>
                      {procedimentosFiltrados.map((proc) => (
                        <SelectItem key={proc.reg_proc_id} value={proc.reg_proc_id.toString()}>
                          <div className="flex items-center">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            {proc.reg_proc_nome}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.reg_proc_id && (
                    <p className="text-sm text-red-500">{errors.reg_proc_id}</p>
                  )}
                </div>

                {/* Médico Solicitante */}
                <div className="space-y-2">
                  <Label htmlFor="reg_med_id">Médico Solicitante</Label>
                  <Select 
                    value={data.reg_med_id?.toString() || ''} 
                    onValueChange={(value) => setData('reg_med_id', value ? parseInt(value) : null)}
                  >
                    <SelectTrigger className={errors.reg_med_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicos.map((medico) => (
                        <SelectItem key={medico.reg_med_id} value={medico.reg_med_id.toString()}>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {medico.reg_med_nome}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.reg_med_id && (
                    <p className="text-sm text-red-500">{errors.reg_med_id}</p>
                  )}
                </div>

                {/* Protocolo Solicitante */}
                <div className="space-y-2">
                  <Label htmlFor="reg_ate_protoc_solicitante">Protocolo Solicitante</Label>
                  <Input
                    id="reg_ate_protoc_solicitante"
                    value={data.reg_ate_protoc_solicitante}
                    onChange={(e) => setData('reg_ate_protoc_solicitante', e.target.value)}
                    placeholder="Digite o protocolo"
                    className={errors.reg_ate_protoc_solicitante ? 'border-red-500' : ''}
                  />
                  {errors.reg_ate_protoc_solicitante && (
                    <p className="text-sm text-red-500">{errors.reg_ate_protoc_solicitante}</p>
                  )}
                </div>

                {/* Data de Solicitação */}
                <div className="space-y-2">
                  <Label htmlFor="reg_ate_drequerente">Data de Solicitação do médico *</Label>
                  <div className="relative">
                    <Input
                      id="reg_ate_drequerente"
                      type="date"
                      value={data.reg_ate_drequerente}
                      onChange={(e) => setData('reg_ate_drequerente', e.target.value)}
                      className={`pl-10 ${errors.reg_ate_drequerente ? 'border-red-500' : ''}`}
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.reg_ate_drequerente && (
                    <p className="text-sm text-red-500">{errors.reg_ate_drequerente}</p>
                  )}
                </div>

                {/* Tipo de Atendimento */}
                <div className="space-y-2">
                  <Label htmlFor="reg_tipo_id">Tipo de Atendimento *</Label>
                  <Select 
                    value={data.reg_tipo_id.toString()} 
                    onValueChange={(value) => setData('reg_tipo_id', parseInt(value))}
                  >
                    <SelectTrigger className={errors.reg_tipo_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposAtendimento.map((tipo) => (
                        <SelectItem key={tipo.reg_tipo_id} value={tipo.reg_tipo_id.toString()}>
                          {tipo.reg_tipo_nome} (Peso: {tipo.reg_tipo_peso})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.reg_tipo_id && (
                    <p className="text-sm text-red-500">{errors.reg_tipo_id}</p>
                  )}
                </div>

                {/* ACS */}
                <div className="space-y-2">
                  <Label htmlFor="reg_acs_id">ACS</Label>
                  <Select 
                    value={data.reg_acs_id?.toString() || ''} 
                    onValueChange={(value) => setData('reg_acs_id', value ? parseInt(value) : null)}
                  >
                    <SelectTrigger className={errors.reg_acs_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o ACS" />
                    </SelectTrigger>
                    <SelectContent>
                      {acs.map((acsItem) => (
                        <SelectItem key={acsItem.reg_acs_id} value={acsItem.reg_acs_id.toString()}>
                          {acsItem.reg_acs_nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.reg_acs_id && (
                    <p className="text-sm text-red-500">{errors.reg_acs_id}</p>
                  )}
                </div>

                {/* Posição Atual */}
                <div className="space-y-2 hidden">
                  <Label htmlFor="reg_ate_pos_atual">Posição Atual</Label>
                  <Input
                    id="reg_ate_pos_atual"
                    type="number"
                    value={data.reg_ate_pos_atual || ''}
                    onChange={(e) => setData('reg_ate_pos_atual', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Posição atual na fila"
                    className={errors.reg_ate_pos_atual ? 'border-red-500' : ''}
                  />
                  {errors.reg_ate_pos_atual && (
                    <p className="text-sm text-red-500">{errors.reg_ate_pos_atual}</p>
                  )}
                </div>

                {/* Posição Inicial */}
                <div className="space-y-2 hidden">
                  <Label htmlFor="reg_ate_pos_inicial">Posição Inicial</Label>
                  <Input
                    id="reg_ate_pos_inicial"
                    type="number"
                    value={data.reg_ate_pos_inicial || ''}
                    onChange={(e) => setData('reg_ate_pos_inicial', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Posição inicial na fila"
                    className={errors.reg_ate_pos_inicial ? 'border-red-500' : ''}
                  />
                  {errors.reg_ate_pos_inicial && (
                    <p className="text-sm text-red-500">{errors.reg_ate_pos_inicial}</p>
                  )}
                </div>

                {/* Prioridade */}
                <div className="space-y-2">
                  <Label htmlFor="reg_ate_prioridade">Prioridade</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="reg_ate_prioridade"
                      checked={data.reg_ate_prioridade}
                      onCheckedChange={(checked) => setData('reg_ate_prioridade', checked)}
                    />
                    <Label htmlFor="reg_ate_prioridade">Marcar como prioritário</Label>
                  </div>
                  {errors.reg_ate_prioridade && (
                    <p className="text-sm text-red-500">{errors.reg_ate_prioridade}</p>
                  )}
                </div>

                {/* Retroativo */}
                <div className="space-y-2 hidden">
                  <Label htmlFor="reg_ate_retroativo">Retroativo</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="reg_ate_retroativo"
                      checked={data.reg_ate_retroativo}
                      onCheckedChange={(checked) => setData('reg_ate_retroativo', checked)}
                    />
                    <Label htmlFor="reg_ate_retroativo">Marcar como retroativo</Label>
                  </div>
                  {errors.reg_ate_retroativo && (
                    <p className="text-sm text-red-500">{errors.reg_ate_retroativo}</p>
                  )}
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="reg_ate_obs">Observações</Label>
                <Textarea
                  id="reg_ate_obs"
                  value={data.reg_ate_obs}
                  onChange={(e) => setData('reg_ate_obs', e.target.value)}
                  placeholder="Digite observações sobre o atendimento..."
                  rows={4}
                  className={errors.reg_ate_obs ? 'border-red-500' : ''}
                />
                {errors.reg_ate_obs && (
                  <p className="text-sm text-red-500">{errors.reg_ate_obs}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link href={route('regulacao.atendimentos.index')}>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {processing ? 'Salvando...' : 'Salvar Atendimento'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Modal de Cadastro Rápido de Paciente */}
        <Modal show={showModalPaciente} onClose={() => setShowModalPaciente(false)} title="Novo Paciente">
          <form onSubmit={cadastrarPacienteRapido} className="space-y-4">
            <div>
              <Label htmlFor="novoPacienteNome">Nome do Paciente</Label>
              <Input 
                id="novoPacienteNome" 
                value={novoPacienteNome} 
                onChange={e => setNovoPacienteNome(e.target.value)} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="novoPacienteCpf">CPF</Label>
              <Input 
                id="novoPacienteCpf" 
                value={novoPacienteCpf} 
                onChange={e => setNovoPacienteCpf(e.target.value)} 
                required 
              />
            </div>
            {erroPaciente && <p className="text-sm text-red-500">{erroPaciente}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowModalPaciente(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={salvandoPaciente}>
                {salvandoPaciente ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
} 