import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, GraduationCap, Clock, Users, Target } from 'lucide-react';
import { FormData } from '../ApplicationForm';
import { motion } from 'framer-motion';

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

  const trainingFeatures = [
    {
      icon: Clock,
      title: 'مدة التدريب',
      description: 'شهر واحد على حسب التخصص والخبرة السابقة',
      gradient: 'from-emerald-500/20 to-cyan-500/20',
    },
    {
      icon: Users,
      title: 'التدريب العملي',
      description: 'العمل مع فريق متخصص على مشاريع حقيقية',
      gradient: 'from-cyan-500/20 to-purple-500/20',
    },
  ];

  const trainingStages = [
    {
      week: 'الأسابيع 1-2',
      title: 'التعارف والتأهيل',
      description: 'التعرف على بيئة العمل وثقافة الشركة والأدوات المستخدمة',
    },
    {
      week: 'الأسابيع 3-4',
      title: 'التدريب العملي',
      description: 'العمل على مشاريع تدريبية تحت إشراف المطورين الأكبر',
    },
    {
      week: 'الأسابيع 5-6',
      title: 'المشاريع الحقيقية',
      description: 'المشاركة في مشاريع العملاء الفعلية مع المتابعة المستمرة',
    },
    {
      week: 'الأسابيع 7+',
      title: 'التقييم والانتقال',
      description: 'تقييم الأداء واتخاذ قرار التوظيف الدائم',
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
          برنامج التدريب والتأهيل
        </motion.h2>
        <p className="text-gray-300">
          تعرف على برنامج التدريب الشامل الذي نوفره للموظفين الجدد
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-card bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <GraduationCap className="w-6 h-6" />
              نظرة عامة على التدريب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 leading-relaxed">
              في شركة يسِّرها، نؤمن بأهمية الاستثمار في الموظفين الجدد. برنامج التدريب لدينا مصمم خصيصاً 
              لضمان اندماجك بنجاح في فريق العمل وتطوير مهاراتك التقنية والمهنية
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {trainingFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <motion.div variants={itemVariants} key={index}>
              <Card className={`shadow-card hover:shadow-hover transition-all duration-300 glass-dark border-white/10 bg-gradient-to-r ${feature.gradient}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <IconComponent className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-white">{feature.title}</h3>
                      <p className="text-sm text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-card glass-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Target className="w-6 h-6 text-emerald-400" />
              مراحل برنامج التدريب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainingStages.map((stage, index) => (
              <motion.div
                key={index}
                className="flex gap-4 p-4 rounded-lg bg-white/5"
                variants={itemVariants}
              >
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="bg-emerald-500 text-white border-emerald-400">
                    {stage.week}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{stage.title}</h4>
                  <p className="text-sm text-gray-300">{stage.description}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-card glass-dark border-l-4 border-l-emerald-400">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-400">
              معلومات مهمة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-2">💼 خلال فترة التدريب:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• تدريب عملي على مشاريع</li>
                  <li>• تعلم طريقة التواصل وتنظيم العمل بال Git & Github</li>
                  <li>• بيئة عمل مرنة ومشجعة</li>
                  <li>• إمكانية العمل عن بُعد</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🎯 في نهاية التدريب:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• تقييم شامل للأداء</li>
                  <li>• فرصة للحصول على وظيفة دائمة</li>
                  <li>• وستكون فرد أساسي في الشركة وضمن فريق العمل</li>
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
              التالي - الإرسال النهائي
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