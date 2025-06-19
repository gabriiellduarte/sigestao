import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Form from './Form';

interface Props extends PageProps {}

export default function Create({}: Props) {
  return (
    <AppLayout>
      <Head title="Novo Tipo de Portaria" />
      
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Tipo de Portaria</h1>
          <p className="text-gray-600">Crie um novo tipo de portaria para o sistema</p>
        </div>

        <Form />
      </div>
    </AppLayout>
  );
} 