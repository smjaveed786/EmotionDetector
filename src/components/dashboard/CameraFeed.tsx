import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Loader2 } from 'lucide-react';

interface CameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isStreaming: boolean;
  isAnalyzing: boolean;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
}

export function CameraFeed({
  videoRef,
  canvasRef,
  isStreaming,
  isAnalyzing,
  error,
  onStart,
  onStop,
}: CameraFeedProps) {
  return (
    <Card className="glass-card shadow-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Live Camera Feed
          </CardTitle>
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-muted">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!isStreaming ? 'hidden' : ''}`}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {!isStreaming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
              <CameraOff className="h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground text-center">
                {error || 'Camera is off. Click Start to begin emotion detection.'}
              </p>
            </div>
          )}
          
          {isStreaming && (
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </span>
                <span className="text-xs font-medium text-destructive">LIVE</span>
              </div>

              {error && (
                <div className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-2 py-1">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border">
          {!isStreaming ? (
            <Button onClick={onStart} className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <Button onClick={onStop} variant="destructive" className="w-full">
              <CameraOff className="h-4 w-4 mr-2" />
              Stop Camera
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
