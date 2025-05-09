
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, GitHub } from "lucide-react";

export const AboutApp = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">تطبيق XDesign</CardTitle>
              <CardDescription>منصة متكاملة لتصميم المحتوى الإخباري</CardDescription>
            </div>
            <Badge variant="outline" className="md:self-start px-3 py-1 text-sm h-auto">
              الإصدار 1.0.0
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">حول التطبيق</h3>
            <p className="text-muted-foreground">
              XDesign هو منصة متكاملة لتصميم المحتوى الإخباري بسهولة واحترافية،
              مع دعم كامل للغة العربية ووضع التصميم من اليمين إلى اليسار. يوفر التطبيق
              أدوات متقدمة لتحرير النصوص، وإمكانية استخدام قوالب متنوعة، بالإضافة إلى
              خيارات تخصيص كاملة للمستخدمين.
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">المميزات الرئيسية</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mr-4">
                <li>دعم كامل للغة العربية والكتابة من اليمين لليسار</li>
                <li>قوالب إخبارية متنوعة وقابلة للتخصيص</li>
                <li>أدوات متقدمة لتحرير النصوص والصور</li>
                <li>نظام رقابة نصية قابل للتخصيص</li>
                <li>تصدير التصاميم بجودة عالية</li>
                <li>وضع ليلي ونهاري</li>
                <li>تصميم متجاوب لجميع الأجهزة</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">التقنيات المستخدمة</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mr-4">
                <li>React و TypeScript</li>
                <li>Tailwind CSS للتنسيق</li>
                <li>shadcn/ui كمكتبة واجهة المستخدم</li>
                <li>React Router للتنقل بين الصفحات</li>
                <li>React Query لإدارة حالة البيانات</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-medium">المطور</h3>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="rounded-full bg-muted h-12 w-12 flex items-center justify-center">
                <span className="font-bold text-lg">A</span>
              </div>
              <div>
                <p className="font-medium">Ahjbu</p>
                <a
                  href="https://ahjbu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground flex items-center hover:underline"
                >
                  ahjbu.com
                  <ExternalLink className="h-3 w-3 mr-1 rtl:ml-1" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button variant="outline" size="sm" className="h-9">
              <GitHub className="ml-2 h-4 w-4" />
              مستودع المشروع
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              الإبلاغ عن مشكلة
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              سجل التغييرات
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>شكر خاص</CardTitle>
          <CardDescription>
            نشكر كل من ساهم في تطوير هذه المنصة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            <p>
              نتقدم بالشكر الجزيل لجميع المستخدمين والمطورين الذين قدموا ملاحظاتهم
              واقتراحاتهم لتحسين هذه المنصة. لا تترددوا في التواصل معنا لتقديم أي
              اقتراحات إضافية أو الإبلاغ عن أي مشاكل تواجهونها.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
