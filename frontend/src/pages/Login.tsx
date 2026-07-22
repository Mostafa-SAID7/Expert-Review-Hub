import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notifications-context";
import { useLang } from "@/contexts/lang-context";
import { useTheme } from "@/contexts/theme-context";
import { Leaf, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { t, dir, toggleLang, lang } = useLang();
  const { theme, toggleTheme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useLogin();

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(
      { data: values },
      {
        onSuccess: data => {
          login(data.token);
          setLocation("/tracker");
          toast({ title: t("notif_welcome"), description: t("notif_welcome_body") });
          addNotification({ title: t("notif_welcome"), body: t("notif_welcome_body"), icon: "system" });
        },
        onError: error => {
          toast({
            variant: "destructive",
            title: dir === "rtl" ? "خطأ في تسجيل الدخول" : "Login failed",
            description: error.message || (dir === "rtl" ? "تأكد من صحة البريد وكلمة المرور" : "Check your email and password"),
          });
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background" dir={dir}>
      {/* Controls */}
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <button
          onClick={toggleLang}
          className="h-8 px-3 text-xs font-bold rounded-full border border-border bg-background/80 backdrop-blur text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("switchLang")}
        </button>
        <button
          onClick={toggleTheme}
          className="h-8 w-8 flex items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className={`text-center ${dir === "rtl" ? "md:text-right" : "md:text-left"}`}>
            <Link href="/" className="inline-flex items-center gap-2 mb-8 text-primary hover:text-primary/80 transition-colors">
              <Leaf className="h-6 w-6" />
              <span className="font-serif text-2xl font-bold">{t("appShort")}</span>
            </Link>
            <h1 className="text-3xl font-serif font-bold">{t("login_heading")}</h1>
            <p className="text-muted-foreground mt-2 text-sm">{t("login_sub")}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        autoComplete="email"
                        dir="ltr"
                        className="text-left"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        dir="ltr"
                        className="text-left"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={loginMutation.isPending}>
                {loginMutation.isPending
                  ? (dir === "rtl" ? "جاري تسجيل الدخول..." : "Signing in...")
                  : t("login")}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            {t("no_account")}{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              {t("login_link")}
            </Link>
          </p>
        </div>
      </div>

      {/* Image panel */}
      <div className="hidden md:block flex-1 relative overflow-hidden bg-primary/10">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src="/hero-food.png" alt="Healthy natural food" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-l from-background/10 to-background/90" />
        </motion.div>
      </div>
    </div>
  );
}
