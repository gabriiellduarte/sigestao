import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, HomeIcon, UsersIcon, ClipboardListIcon, Building2, Briefcase, UserCircle, ScrollText, Car } from 'lucide-react';
import AppLogo from './app-logo';

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
        permissions: 'portarias.visualizar'
    },
    {
        title: 'Administração',
        href: 'administracao',
        icon: Building2,
        permissions: 'acessar sistema',
        children: [
            {
                title: 'Servidores',
                href: '/administracao/servidores',
                icon: UserCircle,
                permissions: 'acessar sistema'
            },
            {
                title: 'Logs',
                href: '/administracao/logs',
                icon: UserCircle,
                permissions: 'acessar sistema'
            },
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
        title:'Passeios de Buggy',
        href:'#',
        icon: Car,
        permissions: 'buggy.visualizar',
        children:[
            {
                title: 'DashBoard',
                href:'/bugueiros/dashboard',
                permissions:'buggy.dashboard'
            },
            {
                title: 'Fila de Bugueiros',
                href:'/bugueiros/filas',
                permissions:'buggy.dashboard'
            },
            {
                title: 'Bugueiros',
                href:'/bugueiros/cadastro',
                permissions:'buggy.dashboard'
            },
            {
                title: 'Passeios',
                href:'/bugueiros/passeios',
                permissions:'buggy.dashboard'
            },
            {
                title: 'Tipos de Passeios',
                href:'/bugueiros/tipodepasseio',
                permissions:'buggy.dashboard'
            },
            {
                title: 'Parceiros',
                href: '/bugueiros/parceiros',
                icon: UserCircle,
                permissions: 'acessar sistema'
            },
            {
                title: 'Crachá',
                href: '/cracha',
                icon: UserCircle,
                permissions: 'acessar sistema'
            }
        ]
    },
    {
        title: 'Regulação',
        href: 'regulacao',
        icon: ClipboardListIcon,
        permissions: 'regulacao.dashboard.visualizar',
        children: [
            {
                title: 'Dashboard',
                href: '/regulacao/dashboard',
                permissions: 'regulacao.dashboard.visualizar'
            },
            {
                title: 'Lista de Atendimentos',
                href: '/regulacao/atendimentos',
                permissions: 'regulacao.atendimentos.visualizar'
            },
            {
                title: 'Agendamentos',
                href: '/regulacao/agendamentos',
                permissions: 'regulacao.agendamentos.visualizar'
            },
            {
                title: 'Pacientes',
                href: '/regulacao/pacientes',
                permissions: 'regulacao.pacientes.visualizar'
            },
            {
                title: 'Grupos de Procedimentos',
                href: '/regulacao/grupoprocedimentos',
                permissions: 'regulacao.gprocedimentos.visualizar'
            },
            {
                title: 'Procedimentos',
                href: '/regulacao/procedimentos',
                permissions: 'regulacao.procedimentos.visualizar'
            },
            {
                title: 'Médicos',
                href: '/regulacao/medicos',
                permissions: 'acessar sistema'
            },
            {
                title: 'Unidades de Saúde',
                href: '/regulacao/unidadessaude',
                permissions: 'acessar sistema'
            },
            {
                title: 'ACS',
                href: '/regulacao/acs',
                permissions: 'acessar sistema'
            },
            {
                title: 'Tipos de Atendimento',
                href: '/regulacao/tiposatendimento',
                permissions: 'acessar sistema'
            }
        ]
    }
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
