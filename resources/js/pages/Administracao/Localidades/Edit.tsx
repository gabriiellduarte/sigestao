import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';

interface Localidade {
    ger_localidades_id: number;
    ger_localidades_nome: string;
    ativo: boolean;
}

interface Props {
    localidade: Localidade;
}

export default function Edit({ localidade }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        ger_localidades_nome: localidade.ger_localidades_nome,
        ger_localidades_id: localidade.ger_localidades_id,
        ativo: localidade.ativo
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('administracao.localidades.update', localidade.ger_localidades_id));
    };

    return (
        <AppLayout>
            <Head title="Editar Localidade" />
            <div className="space-y-6 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Editar Localidade</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ger_localidades_nome">Nome</Label>
                                <Input
                                    id="ger_localidades_nome"
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
                                onCheckedChange={checked => setData('ativo', checked)}
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
            </div>
            
        </AppLayout>
    );
} 