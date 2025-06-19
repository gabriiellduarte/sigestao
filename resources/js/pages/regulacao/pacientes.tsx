import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Edit, Eye, Trash2, Users } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { type User } from '@/types';
interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  numeroSus: string;
  cidade: string;
}

interface ListaPacientesProps {
  onNovoPaciente: () => void;
  onEditarPaciente: (paciente: Paciente) => void;
  onVisualizarPaciente: (paciente: Paciente) => void;
}

const mockPacientes: Paciente[] = [
  {
    id: 1,
    nome: 'Maria Silva Santos',
    cpf: '123.456.789-00',
    dataNascimento: '1985-03-15',
    telefone: '(11) 99999-9999',
    email: 'maria.silva@email.com',
    numeroSus: '123456789012345',
    cidade: 'São Paulo'
  },
  {
    id: 2,
    nome: 'João Santos Oliveira',
    cpf: '987.654.321-00',
    dataNascimento: '1978-07-22',
    telefone: '(11) 88888-8888',
    email: 'joao.santos@email.com',
    numeroSus: '987654321098765',
    cidade: 'São Paulo'
  },
  {
    id: 3,
    nome: 'Ana Costa Lima',
    cpf: '456.789.123-00',
    dataNascimento: '1992-11-08',
    telefone: '(11) 77777-7777',
    email: 'ana.costa@email.com',
    numeroSus: '456789123045678',
    cidade: 'São Paulo'
  }
];
interface usuario{
  user: User;
}

export default function ListaPacientes({...props}){
  
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes] = useState<Paciente[]>(mockPacientes);

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.cpf.includes(searchTerm) ||
    paciente.numeroSus.includes(searchTerm)
  );

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      console.log('Excluindo paciente:', id);
      // Aqui seria implementada a lógica de exclusão
    }
  };

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  };
  const { auth } = usePage<SharedData>().props;
  console.log(props);
  return (
    <AppLayout>
      <div>console.log(props)</div>
      <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600 mt-2">Gerencie o cadastro de pacientes</p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pacientes</p>
                <p className="text-2xl font-bold text-gray-900">{pacientes.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Novos Este Mês</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Atualizações Hoje</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Edit className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar por nome, CPF ou número do SUS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Número SUS</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPacientes.map((paciente) => (
                <TableRow key={paciente.id}>
                  <TableCell className="font-medium">{paciente.nome}</TableCell>
                  <TableCell>{paciente.cpf}</TableCell>
                  <TableCell>{calcularIdade(paciente.dataNascimento)} anos</TableCell>
                  <TableCell>{paciente.telefone}</TableCell>
                  <TableCell>{paciente.cidade}</TableCell>
                  <TableCell>{paciente.numeroSus}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(paciente.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPacientes.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum paciente encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou cadastre um novo paciente.</p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </AppLayout>
    
  );
};