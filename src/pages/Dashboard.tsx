import { Background3D } from '@/components/Background3D';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EmotionDashboard } from '@/components/dashboard/EmotionDashboard';

export default function Dashboard() {
  return (
    <div className="min-h-screen relative">
      {/* 3D Background */}
      <Background3D />
      
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Dashboard */}
      <EmotionDashboard />
    </div>
  );
}
