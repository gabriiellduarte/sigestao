import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select as Select2,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Select from 'react-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Modal from '@/components/Modal';

interface Servidor {
  adm_servidores_id: number;
  ger_pessoas_nome: string;
  ger_pessoas_cpf: string;
}

interface Cargo {
  adm_cargos_id: number;
  adm_cargos_nome: string;
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
  if(tipo === 'Nomeação'){
    tipo = 'Nomear';
    return `Nomear ${nome}, CPF: ${cpf} para exercer o cargo em comissão de ${cargo} ${secretaria}, com atribuições e competências contidas na Lei Complementar Municipal Nº 003/2017.`
  }else if(tipo === 'Exoneração'){
    return `Exonerar ${nome}, CPF: ${cpf} a partir da presente data, do cargo de ${cargo} da ${secretaria}, para que surtam os efeitos legais.`
  }
  return '';
}

const CadastroPortarias: React.FC = () => {
  const page = usePage<PortariasFormPageProps>();
  const { portaria, cargos, secretarias, tipos, next_numero_portaria, flash } = page.props;
  const isEditing = !!portaria;

  const hoje = new Date().toISOString().slice(0, 10);

  const [excluirGoogleDocs, setExcluirGoogleDocs] = useState(false);
  const [showModalCargo, setShowModalCargo] = useState(false);
  const [novoCargoNome, setNovoCargoNome] = useState('');
  const [novoCargoAbreviacao, setNovoCargoAbreviacao] = useState('');
  const [salvandoCargo, setSalvandoCargo] = useState(false);
  const [erroCargo, setErroCargo] = useState('');

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
    doc_portarias_data: isEditing && portaria?.doc_portarias_data
      ? new Date(portaria.doc_portarias_data).toISOString().slice(0, 10)
      : hoje,
    doc_portarias_descricao: portaria?.doc_portarias_descricao || '',
    doc_portarias_link_documento: portaria?.doc_portarias_link_documento || '',
  });

  // Adicionar estados para busca dinâmica de servidores
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [buscaServidor, setBuscaServidor] = useState('');
  const [debouncedBuscaServidor, setDebouncedBuscaServidor] = useState('');
  const [loadingServidores, setLoadingServidores] = useState(false);

  // Função para buscar servidores (agora retorna os resultados)
  const buscarServidores = async (termo: string) => {
    setLoadingServidores(true);
    try {
      const response = await fetch(`/administracao/servidores-search?term=${encodeURIComponent(termo)}`);
      const data = await response.json();
      setLoadingServidores(false);
      return data;
    } catch (e) {
      setLoadingServidores(false);
      return [];
    }
  };

  useEffect(() => {
    console.info('Procurando próximo número de portaria...');
    fetch(route('documentos.portarias.proximonumero') + `?data=${encodeURIComponent(data.doc_portarias_data)}`)
      .then(res => res.json())
      .then(res => {
        console.info('Próximo número de portaria encontrado:', res);
        if (res && res.next_numero_portaria) {
          setData('doc_portarias_numero', String(res.next_numero_portaria));
        }
      });
  }, [data.doc_portarias_data]);

  // Debounce para buscaServidor
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBuscaServidor(buscaServidor);
    }, 700); // 400ms de espera
    return () => clearTimeout(handler);
  }, [buscaServidor]);

  // Buscar servidores ao digitar, garantindo que o selecionado sempre aparece
  useEffect(() => {
    if (debouncedBuscaServidor.length >= 6) {
      buscarServidores(debouncedBuscaServidor).then((resultados) => {
        if (data.adm_servidores_id && !resultados.some((s: any) => s.adm_servidores_id === data.adm_servidores_id)) {
          setServidores([
            {
              adm_servidores_id: Number(data.adm_servidores_id),
              ger_pessoas_nome: data.doc_portarias_servidor_nome,
              ger_pessoas_cpf: data.doc_portarias_servidor_cpf
            },
            ...resultados
          ]);
        } else {
          setServidores(resultados);
        }
      });
    } else {
      if (data.adm_servidores_id) {
        setServidores([{
          adm_servidores_id: Number(data.adm_servidores_id),
          ger_pessoas_nome: data.doc_portarias_servidor_nome,
          ger_pessoas_cpf: data.doc_portarias_servidor_cpf
        }]);
      } else {
        setServidores([]);
      }
    }
  }, [debouncedBuscaServidor, data.adm_servidores_id, data.doc_portarias_servidor_nome, data.doc_portarias_servidor_cpf]);

  // Garante que o servidor selecionado aparece no select em modo de edição
  useEffect(() => {
    if (isEditing && data.adm_servidores_id) {
      fetch(`/administracao/servidores-search?term=${data.doc_portarias_servidor_nome}`)
        .then(res => res.json())
        .then(res => {
          const encontrado = res.find((s: any) => s.adm_servidores_id === data.adm_servidores_id);
          if (encontrado) {
            setServidores([encontrado]);
          } else {
            setServidores([{
              adm_servidores_id: Number(data.adm_servidores_id),
              ger_pessoas_nome: data.doc_portarias_servidor_nome,
              ger_pessoas_cpf: data.doc_portarias_servidor_cpf
            }]);
          }
        });
    }
    // eslint-disable-next-line
  }, []);

  // Atualizar descrição automaticamente
  useEffect(() => {
    const tipo = tipos.find(t => t.doc_tiposportaria_id === data.doc_tiposportaria_id)?.doc_tiposportaria_nome || '';
    const nome = data.doc_portarias_servidor_nome;
    const cpf = data.doc_portarias_servidor_cpf;
    const cargo = cargos.find(c => c.adm_cargos_id === data.adm_cargos_id)?.adm_cargos_nome || '';
    const secretaria = secretarias.find(s => s.adm_secretarias_id === data.adm_secretarias_id)?.adm_secretarias_nome || '';
    const descricao = gerarDescricao(tipo, nome, cpf, cargo, secretaria);
    setData('doc_portarias_descricao', descricao);
    // eslint-disable-next-line
  }, [data.doc_tiposportaria_id, data.doc_portarias_servidor_nome, data.doc_portarias_servidor_cpf, data.adm_cargos_id, data.adm_secretarias_id]);

  // Preencher nome e CPF ao selecionar servidor
  useEffect(() => {
    if (data.adm_servidores_id) {
      const servidor = servidores.find(s => s.adm_servidores_id === Number(data.adm_servidores_id));
      if (servidor) {
        setData('doc_portarias_servidor_nome', servidor.ger_pessoas_nome);
        setData('doc_portarias_servidor_cpf', servidor.ger_pessoas_cpf);
      }
    } else {
      setData('doc_portarias_servidor_nome', '');
      setData('doc_portarias_servidor_cpf', '');
    }
    // eslint-disable-next-line
  }, [data.adm_servidores_id, servidores]);

  // Toast de erro e sucesso global
  useEffect(() => {
    if (flash && flash.error) {
      toast.error(flash.error);
    }
    if (flash && flash.success) {
      toast.success(flash.success);
    }
  }, [flash]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      put(route('documentos.portarias.update', portaria.doc_portarias_id));
    } else {
      post(route('documentos.portarias.store'));
    }
  };

  // Função para excluir portaria
  const handleDelete = () => {
    if (!portaria?.doc_portarias_id) return;
    if (window.confirm('Tem certeza que deseja excluir esta portaria?')) {
      router.delete(route('documentos.portarias.destroy', portaria.doc_portarias_id), {
        data: { excluir_google_docs: excluirGoogleDocs },
      });
    }
  };

  // Função para cadastrar cargo rápido
  const cadastrarCargoRapido = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoCargo(true);
    setErroCargo('');
    try {
      const formData = new FormData();
      formData.append('adm_cargos_nome', novoCargoNome);
      formData.append('adm_cargos_abreviacao', novoCargoAbreviacao);

      const response = await fetch('/administracao/cargos', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
        },
        body: formData
      });

      const data = await response.json();
      if (data && data.cargo) {
        if (Array.isArray(cargos)) {
          cargos.push(data.cargo);
        }
        setData('adm_cargos_id', data.cargo.adm_cargos_id);
        setShowModalCargo(false);
        setNovoCargoNome('');
        setNovoCargoAbreviacao('');
        setSalvandoCargo(false);
        setErroCargo('');
        toast.success('Cargo cadastrado com sucesso!');
      } else {
        setErroCargo('Erro ao cadastrar cargo');
        setSalvandoCargo(false);
      }
    } catch (err) {
      setErroCargo('Erro ao cadastrar cargo');
      setSalvandoCargo(false);
    }
  };

  const [buscaCargo, setBuscaCargo] = useState('');

  // Função para filtrar cargos
  const cargosFiltrados = Array.isArray(cargos)
    ? cargos.filter(cargo =>
        cargo.adm_cargos_nome.toLowerCase().includes(buscaCargo.toLowerCase())
      )
    : [];

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
                    inputId="adm_servidores_id"
                    classNamePrefix={errors.adm_servidores_id ? 'border-red-500' : ''}
                    isLoading={loadingServidores}
                    placeholder="Buscar servidor por nome ou CPF"
                    value={
                      servidores.find(s => s.adm_servidores_id === Number(data.adm_servidores_id))
                        ? {
                            value: data.adm_servidores_id,
                            label: servidores.find(s => s.adm_servidores_id === Number(data.adm_servidores_id))?.ger_pessoas_nome +
                              ' (' + servidores.find(s => s.adm_servidores_id === Number(data.adm_servidores_id))?.ger_pessoas_cpf + ')'
                          }
                        : null
                    }
                    onInputChange={value => setBuscaServidor(value)}
                    onChange={option => {
                      setData('adm_servidores_id', option ? option.value : '');
                    }}
                    options={servidores.map(servidor => ({
                      value: servidor.adm_servidores_id,
                      label: `${servidor.ger_pessoas_nome} (${servidor.ger_pessoas_cpf})`
                    }))}
                    noOptionsMessage={() => buscaServidor.length < 6 ? 'Digite pelo menos 6 caracteres' : 'Nenhum servidor encontrado'}
                    isClearable
                  />
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
                  <Select2
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
                  </Select2>
                  {errors.doc_portarias_status && (
                    <p className="text-sm text-red-500">{errors.doc_portarias_status}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adm_cargos_id">Cargo *</Label>
                  <div className="flex gap-2 items-center">
                    <Select2
                      value={data.adm_cargos_id ? String(data.adm_cargos_id) : ''}
                      onValueChange={value => setData('adm_cargos_id', Number(value))}
                    >
                      <SelectTrigger className={errors.adm_cargos_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <Input
                            placeholder="Buscar cargo"
                            value={buscaCargo}
                            onChange={e => setBuscaCargo(e.target.value)}
                            autoFocus
                          />
                        </div>
                        {cargosFiltrados.map(cargo => (
                          <SelectItem key={cargo.adm_cargos_id} value={String(cargo.adm_cargos_id)}>
                            {cargo.adm_cargos_nome}
                          </SelectItem>
                        ))}
                        {cargosFiltrados.length === 0 && (
                          <div className="p-2 text-sm text-gray-500">Nenhum cargo encontrado</div>
                        )}
                      </SelectContent>
                    </Select2>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowModalCargo(true)}>
                      + Novo
                    </Button>
                  </div>
                  {errors.adm_cargos_id && (
                    <p className="text-sm text-red-500">{errors.adm_cargos_id}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adm_secretarias_id">Secretaria *</Label>
                  <Select2
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
                  </Select2>
                  {errors.adm_secretarias_id && (
                    <p className="text-sm text-red-500">{errors.adm_secretarias_id}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc_tiposportaria_id">Tipo de Portaria *</Label>
                  <Select2
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
                  </Select2>
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
                    onChange={e => setData('doc_portarias_descricao', e.target.value)}
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
                <Link href={route('documentos.portarias.create')}>
                  <Button type="button" variant="outline" className="w-full md:w-auto">
                    Criar nova portaria
                  </Button>
                </Link>
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
            {isEditing && (
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 pt-4 border-t mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={excluirGoogleDocs}
                    onChange={e => setExcluirGoogleDocs(e.target.checked)}
                  />
                  Excluir também o arquivo do Google Docs
                </label>
                <Button type="button" variant="destructive" onClick={handleDelete} className="w-full md:w-auto">
                  Excluir Portaria
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Modal show={showModalCargo} onClose={() => setShowModalCargo(false)} title="Novo Cargo">
        <form onSubmit={cadastrarCargoRapido} className="space-y-4">
          <div>
            <Label htmlFor="novoCargoNome">Nome do Cargo</Label>
            <Input id="novoCargoNome" value={novoCargoNome} onChange={e => setNovoCargoNome(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="novoCargoAbreviacao">Abreviação</Label>
            <Input id="novoCargoAbreviacao" value={novoCargoAbreviacao} onChange={e => setNovoCargoAbreviacao(e.target.value)} />
          </div>
          {erroCargo && <p className="text-sm text-red-500">{erroCargo}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowModalCargo(false)}>Cancelar</Button>
            <Button type="submit" disabled={salvandoCargo}>{salvandoCargo ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default CadastroPortarias;