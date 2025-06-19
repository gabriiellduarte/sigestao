import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';


export function HeaderInfoUsuario(){
    return(
        <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">user</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <Button variant="ghost" size="sm">
            <LogOut className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
    )
}

export default HeaderInfoUsuario