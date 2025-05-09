
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const AdminPage = () => {
  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">إعدادات المسؤول</h1>
        <p className="text-muted-foreground mb-8">
          تخصيص إعدادات التطبيق وإدارة المحتوى
        </p>
        
        <div className="grid place-content-center h-[400px] bg-muted/20 rounded-lg border border-dashed text-muted-foreground">
          قريباً - واجهة إعدادات المسؤول
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
