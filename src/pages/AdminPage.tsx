
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppearanceSettings } from "@/components/admin/AppearanceSettings";
import { TemplateSettings } from "@/components/admin/TemplateSettings";
import { TextTemplatesSettings } from "@/components/admin/TextTemplatesSettings";
import { ExportSettings } from "@/components/admin/ExportSettings";
import { CensorshipSettings } from "@/components/admin/CensorshipSettings";
import { AboutApp } from "@/components/admin/AboutApp";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("appearance");

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-4">إعدادات المسؤول</h1>
        <p className="text-muted-foreground mb-8">
          تخصيص إعدادات التطبيق وإدارة المحتوى
        </p>

        <Tabs
          defaultValue="appearance"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            <TabsTrigger value="appearance">المظهر والخطوط</TabsTrigger>
            <TabsTrigger value="templates">القوالب والشعارات</TabsTrigger>
            <TabsTrigger value="text-templates">قوالب النصوص</TabsTrigger>
            <TabsTrigger value="export">إعدادات التصدير</TabsTrigger>
            <TabsTrigger value="censorship">رقابة النصوص</TabsTrigger>
            <TabsTrigger value="about">حول التطبيق</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="p-4 border rounded-lg">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="templates" className="p-4 border rounded-lg">
            <TemplateSettings />
          </TabsContent>

          <TabsContent value="text-templates" className="p-4 border rounded-lg">
            <TextTemplatesSettings />
          </TabsContent>

          <TabsContent value="export" className="p-4 border rounded-lg">
            <ExportSettings />
          </TabsContent>

          <TabsContent value="censorship" className="p-4 border rounded-lg">
            <CensorshipSettings />
          </TabsContent>

          <TabsContent value="about" className="p-4 border rounded-lg">
            <AboutApp />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
