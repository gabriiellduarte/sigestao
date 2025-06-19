import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Pessoa } from '@/types/pessoa';
import { Localidade } from '@/types/paciente';
import Form from './Form';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface Props extends PageProps {
    pessoa: Pessoa;
    localidades: Localidade[];
}

export default function Edit({ auth, pessoa, localidades }: Props) {
    return (
        <AppLayout>
            <Head title="Edição de Pessoa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Edição de Pessoa</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Atualize os dados da pessoa conforme necessário
                        </p>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <Form pessoa={pessoa} localidades={localidades} isEditing={true} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 