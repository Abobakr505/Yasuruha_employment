import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, MessageSquare, Lightbulb, Target, Star } from 'lucide-react';
import { FormData } from '../ApplicationForm';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const suggestions = [
    {
      icon: Lightbulb,
      title: 'خبراتك المميزة',
      description: 'اذكر أي خبرات خاصة أو مشاريع مميزة قمت بها',
    },
    {
      icon: Target,
      title: 'أهدافك المهنية',
      description: 'ما هي أهدافك وطموحاتك في هذا المجال؟',
    },
    {
      icon: Star,
      title: 'ما يميزك',
      description: 'ما الذي يجعلك الخيار الأفضل لهذه الوظيفة؟',
    },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 glass-dark p-8 rounded-2xl border border-white/10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <motion.h2
          className="text-3xl font-bold text-white mb-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          ملاحظات وتفاصيل إضافية
        </motion.h2>
        <p className="text-gray-300">
          أخبرنا المزيد عن نفسك وما يمكنك تقديمه للشركة
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <motion.div variants={itemVariants} key={index}>
              <Card className="shadow-card hover:shadow-hover transition-all duration-300 glass-dark border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-white">
                    <IconComponent className="w-4 h-4 text-emerald-400" />
                    {suggestion.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-300">{suggestion.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="notes" className="flex items-center gap-2 text-white">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          ملاحظاتك وما يمكنك تقديمه للشركة
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateFormData({ notes: e.target.value })}
          placeholder="اكتب هنا أي معلومات إضافية تريد مشاركتها معنا، مثل: ..."
          className="text-right min-h-[200px] leading-relaxed bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-emerald-400/50 transition-all"
          dir="rtl"
        />
        <p className="text-sm text-gray-300">
          نصيحة: كن صادقاً ومحدداً في وصف إنجازاتك وخبراتك
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-400/30">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-400 flex items-center gap-2">
              <Star className="w-5 h-5" />
              نصائح لكتابة ملاحظات مميزة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-2">✅ اذكر:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• إنجازات محددة بأرقام</li>
                  <li>• تقنيات حديثة تتقنها</li>
                  <li>• مشاكل حلتها بطريقة إبداعية</li>
                  <li>• شهادات أو دورات حصلت عليها</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">❌ تجنب:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• الكلام العام بدون تفاصيل</li>
                  <li>• نسخ النص من مصادر أخرى</li>
                  <li>• المبالغة في الوصف</li>
                  <li>• التركيز على النواقص</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-between pt-6">
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
      </motion.div>
    </motion.form>
  );
};