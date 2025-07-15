import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash2, User, Phone, Mail, Star, MapPin } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Bugueiro {
  bugueiro_id: number;
  bugueiro_nome: string;
  bugueiro_nascimento: string;
  bugueiro_cpf: string;
  bugueiro_email?: string;
  bugueiro_cor?: string;
  bugueiro_contato?: string;
  bugueiro_placa_buggy: string;
  bugueiro_status: 'disponivel' | 'em_passeio' | 'adiantado' | 'atrasado';
  bugueiro_posicao_oficial: number;
  bugueiro_posicao_atual?: number;
  bugueiro_fila_atrasos: number;
  bugueiro_fila_adiantamentos: number;
  created_at?: string;
  updated_at?: string;
}

interface Props extends PageProps {
  bugueiros: Bugueiro[];
}

export const BugueirosCrud: React.FC<Props> = ({ bugueiros: bugueirosFromServer }) => {
  const [bugueiros, setBugueiros] = useState<Bugueiro[]>(bugueirosFromServer);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBugueiro, setEditingBugueiro] = useState<Bugueiro | null>(null);
  const [formData, setFormData] = useState<Partial<Bugueiro>>({});

  const filteredBugueiros = bugueiros.filter(bugueiro =>
    bugueiro.bugueiro_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bugueiro.bugueiro_cpf.includes(searchTerm) ||
    bugueiro.bugueiro_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBugueiro = () => {
    setEditingBugueiro(null);
    setFormData({
      bugueiro_nome: '',
      bugueiro_nascimento: '',
      bugueiro_cpf: '',
      bugueiro_email: '',
      bugueiro_cor: '',
      bugueiro_contato: '',
      bugueiro_placa_buggy: '',
      bugueiro_status: 'disponivel',
      bugueiro_posicao_oficial: 0,
      bugueiro_posicao_atual: 0,
      bugueiro_fila_atrasos: 0,
      bugueiro_fila_adiantamentos: 0,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleEditBugueiro = (bugueiro: Bugueiro) => {
    setEditingBugueiro(bugueiro);
    setFormData(bugueiro);
    setIsDialogOpen(true);
  };

  const handleSaveBugueiro = () => {
    console.info('apertou');
    if (editingBugueiro) {
      console.info('editing');
      router.put(`/bugueiros/cadastro/${editingBugueiro.bugueiro_id}`, formData, {
        onSuccess: (page) => {
          // Atualiza a lista de bugueiros com o que vier do servidor
          if (page && page.props && page.props.bugueiros) {
            setBugueiros(page.props.bugueiros as Bugueiro[]);
          }
          setIsDialogOpen(false);
        },
        onError: (errors) => {
          // Trate erros de validação se necessário
          console.log(errors);
        }
      });
    } else {
      router.post('/bugueiros/cadastro', formData, {
        onSuccess: (page) => {
          // Atualiza a lista de bugueiros com o que vier do servidor
          if (page && page.props && page.props.bugueiros) {
            setBugueiros(page.props.bugueiros as Bugueiro[]);
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

  const handleDeleteBugueiro = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este bugueiro?')) {
      setBugueiros(prev => prev.filter(b => b.bugueiro_id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'bg-green-100 text-green-800';
      case 'em_passeio':
        return 'bg-blue-100 text-blue-800';
      case 'adiantado':
        return 'bg-yellow-100 text-yellow-800';
      case 'atrasado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout>
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Bugueiros</h1>
        <Button onClick={handleAddBugueiro} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Bugueiro</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Bugueiros</CardTitle>
          <CardDescription>Gerencie os bugueiros cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Posição oficial</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBugueiros.map((bugueiro) => (
                  <TableRow key={bugueiro.bugueiro_id}>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium">{bugueiro.bugueiro_nome}</div>
                          <div className="text-sm text-gray-500">{bugueiro.bugueiro_email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{bugueiro.bugueiro_cpf}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        {bugueiro.bugueiro_contato || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Badge>
                        {bugueiro.bugueiro_posicao_oficial}
                        </Badge>
                        
                      </div>
                    </TableCell>
                    <TableCell>{/* Assuming totalPasseios is not directly available in this interface */}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBugueiro(bugueiro)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBugueiro(bugueiro.bugueiro_id)}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingBugueiro ? 'Editar Bugueiro' : 'Novo Bugueiro'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do bugueiro
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bugueiro_nome" className="text-right">Nome</Label>
              <Input
                id="bugueiro_nome"
                value={formData.bugueiro_nome || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bugueiro_nome: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bugueiro_nascimento" className="text-right">Nascimento</Label>
              <Input
                id="bugueiro_nascimento"
                type="date"
                value={formData.bugueiro_nascimento || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bugueiro_nascimento: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cpf" className="text-right">CPF</Label>
              <Input
                id="cpf"
                value={formData.bugueiro_cpf || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bugueiro_cpf: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bugueiro_email" className="text-right">Email</Label>
              <Input
                id="bugueiro_email"
                type="email"
                value={formData.bugueiro_email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bugueiro_email: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bugueiro_cor" className="text-right">Cor</Label>
              <Input
                id="bugueiro_cor"
                value={formData.bugueiro_cor || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bugueiro_cor: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bugueiro_contato" className="text-right">Contato</Label>
              <Input
                id="bugueiro_contato"
                value={formData.bugueiro_contato || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bugueiro_contato: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bugueiro_placa_buggy" className="text-right">Placa Buggy</Label>
              <Input
                id="bugueiro_placa_buggy"
                value={formData.bugueiro_placa_buggy || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bugueiro_placa_buggy: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bugueiro_status" className="text-right">Status</Label>
              <Select 
                value={formData.bugueiro_status || 'disponivel'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, bugueiro_status: value as 'disponivel' | 'em_passeio' | 'adiantado' | 'atrasado' }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="em_passeio">Em Passeio</SelectItem>
                  <SelectItem value="adiantado">Adiantado</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bugueiro_posicao_oficial" className="text-right">Posição Oficial</Label>
              <Input
                id="bugueiro_posicao_oficial"
                type="number"
                value={formData.bugueiro_posicao_oficial || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bugueiro_posicao_oficial: parseInt(e.target.value, 10) || 0 }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bugueiro_posicao_atual" className="text-right">Posição Atual</Label>
              <Input
                id="bugueiro_posicao_atual"
                type="number"
                value={formData.bugueiro_posicao_atual || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bugueiro_posicao_atual: parseInt(e.target.value, 10) || 0 }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bugueiro_fila_atrasos" className="text-right">Fila Atrasos</Label>
              <Input
                id="bugueiro_fila_atrasos"
                type="number"
                value={formData.bugueiro_fila_atrasos || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bugueiro_fila_atrasos: parseInt(e.target.value, 10) || 0 }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bugueiro_fila_adiantamentos" className="text-right">Fila Adiantamentos</Label>
              <Input
                id="bugueiro_fila_adiantamentos"
                type="number"
                value={formData.bugueiro_fila_adiantamentos || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bugueiro_fila_adiantamentos: parseInt(e.target.value, 10) || 0 }))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveBugueiro}>
              {editingBugueiro ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
    
  );
};

export default BugueirosCrud;