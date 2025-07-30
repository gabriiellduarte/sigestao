import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  Car,
  ClipboardListIcon,
  Command,
  Frame,
  GalleryVerticalEnd,
  HomeIcon,
  Map,
  PieChart,
  ScrollText,
  Settings2,
  SquareTerminal,
  UserCircle,
  Users2Icon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavItem, PageProps, User } from "@/types"
import { usePage } from "@inertiajs/react"
import { ModulosSwitcher } from "./modulos-switcher"

const mainNavItems = {
    navMain:[
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: HomeIcon,
        permissions: 'acessar sistema'
    },
    {
        title: 'Usuários',
        url: '/users',
        icon: Users2Icon,
        permissions: 'gerenciar usuários'
    },
    {
        title: 'Portarias',
        url: '/documentos/portarias',
        icon: ScrollText,
        permissions: 'portarias.visualizar'
    },
    {
        title: 'Administração',
        url: 'administracao',
        icon: Building2,
        permissions: 'acessar sistema',
        items: [
            {
                title: 'Servidores',
                url: '/administracao/servidores',
                icon: UserCircle,
                permissions: 'acessar sistema'
            },
            {
                title: 'Logs',
                url: '/administracao/logs',
                icon: UserCircle,
                permissions: 'acessar sistema'
            },
            {
                title: 'Pessoas',
                url: '/administracao/pessoas',
                icon: UserCircle,
                permissions: 'acessar sistema'
            },
            {
                title: 'Cargos',
                url: '/administracao/cargos',
                icon: Briefcase,
                permissions: 'acessar sistema'
            },
            {
                title: 'Localidades',
                url: '/administracao/localidades',
                permissions: 'acessar sistema'
            },
            {
                title: 'Secretarias',
                url: '/administracao/secretarias',
                icon: Building2,
                permissions: 'acessar sistema'
            }
        ]
    },
    {
        title:'Passeios de Buggy',
        url:'#',
        icon: Car,
        permissions: 'buggy.visualizar',
        items:[
            {
                title: 'DashBoard',
                url:'/bugueiros/dashboard',
                permissions:'buggy.dashboard'
            },
            {
                title: 'Fila de Bugueiros',
                url:'/bugueiros/filas',
                permissions:'buggy.dashboard'
            },
            {
                title: 'Bugueiros',
                url:'/bugueiros/cadastro',
                permissions:'buggy.dashboard'
            },
            {
                title: 'Passeios',
                url:'/bugueiros/passeios',
                permissions:'buggy.dashboard'
            },
            {
                title: 'Tipos de Passeios',
                url:'/bugueiros/tipodepasseio',
                permissions:'buggy.dashboard'
            },
            {
                title: 'Parceiros',
                url: '/bugueiros/parceiros',
                icon: UserCircle,
                permissions: 'acessar sistema'
            },
            {
                title: 'Crachá',
                url: '/cracha',
                icon: UserCircle,
                permissions: 'acessar sistema'
            }
        ]
    },
    {
        title: 'Regulação',
        url: 'regulacao',
        icon: ClipboardListIcon,
        permissions: 'regulacao.dashboard.visualizar',
        items: [
            {
                title: 'Dashboard',
                url: '/regulacao/dashboard',
                permissions: 'regulacao.dashboard.visualizar'
            },
            {
                title: 'Lista de Atendimentos',
                url: '/regulacao/atendimentos',
                permissions: 'regulacao.atendimentos.visualizar'
            },
            {
                title: 'Agendamentos',
                url: '/regulacao/agendamentos',
                permissions: 'regulacao.agendamentos.visualizar'
            },
            {
                title: 'Pacientes',
                url: '/regulacao/pacientes',
                permissions: 'regulacao.pacientes.visualizar'
            },
            {
                title: 'Grupos de Procedimentos',
                url: '/regulacao/grupoprocedimentos',
                permissions: 'regulacao.gprocedimentos.visualizar'
            },
            {
                title: 'Procedimentos',
                url: '/regulacao/procedimentos',
                permissions: 'regulacao.procedimentos.visualizar'
            },
            {
                title: 'Médicos',
                url: '/regulacao/medicos',
                permissions: 'acessar sistema'
            },
            {
                title: 'Unidades de Saúde',
                url: '/regulacao/unidadessaude',
                permissions: 'acessar sistema'
            },
            {
                title: 'ACS',
                url: '/regulacao/acs',
                permissions: 'acessar sistema'
            },
            {
                title: 'Tipos de Atendimento',
                url: '/regulacao/tiposatendimento',
                permissions: 'acessar sistema'
            }
        ]
    }
]};
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Teste",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const propss = usePage<PageProps>().props;
    console.log("props", propss);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ModulosSwitcher/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={propss.modulos} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={propss.auth.user as any} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
