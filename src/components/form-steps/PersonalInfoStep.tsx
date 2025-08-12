import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, User, Phone, Calendar, Briefcase, Link } from 'lucide-react';
import { FormData } from '../ApplicationForm';

interface PersonalInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.age || !formData.jobType) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          البيانات الشخصية
        </h2>
        <p className="text-muted-foreground">
          أدخل بياناتك الشخصية ومعلومات التواصل
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            الاسم الكامل *
          </Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            placeholder="أدخل اسمك الكامل"
            required
            className="text-right"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            رقم الهاتف *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="05xxxxxxxx"
            required
            className="text-right"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            العمر *
          </Label>
          <Input
            id="age"
            type="number"
            max="65"
            value={formData.age || ''}
            onChange={(e) => updateFormData({ age: parseInt(e.target.value) || 0 })}
            placeholder="أدخل عمرك"
            required
            className="text-right"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobType" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            الوظيفة المطلوبة *
          </Label>
          <Select value={formData.jobType} onValueChange={(value) => updateFormData({ jobType: value })}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="اختر الوظيفة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web_developer">مطور مواقع ويب</SelectItem>
              <SelectItem value="app_developer">مطور تطبيقات</SelectItem>
              <SelectItem value="hosting_expert">خبير استضافة ودومينز</SelectItem>
              <SelectItem value="accounting_developer">مطور برامج محاسبة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolioUrl" className="flex items-center gap-2">
          <Link className="w-4 h-4 text-primary" />
          رابط البورتفوليو (اختياري)
        </Label>
        <Input
          id="portfolioUrl"
          type="url"
          value={formData.portfolioUrl}
          onChange={(e) => updateFormData({ portfolioUrl: e.target.value })}
          placeholder="https://example.com/portfolio"
          className="text-left"
          dir="ltr"
        />
        <p className="text-sm text-muted-foreground">
          يمكنك إضافة رابط لأعمالك السابقة أو موقعك الشخصي
        </p>
      </div>

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