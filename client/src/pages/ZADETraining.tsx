import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { 
  Brain, 
  TrendingUp, 
  Award, 
  Activity,
  Users,
  Target,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";

export default function ZADETraining() {
  const { user } = useAuth();
  const { data: agents, isLoading } = trpc.legalAgents.list.useQuery();

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="p-8 bg-slate-800 border-slate-700">
          <p className="text-white">Admin access required</p>
        </Card>
      </div>
    );
  }

  const trafficAgents = agents?.filter(a => a.specialization === "TRAFFIC") || [];
  const totalCases = trafficAgents.reduce((sum, a) => sum + a.casesHandled, 0);
  const avgSuccessRate = trafficAgents.length > 0
    ? trafficAgents.reduce((sum, a) => sum + parseFloat(a.successRate), 0) / trafficAgents.length
    : 0;

  const getPerformanceColor = (rate: string) => {
    const num = parseFloat(rate);
    if (num >= 90) return "text-green-400";
    if (num >= 80) return "text-blue-400";
    if (num >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getPerformanceBadge = (rate: string) => {
    const num = parseFloat(rate);
    if (num >= 90) return { text: "Excellent", color: "bg-green-500" };
    if (num >= 80) return { text: "Good", color: "bg-blue-500" };
    if (num >= 70) return { text: "Adequate", color: "bg-yellow-500" };
    return { text: "Needs Training", color: "bg-red-500" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/sigma-hub">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                ← Back to SIGMA Hub
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">ZADE Training Center</h1>
                <p className="text-sm text-purple-400">AI Agent Training & Performance Management</p>
              </div>
            </div>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-slate-800/50 border-purple-700/30">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">Traffic Specialists</p>
                <p className="text-3xl font-light">{trafficAgents.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800/50 border-purple-700/30">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Total Cases</p>
                <p className="text-3xl font-light">{totalCases.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800/50 border-purple-700/30">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Avg Success Rate</p>
                <p className="text-3xl font-light">{avgSuccessRate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800/50 border-purple-700/30">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Active Agents</p>
                <p className="text-3xl font-light">
                  {trafficAgents.filter(a => a.status === "active").length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Training Overview */}
        <Card className="p-6 bg-slate-800/50 border-purple-700/30 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-light">ZADE Training System</h2>
          </div>
          <p className="text-slate-300 mb-4">
            ZADE (Zero-Defect Adaptive Intelligence Engine) continuously monitors and trains traffic ticket specialists.
            Each agent is evaluated on success rate, case volume, and specialization accuracy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-medium">Continuous Learning</span>
              </div>
              <p className="text-sm text-slate-400">
                Agents learn from every case outcome to improve strategies
              </p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Performance Tracking</span>
              </div>
              <p className="text-sm text-slate-400">
                Real-time monitoring of success rates and case handling
              </p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Specialization Focus</span>
              </div>
              <p className="text-sm text-slate-400">
                Each agent masters specific violation types
              </p>
            </div>
          </div>
        </Card>

        {/* Agent Performance Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-light mb-4">Traffic Specialist Performance</h2>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-slate-400">Loading agents...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trafficAgents.map((agent) => {
            const performance = getPerformanceBadge(agent.successRate);
            const successRate = parseFloat(agent.successRate);

            return (
              <Card
                key={agent.id}
                className="p-6 bg-slate-800/50 border-purple-700/30 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">
                      {agent.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{agent.name}</h3>
                      <p className="text-sm text-slate-400">{agent.title}</p>
                    </div>
                  </div>
                  <Badge className={`${performance.color} text-white`}>
                    {performance.text}
                  </Badge>
                </div>

                <p className="text-sm text-slate-300 mb-4">{agent.description}</p>

                {/* Performance Metrics */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Success Rate</span>
                      <span className={`font-medium ${getPerformanceColor(agent.successRate)}`}>
                        {agent.successRate}%
                      </span>
                    </div>
                    <Progress value={successRate} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-slate-500">Cases Handled</p>
                      <p className="text-xl font-light">{agent.casesHandled.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Trained By</p>
                      <p className="text-xl font-light">{agent.trainedBy || "ZADE"}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-purple-700 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Retrain
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-purple-700 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    View Stats
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Training Recommendations */}
        <Card className="p-6 bg-slate-800/50 border-purple-700/30 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-light">Training Recommendations</h2>
          </div>
          <div className="space-y-3">
            {trafficAgents
              .filter(a => parseFloat(a.successRate) < 80)
              .map(agent => (
                <div key={agent.id} className="p-4 bg-slate-900/50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-slate-400">
                      Success rate below target ({agent.successRate}%) - Recommend additional training
                    </p>
                  </div>
                  <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                    Schedule Training
                  </Button>
                </div>
              ))}
            {trafficAgents.every(a => parseFloat(a.successRate) >= 80) && (
              <p className="text-center text-slate-400 py-4">
                All agents performing above target! 🎉
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
