import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmotionData } from '@/types/emotion';
import { useFearAlert } from './useFearAlert';

const DEFAULT_DATA: EmotionData = {
  age: null,
  emotion: 'neutral',
  confidence: 0,
  isSmiling: false,
  isEmergency: false,
  noFace: true,
};

export function useEmotionAnalysis() {
  const [emotionData, setEmotionData] = useState<EmotionData>(DEFAULT_DATA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastAnalysisRef = useRef<number>(0);
  const { checkAndAlertFear } = useFearAlert();

  const analyzeFrame = useCallback(async (imageBase64: string) => {
    // Throttle to max once per 4 seconds to avoid rate limits
    const now = Date.now();
    if (now - lastAnalysisRef.current < 4000) {
      return;
    }
    lastAnalysisRef.current = now;

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('Calling analyze-emotion function...');
      const { data, error: fnError } = await supabase.functions.invoke('analyze-emotion', {
        body: { imageBase64 },
      });

      console.log('Function response:', { data, fnError });

      if (fnError) {
        console.error('Function error:', fnError);
        throw fnError;
      }

      if (!data) {
        console.error('No data received from function');
        setError('No response from analysis service');
        return;
      }

      if (data.error) {
        console.error('Error in response:', data.error);
        setError(data.error);
        return;
      }

      const newEmotionData: EmotionData = {
        age: data.age ?? null,
        emotion: data.emotion || 'neutral',
        confidence: data.confidence || 0,
        isSmiling: data.isSmiling || false,
        isEmergency: data.isEmergency || false,
        noFace: data.noFace ?? false,
      };

      console.log('Setting emotion data:', newEmotionData);
      setEmotionData(newEmotionData);

      // Check for fear emotion and send emergency email if needed
      checkAndAlertFear(newEmotionData);
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      
      // Set default data on error
      setEmotionData({
        age: null,
        emotion: 'neutral',
        confidence: 0,
        isSmiling: false,
        isEmergency: false,
        noFace: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [checkAndAlertFear]);

  const resetData = useCallback(() => {
    setEmotionData(DEFAULT_DATA);
    setError(null);
  }, []);

  return {
    emotionData,
    isAnalyzing,
    error,
    analyzeFrame,
    resetData,
  };
}
