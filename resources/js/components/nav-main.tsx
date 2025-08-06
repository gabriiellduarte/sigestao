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
import { MenuSia } from "@/components/menu-sia"

export function NavMain({items}: {items: Menu[]}) {
  console.log("NavMain items2:", items);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Funções</SidebarGroupLabel>
      <SidebarMenu>
        
        {items?.map((item) => (
          <MenuSia key={item.nome} item={item} />
          ))
        }
      </SidebarMenu>
    </SidebarGroup>
  )
}
