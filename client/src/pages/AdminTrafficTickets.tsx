import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Ticket, DollarSign, TrendingUp, Users, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

const statusColors = {
  submitted: "bg-blue-500",
  under_review: "bg-yellow-500",
  strategy_ready: "bg-purple-500",
  in_progress: "bg-orange-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
};

export default function AdminTrafficTickets() {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [discussionMessage, setDiscussionMessage] = useState("");
  
  const { data: tickets, refetch: refetchTickets } = trpc.trafficTickets.getAllTickets.useQuery();
  const { data: discussions } = trpc.trafficTickets.getAllDiscussions.useQuery();
  const updateStatus = trpc.trafficTickets.updateTicketStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated");
      refetchTickets();
    },
  });
  const createDiscussion = trpc.trafficTickets.createDiscussion.useMutation({
    onSuccess: () => {
      toast.success("Message sent to management team");
      setDiscussionMessage("");
    },
  });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="p-8 bg-slate-800 border-slate-700">
          <p className="text-white">Admin access required</p>
        </Card>
      </div>
    );
  }

  const totalRevenue = tickets?.reduce((sum, t) => sum + parseFloat(t.fineAmount || "0"), 0) || 0;
  const totalSavings = tickets?.reduce((sum, t) => sum + parseFloat(t.savingsAmount || "0"), 0) || 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light mb-2">Traffic Ticket Management</h1>
          <p className="text-slate-400">Monitor and manage all traffic ticket consultations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-slate-800 border-slate-700">
            <div className="flex items-center gap-3">
              <Ticket className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Total Tickets</p>
                <p className="text-2xl font-light">{tickets?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800 border-slate-700">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Total Fines</p>
                <p className="text-2xl font-light">${totalRevenue.toFixed(0)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800 border-slate-700">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">Client Savings</p>
                <p className="text-2xl font-light">${totalSavings.toFixed(0)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800 border-slate-700">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Active Cases</p>
                <p className="text-2xl font-light">
                  {tickets?.filter(t => t.status === "in_progress" || t.status === "under_review").length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tickets List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets */}
          <div>
            <h2 className="text-2xl font-light mb-4">Recent Tickets</h2>
            <div className="space-y-4">
              {tickets?.map((ticket) => (
                <Card
                  key={ticket.id}
                  className={`p-6 bg-slate-800 border-slate-700 cursor-pointer hover:border-blue-500 transition-colors ${
                    selectedTicket === ticket.id ? "border-blue-500" : ""
                  }`}
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className={`${statusColors[ticket.status]} text-white mb-2`}>
                          {ticket.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <h3 className="text-lg font-medium">{ticket.violationType}</h3>
                        <p className="text-sm text-slate-400">Ticket #{ticket.ticketNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-light text-red-400">${ticket.fineAmount}</p>
                        <p className="text-xs text-slate-500">Fine Amount</p>
                      </div>
                    </div>

                    <div className="text-sm text-slate-300">
                      <p><strong>Location:</strong> {ticket.location}</p>
                      <p><strong>Date:</strong> {format(new Date(ticket.issueDate), "MMM d, yyyy")}</p>
                      {ticket.courtDate && (
                        <p><strong>Court Date:</strong> {format(new Date(ticket.courtDate), "MMM d, yyyy")}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus.mutate({ ticketId: ticket.id, status: "under_review" });
                        }}
                        disabled={ticket.status === "under_review"}
                      >
                        Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus.mutate({ ticketId: ticket.id, status: "resolved" });
                        }}
                        disabled={ticket.status === "resolved"}
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Management Discussions */}
          <div>
            <h2 className="text-2xl font-light mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Management Team Discussions
            </h2>
            
            {selectedTicket && (
              <Card className="p-6 bg-slate-800 border-slate-700 mb-4">
                <h3 className="text-lg font-medium mb-3">Send Message to Management Team</h3>
                <Textarea
                  value={discussionMessage}
                  onChange={(e) => setDiscussionMessage(e.target.value)}
                  placeholder="Discuss this ticket with SIGMA-1, CTO, and the team..."
                  className="bg-slate-900 border-slate-700 text-white mb-3"
                  rows={3}
                />
                <Button
                  onClick={() => {
                    if (!discussionMessage.trim()) return;
                    createDiscussion.mutate({
                      ticketId: selectedTicket,
                      fromAgentId: "ADMIN",
                      toAgentId: "SIGMA-1",
                      message: discussionMessage,
                      messageType: "strategy_discussion",
                      priority: "high",
                    });
                  }}
                  disabled={!discussionMessage.trim() || createDiscussion.isPending}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Send to Management Team
                </Button>
              </Card>
            )}

            <div className="space-y-3">
              {discussions
                ?.filter(d => !selectedTicket || d.ticketId === selectedTicket)
                .map((discussion) => (
                  <Card key={discussion.id} className="p-4 bg-slate-800 border-slate-700">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {discussion.fromAgentId.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{discussion.fromAgentId}</span>
                          <span className="text-xs text-slate-500">
                            → {discussion.toAgentId || "ALL"}
                          </span>
                          <Badge className="text-xs">{discussion.messageType}</Badge>
                        </div>
                        <p className="text-sm text-slate-300">{discussion.message}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Ticket #{discussion.ticketId}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
