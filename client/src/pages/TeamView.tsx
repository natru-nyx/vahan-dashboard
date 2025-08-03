import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function TeamView() {
  const { teamId } = useParams();

  const { data: meetings, isLoading } = useQuery({
    queryKey: ["/api/meetings", { teamId }],
    enabled: !!teamId,
  });

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const team = teams?.find((t: any) => t.id === teamId);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {team?.name || 'Team'} - Meeting Summaries
          </h2>
        </div>
        <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          Last updated: 2 hours ago
        </div>
      </div>

      <Card className="glass soft-shadow h-96 flex items-center justify-center">
        <CardContent className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-blue-600" size={32} />
          </div>
          <p className="text-gray-500">
            {meetings && meetings.length > 0 
              ? `${meetings.length} meetings found for this team.`
              : 'No meetings found for this team.'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
