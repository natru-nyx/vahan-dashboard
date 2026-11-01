import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MessageCircle, FileText, CheckSquare, User } from "lucide-react";
import type { MeetingWithTeam } from "@shared/schema";

export default function MeetingDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: meeting, isLoading } = useQuery<MeetingWithTeam>({
    queryKey: ["/api/meetings", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-gray-200 rounded-2xl"></div>
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500">Meeting not found</p>
          <Button onClick={() => setLocation('/meetings')} className="mt-4">
            Back to Meetings
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string | Date) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const actionItems = Array.isArray(meeting.actionItems) ? meeting.actionItems : [];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Meeting Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/meetings')}
              className="mr-4 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/40"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{meeting.title}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {formatDate(meeting.startTime)}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock size={16} className="mr-1" />
                  {formatTime(meeting.startTime)}
                </span>
                {meeting.team && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {meeting.team.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setLocation('/ai-assistant')}
          >
            <MessageCircle size={16} className="mr-2" />
            Ask Questions
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Meeting Summary */}
            <Card className="glass soft-shadow">
              <CardHeader className="border-b border-white/30 flex-row items-center">
                <FileText className="text-orange-500 mr-3" size={20} />
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Meeting Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700">
                  {meeting.summary || meeting.description || 'No summary available for this meeting.'}
                </p>
              </CardContent>
            </Card>

            {/* Transcript */}
            {meeting.transcript && (
              <Card className="glass soft-shadow">
                <CardHeader className="border-b border-white/30 flex-row items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle className="text-orange-500 mr-3" size={20} />
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      Transcript
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 h-96 overflow-y-auto custom-scrollbar">
                  <div className="whitespace-pre-wrap text-sm text-gray-700">
                    {meeting.transcript}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {/* Action Items */}
            <Card className="glass soft-shadow">
              <CardHeader className="border-b border-white/30 flex-row items-center">
                <CheckSquare className="text-orange-500 mr-3" size={20} />
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Action Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {actionItems.length > 0 ? (
                  actionItems.map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{item}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No action items identified
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Meeting Info */}
            <Card className="glass soft-shadow">
              <CardHeader className="border-b border-white/30 flex-row items-center">
                <User className="text-orange-500 mr-3" size={20} />
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Meeting Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-gray-800">
                    {meeting.createdAt ? new Date(meeting.createdAt).toLocaleDateString() : "—"}
                  </p>
                </div>
                {meeting.team && (
                  <div>
                    <p className="text-sm text-gray-500">Team</p>
                    <p className="text-gray-800">{meeting.team.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-gray-800">
                    {meeting.endTime ? 
                      `${Math.round((new Date(meeting.endTime).getTime() - new Date(meeting.startTime).getTime()) / (1000 * 60))} minutes` :
                      'Not specified'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
