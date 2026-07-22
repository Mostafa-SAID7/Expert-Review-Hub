import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, type ReactNode } from "react";
import { Layout } from "./Layout";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  // While auth is resolving, show a full structural skeleton instead of a
  // blank spinner — users perceive the page as loading rather than broken.
  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!user) {
    // Redirect is in flight — render nothing to avoid flash of protected content
    return null;
  }

  return <Layout>{children}</Layout>;
}
