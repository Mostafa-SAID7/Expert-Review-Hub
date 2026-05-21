import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useLang } from "@/contexts/lang-context";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { dir } = useLang();

  return (
    <div
      className="min-h-[100dvh] flex flex-col w-full bg-background font-sans text-foreground"
      dir={dir}
    >
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
