import React, { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import musicFile from "/untitled.wav";

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current || audioRef.current) {
      return;
    }

    // 순수 HTML5 Audio 사용 (iOS 무음 모드 존중)
    const audio = new Audio(musicFile);
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = "auto";

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      console.warn("Music player error");
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    audioRef.current = audio;
    isInitializedRef.current = true;

    // 자동 재생 시도
    const tryAutoPlay = async () => {
      try {
        await audio.play();
      } catch (error) {
        // 자동 재생 실패 시 무시 (사용자가 버튼을 클릭해야 재생됨)
        console.log("Auto-play prevented:", error);
      }
    };
    tryAutoPlay();

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      isInitializedRef.current = false;
    };
  }, []);

  const handleToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch((error) => {
        console.warn("Play failed:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, []);

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle}>
      {isPlaying ? <Volume2 /> : <VolumeOff />}
    </Button>
  );
};
