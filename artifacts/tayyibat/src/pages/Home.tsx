import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Leaf, ShieldCheck, HeartPulse, ArrowLeft } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
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
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium tracking-wider mb-2">
              منهج د. ضياء العوضي
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight">
              نظام الطيبات الغذائي
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              تطبيق شخصي لتتبع صحتك وغذائك. يعتمد على فصل الطيبات عن الخبائث لمساعدة جسمك على التشافي الذاتي واستعادة طاقته.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full" asChild>
                <Link href="/register">
                  ابدأ تتبعك <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-background/50 backdrop-blur-sm" asChild>
                <Link href="/guide">
                  دليل الأطعمة
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">فلسفة النظام</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              يعتمد النظام على مبدأ قرآني بسيط: تناول الطيبات وتجنب الخبائث. هذا يسمح لجهاز المناعة بالتفرغ لعملية التشافي.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
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
                  <h3 className="text-xl font-bold mb-2 text-tayyib">الطيبات</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    هي الأطعمة الطبيعية المفيدة للجسم التي تهضم بسهولة وتمنح الطاقة دون أن ترهق أجهزة الجسم. تشمل الفواكه الطازجة، الخضروات، العسل، زيت الزيتون واللحوم الطبيعية.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-1 bg-khabeeth/10 p-3 rounded-xl text-khabeeth">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-khabeeth">الخبائث</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    هي الأطعمة المعالجة، السكريات الصناعية، الزيوت المهدرجة، والقمح المعدل. تسبب هذه الأطعمة التهابات مستمرة وتستنزف طاقة الجسم ومناعته.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-1 bg-primary/10 p-3 rounded-xl text-primary">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">التشافي الذاتي</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    عندما نوقف إدخال الخبائث للجسم، يتوقف الجسم عن حالة الطوارئ المستمرة ويبدأ في إصلاح الخلايا وعلاج الأمراض المزمنة.
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
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-serif font-bold mb-1">د. ضياء العوضي</h3>
                  <p className="text-white/80 text-sm">مؤسس نظام الطيبات</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container px-4 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold">جاهز لبدء رحلة التشافي؟</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl">
            سجل الآن مجاناً وتتبع وجباتك، الصيام، ومستويات طاقتك يومياً مع نظام الطيبات.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full mt-4" asChild>
            <Link href="/register">ابدأ الآن مجاناً</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
