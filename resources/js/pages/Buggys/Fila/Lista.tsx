import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Play, Plus, Users, UserCheck, Timer, ChevronUp, ChevronDown, FastForward, Rewind } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface BugueiroFila {
  id:number;
  fila_id: number;
  bugueiro_id: number;
  posicao_fila: number;
  adiantamento: number;
  atraso: number;
  fez_passeio: boolean;
  hora_passeio: string;
  hora_entrada: string;
  status: 'adiantado' | 'disponivel' | 'em_passeio' | 'atrasado';
  bugueiro?: {
    bugueiro_id: number;
    bugueiro_nome: string;
    telefone: string;
    status: string;
  };
}

interface PageProps {
  bugueiros_fila: BugueiroFila[];
  fila_id: number;
  fila_status?: string;
  [key: string]: any; // Corrige o erro de tipagem do Inertia
}

export const FilaBugueiros: React.FC = () => {
  const { props } = usePage<PageProps>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bugueiroSelecionado, setBugueiroSelecionado] = useState<string>('');
  const [modalAdiantadoOpen, setModalAdiantadoOpen] = useState(false);
  const [bugueiroAdiantado, setBugueiroAdiantado] = useState<BugueiroFila | null>(null);
  const fila_id = props.fila_id;
  const bugueirosFila: BugueiroFila[] = props.bugueiros_fila ?? [];
  const statusFila = props.fila_status ?? 'aberta';

  // Adicionar bugueiro à fila
  const adicionarBugueiroFila = () => {
    if (!bugueiroSelecionado) return;
    router.post(
      `/bugueiros/fila/${fila_id}/adicionar`,
      {
        bugueiro_id: [Number(bugueiroSelecionado)],
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setBugueiroSelecionado('');
        },
        preserveScroll: true,
      }
    );
  };

  // Adicionar todos os bugueiros cadastrados à fila aberta
  const adicionarTodos = () => {
    router.post(`/bugueiros/filas/${fila_id}/adicionartodos`, {}, { preserveScroll: true });
  };

  // Atualizar status do bugueiro na fila (ex: iniciar passeio)
  const atualizarBugueiroFila = (bugueiroFilaId: number, data: Partial<BugueiroFila>) => {
    router.put(`/bugueiros/filas/${fila_id}/atualizar/${bugueiroFilaId}`, data, {
      preserveScroll: true,
    });
  };

  // Remover bugueiro da fila
  const removerBugueiro = (bugueiroFilaId: number) => {
    router.delete(`/bugueiros/filas/${fila_id}/remover/${bugueiroFilaId}`, {
      preserveScroll: true,
    });
  };

  // Funções de UI (mover, iniciar, finalizar, etc)
  const moverParaCima = (id: number) => {
    router.post(`/bugueiros/filas/${fila_id}/mover-cima/${id}`, {}, { preserveScroll: true });
  };
  const moverParaBaixo = (id: number) => {
    router.post(`/bugueiros/filas/${fila_id}/mover-baixo/${id}`, {}, { preserveScroll: true });
  };
  const iniciarPasseio = (bugueiro_id: number) => {
    const bugueiro = bugueirosFila.find(f => f.bugueiro_id === bugueiro_id);
    if (!bugueiro) return;
    const primeiro = bugueirosFila.filter(f => f.fez_passeio === false).sort((a, b) => a.posicao_fila - b.posicao_fila)[0];
    if (primeiro && bugueiro.bugueiro_id !== primeiro.bugueiro_id) {
      setBugueiroAdiantado(bugueiro);
      setModalAdiantadoOpen(true);
      return;
    }
    atualizarBugueiroFila(bugueiro_id, { status: 'em_passeio' });
  };
  const finalizarPasseio = (id: number) => {
    //atualizarBugueiroFila(id, { status: 'finalizado' });
  };
  const iniciarPasseioAdiantado = (id: number) => {
    atualizarBugueiroFila(id, { status: 'em_passeio', adiantamento: (bugueirosFila.find(f => f.bugueiro_id === id)?.adiantamento || 1) - 1 });
  };
  const iniciarPasseioAtrasado = (id: number) => {
    atualizarBugueiroFila(id, { status: 'em_passeio', atraso: (bugueirosFila.find(f => f.bugueiro_id === id)?.atraso || 1) - 1 });
  };

  const confirmarAdiantamento = () => {
    if (bugueiroAdiantado) {
      atualizarBugueiroFila(bugueiroAdiantado.bugueiro_id, {
        fez_passeio: true,
        adiantamento: bugueiroAdiantado.adiantamento + 1
      });
      setModalAdiantadoOpen(false);
      setBugueiroAdiantado(null);
    }
  };

  const cancelarAdiantamento = () => {
    setModalAdiantadoOpen(false);
    setBugueiroAdiantado(null);
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

  const filaNaFila = bugueirosFila.filter(f => f.fez_passeio === false);
  const emPasseio = bugueirosFila.filter(f => f.fez_passeio === true);
  const adiantados = bugueirosFila.filter(f => f.adiantamento === 1); 
  const atraso = bugueirosFila.filter(f => f.atraso === 1); 

  const getStatusFilaColor = (status: string) => {
    switch (status) {
      case 'aberta':
        return 'bg-green-100 text-green-800';
      case 'finalizada':
        return 'bg-gray-200 text-gray-700';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Fila - Bugueiros</h1>
          <div className="flex gap-2">
            <Button onClick={adicionarTodos} className="flex items-center space-x-2" variant="secondary">
              <Plus className="h-4 w-4" />
              <span>Adicionar Todos</span>
            </Button>
            <Button onClick={() => setIsDialogOpen(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Adicionar à Fila</span>
            </Button>
          </div>
        </div>
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Na Fila</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filaNaFila.length}</div>
              <p className="text-xs text-muted-foreground">Aguardando passeio</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Realizados</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{emPasseio.length}</div>
              <p className="text-xs text-muted-foreground">Fizeram passeio</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Adiantados</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adiantados.length}</div>
              <p className="text-xs text-muted-foreground">Bugueiros com passeio adiantado nessa fila</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{atraso.length}</div>
              <p className="text-xs text-muted-foreground">Bugueiros com passeio atrasado nessa fila</p>
            </CardContent>
          </Card>
        </div>
        {/* Fila Atual */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Fila Atual #{fila_id}</CardTitle>
              <Badge className={getStatusFilaColor(statusFila)}>{statusFila.charAt(0).toUpperCase() + statusFila.slice(1)}</Badge>
            </div>
            <CardDescription>Controle da fila de bugueiros para passeios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posição</TableHead>
                    <TableHead>Bugueiro</TableHead>
                    <TableHead>Hora Entrada</TableHead>
                    <TableHead>Créditos/Débitos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bugueirosFila.filter(item => item.fez_passeio === false).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center">
                          
                          <Badge variant="outline" className="mr-2">
                            #{item.posicao_fila}
                          </Badge>
                          
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          {item.bugueiro?.bugueiro_nome ?? 'Sem nome'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Timer className="h-4 w-4 mr-1 text-gray-400" />
                          {item.hora_entrada}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <FastForward className="h-3 w-3 text-green-600" />
                            <span className="text-sm font-medium text-green-600">{item.adiantamento}</span>
                          </div>
                          <span className="text-gray-400">|</span>
                          <div className="flex items-center space-x-1">
                            <Rewind className="h-3 w-3 text-red-600" />
                            <span className="text-sm font-medium text-red-600">{item.atraso}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {item.fez_passeio === false && (
                            <>
                              <div className="flex flex-col space-y-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => moverParaCima(item.id)}
                                  disabled={item.posicao_fila === 1}
                                  className="p-1 h-6 w-6"
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => moverParaBaixo(item.id)}
                                  disabled={item.posicao_fila === filaNaFila.length}
                                  className="p-1 h-6 w-6"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={() => iniciarPasseio(item.bugueiro_id)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Iniciar
                                </Button>
                                {item.adiantamento > 0 && (
                                  <Button
                                    size="sm"
                                    onClick={() => iniciarPasseioAdiantado(item.bugueiro_id)}
                                    className="bg-green-600 hover:bg-green-700"
                                    title={`Usar adiantamento (${item.adiantamento} disponível)`}
                                  >
                                    <FastForward className="h-4 w-4" />
                                  </Button>
                                )}
                                {item.atraso > 0 && (
                                  <Button
                                    size="sm"
                                    onClick={() => iniciarPasseioAtrasado(item.bugueiro_id)}
                                    className="bg-orange-600 hover:bg-orange-700"
                                    title={`Usar atraso (${item.atraso} disponível)`}
                                  >
                                    <Rewind className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </>
                          )}
                          {item.status === 'em_passeio' && (
                            <Button
                              size="sm"
                              onClick={() => finalizarPasseio(item.bugueiro_id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Finalizar
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removerBugueiro(item.bugueiro_id)}
                          >
                            Remover
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bugueirosFila.filter(item => item.fez_passeio === false).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhum bugueiro na fila
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* Fila Atual */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Bugueiros que já fizeram passeio</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Era da posição</TableHead>
                    <TableHead>Bugueiro</TableHead>
                    <TableHead>Hora do passeio</TableHead>
                    <TableHead>Créditos/Débitos</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bugueirosFila.filter(item => item.fez_passeio === true).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center">
                          
                          <Badge variant="outline" className="mr-2">
                            #{item.posicao_fila}
                          </Badge>
                          
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          {item.bugueiro?.bugueiro_nome ?? 'Sem nome'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Timer className="h-4 w-4 mr-1 text-gray-400" />
                          {item.hora_passeio}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <FastForward className="h-3 w-3 text-green-600" />
                            <span className="text-sm font-medium text-green-600">{item.adiantamento}</span>
                          </div>
                          <span className="text-gray-400">|</span>
                          <div className="flex items-center space-x-1">
                            <Rewind className="h-3 w-3 text-red-600" />
                            <span className="text-sm font-medium text-red-600">{item.atraso}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removerBugueiro(item.bugueiro_id)}
                          >
                            Retornar para fila
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bugueirosFila.filter(item => item.fez_passeio === true).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhum bugueiro que já fez passeio
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* Dialog para Adicionar à Fila */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Bugueiro à Fila</DialogTitle>
              <DialogDescription>
                Selecione um bugueiro para adicionar à fila de espera
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="bugueiro" className="text-sm font-medium">
                  Bugueiro
                </label>
                <Select 
                  value={bugueiroSelecionado} 
                  onValueChange={setBugueiroSelecionado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um bugueiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Remover o Select de bugueiros disponíveis do Dialog de adicionar à fila */}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={adicionarBugueiroFila}
                disabled={!bugueiroSelecionado}
              >
                Adicionar à Fila
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Modal de confirmação de adiantamento */}
        <Dialog open={modalAdiantadoOpen} onOpenChange={setModalAdiantadoOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Passeio Adiantado</DialogTitle>
              <DialogDescription>
                Este bugueiro não é o primeiro da fila. Confirma iniciar passeio adiantado? Será descontado 1 crédito na fila e no cadastro do bugueiro.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={cancelarAdiantamento}>Cancelar</Button>
              <Button onClick={confirmarAdiantamento}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default FilaBugueiros;