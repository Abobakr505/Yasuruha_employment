import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Plus, X, Code, Server, Database, Palette } from 'lucide-react';
import { FormData } from '../ApplicationForm';
import { connect } from 'http2';
import { RiTeamFill } from "react-icons/ri";
interface SkillsStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const skillCategories = {
  programming: {
    icon: Code,
    title: 'لغات البرمجة',
    skills: ['Html' , 'Css' , 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'React', 'Vue.js', 'Angular', 'Node.js' ]
  },
  backend: {
    icon: Server,
    title: 'Backend و الخوادم',
    skills: ['Express.js', 'Django', 'Laravel', 'ASP.NET', 'Spring Boot', 'Docker', 'Kubernetes', 'AWS', 'Azure']
  },
  database: {
    icon: Database,
    title: 'قواعد البيانات',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Supabase', 'Firebase']
  },
  design: {
    icon: Palette,
    title: 'التصميم والواجهات',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX Design', 'Tailwind CSS', 'Bootstrap', 'Material-UI']
  },   
  connect: {
    icon: RiTeamFill,
    title: 'التواصل  (اساسي)',
    skills: ['Git & GitHub']
  }
};

export const SkillsStep: React.FC<SkillsStepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      updateFormData({ skills: [...formData.skills, skill] });
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    updateFormData({ 
      skills: formData.skills.filter(skill => skill !== skillToRemove) 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          المهارات والخبرات
        </h2>
        <p className="text-muted-foreground">
          اختر مهاراتك التقنية أو أضف مهارات جديدة
        </p>
      </div>

      {/* Selected Skills */}
      {formData.skills.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">المهارات المختارة:</h3>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <Badge
                key={skill}
                variant="default"
                className="bg-primary text-primary-foreground flex items-center gap-1 px-3 py-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Skill */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground">إضافة مهارة مخصصة:</h3>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="أدخل اسم المهارة"
            className="text-right flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(newSkill);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addSkill(newSkill)}
            disabled={!newSkill.trim()}
            className="px-4"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Skill Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(skillCategories).map(([key, category]) => {
          const IconComponent = category.icon;
          return (
            <div key={key} className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <IconComponent className="w-5 h-5 text-primary" />
                {category.title}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {category.skills.map((skill) => (
                  <Button
                    key={skill}
                    type="button"
                    variant={formData.skills.includes(skill) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (formData.skills.includes(skill)) {
                        removeSkill(skill);
                      } else {
                        addSkill(skill);
                      }
                    }}
                    className={`text-xs justify-start ${
                      formData.skills.includes(skill)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-primary/70'
                    }`}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
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