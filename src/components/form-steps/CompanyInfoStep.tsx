import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Users, Target, Award } from 'lucide-react';
import { FormData } from '../ApplicationForm';

interface CompanyInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({
  nextStep,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          مرحباً بك في شركة يـسِّرها
        </h2>
        <p className="text-muted-foreground text-lg">
          اكتشف فرص مهنية مميزة في بيئة عمل إبداعية
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card hover:shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary" />
              عن الشركة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              شركة يـسِّرها هي شركة في البدايه في مجال تطوير البرمجيات والحلول التقنية المبتكرة. 
              نحن نسعى لتقديم أفضل الخدمات التقنية لعملائنا من خلال فريق متخصص ومبدع.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">تطوير البرمجيات</Badge>
              <Badge variant="secondary">تطبيقات الجوال</Badge>
              <Badge variant="secondary">الذكاء الاصطناعي</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              رؤيتنا ورسالتنا
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">رؤيتنا:</h4>
              <p className="text-muted-foreground text-sm">
                أن نكون الشركة الرائدة في المنطقة في تقديم الحلول التقنية المبتكرة
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">رسالتنا:</h4>
              <p className="text-muted-foreground text-sm">
                تمكين الشركات والأفراد من خلال التكنولوجيا المتطورة والخدمات المتميزة
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            الوظائف المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gradient-primary text-white">
              <h4 className="font-semibold mb-2">مطور مواقع</h4>
              <p className="text-sm opacity-90">
                تطوير مواقع ويب متطورة وتطبيقات ويب تفاعلية
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-accent text-white">
              <h4 className="font-semibold mb-2">مطور تطبيقات</h4>
              <p className="text-sm opacity-90">
                تطوير تطبيقات الجوال لأنظمة iOS و Android
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-secondary text-foreground">
              <h4 className="font-semibold mb-2">خبير الاستضافة</h4>
              <p className="text-sm opacity-75">
                إدارة الخوادم وخدمات الاستضافة والحماية
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary text-primary-foreground">
              <h4 className="font-semibold mb-2">مطور برامج محاسبة</h4>
              <p className="text-sm opacity-90">
                تطوير أنظمة محاسبية وبرامج إدارة مالية
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Award className="w-6 h-6 text-primary" />
            مزايا العمل معنا
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">بيئة عمل مميزة</h4>
              <p className="text-sm text-muted-foreground">
                فريق متعاون وبيئة عمل إبداعية ومحفزة
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">فرص نمو مهني</h4>
              <p className="text-sm text-muted-foreground">
                برامج تدريبية وفرص تطوير المهارات
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">مكافآت تنافسية</h4>
              <p className="text-sm text-muted-foreground">
                  مكافآت أداء ومزايا إضافية
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={nextStep}
          className="bg-gradient-primary hover:shadow-hover transition-all duration-300"
        >
          التالي
          <ArrowLeft className="w-4 h-4 mr-2" />
        </Button>
      </div>
    </div>
  );
};