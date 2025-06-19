import { useForm } from '@inertiajs/react';
import { Cargo, CargoFormData } from '@/types/cargo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Save } from 'lucide-react';

interface Props {
    cargo?: Cargo;
    isEditing?: boolean;
}

export default function Form({ cargo, isEditing = false }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<CargoFormData>({
        adm_argos_nome: cargo?.adm_argos_nome || '',
        adm_cargos_abreviacao: cargo?.adm_cargos_abreviacao || null
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && cargo) {
            put(route('administracao.cargos.update', cargo.adm_cargos_id));
        } else {
            post(route('administracao.cargos.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="adm_argos_nome">Nome do Cargo</Label>
                            <Input
                                id="adm_argos_nome"
                                value={data.adm_argos_nome}
                                onChange={e => setData('adm_argos_nome', e.target.value)}
                                required
                            />
                            {errors.adm_argos_nome && (
                                <p className="text-sm text-red-500">{errors.adm_argos_nome}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adm_cargos_abreviacao">Abreviação</Label>
                            <Input
                                id="adm_cargos_abreviacao"
                                value={data.adm_cargos_abreviacao || ''}
                                onChange={e => setData('adm_cargos_abreviacao', e.target.value)}
                            />
                            {errors.adm_cargos_abreviacao && (
                                <p className="text-sm text-red-500">{errors.adm_cargos_abreviacao}</p>
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