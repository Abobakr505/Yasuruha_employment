import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, GraduationCap, Clock, Users, Award, BookOpen, Target } from 'lucide-react';
import { FormData } from '../ApplicationForm';

interface TrainingInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

export const TrainingInfoStep: React.FC<TrainingInfoStepProps> = ({
  nextStep,
  prevStep,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const trainingFeatures = [
    {
      icon: Clock,
      title: 'مدة التدريب',
      description: ' شهر واحد  علي حسب التخصص والخبرة السابقة',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      icon: Users,
      title: 'التدريب العملي',
      description: 'العمل مع فريق متخصص على مشاريع حقيقية',
      color: 'bg-green-50 text-green-600 border-green-200'
    }
  ];

  const trainingStages = [
    {
      week: 'الأسابيع 1-2',
      title: 'التعارف والتأهيل',
      description: 'التعرف على بيئة العمل وثقافة الشركة والأدوات المستخدمة'
    },
    {
      week: 'الأسابيع 3-4',
      title: 'التدريب العملي',
      description: 'العمل على مشاريع تدريبية تحت إشراف المطورين الأكبر'
    },
    {
      week: 'الأسابيع 5-6',
      title: 'المشاريع الحقيقية',
      description: 'المشاركة في مشاريع العملاء الفعلية مع المتابعة المستمرة'
    },
    {
      week: 'الأسابيع 7+',
      title: 'التقييم والانتقال',
      description: 'تقييم الأداء واتخاذ قرار التوظيف الدائم'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          برنامج التدريب والتأهيل
        </h2>
        <p className="text-muted-foreground">
          تعرف على برنامج التدريب الشامل الذي نوفره للموظفين الجدد
        </p>
      </div>

      {/* Training Overview */}
      <Card className="shadow-card bg-gradient-primary text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <GraduationCap className="w-6 h-6" />
            نظرة عامة على التدريب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/90 leading-relaxed">
            في شركة يسِّرها ، نؤمن بأهمية الاستثمار في الموظفين الجدد. برنامج التدريب لدينا مصمم خصيصاً 
            لضمان اندماجك بنجاح في فريق العمل وتطوير مهاراتك التقنية والمهنية
          </p>
        </CardContent>
      </Card>

      {/* Training Features */}
      <div className="grid md:grid-cols-2 gap-4">
        {trainingFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className={`shadow-card hover:shadow-hover transition-all duration-300 border-2 ${feature.color}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/50">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm opacity-80">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Training Timeline */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            مراحل برنامج التدريب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trainingStages.map((stage, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex-shrink-0">
                <Badge variant="outline" className="bg-primary text-primary-foreground">
                  {stage.week}
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{stage.title}</h4>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="shadow-card border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="text-lg text-primary">
            معلومات مهمة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-2">💼 خلال فترة التدريب:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• تدريب عملي على مشاريع </li>
                <li>• تعلم طريقه النواصل وتنظيم العمل بال Git & Github</li>
                <li>• بيئة عمل مرنة ومشجعة</li>
                <li>• إمكانية العمل عن بُعد</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">🎯 في نهاية التدريب:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• تقييم شامل للأداء</li>
                <li>• فرصة للحصول على وظيفة دائمة</li>
                <li>• وستكون فرد اساسي في الشركه وضمن فريق العمل </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          onClick={prevStep}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          السابق
        </Button>
        
        <Button 
          type="submit"
          className="bg-gradient-primary hover:shadow-hover transition-all duration-300"
        >
          التالي - الإرسال النهائي
          <ArrowLeft className="w-4 h-4 mr-2" />
        </Button>
      </div>
    </form>
  );
};