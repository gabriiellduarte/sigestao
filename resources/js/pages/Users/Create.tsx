import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

interface Role {
    id: number;
    name: string;
}

interface Props {
    roles: Role[];
}

export default function Create({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
        permissions: [] as string[]
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <>
            <Head title="Novo Usuário" />

            <AppLayout>
                <SettingsLayout>
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Novo Usuário</CardTitle>
                                    <CardDescription>
                                        Preencha os dados do novo usuário
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nome</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">E-mail</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">{errors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Senha</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-500">{errors.password}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirmar Senha</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium text-gray-700">Permissões</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="super_admin"
                                                        checked={data.permissions.includes('Super Administrador')}
                                                        onChange={(e) => {
                                                            const newPermissions = e.target.checked
                                                                ? [...data.permissions, 'Super Administrador']
                                                                : data.permissions.filter(p => p !== 'Super Administrador');
                                                            setData('permissions', newPermissions);
                                                        }}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <Label htmlFor="super_admin" className="text-sm text-gray-700">
                                                        Super Administrador
                                                    </Label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="acesso_bloqueado"
                                                        checked={data.permissions.includes('Acesso Bloqueado')}
                                                        onChange={(e) => {
                                                            const newPermissions = e.target.checked
                                                                ? [...data.permissions, 'Acesso Bloqueado']
                                                                : data.permissions.filter(p => p !== 'Acesso Bloqueado');
                                                            setData('permissions', newPermissions);
                                                        }}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <Label htmlFor="acesso_bloqueado" className="text-sm text-gray-700">
                                                        Acesso Bloqueado
                                                    </Label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="acesso_liberado"
                                                        checked={data.permissions.includes('Acesso Liberado')}
                                                        onChange={(e) => {
                                                            const newPermissions = e.target.checked
                                                                ? [...data.permissions, 'Acesso Liberado']
                                                                : data.permissions.filter(p => p !== 'Acesso Liberado');
                                                            setData('permissions', newPermissions);
                                                        }}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <Label htmlFor="acesso_liberado" className="text-sm text-gray-700">
                                                        Acesso Liberado
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Perfis
                                            </label>
                                            <div className="space-y-2">
                                                {roles.map((role) => (
                                                    <div key={role.id} className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`role-${role.id}`}
                                                            checked={data.roles.includes(role.name)}
                                                            onChange={(e) => {
                                                                const newRoles = e.target.checked
                                                                    ? [...data.roles, role.name]
                                                                    : data.roles.filter(r => r !== role.name);
                                                                setData('roles', newRoles);
                                                            }}
                                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        />
                                                        <label htmlFor={`role-${role.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            {role.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => window.history.back()}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing ? 'Criando...' : 'Criar'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </SettingsLayout>
            </AppLayout>
        </>
    );
} 