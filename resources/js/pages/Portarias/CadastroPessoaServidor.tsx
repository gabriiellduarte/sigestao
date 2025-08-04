import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function CadastroPessoaServidor() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState<string|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await router.post(route('documentos.portarias.cadastro-servidor'), { nome, cpf }, {
        onSuccess: () => {
          //setSuccess('Cadastro realizado com sucesso!');
          //setNome('');
          //setCpf('');
        },
        onError: (errors: any) => {
          setError(errors?.nome || errors?.cpf || 'Erro ao cadastrar.');
        },
        onFinish: () => setLoading(false),
      });
    } catch (e) {
      setError('Erro inesperado ao cadastrar.');
      setLoading(false);
    }
  };

  return (
    <AppLayout>
        <Card className="m-4">
            <CardHeader>
                <h2 className="text-lg font-semibold">Cadastrar Pessoa/Servidor</h2>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <Input value={nome} onChange={e => setNome(e.target.value)} required placeholder="Nome completo" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">CPF</label>
                    <Input value={cpf} onChange={e => setCpf(e.target.value)} required placeholder="CPF" />
                </div>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">{success}</div>}
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                </form>  
            </CardContent>
        </Card>
      
    </AppLayout>
  );
}
