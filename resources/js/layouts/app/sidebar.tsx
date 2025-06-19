import React, { useState } from 'react';
import { SidebarMenuSection } from './sidebar/secaomenu';
import { menuItems, adminItems } from './sidebar/itensmenu';

interface SidebarProps {
  isOpen: boolean;
  activeModule: string;
  onModuleClick: (moduleId: string, moduleTitle: string, component: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeModule, onModuleClick }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['regulacao']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className={`fixed left-0 top-16 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
      isOpen ? 'w-64' : 'w-0 md:w-16'
    } overflow-hidden`}>
      <div className="p-4 h-full overflow-y-auto">
        {/* Módulos Principais */}
        <SidebarMenuSection
          title="Módulos"
          items={menuItems}
          isOpen={isOpen}
          activeModule={activeModule}
          expandedItems={expandedItems}
          onToggleExpanded={toggleExpanded}
          onModuleClick={onModuleClick}
        />

        {/* Separador */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Administração */}
        <SidebarMenuSection
          title="Administração"
          items={adminItems}
          isOpen={isOpen}
          activeModule={activeModule}
          expandedItems={expandedItems}
          onToggleExpanded={toggleExpanded}
          onModuleClick={onModuleClick}
        />
      </div>
    </div>
  );
};
