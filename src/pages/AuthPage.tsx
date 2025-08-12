import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin');
      } else {
        // Attempt automatic sign-in with predefined credentials
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
          // Attempt to sign up the user if sign-in fails
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

        // Attempt to sign in immediately after sign-up
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

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            لوحة التحكم
          </h1>
          <p className="text-white/80">
            قم بتسجيل الدخول للوصول إلى لوحة التحكم
          </p>
        </div>

        <Card className="glass shadow-elegant border-0">
          <CardContent className="p-6">
            {error && (
              <Alert className="mt-4 bg-destructive/10 border-destructive/20 text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignIn} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    onChange={handleInputChange}
                    className="pr-10 bg-white/10 border-primary text-black placeholder:text-white/60 focus:border-white/40"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-primary">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    onChange={handleInputChange}
                    className="pr-10 pl-10 bg-white/10 border-primary text-black placeholder:text-white/60 focus:border-white/40"
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-primary/80 hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white hover:bg-primary/80 font-semibold"
              >
                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
};