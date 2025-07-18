import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Play, Plus, Users, UserCheck, Timer, ChevronUp, ChevronDown, FastForward, Rewind, MoreVertical, ArrowDownAZ } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TipoPasseio, Parceiro } from '@/types';

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
  tipo_passeio_id?: string;
  bugueiro: {
    bugueiro_id: number;
    bugueiro_nome: string;
    bugueiro_posicao_oficial: number;
    bugueiro_fila_atrasos: number;
    bugueiro_fila_adiantamentos: number;
    telefone: string;
    status: string;
  };
}

interface PageProps {
  bugueiros_fila: BugueiroFila[];
  passeios_tipo: TipoPasseio[];
  fila_id: number;
  fila_status?: string;
  parceiros: Parceiro[];
  [key: string]: any; // Corrige o erro de tipagem do Inertia
}

export const FilaBugueiros: React.FC = () => {
  const { props } = usePage<PageProps>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bugueiroSelecionado, setBugueiroSelecionado] = useState<string>('');
  const [isPasseioDialogOpen, setIsPasseioDialogOpen] = useState(false);
  const [bugueiroParaPasseio, setBugueiroParaPasseio] = useState<number>(0);
  const [idPasseio, setIdPasseio] = useState<string>('0');
  const [tipoPasseio, setTipoPasseio] = useState<string>('');
  const [modalAdiantadoOpen, setModalAdiantadoOpen] = useState(false);
  const [bugueiroAdiantado, setBugueiroAdiantado] = useState<BugueiroFila | null>(null);
  const fila_id = props.fila_id;
  const bugueirosFila: BugueiroFila[] = props.bugueiros_fila ?? [];
  const tiposPasseio: TipoPasseio[] = props.passeios_tipo ?? [];
  const statusFila = props.fila_status ?? 'aberta';
  const parceiros: Parceiro[] = props.parceiros ?? [];
  const [parceiroSelecionado, setParceiroSelecionado] = useState<string>('');
  const [modalReordenar, setModalReordenar] = useState(false);

  const abrirDialogPasseio = (id: number) => {
    setBugueiroParaPasseio(id);
    setTipoPasseio('normal');
    setIsPasseioDialogOpen(true);
  };
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
  const atualizarBugueiroFila = (bugueiroParaPasseio: number, data: any) => {
    router.put(`/bugueiros/filas/${fila_id}/atualizar/${bugueiroParaPasseio}`, data, {
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
  const iniciarPasseio = () => {
    const bugueiro = bugueirosFila.find(f => f.id === bugueiroParaPasseio);
    console.log('bugueiro',bugueiro);
    if (!bugueiro) return;
    const primeiro = bugueirosFila.filter(f => f.fez_passeio === false).sort((a, b) => a.posicao_fila - b.posicao_fila)[0];
    console.log('primeiro',primeiro);
    if (primeiro && bugueiro.id !== primeiro.id) {
      //setBugueiroAdiantado(bugueiro);
      setModalAdiantadoOpen(true);
      return;
    }
    enviaAtualizacaodeFila();
  };
  const finalizarPasseio = (id: number) => {
    //atualizarBugueiroFila(id, { status: 'finalizado' });
  };
  const enviaAtualizacaodeFila = () => {
    atualizarBugueiroFila(bugueiroParaPasseio, { fez_passeio: true, tipo_passeio_id: idPasseio, tipoPasseio: tipoPasseio, parceiro: parceiroSelecionado });
    setIsPasseioDialogOpen(false);
    setBugueiroParaPasseio(0);
    setTipoPasseio('');
    setParceiroSelecionado('');
  }
  const iniciarPasseioAdiantado = () => {
    enviaAtualizacaodeFila();
    setModalAdiantadoOpen(false);
  };
  const iniciarPasseioAtrasado = (id: number) => {
    atualizarBugueiroFila(id, { fez_passeio: true, atraso: (bugueirosFila.find(f => f.bugueiro_id === id)?.atraso || 1) - 1 });
  };

  const confirmarAdiantamento = () => {
    if (bugueiroAdiantado) {
      atualizarBugueiroFila(bugueiroAdiantado.bugueiro_id, {
        fez_passeio: true,
        adiantamento: bugueiroAdiantado.adiantamento + 1,
        tipo_passeio_id: tipoPasseio
      });
      setModalAdiantadoOpen(false);
      setBugueiroAdiantado(null);
      setIsPasseioDialogOpen(false);
      setBugueiroParaPasseio(0);
      setTipoPasseio('');
    }
  };

  const cancelarAdiantamento = () => {
    setModalAdiantadoOpen(false);
    setBugueiroAdiantado(null);
  };

  const iniciarNovaFila = () => {
    router.post(route('bugueiros.filas.novaComTodos'));
  };

  const reordenarFila = () => {
    router.post(route('bugueiros.filas.reordenar', { fila: fila_id }), {}, {
      onSuccess: () => setModalReordenar(false)
    });
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
        <Card className='hidden md:block'>
          <CardHeader>
            <div className="flex justify-between items-center gap-2">
              <div className='flex gap-2'>
                <CardTitle>Fila Atual #{fila_id}</CardTitle>
                <Badge className={getStatusFilaColor(statusFila)}>{statusFila.charAt(0).toUpperCase() + statusFila.slice(1)}</Badge>
              </div>
              
              <div className="flex gap-2">
                {bugueirosFila.filter(f => f.fez_passeio === false).length === 0 && (
                  <Button onClick={iniciarNovaFila} className="flex items-center space-x-2" variant="secondary">
                    <Plus className="h-4 w-4" />
                    <span>Iniciar nova fila</span>
                  </Button>
                )}
                <Button onClick={adicionarTodos} className="flex items-center space-x-2" variant="secondary">
                  <Plus className="h-4 w-4" />
                  <span>Adicionar todos na fila</span>
                </Button>
                <Button onClick={() => setIsDialogOpen(true)} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Adicionar à Fila</span>
                </Button>
                <Button onClick={() => setModalReordenar(true)} size="icon" variant="outline" title="Reordenar fila">
                  <ArrowDownAZ className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>Controle da fila de bugueiros para passeios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="h-8">
                  <TableRow>
                    <TableHead>Posição</TableHead>
                    <TableHead>Bugueiro</TableHead>
                    <TableHead>Hora Entrada</TableHead>
                    <TableHead>Adiantamentos/Atrasos</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bugueirosFila.filter(item => item.fez_passeio === false).map((item) => (
                    <TableRow key={item.id} className="h-4">
                      <TableCell>
                        <div className="flex items-center">
                          
                          <Badge variant="outline" className="mr-2">
                            #{item.posicao_fila}
                          </Badge>
                          
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {item.bugueiro?.bugueiro_posicao_oficial + ' - ' +item.bugueiro.bugueiro_nome}
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
                            <span className="text-sm font-medium text-green-600">{item.bugueiro.bugueiro_fila_adiantamentos}</span>
                          </div>
                          <span className="text-gray-400">|</span>
                          <div className="flex items-center space-x-1">
                            <Rewind className="h-3 w-3 text-red-600" />
                            <span className="text-sm font-medium text-red-600">{item.bugueiro.bugueiro_fila_atrasos}</span>
                          </div>
                        </div>
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
                                  onClick={() => abrirDialogPasseio(item.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                </Button>
                                {item.bugueiro.bugueiro_fila_adiantamentos > 0 && (
                                  <Button
                                    size="sm"
                                    onClick={() => iniciarPasseioAdiantado()}
                                    className="bg-green-600 hover:bg-green-700"
                                    title={`Usar adiantamento (${item.bugueiro.bugueiro_fila_adiantamentos} disponível)`}
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
        {/* Lista de Bugueiros - Mobile Card Layout */}
        <div className="space-y-3 md:hidden">
          {bugueirosFila.map((item) => (
          <Card key={`${item.id}-${item.hora_entrada}`} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    #{item.posicao_fila}
                  </Badge>
                <Users className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{item.bugueiro?.bugueiro_nome}</span>
              </div>
              
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Timer className="h-3 w-3" />
                <span>{item.hora_entrada}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <FastForward className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">{item.bugueiro.bugueiro_fila_adiantamentos}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Rewind className="h-3 w-3 text-red-600" />
                  <span className="text-sm font-medium text-red-600">{item.bugueiro.bugueiro_fila_atrasos}</span>
                </div>
              </div>
            </div>

            {/* Ações Mobile */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moverParaCima(item.id)}
                      disabled={item.posicao_fila === 1}
                      className="p-2 h-8 w-8"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moverParaBaixo(item.id)}
                      disabled={item.posicao_fila === filaNaFila.length}
                      className="p-2 h-8 w-8"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
              </div>
                  
              <div className="flex space-x-1">
                    <Button
                      size="sm"
                      onClick={iniciarPasseio}
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
                        {item.bugueiro.bugueiro_fila_adiantamentos > 0 && (
                          <DropdownMenuItem onClick={() => iniciarPasseioAdiantado()}>
                            <FastForward className="h-3 w-3 mr-2" />
                            Usar Adiantamento ({item.bugueiro.bugueiro_fila_adiantamentos})
                          </DropdownMenuItem>
                        )}
                        {item.atraso > 0 && (
                          <DropdownMenuItem onClick={() => iniciarPasseioAtrasado(item.id)}>
                            <Rewind className="h-3 w-3 mr-2" />
                            Usar Atraso ({item.bugueiro.bugueiro_fila_atrasos})
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
              </div>
              
            </div>
          </Card>
          ))}
        
        {bugueirosFila.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Nenhum bugueiro na fila</p>
            </div>
          </Card>
        )}
        </div>
        {/* Fila realizados */}
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
                    <TableHead>Adiantamentos/Atrasos</TableHead>
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
                            <span className="text-sm font-medium text-green-600">{item.bugueiro.bugueiro_fila_adiantamentos}</span>
                          </div>
                          <span className="text-gray-400">|</span>
                          <div className="flex items-center space-x-1">
                            <Rewind className="h-3 w-3 text-red-600" />
                            <span className="text-sm font-medium text-red-600">{item.bugueiro.bugueiro_fila_atrasos}</span>
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
              <Button onClick={iniciarPasseioAdiantado}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Dialog para Selecionar Tipo de Passeio */}
        <Dialog open={isPasseioDialogOpen} onOpenChange={setIsPasseioDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Iniciar Passeio</DialogTitle>
            <DialogDescription>
              Selecione o tipo de passeio que será realizado
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="id-passeio" className="text-sm font-medium">
                Passeio
              </label>
              <Select 
                value={idPasseio} 
                onValueChange={setIdPasseio}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o passeio" />
                </SelectTrigger>
                <SelectContent>
                  {tiposPasseio.map((tipo)=>(
                    <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="tipo-passeio" className="text-sm font-medium">
                Tipo de passeio
              </label>
              <Select 
                value={tipoPasseio} 
                onValueChange={setTipoPasseio}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de passeio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='normal'>Normal</SelectItem>
                  <SelectItem value='cortesia'>Cortesia</SelectItem>
                  <SelectItem value='parceria'>Parceria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="parceiro" className="text-sm font-medium">
                Parceiro
              </label>
              <Select
                value={parceiroSelecionado}
                onValueChange={setParceiroSelecionado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o parceiro (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nenhum">Nenhum parceiro</SelectItem>
                  {parceiros.map((parceiro) => (
                    <SelectItem key={parceiro.id} value={parceiro.nome}>{parceiro.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsPasseioDialogOpen(false);
                setBugueiroParaPasseio(0);
                setTipoPasseio('');
                setParceiroSelecionado('');
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={iniciarPasseio}
              disabled={!tipoPasseio}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Iniciar Passeio
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
        {/* Modal de confirmação de reordenar fila */}
        <Dialog open={modalReordenar} onOpenChange={setModalReordenar}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reordenar Fila</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja reordenar a fila? Esta ação irá atualizar a posição de todos os bugueiros conforme a posição oficial.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalReordenar(false)}>Cancelar</Button>
              <Button onClick={reordenarFila} className="bg-blue-600 hover:bg-blue-700">Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default FilaBugueiros;