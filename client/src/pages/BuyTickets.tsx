import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Check, Ticket } from "lucide-react";
import { toast } from "sonner";

export default function BuyTickets() {
  const { user, isAuthenticated } = useAuth();
  const { data: balance } = trpc.trafficTickets.getCredits.useQuery();
  const { data: pricing } = trpc.trafficTickets.getPricing.useQuery();
  const createCheckout = trpc.trafficTickets.createCheckoutSession.useMutation();

  const handlePurchase = async (priceId: string) => {
    try {
      const result = await createCheckout.mutateAsync({ priceId: priceId as any });
      toast.success("Redirecting to checkout...");
      // TODO: Redirect to Stripe checkout
    } catch (error: any) {
      toast.error(error.message || "Checkout not yet available");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="p-8 bg-slate-800 border-slate-700">
          <p className="text-white text-center">Please log in to purchase tickets</p>
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
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Ticket className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-5xl font-light mb-4">Purchase Consultation Tickets</h1>
          <p className="text-xl text-slate-400">
            Get instant access to our AI legal experts
          </p>

          {/* Current Balance */}
          {balance && (
            <div className="mt-8 inline-block px-8 py-4 bg-slate-800/50 rounded-full border border-slate-700">
              <p className="text-sm text-slate-400">Your Current Balance</p>
              <p className="text-3xl font-light text-blue-400">{balance.balance} Tickets</p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricing?.map((plan) => {
            const isPopular = plan.id === "pack_10";
            const savings = plan.id !== "single" 
              ? Math.round(((2500 - plan.pricePerCredit) / 2500) * 100)
              : 0;

            return (
              <Card
                key={plan.id}
                className={`relative p-8 bg-slate-800 border-slate-700 hover:border-blue-500 transition-all ${
                  isPopular ? "ring-2 ring-blue-500 scale-105" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="px-4 py-1 bg-blue-500 text-white text-sm rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center space-y-6">
                  {/* Quantity */}
                  <div>
                    <div className="text-5xl font-light text-white mb-2">
                      {plan.credits}
                    </div>
                    <div className="text-slate-400">
                      {plan.credits === 1 ? "Credit" : "Credits"}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="text-3xl font-light text-blue-400">
                      ${(plan.amount / 100).toFixed(0)}
                    </div>
                    <div className="text-sm text-slate-500">
                      ${(plan.pricePerCredit / 100).toFixed(2)} per credit
                    </div>
                    {savings > 0 && (
                      <div className="text-sm text-green-400 mt-1">
                        Save {savings}%
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-blue-400" />
                      <span>AI Legal Consultation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-blue-400" />
                      <span>24/7 Availability</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-blue-400" />
                      <span>Expert Guidance</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => handlePurchase(plan.id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={createCheckout.isPending}
                  >
                    {createCheckout.isPending ? "Processing..." : "Purchase Now"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center text-slate-400">
          <p className="text-sm">
            Secure payment powered by Stripe • Tickets never expire • Instant delivery
          </p>
        </div>
      </div>
    </div>
  );
}
