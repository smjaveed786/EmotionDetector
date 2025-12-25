import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smile, Angry, Frown, Meh, AlertTriangle, Music, User, Heart } from 'lucide-react';

const floatingEmojis = [
  { emoji: '🙂', delay: 0, x: '10%', y: '20%' },
  { emoji: '😡', delay: 1, x: '80%', y: '15%' },
  { emoji: '😨', delay: 2, x: '15%', y: '70%' },
  { emoji: '😐', delay: 1.5, x: '85%', y: '65%' },
  { emoji: '😊', delay: 0.5, x: '50%', y: '10%' },
  { emoji: '😢', delay: 2.5, x: '75%', y: '80%' },
];

const features = [
  {
    icon: Smile,
    title: 'Emotion Detection',
    description: 'Analyze facial expressions in real-time to detect emotions like happy, sad, angry, and more.',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: User,
    title: 'Age Prediction',
    description: 'AI-powered age estimation based on facial features with high accuracy.',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Heart,
    title: 'Smile Detection',
    description: 'Detect genuine smiles and track happiness levels throughout sessions.',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Alerts',
    description: 'Automatic emergency notifications when fear is detected with high confidence.',
    gradient: 'from-red-500 to-orange-600',
  },
  {
    icon: Music,
    title: 'Music Therapy',
    description: 'Calming music recommendations when anger or stress is detected.',
    gradient: 'from-purple-500 to-violet-600',
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 -z-10" />
      
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent -z-10" />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Floating Emojis */}
      {floatingEmojis.map((item, index) => (
        <motion.div
          key={index}
          className="fixed text-4xl md:text-6xl pointer-events-none select-none opacity-60"
          style={{ left: item.x, top: item.y }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 4,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Face Silhouette / Abstract Visual */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full bg-white/10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center max-w-4xl leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AI-Powered Emotion Detection & Safety System
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-lg md:text-xl text-white/80 text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Real-time emotion analysis with intelligent emergency alerts
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="mt-10 px-8 py-6 text-lg font-semibold bg-white text-purple-600 hover:bg-white/90 shadow-2xl hover:shadow-white/25 transition-all duration-300"
          >
            Start Detection
          </Button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl w-full px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 h-full group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
