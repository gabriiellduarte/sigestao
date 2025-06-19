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
import { Link } from '@inertiajs/react';

interface Servidor {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  secretaria: string;
  status: 'ativo' | 'inativo';
  dataAdmissao: string;
}

interface CadastroServidoresProps {
  servidor?: Servidor;
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
  onSave
}) => {
  const [formData, setFormData] = useState<Servidor>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cargo: '',
    secretaria: '',
    status: 'ativo',
    dataAdmissao: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (servidor) {
      setFormData(servidor);
    }
  }, [servidor]);

  const handleInputChange = (field: keyof Servidor, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }
    if (!formData.cargo.trim()) {
      newErrors.cargo = 'Cargo é obrigatório';
    }
    if (!formData.secretaria) {
      newErrors.secretaria = 'Secretaria é obrigatória';
    }
    if (!formData.dataAdmissao) {
      newErrors.dataAdmissao = 'Data de admissão é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
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
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Digite o nome completo"
                  className={errors.nome ? 'border-red-500' : ''}
                />
                {errors.nome && (
                  <p className="text-sm text-red-500">{errors.nome}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  className={errors.cpf ? 'border-red-500' : ''}
                />
                {errors.cpf && (
                  <p className="text-sm text-red-500">{errors.cpf}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@prefeitura.gov.br"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={errors.telefone ? 'border-red-500' : ''}
                />
                {errors.telefone && (
                  <p className="text-sm text-red-500">{errors.telefone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo *</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => handleInputChange('cargo', e.target.value)}
                  placeholder="Digite o cargo/função"
                  className={errors.cargo ? 'border-red-500' : ''}
                />
                {errors.cargo && (
                  <p className="text-sm text-red-500">{errors.cargo}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secretaria">Secretaria *</Label>
                <Select
                  value={formData.secretaria}
                  onValueChange={(value) => handleInputChange('secretaria', value)}
                >
                  <SelectTrigger className={errors.secretaria ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione a secretaria" />
                  </SelectTrigger>
                  <SelectContent>
                    {secretarias.map((secretaria) => (
                      <SelectItem key={secretaria} value={secretaria}>
                        {secretaria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.secretaria && (
                  <p className="text-sm text-red-500">{errors.secretaria}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
                <Input
                  id="dataAdmissao"
                  type="date"
                  value={formData.dataAdmissao}
                  onChange={(e) => handleInputChange('dataAdmissao', e.target.value)}
                  className={errors.dataAdmissao ? 'border-red-500' : ''}
                />
                {errors.dataAdmissao && (
                  <p className="text-sm text-red-500">{errors.dataAdmissao}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
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
              <Button type="submit" className="w-full md:w-auto">
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