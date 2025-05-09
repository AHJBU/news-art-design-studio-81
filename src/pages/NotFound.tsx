
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4" dir="rtl">
      <div className="space-y-6">
        <h1 className="text-6xl font-bold text-xdesign">404</h1>
        <h2 className="text-3xl font-semibold">الصفحة غير موجودة</h2>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          عذراً، لا يمكن العثور على الصفحة التي تبحث عنها
        </p>
        <Button asChild className="xdesign-button mt-4">
          <Link to="/">العودة إلى الصفحة الرئيسية</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
