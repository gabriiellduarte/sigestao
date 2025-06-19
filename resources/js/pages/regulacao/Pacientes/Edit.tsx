import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Paciente, Localidade } from '@/types/paciente';
import Form from './Form';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface Props extends PageProps {
    paciente: Paciente;
    localidades: Localidade[];
}

export default function Edit({ auth, paciente, localidades }: Props) {
    return (
        <AppLayout>
            <Head title="Edição de Paciente" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Edição de Paciente</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Atualize os dados do paciente conforme necessário
                        </p>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <Form paciente={paciente} localidades={localidades} isEditing={true} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 