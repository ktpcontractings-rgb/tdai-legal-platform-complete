import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle2, Scale, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

const TICKET_TYPES = [
  "Speeding",
  "Red Light Violation",
  "Stop Sign Violation",
  "Parking Violation",
  "Careless Driving",
  "Reckless Driving",
  "DUI/DWI",
  "License/Registration Issue",
  "Other Moving Violation",
];

export default function FightTicket() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // Form state
  const [ticketType, setTicketType] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [location, setTicketLocation] = useState("");
  const [fineAmount, setFineAmount] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [description, setDescription] = useState("");
  const [courtDate, setCourtDate] = useState("");

  const { data: balance } = trpc.trafficTickets.getCredits.useQuery();
  const submitTicket = trpc.trafficTickets.submitTicket.useMutation({
    onSuccess: () => {
      toast.success("Traffic ticket submitted! Our AI legal team will review it.");
      // Reset form
      setTicketType("");
      setTicketNumber("");
      setIssueDate("");
      setTicketLocation("");
      setFineAmount("");
      setOfficerName("");
      setDescription("");
      setCourtDate("");
      setLocation("/my-tickets");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!balance || balance.balance < 1) {
      toast.error("You need at least 1 consultation credit");
      setLocation("/buy-tickets");
      return;
    }

    // Build detailed description
    const fullDescription = `
**Traffic Ticket Details**

Ticket Type: ${ticketType}
Ticket Number: ${ticketNumber}
Issue Date: ${issueDate}
Location: ${location}
Fine Amount: $${fineAmount}
${officerName ? `Officer: ${officerName}` : ''}
${courtDate ? `Court Date: ${courtDate}` : ''}

**Additional Information:**
${description}
    `.trim();

    const violationTypeMap: Record<string, string> = {
      "Speeding": "SPEEDING",
      "Red Light Violation": "RED_LIGHT",
      "Stop Sign Violation": "STOP_SIGN",
      "Parking Violation": "PARKING",
      "Careless Driving": "CARELESS_DRIVING",
      "Reckless Driving": "RECKLESS_DRIVING",
      "DUI/DWI": "DUI_DWI",
      "License/Registration Issue": "LICENSE_ISSUE",
      "Other Moving Violation": "OTHER",
    };

    await submitTicket.mutateAsync({
      ticketNumber,
      violationType: violationTypeMap[ticketType] as any,
      issueDate,
      location,
      fineAmount: parseFloat(fineAmount),
      courtDate: courtDate || undefined,
      officerName: officerName || undefined,
      description,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="p-8 bg-slate-800 border-slate-700">
          <p className="text-white text-center">Please log in to fight your ticket</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Scale className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-5xl font-light mb-4">Fight Your Traffic Ticket</h1>
          <p className="text-xl text-slate-400">
            Let our AI legal team help you reduce or dismiss your ticket
          </p>

          {/* Balance Warning */}
          {balance && balance.balance < 1 && (
            <div className="mt-8 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div className="text-left">
                <p className="text-red-400 font-medium">No Consultation Credits</p>
                <p className="text-sm text-slate-400">
                  You need at least 1 credit to submit a ticket.{" "}
                  <button
                    onClick={() => setLocation("/buy-tickets")}
                    className="text-blue-400 hover:underline"
                  >
                    Get credits here
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Balance Display */}
          {balance && balance.balance > 0 && (
            <div className="mt-8 inline-block px-8 py-4 bg-slate-800/50 rounded-full border border-slate-700">
              <p className="text-sm text-slate-400">Your Credits</p>
              <p className="text-3xl font-light text-blue-400">{balance.balance} Available</p>
              <p className="text-xs text-slate-500 mt-1">1 credit will be used for this consultation</p>
            </div>
          )}
        </div>

        {/* Value Proposition */}
        <Card className="p-6 bg-blue-900/20 border-blue-700 mb-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-light text-blue-400 mb-2">$25</div>
              <div className="text-sm text-slate-300">Our Consultation</div>
            </div>
            <div>
              <div className="text-3xl font-light text-red-400 mb-2">$150-500</div>
              <div className="text-sm text-slate-300">Average Ticket Fine</div>
            </div>
            <div>
              <div className="text-3xl font-light text-green-400 mb-2">50-100%</div>
              <div className="text-sm text-slate-300">Potential Savings</div>
            </div>
          </div>
        </Card>

        {/* Form */}
        <Card className="p-8 bg-slate-800 border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ticket Type */}
            <div className="space-y-2">
              <Label htmlFor="ticketType" className="text-white">
                Type of Violation *
              </Label>
              <Select value={ticketType} onValueChange={setTicketType} required>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Select violation type" />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ticket Number */}
              <div className="space-y-2">
                <Label htmlFor="ticketNumber" className="text-white">
                  Ticket Number *
                </Label>
                <Input
                  id="ticketNumber"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  placeholder="e.g., T123456789"
                  required
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              {/* Issue Date */}
              <div className="space-y-2">
                <Label htmlFor="issueDate" className="text-white">
                  Date Issued *
                </Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              {/* Fine Amount */}
              <div className="space-y-2">
                <Label htmlFor="fineAmount" className="text-white">
                  Fine Amount ($) *
                </Label>
                <Input
                  id="fineAmount"
                  type="number"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                  placeholder="150"
                  required
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              {/* Court Date */}
              <div className="space-y-2">
                <Label htmlFor="courtDate" className="text-white">
                  Court Date (if applicable)
                </Label>
                <Input
                  id="courtDate"
                  type="date"
                  value={courtDate}
                  onChange={(e) => setCourtDate(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">
                Location of Violation *
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setTicketLocation(e.target.value)}
                placeholder="City, State and street/intersection"
                required
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            {/* Officer Name */}
            <div className="space-y-2">
              <Label htmlFor="officerName" className="text-white">
                Officer Name (if known)
              </Label>
              <Input
                id="officerName"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="Officer's name from ticket"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Tell Us What Happened *
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the circumstances of the ticket. Include any details that might help your case (weather conditions, unclear signage, emergency situation, etc.)"
                required
                minLength={20}
                rows={6}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-500">
                The more details you provide, the better we can help you
              </p>
            </div>

            {/* Photo Upload Placeholder */}
            <div className="space-y-2">
              <Label className="text-white">Upload Ticket Photo (Coming Soon)</Label>
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center bg-slate-900/50">
                <Upload className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  Photo upload feature coming soon
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg"
              disabled={submitTicket.isPending || !balance || balance.balance < 1}
            >
              {submitTicket.isPending ? (
                "Submitting..."
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Submit for Review (1 Credit)
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* What Happens Next */}
        <Card className="mt-8 p-6 bg-slate-800/50 border-slate-700">
          <h3 className="text-xl font-medium mb-4">What Happens Next?</h3>
          <div className="space-y-3 text-slate-300">
            <div className="flex gap-3">
              <div className="text-blue-400 font-bold">1.</div>
              <p>Our AI legal team reviews your ticket details within 24 hours</p>
            </div>
            <div className="flex gap-3">
              <div className="text-blue-400 font-bold">2.</div>
              <p>We analyze potential defenses and procedural errors</p>
            </div>
            <div className="flex gap-3">
              <div className="text-blue-400 font-bold">3.</div>
              <p>You receive a detailed action plan to reduce or dismiss your ticket</p>
            </div>
            <div className="flex gap-3">
              <div className="text-blue-400 font-bold">4.</div>
              <p>Follow our guidance to contest the ticket and save money</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
