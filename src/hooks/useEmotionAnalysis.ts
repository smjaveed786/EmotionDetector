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
  const cooldownUntilRef = useRef<number>(0);
  const inFlightRef = useRef(false);

  const { checkAndAlertFear } = useFearAlert();

  const analyzeFrame = useCallback(async (imageBase64: string, skipThrottle = false) => {
    const now = Date.now();

    // Respect cooldown (e.g. after rate-limits)
    if (now < cooldownUntilRef.current) return;

    // Avoid overlapping calls
    if (inFlightRef.current) return;

    // Throttle to reduce AI rate-limits
    if (!skipThrottle && now - lastAnalysisRef.current < 10000) return; // max once per 10s
    lastAnalysisRef.current = now;

    inFlightRef.current = true;
    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-emotion', {
        body: { imageBase64 },
      });

      if (fnError) throw fnError;
      if (!data) {
        setError('No response from analysis service');
        return;
      }

      // Handle rate-limit without crashing the UI
      if (data.rateLimited) {
        const retryAfterSeconds = Number(data.retryAfterSeconds ?? 60);
        cooldownUntilRef.current = Date.now() + retryAfterSeconds * 1000;
        setError(data.error ?? 'Rate limit exceeded, please try again later.');
        return;
      }

      if (data.paymentRequired) {
        setError(data.error ?? 'Payment required for AI requests.');
        return;
      }

      if (data.error) {
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

      setEmotionData(newEmotionData);
      checkAndAlertFear(newEmotionData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      setEmotionData(DEFAULT_DATA);
    } finally {
      inFlightRef.current = false;
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
