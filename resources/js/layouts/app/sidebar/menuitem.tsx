import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MenuItem, SubMenuItem } from './itensmenu';
import { Link, usePage} from '@inertiajs/react';

interface SidebarMenuItemProps {
  item: MenuItem;
  isOpen: boolean;
  activeModule: string;
  isExpanded: boolean;
  onToggleExpanded: (itemId: string) => void;
  onModuleClick: (moduleId: string, moduleTitle: string, component: string) => void;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isOpen,
  activeModule,
  isExpanded,
  onToggleExpanded,
  onModuleClick
}) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const page = usePage();
  return (
    <Link href={item.link}>
      <button
        onClick={() => {
          if (hasSubItems) {
            onToggleExpanded(item.id);
          } else {
            onModuleClick(item.id, item.title, item.component);
          }
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
          page.url.startsWith(item.link)
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <item.icon className={`h-5 w-5 ${activeModule === item.id ? 'text-blue-600' : item.color}`} />
          {isOpen && (
            <span className="font-medium">{item.title}</span>
          )}
        </div>
        {isOpen && hasSubItems && (
          isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {hasSubItems && isExpanded && isOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {item.subItems!.map((subItem: SubMenuItem) => (
            <Link href={subItem.link}>
              <button
                key={subItem.id}
                onClick={() => onModuleClick(subItem.id, subItem.title, subItem.component)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeModule === subItem.id
                    ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <subItem.icon className="h-4 w-4" />
                <span className="font-medium">{subItem.title}</span>
              </button>
            </Link>
            
          ))}
        </div>
      )}
    </Link>
  );
};