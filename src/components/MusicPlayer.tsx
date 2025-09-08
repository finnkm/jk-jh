import React, { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { Volume2, VolumeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import musicFile from "/untitled.wav";

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current || soundRef.current) {
      return;
    }

    const sound = new Howl({
      src: [musicFile],
      loop: true,
      volume: 0.3,
      preload: true,
      html5: true,
      onload: () => {
        setTimeout(() => {
          if (soundRef.current && !soundRef.current.playing()) {
            soundRef.current.play();
          }
        }, 100);
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onplayerror: (_id, error) => {
        console.warn("Music player error:", error);
        sound.once("unlock", () => {
          if (soundRef.current && !soundRef.current.playing()) {
            soundRef.current.play();
          }
        });
      },
    });

    soundRef.current = sound;
    isInitializedRef.current = true;

    return () => {
      if (sound) {
        sound.stop();
        sound.unload();
      }
      soundRef.current = null;
      isInitializedRef.current = false;
    };
  }, []);

  const handleToggle = useCallback(() => {
    const sound = soundRef.current;
    if (!sound) return;

    if (sound.playing()) {
      sound.pause();
    } else {
      sound.play();
    }
  }, []);

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle}>
      {isPlaying ? <Volume2 /> : <VolumeOff />}
    </Button>
  );
};
