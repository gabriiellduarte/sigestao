import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Localidade } from '@/types/paciente';
import Form from './Form';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface Props extends PageProps {
    localidades: Localidade[];
}

export default function Create({ auth, localidades }: Props) {
    return (
        <AppLayout>
            <Head title="Cadastro de Pessoa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Cadastro de Pessoa</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Preencha os dados abaixo para cadastrar uma nova pessoa no sistema
                        </p>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <Form localidades={localidades} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 