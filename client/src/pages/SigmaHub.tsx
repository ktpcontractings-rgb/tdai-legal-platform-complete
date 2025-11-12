import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { 
  Zap, 
  Brain, 
  Users, 
  Shield, 
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Network,
  Scale
} from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";

export default function SigmaHub() {
  const { user } = useAuth();
  const { data: legalAgents } = trpc.legalAgents.list.useQuery();
  const { data: managementAgents } = trpc.managementAgents.list.useQuery();
  const { data: boardMembers } = trpc.regulatoryBoard.list.useQuery();
  const { data: stats } = trpc.legalAgents.getStats.useQuery();

  const ceoAgent = managementAgents?.find(a => a.role === "CEO");
  const activeAgents = legalAgents?.filter(a => a.status === "active").length || 0;
  const pendingApprovals = 3; // Mock data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-cyan-800/30 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                ← Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-cyan-400 animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold text-white">SIGMA Central Hub</h1>
                <p className="text-sm text-cyan-400">Strategic Intelligence & Management Automation</p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              System Active
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* System Overview */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Central Coordination System
          </h2>
          <p className="text-slate-300">
            SIGMA coordinates CEO directives, regulatory oversight, agent training, and 50-state deployment
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-cyan-400" />
                <Badge className="bg-cyan-500/20 text-cyan-400">Active</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{activeAgents}</div>
              <div className="text-sm text-slate-400">Active Special Agents</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Brain className="h-8 w-8 text-purple-400" />
                <Badge className="bg-purple-500/20 text-purple-400">Training</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">5</div>
              <div className="text-sm text-slate-400">Agents in Training</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="h-8 w-8 text-blue-400" />
                <Badge className="bg-blue-500/20 text-blue-400">Monitoring</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{boardMembers?.length || 6}</div>
              <div className="text-sm text-slate-400">Board Members</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-8 w-8 text-orange-400" />
                <Badge className="bg-orange-500/20 text-orange-400">Pending</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{pendingApprovals}</div>
              <div className="text-sm text-slate-400">CEO Approvals</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Control Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* CEO Communications */}
          <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-500/30">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Scale className="h-8 w-8 text-amber-400" />
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Executive
                </Badge>
              </div>
              <CardTitle className="text-2xl text-white">CEO Interface</CardTitle>
              <CardDescription className="text-slate-300">
                {ceoAgent?.name || "CEO"} - Strategic directives and final approvals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">Strategic Vision Aligned</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-400" />
                    <span className="text-sm text-slate-300">3 Decisions Pending</span>
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-400 text-xs">Review</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">Performance: 94.7%</span>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">Excellent</Badge>
                </div>
              </div>
              <Link href="/ceo-dashboard">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                  Access CEO Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* ZADE Trainer */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Brain className="h-8 w-8 text-purple-400" />
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  God Agent
                </Badge>
              </div>
              <CardTitle className="text-2xl text-white">ZADE Trainer</CardTitle>
              <CardDescription className="text-slate-300">
                Supreme agent trainer - Creating specialized legal AI for 50 states
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">{stats?.totalAgents || 5} Agents Certified</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">Live</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-slate-300">5 In Training</span>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">50 State Deployment</span>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">Planning</Badge>
                </div>
              </div>
              <Link href="/zade-trainer">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  Access ZADE Trainer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regulatory Board */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900/50 border-blue-500/30">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500">
                  <Activity className="h-3 w-3 mr-1" />
                  Monitoring
                </Badge>
              </div>
              <CardTitle className="text-2xl text-white">Regulatory Board</CardTitle>
              <CardDescription className="text-slate-300">
                6-member AI board ensuring compliance across all operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {boardMembers?.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                    <span className="text-sm text-slate-300">{member.name}</span>
                    <Badge className="bg-green-500/20 text-green-400 text-xs">Active</Badge>
                  </div>
                ))}
                {boardMembers && boardMembers.length > 3 && (
                  <div className="text-center text-sm text-slate-400 pt-2">
                    +{boardMembers.length - 3} more members
                  </div>
                )}
              </div>
              <Link href="/regulatory-board">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  View Full Board
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Special Agents Network */}
          <Card className="bg-gradient-to-br from-cyan-900/20 to-slate-900/50 border-cyan-500/30">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <Users className="h-8 w-8 text-cyan-400" />
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500">
                  <Network className="h-3 w-3 mr-1" />
                  50 States
                </Badge>
              </div>
              <CardTitle className="text-2xl text-white">Special Agents Network</CardTitle>
              <CardDescription className="text-slate-300">
                Customer-facing legal specialists deployed nationwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Active Agents</span>
                  <span className="text-white font-semibold">{activeAgents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">States Covered</span>
                  <span className="text-white font-semibold">50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Success Rate</span>
                  <span className="text-green-400 font-semibold">94.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Cases Handled</span>
                  <span className="text-white font-semibold">{stats?.totalCases || 1200}+</span>
                </div>
              </div>
              <Link href="/agents">
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                  View All Agents
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="mt-6 bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
            <CardDescription>Real-time coordination metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">All Systems Operational</div>
                  <div className="text-xs text-slate-400">Last checked: Just now</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
                <div>
                  <div className="text-sm font-medium text-white">SIGMA Coordinating</div>
                  <div className="text-xs text-slate-400">12 active processes</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">Performance Optimal</div>
                  <div className="text-xs text-slate-400">94.7% success rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
