import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Brain, CheckSquare, Video, Handshake, Megaphone } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: meetings, isLoading: meetingsLoading } = useQuery({
    queryKey: ["/api/meetings"],
  });

  const recentMeetings = meetings?.slice(0, 3) || [];

  const getTeamIcon = (teamName: string) => {
    switch (teamName?.toLowerCase()) {
      case 'sales':
        return <Handshake className="text-blue-600" size={20} />;
      case 'engineering':
        return <Video className="text-green-600" size={20} />;
      case 'marketing':
        return <Megaphone className="text-purple-600" size={20} />;
      default:
        return <Users className="text-gray-600" size={20} />;
    }
  };

  const getTeamColor = (teamName: string) => {
    switch (teamName?.toLowerCase()) {
      case 'sales':
        return 'bg-blue-100 text-blue-800';
      case 'engineering':
        return 'bg-green-100 text-green-800';
      case 'marketing':
        return 'bg-purple-100 text-purple-800';
      case 'product':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (statsLoading || meetingsLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass soft-shadow">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass soft-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Meetings</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stats?.totalMeetings || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calendar className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">↗ 12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass soft-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Action Items</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stats?.actionItems || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckSquare className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-orange-600">6 due today</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass soft-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">AI Queries</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stats?.aiQueries || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Brain className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">↗ 24% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass soft-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Team Activity</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stats?.teamActivity || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">Above target</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass soft-shadow">
          <CardHeader className="border-b border-white/30">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Recent Meetings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {recentMeetings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No meetings yet</p>
            ) : (
              recentMeetings.map((meeting: any) => (
                <div key={meeting.id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    {getTeamIcon(meeting.team?.name)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{meeting.title}</p>
                    <p className="text-sm text-gray-500">
                      {meeting.team?.name || 'General'} • {new Date(meeting.startTime).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation(`/meetings/${meeting.id}`)}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    View
                  </Button>
                </div>
              ))
            )}
            <div className="pt-4 border-t border-white/20">
              <Button
                variant="outline"
                onClick={() => setLocation('/meetings')}
                className="w-full"
              >
                View All Meetings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass soft-shadow">
          <CardHeader className="border-b border-white/30">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Pending Action Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {recentMeetings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No action items yet</p>
            ) : (
              recentMeetings
                .filter((meeting: any) => meeting.actionItems?.length > 0)
                .slice(0, 3)
                .map((meeting: any, index: number) => (
                  <div key={meeting.id} className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {meeting.actionItems[0]}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due today • {meeting.title}
                      </p>
                    </div>
                  </div>
                ))
            )}
            <div className="pt-4 border-t border-white/20">
              <Button
                variant="outline"
                onClick={() => setLocation('/ai-assistant')}
                className="w-full"
              >
                Ask AI Assistant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
