import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TipoPortaria, TipoPortariaFormData } from '@/types/tipo-portaria';

interface Props {
  tipoPortaria?: TipoPortaria;
  isEditing?: boolean;
}

export default function Form({ tipoPortaria, isEditing = false, ...props }: Props) {
  const { data, setData, post, put, processing, errors } = useForm<TipoPortariaFormData>({
    doc_tiposportaria_nome: tipoPortaria?.doc_tiposportaria_nome || '',
    doc_tiposportaria_status: tipoPortaria?.doc_tiposportaria_status ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && tipoPortaria) {
      put(route('documentos.tiposdeportaria.update', tipoPortaria.doc_tiposportaria_id));
    } else {
      post(route('documentos.tiposdeportaria.store'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editar Tipo de Portaria' : 'Novo Tipo de Portaria'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="doc_tiposportaria_nome">Nome do Tipo</Label>
            <Input
              id="doc_tiposportaria_nome"
              value={data.doc_tiposportaria_nome}
              onChange={(e) => setData('doc_tiposportaria_nome', e.target.value)}
              placeholder="Ex: Nomeação, Exoneração, Designação"
              className={errors.doc_tiposportaria_nome ? 'border-red-500' : ''}
            />
            {errors.doc_tiposportaria_nome && (
              <p className="text-sm text-red-500">{errors.doc_tiposportaria_nome}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="doc_tiposportaria_status"
              checked={data.doc_tiposportaria_status}
              onCheckedChange={(checked) => setData('doc_tiposportaria_status', checked)}
            />
            <Label htmlFor="doc_tiposportaria_status">Tipo Ativo</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 