import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

interface User {
    id: number;
    name: string;
    email: string;
    roles: { id: number; name: string }[];
    permissions: { id: number; name: string }[];
}

interface Props {
    users: User[];
}

export default function Index({ users }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            router.delete(route('users.destroy', id));
        }
    };

    return (
        <>
            <Head title="Usuários" />

            <AppLayout>
                <SettingsLayout>
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle>Usuários</CardTitle>
                                            <CardDescription>
                                                Gerencie os usuários do sistema
                                            </CardDescription>
                                        </div>
                                        <Link href={route('users.create')}>
                                            <Button>Novo Usuário</Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <Input
                                            type="text"
                                            placeholder="Buscar usuários..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="max-w-sm"
                                        />
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nome
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        E-mail
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Papéis
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Ações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredUsers.map((user) => (
                                                    <tr key={user.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {user.roles.map((role) => (
                                                                <span
                                                                    key={role.id}
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
                                                                >
                                                                    {role.name}
                                                                </span>
                                                            ))}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Link
                                                                    href={route('users.edit', user.id)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    Editar
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(user.id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </SettingsLayout>
            </AppLayout>
        </>
    );
} 