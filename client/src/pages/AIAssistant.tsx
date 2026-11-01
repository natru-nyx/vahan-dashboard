import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, Plus, MessageSquare } from "lucide-react";
import type { ChatSession, ChatMessage } from "@shared/schema";

export default function AIAssistant() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions } = useQuery<ChatSession[]>({
    queryKey: ["/api/chat/sessions"],
  });

  const { data: messages } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/sessions", selectedSessionId, "messages"],
    enabled: !!selectedSessionId,
  });

  const createSessionMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/chat/sessions", { name });
      return response.json();
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/sessions"] });
      setSelectedSessionId(session.id);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ sessionId, content }: { sessionId: string; content: string }) => {
      const response = await apiRequest("POST", `/api/chat/sessions/${sessionId}/messages`, {
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/chat/sessions", selectedSessionId, "messages"] 
      });
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleNewChat = () => {
    createSessionMutation.mutate("New Chat Session");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedSessionId) return;

    sendMessageMutation.mutate({
      sessionId: selectedSessionId,
      content: message,
    });
  };

  const currentSession = sessions?.find((s: any) => s.id === selectedSessionId);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="glass soft-shadow h-[600px] flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b border-white/30 flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                AI Assistant
              </CardTitle>
              <p className="text-sm text-gray-500">
                Ask questions about meetings, documents, and team activities
              </p>
            </div>
            <Button 
              onClick={handleNewChat}
              disabled={createSessionMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus size={16} className="mr-2" />
              New Chat
            </Button>
          </CardHeader>

          {/* Chat Sessions */}
          {sessions && sessions.length > 0 && (
            <div className="px-6 py-4 border-b border-white/30">
              <div className="flex items-center space-x-4 overflow-x-auto">
                {sessions.map((session: any) => (
                  <Button
                    key={session.id}
                    variant={selectedSessionId === session.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`whitespace-nowrap ${
                      selectedSessionId === session.id 
                        ? 'bg-orange-100 text-orange-800 border-orange-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {session.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
            {!selectedSessionId ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Welcome to AI Assistant
                </h3>
                <p className="text-gray-400 mb-4">
                  Start a new chat to ask questions about your meetings and documents
                </p>
                <Button onClick={handleNewChat} className="bg-orange-500 hover:bg-orange-600">
                  Start New Chat
                </Button>
              </div>
            ) : !messages || messages.length === 0 ? (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <div className="glass rounded-2xl rounded-bl-md p-4">
                    <p className="text-gray-800">
                      Hello! I'm your AI assistant. I can help you with questions about your meetings, 
                      action items, and uploaded documents. What would you like to know?
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-xs lg:max-w-md">
                    <div
                      className={`rounded-2xl p-4 ${
                        msg.isUser
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md'
                          : 'glass rounded-bl-md border border-white/50'
                      }`}
                    >
                      <p className={msg.isUser ? 'text-white' : 'text-gray-800'}>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-white/30">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything about your meetings..."
                disabled={!selectedSessionId || sendMessageMutation.isPending}
                className="flex-1 glass border-white/50 focus:ring-orange-500"
              />
              <Button
                type="submit"
                disabled={!message.trim() || !selectedSessionId || sendMessageMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Send size={16} />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
