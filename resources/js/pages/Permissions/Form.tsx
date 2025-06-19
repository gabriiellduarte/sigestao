import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

interface Permission {
    id?: number;
    name: string;
    description: string;
}

interface Props {
    permission?: Permission;
}

export default function Form({ permission }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: permission?.name || '',
        description: permission?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (permission?.id) {
            put(route('permissions.update', permission.id));
        } else {
            post(route('permissions.store'));
        }
    };

    return (
        <AppLayout>
            <SettingsLayout>
            <Head title={permission ? 'Editar Permissão' : 'Nova Permissão'} />

            <div className="container mx-auto py-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.visit(route('permissions.index'))}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-semibold">
                        {permission ? 'Editar Permissão' : 'Nova Permissão'}
                    </h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações da Permissão</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Digite o nome da permissão"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Digite a descrição da permissão"
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">{errors.description}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route('permissions.index'))}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {permission ? 'Atualizar' : 'Criar'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            </SettingsLayout>
            
        </AppLayout>
    );
} 