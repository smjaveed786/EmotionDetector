import React, { useEffect, useCallback } from 'react';
import { useWebcam } from '@/hooks/useWebcam';
import { useEmotionAnalysis } from '@/hooks/useEmotionAnalysis';
import { useFearAlert } from '@/hooks/useFearAlert';
import { CameraFeed } from './CameraFeed';
import { InfoCard } from './InfoCard';
import { EmotionIndicator } from './EmotionIndicator';
import { SystemStatus } from './SystemStatus';
import { EMOTION_LABELS } from '@/types/emotion';
import { User, Smile, Brain, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function EmotionDashboard() {
  const {
    videoRef,
    canvasRef,
    isStreaming,
    error: webcamError,
    startWebcam,
    stopWebcam,
    captureFrame,
  } = useWebcam();

  const {
    emotionData,
    isAnalyzing,
    error: analysisError,
    analyzeFrame,
    resetData,
  } = useEmotionAnalysis();

  const { checkAndAlertFear } = useFearAlert();

  // Capture and analyze frames periodically
  useEffect(() => {
    if (!isStreaming) {
      resetData();
      return;
    }

    const interval = setInterval(() => {
      const frame = captureFrame();
      if (frame) {
        analyzeFrame(frame);
      }
    }, 5000); // Analyze every 5 seconds to avoid rate limits

    return () => clearInterval(interval);
  }, [isStreaming, captureFrame, analyzeFrame, resetData]);

  // Check for fear and send alert
  useEffect(() => {
    if (emotionData.emotion === 'fear' && emotionData.confidence >= 90 && !emotionData.noFace) {
      checkAndAlertFear(emotionData).then(() => {
        toast.error('🚨 Fear detected! Emergency alert sent to guardian.');
      });
    }
  }, [emotionData, checkAndAlertFear]);

  const handleStart = useCallback(async () => {
    await startWebcam();
  }, [startWebcam]);

  const handleStop = useCallback(() => {
    stopWebcam();
    resetData();
  }, [stopWebcam, resetData]);

  const combinedError = webcamError || analysisError;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
            Emotion Detection Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time facial emotion analysis powered by AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Camera Feed */}
          <div className="lg:col-span-2 space-y-6">
            <CameraFeed
              videoRef={videoRef}
              canvasRef={canvasRef}
              isStreaming={isStreaming}
              isAnalyzing={isAnalyzing}
              error={combinedError}
              onStart={handleStart}
              onStop={handleStop}
            />

            {/* Info Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard
                icon={User}
                label="Age"
                value={emotionData.age}
                subValue="Estimated"
              />
              <InfoCard
                icon={Sparkles}
                label="Emotion"
                value={EMOTION_LABELS[emotionData.emotion]}
              />
              <InfoCard
                icon={Brain}
                label="Confidence"
                value={`${emotionData.confidence}%`}
                subValue="AI certainty"
              />
              <InfoCard
                icon={Smile}
                label="Smile Status"
                value={emotionData.noFace ? '—' : emotionData.isSmiling ? 'Smiling' : 'Not Smiling'}
              />
            </div>
          </div>

          {/* Right Column - Indicators */}
          <div className="space-y-6">
            <EmotionIndicator
              currentEmotion={emotionData.emotion}
              confidence={emotionData.confidence}
            />
            <SystemStatus
              isEmergency={emotionData.isEmergency}
              isStreaming={isStreaming}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
