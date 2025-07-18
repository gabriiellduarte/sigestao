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
import { Search, Plus, Edit, Trash2, MapPin, Clock, DollarSign, Star } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { TipoPasseio } from '@/types';



export const TiposPasseiosCrud: React.FC = () => {
  const { props } = usePage();
  const tiposPasseiosBackend = props.tiposPasseios as TipoPasseio[] || [];
  const [tiposPasseios, setTiposPasseios] = useState<TipoPasseio[]>(tiposPasseiosBackend);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoPasseio | null>(null);
  const [formData, setFormData] = useState<Partial<TipoPasseio>>({});

  const handleAddTipo = () => {
    setEditingTipo(null);
    setFormData({
      nome: '',
      descricao: '',
      duracao: 1,
      preco: 0,
      ativo: true
    });
    setIsDialogOpen(true);
  };

  const handleEditTipo = (tipo: TipoPasseio) => {
    setEditingTipo(tipo);
    setFormData(tipo);
    setIsDialogOpen(true);
  };

  const handleSaveTipo = () => {
    if (editingTipo) {
      router.put(`/bugueiros/tipodepasseio/${editingTipo.id}`, formData, {
        onSuccess: (page) => {
          if (page && page.props && page.props.tiposPasseios) {
            setTiposPasseios(page.props.tiposPasseios as TipoPasseio[]);
          }
          setIsDialogOpen(false);
        },
        onError: (errors) => {
          // Trate erros de validação se necessário
          console.log(errors);
        }
      });
    } else {
      router.post('/bugueiros/tipodepasseio', formData, {
        onSuccess: (page) => {
          if (page && page.props && page.props.tiposPasseios) {
            setTiposPasseios(page.props.tiposPasseios as TipoPasseio[]);
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

  const handleDeleteTipo = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este tipo de passeio?')) {
      router.delete(`/bugueiros/tipodepasseio/${id}`, {
        onSuccess: (page) => {
          if (page && page.props && page.props.tiposPasseios) {
            setTiposPasseios(page.props.tiposPasseios as TipoPasseio[]);
          }
        },
        onError: (errors) => {
          console.log(errors);
        }
      });
    }
  };

  return (
    <AppLayout>
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tipos de Passeios</h1>
        <Button onClick={handleAddTipo} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Tipo</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Passeios</CardTitle>
          <CardDescription>Gerencie os tipos de passeios disponíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Categorias</SelectItem>
                <SelectItem value="aventura">Aventura</SelectItem>
                <SelectItem value="relaxante">Relaxante</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="esportivo">Esportivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiposPasseios.map((tipo) => (
                  <TableRow key={tipo.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tipo.nome}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {tipo.descricao}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {tipo.duracao}h
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        {typeof tipo.preco === 'number' && !isNaN(tipo.preco)
                          ? `R$ ${tipo.preco.toFixed(2)}`
                          : tipo.preco
                            ? `R$ ${Number(tipo.preco).toFixed(2)}`
                            : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={tipo.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {tipo.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTipo(tipo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTipo(tipo.id)}
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingTipo ? 'Editar Tipo de Passeio' : 'Novo Tipo de Passeio'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do tipo de passeio
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="nome">Nome do Passeio</Label>
              <Input
                id="nome"
                value={formData.nome || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duracao">Duração (h)</Label>
                <Input
                  id="duracao"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.duracao || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, duracao: parseFloat(e.target.value) }))}
                  placeholder="Ex: 2.5 para 2h30min"
                />
              </div>
              <div>
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, preco: parseFloat(e.target.value) }))}
                />
              </div>  
            </div>
          
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo || false}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="ativo">Tipo de passeio ativo</Label>
            </div>
            
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveTipo}>
              {editingTipo ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
    
  );
};

export default TiposPasseiosCrud;