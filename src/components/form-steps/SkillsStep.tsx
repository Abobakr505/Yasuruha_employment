import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Plus, X, Code, Server, Database, Palette } from 'lucide-react';
import { RiTeamFill } from 'react-icons/ri';
import { FormData } from '../ApplicationForm';
import { motion } from 'framer-motion';

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
    skills: ['Html', 'Css', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'React', 'Vue.js', 'Angular', 'Node.js'],
  },
  backend: {
    icon: Server,
    title: 'Backend و الخوادم',
    skills: ['Express.js', 'Django', 'Laravel', 'ASP.NET', 'Spring Boot', 'Docker', 'Kubernetes', 'AWS', 'Azure'],
  },
  database: {
    icon: Database,
    title: 'قواعد البيانات',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Supabase', 'Firebase'],
  },
  design: {
    icon: Palette,
    title: 'التصميم والواجهات',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX Design', 'Tailwind CSS', 'Bootstrap', 'Material-UI'],
  },
  connect: {
    icon: RiTeamFill,
    title: 'التواصل (أساسي)',
    skills: ['Git & GitHub'],
  },
};

export const SkillsStep: React.FC<SkillsStepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const [newSkill, setNewSkill] = useState('');

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

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      updateFormData({ skills: [...formData.skills, skill] });
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    updateFormData({
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
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
          المهارات والخبرات
        </motion.h2>
        <p className="text-gray-300">
          اختر مهاراتك التقنية أو أضف مهارات جديدة
        </p>
      </motion.div>

      {formData.skills.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-2">
          <h3 className="font-semibold text-white">المهارات المختارة:</h3>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <motion.div key={skill} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge
                  variant="default"
                  className="bg-emerald-500 text-white flex items-center gap-1 px-3 py-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="space-y-2">
        <h3 className="font-semibold text-white">إضافة مهارة مخصصة:</h3>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="أدخل اسم المهارة"
            className="text-right flex-1 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-emerald-400/50 transition-all"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(newSkill);
              }
            }}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              onClick={() => addSkill(newSkill)}
              disabled={!newSkill.trim()}
              className="px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(skillCategories).map(([key, category], index) => {
          const IconComponent = category.icon;
          return (
            <motion.div key={key} variants={itemVariants} className="space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <IconComponent className="w-5 h-5 text-emerald-400" />
                {category.title}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {category.skills.map((skill) => (
                  <motion.div key={skill} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant={formData.skills.includes(skill) ? 'default' : 'outline'}
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
                          ? 'bg-emerald-500 text-white'
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      {skill}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

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