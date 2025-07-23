import React, { useState, useEffect } from 'react';
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
import { Link, useForm } from '@inertiajs/react';
import { Pessoa } from '@/types/pessoa';

interface Servidor {
  id?: number;
  ger_pessoas_id: number;
  cpf: string;
  email: string;
  status: 'ativo' | 'inativo';
}

interface PessoaFiltro {
  adm_servidores_id: number;
  ger_pessoas_nome?: string;
  ger_pessoas_cpf?: string | null;
}

interface CadastroServidoresProps {
  servidor?: Servidor;
  pessoas: Pessoa[];
  onBack: () => void;
  onSave: (servidor: Servidor) => void;
}

const secretarias = [
  'Secretaria de Administração',
  'Secretaria de Educação',
  'Secretaria de Saúde',
  'Secretaria de Obras',
  'Secretaria de Assistência Social',
  'Secretaria de Cultura',
  'Secretaria de Esportes',
  'Secretaria de Meio Ambiente'
];

export const CadastroServidores: React.FC<CadastroServidoresProps> = ({
  servidor,
  onBack,
  onSave, ...props
}) => {
  const { data, setData, post, put, processing, errors } = useForm({
    ger_pessoas_id: servidor?.ger_pessoas_id || 0,
    cpf: servidor?.cpf || '',
    email: servidor?.email || '',
    status: servidor?.status || 'ativo'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof typeof data, value: string | number) => {
    setData(field, value);
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  // Adicionar estados para busca dinâmica de servidores
  const [pessoas, setPessoas] = useState<PessoaFiltro[]>([]);
  const [buscaServidor, setBuscaServidor] = useState('');
  const [loadingServidores, setLoadingServidores] = useState(false);
  // Função para buscar servidores (agora retorna os resultados)
  const buscarServidores = async (termo: string) => {
    setLoadingServidores(true);
    try {
      const response = await fetch(`/administracao/pessoas-search?term=${encodeURIComponent(termo)}`);
      const data = await response.json();
      setLoadingServidores(false);
      return data;
    } catch (e) {
      setLoadingServidores(false);
      return [];
    }
  };

  // Buscar servidores ao digitar, garantindo que o selecionado sempre aparece
  useEffect(() => {
    if (buscaServidor.length >= 6) {
      buscarServidores(buscaServidor).then((resultados) => {
        if (data.ger_pessoas_id && !resultados.some((s: any) => s.adm_servidores_id === data.ger_pessoas_id)) {
          console.log('Adicionando servidor selecionado:', resultados);
          setPessoas([
            {
              ger_pessoas_id: Number(data.ger_pessoas_id)
            },
            ...resultados
          ]);
          console.log('Pessoas após adição:', resultados);
        } else {
          console.log('Resultados encontrados:', resultados);
          setPessoas(resultados);
        }
      });
    } else {
      if (data.ger_pessoas_id) {
        setPessoas([{
          adm_servidores_id: Number(data.ger_pessoas_id)
        }]);
      } else {
        setPessoas([]);
      }
    }
  }, [buscaServidor, data.ger_pessoas_id]);

  function atribuiPessoa_CPF(value: number) {
    setData('ger_pessoas_id', value);
    // Busca a pessoa correspondente e atualiza o CPF
    console.log(value);
    const pessoa = pessoas.find(p => p.adm_servidores_id === value);

    if (pessoa) {
      setData('cpf', pessoa.ger_pessoas_cpf || '');
    } else {
      setData('cpf', '');
    }

  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.ger_pessoas_id || data.ger_pessoas_id === 0) {
      newErrors.ger_pessoas_id = 'Pessoa é obrigatório';
    }
    if (!data.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }
    if (!data.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (isEditing && servidor) {
        put(route('administracao.servidores.update', servidor.id));
      } else {
        post(route('administracao.servidores.store'));
      }
    }
  };

  const isEditing = !!servidor?.id;

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 p-4">
        <div className="flex items-center gap-4">
          <Link href={route('administracao.servidores.index')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Servidor' : 'Novo Servidor'}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {isEditing ? 'Altere os dados do servidor' : 'Preencha os dados do novo servidor'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Servidor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adm_servidores_id">Servidor *</Label>
                  <Select
                    value={data.ger_pessoas_id ? String(data.ger_pessoas_id) : ''}
                    onValueChange={(value) => atribuiPessoa_CPF(parseInt(value))}
                  >
                    <SelectTrigger className={errors.ger_pessoas_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o servidor" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Buscar servidor por nome ou CPF"
                          value={buscaServidor}
                          onChange={e => setBuscaServidor(e.target.value)}
                          autoFocus
                        />
                      </div>
                      {loadingServidores && (
                        <div className="p-2 text-sm text-gray-500">Carregando...</div>
                      )}
                      {pessoas.map(servidor => (
                        <SelectItem key={servidor.adm_servidores_id} value={String(servidor.adm_servidores_id)}>
                          {servidor.ger_pessoas_nome} ({servidor.ger_pessoas_cpf})
                        </SelectItem>
                      ))}
                      {!loadingServidores && pessoas.length === 0 && buscaServidor && (
                        <div className="p-2 text-sm text-gray-500">Nenhum servidor encontrado</div>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.ger_pessoas_id && (
                    <p className="text-sm text-red-500">{errors.ger_pessoas_id}</p>
                  )}
                </div>


                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={data.cpf}
                    placeholder="000.000.000-00"
                    className={formErrors.cpf || errors.cpf ? 'border-red-500' : ''}
                    disabled
                  />
                  {(formErrors.cpf || errors.cpf) && (
                    <p className="text-sm text-red-500">{formErrors.cpf || errors.cpf}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@aracati.ce.gov.br"
                    className={formErrors.email || errors.email ? 'border-red-500' : ''}
                  />
                  {(formErrors.email || errors.email) && (
                    <p className="text-sm text-red-500">{formErrors.email || errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={data.status}
                    onValueChange={(value: 'ativo' | 'inativo') => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onBack} className="w-full md:w-auto">
                  Cancelar
                </Button>
                <Button type="submit" disabled={processing} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Salvar Alterações' : 'Salvar Servidor'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>

  );
};

export default CadastroServidores;