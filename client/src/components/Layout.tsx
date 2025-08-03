import { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = (path: string) => {
    const titles: Record<string, string> = {
      '/': 'Dashboard',
      '/ai-assistant': 'AI Assistant',
      '/meetings': 'All Meetings',
      '/admin': 'Admin Panel',
    };

    if (path.startsWith('/meetings/')) return 'Meeting Details';
    if (path.startsWith('/teams/')) return 'Team View';
    
    return titles[path] || 'Dashboard';
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <Header 
          title={getPageTitle(location)} 
          onMobileMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
