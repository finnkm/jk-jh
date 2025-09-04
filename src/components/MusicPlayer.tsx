import React, { useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";
import { Volume2, VolumeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import musicFile from "/music.mp3";

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // iOS 무음모드 우회를 위한 특별 설정
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Howler.js로 음악 설정
    const sound = new Howl({
      src: [musicFile],
      loop: true,
      volume: 1.0,
      html5: false, // Web Audio API 강제 사용
      preload: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
    });

    soundRef.current = sound;

    // 무음모드 우회를 위한 강력한 방법
    const unlockAudio = async () => {
      try {
        // AudioContext 강제 활성화
        const ctx = Howler.ctx;
        if (ctx && ctx.state === "suspended") {
          await ctx.resume();
          console.log("AudioContext resumed");
        }

        // iOS 특별 처리
        if (isIOS) {
          // 무음 사운드를 먼저 재생하여 오디오 세션 활성화
          const silentSound = new Howl({
            src: ["data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAAAQcAAAAEAAQAARKwAAIhYAQACABAAZGF0YQAAAAA="],
            volume: 0,
            html5: false,
          });

          silentSound.play();
          silentSound.on("end", () => {
            silentSound.unload();
            // 메인 사운드 재생
            sound.volume(1.0);
            sound.play();
            console.log("iOS audio unlocked and music started");
          });
        } else {
          // 일반 브라우저
          sound.play();
          console.log("Music started");
        }

        // 이벤트 리스너 제거
        document.removeEventListener("touchstart", unlockAudio);
        document.removeEventListener("touchend", unlockAudio);
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("keydown", unlockAudio);
      } catch (error) {
        console.error("Failed to unlock audio:", error);
      }
    };

    // 다양한 사용자 상호작용 이벤트에 리스너 추가
    document.addEventListener("touchstart", unlockAudio, { once: true });
    document.addEventListener("touchend", unlockAudio, { once: true });
    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });

    // 즉시 재생 시도 (일부 환경에서 작동할 수 있음)
    setTimeout(() => {
      unlockAudio();
    }, 100);

    // 정리
    return () => {
      sound.unload();
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("touchend", unlockAudio);
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
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
