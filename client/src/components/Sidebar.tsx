import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Brain, Calendar, MessageSquare, Settings, BarChart3 } from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const { data: teams = [] } = useQuery({
    queryKey: ["/api/teams"],
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare, path: '/ai-assistant' },
    { id: 'all-meetings', label: 'All Meetings', icon: Calendar, path: '/meetings' },
    { id: 'admin-panel', label: 'Admin Panel', icon: Settings, path: '/admin' },
  ];

  const getTeamColor = (color: string) => {
    const colors = {
      'blue': 'bg-blue-400',
      'green': 'bg-green-400',
      'purple': 'bg-purple-400',
      'yellow': 'bg-yellow-400',
    };
    return colors[color as keyof typeof colors] || 'bg-gray-400';
  };

  const getTeamBadgeColor = (color: string) => {
    const colors = {
      'blue': 'bg-blue-100 text-blue-800',
      'green': 'bg-green-100 text-green-800',
      'purple': 'bg-purple-100 text-purple-800',
      'yellow': 'bg-yellow-100 text-yellow-800',
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass border-r border-white/50 z-40">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-3">
            <Brain className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Vahan</h1>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-2 mb-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => setLocation(item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-white/40 transition-colors ${
                  isActive ? 'nav-item active bg-white/50 text-orange-600' : ''
                }`}
              >
                <Icon size={20} className="mr-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Teams Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Teams
          </h3>
          <div className="space-y-1">
            {teams?.map((team: any) => (
              <button
                key={team.id}
                onClick={() => setLocation(`/teams/${team.id}`)}
                className="w-full flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-white/30 transition-colors"
              >
                <div className={`w-3 h-3 ${getTeamColor(team.color)} rounded-full mr-3`}></div>
                <span className="flex-1 text-left">{team.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getTeamBadgeColor(team.color)}`}>
                  3
                </span>
              </button>
            )) || (
              <p className="text-sm text-gray-500 px-4 py-2">No teams yet</p>
            )}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/30">
        <div className="flex items-center">
          <img
            src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"}
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              {user?.firstName || user?.email || 'User'}
            </p>
            <p className="text-xs text-gray-500">Team Member</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = "/api/logout"}
            className="text-gray-400 hover:text-gray-600"
          >
            ⋯
          </Button>
        </div>
      </div>
    </div>
  );
}
