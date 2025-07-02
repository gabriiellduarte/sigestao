import { Head, router, useForm,usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}
interface FlashProps {
    flash?: {
      message?: string;
    };
    [key: string]: unknown;
  }
export default function Login({ status, canResetPassword}: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [customErrors, setCustomErrors] = useState<{ email?: string }>({});

    const { flash } = usePage<FlashProps>().props;
    useEffect(() => {
        if (flash?.message) {
          setCustomErrors({ email: flash.message });
        }
      }, [flash?.message]);


    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onError: (errors) => {
                // O erro já será mostrado automaticamente pelo Inertia
                console.log('Erro de login:', errors);
            },
            onFinish: () => reset('password'),
        });
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        window.location.href = route('google.login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <img src='imagens/logo-horizontal-preta.png' className='max-w-8/12'></img>
                    
                </div>

                <Card className="shadow-lg border-0">
                    
                    
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {(errors.email || customErrors.email) && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.email || customErrors.email}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="usuario@prefeitura.gov.br"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                        Esqueceu a senha?
                                    </TextLink>
                                )}
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Digite sua senha"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        className="h-11 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <Label htmlFor="remember" className="text-sm text-gray-600">
                                        Lembrar-me
                                    </Label>
                                </div>
                                
                                {canResetPassword && (
                                    <TextLink
                                        href={route('password.request')}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        Esqueci minha senha
                                    </TextLink>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={processing}
                            >
                                {processing ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">ou</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full mt-4 h-11"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                {isLoading ? 'Conectando...' : 'Entrar com Google'}
                            </Button>
                            v2.0.3
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>© 2025 Prefeitura Municipal do Aracati. Todos os direitos reservados.</p>
                    <p className="mt-1">
                        Para suporte técnico, entre em contato: 
                        <a href="mailto:suporte@prefeitura.gov.br" className="text-blue-600 hover:underline ml-1">
                            nuti@aracati.ce.gov.br
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
