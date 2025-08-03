import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Calendar, MessageSquare, Users, Zap, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-3">
              <Brain className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Vahan</h1>
          </div>
          <Button
            onClick={() => window.location.href = "/api/login"}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            AI-Augmented Meeting Intelligence
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your meetings with automatic transcript capture, AI-powered summaries, 
            and intelligent action item extraction. Built for teams that value productivity.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = "/api/login"}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Everything you need for smarter meetings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass soft-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="text-orange-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Automatic Capture
                </h3>
                <p className="text-gray-600">
                  Upload transcripts and automatically detect meetings with AI-powered analysis
                </p>
              </CardContent>
            </Card>

            <Card className="glass soft-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Smart Summaries
                </h3>
                <p className="text-gray-600">
                  Get instant AI-generated summaries and automatically extracted action items
                </p>
              </CardContent>
            </Card>

            <Card className="glass soft-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  AI Assistant
                </h3>
                <p className="text-gray-600">
                  Ask questions about any meeting and get instant, context-aware answers
                </p>
              </CardContent>
            </Card>

            <Card className="glass soft-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Team Organization
                </h3>
                <p className="text-gray-600">
                  Organize meetings by team and track progress across your organization
                </p>
              </CardContent>
            </Card>

            <Card className="glass soft-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="text-yellow-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Real-time Processing
                </h3>
                <p className="text-gray-600">
                  Process transcripts instantly with powerful AI models for immediate insights
                </p>
              </CardContent>
            </Card>

            <Card className="glass soft-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Knowledge Base
                </h3>
                <p className="text-gray-600">
                  Upload documents to enhance AI responses with your organization's knowledge
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <Card className="glass soft-shadow max-w-2xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to transform your meetings?
              </h2>
              <p className="text-gray-600 mb-8">
                Join teams using AI to make their meetings more productive and actionable.
              </p>
              <Button
                size="lg"
                onClick={() => window.location.href = "/api/login"}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg"
              >
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-white/30 py-8 px-6 mt-16">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mr-2">
              <Brain className="text-white" size={16} />
            </div>
            <span className="text-lg font-semibold text-gray-800">Vahan</span>
          </div>
          <p className="text-gray-600">
            AI-Augmented Meeting Intelligence Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
