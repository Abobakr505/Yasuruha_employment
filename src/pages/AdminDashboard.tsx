import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Calendar, User, Phone, Briefcase, Star, FileText, CheckCircle, XCircle, LogOut, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// StarField Component (reused from ApplicationForm)
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

interface Application {
  id: string;
  full_name: string;
  phone: string;
  age: number;
  job_type: string;
  portfolio_url?: string;
  skills: string[];
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  application_id: string;
  project_title: string;
  project_description?: string;
  main_image_url?: string;
  additional_images: string[];
}

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  role: string;
}

export const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [projects, setProjects] = useState<{ [key: string]: Project[] }>({});
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/auth');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'تم تسجيل الخروج',
        description: 'تم تسجيل خروجك بنجاح',
      });
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      setApplications(applicationsData || []);

      const { data: projectsData, error: projectsError } = await supabase
        .from('application_projects')
        .select('*');

      if (projectsError) throw projectsError;

      const projectsByApplication: { [key: string]: Project[] } = {};
      projectsData?.forEach((project) => {
        if (!projectsByApplication[project.application_id]) {
          projectsByApplication[project.application_id] = [];
        }
        projectsByApplication[project.application_id].push(project);
      });

      setProjects(projectsByApplication);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'خطأ في تحميل البيانات',
        description: 'حدث خطأ أثناء تحميل طلبات التوظيف',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast({
        title: 'تم تحديث الحالة',
        description: 'تم تحديث حالة الطلب بنجاح',
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'خطأ في التحديث',
        description: 'حدث خطأ أثناء تحديث حالة الطلب',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30 text-xs sm:text-sm">
            قيد المراجعة
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-emerald-500 text-white border-emerald-400/30 text-xs sm:text-sm">
            مقبول
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-400/30 text-xs sm:text-sm">
            مرفوض
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs sm:text-sm border-white/20 text-gray-300">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  if (authLoading) {
    return (
      <motion.div
        className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StarField />
        <motion.div className="text-center relative z-10" variants={itemVariants}>
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-sm sm:text-base">جاري التحميل...</p>
        </motion.div>
      </motion.div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-900 p-4 sm:p-6 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir="rtl"
    >
      <StarField />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                لوحة تحكم طلبات التوظيف
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                مرحباً {userProfile.full_name || userProfile.email} - إدارة ومراجعة طلبات التوظيف المقدمة
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={fetchApplications}
                  variant="outline"
                  className="text-xs sm:text-sm px-3 sm:px-4 border-white/20 text-white hover:bg-white/10"
                >
                  تحديث البيانات
                </Button>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="text-xs sm:text-sm px-3 sm:px-4 border-white/20 text-white hover:bg-white/10"
                >
                  الصفحة الرئيسية
                </Button>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  className="text-xs sm:text-sm px-3 sm:px-4 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
          variants={itemVariants}
        >
          {[
            {
              icon: FileText,
              title: 'إجمالي الطلبات',
              value: applications.length,
              color: 'bg-emerald-500/20 text-emerald-400',
            },
            {
              icon: Calendar,
              title: 'قيد المراجعة',
              value: applications.filter((app) => app.status === 'pending').length,
              color: 'bg-yellow-500/20 text-yellow-400',
            },
            {
              icon: CheckCircle,
              title: 'مقبولة',
              value: applications.filter((app) => app.status === 'approved').length,
              color: 'bg-emerald-500/20 text-emerald-400',
            },
            {
              icon: XCircle,
              title: 'مرفوضة',
              value: applications.filter((app) => app.status === 'rejected').length,
              color: 'bg-red-500/20 text-red-400',
            },
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Card className="shadow-card glass-dark border-white/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-300">{stat.title}</p>
                      <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Applications List */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card glass-dark border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                <User className="w-5 h-5 text-emerald-400" />
                طلبات التوظيف
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-300 text-sm sm:text-base">جاري تحميل البيانات...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-300 text-sm sm:text-base">لا توجد طلبات توظيف حتى الآن</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <motion.div key={application.id} variants={itemVariants} whileHover={{ scale: 1.02 }}>
                      <Card className="border-white/10 shadow-card glass-dark">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="p-2 rounded-full bg-emerald-500/20">
                                <User className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-base sm:text-lg text-white">{application.full_name}</h3>
                                <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-emerald-400" />
                                  {application.phone}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-2">
                                  <Briefcase className="w-4 h-4 text-emerald-400" />
                                  {application.job_type}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                              <div className="text-right sm:text-left">
                                {getStatusBadge(application.status)}
                                <p className="text-xs text-gray-300 mt-1">
                                  {formatDate(application.created_at)}
                                </p>
                              </div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedApplication(application)}
                                    className="text-xs sm:text-sm px-3 sm:px-4 border-white/20 text-white hover:bg-white/10"
                                  >
                                    <Eye className="w-4 h-4 mr-2 text-emerald-400" />
                                    عرض التفاصيل
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] sm:p-6 p-4 glass-dark border-white/10" dir="rtl">
                                  <DialogHeader>
                                    <DialogTitle className="text-lg sm:text-xl text-white">تفاصيل طلب التوظيف</DialogTitle>
                                  </DialogHeader>
                                  <ScrollArea className="max-h-[70vh] pr-4">
                                    {selectedApplication && (
                                      <div className="space-y-6">
                                        {/* Personal Info */}
                                        <div>
                                          <h3 className="text-base sm:text-lg font-semibold text-white mb-3">البيانات الشخصية</h3>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-300">
                                            <div>
                                              <strong>الاسم الكامل:</strong> {selectedApplication.full_name}
                                            </div>
                                            <div>
                                              <strong>رقم الهاتف:</strong> {selectedApplication.phone}
                                            </div>
                                            <div>
                                              <strong>العمر:</strong> {selectedApplication.age} سنة
                                            </div>
                                            <div>
                                              <strong>نوع العمل:</strong> {selectedApplication.job_type}
                                            </div>
                                            {selectedApplication.portfolio_url && (
                                              <div className="col-span-1 sm:col-span-2">
                                                <strong>رابط البورتفوليو:</strong>{' '}
                                                <a
                                                  href={selectedApplication.portfolio_url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-emerald-400 hover:underline"
                                                >
                                                  {selectedApplication.portfolio_url}
                                                </a>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <Separator className="bg-white/10" />

                                        {/* Skills */}
                                        {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                                          <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-white mb-3">المهارات</h3>
                                            <div className="flex flex-wrap gap-2">
                                              {selectedApplication.skills.map((skill, index) => (
                                                <Badge
                                                  key={index}
                                                  variant="secondary"
                                                  className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30 text-xs sm:text-sm"
                                                >
                                                  {skill}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Projects */}
                                        {projects[selectedApplication.id] && projects[selectedApplication.id].length > 0 && (
                                          <>
                                            <Separator className="bg-white/10" />
                                            <div>
                                              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">المشاريع</h3>
                                              <div className="space-y-4">
                                                {projects[selectedApplication.id].map((project, index) => (
                                                  <Card key={project.id} className="p-4 glass-dark border-white/10">
                                                    <h4 className="font-medium text-sm sm:text-base text-white mb-2">{project.project_title}</h4>
                                                    {project.project_description && (
                                                      <p className="text-xs sm:text-sm text-gray-300 mb-3">
                                                        {project.project_description}
                                                      </p>
                                                    )}
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                      {project.main_image_url && (
                                                        <div className="relative">
                                                          <img
                                                            src={project.main_image_url}
                                                            alt="صورة رئيسية"
                                                            className="w-full h-20 sm:h-24 object-cover rounded-md border border-white/20 cursor-pointer"
                                                            onClick={() => window.open(project.main_image_url, '_blank')}
                                                          />
                                                          <Badge className="absolute top-1 right-1 text-xs bg-emerald-500 text-white">
                                                            رئيسية
                                                          </Badge>
                                                        </div>
                                                      )}
                                                      {project.additional_images.map((imageUrl, imgIndex) => (
                                                        <img
                                                          key={imgIndex}
                                                          src={imageUrl}
                                                          alt={`صورة إضافية ${imgIndex + 1}`}
                                                          className="w-full h-20 sm:h-24 object-cover rounded-md border border-white/20 cursor-pointer"
                                                          onClick={() => window.open(imageUrl, '_blank')}
                                                        />
                                                      ))}
                                                    </div>
                                                  </Card>
                                                ))}
                                              </div>
                                            </div>
                                          </>
                                        )}

                                        {/* Notes */}
                                        {selectedApplication.notes && (
                                          <>
                                            <Separator className="bg-white/10" />
                                            <div>
                                              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">الملاحظات</h3>
                                              <p className="text-xs sm:text-sm bg-white/5 p-3 rounded-md text-gray-300">
                                                {selectedApplication.notes}
                                              </p>
                                            </div>
                                          </>
                                        )}

                                        <Separator className="bg-white/10" />

                                        {/* Actions */}
                                        <div>
                                          <h3 className="text-base sm:text-lg font-semibold text-white mb-3">إجراءات</h3>
                                          <div className="flex flex-col sm:flex-row gap-3">
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                              <Button
                                                onClick={() => updateApplicationStatus(selectedApplication.id, 'approved')}
                                                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs sm:text-sm px-3 sm:px-4"
                                                disabled={selectedApplication.status === 'approved'}
                                              >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                قبول الطلب
                                              </Button>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                              <Button
                                                variant="destructive"
                                                onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                                                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs sm:text-sm px-3 sm:px-4"
                                                disabled={selectedApplication.status === 'rejected'}
                                              >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                رفض الطلب
                                              </Button>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                              <Button
                                                variant="outline"
                                                onClick={() => updateApplicationStatus(selectedApplication.id, 'pending')}
                                                className="text-xs sm:text-sm px-3 sm:px-4 border-white/20 text-white hover:bg-white/10"
                                                disabled={selectedApplication.status === 'pending'}
                                              >
                                                إعادة للمراجعة
                                              </Button>
                                            </motion.div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};