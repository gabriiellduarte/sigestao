import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Secretaria } from '@/types/secretaria';
import Form from './Form';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface Props extends PageProps {
    secretaria: Secretaria;
}

export default function Edit({ auth, secretaria }: Props) {
    return (
        <AppLayout>
            <Head title="Edição de Secretaria" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Edição de Secretaria</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Atualize os dados da secretaria conforme necessário
                        </p>
                    </div>

                    <Form secretaria={secretaria} isEditing={true} />
                </div>
            </div>
        </AppLayout>
    );
} 