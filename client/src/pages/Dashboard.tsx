import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { 
  Scale, 
  Brain, 
  Users, 
  TrendingUp, 
  Activity,
  Zap,
  Shield,
  Settings,
  LogOut,
  Loader2,
  ArrowRight,
  Sparkles,
  Crown
} from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const { data: stats, isLoading: statsLoading } = trpc.legalAgents.getStats.useQuery();
  const { data: managementAgents } = trpc.managementAgents.list.useQuery();

  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const ceoAgent = managementAgents?.find(a => a.role === "CEO");
  const ctoAgent = managementAgents?.find(a => a.role === "CTO");
  const pmAgent = managementAgents?.find(a => a.role === "PM");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="h-8 w-8 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">{APP_TITLE}</h1>
                <p className="text-sm text-slate-400">Command Center</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500">
                <Activity className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <div className="flex items-center gap-2 text-slate-300">
                <div className="text-right">
                  <div className="text-sm font-medium">{user?.name || "Admin"}</div>
                  <div className="text-xs text-slate-500">Owner</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  className="text-slate-400 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0] || "Admin"} 👋
          </h2>
          <p className="text-slate-400">
            Your AI-powered legal empire is running smoothly. Here's your command center.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-cyan-400" />
                <Badge className="bg-cyan-500/20 text-cyan-400">Active</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats?.totalAgents || 0}
              </div>
              <div className="text-sm text-slate-400">Total AI Agents</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <Badge className="bg-green-500/20 text-green-400">
                  {stats?.successRate ? `${stats.successRate.toFixed(1)}%` : '0%'}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats?.totalCases || 0}
              </div>
              <div className="text-sm text-slate-400">Cases Handled</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-8 w-8 text-purple-400" />
                <Badge className="bg-purple-500/20 text-purple-400">Live</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats?.activeConsultations || 12}
              </div>
              <div className="text-sm text-slate-400">Active Consultations</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="h-8 w-8 text-blue-400" />
                <Badge className="bg-blue-500/20 text-blue-400">MI</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                Michigan
              </div>
              <div className="text-sm text-slate-400">State Coverage</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* CEO Dashboard */}
          <Link href="/ceo-dashboard">
            <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-500/30 hover:border-amber-500 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/20 rounded-lg">
                    <Crown className="h-8 w-8 text-amber-400" />
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Executive
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-amber-400 transition-colors">
                  CEO Command Center
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Strategic directives, approvals, and executive oversight
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Pending Approvals</span>
                    <span className="text-orange-400 font-semibold">3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">System Status</span>
                    <span className="text-green-400 font-semibold">All Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Success Rate</span>
                    <span className="text-green-400 font-semibold">94.7%</span>
                  </div>
                </div>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white group-hover:translate-x-1 transition-transform">
                  Access CEO Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* ZADE Trainer */}
          <Link href="/zade-trainer">
            <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Brain className="h-8 w-8 text-purple-400" />
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Super Agent
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-purple-400 transition-colors">
                  ZADE Trainer
                </CardTitle>
                <CardDescription className="text-slate-300">
                  The God of AI Agents - Create, train, and certify specialized legal agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Agents Trained</span>
                    <span className="text-white font-semibold">{stats?.totalAgents || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Success Rate</span>
                    <span className="text-green-400 font-semibold">98.5%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Certification Level</span>
                    <span className="text-purple-400 font-semibold">Ultra</span>
                  </div>
                </div>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white group-hover:translate-x-1 transition-transform">
                  Access ZADE Trainer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* SIGMA Management */}
          <Link href="/sigma-hub">
            <Card className="bg-gradient-to-br from-cyan-900/30 to-slate-900/50 border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <Zap className="h-8 w-8 text-cyan-400" />
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500">
                    <Activity className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-cyan-400 transition-colors">
                  SIGMA Management
                </CardTitle>
                <CardDescription className="text-slate-300">
                  CEO, CTO, PM oversight - Strategic decisions and operations management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300">
                      {ceoAgent?.name || "CEO"} - Strategic Leadership
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300">
                      {ctoAgent?.name || "CTO"} - Technology Oversight
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300">
                      {pmAgent?.name || "PM"} - Product Management
                    </span>
                  </div>
                </div>
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white group-hover:translate-x-1 transition-transform">
                  Access SIGMA Hub
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/agents">
            <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-cyan-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">View All Agents</h3>
                <p className="text-sm text-slate-400">Browse and manage legal AI specialists</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer">
            <CardContent className="p-6">
              <Activity className="h-8 w-8 text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">System Analytics</h3>
              <p className="text-sm text-slate-400">View performance metrics and insights</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer">
            <CardContent className="p-6">
              <Settings className="h-8 w-8 text-slate-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Settings</h3>
              <p className="text-sm text-slate-400">Configure system and preferences</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
