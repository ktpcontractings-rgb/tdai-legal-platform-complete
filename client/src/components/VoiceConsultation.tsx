import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface VoiceConsultationProps {
  agent: {
    id: string;
    name: string;
    title: string;
    specialization: string;
  };
  open: boolean;
  onClose: () => void;
}

/**
 * Voice Consultation Component - DISABLED
 * Voice features have been removed from the platform
 */
export function VoiceConsultation({ agent, open, onClose }: VoiceConsultationProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl text-white">{agent.name}</DialogTitle>
              <p className="text-sm text-slate-400 mt-1">{agent.title}</p>
            </div>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500">
              {agent.specialization}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="h-16 w-16 text-yellow-500" />
          <h3 className="text-xl font-semibold text-white">Voice Consultations Temporarily Unavailable</h3>
          <p className="text-slate-400 text-center max-w-md">
            Voice consultation features are currently being updated. Please check back soon or contact us for text-based consultations.
          </p>
          <Button onClick={onClose} className="mt-4 bg-cyan-500 hover:bg-cyan-600">
            Close
          </Button>
        </div>

        <p className="text-xs text-slate-500 text-center">
          This is legal information, not legal advice. Consult a licensed attorney for your specific situation.
        </p>
      </DialogContent>
    </Dialog>
  );
}
