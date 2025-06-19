import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { TipoPortaria } from '@/types/tipo-portaria';
import AppLayout from '@/layouts/app-layout';
import Form from './Form';

interface Props extends PageProps {
  tipoPortaria: TipoPortaria;
}

export default function Edit({ tipoPortaria }: Props) {
  return (
    <AppLayout>
      <Head title="Editar Tipo de Portaria" />
      
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Tipo de Portaria</h1>
          <p className="text-gray-600">Atualize as informações do tipo de portaria</p>
        </div>

        <Form tipoPortaria={tipoPortaria} isEditing={true} />
      </div>
    </AppLayout>
  );
} 