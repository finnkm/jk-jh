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
            // Fallback: try auto-play with muted state
            audioRef.current.muted = true;
            await audioRef.current.play();

            // Wait for user interaction to unmute
            const handleUserInteraction = () => {
              if (audioRef.current) {
                audioRef.current.muted = false;
                // Remove event listeners after first interaction
                document.removeEventListener("click", handleUserInteraction);
                document.removeEventListener("touchstart", handleUserInteraction);
                document.removeEventListener("keydown", handleUserInteraction);
              }
            };

            // Add event listeners for user interactions
            document.addEventListener("click", handleUserInteraction, { once: true });
            document.addEventListener("touchstart", handleUserInteraction, { once: true });
            document.addEventListener("keydown", handleUserInteraction, { once: true });
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
