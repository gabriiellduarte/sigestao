"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
} from "@tanstack/react-table"

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// ...existing code...
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipoPasseio } from "@/types";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount?: number;
    pageIndex?: number;
    onPageChange?: (page: number) => void;
    onSortingChange?: (sorting: any) => void;
    onGroupActionClick?: (selectedIds: number[]) => void;
    selectedRowIds?: number[];
    onSelectionChange?: (ids: number[]) => void;
    tiposPasseio: TipoPasseio[];
    filaId: number;
}

export function TabelaFilaBugueiros<TData, TValue>({
    columns,
    data,
    pageCount = 1,
    pageIndex = 0,
    onPageChange,
    onSortingChange,
    onGroupActionClick,
    selectedRowIds,
    onSelectionChange,
    tiposPasseio,
    filaId,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [idPasseio, setIdPasseio] = useState<string>('0');
    
    // O controle de modal e descrição agora será feito fora do DataTable
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection
        },
        onSortingChange: (updater) => {
            if (typeof updater === 'function') {
                const next = updater(sorting);
                setSorting(next);
                onSortingChange && onSortingChange(next);
            } else {
                setSorting(updater);
                onSortingChange && onSortingChange(updater);
            }
        },
        manualSorting: true,
    });

    // Obter linhas selecionadas
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    const [modalPasseioGrupo, setModalPasseioGrupo] = useState(false);
    const [descricaoPasseioGrupo, setDescricaoPasseioGrupo] = useState("");
    const [enviandoPasseioGrupo, setEnviandoPasseioGrupo] = useState(false);
    const [erroPasseioGrupo, setErroPasseioGrupo] = useState("");
    const [idsSelecionados, setIdsSelecionados] = useState<number[]>([]);
    const [tipoPasseio, setTipoPasseio] = useState<string>('normal');

    useEffect(() => {
        setIdsSelecionados(selectedRows.map(row => (row.original as any).id));
    }, [selectedRows]);
    function enviarPasseioGrupo() {
        setEnviandoPasseioGrupo(true);
        setErroPasseioGrupo("");
        setIdsSelecionados([]);
        setRowSelection({});
        try {
            router.post("/bugueiros/passeios/adicionarpasseioemgrupo", {
                ids: idsSelecionados,
                tipo_passeio_id: idPasseio,
                descricao: descricaoPasseioGrupo,
                tipoPasseio: tipoPasseio,
                filaId: filaId
            }, {
                onSuccess: () => {
                    setModalPasseioGrupo(false);
                    setDescricaoPasseioGrupo("");
                    setIdsSelecionados([]);
                    setRowSelection({}); // Limpa seleção na tabela
                },
                onError: () => {
                    setErroPasseioGrupo("Erro ao salvar passeio em grupo");
                },
                onFinish: () => {
                    setEnviandoPasseioGrupo(false);
                }
            });
        } catch (e) {
            setErroPasseioGrupo("Erro desconhecido");
            setEnviandoPasseioGrupo(false);
        }
    }

    // Não há mais função de envio aqui

    return (
        <div className="rounded-md">
            <div className="flex justify-center items-center p-2">
                <div className="text-muted-foreground flex-1 text-sm">
                    {selectedRows.length} de {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
                </div>
                {/* Botão de passeio em grupo */}
                {selectedRows.length > 0 && (
                    <div className="my-2">
                        <Button onClick={() => setModalPasseioGrupo(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Iniciar Passeio em Grupo
                        </Button>
                    </div>
                )}
            </div>


            {/* O botão/modal de passeio em grupo deve ser renderizado fora deste componente */}
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        <div className="flex items-center gap-1 cursor-pointer select-none"
                                            onClick={header.column.getToggleSortingHandler?.()}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            {header.column.getCanSort?.() && (
                                                <span>
                                                    {header.column.getIsSorted() === 'asc' ? ' ▲' : header.column.getIsSorted() === 'desc' ? ' ▼' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Ninguem na fila.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Modal de passeio em grupo */}
            <Dialog open={modalPasseioGrupo} onOpenChange={setModalPasseioGrupo}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Iniciar Passeio em Grupo</DialogTitle>
                        <DialogDescription>
                            Selecione a descrição do passeio em grupo para {idsSelecionados.length} pessoa(s).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="my-2">
                        <Input
                            value={descricaoPasseioGrupo}
                            onChange={e => setDescricaoPasseioGrupo(e.target.value)}
                            placeholder="Descrição do passeio"
                            disabled={enviandoPasseioGrupo}
                        />
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
                    </div>
                    {erroPasseioGrupo && <div className="text-red-600 text-sm mb-2">{erroPasseioGrupo}</div>}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalPasseioGrupo(false)} disabled={enviandoPasseioGrupo}>Cancelar</Button>
                        <Button onClick={enviarPasseioGrupo} 
                            className="bg-blue-600 hover:bg-blue-700 text-white" disabled={enviandoPasseioGrupo || !descricaoPasseioGrupo}>
                            {enviandoPasseioGrupo ? "Enviando..." : "Confirmar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Paginação */}
            <div className="flex justify-between items-center p-2">
                <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    onClick={() => onPageChange && onPageChange(pageIndex - 1)}
                    disabled={pageIndex === 0}
                >Anterior</button>
                <span>Página {pageIndex + 1} de {pageCount}</span>
                <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    onClick={() => onPageChange && onPageChange(pageIndex + 1)}
                    disabled={pageIndex + 1 >= pageCount}
                >Próxima</button>
            </div>
        </div>
    )
}