import { useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Music as MusicIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { type Music } from "@shared/schema";

interface MusicPlayerProps {
  playlist: Music[];
}

export function MusicPlayer({ playlist }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  if (!playlist.length) return null;

  const currentTrack = playlist[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
    // Timeout to allow audio src to update
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-white/80 backdrop-blur-lg border border-rose-200 p-4 rounded-2xl shadow-xl w-72">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-rose-100 p-2 rounded-lg">
            <MusicIcon className="w-5 h-5 text-rose-500" />
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-sm truncate">{currentTrack.title}</p>
            <p className="text-xs text-rose-400">Now Playing</p>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.url}
          onEnded={nextTrack}
        />

        <div className="flex items-center justify-between mt-2">
          <Button variant="ghost" size="icon" onClick={prevTrack} className="hover:text-rose-500">
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button 
            size="icon" 
            className="bg-rose-500 hover:bg-rose-600 rounded-full h-10 w-10 shadow-lg shadow-rose-200"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={nextTrack} className="hover:text-rose-500">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
