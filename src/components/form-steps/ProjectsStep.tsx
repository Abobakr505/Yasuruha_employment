import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Upload, X, Image as ImageIcon } from 'lucide-react';
import { FormData } from '../ApplicationForm';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          المشاريع والأعمال السابقة
        </h2>
        <p className="text-muted-foreground">
          أضف ثلاثة من أفضل مشاريعك مع الصور التوضيحية
        </p>
      </div>

      {formData.projects.map((project, projectIndex) => (
        <Card key={projectIndex} className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg text-primary">
              المشروع {projectIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`project-title-${projectIndex}`}>
                  عنوان المشروع
                </Label>
                <Input
                  id={`project-title-${projectIndex}`}
                  type="text"
                  value={project.title}
                  onChange={(e) => handleProjectChange(projectIndex, 'title', e.target.value)}
                  placeholder="أدخل عنوان المشروع"
                  className="text-right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`project-description-${projectIndex}`}>
                وصف المشروع
              </Label>
              <Textarea
                id={`project-description-${projectIndex}`}
                value={project.description}
                onChange={(e) => handleProjectChange(projectIndex, 'description', e.target.value)}
                placeholder="اكتب وصفاً مختصراً عن المشروع والتقنيات المستخدمة"
                className="text-right min-h-[100px]"
              />
            </div>

            {/* Main Image */}
            <div className="space-y-2">
              <Label>الصورة الرئيسية</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                {project.mainImage ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm">{project.mainImage.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleMainImageChange(projectIndex, null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      اختر الصورة الرئيسية للمشروع
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRefs.current[projectIndex * 4]?.click()}
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
            </div>

            {/* Additional Images */}
            <div className="space-y-2">
              <Label>الصور الإضافية (اختياري)</Label>
              <div className="grid grid-cols-3 gap-4">
                {project.additionalImages.map((image, imageIndex) => (
                  <div key={imageIndex} className="border-2 border-dashed border-border rounded-lg p-4">
                    {image ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <ImageIcon className="w-4 h-4 text-primary" />
                          <span className="text-xs truncate">{image.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleAdditionalImageChange(projectIndex, imageIndex, null)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs"
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
            </div>
          </CardContent>
        </Card>
      ))}

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