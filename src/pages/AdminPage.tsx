
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppearanceSettings } from "@/components/admin/AppearanceSettings";
import { TemplateSettings } from "@/components/admin/TemplateSettings";
import { ExportSettings } from "@/components/admin/ExportSettings";
import { AboutApp } from "@/components/admin/AboutApp";
import CensorshipSettings from "@/components/admin/CensorshipSettings";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("appearance");

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
        <p className="text-muted-foreground mb-8">
          تخصيص إعدادات ومظهر التطبيق
        </p>

        <Card className="border-none shadow-none">
          <CardHeader className="p-0 pb-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted w-full justify-start p-0 mb-6">
                <TabsTrigger
                  value="appearance"
                  className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  المظهر
                </TabsTrigger>
                <TabsTrigger
                  value="templates"
                  className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  القوالب
                </TabsTrigger>
                <TabsTrigger
                  value="censorship"
                  className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  رقابة النصوص
                </TabsTrigger>
                <TabsTrigger
                  value="export"
                  className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  إعدادات التصدير
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  حول التطبيق
                </TabsTrigger>
              </TabsList>

              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات المظهر</CardTitle>
                    <CardDescription>
                      تخصيص المظهر العام للتطبيق
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AppearanceSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="templates">
                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات القوالب</CardTitle>
                    <CardDescription>
                      إدارة قوالب وصور التصميم
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TemplateSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="censorship">
                <Card>
                  <CardHeader>
                    <CardTitle>رقابة النصوص</CardTitle>
                    <CardDescription>
                      إعدادات وقواعد رقابة النصوص
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CensorshipSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="export">
                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات التصدير</CardTitle>
                    <CardDescription>
                      تخصيص إعدادات تصدير التصاميم
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExportSettings />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>حول التطبيق</CardTitle>
                    <CardDescription>
                      معلومات عن التطبيق والإصدار الحالي
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AboutApp />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
