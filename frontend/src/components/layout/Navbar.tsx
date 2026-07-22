import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLang } from "@/contexts/lang-context";
import { useTheme } from "@/contexts/theme-context";
import { useNotifications } from "@/contexts/notifications-context";
import {
  LogOut, Menu, X, Activity, BookOpen, LayoutDashboard,
  Calendar, Utensils, User, Sun, Moon, Bell, Check, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "الآن";
  if (m < 60) return `${m} د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} س`;
  return `${Math.floor(h / 24)} ي`;
}

const ICON_MAP: Record<string, string> = {
  meal: "🍽️",
  water: "💧",
  plan: "📅",
  system: "🔔",
};

export function Navbar() {
  const { user, logout } = useAuth();
  const { t, dir, toggleLang, lang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close bell dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = user ? [
    { href: "/tracker", label: t("nav_tracker"), icon: Activity },
    { href: "/dashboard", label: t("nav_dashboard"), icon: LayoutDashboard },
    { href: "/guide", label: t("nav_guide"), icon: BookOpen },
    { href: "/plans", label: t("nav_plans"), icon: Calendar },
    { href: "/recipes", label: t("nav_recipes"), icon: Utensils },
    { href: "/profile", label: t("nav_profile"), icon: User },
  ] : [
    { href: "/", label: t("nav_home"), icon: Activity },
    { href: "/guide", label: t("nav_guide_guest"), icon: BookOpen },
  ];

  const isRtl = dir === "rtl";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo */}
          <Link href="/" className={`flex items-center gap-2 ${isRtl ? "ml-6" : "mr-6"}`}>
            <span className="font-serif text-xl font-bold text-primary">{t("appShort")}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 items-center justify-between">
            <div className="flex items-center gap-5 text-sm font-medium">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-primary ${location === link.href ? "text-primary font-bold" : "text-foreground/70"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Lang toggle */}
              <button
                onClick={toggleLang}
                className="h-8 px-3 text-xs font-bold rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
              >
                {t("switchLang")}
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                title={theme === "light" ? "Dark mode" : "Light mode"}
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              {/* Notification bell */}
              {user && (
                <div className="relative" ref={bellRef}>
                  <button
                    onClick={() => { setBellOpen(o => !o); if (!bellOpen) markAllRead(); }}
                    className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors relative"
                    title={t("notifications")}
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {bellOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute ${isRtl ? "left-0" : "right-0"} top-10 w-80 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden`}
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                          <span className="font-bold text-sm">{t("notifications")}</span>
                          <div className="flex gap-2">
                            {notifications.length > 0 && (
                              <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="py-10 text-center text-sm text-muted-foreground">
                              <Bell className="h-6 w-6 mx-auto mb-2 opacity-30" />
                              {t("no_notifications")}
                            </div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} className={`px-4 py-3 border-b border-border/50 last:border-0 ${n.read ? "opacity-60" : ""}`}>
                                <div className="flex items-start gap-3">
                                  <span className="text-base mt-0.5">{ICON_MAP[n.icon ?? "system"]}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">{n.title}</div>
                                    {n.body && <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>}
                                  </div>
                                  <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(n.createdAt)}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Auth */}
              {user ? (
                <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
                  <LogOut className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                  {t("logout")}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">{t("login")}</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">{t("register")}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: right-side controls */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={toggleLang}
              className="h-8 px-2 text-xs font-bold rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("switchLang")}
            </button>
            <button
              onClick={toggleTheme}
              className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            {user && (
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => { setBellOpen(o => !o); markAllRead(); }}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground relative"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {bellOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className={`absolute ${isRtl ? "left-0" : "right-0"} top-10 w-72 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden`}
                    >
                      <div className="px-4 py-3 border-b border-border font-bold text-sm">{t("notifications")}</div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-sm text-muted-foreground">{t("no_notifications")}</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className={`px-4 py-3 border-b border-border/50 last:border-0 ${n.read ? "opacity-60" : ""}`}>
                              <div className="flex items-start gap-2">
                                <span className="text-sm mt-0.5">{ICON_MAP[n.icon ?? "system"]}</span>
                                <div className="flex-1">
                                  <div className="font-medium text-xs">{n.title}</div>
                                  {n.body && <div className="text-xs text-muted-foreground">{n.body}</div>}
                                </div>
                                <span className="text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <Button
              variant="ghost"
              className="p-0 h-8 w-8"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 text-sm font-medium p-2.5 rounded-xl transition-colors ${
                      location === link.href ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-border mt-3">
                {user ? (
                  <button
                    className="flex items-center gap-3 w-full text-sm font-medium p-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={() => { logout(); setMobileOpen(false); }}
                  >
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full" asChild onClick={() => setMobileOpen(false)}>
                      <Link href="/login">{t("login")}</Link>
                    </Button>
                    <Button className="w-full" asChild onClick={() => setMobileOpen(false)}>
                      <Link href="/register">{t("register")}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
