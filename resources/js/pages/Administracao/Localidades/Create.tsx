import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        ger_localidades_nome: '',
        ativo: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('administracao.localidades.store'));
    };

    return (
        <AppLayout>
            <Head title="Nova Localidade" />

            <Card>
                <CardHeader>
                    <CardTitle>Nova Localidade</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome</Label>
                                <Input
                                    id="nome"
                                    value={data.ger_localidades_nome}
                                    onChange={e => setData('ger_localidades_nome', e.target.value)}
                                />
                                {errors.ger_localidades_nome && (
                                                <p className="text-sm text-red-500">{errors.ger_localidades_nome}</p>
                                            )}
                            </div>
                            
                        </div>

                       

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="ativo"
                                checked={data.ativo}
                            />
                            <Label htmlFor="ativo">Ativo</Label>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Salvar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
} 