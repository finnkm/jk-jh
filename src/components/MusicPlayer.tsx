import React, { useEffect, useState } from "react";
import { Volume2, VolumeOff } from "lucide-react";
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player";
import { Button } from "@/components/ui/button";

const MusicPlayerInternal: React.FC = () => {
  const { load, togglePlayPause } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const sourceRef = React.useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    try {
      // AudioContext 생성 - 이것이 핸드폰 무음 모드 우회의 핵심
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      load("./music.mp3", {
        autoplay: true,
        loop: true,
        onplay: () => {
          setIsPlaying(true);
          // AudioContext resume
          if (audioContext.state === "suspended") {
            audioContext.resume();
          }
        },
        onpause: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
      });

      // 약간의 지연 후 오디오 엘리먼트 찾아서 AudioContext와 연결
      setTimeout(() => {
        const audioElement = document.querySelector("audio") as HTMLAudioElement;
        if (audioElement && audioContext && !sourceRef.current) {
          try {
            const source = audioContext.createMediaElementSource(audioElement);
            source.connect(audioContext.destination);
            sourceRef.current = source;
          } catch (error) {
            console.log("AudioContext already connected or error:", error);
          }
        }
      }, 500);
    } catch (err) {
      console.error("Error setting up audio:", err);
    }
  }, [load]);

  const handleToggle = async () => {
    const audioContext = audioContextRef.current;

    // 사용자 상호작용으로 AudioContext 활성화
    if (audioContext && audioContext.state === "suspended") {
      await audioContext.resume();
    }

    // 첫 번째 클릭에서 자동 재생 시작
    if (!isPlaying) {
      const audioElement = document.querySelector("audio") as HTMLAudioElement;
      if (audioElement) {
        try {
          await audioElement.play();
          setIsPlaying(true);
          return;
        } catch (error) {
          console.error("Auto play failed:", error);
        }
      }
    }

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
