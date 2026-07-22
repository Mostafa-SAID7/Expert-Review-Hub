import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/contexts/theme-context";
import { LangProvider } from "@/contexts/lang-context";
import { NotificationsProvider } from "@/contexts/notifications-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Guide from "@/pages/Guide";
import Tracker from "@/pages/Tracker";
import Dashboard from "@/pages/Dashboard";
import MealPlans from "@/pages/MealPlans";
import Recipes from "@/pages/Recipes";
import Profile from "@/pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,         // 5 minutes — data stays fresh
      gcTime: 1000 * 60 * 30,           // 30 minutes — cache survives navigation
      retry: 1,                          // one retry on error, not 3
      refetchOnWindowFocus: false,       // stop skeleton flash when switching tabs
      refetchOnReconnect: true,          // do refetch after network comes back
    },
  },
});


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/guide" component={Guide} />
      <Route path="/tracker" component={Tracker} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/plans" component={MealPlans} />
      <Route path="/recipes" component={Recipes} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <QueryClientProvider client={queryClient}>
          <NotificationsProvider>
            <AuthProvider>
              <TooltipProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                  <Router />
                </WouterRouter>
                <Toaster />
              </TooltipProvider>
            </AuthProvider>
          </NotificationsProvider>
        </QueryClientProvider>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
