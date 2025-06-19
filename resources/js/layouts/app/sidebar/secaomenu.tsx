import React from 'react';
import { SidebarMenuItem } from './menuitem';
import { MenuItem } from './itensmenu';

interface SidebarMenuSectionProps {
  title: string;
  items: MenuItem[];
  isOpen: boolean;
  activeModule: string;
  expandedItems: string[];
  onToggleExpanded: (itemId: string) => void;
  onModuleClick: (moduleId: string, moduleTitle: string, component: string) => void;
}

export const SidebarMenuSection: React.FC<SidebarMenuSectionProps> = ({
  title,
  items,
  isOpen,
  activeModule,
  expandedItems,
  onToggleExpanded,
  onModuleClick
}) => {
  return (
    <div className="space-y-1">
      <div className={`${isOpen ? 'block' : 'hidden'} text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3`}>
        {title}
      </div>
      
      {items.map((item) => (
        <SidebarMenuItem
          key={item.id}
          item={item}
          isOpen={isOpen}
          activeModule={activeModule}
          isExpanded={expandedItems.includes(item.id)}
          onToggleExpanded={onToggleExpanded}
          onModuleClick={onModuleClick}
        />
      ))}
    </div>
  );
};
