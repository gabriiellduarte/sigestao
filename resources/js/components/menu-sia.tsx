import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { Menu } from "@/types";

interface MenuSiaProps {
  item: Menu;
}

export function MenuSia({ item }: MenuSiaProps) {
  // Se não tem submenus ou submenus é vazio
  if (!item.submenus || item.submenus.length === 0) {
    return (
      <SidebarMenuItem key={item.nome}>
        <SidebarMenuButton asChild>
          <a href={item.prefixo_rota ? route(item.prefixo_rota) : "#"}>
            <span>{item.nome}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Se tem submenus
  return (
    <Collapsible key={item.nome} asChild className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.nome}>
            <span>{item.nome}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.submenus.map((subItem) => (
              <SidebarMenuSubItem key={subItem.nome}>
                <SidebarMenuSubButton asChild>
                  <a href={route(subItem.prefixo_rota)}>
                    <span>{subItem.nome}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
