import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

interface Servidor {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  secretaria: string;
  status: 'ativo' | 'inativo';
  dataAdmissao: string;
}

interface ListaServidoresProps {
  onEdit: (servidor: Servidor) => void;
  onNew: () => void;
}

const mockServidores: Servidor[] = [
  {
    id: 1,
    nome: 'João Silva Santos',
    cpf: '123.456.789-00',
    email: 'joao.silva@prefeitura.gov.br',
    telefone: '(11) 99999-1111',
    cargo: 'Diretor de Educação',
    secretaria: 'Secretaria de Educação',
    status: 'ativo',
    dataAdmissao: '2020-01-15'
  },
  {
    id: 2,
    nome: 'Maria Oliveira Costa',
    cpf: '987.654.321-00',
    email: 'maria.oliveira@prefeitura.gov.br',
    telefone: '(11) 99999-2222',
    cargo: 'Assessora Jurídica',
    secretaria: 'Secretaria de Administração',
    status: 'ativo',
    dataAdmissao: '2019-03-10'
  },
  {
    id: 3,
    nome: 'Carlos Pereira Lima',
    cpf: '456.789.123-00',
    email: 'carlos.pereira@prefeitura.gov.br',
    telefone: '(11) 99999-3333',
    cargo: 'Coordenador de Saúde',
    secretaria: 'Secretaria de Saúde',
    status: 'inativo',
    dataAdmissao: '2018-06-20'
  }
];

export const ListaServidores: React.FC<ListaServidoresProps> = ({ onEdit, onNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [servidores] = useState<Servidor[]>(mockServidores);

  const filteredServidores = servidores.filter(servidor =>
    servidor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servidor.cpf.includes(searchTerm) ||
    servidor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servidor.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servidor.secretaria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir este servidor?')) {
      console.log('Excluindo servidor:', id);
    }
  };

  return (
    <AppLayout>
    <div className="space-y-4 md:space-y-6 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Servidores</h2>
          <p className="text-sm md:text-base text-gray-600">Gerencie os servidores do município</p>
        </div>
        
        <Link href={route('administracao.servidores.create')}>
            <Button onClick={onNew} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Novo Servidor
            </Button>
        </Link>
        
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome, CPF, email, cargo ou secretaria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Nome</TableHead>
                <TableHead className="min-w-[120px]">CPF</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[120px]">Telefone</TableHead>
                <TableHead className="min-w-[150px]">Cargo</TableHead>
                <TableHead className="min-w-[180px]">Secretaria</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServidores.map((servidor) => (
                <TableRow key={servidor.id}>
                  <TableCell className="font-medium">{servidor.nome}</TableCell>
                  <TableCell>{servidor.cpf}</TableCell>
                  <TableCell>{servidor.email}</TableCell>
                  <TableCell>{servidor.telefone}</TableCell>
                  <TableCell>{servidor.cargo}</TableCell>
                  <TableCell>{servidor.secretaria}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(servidor.status)}>
                      {servidor.status.charAt(0).toUpperCase() + servidor.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(servidor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(servidor.id)}
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
        </div>
      </div>

      {filteredServidores.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum servidor encontrado.</p>
        </div>
      )}
    </div>
    </AppLayout>
    
  );
};

export default ListaServidores;