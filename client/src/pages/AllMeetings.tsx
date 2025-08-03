import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { CloudUpload, Calendar, Clock, Download, Trash2, User } from "lucide-react";

export default function AllMeetings() {
  const [, setLocation] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["/api/meetings"],
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["/api/teams"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/meetings/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      setSelectedFile(null);
      setSelectedTeam("");
      toast({
        title: "Success",
        description: "Meeting transcript uploaded and processed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload meeting transcript",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("transcript", selectedFile);
    if (selectedTeam) {
      formData.append("teamId", selectedTeam);
    }

    uploadMutation.mutate(formData);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-2xl mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Auto Transcript Info */}
      <Card className="glass soft-shadow mb-6">
        <CardContent className="p-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CloudUpload className="text-orange-600" size={32} />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800 mb-2">
              All Meetings
            </CardTitle>
            <p className="text-gray-500 mb-4">
              Upload transcripts to automatically detect and log meetings
            </p>
            <p className="text-sm text-gray-400">
              Supports .txt, .doc, .docx files
            </p>
            
            <div className="mt-6 space-y-4">
              {selectedFile && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-800">
                    Selected: {selectedFile.name}
                  </p>
                </div>
              )}
              
              <div className="flex gap-4 items-center justify-center">
                <Input
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium cursor-pointer"
                >
                  browse files
                </label>
                
                {teams && teams.length > 0 && (
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select team (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team: any) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {selectedFile && (
                  <Button
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meetings Table */}
      <Card className="glass soft-shadow">        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/30 hover:bg-transparent">
                  <TableHead className="text-gray-500 font-medium pl-6">Date</TableHead>
                  <TableHead className="text-gray-500 font-medium">Time</TableHead>
                  <TableHead className="text-gray-500 font-medium">Team</TableHead>
                  <TableHead className="text-gray-500 font-medium">Title</TableHead>
                  <TableHead className="text-gray-500 font-medium">Description</TableHead>
                  <TableHead className="text-gray-500 font-medium">Person</TableHead>
                  <TableHead className="text-gray-500 font-medium">Deadline</TableHead>
                  <TableHead className="text-gray-500 font-medium pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings && meetings.length > 0 ? (
                  meetings.map((meeting: any) => (
                    <TableRow
                      key={meeting.id}
                      className="hover:bg-white/20 transition-colors cursor-pointer border-b border-white/20"
                      onClick={() => setLocation(`/meetings/${meeting.id}`)}
                    >
                      <TableCell className="text-sm text-gray-600 pl-6">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          <span className="text-gray-500">{formatDate(meeting.startTime)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 text-gray-400" />
                          <span className="text-gray-500">{formatTime(meeting.startTime)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {meeting.team ? (
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              meeting.team.name.toLowerCase() === 'sales' ? 'bg-blue-400' :
                              meeting.team.name.toLowerCase() === 'engineering' ? 'bg-green-400' :
                              meeting.team.name.toLowerCase() === 'marketing' ? 'bg-purple-400' :
                              'bg-gray-400'
                            }`}></div>
                            <span className="text-gray-600">{meeting.team.name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-orange-600">
                        {meeting.title}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                        {meeting.description || meeting.summary || '-'}
                      </TableCell>
                      <TableCell>
                        <User size={16} className="text-gray-400" />
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        -
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600"
                            title="Download"
                          >
                            <Download size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-gray-500">
                        <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>No meetings uploaded yet</p>
                        <p className="text-sm">Upload a transcript to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
