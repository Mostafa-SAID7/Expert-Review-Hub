import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin();

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        login(data.token);
        setLocation("/tracker");
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "أهلاً بك في نظام الطيبات",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: error.message || "تأكد من صحة البريد الإلكتروني وكلمة المرور",
        });
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background" dir="rtl">
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center md:text-right">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 text-primary hover:text-primary/80 transition-colors">
              <Leaf className="h-6 w-6" />
              <span className="font-serif text-2xl font-bold">الطيبات</span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-foreground">تسجيل الدخول</h1>
            <p className="text-muted-foreground mt-2">مرحباً بعودتك إلى رحلة التشافي الخاصة بك</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} dir="ltr" className="text-left" />
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
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} dir="ltr" className="text-left" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              حساب جديد
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:block flex-1 relative overflow-hidden bg-primary/10">
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="/hero-food.png" 
            alt="Healthy natural food" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background/10 to-background/90" />
        </motion.div>
      </div>
    </div>
  );
}
