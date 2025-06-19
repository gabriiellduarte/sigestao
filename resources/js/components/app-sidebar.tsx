import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, HomeIcon, UsersIcon, ClipboardListIcon, Building2, Briefcase, UserCircle, ScrollText } from 'lucide-react';
import AppLogo from './app-logo';
import { menuItems }  from '@/layouts/app/sidebar/itensmenu'

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
        permissions: 'acessar sistema'
    },
    {
        title: 'Usuários',
        href: '/users',
        icon: UsersIcon,
        permissions: 'gerenciar usuários'
    },
    {
        title: 'Portarias',
        href: '/documentos/portarias',
        icon: ScrollText,
        permissions: 'gerenciar usuários'
    },
    {
        title: 'Administração',
        href: 'administracao',
        icon: Building2,
        permissions: 'acessar sistema',
        children: [
            {
                title: 'Pessoas',
                href: '/administracao/pessoas',
                icon: UserCircle,
                permissions: 'acessar sistema'
            },
            {
                title: 'Cargos',
                href: '/administracao/cargos',
                icon: Briefcase,
                permissions: 'acessar sistema'
            },
            {
                title: 'Localidades',
                href: '/administracao/localidades',
                permissions: 'acessar sistema'
            },
            {
                title: 'Secretarias',
                href: '/administracao/secretarias',
                icon: Building2,
                permissions: 'acessar sistema'
            }
        ]
    },
    {
        title: 'Regulação',
        href: 'regulacao',
        icon: ClipboardListIcon,
        permissions: 'acessar sistema',
        children: [
            {
                title: 'Lista de Atendimentos',
                href: '/regulacao/listaatendimentos',
                permissions: 'acessar sistema'
            },
            {
                title: 'Pacientes',
                href: '/regulacao/pacientes',
                permissions: 'acessar sistema'
            }
        ]
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>


        
        </Sidebar>
    );
}
