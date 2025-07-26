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
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = 1,
  pageIndex = 0,
  onPageChange,
  onSortingChange,
  onGroupActionClick,
  selectedRowIds,
  onSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
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

  useEffect(() => {
  if (onSelectionChange) {
    const selectedIds = selectedRows.map(row => (row.original as any).id);
    onSelectionChange(selectedIds);
  }
}, [selectedRows, onSelectionChange]);

  // Não há mais função de envio aqui

  return (
    <div className="rounded-md">
      <div className="text-muted-foreground flex-1 text-sm">
        {selectedRows.length} de {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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