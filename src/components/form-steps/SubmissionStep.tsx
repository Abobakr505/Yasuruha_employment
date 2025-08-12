import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Send, CheckCircle, Clock } from 'lucide-react';
import { FormData } from '../ApplicationForm';

interface SubmissionStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  submitApplication: () => void;
  isSubmitting: boolean;
}

export const SubmissionStep: React.FC<SubmissionStepProps> = ({
  formData,
  prevStep,
  submitApplication,
  isSubmitting,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplication();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          مراجعة البيانات والإرسال
        </h2>
        <p className="text-muted-foreground">
          تأكد من صحة بياناتك قبل الإرسال النهائي
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>ملخص طلبك</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">الاسم:</p>
              <p className="font-semibold">{formData.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الوظيفة:</p>
              <p className="font-semibold">{formData.jobType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">عدد المهارات:</p>
              <p className="font-semibold">{formData.skills.length} مهارة</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">عدد المشاريع:</p>
              <p className="font-semibold">{formData.projects.filter(p => p.title).length} مشروع</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card bg-gradient-secondary">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">ماذا بعد الإرسال؟</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• سيتم مراجعة طلبك خلال 2-3 أيام </p>
            <p>• سنتواصل معك عبر الهاتف أو الواتساب </p>
            <p>• قد نطلب مقابلة عبر الفيديو</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          onClick={prevStep}
          variant="outline"
          disabled={isSubmitting}
        >
          <ArrowRight className="w-4 h-4" />
          السابق
        </Button>
        
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-primary hover:shadow-hover transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              إرسال الطلب
              <Send className="w-4 h-4 mr-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};