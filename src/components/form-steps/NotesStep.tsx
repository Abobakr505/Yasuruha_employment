import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, MessageSquare, Lightbulb, Target, Star } from 'lucide-react';
import { FormData } from '../ApplicationForm';

interface NotesStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

export const NotesStep: React.FC<NotesStepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const suggestions = [
    {
      icon: Lightbulb,
      title: 'خبراتك المميزة',
      description: 'اذكر أي خبرات خاصة أو مشاريع مميزة قمت بها'
    },
    {
      icon: Target,
      title: 'أهدافك المهنية',
      description: 'ما هي أهدافك وطموحاتك في هذا المجال؟'
    },
    {
      icon: Star,
      title: 'ما يميزك',
      description: 'ما الذي يجعلك الخيار الأفضل لهذه الوظيفة؟'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          ملاحظات وتفاصيل إضافية
        </h2>
        <p className="text-muted-foreground">
          أخبرنا المزيد عن نفسك وما يمكنك تقديمه للشركة
        </p>
      </div>

      {/* Suggestions */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <Card key={index} className="shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <IconComponent className="w-4 h-4 text-primary" />
                  {suggestion.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  {suggestion.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Notes Field */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          ملاحظاتك وما يمكنك تقديمه للشركة
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateFormData({ notes: e.target.value })}
          placeholder="اكتب هنا أي معلومات إضافية تريد مشاركتها معنا، مثل:
• خبراتك الخاصة والمميزة
• المشاريع التي تفتخر بها
• أهدافك المهنية وطموحاتك
• ما يميزك عن غيرك من المتقدمين
• أي مهارات أو خبرات لم تذكرها سابقاً
• رؤيتك لمستقبل هذا المجال
• كيف يمكنك إضافة قيمة للشركة"
          className="text-right min-h-[200px] leading-relaxed"
          dir="rtl"
        />
        <p className="text-sm text-muted-foreground">
          نصيحة: كن صادقاً ومحدداً في وصف إنجازاتك وخبراتك
        </p>
      </div>

      {/* Tips Card */}
      <Card className="bg-gradient-secondary border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Star className="w-5 h-5" />
            نصائح لكتابة ملاحظات مميزة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-2">✅ اذكر:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• إنجازات محددة بأرقام</li>
                <li>• تقنيات حديثة تتقنها</li>
                <li>• مشاكل حلتها بطريقة إبداعية</li>
                <li>• شهادات أو دورات حصلت عليها</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">❌ تجنب:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• الكلام العام بدون تفاصيل</li>
                <li>• نسخ النص من مصادر أخرى</li>
                <li>• المبالغة في الوصف</li>
                <li>• التركيز على النواقص</li>
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
          التالي
          <ArrowLeft className="w-4 h-4 mr-2" />
        </Button>
      </div>
    </form>
  );
};