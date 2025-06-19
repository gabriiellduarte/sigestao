import React from 'react';
import { Menu, Bell, User, Search, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type SharedData,Usuario } from '@/types';
import { usePage } from '@inertiajs/react';
import { UserMenuContent } from '@/components/user-menu-content';
import HeaderInfoUsuario from './header-infouser';


interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-4 z-50">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PM</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Sistema Gestor</h1>
            <p className="text-xs text-gray-500">Prefeitura Municipal</p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar processos, contratos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>
        <HeaderInfoUsuario/>
      </div>
    </header>
  );
};
