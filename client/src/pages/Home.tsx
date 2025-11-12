import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_TITLE } from "@/const";
import { Link } from "wouter";
import { Scale, ArrowRight, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: stats, isLoading } = trpc.legalAgents.getStats.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold text-white">{APP_TITLE}</span>
              <Badge variant="outline" className="ml-2 border-cyan-400 text-cyan-400">
                Legal AI
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/agents">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  Our Agents
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
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-400">
            Revolutionary Legal AI Technology
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            The Future of <span className="text-cyan-400">Legal Services</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            {APP_TITLE} deploys specialized legal AI agents focused on Michigan state law, providing 
            unprecedented access to expert legal information and guidance with continuous learning from the latest legal updates.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/agents">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Meet Our AI Legal Agents
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-2">{stats?.totalAgents || 0}</div>
                <div className="text-slate-400">Active Agents</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-2">Michigan</div>
                <div className="text-slate-400">State Coverage</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-2">
                  {stats?.successRate ? `${stats.successRate.toFixed(1)}%` : '0%'}
                </div>
                <div className="text-slate-400">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-2">{stats?.totalCases || 0}</div>
                <div className="text-slate-400">Cases Handled</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to experience AI-powered legal services?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Start with voice-enabled consultations from our specialized legal agents.
          </p>
          <Link href="/agents">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
              Get Started Now
            </Button>
          </Link>
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
