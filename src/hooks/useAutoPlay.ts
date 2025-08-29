import { useEffect, useRef } from "react";

export const useAutoPlay = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const tryAutoPlay = async () => {
      if (audioRef.current) {
        try {
          // 음소거 상태에서 자동재생 시도 (브라우저 정책 우회)
          audioRef.current.muted = true;
          await audioRef.current.play();

          // 잠시 후 음소거 해제
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.muted = false;
            }
          }, 1000);
        } catch (error) {
          console.log("Auto-play failed:", error);
        }
      }
    };

    tryAutoPlay();
  }, []);

  return audioRef;
};
