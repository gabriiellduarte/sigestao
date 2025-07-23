import { useForm } from '@inertiajs/react';
import { Pessoa, PessoaFormData } from '@/types/pessoa';
import { Localidade } from '@/types/paciente';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Save } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Props {
    pessoa?: Pessoa;
    localidades: Localidade[];
    isEditing?: boolean;
}

export default function Form({ pessoa, localidades, isEditing = false }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<PessoaFormData>({
        ger_pessoas_sexo: pessoa?.ger_pessoas_sexo || '',
        ger_pessoas_nome: pessoa?.ger_pessoas_nome || '',
        ger_pessoas_cns: pessoa?.ger_pessoas_cns || '',
        ger_pessoas_cpf: pessoa?.ger_pessoas_cpf || '',
        ger_pessoas_nascimento: pessoa?.ger_pessoas_nascimento || '',
        ger_pessoas_telefone1: pessoa?.ger_pessoas_telefone1 || '',
        ger_pessoas_telefone2: pessoa?.ger_pessoas_telefone2 || '',
        ger_pessoas_endereco: pessoa?.ger_pessoas_endereco || '',
        ger_pessoas_endereco_n: pessoa?.ger_pessoas_endereco_n || '',
        ger_pessoas_endereco_bairro: pessoa?.ger_pessoas_endereco_bairro || '',
        ger_pessoas_mae: pessoa?.ger_pessoas_mae || '',
        ger_localidades_id: pessoa?.ger_localidades_id || null
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && pessoa) {
            put(route('administracao.pessoas.update', pessoa.ger_pessoas_id));
        } else {
            post(route('administracao.pessoas.store'));
        }
    };
    console.log(pessoa);
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="ger_pessoas_nome">Nome *</Label>
                    <Input
                        id="ger_pessoas_nome"
                        value={data.ger_pessoas_nome}
                        onChange={e => setData('ger_pessoas_nome', e.target.value)}
                        required
                    />
                    {errors.ger_pessoas_nome && (
                        <p className="text-sm text-red-500">{errors.ger_pessoas_nome}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ger_pessoas_cns">CNS (Cartão Nacional do SUS)</Label>
                    <Input
                        id="ger_pessoas_cns"
                        value={data.ger_pessoas_cns}
                        onChange={e => setData('ger_pessoas_cns', e.target.value)}
                    />
                    {errors.ger_pessoas_cns && (
                        <p className="text-sm text-red-500">{errors.ger_pessoas_cns}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ger_pessoas_cpf">CPF *</Label>
                    <Input
                        id="ger_pessoas_cpf"
                        value={data.ger_pessoas_cpf || ''}
                        maxLength={11}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={e => {
                            // Remove tudo que não for número e limita a 11 caracteres
                            const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 11);
                            setData('ger_pessoas_cpf', onlyNums);
                        }}
                        required
                    />
                    {errors.ger_pessoas_cpf && (
                        <p className="text-sm text-red-500">{errors.ger_pessoas_cpf}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ger_pessoas_nascimento">Data de Nascimento</Label>
                    <Input
                        id="ger_pessoas_nascimento"
                        type="date"
                        value={data.ger_pessoas_nascimento}
                        onChange={e => setData('ger_pessoas_nascimento', e.target.value)}
                    />
                    {errors.ger_pessoas_nascimento && (
                        <p className="text-sm text-red-500">{errors.ger_pessoas_nascimento}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ger_pessoas_telefone1">WhatsApp/Número Principal</Label>
                    <Input
                        id="ger_pessoas_telefone1"
                        value={data.ger_pessoas_telefone1}
                        maxLength={11}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={e => {
                            // Remove tudo que não for número e limita a 11 caracteres
                            const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 11);
                            setData('ger_pessoas_telefone1', onlyNums);
                        }}
                    />
                    {errors.ger_pessoas_telefone1 && (
                        <p className="text-sm text-red-500">{errors.ger_pessoas_telefone1}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ger_pessoas_telefone2">Número Principal</Label>
                    <Input
                        id="ger_pessoas_telefone2"
                        value={data.ger_pessoas_telefone2 || ''}
                        maxLength={11}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={e => {
                            // Remove tudo que não for número e limita a 11 caracteres
                            const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 11);
                            setData('ger_pessoas_telefone2', onlyNums);
                        }}
                    />
                    {errors.ger_pessoas_telefone2 && (
                        <p className="text-sm text-red-500">{errors.ger_pessoas_telefone2}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ger_pessoas_endereco">Endereço</Label>
                    <Input
                        id="ger_pessoas_endereco"
                        value={data.ger_pessoas_endereco || ''}
                        onChange={e => setData('ger_pessoas_endereco', e.target.value)}
                    />
                    {errors.ger_pessoas_endereco && (
                        <p className="text-sm text-red-500">{errors.ger_pessoas_endereco}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ger_pessoas_endereco_n">Número da casa</Label>
                    <Input
                        id="ger_pessoas_endereco_n"
                        value={data.ger_pessoas_endereco_n || ''}
                        onChange={e => setData('ger_pessoas_endereco_n', e.target.value)}
                    />
                    {errors.ger_pessoas_endereco_n && (
                        <p className="text-sm text-red-500">{errors.ger_pessoas_endereco_n}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ger_pessoas_endereco_bairro">Bairro</Label>
                    <Input
                        id="ger_pessoas_endereco_bairro"
                        value={data.ger_pessoas_endereco_bairro || ''}
                        onChange={e => setData('ger_pessoas_endereco_bairro', e.target.value)}
                    />
                    {errors.ger_pessoas_endereco_bairro && (
                        <p className="text-sm text-red-500">{errors.ger_pessoas_endereco_bairro}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ger_pessoas_mae">Nome da Mãe</Label>
                    <Input
                        id="ger_pessoas_mae"
                        value={data.ger_pessoas_mae || ''}
                        onChange={e => setData('ger_pessoas_mae', e.target.value)}
                    />
                    {errors.ger_pessoas_mae && (
                        <p className="text-sm text-red-500">{errors.ger_pessoas_mae}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ger_pessoas_mae">Sexo</Label>
                    <Select
                        value={data?.ger_pessoas_sexo || 'masculino'}
                        onValueChange={(value) => setData('ger_pessoas_sexo', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key='masculino'
                                value='Masculino'>Masculino</SelectItem>
                            <SelectItem key='feminino'
                                value='Feminino'>Feminino</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ger_localidades_id">Localidade</Label>
                    <Select
                        value={data.ger_localidades_id?.toString() || ''}
                        onValueChange={(value) => setData('ger_localidades_id', value ? parseInt(value) : null)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione uma localidade" />
                        </SelectTrigger>
                        <SelectContent>
                            {localidades.map(localidade => (
                                <SelectItem
                                    key={localidade.ger_localidades_id}
                                    value={localidade.ger_localidades_id.toString()}
                                >
                                    {localidade.ger_localidades_nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.ger_localidades_id && (
                        <p className="text-sm text-red-500">{errors.ger_localidades_id}</p>
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
        </form>
    );
} 