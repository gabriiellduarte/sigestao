import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface EditProps {
  medico: {
    reg_med_id: number;
    reg_med_nome: string;
  };
}

export default function Edit({ medico }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    reg_med_nome: medico.reg_med_nome
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('regulacao.medicos.update', medico.reg_med_id));
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4 max-w-xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href={route('regulacao.medicos.index')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-blue-800">Editar Médico</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Editar Médico</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg_med_nome">Nome do Médico *</Label>
                <Input
                  id="reg_med_nome"
                  value={data.reg_med_nome}
                  onChange={e => setData('reg_med_nome', e.target.value)}
                  className={errors.reg_med_nome ? 'border-red-500' : ''}
                  placeholder="Digite o nome do médico"
                />
                {errors.reg_med_nome && (
                  <p className="text-sm text-red-500">{errors.reg_med_nome}</p>
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