import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Parceiro } from '@/types';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props extends PageProps {
    parceiros: Parceiro[];
}

export default function Index({ auth, parceiros }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const start = () => setIsLoading(true);
        const end = () => setIsLoading(false);
        window.addEventListener('inertia:start', start);
        window.addEventListener('inertia:finish', end);
        return () => {
            window.removeEventListener('inertia:start', start);
            window.removeEventListener('inertia:finish', end);
        };
    }, []);

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este parceiro?')) {
            router.delete(route('bugueiros.parceiros.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Parceiros" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Parceiros</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Lista de todos os parceiros cadastrados no sistema
                            </p>
                        </div>
                        <Link href={route('bugueiros.parceiros.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Novo Parceiro
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-4 min-h-[300px] relative">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                <span>Carregando...</span>
                            </div>
                        )}
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b">Nome</th>
                                    <th className="px-4 py-2 border-b">Contato</th>
                                    <th className="px-4 py-2 border-b">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parceiros.map((parceiro) => (
                                    <tr key={parceiro.id}>
                                        <td className="px-4 py-2 border-b">{parceiro.nome}</td>
                                        <td className="px-4 py-2 border-b">{parceiro.contato}</td>
                                        <td className="px-4 py-2 border-b">
                                            <div className="flex space-x-2">
                                                <Link href={route('bugueiros.parceiros.edit', parceiro.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(parceiro.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {parceiros.length === 0 && (
                            <div className="text-center text-gray-500 mt-4">Nenhum parceiro cadastrado.</div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 