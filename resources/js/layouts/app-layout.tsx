import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const page = usePage();
    const flash = page.props.flash;

    useEffect(() => {
        if (flash && typeof flash === 'object') {
            if ('erro' in flash && typeof flash.erro === 'string' && flash.erro) {
                toast.error(flash.erro);
            }
            if ('sucesso' in flash && typeof flash.sucesso === 'string' && flash.sucesso) {
                toast.success(flash.sucesso);
            }
        }
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
}
