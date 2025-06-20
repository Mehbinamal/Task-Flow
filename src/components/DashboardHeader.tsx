
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  CheckSquare, 
  Calendar, 
  Timer, 
  BarChart3, 
  Repeat, 
  Heart as HeartIcon, 
  Moon,
  Menu,
  X,
  Settings,
  LogOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from './ModeToggle';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  activeView: 'tasks' | 'schedule' | 'focus' | 'analytics' | 'routines' | 'wellness' | 'summary';
  setActiveView: (view: 'tasks' | 'schedule' | 'focus' | 'analytics' | 'routines' | 'wellness' | 'summary') => void;
}

export const DashboardHeader = ({ activeView, setActiveView }: DashboardHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'wellness', label: 'Wellness', icon: HeartIcon },
    { id: 'routines', label: 'Routines', icon: Repeat },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'summary', label: 'Summary', icon: Moon },
  ] as const;

  const handleLogout = () => {
    navigate('/');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    toast.success('Logged out successfully');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <header className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView(item.id as any)}
                  className={`flex items-center space-x-2 ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <ModeToggle />
            
            {/* User Avatar with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 text-white text-sm">
                    U
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-slate-700 py-2">
            <nav className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setActiveView(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-start space-x-2 ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white' 
                        : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
