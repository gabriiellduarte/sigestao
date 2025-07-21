import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Timer, FastForward, Rewind, ChevronUp, ChevronDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import React from 'react';

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
  removido: boolean;
}

interface Props {
  item: BugueiroFila;
  onRemover?: (id: number) => void;
  moverParaCima: (id: number) => void;
  moverParaBaixo: (id: number) => void;
  abrirDialogPasseio:(id: number) => void;
  iniciarPasseioAdiantado:(id: number) => void;
  iniciarPasseioAtrasado:(id: number) => void;
  fila: BugueiroFila[];
  setModalRemoverAtraso: (value: {open: boolean, id: number|null, tipo: 'simples'|'atraso'}) => void;
}

const ItemTabelaFilaAtual: React.FC<Props> = (
    { 
        item, 
        onRemover, 
        moverParaCima, 
        moverParaBaixo, 
        abrirDialogPasseio,
        iniciarPasseioAdiantado, 
        iniciarPasseioAtrasado,
        fila,
        setModalRemoverAtraso

    }) => (
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
                disabled={item.posicao_fila === fila.length}
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
      </div>
    </TableCell>
  </TableRow>
);

export default ItemTabelaFilaAtual;
