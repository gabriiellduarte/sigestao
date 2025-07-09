import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem as BaseNavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

// Extende NavItem para aceitar permissions
interface NavItem extends BaseNavItem {
    permissions?: string | string[];
}

const sidebarNavItems: NavItem[] = [
    {
        title: 'Meu Perfil',
        href: '/settings/profile',
        icon: null,
    },
    {
        title: 'Senha',
        href: '/settings/password',
        icon: null,
    },
    {
        title: 'Aparência',
        href: '/settings/appearance',
        icon: null,
        permissions: ['Super Administrador'],
    },
    {
        title: 'Usuários',
        href: '/users',
        icon: null,
        permissions: ['Super Administrador'],
    },
    {
        title: 'Permissões',
        href: '/permissions',
        icon: null,
        permissions: ['Super Administrador'],
    },
    {
        title: 'Funções',
        href: '/roles',
        icon: null,
        permissions: ['Super Administrador'],
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;
    const { auth } = usePage().props as any;
    const userPermissions = auth?.user?.permissions || [];
    const isSuperAdmin = userPermissions.includes('Super Administrador');

    // Função de permissão igual ao nav-main
    const hasPermission = (permissions: string | string[] | undefined) => {
        if (!permissions) return true;
        if (isSuperAdmin) return true;
        const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
        return requiredPermissions.some(permission => auth.can[permission]);
    };

    return (
        <div className="px-4 py-6">
            <Heading title="Configurações" description="Gerencie a sua conta" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems
                            .filter(item => hasPermission(item.permissions))
                            .map((item, index) => (
                                <Button
                                    key={`${item.href}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        'bg-muted': currentPath === item.href,
                                    })}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1">
                    <section className="space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
