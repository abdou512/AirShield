import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { BrowserRouter } from "react-router-dom";
import LandingPage from "./pages/landing-page";
import AuthPage from "./pages/auth-page";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/not-found";
import AddUser from "./pages/AddUser";
import LoginForm from "./pages/login";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
       
      <AuthProvider>
        <TooltipProvider>
          <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/register" component={AddUser} />
            <Route path="/login" component={LoginForm} />
            <ProtectedRoute path="/dashboard" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;