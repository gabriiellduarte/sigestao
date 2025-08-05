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
import AsyncCreatableSelect from 'react-select/async-creatable';
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
  ger_pessoas_id: number;
  ger_pessoas_nome?: string;
  ger_pessoas_cpf?: string | null;
}

interface CadastroServidoresProps {
  servidor?: Servidor;
  pessoas: Pessoa[];
  onBack: () => void;
  onSave: (servidor: Servidor) => void;
}

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
  const [cpfEditable, setCpfEditable] = useState(false);

  const handleInputChange = (field: keyof typeof data, value: string | number) => {
    setData(field, value);
  };
  // Adicionar estados para busca dinâmica de servidores
  const [loadingServidores, setLoadingServidores] = useState(false);
  // Função para buscar servidores como uma Promise (para react-select async)
  const buscarServidores = (termo: string) =>
    new Promise<any[]>((resolve) => {
      setLoadingServidores(true);
      fetch(`/administracao/pessoas-search?term=${encodeURIComponent(termo)}`)
        .then(response => response.json())
        .then(data => {
          setLoadingServidores(false);
          // Mapeia para o formato esperado pelo AsyncCreatableSelect
          const mapped = Array.isArray(data)
            ? data.map((item: any) => ({
                value: item.ger_pessoas_id,
                label: item.ger_pessoas_nome,
                cpf: item.ger_pessoas_cpf || '',
                ...item
              }))
            : [];
          resolve(mapped);
        })
        .catch(() => {
          setLoadingServidores(false);
          resolve([]);
        });
    });


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.ger_pessoas_id || data.ger_pessoas_id === 0) {
      newErrors.ger_pessoas_id = 'Pessoa é obrigatório';
    }
    if (!data.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
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
                  <AsyncCreatableSelect
                    cacheOptions
                    loadOptions={buscarServidores}
                    formatCreateLabel={(inputValue) => `Criar servidor: ${inputValue}`}
                    onChange={(option: any, actionMeta: any) => {
                      //console.log('Option selected:', option, actionMeta);
                      if (option && option.__isNew__ === true) {
                        // Novo servidor, habilita CPF
                        setData('ger_pessoas_id', 0);
                        setData('cpf', '');
                        setCpfEditable(true);
                      } else {
                        setData('ger_pessoas_id', option.value);
                        setData('cpf', option.cpf || '');
                        setCpfEditable(false);
                    }
                  }}
                  />
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
                    disabled={!cpfEditable ? true : false}
                    onChange={e => cpfEditable && setData('cpf', e.target.value)}
                  />
                  {(formErrors.cpf || errors.cpf) && (
                    <p className="text-sm text-red-500">{formErrors.cpf || errors.cpf}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
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