import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface GrupoProcedimento {
  reg_gpro_id: number;
  reg_gpro_nome: string;
}

interface EditProps {
  procedimento: {
    reg_proc_id: number;
    reg_proc_nome: string;
    reg_gpro_id: number;
  };
  grupos: GrupoProcedimento[];
}

export default function Edit({ procedimento, grupos }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    reg_proc_nome: procedimento.reg_proc_nome,
    reg_gpro_id: procedimento.reg_gpro_id
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('regulacao.procedimentos.update', procedimento.reg_proc_id));
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4 max-w-xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href={route('regulacao.procedimentos.index')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-blue-800">Editar Procedimento</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Editar Procedimento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg_proc_nome">Nome do Procedimento *</Label>
                <Input
                  id="reg_proc_nome"
                  value={data.reg_proc_nome}
                  onChange={e => setData('reg_proc_nome', e.target.value)}
                  className={errors.reg_proc_nome ? 'border-red-500' : ''}
                  placeholder="Digite o nome do procedimento"
                />
                {errors.reg_proc_nome && (
                  <p className="text-sm text-red-500">{errors.reg_proc_nome}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg_gpro_id">Grupo *</Label>
                <Select
                  value={data.reg_gpro_id.toString()}
                  onValueChange={value => setData('reg_gpro_id', parseInt(value))}
                >
                  <SelectTrigger className={errors.reg_gpro_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {grupos.map(grupo => (
                      <SelectItem key={grupo.reg_gpro_id} value={grupo.reg_gpro_id.toString()}>
                        {grupo.reg_gpro_nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.reg_gpro_id && (
                  <p className="text-sm text-red-500">{errors.reg_gpro_id}</p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => history.back()}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={processing}>
                  <Save className="h-4 w-4 mr-2" />
                  {processing ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 