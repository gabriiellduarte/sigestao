import { useForm } from '@inertiajs/react';
import { Paciente, PacienteFormData, Localidade } from '@/types/paciente';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    paciente?: Paciente;
    localidades: Localidade[];
    isEditing?: boolean;
}

export default function Form({ paciente, localidades, isEditing = false }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<PacienteFormData>({
        reg_paciente_nome: paciente?.ger_pessoas_nome || '',
        reg_paciente_cns: paciente?.reg_paciente_cns || '',
        reg_paciente_cpf: paciente?.reg_paciente_cpf || '',
        reg_paciente_nascimento: paciente?.reg_paciente_nascimento || '',
        reg_paciente_telefone1: paciente?.reg_paciente_telefone1 || '',
        reg_paciente_telefone2: paciente?.reg_paciente_telefone2 || '',
        reg_paciente_endereco: paciente?.reg_paciente_endereco || '',
        reg_paciente_endereco_n: paciente?.reg_paciente_endereco_n || '',
        reg_paciente_endereco_bairro: paciente?.reg_paciente_endereco_bairro || '',
        reg_paciente_mae: paciente?.reg_paciente_mae || '',
        reg_loc_id: paciente?.reg_loc_id || null
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && paciente) {
            put(route('regulacao.pacientes.update', paciente.reg_paciente_id));
        } else {
            post(route('regulacao.pacientes.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
            <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                    id="reg_paciente_nome"
                    value={data.reg_paciente_nome}
                    onChange={(e) => setData('reg_paciente_nome', e.target.value)}
                    required
                    />
                </div>
                <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                    id="reg_paciente_cpf"
                    value={data.reg_paciente_cpf || ''}
                    onChange={(e) => setData('reg_paciente_cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    required
                    />
                </div>
                <div>
                    <Label htmlFor="rg">CNS</Label>
                    <Input
                    id="reg_paciente_cns"
                    value={data.reg_paciente_cns}
                    onChange={(e) => setData('reg_paciente_cns', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="reg_paciente_nascimento">Data de Nascimento *</Label>
                    <Input
                    id="reg_paciente_nascimento"
                    type="date"
                    value={data.reg_paciente_nascimento}
                    onChange={(e) => setData('reg_paciente_nascimento', e.target.value)}
                    required
                    />
                </div>
                <div>
                    <Label htmlFor="reg_paciente_mae">Nome da Mãe</Label>
                    <Input
                    id="reg_paciente_mae"
                    value={data.reg_paciente_mae || ''}
                    onChange={(e) => setData('reg_paciente_mae', e.target.value)}
                    />
                </div>
                </div>
            </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="reg_paciente_nome">Nome</Label>
                            <Input
                                id="reg_paciente_nome"
                                value={data.reg_paciente_nome}
                                onChange={e => setData('reg_paciente_nome', e.target.value)}
                            />
                            {errors.reg_paciente_nome && (
                                <p className="text-sm text-red-500">{errors.reg_paciente_nome}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reg_paciente_cns">CNS</Label>
                            <Input
                                id="reg_paciente_cns"
                                value={data.reg_paciente_cns}
                                onChange={e => setData('reg_paciente_cns', e.target.value)}
                            />
                            {errors.reg_paciente_cns && (
                                <p className="text-sm text-red-500">{errors.reg_paciente_cns}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reg_paciente_cpf">CPF</Label>
                            <Input
                                id="reg_paciente_cpf"
                                value={data.reg_paciente_cpf || ''}
                                onChange={e => setData('reg_paciente_cpf', e.target.value)}
                            />
                            {errors.reg_paciente_cpf && (
                                <p className="text-sm text-red-500">{errors.reg_paciente_cpf}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reg_paciente_nascimento">Data de Nascimento</Label>
                            <Input
                                id="reg_paciente_nascimento"
                                type="date"
                                value={data.reg_paciente_nascimento}
                                onChange={e => setData('reg_paciente_nascimento', e.target.value)}
                            />
                            {errors.reg_paciente_nascimento && (
                                <p className="text-sm text-red-500">{errors.reg_paciente_nascimento}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reg_paciente_telefone1">Telefone Principal</Label>
                            <Input
                                id="reg_paciente_telefone1"
                                value={data.reg_paciente_telefone1}
                                onChange={e => setData('reg_paciente_telefone1', e.target.value)}
                            />
                            {errors.reg_paciente_telefone1 && (
                                <p className="text-sm text-red-500">{errors.reg_paciente_telefone1}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reg_paciente_telefone2">Telefone Secundário</Label>
                            <Input
                                id="reg_paciente_telefone2"
                                value={data.reg_paciente_telefone2 || ''}
                                onChange={e => setData('reg_paciente_telefone2', e.target.value)}
                            />
                            {errors.reg_paciente_telefone2 && (
                                <p className="text-sm text-red-500">{errors.reg_paciente_telefone2}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reg_paciente_endereco">Endereço</Label>
                            <Input
                                id="reg_paciente_endereco"
                                value={data.reg_paciente_endereco || ''}
                                onChange={e => setData('reg_paciente_endereco', e.target.value)}
                            />
                            {errors.reg_paciente_endereco && (
                                <p className="text-sm text-red-500">{errors.reg_paciente_endereco}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reg_paciente_endereco_n">Número</Label>
                            <Input
                                id="reg_paciente_endereco_n"
                                value={data.reg_paciente_endereco_n || ''}
                                onChange={e => setData('reg_paciente_endereco_n', e.target.value)}
                            />
                            {errors.reg_paciente_endereco_n && (
                                <p className="text-sm text-red-500">{errors.reg_paciente_endereco_n}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reg_paciente_endereco_bairro">Bairro</Label>
                            <Input
                                id="reg_paciente_endereco_bairro"
                                value={data.reg_paciente_endereco_bairro || ''}
                                onChange={e => setData('reg_paciente_endereco_bairro', e.target.value)}
                            />
                            {errors.reg_paciente_endereco_bairro && (
                                <p className="text-sm text-red-500">{errors.reg_paciente_endereco_bairro}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reg_paciente_mae">Nome da Mãe</Label>
                            <Input
                                id="reg_paciente_mae"
                                value={data.reg_paciente_mae || ''}
                                onChange={e => setData('reg_paciente_mae', e.target.value)}
                            />
                            {errors.reg_paciente_mae && (
                                <p className="text-sm text-red-500">{errors.reg_paciente_mae}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reg_loc_id">Localidade</Label>
                            <Select
                                value={data.reg_loc_id?.toString() || ''}
                                onValueChange={(value) => setData('reg_loc_id', value ? parseInt(value) : null)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma localidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {localidades.map(localidade => (
                                        <SelectItem
                                            key={localidade.reg_loc_id}
                                            value={localidade.reg_loc_id.toString()}
                                        >
                                            {localidade.reg_loc_nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.reg_loc_id && (
                                <p className="text-sm text-red-500">{errors.reg_loc_id}</p>
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
                            {isEditing ? 'Atualizar' : 'Cadastrar'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
} 