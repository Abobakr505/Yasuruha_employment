import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Users, Target, Award } from 'lucide-react';
import { FormData } from '../ApplicationForm';
import { motion } from 'framer-motion';

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
    <motion.div
      className="space-y-6 glass-dark p-8 rounded-2xl border border-white/10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <motion.h2
          className="text-3xl font-bold text-white mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          مرحباً بك في شركة يـسِّرها
        </motion.h2>
        <p className="text-gray-300 text-lg">
          اكتشف فرص مهنية مميزة في بيئة عمل إبداعية
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="shadow-card hover:shadow-hover transition-all duration-300 glass-dark border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Building2 className="w-6 h-6 text-emerald-400" />
                عن الشركة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                شركة يـسِّرها هي شركة في البدايه في مجال تطوير البرمجيات والحلول التقنية المبتكرة. 
                نحن نسعى لتقديم أفضل الخدمات التقنية لعملائنا من خلال فريق متخصص ومبدع.
              </p>
              <div className="flex flex-wrap gap-2">
                {['تطوير البرمجيات', 'تطبيقات الجوال', 'الذكاء الاصطناعي'].map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30 ">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-card hover:shadow-hover transition-all duration-300 glass-dark border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Target className="w-6 h-6 text-emerald-400" />
                رؤيتنا ورسالتنا
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">رؤيتنا:</h4>
                <p className="text-gray-300 text-sm">
                  أن نكون الشركة الرائدة في المنطقة في تقديم الحلول التقنية المبتكرة
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">رسالتنا:</h4>
                <p className="text-gray-300 text-sm">
                  تمكين الشركات والأفراد من خلال التكنولوجيا المتطورة والخدمات المتميزة
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-card glass-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Users className="w-6 h-6 text-emerald-400" />
              الوظائف المتاحة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'مطور مواقع', desc: 'تطوير مواقع ويب متطورة وتطبيقات ويب تفاعلية', gradient: 'from-emerald-500 to-cyan-500' },
                { title: 'مطور تطبيقات', desc: 'تطوير تطبيقات الجوال لأنظمة iOS و Android', gradient: 'from-cyan-500 to-teal-500' },
                { title: 'خبير الاستضافة', desc: 'إدارة الخوادم وخدمات الاستضافة والحماية', gradient: 'from-teal-500 to-emerald-500' },
                { title: 'مطور برامج محاسبة', desc: 'تطوير أنظمة محاسبية وبرامج إدارة مالية', gradient: 'from-emerald-500 to-cyan-500' },
              ].map((job, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg bg-gradient-to-r ${job.gradient} text-white`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h4 className="font-semibold mb-2">{job.title}</h4>
                  <p className="text-sm opacity-90">{job.desc}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-card glass-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Award className="w-6 h-6 text-emerald-400" />
              مزايا العمل معنا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: Users, title: 'بيئة عمل مميزة', desc: 'فريق متعاون وبيئة عمل إبداعية ومحفزة' },
                { icon: Target, title: 'فرص نمو مهني', desc: 'برامج تدريبية وفرص تطوير المهارات' },
                { icon: Award, title: 'مكافآت تنافسية', desc: 'مكافآت أداء ومزايا إضافية' },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="font-semibold mb-2 text-white">{benefit.title}</h4>
                  <p className="text-sm text-gray-300">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={nextStep}
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
    </motion.div>
  );
};

