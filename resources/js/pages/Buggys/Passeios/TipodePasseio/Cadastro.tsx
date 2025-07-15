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

interface TipoPasseio {
  id: string;
  nome: string;
  descricao: string;
  duracaoMinima: number;
  duracaoMaxima: number;
  precoBase: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
  categoria: 'aventura' | 'relaxante' | 'cultural' | 'esportivo';
  ativo: boolean;
  pontoPartida: string;
  observacoes?: string;
}

const mockTiposPasseios: TipoPasseio[] = [
  {
    id: '1',
    nome: 'Dunas do Rosado',
    descricao: 'Passeio pelas famosas dunas rosadas de Natal com paradas para fotos',
    duracaoMinima: 2,
    duracaoMaxima: 4,
    precoBase: 120,
    dificuldade: 'facil',
    categoria: 'aventura',
    ativo: true,
    pontoPartida: 'Praia de Ponta Negra',
    observacoes: 'Inclui parada para lanche'
  },
  {
    id: '2',
    nome: 'Trilha das Praias',
    descricao: 'Percurso por múltiplas praias da região com banhos de mar',
    duracaoMinima: 3,
    duracaoMaxima: 6,
    precoBase: 180,
    dificuldade: 'medio',
    categoria: 'relaxante',
    ativo: true,
    pontoPartida: 'Marina Badauê'
  },
  {
    id: '3',
    nome: 'Sunset Premium',
    descricao: 'Passeio especial para apreciar o pôr do sol com serviço de bordo',
    duracaoMinima: 2,
    duracaoMaxima: 3,
    precoBase: 200,
    dificuldade: 'facil',
    categoria: 'relaxante',
    ativo: true,
    pontoPartida: 'Dunas de Genipabu'
  }
];

export const TiposPasseiosCrud: React.FC = () => {
  const [tiposPasseios, setTiposPasseios] = useState<TipoPasseio[]>(mockTiposPasseios);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoPasseio | null>(null);
  const [formData, setFormData] = useState<Partial<TipoPasseio>>({});

  const filteredTipos = tiposPasseios.filter(tipo => {
    const matchesSearch = tipo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tipo.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = categoriaFilter === 'todos' || tipo.categoria === categoriaFilter;
    
    return matchesSearch && matchesCategoria;
  });

  const handleAddTipo = () => {
    setEditingTipo(null);
    setFormData({
      nome: '',
      descricao: '',
      duracaoMinima: 1,
      duracaoMaxima: 4,
      precoBase: 0,
      dificuldade: 'facil',
      categoria: 'aventura',
      ativo: true,
      pontoPartida: '',
      observacoes: ''
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
      setTiposPasseios(prev => prev.map(t => 
        t.id === editingTipo.id ? { ...t, ...formData } as TipoPasseio : t
      ));
    } else {
      const newTipo: TipoPasseio = {
        id: Date.now().toString(),
        ...formData
      } as TipoPasseio;
      setTiposPasseios(prev => [...prev, newTipo]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteTipo = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este tipo de passeio?')) {
      setTiposPasseios(prev => prev.filter(t => t.id !== id));
    }
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'facil': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'dificil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'aventura': return 'bg-orange-100 text-orange-800';
      case 'relaxante': return 'bg-blue-100 text-blue-800';
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'esportivo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDificuldadeLabel = (dificuldade: string) => {
    switch (dificuldade) {
      case 'facil': return 'Fácil';
      case 'medio': return 'Médio';
      case 'dificil': return 'Difícil';
      default: return dificuldade;
    }
  };

  const getCategoriaLabel = (categoria: string) => {
    switch (categoria) {
      case 'aventura': return 'Aventura';
      case 'relaxante': return 'Relaxante';
      case 'cultural': return 'Cultural';
      case 'esportivo': return 'Esportivo';
      default: return categoria;
    }
  };

  return (
    <div className="space-y-6">
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
                  <TableHead>Categoria</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Preço Base</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTipos.map((tipo) => (
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
                      <Badge className={getCategoriaColor(tipo.categoria)}>
                        {getCategoriaLabel(tipo.categoria)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {tipo.duracaoMinima}h - {tipo.duracaoMaxima}h
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        R$ {tipo.precoBase.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDificuldadeColor(tipo.dificuldade)}>
                        {getDificuldadeLabel(tipo.dificuldade)}
                      </Badge>
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
                <Label htmlFor="duracaoMinima">Duração Mínima (h)</Label>
                <Input
                  id="duracaoMinima"
                  type="number"
                  min="1"
                  value={formData.duracaoMinima || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, duracaoMinima: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="duracaoMaxima">Duração Máxima (h)</Label>
                <Input
                  id="duracaoMaxima"
                  type="number"
                  min="1"
                  value={formData.duracaoMaxima || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, duracaoMaxima: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="precoBase">Preço Base (R$)</Label>
                <Input
                  id="precoBase"
                  type="number"
                  step="0.01"
                  value={formData.precoBase || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, precoBase: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="dificuldade">Dificuldade</Label>
                <Select 
                  value={formData.dificuldade || 'facil'} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, dificuldade: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select 
                  value={formData.categoria || 'aventura'} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aventura">Aventura</SelectItem>
                    <SelectItem value="relaxante">Relaxante</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="esportivo">Esportivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="pontoPartida">Ponto de Partida</Label>
              <Input
                id="pontoPartida"
                value={formData.pontoPartida || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, pontoPartida: e.target.value }))}
              />
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
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={2}
              />
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
  );
};

export default TiposPasseiosCrud;