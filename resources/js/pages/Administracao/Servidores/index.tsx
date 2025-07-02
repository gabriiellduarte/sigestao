import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
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
import { Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Pessoa {
  ger_pessoas_id: number;
  ger_pessoas_nome: string;
  ger_pessoas_cpf: string;
  ger_pessoas_telefone1?: string;
  ger_pessoas_email?: string;
  status?: 'ativo' | 'inativo';
}

interface Servidor {
  adm_servidores_id: number;
  ger_pessoas_id: number;
  pessoa: Pessoa;
}

interface ServidoresPageProps extends PageProps {
  servidores: Servidor[];
  [key: string]: any;
}

const ListaServidores: React.FC = () => {
  const { servidores } = usePage<ServidoresPageProps>().props;
  const [searchTerm, setSearchTerm] = useState('');

  // Filtro local em todos os dados
  const filteredServidores = servidores.filter((servidor) => {
    const pessoa = servidor.pessoa;
    return (
      pessoa.ger_pessoas_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pessoa.ger_pessoas_cpf && pessoa.ger_pessoas_cpf.includes(searchTerm)) ||
      (pessoa.ger_pessoas_email && pessoa.ger_pessoas_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pessoa.ger_pessoas_telefone1 && pessoa.ger_pessoas_telefone1.includes(searchTerm))
    );
  });

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir este servidor?')) {
      router.delete(route('administracao.servidores.destroy', id));
    }
  };

  const handleEdit = (id: number) => {
    router.get(route('administracao.servidores.edit', id));
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
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Servidor
            </Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CPF, email ou telefone..."
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
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServidores.map((servidor) => (
                  <TableRow key={servidor.adm_servidores_id}>
                    <TableCell className="font-medium">{servidor.pessoa.ger_pessoas_nome}</TableCell>
                    <TableCell>{servidor.pessoa.ger_pessoas_cpf}</TableCell>
                    <TableCell>{servidor.pessoa.ger_pessoas_email || '-'}</TableCell>
                    <TableCell>{servidor.pessoa.ger_pessoas_telefone1 || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(servidor.pessoa.status)}>
                        {servidor.pessoa.status ? servidor.pessoa.status.charAt(0).toUpperCase() + servidor.pessoa.status.slice(1) : 'Não informado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(servidor.adm_servidores_id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(servidor.adm_servidores_id)}
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