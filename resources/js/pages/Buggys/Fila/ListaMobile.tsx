import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  Play, 
  Plus, 
  Users, 
  UserCheck, 
  Timer, 
  ChevronUp, 
  ChevronDown, 
  FastForward, 
  Rewind,
  MoreVertical
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface BugueiroFila {
  id: string;
  nome: string;
  posicao: number;
  horaEntrada: string;
  status: 'na-fila' | 'em-passeio' | 'finalizado';
  adiantamentos: number;
  atrasos: number;
}

interface BugueiroDisponivel {
  id: string;
  nome: string;
  telefone: string;
  status: 'ativo' | 'inativo';
}

const mockBugueirosDisponiveis: BugueiroDisponivel[] = [
  { id: '1', nome: 'João Silva', telefone: '(84) 99999-1234', status: 'ativo' },
  { id: '2', nome: 'Maria Santos', telefone: '(84) 98888-5678', status: 'ativo' },
  { id: '3', nome: 'Pedro Costa', telefone: '(84) 97777-9012', status: 'ativo' },
  { id: '4', nome: 'Ana Lima', telefone: '(84) 96666-3456', status: 'ativo' },
  { id: '5', nome: 'Carlos Souza', telefone: '(84) 95555-7890', status: 'ativo' }
];

const mockFilaInicial: BugueiroFila[] = [
  {
    id: '1',
    nome: 'João Silva',
    posicao: 1,
    horaEntrada: '08:30',
    status: 'na-fila',
    adiantamentos: 2,
    atrasos: 1
  },
  {
    id: '2',
    nome: 'Maria Santos',
    posicao: 2,
    horaEntrada: '09:15',
    status: 'na-fila',
    adiantamentos: 0,
    atrasos: 3
  }
];

export const FilaBugueirosMobile: React.FC = () => {
  const [fila, setFila] = useState<BugueiroFila[]>(mockFilaInicial);
  const [bugueirosDisponiveis] = useState<BugueiroDisponivel[]>(mockBugueirosDisponiveis);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bugueiroSelecionado, setBugueiroSelecionado] = useState<string>('');

  const adicionarBugueiroFila = () => {
    if (!bugueiroSelecionado) return;
    
    const bugueiro = bugueirosDisponiveis.find(b => b.id === bugueiroSelecionado);
    if (!bugueiro) return;
    
    const jaEstaNaFila = fila.some(f => f.id === bugueiro.id && f.status === 'na-fila');
    if (jaEstaNaFila) {
      alert('Este bugueiro já está na fila!');
      return;
    }
    
    const agora = new Date();
    const novoItem: BugueiroFila = {
      id: bugueiro.id,
      nome: bugueiro.nome,
      posicao: fila.filter(f => f.status === 'na-fila').length + 1,
      horaEntrada: `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`,
      status: 'na-fila',
      adiantamentos: 0,
      atrasos: 0
    };
    
    setFila(prev => [...prev, novoItem]);
    setBugueiroSelecionado('');
    setIsDialogOpen(false);
  };

  const iniciarPasseio = (id: string) => {
    setFila(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'em-passeio' } : item
    ));
    
    setTimeout(() => {
      setFila(prev => {
        const filaAtualizada = prev.map(item => ({ ...item }));
        const naFila = filaAtualizada.filter(f => f.status === 'na-fila');
        
        naFila.forEach((item, index) => {
          item.posicao = index + 1;
        });
        
        return filaAtualizada;
      });
    }, 100);
  };

  const finalizarPasseio = (id: string) => {
    setFila(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'finalizado' } : item
    ));
  };

  const iniciarPasseioAdiantado = (id: string) => {
    setFila(prev => prev.map(item => 
      item.id === id && item.adiantamentos > 0 
        ? { ...item, status: 'em-passeio', adiantamentos: item.adiantamentos - 1 }
        : item
    ));
    
    setTimeout(() => {
      setFila(prev => {
        const filaAtualizada = prev.map(item => ({ ...item }));
        const naFila = filaAtualizada.filter(f => f.status === 'na-fila');
        
        naFila.forEach((item, index) => {
          item.posicao = index + 1;
        });
        
        return filaAtualizada;
      });
    }, 100);
  };

  const iniciarPasseioAtrasado = (id: string) => {
    setFila(prev => prev.map(item => 
      item.id === id && item.atrasos > 0 
        ? { ...item, status: 'em-passeio', atrasos: item.atrasos - 1 }
        : item
    ));
    
    setTimeout(() => {
      setFila(prev => {
        const filaAtualizada = prev.map(item => ({ ...item }));
        const naFila = filaAtualizada.filter(f => f.status === 'na-fila');
        
        naFila.forEach((item, index) => {
          item.posicao = index + 1;
        });
        
        return filaAtualizada;
      });
    }, 100);
  };

  const moverParaCima = (id: string) => {
    setFila(prev => {
      const naFila = prev.filter(f => f.status === 'na-fila').map(item => ({ ...item }));
      const outrosItens = prev.filter(f => f.status !== 'na-fila');
      
      const itemIndex = naFila.findIndex(f => f.id === id);
      
      if (itemIndex > 0) {
        [naFila[itemIndex], naFila[itemIndex - 1]] = [naFila[itemIndex - 1], naFila[itemIndex]];
        
        naFila.forEach((item, index) => {
          item.posicao = index + 1;
        });
        
        return [...naFila, ...outrosItens];
      }
      
      return prev;
    });
  };

  const moverParaBaixo = (id: string) => {
    setFila(prev => {
      const naFila = prev.filter(f => f.status === 'na-fila').map(item => ({ ...item }));
      const outrosItens = prev.filter(f => f.status !== 'na-fila');
      
      const itemIndex = naFila.findIndex(f => f.id === id);
      
      if (itemIndex < naFila.length - 1) {
        [naFila[itemIndex], naFila[itemIndex + 1]] = [naFila[itemIndex + 1], naFila[itemIndex]];
        
        naFila.forEach((item, index) => {
          item.posicao = index + 1;
        });
        
        return [...naFila, ...outrosItens];
      }
      
      return prev;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'na-fila':
        return 'bg-yellow-100 text-yellow-800';
      case 'em-passeio':
        return 'bg-blue-100 text-blue-800';
      case 'finalizado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'na-fila':
        return 'Na Fila';
      case 'em-passeio':
        return 'Em Passeio';
      case 'finalizado':
        return 'Finalizado';
      default:
        return status;
    }
  };

  const filaNaFila = fila.filter(f => f.status === 'na-fila');
  const emPasseio = fila.filter(f => f.status === 'em-passeio');
  const finalizados = fila.filter(f => f.status === 'finalizado');

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* Header Mobile */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">Fila de Bugueiros</h1>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="w-full flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar à Fila</span>
        </Button>
      </div>

      {/* Cards de Estatísticas - Layout Mobile */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3">
          <div className="text-center">
            <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-bold">{filaNaFila.length}</div>
            <p className="text-xs text-muted-foreground">Na Fila</p>
          </div>
        </Card>

        <Card className="p-3">
          <div className="text-center">
            <Play className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-bold">{emPasseio.length}</div>
            <p className="text-xs text-muted-foreground">Em Passeio</p>
          </div>
        </Card>

        <Card className="p-3">
          <div className="text-center">
            <UserCheck className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-bold">{finalizados.length}</div>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </div>
        </Card>
      </div>

      {/* Lista de Bugueiros - Mobile Card Layout */}
      <div className="space-y-3">
        {fila.map((item) => (
          <Card key={`${item.id}-${item.horaEntrada}`} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {item.status === 'na-fila' && (
                  <Badge variant="outline" className="text-xs">
                    #{item.posicao}
                  </Badge>
                )}
                <Users className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{item.nome}</span>
              </div>
              <Badge className={`${getStatusColor(item.status)} text-xs`}>
                {getStatusText(item.status)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Timer className="h-3 w-3" />
                <span>{item.horaEntrada}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <FastForward className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">{item.adiantamentos}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Rewind className="h-3 w-3 text-red-600" />
                  <span className="text-sm font-medium text-red-600">{item.atrasos}</span>
                </div>
              </div>
            </div>

            {/* Ações Mobile */}
            <div className="flex items-center justify-between">
              {item.status === 'na-fila' && (
                <>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moverParaCima(item.id)}
                      disabled={item.posicao === 1}
                      className="p-2 h-8 w-8"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moverParaBaixo(item.id)}
                      disabled={item.posicao === filaNaFila.length}
                      className="p-2 h-8 w-8"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      onClick={() => iniciarPasseio(item.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-xs px-3"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Iniciar
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" className="p-2 h-8 w-8">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {item.adiantamentos > 0 && (
                          <DropdownMenuItem onClick={() => iniciarPasseioAdiantado(item.id)}>
                            <FastForward className="h-3 w-3 mr-2" />
                            Usar Adiantamento ({item.adiantamentos})
                          </DropdownMenuItem>
                        )}
                        {item.atrasos > 0 && (
                          <DropdownMenuItem onClick={() => iniciarPasseioAtrasado(item.id)}>
                            <Rewind className="h-3 w-3 mr-2" />
                            Usar Atraso ({item.atrasos})
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
              
              {item.status === 'em-passeio' && (
                <Button
                  size="sm"
                  onClick={() => finalizarPasseio(item.id)}
                  className="bg-green-600 hover:bg-green-700 text-xs px-3 ml-auto"
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Finalizar
                </Button>
              )}
            </div>
          </Card>
        ))}
        
        {fila.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Nenhum bugueiro na fila</p>
            </div>
          </Card>
        )}
      </div>

      {/* Dialog para Adicionar à Fila */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="mx-4 max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar Bugueiro</DialogTitle>
            <DialogDescription>
              Selecione um bugueiro para adicionar à fila
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select 
              value={bugueiroSelecionado} 
              onValueChange={setBugueiroSelecionado}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um bugueiro" />
              </SelectTrigger>
              <SelectContent>
                {bugueirosDisponiveis
                  .filter(b => b.status === 'ativo')
                  .filter(b => !fila.some(f => f.id === b.id && f.status === 'na-fila'))
                  .map((bugueiro) => (
                    <SelectItem key={bugueiro.id} value={bugueiro.id}>
                      {bugueiro.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={adicionarBugueiroFila} disabled={!bugueiroSelecionado} className="flex-1">
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};