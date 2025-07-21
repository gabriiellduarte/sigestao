import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Timer, FastForward, Rewind } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}

const ItemTabelaFila: React.FC<Props> = ({ item, onRemover }) => (
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
        {onRemover && (
          <Button size="sm" variant="destructive" onClick={() => onRemover(item.bugueiro_id)}>
            Retornar para fila
          </Button>
        )}
      </div>
    </TableCell>
  </TableRow>
);

export default ItemTabelaFila;
