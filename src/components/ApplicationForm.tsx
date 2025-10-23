import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { CompanyInfoStep } from './form-steps/CompanyInfoStep';
import { PersonalInfoStep } from './form-steps/PersonalInfoStep';
import { ProjectsStep } from './form-steps/ProjectsStep';
import { SkillsStep } from './form-steps/SkillsStep';
import { NotesStep } from './form-steps/NotesStep';
import { TrainingInfoStep } from './form-steps/TrainingInfoStep';
import { SubmissionStep } from './form-steps/SubmissionStep';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import StarField from './StarField';

export interface FormData {
  profilePictureUrl: any;
  fullName: string;
  phone: string;
  age: number;
  jobType: string;
  portfolioUrl: string;
  skills: string[];
  notes: string;
  projects: Array<{
    title: string;
    description: string;
    mainImage: File | null;
    additionalImages: (File | null)[];
  }>;
}

const steps = [
  { id: 1, title: 'معلومات الشركة', component: CompanyInfoStep },
  { id: 2, title: 'البيانات الشخصية', component: PersonalInfoStep },
  { id: 3, title: 'المشاريع', component: ProjectsStep },
  { id: 4, title: 'المهارات', component: SkillsStep },
  { id: 5, title: 'الملاحظات', component: NotesStep },
  { id: 6, title: 'معلومات التدريب', component: TrainingInfoStep },
  { id: 7, title: 'الإرسال', component: SubmissionStep },
];

export const ApplicationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    age: 0,
    jobType: '',
    portfolioUrl: '',
    skills: [],
    notes: '',
    projects: [
      { title: '', description: '', mainImage: null, additionalImages: [null, null, null] },
      { title: '', description: '', mainImage: null, additionalImages: [null, null, null] },
      { title: '', description: '', mainImage: null, additionalImages: [null, null, null] },
    ],
    profilePictureUrl: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('application-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('application-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    try {
      // Upload profile picture if exists
      let profilePictureUrl = null;
      if (formData.profilePictureUrl instanceof File) {
        profilePictureUrl = await uploadImage(formData.profilePictureUrl);
      }

      // Insert application
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .insert({
          full_name: formData.fullName,
          phone: formData.phone,
          age: formData.age,
          job_type: formData.jobType,
          portfolio_url: formData.portfolioUrl || null,
          skills: formData.skills,
          notes: formData.notes,
          profile_picture_url: profilePictureUrl,
        })
        .select()
        .single();

      if (applicationError) {
        throw applicationError;
      }

      // Upload images and insert projects
      for (const project of formData.projects) {
        if (project.title) {
          let mainImageUrl = null;
          if (project.mainImage) {
            mainImageUrl = await uploadImage(project.mainImage);
          }

          const additionalImageUrls: (string | null)[] = [];
          for (const image of project.additionalImages) {
            if (image) {
              const url = await uploadImage(image);
              additionalImageUrls.push(url);
            } else {
              additionalImageUrls.push(null);
            }
          }

          const { error: projectError } = await supabase
            .from('application_projects')
            .insert({
              application_id: applicationData.id,
              project_title: project.title,
              project_description: project.description,
              main_image_url: mainImageUrl,
              additional_images: additionalImageUrls.filter((url) => url !== null),
            });

          if (projectError) {
            throw projectError;
          }
        }
      }

      toast({
        title: 'تم إرسال الطلب بنجاح',
        description: 'سيتم مراجعة طلبك والرد عليك قريباً',
      });

      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        age: 0,
        jobType: '',
        portfolioUrl: '',
        skills: [],
        notes: '',
        projects: [
          { title: '', description: '', mainImage: null, additionalImages: [null, null, null] },
          { title: '', description: '', mainImage: null, additionalImages: [null, null, null] },
          { title: '', description: '', mainImage: null, additionalImages: [null, null, null] },
        ],
        profilePictureUrl: null,
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'خطأ في إرسال الطلب',
        description: 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  // Animation variants for the form container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-slate-900 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir="rtl"
    >
      <StarField />
      <div className="max-w-4xl mx-auto py-8 px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 ,  }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          
          <motion.div
          animate={{ 
                backgroundPosition: ['0% 50%', '200% 50%', '0% 50%'],
                color: ['#ffffff', '#10b981', '#06b6d4']
              }}
              transition={{ duration: 6, repeat: Infinity }}
           className="GraphicSchool text-4xl md:text-6xl font-bold mb-4  bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            نموذج طلب التوظيف
          </motion.div>
          <p className="text-gray-300 text-lg">
            انضم إلى فريقنا المتميز واكتشف فرص جديدة
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="mb-8 shadow-card glass-dark border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg text-white">
                  المرحلة {currentStep} من {steps.length}
                </CardTitle>
                <span className="text-sm text-gray-300">
                  {Math.round(progress)}% مكتمل
                </span>
              </div>
              <Progress
                value={progress}
                className="h-2 bg-white/10"
                indicatorClassName="bg-gradient-to-r from-emerald-500 to-cyan-500"
              />
            </CardHeader>
          </Card>
        </motion.div>

        {/* Steps Navigation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`group relative flex items-center gap-3 p-6 rounded-2xl transition-all duration-500 cursor-pointer glass-dark ${
                step.id === currentStep
                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white shadow-glow transform scale-105'
                  : step.id < currentStep
                  ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-white shadow-elegant'
                  : 'bg-white/5 text-gray-300 border-2 border-dashed border-white/20 hover:border-emerald-400/50 hover:shadow-card'
              }`}
            >
              {/* Animated Background */}
              {step.id === currentStep && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100"
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Step Number Circle */}
              <div
                className={`step-circle relative z-10 flex items-center justify-center w-12 h-12 rounded-full font-bold text-base transition-all duration-500 ${
                  step.id === currentStep
                    ? 'bg-emerald-500/20 text-white shadow-glow'
                    : step.id < currentStep
                    ? 'bg-emerald-500 text-white shadow-card'
                    : 'bg-white/10 text-gray-300 group-hover:bg-emerald-500/20 group-hover:text-white'
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="w-6 h-6 text-whitr" />
                ) : (
                  <span className="font-bold">{step.id}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0 relative z-10">
                <h3
                  className={`font-semibold text-sm truncate mb-1 ${
                    step.id === currentStep ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {step.title}
                </h3>
                <span
                  className={`text-xs font-medium ${
                    step.id === currentStep
                      ? 'text-white/90'
                      : step.id < currentStep
                      ? 'text-emerald-400'
                      : 'text-gray-400'
                  }`}
                >
                  {step.id === currentStep
                    ? 'المرحلة الحالية'
                    : step.id < currentStep
                    ? 'مكتملة ✓'
                    : 'قادمة'}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Current Step Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="shadow-card glass-dark border-white/10">
            <CardContent className="p-6">
              <CurrentStepComponent
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                currentStep={currentStep}
                totalSteps={steps.length}
                {...(currentStep === 7 && { submitApplication, isSubmitting })}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};