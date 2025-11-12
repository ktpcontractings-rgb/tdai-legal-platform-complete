import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Scale, Mic, MessageSquare, Award, TrendingUp, MapPin, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";
import { VoiceConsultation } from "@/components/VoiceConsultation";

export default function Agents() {
  const [selectedAgent, setSelectedAgent] = useState<{
    id: string;
    name: string;
    title: string;
    specialization: string;
  } | null>(null);
  
  const { data: agents, isLoading } = trpc.legalAgents.list.useQuery();

  const specializationColors: Record<string, string> = {
    TRAFFIC: "bg-blue-500/10 text-blue-400 border-blue-400/30",
    FAMILY: "bg-pink-500/10 text-pink-400 border-pink-400/30",
    CORPORATE: "bg-purple-500/10 text-purple-400 border-purple-400/30",
    CRIMINAL: "bg-red-500/10 text-red-400 border-red-400/30",
    BENEFITS: "bg-green-500/10 text-green-400 border-green-400/30",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading AI Legal Agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Scale className="h-8 w-8 text-cyan-400" />
                <span className="text-2xl font-bold text-white">{APP_TITLE}</span>
                <Badge variant="outline" className="ml-2 border-cyan-400 text-cyan-400">
                  Legal AI
                </Badge>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  Access Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-400">
            Voice-Enabled AI Legal Specialists
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-6">
            Meet Our <span className="text-cyan-400">Expert AI Agents</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Specialized legal AI agents trained by ZADE Ultra Agent System, ready to provide
            expert guidance across all legal specializations.
          </p>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents?.map((agent) => (
              <Card key={agent.id} className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{agent.avatar}</div>
                    <Badge className={specializationColors[agent.specialization]}>
                      {agent.specialization}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-xl">{agent.name}</CardTitle>
                  <CardDescription className="text-cyan-400">{agent.title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">{agent.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <Award className="h-4 w-4" />
                        Success Rate
                      </div>
                      <div className="text-2xl font-bold text-cyan-400">{agent.successRate}%</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        Cases
                      </div>
                      <div className="text-2xl font-bold text-cyan-400">{agent.casesHandled}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      onClick={() => setSelectedAgent({
                        id: agent.id,
                        name: agent.name,
                        title: agent.title,
                        specialization: agent.specialization,
                      })}
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Voice Call
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                  </div>

                  {agent.status === "active" && (
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-green-400">
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                      Available Now
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Voice Consultation Component */}
      {selectedAgent && (
        <VoiceConsultation
          agent={selectedAgent}
          open={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Need Help Choosing an Agent?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our AI-powered matching system can recommend the perfect legal specialist for your specific needs.
          </p>
          <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
            Get Agent Recommendation
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 bg-slate-950">
        <div className="container mx-auto text-center text-slate-500 text-sm">
          <p>© 2025 {APP_TITLE}. All rights reserved.</p>
          <p className="mt-2">Powered by ZADE Ultra Agent Training System</p>
        </div>
      </footer>
    </div>
  );
}
