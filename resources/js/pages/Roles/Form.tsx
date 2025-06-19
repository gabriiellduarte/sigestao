import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
interface Permission {
    id: number;
    name: string;
    description: string;
}

interface Role {
    id?: number;
    name: string;
    description: string;
    permissions: number[];
}

interface Props {
    role?: Role;
    permissions: Permission[];
}

export default function Form({ role, permissions }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
        description: role?.description || '',
        permissions: role?.permissions || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (role?.id) {
            put(route('roles.update', role.id));
        } else {
            post(route('roles.store'));
        }
    };

    const togglePermission = (permissionId: number) => {
        const currentPermissions = [...data.permissions];
        const index = currentPermissions.indexOf(permissionId);

        if (index === -1) {
            currentPermissions.push(permissionId);
        } else {
            currentPermissions.splice(index, 1);
        }

        setData('permissions', currentPermissions);
    };

    return (
        <AppLayout>
            <SettingsLayout>
            <Head title={role ? 'Editar Função' : 'Nova Função'} />

                <div className="container mx-auto py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit(route('roles.index'))}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-semibold">
                            {role ? 'Editar Função' : 'Nova Função'}
                        </h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informações da Função</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Digite o nome da função"
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
                                        placeholder="Digite a descrição da função"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Permissões</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {permissions.map((permission) => (
                                            <div key={permission.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`permission-${permission.id}`}
                                                    checked={data.permissions.includes(permission.id)}
                                                    onCheckedChange={() => togglePermission(permission.id)}
                                                />
                                                <Label
                                                    htmlFor={`permission-${permission.id}`}
                                                    className="text-sm font-normal"
                                                >
                                                    {permission.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.permissions && (
                                        <p className="text-sm text-red-500">{errors.permissions}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit(route('roles.index'))}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {role ? 'Atualizar' : 'Criar'}
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