import React, { useEffect, useState } from "react";
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player";

const MusicPlayerInternal: React.FC = () => {
  const { load, togglePlayPause } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(true);

  console.log(isPlaying);

  useEffect(() => {
    try {
      load("./music.mp3", {
        autoplay: true,
        loop: true,
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
    <>
      <h1>안녕하세요! 🎵</h1>
      <h1 onClick={togglePlayPause}>음악 중지/재생 클릭</h1>
    </>
  );
};

export const MusicPlayer = () => {
  return (
    <AudioPlayerProvider>
      <MusicPlayerInternal />
    </AudioPlayerProvider>
  );
};
