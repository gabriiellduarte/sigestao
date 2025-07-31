import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

export function ModulosSwitcher() {
    const { isMobile } = useSidebar();
    const { modulos } = usePage<PageProps>().props;
    const modulosArr = Object.values(modulos || {});

    if (!modulosArr.length) return null;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                {/*<activeTeam.logo className="size-4" />*/}
                                <img src="/imagens/brasao_branco.png" alt="Brasão" className="w-6 h-6 object-contain" />

                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-bold">SIA Gestão</span>
                                <span className="truncate text-xs">{modulosArr[0].nome}</span>
                            </div>
                            {modulosArr.length > 1 && (
                                <ChevronsUpDown className="ml-auto" />
                            )}

                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    {
                        modulosArr.length > 1 && (
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                align="start"
                                side={isMobile ? "bottom" : "right"}
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="text-muted-foreground text-xs">
                                    Módulos
                                </DropdownMenuLabel>
                                {modulosArr.map((modulo, index) => (
                                    <Link key={index} href={modulo.urlinicial || "#"}>
                                        <DropdownMenuItem
                                            key={modulo.nome}
                                            className="gap-2 p-2">
                                            {modulo.nome}
                                        </DropdownMenuItem>
                                    </Link>

                                ))}
                            </DropdownMenuContent>
                        )
                    }

                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
