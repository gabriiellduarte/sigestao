import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    reg_tipo_nome: '',
    reg_tipo_peso: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('regulacao.tiposatendimento.store'));
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4 max-w-xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href={route('regulacao.tiposatendimento.index')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-blue-800">Novo Tipo de Atendimento</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg_tipo_nome">Nome do Tipo *</Label>
                <Input
                  id="reg_tipo_nome"
                  value={data.reg_tipo_nome}
                  onChange={e => setData('reg_tipo_nome', e.target.value)}
                  className={errors.reg_tipo_nome ? 'border-red-500' : ''}
                  placeholder="Digite o nome do tipo"
                />
                {errors.reg_tipo_nome && (
                  <p className="text-sm text-red-500">{errors.reg_tipo_nome}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg_tipo_peso">Peso *</Label>
                <Input
                  id="reg_tipo_peso"
                  type="number"
                  value={data.reg_tipo_peso}
                  onChange={e => setData('reg_tipo_peso', parseInt(e.target.value))}
                  className={errors.reg_tipo_peso ? 'border-red-500' : ''}
                  placeholder="Digite o peso do tipo"
                />
                {errors.reg_tipo_peso && (
                  <p className="text-sm text-red-500">{errors.reg_tipo_peso}</p>
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