import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

interface TipoPasseio {
    id: string;
    nome: string;
    descricao: string;
    duracao: number;
    preco: number;
    ativo: boolean;
  }

interface GrupoProcedimento {
    reg_gpro_id: number;
    reg_gpro_nome: string;
  }

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    permissions?: string | string[];
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export interface Usuario {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface ModuloMenu {
    nome: string;
    prefixo: string;
    urlinicial?: string;
    menus: NavItem[];
}

export interface Modulos {
    [key: string]: ModuloMenu;
}
export interface Menu{
    nome: string;
    prefixo_rota: string;
    submenus?: Menu[];
}

export interface PageProps {
    auth: {
        user: User;
    };
    errors: {
        [key: string]: string;
    };
    flash: {
        message?: string;
        success?: string;
        error?: string;
    };
    ziggy: {
        location: string;
        url: string;
        port: number | null;
        defaults: Record<string, any>;
        routes: Record<string, string>;
    };
    modulos: Modulos;
    moduloatual: string;
    [key: string]: any;
}
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    permissions?: string[];
    roles?: string[];
} 

export interface Parceiro {
  id: number;
  nome: string;
  contato: string;
  created_at?: string;
  updated_at?: string;
} 