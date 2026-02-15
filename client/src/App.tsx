import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import FindGift from "@/pages/FindGift";
import PublicView from "@/pages/PublicView";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      
      <Route path="/login">
        <Auth mode="login" />
      </Route>
      
      <Route path="/register">
        <Auth mode="register" />
      </Route>

      <Route path="/admin" component={Dashboard} />
      
      <Route path="/find-gift" component={FindGift} />
      
      <Route path="/view/:username" component={PublicView} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
