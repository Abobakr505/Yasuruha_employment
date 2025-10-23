import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// StarField Component (reused from previous components)
const StarField: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars: { x: number; y: number; radius: number; alpha: number; color: string }[] = [];
    const numStars = 100;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.5,
        color: Math.random() < 0.2 ? '#10b981' : Math.random() < 0.4 ? '#06b6d4' : '#ffffff',
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.alpha = 0.5 + Math.sin(Date.now() * 0.001 + star.x) * 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color === '#ffffff' ? '255,255,255' : star.color === '#10b981' ? '16,185,129' : '6,182,212'}, ${star.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[-1]"
      style={{ background: 'transparent' }}
    />
  );
};

export const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'تسجيل الدخول';
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin');
      } else {
        handleAutoSignIn();
      }
    };
    checkUser();
  }, [navigate]);

  const handleAutoSignIn = async () => {
    setIsLoading(true);
    setError('');

    const predefinedEmail = 'test@example.com';
    const predefinedPassword = 'Test@1234';
    const predefinedFullName = 'Test User';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: predefinedEmail,
        password: predefinedPassword,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          await handleAutoSignUp(predefinedEmail, predefinedPassword, predefinedFullName);
          return;
        }
        throw error;
      }

      if (data.user) {
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في لوحة التحكم',
        });
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Auto sign in error:', error);
      setError(
        error.message === 'Invalid login credentials'
          ? 'بيانات تسجيل الدخول غير صحيحة'
          : 'حدث خطأ أثناء تسجيل الدخول'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoSignUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: 'تم إنشاء الحساب بنجاح',
          description: 'تم تسجيل الدخول تلقائياً',
        });

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        if (signInData.user) {
          navigate('/admin');
        }
      }
    } catch (error: any) {
      console.error('Auto sign up error:', error);
      setError(
        error.message === 'User already registered'
          ? 'هذا البريد الإلكتروني مسجل مسبقاً'
          : 'حدث خطأ أثناء إنشاء الحساب'
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في لوحة التحكم',
        });
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(
        error.message === 'Invalid login credentials'
          ? 'بيانات تسجيل الدخول غير صحيحة'
          : 'حدث خطأ أثناء تسجيل الدخول'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] via-slate-900 to-[#1e293b] flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      <StarField />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.1),transparent_50%)]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30"
          >
            <ShieldCheck className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
          >
            تسجيل الدخول
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-300">
            مرحباً بك في لوحة التحكم
          </motion.p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSignIn}
          className="space-y-6 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <motion.div variants={itemVariants}>
            <Label className="block text-white mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              البريد الإلكتروني
            </Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none transition-colors"
                placeholder="example@company.com"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label className="block text-white mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              كلمة المرور
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          {error && (
            <motion.div variants={itemVariants} className="text-red-400 text-center">
              <Alert className="bg-red-500/10 border-red-400/20">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              {isLoading ? 'جاري تسجيل الدخول...' : 'دخول الآن'}
            </Button>
          </motion.div>
        </motion.form>

        <motion.p
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 text-gray-400"
        >
          © 2025 يسرها - جميع الحقوق محفوظة
        </motion.p>
      </motion.div>
    </div>
  );
};