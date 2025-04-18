import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import LandingPage from "./pages/landing-page";
import AuthPage from "./pages/auth-page";
import DashboardPage from "./pages/dashboard-page";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/auth" component={AuthPage} />
            <ProtectedRoute path="/dashboard" component={DashboardPage} />
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;