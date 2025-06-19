import { useForm } from '@inertiajs/react';
import { Secretaria, SecretariaFormData } from '@/types/secretaria';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Props {
    secretaria?: Secretaria;
    isEditing?: boolean;
}

export default function Form({ secretaria, isEditing = false }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<SecretariaFormData>({
        adm_secretarias_nome: secretaria?.adm_secretarias_nome || '',
        adm_secretarias_abreviacao: secretaria?.adm_secretarias_abreviacao || null,
        adm_secretarias_status: secretaria?.adm_secretarias_status ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && secretaria) {
            put(route('administracao.secretarias.update', secretaria.adm_secretarias_id));
        } else {
            post(route('administracao.secretarias.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="adm_secretarias_nome">Nome da Secretaria</Label>
                            <Input
                                id="adm_secretarias_nome"
                                value={data.adm_secretarias_nome}
                                onChange={e => setData('adm_secretarias_nome', e.target.value)}
                                required
                            />
                            {errors.adm_secretarias_nome && (
                                <p className="text-sm text-red-500">{errors.adm_secretarias_nome}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adm_secretarias_abreviacao">Abreviação</Label>
                            <Input
                                id="adm_secretarias_abreviacao"
                                value={data.adm_secretarias_abreviacao || ''}
                                onChange={e => setData('adm_secretarias_abreviacao', e.target.value)}
                            />
                            {errors.adm_secretarias_abreviacao && (
                                <p className="text-sm text-red-500">{errors.adm_secretarias_abreviacao}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adm_secretarias_status">Status</Label>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="adm_secretarias_status"
                                    checked={data.adm_secretarias_status}
                                    onCheckedChange={(checked) => setData('adm_secretarias_status', checked)}
                                />
                                <Label htmlFor="adm_secretarias_status">
                                    {data.adm_secretarias_status ? 'Ativo' : 'Inativo'}
                                </Label>
                            </div>
                            {errors.adm_secretarias_status && (
                                <p className="text-sm text-red-500">{errors.adm_secretarias_status}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
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
                            <Save className="h-4 w-4 mr-2" />
                            {isEditing ? 'Atualizar' : 'Cadastrar'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
} 