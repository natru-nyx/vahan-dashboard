import { Button } from "@/components/ui/button";
import { Bell, Search, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  onMobileMenuClick?: () => void;
}

export default function Header({ title, onMobileMenuClick }: HeaderProps) {
  return (
    <header className="glass border-b border-white/30 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileMenuClick}
          className="lg:hidden mr-4 text-gray-600"
        >
          <Menu size={20} />
        </Button>
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
          <Search size={20} />
        </Button>
      </div>
    </header>
  );
}
