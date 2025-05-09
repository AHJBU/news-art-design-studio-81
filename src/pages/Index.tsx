
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { Type, Settings, Grid } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/20 dark:from-background dark:to-muted/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                XDesign
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                منصة متكاملة لتصميم المحتوى الإخباري بسهولة وإحترافية
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <FeatureCard
                title="رقابة النصوص"
                description="راجع نصوصك وطبّق عليها قواعد الرقابة قبل استخدامها"
                icon={Type}
                buttonText="استخدم الآن"
                onClick={() => navigate("/text-censorship")}
              />
              
              <FeatureCard
                title="تخصيص كامل"
                description="صمم منشورات خاصة باستخدام صورك ونصوصك المخصصة"
                icon={Settings}
                buttonText="استخدم الآن"
                onClick={() => navigate("/custom-design")}
              />
              
              <FeatureCard
                title="تصميم الأخبار"
                description="استخدم قوالب جاهزة لتصميم منشورات إخبارية بأحجام متعددة"
                icon={Grid}
                buttonText="استخدم الآن"
                onClick={() => navigate("/news-design")}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
