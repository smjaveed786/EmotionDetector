import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploadProps {
    onImageSelect: (base64: string) => void;
    onClear?: () => void;
    isAnalyzing: boolean;
}

export function ImageUpload({ onImageSelect, onClear, isAnalyzing }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setPreview(base64String);
            // Remove data URL prefix (e.g., "data:image/jpeg;base64,") before sending if needed, 
            // but usually libraries handle it. The analyze-emotion function likely expects the full string or just the base64 part.
            // Checking useEmotionAnalysis: calls supabase function with { body: { imageBase64 } }
            // The edge function likely parses this. Most Supabase edge functions examples expect data URI or stripped base64.
            // Let's assume sending the whole data URI is safer for now as we can strip it on server if needed, 
            // or if the server expects pure base64 we might need to strip.
            // Looking at common practices, let's strip the prefix if it exists just to be safe for "imageBase64" field name.
            const pureBase64 = base64String.split(',')[1] || base64String;
            onImageSelect(pureBase64);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClear?.();
    };

    return (
        <Card className="glass-card shadow-card">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Upload Image
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {preview ? (
                        <div className="relative rounded-lg overflow-hidden border border-white/20 aspect-video bg-black/50">
                            <img src={preview} alt="Upload preview" className="w-full h-full object-contain" />
                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={clearImage}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/20 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors gap-2"
                        >
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground text-center">
                                Click to upload an image for analysis
                            </p>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {isAnalyzing && (
                        <p className="text-sm text-center text-primary animate-pulse">Analyzing emotion...</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
