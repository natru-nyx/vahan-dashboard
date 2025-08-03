import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { summarizeMeetingTranscript, answerQuestionWithContext, analyzeDocument } from "./gemini";
import { insertMeetingSchema, insertChatSessionSchema, insertChatMessageSchema, insertDocumentSchema, insertTeamSchema } from "@shared/schema";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Teams routes
  app.get("/api/teams", isAuthenticated, async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.post("/api/teams", isAuthenticated, async (req, res) => {
    try {
      const teamData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(teamData);
      res.json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ message: "Failed to create team" });
    }
  });

  // Meetings routes
  app.get("/api/meetings", isAuthenticated, async (req, res) => {
    try {
      const { teamId } = req.query;
      const meetings = teamId 
        ? await storage.getMeetingsByTeam(teamId as string)
        : await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ message: "Failed to fetch meetings" });
    }
  });

  app.get("/api/meetings/:id", isAuthenticated, async (req, res) => {
    try {
      const meeting = await storage.getMeeting(req.params.id);
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }
      res.json(meeting);
    } catch (error) {
      console.error("Error fetching meeting:", error);
      res.status(500).json({ message: "Failed to fetch meeting" });
    }
  });

  app.post("/api/meetings/upload", isAuthenticated, upload.single('transcript'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const transcript = req.file.buffer.toString('utf-8');
      const userId = req.user.claims.sub;
      
      // Extract title and analyze meeting
      const { title, summary, actionItems } = await summarizeMeetingTranscript(transcript);

      const meetingData = {
        title,
        description: summary,
        transcript,
        summary,
        actionItems,
        startTime: new Date(),
        createdBy: userId,
        teamId: req.body.teamId || null,
      };

      const meeting = await storage.createMeeting(meetingData);
      res.json(meeting);
    } catch (error) {
      console.error("Error uploading meeting:", error);
      res.status(500).json({ message: "Failed to upload meeting" });
    }
  });

  // Chat sessions routes
  app.get("/api/chat/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getChatSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });

  app.post("/api/chat/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertChatSessionSchema.parse({
        ...req.body,
        userId,
      });
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating chat session:", error);
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  app.patch("/api/chat/sessions/:id", isAuthenticated, async (req, res) => {
    try {
      const session = await storage.updateChatSession(req.params.id, req.body);
      res.json(session);
    } catch (error) {
      console.error("Error updating chat session:", error);
      res.status(500).json({ message: "Failed to update chat session" });
    }
  });

  // Chat messages routes
  app.get("/api/chat/sessions/:id/messages", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat/sessions/:id/messages", isAuthenticated, async (req, res) => {
    try {
      const { content } = req.body;
      const sessionId = req.params.id;
      
      // Save user message
      const userMessage = await storage.createChatMessage({
        sessionId,
        content,
        isUser: true,
      });

      // Generate AI response
      // For now, use a simple context from recent meetings
      const meetings = await storage.getMeetings();
      const context = meetings
        .slice(0, 5)
        .map(m => `${m.title}: ${m.summary || m.description || ''}`)
        .join('\n');
      
      const transcripts = meetings.map(m => m.transcript || '').filter(Boolean);
      const aiResponse = await answerQuestionWithContext(content, transcripts);
      
      // Save AI message
      const aiMessage = await storage.createChatMessage({
        sessionId,
        content: aiResponse,
        isUser: false,
      });

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Documents routes
  app.get("/api/documents", isAuthenticated, async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", isAuthenticated, upload.single('document'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.claims.sub;
      const content = req.file.buffer.toString('utf-8');

      const documentData = insertDocumentSchema.parse({
        filename: req.file.originalname,
        content,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedBy: userId,
      });

      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  app.delete("/api/documents/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Stats endpoint for dashboard
  app.get("/api/stats", isAuthenticated, async (req, res) => {
    try {
      const meetings = await storage.getMeetings();
      const documents = await storage.getDocuments();
      
      const totalMeetings = meetings.length;
      const actionItems = meetings.reduce((acc, meeting) => {
        const items = meeting.actionItems as string[] || [];
        return acc + items.length;
      }, 0);
      
      res.json({
        totalMeetings,
        actionItems,
        aiQueries: 156, // This would come from chat messages count
        teamActivity: 92,
        documentsCount: documents.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
