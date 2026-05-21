import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Menu, X, Activity, BookOpen, LayoutDashboard, Calendar, Utensils, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = user ? [
    { href: "/tracker", label: "التتبع اليومي", icon: Activity },
    { href: "/dashboard", label: "لوحة القيادة", icon: LayoutDashboard },
    { href: "/guide", label: "دليل الطيبات", icon: BookOpen },
    { href: "/plans", label: "الخطط", icon: Calendar },
    { href: "/recipes", label: "الوصفات", icon: Utensils },
    { href: "/profile", label: "حسابي", icon: User },
  ] : [
    { href: "/", label: "الرئيسية", icon: Activity },
    { href: "/guide", label: "دليل الطيبات", icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <span className="font-serif text-xl font-bold text-primary">الطيبات</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 items-center justify-between">
            <div className="flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-primary ${location === link.href ? "text-primary font-bold" : "text-foreground/80"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Button variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4 ml-2" />
                  تسجيل الخروج
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">تسجيل الدخول</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">حساب جديد</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            className="md:hidden p-0 h-8 w-8"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 text-sm font-medium p-2 rounded-md ${location === link.href ? "bg-primary/10 text-primary" : "text-foreground/80"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 border-t border-border">
            {user ? (
              <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/login">تسجيل الدخول</Link>
                </Button>
                <Button className="w-full" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/register">حساب جديد</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
