import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Upload, X, Image as ImageIcon } from 'lucide-react';
import { FormData } from '../ApplicationForm';
import { motion } from 'framer-motion';

interface ProjectsStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

export const ProjectsStep: React.FC<ProjectsStepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
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

  const handleProjectChange = (index: number, field: string, value: string) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    updateFormData({ projects: updatedProjects });
  };

  const handleMainImageChange = (index: number, file: File | null) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], mainImage: file };
    updateFormData({ projects: updatedProjects });
  };

  const handleAdditionalImageChange = (projectIndex: number, imageIndex: number, file: File | null) => {
    const updatedProjects = [...formData.projects];
    const updatedImages = [...updatedProjects[projectIndex].additionalImages];
    updatedImages[imageIndex] = file;
    updatedProjects[projectIndex] = { ...updatedProjects[projectIndex], additionalImages: updatedImages };
    updateFormData({ projects: updatedProjects });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
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
          المشاريع والأعمال السابقة
        </motion.h2>
        <p className="text-gray-300">
          أضف ثلاثة من أفضل مشاريعك مع الصور التوضيحية
        </p>
      </motion.div>

      {formData.projects.map((project, projectIndex) => (
        <motion.div variants={itemVariants} key={projectIndex}>
          <Card className="shadow-card glass-dark border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-400">
                المشروع {projectIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor={`project-title-${projectIndex}`} className="text-white">
                    عنوان المشروع
                  </Label>
                  <Input
                    id={`project-title-${projectIndex}`}
                    type="text"
                    value={project.title}
                    onChange={(e) => handleProjectChange(projectIndex, 'title', e.target.value)}
                    placeholder="أدخل عنوان المشروع"
                    className="text-right bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-emerald-400/50 transition-all"
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor={`project-description-${projectIndex}`} className="text-white">
                  وصف المشروع
                </Label>
                <Textarea
                  id={`project-description-${projectIndex}`}
                  value={project.description}
                  onChange={(e) => handleProjectChange(projectIndex, 'description', e.target.value)}
                  placeholder="اكتب وصفاً مختصراً عن المشروع والتقنيات المستخدمة"
                  className="text-right min-h-[100px] bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-emerald-400/50 transition-all"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-white">الصورة الرئيسية</Label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-4 bg-white/5">
                  {project.mainImage ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm text-white">{project.mainImage.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleMainImageChange(projectIndex, null)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-300 mb-2">
                        اختر الصورة الرئيسية للمشروع
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRefs.current[projectIndex * 4]?.click()}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        اختيار صورة
                      </Button>
                      <input
                        ref={(el) => (fileInputRefs.current[projectIndex * 4] = el)}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleMainImageChange(projectIndex, file);
                        }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-white">الصور الإضافية (اختياري)</Label>
                <div className="grid grid-cols-3 gap-4">
                  {project.additionalImages.map((image, imageIndex) => (
                    <div key={imageIndex} className="border-2 border-dashed border-white/20 rounded-lg p-4 bg-white/5">
                      {image ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-white truncate">{image.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full border-white/20 text-white hover:bg-white/10"
                            onClick={() => handleAdditionalImageChange(projectIndex, imageIndex, null)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs border-white/20 text-white hover:bg-white/10"
                            onClick={() => fileInputRefs.current[projectIndex * 4 + imageIndex + 1]?.click()}
                          >
                            اختيار
                          </Button>
                          <input
                            ref={(el) => (fileInputRefs.current[projectIndex * 4 + imageIndex + 1] = el)}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleAdditionalImageChange(projectIndex, imageIndex, file);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

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