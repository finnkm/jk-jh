import { useEffect, useState } from "react";
import { useAutoVersionCheck } from "./hooks/useAutoVersionCheck";
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player";

const MusicPlayer = () => {
  const { load, togglePlayPause } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(true);

  console.log(isPlaying);

  useEffect(() => {
    try {
      load("./music.mp3", {
        autoplay: true, // 자동 재생 시도
        loop: true, // 반복 재생
        onload: () => {
          setIsPlaying(true);
        },
        onstop: () => {
          setIsPlaying(false);
        },
      });
    } catch (err) {
      console.error("Error loading music:", err);
    }
  }, [load]);

  return (
    <div>
      <h1>안녕하세요! 🎵</h1>
      <h1 onClick={togglePlayPause}>음악 중지/재생 클릭</h1>
    </div>
  );
};

const App: React.FC = () => {
  useAutoVersionCheck();

  return (
    <AudioPlayerProvider>
      <MusicPlayer />
    </AudioPlayerProvider>
  );
};

export default App;
