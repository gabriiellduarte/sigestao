import React, {useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Plus, Users, ChevronUp, ChevronDown, FastForward, Rewind, MoreVertical, ArrowDownAZ, Timer } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TipoPasseio, Parceiro } from '@/types';
import { Input } from '@/components/ui/input';
import ItemTabelaFila from './ItemTabelaFilaRealizados';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { TabelaFilaBugueiros } from '../components/TabelaFilas';

interface BugueiroFila {
  id: number;
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
  removido: boolean;
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
  // Estado para bugueiros disponíveis
  const [bugueirosDisponiveis, setBugueirosDisponiveis] = useState<{bugueiro_id:number,bugueiro_nome:string}[]>([]);
  const [loadingBugueiros, setLoadingBugueiros] = useState(false);

  // Função para buscar bugueiros disponíveis
  const fetchBugueirosDisponiveis = async () => {
    setLoadingBugueiros(true);
    try {
      const res = await fetch(`/bugueiros/filas/${fila_id}/bugueiros-disponiveis`);
      const data = await res.json();
      setBugueirosDisponiveis(data);
    } catch (e) {
      setBugueirosDisponiveis([]);
    }
    setLoadingBugueiros(false);
  };
  // Estados para passeio em grupo

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
  const [modalRemoverAtraso, setModalRemoverAtraso] = useState<{ open: boolean, id: number | null, tipo: 'simples' | 'atraso' }>({ open: false, id: null, tipo: 'simples' });
  const [obsRemocao, setObsRemocao] = useState('');
  const [reordenando, setReordenando] = useState(false);
  const [usaAdiantamento, setUsaAdiantamento] = useState(false);
  const [mensagemWhatsapp, setMensagemWhatsapp] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [respostaApi, setRespostaApi] = useState<string | null>(null);

  const abrirDialogPasseio = (id: number) => {
    setBugueiroParaPasseio(id);
    setTipoPasseio('normal');
    setIsPasseioDialogOpen(true);
  };
  // Adicionar bugueiro à fila
  const adicionarBugueiroFila = () => {
    if (!bugueiroSelecionado) return;
    router.post(
      route('bugueiros.filas.adicionarBugueiro', fila_id),
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
    console.log('bugueiro', bugueiro);
    if (!bugueiro) return;
    const primeiro = bugueirosFila.filter(f => f.fez_passeio === false && !f.removido).sort((a, b) => a.posicao_fila - b.posicao_fila)[0];
    console.log('primeiro', primeiro);
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
  const enviaAtualizacaodeFila = (id?: number, usa_adiantado?: boolean) => {
    const filaPivoID = id ?? bugueiroParaPasseio;

    atualizarBugueiroFila(filaPivoID, {
      fez_passeio: true,
      tipo_passeio_id: idPasseio,
      tipoPasseio: tipoPasseio,
      parceiro: parceiroSelecionado,
      usa_adiantamento: usa_adiantado
    });
    setIsPasseioDialogOpen(false);
    setBugueiroParaPasseio(0);
    setTipoPasseio('');
    setParceiroSelecionado('');
    setUsaAdiantamento(false);
  }
  const iniciarPasseioAdiantado = (id: number) => {
    enviaAtualizacaodeFila(id, true);
    setModalAdiantadoOpen(false);
  };
  const iniciarPasseioAtrasado = (id: number) => {
    atualizarBugueiroFila(id, { fez_passeio: true, atraso: (bugueirosFila.find(f => f.bugueiro_id === id)?.atraso || 1) - 1 });
  };

  const cancelarAdiantamento = () => {
    setModalAdiantadoOpen(false);
    setBugueiroAdiantado(null);
  };

  const iniciarNovaFila = () => {
    router.post(route('bugueiros.filas.novaComTodos'));
  };

  const reordenarFila = () => {
    setReordenando(true);
    router.post(route('bugueiros.filas.reordenar', { fila: fila_id }), {}, {
      onSuccess: () => {
        setModalReordenar(false);
        setReordenando(false);
      },
      onFinish: () => setReordenando(false),
    });
  };

  const removerSimples = (id: number) => {
    router.post(route('bugueiros.filas.removerSimples', { fila: fila_id, id }), {}, { preserveScroll: true });
  };
  const removerComObs = () => {
    if (!modalRemoverAtraso.id) return;
    if (modalRemoverAtraso.tipo === 'simples') {
      router.post(route('bugueiros.filas.removerSimples', { fila: fila_id, id: modalRemoverAtraso.id }), { obs: obsRemocao }, {
        onSuccess: () => {
          setModalRemoverAtraso({ open: false, id: null, tipo: 'simples' });
          setObsRemocao('');
        },
        preserveScroll: true
      });
    } else {
      router.post(route('bugueiros.filas.removerComAtraso', { fila: fila_id, id: modalRemoverAtraso.id }), { observacao: obsRemocao }, {
        onSuccess: () => {
          setModalRemoverAtraso({ open: false, id: null, tipo: 'simples' });
          setObsRemocao('');
        },
        preserveScroll: true
      });
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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    console.log('Selected IDs changed:', selectedIds);
  }, [selectedIds]);

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

  const gerarMensagemWhatsapp = () => {
    // 20 primeiros da fila
    const primeirosAmanha = bugueirosFila
      .filter(f => f.fez_passeio === false && !f.removido)
      .sort((a, b) => a.posicao_fila - b.posicao_fila)
      .slice(0, 20)
      .map(f => f.bugueiro.bugueiro_posicao_oficial.toString().padStart(2, '0'))
      .join(' ');

    // Atrasados de amanhã (fictício: os 8 primeiros)
    const atrasadosAmanha = bugueirosFila
      .filter(f => f.fez_passeio === false && !f.removido)
      .sort((a, b) => a.posicao_fila - b.posicao_fila)
      .slice(0, 8)
      .map(f => f.bugueiro.bugueiro_posicao_oficial.toString().padStart(2, '0'))
      .join(' ');

    // Adiantados (do cadastro)
    const adiantados = bugueirosFila
      .filter(f => f.bugueiro.bugueiro_fila_adiantamentos > 0)
      .map(f => f.bugueiro.bugueiro_posicao_oficial.toString().padStart(2, '0'))
      .join(' ');

    // Lista dos atrasados (do cadastro)
    const atrasados = bugueirosFila
      .filter(f => f.bugueiro.bugueiro_fila_atrasos > 0)
      .map(f => ({
        numero: f.bugueiro.bugueiro_posicao_oficial.toString().padStart(2, '0'),
        qtd: f.bugueiro.bugueiro_fila_atrasos
      }));

    // Monta a mensagem
    const mensagem = `
✅ PRIMEIROS AMANHÃ\n${primeirosAmanha}\n\n✅ ATRASADOS QUE VÃO PEGAR AMANHÃ\n${atrasadosAmanha}\n\n✔ OS DEMAIS ASSINAM ON-LINE ATÉ AS 09:30\n\n✅ Adiantados: \n${adiantados}\n\n🚨 LISTA DOS ATRASADOS\n${atrasados.map(a => `${a.numero}    ${a.qtd.toString().padStart(2, '0')} passeios atrasados`).join('\n')}
`;
    setMensagemWhatsapp(mensagem.trim());
    return mensagem.trim();
  };

  // Envio real para API externa
  const enviarParaApiWhatsapp = async () => {
    setEnviando(true);
    setRespostaApi(null);
    const mensagem = gerarMensagemWhatsapp();
    try {
      const response = await fetch('https://n8n.aracati.ce.gov.br/webhook/25739f51-29e1-4dfe-9954-51fb559b56e9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem })
      });
      const data = await response.json().catch(() => ({}));
      setRespostaApi('Mensagem enviada! Resposta: ' + (data?.message || response.statusText));
    } catch (e) {
      setRespostaApi('Erro ao enviar mensagem: ' + (e as Error).message);
    }
    setEnviando(false);
  };

  const colunas: ColumnDef<BugueiroFila>[] = [
    {
      id:'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()} 
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'posicao_fila',
      header: 'Posição',
      cell: info => {
        const posicao = info.getValue();
        return <Badge variant="outline" className="mr-2">
                  #{String(posicao)}
                </Badge>;
      }
    },
    {
      accessorKey: 'bugueiro.bugueiro_nome',
      header: 'Nome',
      cell: info => {
        const adiantamentos = info.row.original.bugueiro.bugueiro_fila_adiantamentos;
        const atrasos = info.row.original.bugueiro.bugueiro_fila_atrasos;
        const nome = info.getValue();
        const posicao = info.row.original.bugueiro.bugueiro_posicao_oficial;
        return <div className="flex-col items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{String(posicao)} - {String(nome)}</span>
                <div className="flex items-center space-x-1">
                  <div className="flex items-center space-x-1">
                    <FastForward className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{String(adiantamentos)}</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <div className="flex items-center space-x-1">
                    <Rewind className="h-3 w-3 text-red-600" />
                    <span className="text-sm font-medium text-red-600">{String(atrasos)}</span>
                  </div>
                </div>
                
              </div>;
      }
    },
    {
      header: 'Ações',
      cell: info => {
        const atraso = info.row.original.atraso;
        const item = info.row.original;
        const fila = filaNaFila.length;
        return <div className="flex items-center space-x-2">
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
                        disabled={item.posicao_fila === fila}
                        className="p-1 h-6 w-6"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        onClick={() => abrirDialogPasseio(item.id)}
                        title="Iniciar passeio"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="h-4 w-4 mr-1" />
                      </Button>
                      {item.bugueiro.bugueiro_fila_adiantamentos > 0 && item.posicao_fila === 1 && (
                        <Button
                          size="sm"
                          onClick={() => iniciarPasseioAdiantado(item.id)}
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
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="destructive">Remover</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setModalRemoverAtraso({open: true, id: item.id, tipo: 'simples'})}>
                      Remover simples
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setModalRemoverAtraso({open: true, id: item.id, tipo: 'atraso'})}>
                      Remover com atraso
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>;
      }
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Fila</h1>

        </div>
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:grid-cols-2">
          <Card className='flex justify-center'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col space-x-2">
                <CardTitle className="text-sm font-medium">Na Fila</CardTitle>
                <p className="text-xs text-muted-foreground">Aguardando passeio</p>
              </div>
              <div className="text-2xl font-bold">{filaNaFila.length}</div>
            </CardHeader>
          </Card>
          <Card className='flex justify-center'>
            <CardHeader className="flex flex-row items-center justify-center justify-between space-y-0 pb-2">
              
              <div className="flex flex-col space-x-2">
                <CardTitle className="text-sm font-medium">Realizados</CardTitle>
                <p className="text-xs text-muted-foreground">Fizeram passeio</p>
              </div>
              <div className="text-2xl font-bold">{emPasseio.length}</div>
            </CardHeader>
          </Card>
          <Card className='flex justify-center'>
            <CardHeader className="flex flex-row items-center justify-center justify-between space-y-0 pb-2">
              <div className="flex flex-col space-x-2">
                <CardTitle className="text-sm font-medium">Adiantados</CardTitle>
                <p className="text-xs text-muted-foreground">Bugueiros com passeio adiantado nessa fila</p>
              </div>
              <div className="text-2xl font-bold">{adiantados.length}</div>
            </CardHeader>
          </Card>
          <Card className='flex justify-center'>
            <CardHeader className="flex flex-row items-center justify-center justify-between space-y-0 pb-2">
              <div className="flex flex-col space-x-2">
                <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
                <p className="text-xs text-muted-foreground">Bugueiros com passeio atrasado nessa fila</p>
              </div>
              <div className="text-2xl font-bold">{atraso.length}</div>
            </CardHeader>
          </Card>
        </div>
        {/* Fila Atual */}
        <Card className='hidden md:block'>
          <CardHeader>
            <div className="flex justify-between items-center gap-2">
              <div className='flex gap-2'>
                <CardTitle>{props.fila_titulo} #{fila_id}</CardTitle>
                <Badge className={getStatusFilaColor(statusFila)}>{statusFila.charAt(0).toUpperCase() + statusFila.slice(1)}</Badge>
              </div>

              <div className="flex gap-2">
                
                {/* Dropdown para adicionar todos/adicionar à fila */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center space-x-2" variant="secondary">
                      <Plus className="h-4 w-4" />
                      <span>Adicionar</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={adicionarTodos}>
                      Adicionar todos na fila
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                      Adicionar à Fila
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={enviarParaApiWhatsapp} variant="outline" className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Gerar mensagem WhatsApp'}
                </Button>
                <Button onClick={() => router.get('/bugueiros/todas-filas')} variant="outline" className="bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100">
                  Ver todas as filas
                </Button>
                <Button onClick={() => setModalReordenar(true)} size="icon" variant="outline" title="Reordenar fila">
                  <ArrowDownAZ className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>Controle da fila de bugueiros para passeios</CardDescription>
          </CardHeader>
          <CardContent>
            
          </CardContent>
        </Card>
        <div className="rounded-md border bg-white p-4 shadow-sm">
              
              <TabelaFilaBugueiros
                data={bugueirosFila.filter(item => item.fez_passeio === false && !item.removido)}
                columns={colunas}
                tiposPasseio={tiposPasseio}
                filaId={fila_id}
              />
              {/* Modal de passeio em grupo */}
              
            </div>
        {/* Exibe a mensagem gerada e resposta mockada da API */}
        {mensagemWhatsapp && (
          <div className="mt-4 p-3 bg-gray-50 border rounded text-sm whitespace-pre-wrap">
            <b>Mensagem WhatsApp:</b><br />
            {mensagemWhatsapp}
          </div>
        )}
        {respostaApi && (
          <div className="mt-2 p-2 bg-green-50 border border-green-300 rounded text-green-800">
            {respostaApi}
          </div>
        )}
        {/* Lista de Bugueiros - Mobile Card Layout */}
        <div className="space-y-3 md:hidden">
          {bugueirosFila.filter(item => item.fez_passeio === false && !item.removido).map((item) => (
            <Card key={`${item.id}-${item.hora_entrada}`} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    #{item.posicao_fila}
                  </Badge>
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{item.bugueiro?.bugueiro_nome}</span>
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

              <div className="flex items-center justify-between mb-3 hidden">
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
                    onClick={() => abrirDialogPasseio(item.id)}
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
                        <DropdownMenuItem onClick={() => iniciarPasseioAdiantado(item.id)}>
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
                    <ItemTabelaFila key={item.id} item={item} onRemover={removerBugueiro} />
                  ))}
                  {bugueirosFila.filter(item => item.removido).map((item) => (
                    <ItemTabelaFila key={item.id} item={item} onRemover={removerBugueiro} />
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
                  onOpenChange={open => { if (open) fetchBugueirosDisponiveis(); }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingBugueiros ? "Carregando..." : "Selecione um bugueiro"} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingBugueiros && (
                      <div className="p-2 text-gray-500 text-sm">Carregando...</div>
                    )}
                    {!loadingBugueiros && bugueirosDisponiveis.length === 0 && (
                      <div className="p-2 text-gray-500 text-sm">Nenhum bugueiro disponível</div>
                    )}
                    {!loadingBugueiros && bugueirosDisponiveis.map(b => (
                      <SelectItem key={b.bugueiro_id} value={String(b.bugueiro_id)}>
                        {b.bugueiro_nome}
                      </SelectItem>
                    ))}
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
              <Button onClick={() => iniciarPasseioAdiantado(bugueiroParaPasseio)}>Confirmar</Button>
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
                    {tiposPasseio.map((tipo) => (
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
              <Button variant="outline" onClick={() => setModalReordenar(false)} disabled={reordenando}>Cancelar</Button>
              <Button onClick={reordenarFila} className="bg-blue-600 hover:bg-blue-700" disabled={reordenando}>
                {reordenando ? 'Reordenando...' : 'Confirmar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Modal de remoção com observação */}
        <Dialog open={modalRemoverAtraso.open} onOpenChange={open => setModalRemoverAtraso({ open, id: open ? modalRemoverAtraso.id : null, tipo: modalRemoverAtraso.tipo })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remover bugueiro {modalRemoverAtraso.tipo === 'atraso' ? 'com atraso' : 'da fila'}</DialogTitle>
            </DialogHeader>
            <div className="mb-2">Informe o motivo da remoção:</div>
            <Input value={obsRemocao} onChange={e => setObsRemocao(e.target.value)} placeholder="Motivo da remoção" />
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalRemoverAtraso({ open: false, id: null, tipo: 'simples' })}>Cancelar</Button>
              <Button onClick={removerComObs} disabled={!obsRemocao.trim()} className={modalRemoverAtraso.tipo === 'atraso' ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}>
                Confirmar remoção
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default FilaBugueiros;