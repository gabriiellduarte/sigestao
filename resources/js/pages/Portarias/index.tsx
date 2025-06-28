import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ChevronDown, FileText, Building, ExternalLink, PersonStanding, Users, Gauge } from 'lucide-react';
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
import { Link, router, usePage } from '@inertiajs/react';

interface Portaria {
  doc_portarias_id: number;
  doc_portarias_numero: string;
  doc_portarias_servidor_nome: string;
  doc_portarias_servidor_cpf: string;
  adm_servidores_id: number;
  adm_cargos_id: number;
  adm_secretarias_id: number;
  doc_tiposportaria_id: number;
  doc_portarias_data: string;
  doc_portarias_descricao?: string;
  doc_portarias_link_documento?: string;
  doc_portarias_status: string;
  doc_portarias_publicadoem?: string | null;
  servidor?: any;
  cargo?: any;
  secretaria?: any;
  tipoPortaria?: any;
  user?: any;
}

interface PortariasPageProps {
  portarias: {
    data: Portaria[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

const ListaPortarias: React.FC = () => {
  const { portarias } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPortarias = portarias.data.filter((portaria) => {
    return (
      portaria.doc_portarias_servidor_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (portaria.tipoPortaria && portaria.tipoPortaria.doc_tiposportaria_nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (portaria.cargo && portaria.cargo.adm_argos_nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (portaria.secretaria && portaria.secretaria.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getStatusColor = (portaria: Portaria) => {
    if (portaria.doc_portarias_status == 'cancelado'){
      return 'bg-red-100 text-red-800';
    }else if(portaria.doc_portarias_status == 'publicado'){
      return 'bg-green-100 text-green-800';
    }else{
      return 'bg-yellow-100 text-yellow-800';
    }
    
  };

  const getStatusLabel = (portaria: Portaria) => {
    if (portaria.doc_portarias_status == 'cancelado'){
      return 'Cancelada';
    }else if(portaria.doc_portarias_status == 'publicado'){
      return 'Publicada';
    }else{
      return 'Pendente';
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir esta portaria?')) {
      router.delete(route('documentos.portarias.destroy', id));
    }
  };

  const handleEdit = (id: number) => {
    router.get(route('documentos.portarias.edit', id));
  };

  const handlePageChange = (url: string) => {
    router.visit(url);
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
            <Link href={route('documentos.portarias.dashboard')}>
              <Button className="w-full md:w-auto">
                <Gauge className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
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
                <DropdownMenuItem asChild>
                  <Link href={route('administracao.servidores.index')} className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Servidores
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
                  <TableHead className="min-w-[120px]">Número</TableHead>
                  <TableHead className="min-w-[200px]">Servidor</TableHead>
                  <TableHead className="min-w-[120px]">CPF</TableHead>
                  <TableHead className="min-w-[120px]">Tipo</TableHead>
                  <TableHead className="min-w-[100px]">Data</TableHead>
                  <TableHead className="min-w-[150px]">Cargo</TableHead>
                  <TableHead className="min-w-[180px]">Secretaria</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPortarias.map((portaria) => (
                  <TableRow key={portaria.doc_portarias_id}>
                    <TableCell>{portaria.doc_portarias_numero}</TableCell>
                    <TableCell className="font-medium">{portaria.doc_portarias_servidor_nome}</TableCell>
                    <TableCell>{portaria.doc_portarias_servidor_cpf}</TableCell>
                    <TableCell>{portaria.tipo_portaria ? portaria.tipo_portaria.doc_tiposportaria_nome : '-'}</TableCell>
                    <TableCell>{new Date(portaria.doc_portarias_data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{portaria.cargo ? portaria.cargo.adm_cargos_nome : '-'}</TableCell>
                    <TableCell>{portaria.secretaria ? portaria.secretaria.adm_secretarias_nome : '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(portaria)}>
                        {getStatusLabel(portaria)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {portaria.doc_portarias_link_documento && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(portaria.doc_portarias_link_documento, '_blank')}
                            title="Visualizar documento"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(portaria.doc_portarias_id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(portaria.doc_portarias_id)}
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
        {/* Paginação */}
        <div className="flex justify-center mt-4">
          <nav className="inline-flex -space-x-px">
            {portarias.prev_page_url && (
              <Button variant="outline" size="sm" onClick={() => handlePageChange(portarias.prev_page_url!)}>
                Anterior
              </Button>
            )}
            <span className="px-3 py-2 text-gray-700">Página {portarias.current_page} de {portarias.last_page}</span>
            {portarias.next_page_url && (
              <Button variant="outline" size="sm" onClick={() => handlePageChange(portarias.next_page_url!)}>
                Próxima
              </Button>
            )}
          </nav>
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