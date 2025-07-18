import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash2, Calendar, User, MapPin, Clock, DollarSign, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { usePage, router } from '@inertiajs/react';

interface Passeio {
  id: string;
  bugueiro_id: number;
  bugueiro_nome: string;
  tipoPasseio: 'normal'|'cortesia'|'parceria';
  data_hora: string;
  duracao: number;
  valor: number;
  parceiro: string;
  comissao: number;
  observacoes?: string;
  nome_passeio?: string; // Added nome_passeio to the interface
}

const mockPasseios: Passeio[] = [
  {
    id: '1',
    bugueiro_id: 1,
    bugueiro_nome: 'João Silva',
    tipoPasseio: 'normal',
    data_hora: '2024-07-15',
    duracao: 3,
    valor: 150,
    observacoes: 'Cliente ficou muito satisfeito',
    comissao:50,
    parceiro: 'James',
    nome_passeio: 'Passeio de Dunas'
  },
  {
    id: '2',
    bugueiro_id: 2,
    bugueiro_nome: 'João Silva',
    tipoPasseio: 'normal',
    data_hora: '2024-07-16',
    duracao: 4,
    valor: 200,
    comissao:25,
    parceiro:'Tranquilandia',
    nome_passeio: 'Passeio de Praia'
  }
];

export const PasseiosCrud: React.FC = () => {
  const { props } = usePage();
  const passeiosBackend = props.passeios as Passeio[] || [];
  const [passeios, setPasseios] = useState<Passeio[]>(passeiosBackend);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPasseio, setEditingPasseio] = useState<Passeio | null>(null);
  const [formData, setFormData] = useState<Partial<Passeio>>({});

  const filteredPasseios = passeios.filter(passeio => {
    const matchesSearch = passeio.bugueiro_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         passeio.tipoPasseio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos';
    
    return matchesSearch && matchesStatus;
  });

  const handleAddPasseio = () => {
    setEditingPasseio(null);
    setFormData({
      bugueiro_id: 0,
      bugueiro_nome: '',
      data_hora: '',
      duracao: 3,
      valor: 0,
      observacoes: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditPasseio = (passeio: Passeio) => {
    setEditingPasseio(passeio);
    setFormData(passeio);
    setIsDialogOpen(true);
  };

  const handleSavePasseio = () => {
    if (editingPasseio) {
      router.put(`/bugueiros/passeios/${editingPasseio.id}`, formData, {
        onSuccess: (page) => {
          if (page && page.props && page.props.passeios) {
            setPasseios(page.props.passeios as Passeio[]);
          }
          setIsDialogOpen(false);
        },
        onError: (errors) => {
          // Trate erros de validação se necessário
          console.log(errors);
        }
      });
    } else {
      router.post('/bugueiros/passeios', formData, {
        onSuccess: (page) => {
          if (page && page.props && page.props.passeios) {
            setPasseios(page.props.passeios as Passeio[]);
          }
          setIsDialogOpen(false);
        },
        onError: (errors) => {
          // Trate erros de validação se necessário
          console.log(errors);
        }
      });
    }
  };

  const handleDeletePasseio = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este passeio?')) {
      router.delete(`/bugueiros/passeios/${id}`, {
        onSuccess: (page) => {
          if (page && page.props && page.props.passeios) {
            setPasseios(page.props.passeios as Passeio[]);
          }
        },
        onError: (errors) => {
          console.log(errors);
        }
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <AppLayout>
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Passeios</h1>
        <Button onClick={handleAddPasseio} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Passeio</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Passeios</CardTitle>
          <CardDescription>Gerencie os passeios agendados e realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, bugueiro ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bugueiro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nome do Passeio</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPasseios.map((passeio) => (
                  <TableRow key={passeio.id}>
                    
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {passeio.bugueiro_nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Badge>{passeio.tipoPasseio}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {passeio.nome_passeio || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div>{new Date(passeio.data_hora).toLocaleDateString('pt-BR')} {new Date(passeio.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {passeio.duracao}h
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        R$ {typeof passeio.valor === 'number' ? passeio.valor.toFixed(2) : Number(passeio.valor || 0).toFixed(2)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPasseio(passeio)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePasseio(passeio.id)}
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
        </CardContent>
      </Card>

      {/* Dialog para Adicionar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPasseio ? 'Editar Passeio' : 'Novo Passeio'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do passeio
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bugueiro">Bugueiro</Label>
                <Select 
                  value={formData.bugueiro_nome || ''} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, bugueiro: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o bugueiro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="João Silva">João Silva</SelectItem>
                    <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                    <SelectItem value="Pedro Costa">Pedro Costa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipoPasseio">Tipo de Passeio</Label>
                <Select 
                  value={formData.tipoPasseio || ''} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tipoPasseio: value as Passeio['tipoPasseio'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Dunas</SelectItem>
                    <SelectItem value="cortesia">Praia</SelectItem>
                    <SelectItem value="parceria">Trilha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data_hora || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="duracao">Duração (h)</Label>
                <Input
                  id="duracao"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.duracao || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, duracao: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, valor: parseFloat(e.target.value) }))}
                />
              </div>
              
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSavePasseio}>
              {editingPasseio ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
    
  );
};

export default PasseiosCrud;