import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType, SharedData } from '@/types';
import { Menu, Bell, User, Search, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { UserMenuContent } from '@/components/user-menu';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage<SharedData>().props;
    function sair(){
        router.visit('/logout',{method:'post'});
        //window.location.href = "/logout"
    }
    function abreConfiguracoes(){
        router.visit('/settings');
        //window.location.href = "/logout"
    }
    return (
        <header className="flex h-10 shrink-0 bg-white items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center space-x-2 justify-between gap-2 w-full">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                {/* Busca - oculta em mobile muito pequeno */}
                
                

                {/*<div className="flex items-center space-x-1 md:space-x-2">
                 Botão de busca para mobile
                    <Button variant="ghost" size="sm" className="sm:hidden">
                        <Search className="h-5 w-5 text-gray-600" />
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="relative">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" onClick={abreConfiguracoes} className="hidden md:flex">
                        <Settings className="h-5 w-5 text-gray-600" />
                    </Button>

                    <div className="flex items-center space-x-2 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-gray-200">
                        
                        <UserMenuContent user={auth.user}/>
                        
                        <Button variant="ghost" size="sm" onClick={sair} className="hidden md:flex">
                            <LogOut className="h-4 w-4 text-gray-600" />
                        </Button>
                    </div>
                </div>*/}
            </div>
        </header>

        
        
    );
}
