import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';
import { CompanyInfoStep } from './form-steps/CompanyInfoStep';
import { PersonalInfoStep } from './form-steps/PersonalInfoStep';
import { ProjectsStep } from './form-steps/ProjectsStep';
import { SkillsStep } from './form-steps/SkillsStep';
import { NotesStep } from './form-steps/NotesStep';
import { TrainingInfoStep } from './form-steps/TrainingInfoStep';
import { SubmissionStep } from './form-steps/SubmissionStep';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
              additional_images: additionalImageUrls.filter(url => url !== null),
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

  return (
    <div className="min-h-screen bg-gradient-secondary p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            نموذج طلب التوظيف
          </h1>
          <p className="text-muted-foreground text-lg">
            انضم إلى فريقنا المتميز واكتشف فرص جديدة
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg">
                المرحلة {currentStep} من {steps.length}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% مكتمل
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
        </Card>

        {/* Steps Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`group relative flex items-center gap-3 p-6 rounded-2xl transition-spring duration-500 cursor-pointer card-hover ${
                step.id === currentStep
                  ? 'bg-gradient-hero text-white shadow-glow transform scale-105'
                  : step.id < currentStep
                  ? 'bg-gradient-primary text-white shadow-elegant'
                  : 'bg-card text-muted-foreground border-2 border-dashed border-border hover:border-primary/50 hover:shadow-card'
              }`}
            >
              {/* Animated Background */}
              {step.id === currentStep && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-hero opacity-20 animate-pulse" />
              )}
              
              {/* Step Number Circle */}
              <div 
                className={`step-circle ${step.id === currentStep ? 'active' : ''} ${step.id < currentStep ? 'completed' : ''} 
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full font-bold text-base transition-spring duration-500  ${
                  step.id === currentStep
                    ? 'bg-white/20 text-white shadow-glow'
                    : step.id < currentStep
                    ? 'bg-white text-primary shadow-card'
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="w-6 h-6 text-[#4ce19e]" />
                ) : (
                  <span className="font-bold">{step.id}</span>
                )}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 min-w-0 relative z-10">
                <h3 className="font-semibold text-sm  sm:block truncate mb-1">
                  {step.title}
                </h3>
                <span className={`text-xs  sm:block font-medium ${
                  step.id === currentStep 
                    ? 'text-white/90' 
                    : step.id < currentStep 
                    ? 'text-white/80' 
                    : 'text-muted-foreground'
                }`}>
                  {step.id === currentStep ? 'المرحلة الحالية' : step.id < currentStep ? 'مكتملة ✓' : 'قادمة'}
                </span>
              </div>
              
              {/* Connection Line */}
              {/* {index < steps.length - 1 && (
                <div className={`absolute -left-1.5 top-1/2 transform -translate-y-1/2 w-3 h-1 transition-spring duration-500 ${
                  step.id < currentStep 
                    ? 'bg-gradient-primary shadow-sm' 
                    : 'bg-muted'
                }`} />
              )} */}
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <Card className="shadow-card">
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
      </div>
    </div>
  );
};