import { useEffect, useRef } from "react";

export const useAutoPlay = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const tryAutoPlay = async () => {
      if (audioRef.current) {
        try {
          // First attempt: try auto-play without muting
          audioRef.current.muted = false;
          await audioRef.current.play();
        } catch (error) {
          console.log("Auto-play failed, trying with muted:", error);

          try {
            // Fallback: try auto-play with muted state, then immediately unmute
            audioRef.current.muted = true;
            await audioRef.current.play();

            // Immediately unmute (user has interacted with the page)
            audioRef.current.muted = false;
          } catch (mutedError) {
            console.log("Muted auto-play also failed:", mutedError);
          }
        }
      }
    };

    tryAutoPlay();
  }, []);

  return audioRef;
};
