import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Leaf, ShieldCheck, HeartPulse, ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/lang-context";

export default function Home() {
  const { t, dir } = useLang();
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/80 md:bg-background/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <img
            src="/hero-food.png"
            alt="Healthy natural food"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="container relative z-20 px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-3xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-2">
              {t("home_hero_badge")}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight">
              {t("home_hero_title")}
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              {t("home_hero_sub")}
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base px-6 py-3 rounded-lg" asChild>
                <Link href="/register">
                  {t("home_cta_start")}
                  <ArrowIcon className="ms-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-6 py-3 rounded-lg bg-background/50 backdrop-blur-sm"
                asChild
              >
                <Link href="/guide">{t("home_cta_guide")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-background">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t("home_philosophy")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {dir === "rtl"
                ? "يعتمد النظام على مبدأ قرآني بسيط: تناول الطيبات وتجنب الخبائث. هذا يسمح لجهاز المناعة بالتفرغ لعملية التشافي."
                : "The system is based on a simple Quranic principle: eat what is wholesome and avoid what is harmful. This allows the immune system to focus on the healing process."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-1 bg-tayyib/10 p-3 rounded-xl text-tayyib">
                  <Leaf className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-tayyib">
                    {dir === "rtl" ? "الطيبات" : "Tayyibat (Wholesome)"}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {dir === "rtl"
                      ? "هي الأطعمة الطبيعية المفيدة للجسم التي تهضم بسهولة وتمنح الطاقة دون أن ترهق أجهزة الجسم."
                      : "Natural foods beneficial to the body that digest easily and provide energy without burdening the body's systems."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-1 bg-khabeeth/10 p-3 rounded-xl text-khabeeth">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-khabeeth">
                    {dir === "rtl" ? "الخبائث" : "Khabeeth (Harmful)"}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {dir === "rtl"
                      ? "هي الأطعمة المعالجة، السكريات الصناعية، الزيوت المهدرجة، والقمح المعدل. تسبب التهابات مستمرة."
                      : "Processed foods, artificial sugars, hydrogenated oils, and modified wheat. These cause chronic inflammation."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-1 bg-primary/10 p-3 rounded-xl text-primary">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {dir === "rtl" ? "التشافي الذاتي" : "Self-Healing"}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {dir === "rtl"
                      ? "عندما نوقف إدخال الخبائث للجسم، يبدأ في إصلاح الخلايا وعلاج الأمراض المزمنة."
                      : "When we stop introducing harmful foods, the body begins to repair cells and treat chronic diseases."}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] max-h-[600px] mx-auto w-full max-w-md"
            >
              <img
                src="/dr-dhia.png"
                alt="Dr. Dhia Al-Awadi"
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-serif font-bold mb-1">
                    {dir === "rtl" ? "د. ضياء العوضي" : "Dr. Dhia Al-Awadi"}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {dir === "rtl" ? "مؤسس نظام الطيبات" : "Founder of the Tayyibat System"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container px-4 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold">{t("home_cta_section")}</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl">{t("home_cta_section_sub")}</p>
          <Button size="lg" variant="secondary" className="text-base px-6 py-3 rounded-lg mt-4" asChild>
            <Link href="/register">{t("home_start_free")}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
