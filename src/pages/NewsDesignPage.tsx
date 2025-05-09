
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const NewsDesignPage = () => {
  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">تصميم الأخبار</h1>
        <p className="text-muted-foreground mb-8">
          صمم منشورات إخبارية احترافية باستخدام القوالب الجاهزة
        </p>
        
        <div className="grid place-content-center h-[400px] bg-muted/20 rounded-lg border border-dashed text-muted-foreground">
          قريباً - واجهة تصميم الأخبار
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDesignPage;
