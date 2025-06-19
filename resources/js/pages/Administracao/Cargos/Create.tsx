import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Form from './Form';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

export default function Create({ auth }: PageProps) {
    return (
        <AppLayout>
            <Head title="Cadastro de Cargo" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Cadastro de Cargo</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Preencha os dados abaixo para cadastrar um novo cargo no sistema
                        </p>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <Form />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 