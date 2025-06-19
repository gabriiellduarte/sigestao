import { 
    LayoutDashboard, 
    DollarSign, 
    FileText, 
    Shield, 
    Package, 
    Clipboard,
    Users,
    Settings,
    BarChart3,
    Calendar,
    Plus,
    CalendarCheck,
    FolderOpen,
    List,
    LayoutGrid
  } from 'lucide-react';
  import { type NavItem } from '@/types';
  
  export interface SubMenuItem {
    id: string;
    title: string;
    icon: any;
    component: string;
    link:string;
  }
  
  export interface MenuItem {
    id: string;
    title: string;
    icon: any;
    component: string;
    color: string;
    subItems?: SubMenuItem[];
    link:string;
  }
  
  export const menuItems: NavItem[] = [
    {
      title: 'DashBoard',
      href: '/',
      icon: LayoutDashboard
    },
    {
      title: 'Atendimentos',
      href: '/regulacao/listaatendimentos',
      icon: Clipboard
    }
  ];
  
  export const adminItems: MenuItem[] = [
    {
      id: 'usuarios',
      title: 'Usuários',
      icon: Users,
      component: 'Usuarios',
      color: 'text-gray-600',
      link:'tasks'
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      icon: BarChart3,
      component: 'Relatorios',
      color: 'text-gray-600',
      link:'tasks'
    },
    {
      id: 'logs',
      title: 'Logs',
      icon: Calendar,
      component: 'Logs',
      color: 'text-gray-600',
      link:'tasks'
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      icon: Settings,
      component: 'Configuracoes',
      color: 'text-gray-600',
      link:'tasks'
    }
  ];