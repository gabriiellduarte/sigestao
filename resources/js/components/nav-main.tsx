"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Menu } from "@/types"

export function NavMain({items}: {items: Menu[]}) {
  console.log("NavMain items2:", items);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Funções</SidebarGroupLabel>
      <SidebarMenu>
        {items?.map((item) => (
          <Collapsible
            key={item.nome}
            asChild
            /*defaultOpen={item.isActive}*/
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.nome}>
                  {/*item.icon && <item.icon />*/}
                  <span>{item.nome}</span>
                  {
                    item.submenus && item.submenus.length > 0 && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )
                  }
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.submenus?.map((subItem) => (
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
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
