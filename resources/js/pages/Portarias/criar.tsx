import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Textarea } from '@/components/ui/textarea';

interface Pessoa {
  ger_pessoas_id: number;
  ger_pessoas_nome: string;
  ger_pessoas_cpf: string;
}

interface Servidor {
  adm_servidores_id: number;
  pessoa: Pessoa;
}

interface Cargo {
  adm_cargos_id: number;
  adm_argos_nome: string;
}

interface Secretaria {
  adm_secretarias_id: number;
  adm_secretarias_nome: string;
}

interface TipoPortaria {
  doc_tiposportaria_id: number;
  doc_tiposportaria_nome: string;
}

interface PortariaFormData {
  doc_portarias_numero: string;
  adm_servidores_id: number | '';
  doc_portarias_servidor_nome: string;
  doc_portarias_servidor_cpf: string;
  doc_portarias_status: string;
  adm_cargos_id: number | '';
  adm_secretarias_id: number | '';
  doc_tiposportaria_id: number | '';
  doc_portarias_data: string;
  doc_portarias_descricao: string;
  doc_portarias_link_documento: string;
  [key: string]: any;
}

interface PortariasFormPageProps extends PageProps {
  portaria?: any;
  servidores: Servidor[];
  cargos: Cargo[];
  secretarias: Secretaria[];
  tipos: TipoPortaria[];
  next_numero_portaria?: number;
  [key: string]: any;
}

// Função para gerar a descrição automática
function gerarDescricao(tipo: string, nome: string, cpf: string, cargo: string, secretaria: string) {
  if (!tipo || !nome || !cpf || !cargo || !secretaria) return '';
  return `${tipo} ${nome}, CPF: ${cpf} para exercer o cargo em comissão de ${cargo} ${secretaria}, com atribuições e competências contidas na Lei Complementar Municipal Nº 003/2017.`;
}

const CadastroPortarias: React.FC = () => {
  const { portaria, servidores, cargos, secretarias, tipos, next_numero_portaria } = usePage<PortariasFormPageProps>().props;
  const isEditing = !!portaria;

  const hoje = new Date().toISOString().slice(0, 10);

  const [descricaoEditada, setDescricaoEditada] = useState(false);

  const { data, setData, post, put, processing, errors, reset } = useForm<PortariaFormData>({
    doc_portarias_numero: isEditing
      ? portaria?.doc_portarias_numero || ''
      : (next_numero_portaria ? String(next_numero_portaria) : ''),
    adm_servidores_id: portaria?.adm_servidores_id || '',
    doc_portarias_servidor_nome: portaria?.doc_portarias_servidor_nome || '',
    doc_portarias_servidor_cpf: portaria?.doc_portarias_servidor_cpf || '',
    doc_portarias_status: portaria?.doc_portarias_status || 'pendente',
    adm_cargos_id: portaria?.adm_cargos_id || '',
    adm_secretarias_id: portaria?.adm_secretarias_id || '',
    doc_tiposportaria_id: portaria?.doc_tiposportaria_id || '',
    doc_portarias_data: portaria?.doc_portarias_data || hoje,
    doc_portarias_descricao: portaria?.doc_portarias_descricao || '',
    doc_portarias_link_documento: portaria?.doc_portarias_link_documento || '',
  });

  // Preencher nome e CPF ao selecionar servidor
  useEffect(() => {
    if (data.adm_servidores_id) {
      const servidor = servidores.find(s => s.adm_servidores_id === Number(data.adm_servidores_id));
      if (servidor) {
        setData('doc_portarias_servidor_nome', servidor.pessoa.ger_pessoas_nome);
        setData('doc_portarias_servidor_cpf', servidor.pessoa.ger_pessoas_cpf);
      }
    } else {
      setData('doc_portarias_servidor_nome', '');
      setData('doc_portarias_servidor_cpf', '');
    }
    // eslint-disable-next-line
  }, [data.adm_servidores_id]);

  // Atualizar descrição automaticamente
  useEffect(() => {
    if (descricaoEditada) return;
    const tipo = tipos.find(t => t.doc_tiposportaria_id === data.doc_tiposportaria_id)?.doc_tiposportaria_nome || '';
    const nome = data.doc_portarias_servidor_nome;
    const cpf = data.doc_portarias_servidor_cpf;
    const cargo = cargos.find(c => c.adm_cargos_id === data.adm_cargos_id)?.adm_argos_nome || '';
    const secretaria = secretarias.find(s => s.adm_secretarias_id === data.adm_secretarias_id)?.adm_secretarias_nome || '';
    const descricao = gerarDescricao(tipo, nome, cpf, cargo, secretaria);
    if (!isEditing || !portaria?.doc_portarias_descricao) {
      setData('doc_portarias_descricao', descricao);
    }
    // eslint-disable-next-line
  }, [data.doc_tiposportaria_id, data.doc_portarias_servidor_nome, data.doc_portarias_servidor_cpf, data.adm_cargos_id, data.adm_secretarias_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      put(route('documentos.portarias.update', portaria.doc_portarias_id));
    } else {
      post(route('documentos.portarias.store'));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 p-4">
        <div className="flex items-center gap-4">
          <Link href={route('documentos.portarias.index')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Portaria' : 'Nova Portaria'}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {isEditing ? 'Altere os dados da portaria' : 'Preencha os dados da nova portaria'}
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Dados da Portaria</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doc_portarias_numero">Número *</Label>
                  <Input
                    id="doc_portarias_numero"
                    value={data.doc_portarias_numero}
                    onChange={e => setData('doc_portarias_numero', e.target.value)}
                    placeholder="Número da portaria"
                    className={errors.doc_portarias_numero ? 'border-red-500' : ''}
                  />
                  {errors.doc_portarias_numero && (
                    <p className="text-sm text-red-500">
                      {errors.doc_portarias_numero.includes('validation.unique')
                        ? 'Número duplicado'
                        : errors.doc_portarias_numero}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adm_servidores_id">Servidor *</Label>
                  <Select
                    value={data.adm_servidores_id ? String(data.adm_servidores_id) : ''}
                    onValueChange={value => setData('adm_servidores_id', Number(value))}
                  >
                    <SelectTrigger className={errors.adm_servidores_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o servidor" />
                    </SelectTrigger>
                    <SelectContent>
                      {servidores.map(servidor => (
                        <SelectItem key={servidor.adm_servidores_id} value={String(servidor.adm_servidores_id)}>
                          {servidor.pessoa.ger_pessoas_nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.adm_servidores_id && (
                    <p className="text-sm text-red-500">{errors.adm_servidores_id}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc_portarias_servidor_cpf">CPF do Servidor</Label>
                  <Input
                    id="doc_portarias_servidor_cpf"
                    value={data.doc_portarias_servidor_cpf}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc_portarias_status">Status *</Label>
                  <Select
                    value={data.doc_portarias_status}
                    onValueChange={value => setData('doc_portarias_status', value)}
                  >
                    <SelectTrigger className={errors.doc_portarias_status ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="publicado">Publicado</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.doc_portarias_status && (
                    <p className="text-sm text-red-500">{errors.doc_portarias_status}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adm_cargos_id">Cargo *</Label>
                  <Select
                    value={data.adm_cargos_id ? String(data.adm_cargos_id) : ''}
                    onValueChange={value => setData('adm_cargos_id', Number(value))}
                  >
                    <SelectTrigger className={errors.adm_cargos_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {cargos.map(cargo => (
                        <SelectItem key={cargo.adm_cargos_id} value={String(cargo.adm_cargos_id)}>
                          {cargo.adm_argos_nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.adm_cargos_id && (
                    <p className="text-sm text-red-500">{errors.adm_cargos_id}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adm_secretarias_id">Secretaria *</Label>
                  <Select
                    value={data.adm_secretarias_id ? String(data.adm_secretarias_id) : ''}
                    onValueChange={value => setData('adm_secretarias_id', Number(value))}
                  >
                    <SelectTrigger className={errors.adm_secretarias_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione a secretaria" />
                    </SelectTrigger>
                    <SelectContent>
                      {secretarias.map(secretaria => (
                        <SelectItem key={secretaria.adm_secretarias_id} value={String(secretaria.adm_secretarias_id)}>
                          {secretaria.adm_secretarias_nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.adm_secretarias_id && (
                    <p className="text-sm text-red-500">{errors.adm_secretarias_id}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc_tiposportaria_id">Tipo de Portaria *</Label>
                  <Select
                    value={data.doc_tiposportaria_id ? String(data.doc_tiposportaria_id) : ''}
                    onValueChange={value => setData('doc_tiposportaria_id', Number(value))}
                  >
                    <SelectTrigger className={errors.doc_tiposportaria_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipos.map(tipo => (
                        <SelectItem key={tipo.doc_tiposportaria_id} value={String(tipo.doc_tiposportaria_id)}>
                          {tipo.doc_tiposportaria_nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.doc_tiposportaria_id && (
                    <p className="text-sm text-red-500">{errors.doc_tiposportaria_id}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc_portarias_data">Data *</Label>
                  <Input
                    id="doc_portarias_data"
                    type="date"
                    value={data.doc_portarias_data}
                    onChange={e => setData('doc_portarias_data', e.target.value)}
                    className={errors.doc_portarias_data ? 'border-red-500' : ''}
                  />
                  {errors.doc_portarias_data && (
                    <p className="text-sm text-red-500">{errors.doc_portarias_data}</p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="doc_portarias_descricao">Descrição</Label>
                  <Textarea
                    id="doc_portarias_descricao"
                    value={data.doc_portarias_descricao}
                    onChange={e => {
                      setData('doc_portarias_descricao', e.target.value);
                      setDescricaoEditada(true);
                    }}
                    placeholder="Descrição da portaria"
                  />
                  {errors.doc_portarias_descricao && (
                    <p className="text-sm text-red-500">{errors.doc_portarias_descricao}</p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="doc_portarias_link_documento">Link do Documento</Label>
                  <div className="flex gap-2">
                    <Input
                      id="doc_portarias_link_documento"
                      value={data.doc_portarias_link_documento}
                      onChange={e => setData('doc_portarias_link_documento', e.target.value)}
                      placeholder="URL do documento (opcional)"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!data.doc_portarias_link_documento}
                      onClick={() => {
                        if (data.doc_portarias_link_documento) {
                          window.open(data.doc_portarias_link_documento, '_blank');
                        }
                      }}
                    >
                      Abrir
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-2 pt-4">
                <Link href={route('documentos.portarias.index')}>
                  <Button type="button" variant="outline" className="w-full md:w-auto">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={processing} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Salvar Alterações' : 'Salvar Portaria'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CadastroPortarias;