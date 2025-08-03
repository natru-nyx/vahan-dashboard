import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, FileText, Trash2, Settings, Activity } from "lucide-react";

export default function AdminPanel() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents } = useQuery({
    queryKey: ["/api/documents"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/documents", {
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
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setSelectedFile(null);
      toast({
        title: "Success",
        description: "Document uploaded successfully to knowledge base",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete document",
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
    formData.append("document", selectedFile);
    uploadMutation.mutate(formData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return 'fas fa-file-pdf text-red-500';
    if (mimeType.includes('word')) return 'fas fa-file-word text-blue-500';
    if (mimeType.includes('text')) return 'fas fa-file-alt text-gray-500';
    return 'fas fa-file text-gray-500';
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Base Upload */}
        <Card className="glass soft-shadow">
          <CardHeader className="border-b border-white/30">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Upload Knowledge Base Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center bg-orange-50/50 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CloudUpload className="text-orange-600" size={24} />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Drag & drop files here</h4>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
              
              <div className="space-y-4">
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
                    accept=".pdf,.txt,.docx,.doc"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="document-upload"
                  />
                  <label
                    htmlFor="document-upload"
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium cursor-pointer"
                  >
                    Select Files
                  </label>
                  
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
              
              <p className="text-xs text-gray-400 mt-3">
                Supported: PDF, TXT, DOCX (Max 10MB)
              </p>
            </div>

            {/* Uploaded Files */}
            <div className="space-y-3">
              {documents && documents.length > 0 ? (
                documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 glass rounded-lg border border-white/50">
                    <div className="flex items-center">
                      <FileText className="text-red-500 mr-3" size={20} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{doc.filename}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded {new Date(doc.createdAt).toLocaleDateString()} • {formatFileSize(doc.fileSize)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="glass soft-shadow">
          <CardHeader className="border-b border-white/30">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <Activity className="mr-3" size={20} />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* AI Processing Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">AI Processing</span>
                <span className="text-sm text-green-600 font-medium">Online</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            {/* Document Processing Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Document Processing</span>
                <span className="text-sm text-orange-600 font-medium">Processing</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• {documents?.length || 0} documents in knowledge base</div>
                <div>• {stats?.aiQueries || 0} questions answered today</div>
                <div>• Knowledge base updated recently</div>
                <div>• {stats?.totalMeetings || 0} meetings processed</div>
              </div>
            </div>

            {/* System Health */}
            <div className="pt-4 border-t border-white/20">
              <h4 className="text-sm font-medium text-gray-700 mb-3">System Health</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-lg font-semibold text-green-600">98%</p>
                  <p className="text-xs text-green-700">Uptime</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-lg font-semibold text-blue-600">{stats?.totalMeetings || 0}</p>
                  <p className="text-xs text-blue-700">Meetings</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
