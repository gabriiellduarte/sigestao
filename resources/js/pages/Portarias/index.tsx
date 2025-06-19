import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ChevronDown, FileText, Building } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

interface Portaria {
  id: number;
  servidor: string;
  tipoPortaria: string;
  data: string;
  funcao: string;
  secretaria: string;
  status: 'ativa' | 'inativa' | 'pendente';
}

interface ListaPortariasProps {
  onEdit: (portaria: Portaria) => void;
  onNew: () => void;
}

const mockPortarias: Portaria[] = [
  {
    id: 1,
    servidor: 'João Silva Santos',
    tipoPortaria: 'Nomeação',
    data: '2024-01-15',
    funcao: 'Diretor de Educação',
    secretaria: 'Secretaria de Educação',
    status: 'ativa'
  },
  {
    id: 2,
    servidor: 'Maria Oliveira Costa',
    tipoPortaria: 'Exoneração',
    data: '2024-01-10',
    funcao: 'Assessora Jurídica',
    secretaria: 'Secretaria de Administração',
    status: 'ativa'
  },
  {
    id: 3,
    servidor: 'Carlos Pereira Lima',
    tipoPortaria: 'Designação',
    data: '2024-01-08',
    funcao: 'Coordenador de Saúde',
    secretaria: 'Secretaria de Saúde',
    status: 'pendente'
  }
];

export const ListaPortarias: React.FC<ListaPortariasProps> = ({ onEdit, onNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [portarias] = useState<Portaria[]>(mockPortarias);

  const filteredPortarias = portarias.filter(portaria =>
    portaria.servidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portaria.tipoPortaria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portaria.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portaria.secretaria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800';
      case 'inativa': return 'bg-red-100 text-red-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir esta portaria?')) {
      console.log('Excluindo portaria:', id);
    }
  };

  return (
    <AppLayout>
        <div className="space-y-4 md:space-y-6 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Portarias</h2>
            <p className="text-sm md:text-base text-gray-600">Gerencie as portarias do município</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Outros
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                            <Link href={route('documentos.tiposdeportaria.index')} className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Tipos de Portaria
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('administracao.secretarias.index')} className="flex items-center">
                                <Building className="h-4 w-4 mr-2" />
                                Secretarias
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Link href={route('documentos.portarias.create')}>
                    <Button className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Portaria
                    </Button>
                </Link>
                
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
                placeholder="Buscar por servidor, tipo, função ou secretaria..."
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
                    <TableHead className="min-w-[200px]">Servidor</TableHead>
                    <TableHead className="min-w-[120px]">Tipo</TableHead>
                    <TableHead className="min-w-[100px]">Data</TableHead>
                    <TableHead className="min-w-[150px]">Função</TableHead>
                    <TableHead className="min-w-[180px]">Secretaria</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="w-[120px]">Ações</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredPortarias.map((portaria) => (
                    <TableRow key={portaria.id}>
                    <TableCell className="font-medium">{portaria.servidor}</TableCell>
                    <TableCell>{portaria.tipoPortaria}</TableCell>
                    <TableCell>{new Date(portaria.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{portaria.funcao}</TableCell>
                    <TableCell>{portaria.secretaria}</TableCell>
                    <TableCell>
                        <Badge className={getStatusColor(portaria.status)}>
                        {portaria.status.charAt(0).toUpperCase() + portaria.status.slice(1)}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex space-x-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log('Visualizar:', portaria.id)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(portaria)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(portaria.id)}
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

        {filteredPortarias.length === 0 && (
            <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma portaria encontrada.</p>
            </div>
        )}
        </div>
    </AppLayout>
  );
};

export default ListaPortarias;