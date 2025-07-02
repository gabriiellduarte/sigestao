import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomPageProps extends PageProps {
    auth: {
        can: {
            [key: string]: boolean;
        };
    };
}

export function NavMain({ items = [], ...props }: { items: NavItem[] }) {
    const { auth } = usePage<CustomPageProps>().props;
    const page = usePage();
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const hasPermission = (permissions: string | string[] | undefined) => {
        if (!permissions) return true;
        if (auth.can['Super Administrador']) return true;
        
        const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
        return requiredPermissions.some(permission => auth.can[permission]);
    };

    const toggleExpand = (title: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    useEffect(() => {
        const newExpandedItems: Record<string, boolean> = {};
        
        items.forEach(item => {
            if (item.children) {
                const shouldExpand = page.url.includes(item.href.replace('#', ''));
                if (shouldExpand) {
                    newExpandedItems[item.title] = true;
                }
            }
        });

        setExpandedItems(prev => ({
            ...prev,
            ...newExpandedItems
        }));
    }, [page.url, items]);

    const filteredItems = items.filter(item => hasPermission(item.permissions));
    console.info(items);
    console.info('page', page);
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Módulos</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <div className="flex items-center justify-between">
                            {item.children && item.children.length > 0 ? (
                                <SidebarMenuButton
                                    isActive={page.url.startsWith(item.href)}
                                    tooltip={{ children: item.title }}
                                    onClick={() => toggleExpand(item.title)}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                            {item.children && item.children.length > 0 && (
                                <button
                                    onClick={() => toggleExpand(item.title)}
                                    className="p-1 hover:bg-accent rounded-md"
                                >
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${
                                            expandedItems[item.title] ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                            )}
                        </div>
                        {item.children && item.children.length > 0 && expandedItems[item.title] && (
                            <SidebarMenu className="ml-4">
                                {item.children
                                    .filter(child => hasPermission(child.permissions))
                                    .map((child) => (
                                        <SidebarMenuItem key={child.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={page.url.startsWith(child.href)}
                                                tooltip={{ children: child.title }}
                                            >
                                                <Link href={child.href} prefetch>
                                                    <span>{child.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                            </SidebarMenu>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
