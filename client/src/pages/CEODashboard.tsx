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
  Loader2,
  MessageSquare
} from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function CEODashboard() {
  const { user } = useAuth();
  const [directive, setDirective] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<"CEO" | "CTO" | "PM" | "MARKETING" | "BILLING" | "LEGAL">("CEO");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { data: stats } = trpc.legalAgents.getStats.useQuery();
  const { data: managementAgents } = trpc.managementAgents.list.useQuery();
  const { data: chatHistory, refetch: refetchChat } = trpc.ceoChat.getHistory.useQuery();
  const sendMessageMutation = trpc.ceoChat.sendMessage.useMutation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Get real pending approvals from database
  const pendingApprovals = pendingDecisions || [];
  
  // Helper to format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handleSendDirective = async () => {
    if (!directive.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    setIsSending(true);
    try {
      await sendMessageMutation.mutateAsync({
        message: directive,
        targetAgent: selectedAgent,
      });
      
      setDirective("");
      await refetchChat();
      toast.success(`Message sent to ${selectedAgent}`);
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const approveDecisionMutation = trpc.decisions.approve.useMutation();
  const rejectDecisionMutation = trpc.decisions.reject.useMutation();
  const { data: pendingDecisions, refetch: refetchDecisions } = trpc.decisions.pending.useQuery();

  const handleApprove = async (decisionId: string, title: string) => {
    try {
      await approveDecisionMutation.mutateAsync({ decisionId });
      toast.success(`Approved: ${title}`);
      await refetchDecisions();
    } catch (error) {
      toast.error("Failed to approve decision");
      console.error(error);
    }
  };

  const handleReject = async (decisionId: string, title: string) => {
    try {
      await rejectDecisionMutation.mutateAsync({ decisionId });
      toast.error(`Rejected: ${title}`);
      await refetchDecisions();
    } catch (error) {
      toast.error("Failed to reject decision");
      console.error(error);
    }
  };

  const agentColors = {
    CEO: "bg-amber-500/20 text-amber-400 border-amber-500",
    CTO: "bg-cyan-500/20 text-cyan-400 border-cyan-500",
    PM: "bg-purple-500/20 text-purple-400 border-purple-500",
    MARKETING: "bg-pink-500/20 text-pink-400 border-pink-500",
    BILLING: "bg-green-500/20 text-green-400 border-green-500",
    LEGAL: "bg-blue-500/20 text-blue-400 border-blue-500",
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
            Your AI management team awaits your strategic direction. Each agent has their own specialized knowledge base.
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
          {/* Chat with Management Agents */}
          <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-500/30">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-6 w-6 text-amber-400" />
                <CardTitle className="text-2xl text-white">Boardroom Chat</CardTitle>
              </div>
              <CardDescription className="text-slate-300">
                Communicate with your AI management team - each with their own specialized knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Agent Selector */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(["CEO", "CTO", "PM", "MARKETING", "BILLING", "LEGAL"] as const).map((agent) => (
                  <Button
                    key={agent}
                    size="sm"
                    variant={selectedAgent === agent ? "default" : "outline"}
                    className={selectedAgent === agent ? agentColors[agent] : ""}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    {agent}
                  </Button>
                ))}
              </div>

              {/* Chat History */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-4 h-[300px] overflow-y-auto">
                {chatHistory && chatHistory.length > 0 ? (
                  <div className="space-y-3">
                    {chatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === "user"
                              ? "bg-amber-500/20 text-white"
                              : "bg-slate-800 text-slate-200"
                          }`}
                        >
                          {msg.role === "assistant" && msg.agentId && (
                            <div className="text-xs text-slate-400 mb-1">
                              {msg.agentId}
                            </div>
                          )}
                          <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No messages yet. Start a conversation with your management team!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <Textarea
                placeholder={`Ask ${selectedAgent} for strategic guidance...`}
                className="min-h-[80px] bg-slate-900/50 border-amber-500/30 text-white placeholder:text-slate-500 mb-3"
                value={directive}
                onChange={(e) => setDirective(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendDirective();
                  }
                }}
              />
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={handleSendDirective}
                disabled={isSending || !directive.trim()}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send to {selectedAgent}
                  </>
                )}
              </Button>
              <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-cyan-500/20">
                <div className="flex items-center gap-2 text-xs text-cyan-400">
                  <Zap className="h-4 w-4" />
                  <span>Each agent has their own specialized knowledge base and expertise</span>
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
                    <span className="text-white">Management Agents</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    6 Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card className="bg-slate-900/50 border-slate-800 mb-6">
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
              {pendingApprovals.length > 0 ? pendingApprovals.map((approval) => (
                <Card key={approval.id} className="bg-slate-950/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{approval.decision}</h3>
                          <Badge 
                            className={
                              approval.priority === "high" || approval.priority === "critical"
                                ? "bg-red-500/20 text-red-400 border-red-500"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500"
                            }
                          >
                            {(approval.priority === "high" || approval.priority === "critical") ? <AlertCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                            {approval.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{approval.description || approval.recommendation}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Requested by: Agent {approval.agentId.substring(0, 8)}</span>
                          <span>•</span>
                          <span>{formatTimestamp(approval.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleApprove(approval.id, approval.decision)}
                        disabled={approveDecisionMutation.isLoading}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleReject(approval.id, approval.decision)}
                        disabled={rejectDecisionMutation.isLoading}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No pending approvals - all caught up!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
