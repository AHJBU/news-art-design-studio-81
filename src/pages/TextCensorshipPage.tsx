
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const TextCensorshipPage = () => {
  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">رقابة النصوص</h1>
        <p className="text-muted-foreground mb-8">
          راجع نصوصك وطبّق عليها قواعد الرقابة المناسبة
        </p>
        
        <div className="grid place-content-center h-[400px] bg-muted/20 rounded-lg border border-dashed text-muted-foreground">
          قريباً - واجهة رقابة النصوص
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextCensorshipPage;
