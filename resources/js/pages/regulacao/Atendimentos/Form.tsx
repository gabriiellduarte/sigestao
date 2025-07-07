import React, { use, useEffect, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, User, Building, Stethoscope, Save } from 'lucide-react';
import { Pessoa } from '@/types/pessoa';

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

interface AtendimentoFormProps {
  data: AtendimentoFormData;
  setData: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: Record<string, string>;
  processing: boolean;
  pessoas: Pessoa[];
  gruposProcedimentos: Array<{ reg_gpro_id: number; reg_gpro_nome: string }>;
  procedimentos: Array<{ reg_proc_id: number; reg_proc_nome: string; reg_gpro_id: number }>;
  medicos: Array<{ reg_med_id: number; reg_med_nome: string }>;
  unidadesSaude: Array<{ reg_uni_id: number; reg_uni_nome: string }>;
  acs: Array<{ reg_acs_id: number; reg_acs_nome: string }>;
  tiposAtendimento: Array<{ reg_tipo_id: number; reg_tipo_nome: string; reg_tipo_peso: number }>;
  pacientesFiltrados?: Pessoa[];
  buscaPaciente?: string;
  setBuscaPaciente?: (v: string) => void;
  loadingPacientes?: boolean;
  showModalPaciente?: boolean;
  setShowModalPaciente?: (v: boolean) => void;
  cadastrarPacienteRapido?: (e: React.FormEvent) => void;
  novoPacienteNome?: string;
  setNovoPacienteNome?: (v: string) => void;
  novoPacienteCpf?: string;
  setNovoPacienteCpf?: (v: string) => void;
  salvandoPaciente?: boolean;
  erroPaciente?: string;
  modo: 'create' | 'edit';
  onCancel: () => void;
}

export default function AtendimentoForm({
  data,
  setData,
  onSubmit,
  errors,
  processing,
  pessoas,
  gruposProcedimentos,
  procedimentos,
  medicos,
  unidadesSaude,
  acs,
  tiposAtendimento,
  pacientesFiltrados = [],
  buscaPaciente = '',
  setBuscaPaciente = () => {},
  loadingPacientes = false,
  showModalPaciente = false,
  setShowModalPaciente = () => {},
  cadastrarPacienteRapido = () => {},
  novoPacienteNome = '',
  setNovoPacienteNome = () => {},
  novoPacienteCpf = '',
  setNovoPacienteCpf = () => {},
  salvandoPaciente = false,
  erroPaciente = '',
  modo,
  onCancel,
}: AtendimentoFormProps) {
  const [procedimentosFiltrados, setProcedimentosFiltrados] = useState(procedimentos);

  useEffect(() => {
    if (data.reg_gpro_id > 0) {
      const filtrados = procedimentos.filter(p => p.reg_gpro_id === data.reg_gpro_id);
      setProcedimentosFiltrados(filtrados);
      if (!filtrados.find(p => p.reg_proc_id === data.reg_proc_id)) {
        setData('reg_proc_id', 0);
      }
    } else {
      setProcedimentosFiltrados(procedimentos);
    }
  }, [data.reg_gpro_id, procedimentos]);

  // Lógica para encontrar o paciente selecionado
  const pacienteSelecionado = pacientesFiltrados.find(p => p.ger_pessoas_id === data.ger_pessoas_id) || 
                              pessoas.find(p => p.ger_pessoas_id === data.ger_pessoas_id);

  return (
    <CardContent>
      {errors.duplicado && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center font-semibold">
          {errors.duplicado}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Paciente */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="paciente">Paciente *</Label>
            <div className="flex gap-2 items-center">
              <Select
                required
                value={data.ger_pessoas_id.toString()} 
                onValueChange={(value) => setData('ger_pessoas_id', parseInt(value))}
              >
                <SelectTrigger className={errors.ger_pessoas_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione o paciente">
                    {pacienteSelecionado
                      ? `${pacienteSelecionado.ger_pessoas_nome} - ${pacienteSelecionado.ger_pessoas_cpf}`
                      : null}
                  </SelectValue>
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
                    <>
                      {/* Mostrar pacientes filtrados da pesquisa */}
                      {pacientesFiltrados.map((pessoa) => (
                        <SelectItem key={pessoa.ger_pessoas_id} value={pessoa.ger_pessoas_id.toString()}>
                          {pessoa.ger_pessoas_nome} - {pessoa.ger_pessoas_cpf}
                        </SelectItem>
                      ))}
                      
                      {/* Se não há pacientes filtrados mas há busca, mostrar mensagem */}
                      {pacientesFiltrados.length === 0 && buscaPaciente && !loadingPacientes && (
                        <div className="p-2 text-sm text-gray-500">Nenhum paciente encontrado</div>
                      )}
                      
                      {/* Se não há busca ativa e não há pacientes filtrados, mostrar paciente atual */}
                      {pacientesFiltrados.length === 0 && !buscaPaciente && pacienteSelecionado && (
                        <SelectItem key={pacienteSelecionado.ger_pessoas_id} value={pacienteSelecionado.ger_pessoas_id.toString()}>
                          {pacienteSelecionado.ger_pessoas_nome} - {pacienteSelecionado.ger_pessoas_cpf}
                        </SelectItem>
                      )}
                    </>
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
                required
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
              required
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
              required
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
                required
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
              required
              value={data.reg_tipo_id.toString()} 
              onValueChange={(value) => setData('reg_tipo_id', parseInt(value))}
            >
              <SelectTrigger className={errors.reg_tipo_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposAtendimento.map((tipo) => (
                  <SelectItem key={tipo.reg_tipo_id} value={tipo.reg_tipo_id.toString()}>
                    {tipo.reg_tipo_nome} 
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {processing ? (modo === 'create' ? 'Salvando...' : 'Atualizando...') : (modo === 'create' ? 'Salvar Atendimento' : 'Atualizar Atendimento')}
          </Button>
        </div>
      </form>
    </CardContent>
  );
} 