import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { Volume2, VolumeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import musicFile from "/music.wav";

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    const sound = new Howl({
      src: [musicFile],
      loop: true,
      volume: 1,
      preload: true,
      html5: true,
      onload: () => {
        sound.play();
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onplayerror: () => {
        sound.once("unlock", () => {
          sound.play();
        });
      },
    });

    soundRef.current = sound;

    return () => {
      sound.unload();
    };
  }, []);

  const handleToggle = () => {
    const sound = soundRef.current;
    if (!sound) return;

    if (sound.playing()) {
      sound.pause();
    } else {
      sound.play();
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle}>
      {isPlaying ? <Volume2 /> : <VolumeOff />}
    </Button>
  );
};
