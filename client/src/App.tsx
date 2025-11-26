import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import Dashboard from "./pages/Dashboard";
import SigmaHub from "./pages/SigmaHub";
import CEODashboard from "./pages/CEODashboard";
import BuyTickets from "./pages/BuyTickets";
import FightTicket from "./pages/FightTicket";
import MyTickets from "./pages/MyTickets";
import AdminTrafficTickets from "./pages/AdminTrafficTickets";
import ZADETraining from "./pages/ZADETraining";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
       <Route path="/" component={Home} />
      <Route path="/agents" component={Agents} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/sigma-hub" component={SigmaHub} />
      <Route path="/ceo-dashboard" component={CEODashboard} />
      <Route path="/buy-tickets" component={BuyTickets} />
      <Route path="/fight-ticket" component={FightTicket} />
      <Route path="/my-tickets" component={MyTickets} />
      <Route path="/admin/traffic-tickets" component={AdminTrafficTickets} />
      <Route path="/zade-training" component={ZADETraining} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
