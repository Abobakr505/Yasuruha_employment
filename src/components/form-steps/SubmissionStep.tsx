import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Send, CheckCircle, Clock } from 'lucide-react';
import { FormData } from '../ApplicationForm';
import { motion } from 'framer-motion';

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
          مراجعة البيانات والإرسال
        </motion.h2>
        <p className="text-gray-300">
          تأكد من صحة بياناتك قبل الإرسال النهائي
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-card glass-dark border-white/10">
          <CardHeader>
            <CardTitle className="text-white">ملخص طلبك</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">الاسم:</p>
                <p className="font-semibold text-white">{formData.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">الوظيفة:</p>
                <p className="font-semibold text-white">{formData.jobType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">عدد المهارات:</p>
                <p className="font-semibold text-white">{formData.skills.length} مهارة</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">عدد المشاريع:</p>
                <p className="font-semibold text-white">{formData.projects.filter((p) => p.title).length} مشروع</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-card bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-400/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white">ماذا بعد الإرسال؟</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• سيتم مراجعة طلبك خلال 2-3 أيام</p>
              <p>• سنتواصل معك عبر الهاتف أو الواتساب</p>
              <p>• قد نطلب مقابلة عبر الفيديو</p>
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
            disabled={isSubmitting}
            className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowRight className="w-4 h-4" />
            السابق
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="group relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  إرسال الطلب
                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-[-4px] transition-transform" />
                </>
              )}
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