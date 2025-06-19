import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Building, Stethoscope, AlertTriangle, Save, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function NovoAtendimentoForm(){
  const [formData, setFormData] = useState({
    paciente: '',
    dataSolicitacao: '',
    unidadeSolicitante: '',
    grupoProcedimentos: '',
    procedimento: '',
    medicoSolicitante: '',
    prioridade: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do atendimento:', formData);
    // Aqui você enviaria os dados para o backend
  };

  // Mock data - em produção viria do banco de dados
  const pacientes = [
    { id: '1', nome: 'João Silva Santos', cpf: '123.456.789-00' },
    { id: '2', nome: 'Maria Oliveira Costa', cpf: '234.567.890-11' },
    { id: '3', nome: 'Pedro Ferreira Lima', cpf: '345.678.901-22' }
  ];

  const unidades = [
    'UBS Central',
    'UBS Norte',
    'UBS Sul',
    'Hospital Municipal',
    'Pronto Socorro'
  ];

  const gruposProcedimentos = [
    'Consultas Médicas',
    'Exames Laboratoriais',
    'Exames de Imagem',
    'Procedimentos Cirúrgicos',
    'Fisioterapia'
  ];

  const procedimentos = [
    'Consulta Clínica Geral',
    'Consulta Cardiológica',
    'Hemograma Completo',
    'Raio-X Tórax',
    'Ultrassom Abdominal',
    'Cirurgia Geral'
  ];

  const medicos = [
    'Dr. Carlos Medicina',
    'Dra. Ana Cardoso',
    'Dr. Roberto Silva',
    'Dra. Patricia Lima',
    'Dr. José Santos'
  ];

  return (
    <AppLayout>

      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Paciente */}
                <div className="space-y-2">
                  <Label htmlFor="paciente">Paciente *</Label>
                  <Select onValueChange={(value) => handleInputChange('paciente', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {pacientes.map((paciente) => (
                        <SelectItem key={paciente.id} value={paciente.id}>
                          {paciente.nome} - {paciente.cpf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data de Solicitação */}
                <div className="space-y-2">
                  <Label htmlFor="dataSolicitacao">Data de Solicitação *</Label>
                  <div className="relative">
                    <Input
                      id="dataSolicitacao"
                      type="date"
                      value={formData.dataSolicitacao}
                      onChange={(e) => handleInputChange('dataSolicitacao', e.target.value)}
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Unidade Solicitante */}
                <div className="space-y-2">
                  <Label htmlFor="unidadeSolicitante">Unidade Solicitante *</Label>
                  <Select onValueChange={(value) => handleInputChange('unidadeSolicitante', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map((unidade) => (
                        <SelectItem key={unidade} value={unidade}>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            {unidade}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Grupo de Procedimentos */}
                <div className="space-y-2">
                  <Label htmlFor="grupoProcedimentos">Grupo de Procedimentos *</Label>
                  <Select onValueChange={(value) => handleInputChange('grupoProcedimentos', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {gruposProcedimentos.map((grupo) => (
                        <SelectItem key={grupo} value={grupo}>
                          {grupo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Procedimento */}
                <div className="space-y-2">
                  <Label htmlFor="procedimento">Procedimento *</Label>
                  <Select onValueChange={(value) => handleInputChange('procedimento', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o procedimento" />
                    </SelectTrigger>
                    <SelectContent>
                      {procedimentos.map((proc) => (
                        <SelectItem key={proc} value={proc}>
                          <div className="flex items-center">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            {proc}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Médico Solicitante */}
                <div className="space-y-2">
                  <Label htmlFor="medicoSolicitante">Médico Solicitante *</Label>
                  <Select onValueChange={(value) => handleInputChange('medicoSolicitante', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicos.map((medico) => (
                        <SelectItem key={medico} value={medico}>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {medico}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prioridade */}
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade *</Label>
                  <Select onValueChange={(value) => handleInputChange('prioridade', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          Normal
                        </div>
                      </SelectItem>
                      <SelectItem value="urgente">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                          Urgente
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Atendimento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>

  );
};