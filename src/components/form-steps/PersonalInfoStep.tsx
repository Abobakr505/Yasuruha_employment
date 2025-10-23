import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, User, Phone, Calendar, Briefcase, Link } from 'lucide-react';
import { FormData } from '../ApplicationForm';
import { motion } from 'framer-motion';

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

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 glass-dark p-8 rounded-2xl border border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <motion.h2
          className="text-3xl font-bold text-white mb-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          البيانات الشخصية
        </motion.h2>
        <p className="text-gray-300">أدخل بياناتك الشخصية ومعلومات التواصل</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={inputVariants} initial="hidden" animate="visible" className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2 text-white">
            <User className="w-4 h-4 text-emerald-400" />
            الاسم الكامل *
          </Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            placeholder="أدخل اسمك الكامل"
            required
            className="text-right bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-emerald-400/50 transition-all"
          />
        </motion.div>

        <motion.div variants={inputVariants} initial="hidden" animate="visible" className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-white">
            <Phone className="w-4 h-4 text-emerald-400" />
            رقم الهاتف *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="05xxxxxxxx"
            required
            className="text-right bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-emerald-400/50 transition-all"
            dir="ltr"
          />
        </motion.div>

        <motion.div variants={inputVariants} initial="hidden" animate="visible" className="space-y-2">
          <Label htmlFor="age" className="flex items-center gap-2 text-white">
            <Calendar className="w-4 h-4 text-emerald-400" />
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
            className="text-right bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-emerald-400/50 transition-all"
          />
        </motion.div>

        <motion.div variants={inputVariants} initial="hidden" animate="visible" className="space-y-2">
          <Label htmlFor="jobType" className="flex items-center gap-2 text-white">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            الوظيفة المطلوبة *
          </Label>
          <Select
            value={formData.jobType}
            onValueChange={(value) => updateFormData({ jobType: value })}
          >
            <SelectTrigger className="text-right bg-white/5 border-white/20 text-white focus:ring-emerald-400/50">
              <SelectValue placeholder="اختر الوظيفة" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/20 text-white">
              <SelectItem value="web_developer">مطور مواقع ويب</SelectItem>
              <SelectItem value="app_developer">مطور تطبيقات</SelectItem>
              <SelectItem value="hosting_expert">خبير استضافة ودومينز</SelectItem>
              <SelectItem value="accounting_developer">مطور برامج محاسبة</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      <motion.div variants={inputVariants} initial="hidden" animate="visible" className="space-y-2">
        <Label htmlFor="portfolioUrl" className="flex items-center gap-2 text-white">
          <Link className="w-4 h-4 text-emerald-400" />
          رابط البورتفوليو (اختياري)
        </Label>
        <Input
          id="portfolioUrl"
          type="url"
          value={formData.portfolioUrl}
          onChange={(e) => updateFormData({ portfolioUrl: e.target.value })}
          placeholder="https://example.com/portfolio"
          className="text-left bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-emerald-400/50 transition-all"
          dir="ltr"
        />
        <p className="text-sm text-gray-300">
          يمكنك إضافة رابط لأعمالك السابقة أو موقعك الشخصي
        </p>
      </motion.div>

      <div className="flex justify-between pt-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowRight className="w-4 h-4" />
            السابق
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            className="group relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              التالي
              <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-4px] transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
};