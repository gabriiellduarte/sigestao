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
import { TipoPortaria } from '@/types/tipo-portaria';
import { Link } from '@inertiajs/react';

interface Portaria {
  id?: number;
  servidor: string;
  tipoPortaria: string;
  data: string;
  funcao: string;
  secretaria: string;
}

interface CadastroPortariasProps {
  portaria?: Portaria;
  tipos?: TipoPortaria[];
  onBack: () => void;
  onSave: (portaria: Portaria) => void;
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

export const CadastroPortarias: React.FC<CadastroPortariasProps> = ({portaria, tipos = [], onBack, onSave}) => {
  const [formData, setFormData] = useState<Portaria>({
    servidor: '',
    tipoPortaria: '',
    data: '',
    funcao: '',
    secretaria: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (portaria) {
      setFormData(portaria);
    }
  }, [portaria]);
  console.log(tipos);
  const handleInputChange = (field: keyof Portaria, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.servidor.trim()) {
      newErrors.servidor = 'Nome do servidor é obrigatório';
    }
    if (!formData.tipoPortaria) {
      newErrors.tipoPortaria = 'Tipo de portaria é obrigatório';
    }
    if (!formData.data) {
      newErrors.data = 'Data é obrigatória';
    }
    if (!formData.funcao.trim()) {
      newErrors.funcao = 'Função é obrigatória';
    }
    if (!formData.secretaria) {
      newErrors.secretaria = 'Secretaria é obrigatória';
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

  const isEditing = !!portaria?.id;

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
                <Label htmlFor="servidor">Nome do Servidor *</Label>
                <Input
                  id="servidor"
                  value={formData.servidor}
                  onChange={(e) => handleInputChange('servidor', e.target.value)}
                  placeholder="Digite o nome completo do servidor"
                  className={errors.servidor ? 'border-red-500' : ''}
                />
                {errors.servidor && (
                  <p className="text-sm text-red-500">{errors.servidor}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoPortaria">Tipo de Portaria *</Label>
                <Select
                  value={formData.tipoPortaria}
                  onValueChange={(value) => handleInputChange('tipoPortaria', value)}
                >
                  <SelectTrigger className={errors.tipoPortaria ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map((tipo) => (
                      <SelectItem key={tipo.doc_tiposportaria_id} value={tipo.doc_tiposportaria_nome}>
                        {tipo.doc_tiposportaria_nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipoPortaria && (
                  <p className="text-sm text-red-500">{errors.tipoPortaria}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  className={errors.data ? 'border-red-500' : ''}
                />
                {errors.data && (
                  <p className="text-sm text-red-500">{errors.data}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="funcao">Função *</Label>
                <Input
                  id="funcao"
                  value={formData.funcao}
                  onChange={(e) => handleInputChange('funcao', e.target.value)}
                  placeholder="Digite a função/cargo"
                  className={errors.funcao ? 'border-red-500' : ''}
                />
                {errors.funcao && (
                  <p className="text-sm text-red-500">{errors.funcao}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
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
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onBack} className="w-full md:w-auto">
                Cancelar
              </Button>
              <Button type="submit" className="w-full md:w-auto">
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