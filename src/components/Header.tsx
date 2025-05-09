
import { ThemeToggle } from "@/components/ThemeToggle";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="font-bold text-xl text-xdesign flex items-center">
          XDesign
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/news-design" className="text-foreground hover:text-xdesign transition-colors">
            تصميم الأخبار
          </Link>
          <Link to="/custom-design" className="text-foreground hover:text-xdesign transition-colors">
            تخصيص كامل
          </Link>
          <Link to="/text-censorship" className="text-foreground hover:text-xdesign transition-colors">
            رقابة النصوص
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link 
            to="/admin" 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            title="إعدادات المسؤول"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
