import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { 
  Scale,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Users,
  Shield,
  Activity,
  Send,
  ThumbsUp,
  ThumbsDown,
  Loader2
} from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";
import { useState } from "react";
import { toast } from "sonner";

export default function CEODashboard() {
  const { user } = useAuth();
  const [directive, setDirective] = useState("");
  const { data: stats } = trpc.legalAgents.getStats.useQuery();
  const { data: managementAgents } = trpc.managementAgents.list.useQuery();

  const ceoAgent = managementAgents?.find(a => a.role === "CEO");

  // Mock pending approvals - in real system this would come from database
  const pendingApprovals = [
    {
      id: 1,
      title: "Deploy 3 New Michigan Traffic Law Specialists",
      description: "ZADE has completed training for 3 new traffic law specialists focused on Michigan Vehicle Code and ready for deployment in Detroit, Grand Rapids, and Ann Arbor regions.",
      priority: "high",
      requestedBy: "ZADE Trainer",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      title: "Increase Marketing Budget by 15%",
      description: "Marketing AI recommends budget increase to capture Q2 growth opportunity in corporate legal services sector.",
      priority: "medium",
      requestedBy: "Marketing AI",
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      title: "New Compliance Protocol for Healthcare Agents",
      description: "Regulatory Board proposes enhanced compliance protocols for healthcare-related legal consultations.",
      priority: "high",
      requestedBy: "Regulatory Board",
      timestamp: "1 day ago"
    }
  ];

  const handleSendDirective = () => {
    if (!directive.trim()) {
      toast.error("Please enter a directive");
      return;
    }
    
    toast.success("Directive sent to SIGMA for execution");
    setDirective("");
  };

  const handleApprove = (id: number, title: string) => {
    toast.success(`Approved: ${title}`);
  };

  const handleReject = (id: number, title: string) => {
    toast.error(`Rejected: ${title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-amber-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-amber-800/30 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/sigma-hub">
              <Button variant="ghost" className="text-amber-400 hover:text-amber-300">
                ← Back to SIGMA Hub
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Scale className="h-8 w-8 text-amber-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">CEO Command Center</h1>
                <p className="text-sm text-amber-400">Executive Strategic Oversight</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white">{user?.name || "CEO"}</div>
              <div className="text-xs text-slate-400">Chief Executive Officer</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome, {user?.name?.split(' ')[0] || "Chief"} 👔
          </h2>
          <p className="text-slate-300">
            Your AI empire awaits your strategic direction. SIGMA is coordinating all operations.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <Badge className="bg-green-500/20 text-green-400">+12%</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats?.successRate ? `${stats.successRate.toFixed(1)}%` : '0%'}
              </div>
              <div className="text-sm text-slate-400">Success Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-cyan-400" />
                <Badge className="bg-cyan-500/20 text-cyan-400">Active</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats?.totalAgents || 0}</div>
              <div className="text-sm text-slate-400">Total Agents</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-8 w-8 text-purple-400" />
                <Badge className="bg-purple-500/20 text-purple-400">Live</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats?.totalCases || 0}</div>
              <div className="text-sm text-slate-400">Cases Handled</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-8 w-8 text-orange-400" />
                <Badge className="bg-orange-500/20 text-orange-400">{pendingApprovals.length}</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{pendingApprovals.length}</div>
              <div className="text-sm text-slate-400">Pending Approvals</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Strategic Directive Panel */}
          <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-500/30">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Send className="h-6 w-6 text-amber-400" />
                <CardTitle className="text-2xl text-white">Send Strategic Directive</CardTitle>
              </div>
              <CardDescription className="text-slate-300">
                Give high-level instructions to SIGMA - it will coordinate execution across all systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Example: Focus on expanding corporate legal services in the Northeast region..."
                className="min-h-[120px] bg-slate-900/50 border-amber-500/30 text-white placeholder:text-slate-500 mb-4"
                value={directive}
                onChange={(e) => setDirective(e.target.value)}
              />
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={handleSendDirective}
              >
                <Send className="mr-2 h-4 w-4" />
                Send to SIGMA
              </Button>
              <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-cyan-500/20">
                <div className="flex items-center gap-2 text-sm text-cyan-400">
                  <Zap className="h-4 w-4" />
                  <span>SIGMA will coordinate with ZADE, Regulatory Board, and Special Agents</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-gradient-to-br from-cyan-900/20 to-slate-900/50 border-cyan-500/30">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-6 w-6 text-cyan-400" />
                <CardTitle className="text-2xl text-white">System Status</CardTitle>
              </div>
              <CardDescription className="text-slate-300">
                Real-time overview of all AI systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400 animate-pulse" />
                    <span className="text-white">SIGMA Central Hub</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="text-white">ZADE Trainer</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Training
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Regulatory Board</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Monitoring
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-cyan-400" />
                    <span className="text-white">Special Agents</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {stats?.activeAgents || 5} Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white">Pending Approvals</CardTitle>
                <CardDescription className="text-slate-300">
                  Major decisions requiring your executive approval
                </CardDescription>
              </div>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500">
                {pendingApprovals.length} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <Card key={approval.id} className="bg-slate-950/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{approval.title}</h3>
                          <Badge 
                            className={
                              approval.priority === "high" 
                                ? "bg-red-500/20 text-red-400 border-red-500"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500"
                            }
                          >
                            {approval.priority === "high" ? <AlertCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                            {approval.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{approval.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Requested by: {approval.requestedBy}</span>
                          <span>•</span>
                          <span>{approval.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleApprove(approval.id, approval.title)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleReject(approval.id, approval.title)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Management Team */}
        <Card className="bg-slate-900/50 border-slate-800 mt-6">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Management Team</CardTitle>
            <CardDescription className="text-slate-300">
              Your AI leadership team coordinating all operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {managementAgents?.map(agent => (
                <Card key={agent.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{agent.avatar}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{agent.name}</h4>
                        <p className="text-xs text-slate-400 mb-2">{agent.title}</p>
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          {agent.status}
                        </Badge>
                        <p className="text-sm text-slate-300 mt-2 line-clamp-3">
                          {agent.description}
                        </p>
                        {agent.recommendation && (
                          <div className="mt-3 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
                            <p className="text-xs text-cyan-300">
                              <strong>Latest:</strong> {agent.recommendation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Link href="/sigma-hub">
            <Card className="bg-slate-900/50 border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer">
              <CardContent className="p-6">
                <Zap className="h-8 w-8 text-cyan-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">SIGMA Hub</h3>
                <p className="text-sm text-slate-400">View central coordination system</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/zade-trainer">
            <Card className="bg-slate-900/50 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer">
              <CardContent className="p-6">
                <Brain className="h-8 w-8 text-purple-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">ZADE Trainer</h3>
                <p className="text-sm text-slate-400">Monitor agent training progress</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/regulatory-board">
            <Card className="bg-slate-900/50 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer">
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-blue-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Regulatory Board</h3>
                <p className="text-sm text-slate-400">Review compliance reports</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
