import React, { useEffect, useState } from "react";
import { Volume2, VolumeOff } from "lucide-react";
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player";
import { Button } from "@/components/ui/button";

const MusicPlayerInternal: React.FC = () => {
  const { load, togglePlayPause } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    try {
      load("./music.mp3", {
        autoplay: true,
        loop: true,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
      });
    } catch (err) {
      console.error("Error loading music:", err);
    }
  }, [load]);

  const handleToggle = () => {
    togglePlayPause();
    setIsPlaying((prev) => !prev);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle}>
      {isPlaying ? <Volume2 /> : <VolumeOff />}
    </Button>
  );
};

export const MusicPlayer = () => {
  return (
    <AudioPlayerProvider>
      <MusicPlayerInternal />
    </AudioPlayerProvider>
  );
};
