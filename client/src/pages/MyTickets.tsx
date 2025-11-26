import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Ticket, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  open: "bg-blue-500",
  in_progress: "bg-yellow-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
};

const statusIcons = {
  open: Clock,
  in_progress: Clock,
  resolved: CheckCircle2,
  closed: XCircle,
};

const priorityColors = {
  low: "bg-slate-600",
  medium: "bg-blue-600",
  high: "bg-orange-600",
  urgent: "bg-red-600",
};

export default function MyTickets() {
  const { isAuthenticated } = useAuth();
  const { data: tickets, isLoading } = trpc.trafficTickets.getMyTickets.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="p-8 bg-slate-800 border-slate-700">
          <p className="text-white text-center">Please log in to view your tickets</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Ticket className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-light">My Consultation Requests</h1>
          </div>
          <p className="text-slate-400">
            Track the status of your legal consultation requests
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-slate-400">Loading your tickets...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!tickets || tickets.length === 0) && (
          <Card className="p-12 bg-slate-800 border-slate-700 text-center">
            <Ticket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-light mb-2">No Tickets Yet</h3>
            <p className="text-slate-400">
              You haven't submitted any consultation requests yet.
            </p>
          </Card>
        )}

        {/* Tickets List */}
        {tickets && tickets.length > 0 && (
          <div className="space-y-4">
            {tickets.map((ticket) => {
              const StatusIcon = statusIcons[ticket.status];
              
              return (
                <Card
                  key={ticket.id}
                  className="p-6 bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Main Content */}
                    <div className="flex-1 space-y-3">
                      {/* Title & Status */}
                      <div className="flex items-start gap-3">
                        <StatusIcon className="w-5 h-5 text-blue-400 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-xl font-medium text-white mb-2">
                            {ticket.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={`${statusColors[ticket.status]} text-white`}>
                              {ticket.status.replace("_", " ").toUpperCase()}
                            </Badge>
                            <Badge className={`${priorityColors[ticket.priority]} text-white`}>
                              {ticket.priority.toUpperCase()}
                            </Badge>
                            {ticket.category && (
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                {ticket.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-300 leading-relaxed pl-8">
                        {ticket.description}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500 pl-8">
                        <div>
                          <span className="font-medium">Submitted:</span>{" "}
                          {format(new Date(ticket.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                        {ticket.resolvedAt && (
                          <div>
                            <span className="font-medium">Resolved:</span>{" "}
                            {format(new Date(ticket.resolvedAt), "MMM d, yyyy 'at' h:mm a")}
                          </div>
                        )}
                        {ticket.assignedAgent && (
                          <div>
                            <span className="font-medium">Assigned to:</span>{" "}
                            {ticket.assignedAgent}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ticket ID */}
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Ticket #</div>
                      <div className="text-lg font-mono text-slate-400">{ticket.id}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
