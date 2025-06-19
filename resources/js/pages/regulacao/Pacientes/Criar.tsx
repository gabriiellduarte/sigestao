import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Paciente {
  id?: number;
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  sexo: string;
  telefone: string;
  email: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  cep: string;
  numeroSus: string;
  nomeMae: string;
  estadoCivil: string;
}

interface CadastroPacienteProps {
  paciente?: Paciente;
  onSave: (paciente: Paciente) => void;
  onCancel: () => void;
}

export const CadastroPaciente: React.FC<CadastroPacienteProps> = ({ 
  paciente, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Paciente>({
    nome: paciente?.nome || '',
    cpf: paciente?.cpf || '',
    rg: paciente?.rg || '',
    dataNascimento: paciente?.dataNascimento || '',
    sexo: paciente?.sexo || '',
    telefone: paciente?.telefone || '',
    email: paciente?.email || '',
    endereco: paciente?.endereco || '',
    numero: paciente?.numero || '',
    complemento: paciente?.complemento || '',
    bairro: paciente?.bairro || '',
    cidade: paciente?.cidade || '',
    cep: paciente?.cep || '',
    numeroSus: paciente?.numeroSus || '',
    nomeMae: paciente?.nomeMae || '',
    estadoCivil: paciente?.estadoCivil || '',
    ...paciente
  });

  const handleChange = (field: keyof Paciente, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AppLayout>
        <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                    {paciente ? 'Editar Paciente' : 'Novo Paciente'}
                    </h1>
                    <p className="text-gray-600">
                    {paciente ? 'Edite as informações do paciente' : 'Cadastre um novo paciente no sistema'}
                    </p>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    required
                    />
                </div>
                <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    required
                    />
                </div>
                <div>
                    <Label htmlFor="rg">RG</Label>
                    <Input
                    id="rg"
                    value={formData.rg}
                    onChange={(e) => handleChange('rg', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                    <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleChange('dataNascimento', e.target.value)}
                    required
                    />
                </div>
                <div>
                    <Label htmlFor="sexo">Sexo *</Label>
                    <Select value={formData.sexo} onValueChange={(value) => handleChange('sexo', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="estadoCivil">Estado Civil</Label>
                    <Select value={formData.estadoCivil} onValueChange={(value) => handleChange('estadoCivil', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado civil" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                        <SelectItem value="uniao_estavel">União Estável</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="nomeMae">Nome da Mãe</Label>
                    <Input
                    id="nomeMae"
                    value={formData.nomeMae}
                    onChange={(e) => handleChange('nomeMae', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="numeroSus">Número do SUS</Label>
                    <Input
                    id="numeroSus"
                    value={formData.numeroSus}
                    onChange={(e) => handleChange('numeroSus', e.target.value)}
                    />
                </div>
                </div>
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    />
                </div>
                </div>
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleChange('endereco', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="numero">Número</Label>
                    <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => handleChange('numero', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                    id="complemento"
                    value={formData.complemento}
                    onChange={(e) => handleChange('complemento', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => handleChange('bairro', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleChange('cidade', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => handleChange('cep', e.target.value)}
                    placeholder="00000-000"
                    />
                </div>
                </div>
            </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Salvar Paciente
            </Button>
            </div>
        </form>
        </div>
    </AppLayout>
    
  );
};

export default CadastroPaciente;