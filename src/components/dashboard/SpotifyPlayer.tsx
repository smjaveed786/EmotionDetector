import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Languages } from 'lucide-react';
import { SPOTIFY_PLAYLISTS, Language } from '@/data/spotifyData';

interface SpotifyPlayerProps {
    emotion: string;
    language: Language;
    onLanguageChange: (lang: Language) => void;
    isVisible: boolean;
}

export function SpotifyPlayer({ emotion, language, onLanguageChange, isVisible }: SpotifyPlayerProps) {
    const [playlistId, setPlaylistId] = useState(SPOTIFY_PLAYLISTS[language].default);

    useEffect(() => {
        // If emotion is 'angry', switch to the 'calming' playlist for the language
        // Otherwise we could just stick to default or do nothing.
        // The requirement says "when anger detected should play songs".

        // We update the playlist ID based on emotion
        if (emotion === 'angry') {
            console.log('Anger detected! Switching to calming playlist for:', language);
            setPlaylistId(SPOTIFY_PLAYLISTS[language].angry);
        } else {
            // Optional: revert to default or keep playing calming music?
            // Let's stick to default for now so it feels responsive
            setPlaylistId(SPOTIFY_PLAYLISTS[language].default);
        }
    }, [emotion, language]);

    if (!isVisible && emotion !== 'angry') {
        // If we want to hide it completely when not angry, return null.
        // But usually user might want to control it.
        // Let's keep it visible but maybe smaller? 
        // Requirement: keeping option to select songs language. 
        // So it should be visible always or at least the controls.
    }

    return (
        <Card className="glass-card shadow-card overflow-hidden transition-all duration-300">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Music className="h-5 w-5 text-purple-400" />
                    Music Therapy
                </CardTitle>

                <Select value={language} onValueChange={(v) => onLanguageChange(v as Language)}>
                    <SelectTrigger className="w-[120px] h-8 bg-white/10 border-white/20 text-white text-xs">
                        <Languages className="w-3 h-3 mr-2" />
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="telugu">Telugu</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent>
                <div className="rounded-lg overflow-hidden bg-black/40">
                    <iframe
                        key={playlistId}
                        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0&autoplay=1`}
                        width="100%"
                        height="152"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="border-none"
                    />
                </div>
                {emotion === 'angry' && (
                    <p className="text-xs text-center text-purple-300 mt-2 animate-pulse">
                        Anger detected. Playing calming music for you.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
