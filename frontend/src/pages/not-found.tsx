import { motion } from "framer-motion";
import { Link } from "wouter";
import { Leaf, Home, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/lang-context";

const floatingLeaves = [
  { x: "10%", delay: 0,   duration: 6,   size: 18, rotate: 20  },
  { x: "25%", delay: 1.2, duration: 8,   size: 12, rotate: -30 },
  { x: "45%", delay: 0.5, duration: 7,   size: 22, rotate: 15  },
  { x: "65%", delay: 2,   duration: 5.5, size: 14, rotate: -20 },
  { x: "80%", delay: 0.8, duration: 9,   size: 10, rotate: 35  },
  { x: "90%", delay: 1.6, duration: 6.5, size: 16, rotate: -10 },
];

export default function NotFound() {
  const { dir, t } = useLang();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-background overflow-hidden relative"
      dir={dir}
    >
      {/* Animated background gradient orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--tayyib)/0.12) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.10) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Floating leaves */}
      {floatingLeaves.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute top-0 text-primary/20 pointer-events-none"
          style={{ left: leaf.x }}
          initial={{ y: "-10%", opacity: 0, rotate: leaf.rotate }}
          animate={{ y: "110vh", opacity: [0, 0.7, 0.7, 0], rotate: leaf.rotate + 180 }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 3,
          }}
        >
          <Leaf style={{ width: leaf.size, height: leaf.size }} />
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4 text-center"
      >
        {/* Glass card */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-2xl p-10 overflow-hidden relative">
          {/* Inner shimmer */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--tayyib)/0.06) 0%, transparent 60%)",
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 404 number */}
          <motion.div
            className="relative"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="text-[8rem] font-black leading-none select-none"
              style={{
                background: "linear-gradient(135deg, hsl(var(--tayyib)) 0%, hsl(var(--primary)) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 4px 24px hsl(var(--tayyib)/0.3))",
              }}
            >
              404
            </span>
          </motion.div>

          {/* Leaf icon with pulse */}
          <motion.div
            className="flex justify-center mb-5 -mt-4"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 14 }}
          >
            <motion.div
              className="h-14 w-14 rounded-full bg-tayyib/10 flex items-center justify-center"
              animate={{ boxShadow: ["0 0 0 0 hsl(var(--tayyib)/0.3)", "0 0 0 14px hsl(var(--tayyib)/0)", "0 0 0 0 hsl(var(--tayyib)/0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Leaf className="h-7 w-7 text-tayyib" />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold font-serif mb-2">
              {dir === "rtl" ? "الصفحة غير موجودة" : "Page Not Found"}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              {dir === "rtl"
                ? "يبدو أنك وصلت إلى صفحة غير موجودة. ربما تم نقلها أو حذفها."
                : "Looks like this page doesn't exist. It may have been moved or removed."}
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="my-7 h-px bg-border w-2/3 mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          />

          {/* Back home button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px hsl(var(--tayyib)/0.3)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl font-semibold text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--tayyib)) 0%, hsl(var(--primary)) 100%)",
                  color: "hsl(var(--tayyib-foreground, 255 255 255))",
                }}
              >
                <Home className="h-4 w-4" />
                {dir === "rtl" ? "العودة للرئيسية" : "Back to Home"}
                <motion.span
                  animate={{ x: dir === "rtl" ? [-2, 2, -2] : [2, -2, 2] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* App branding */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-1.5 text-muted-foreground/60 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Leaf className="h-3 w-3" />
          <span>{t("appName")}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
