"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import "./BGMController.css";

const portfolioBGM = [
  "/audio/bgm1.mp3",
  "/audio/bgm2.mp3",
  "/audio/bgm3.mp3",
  "/audio/bgm4.mp3",
];

export default function BGMController() {
  const audioRef = useRef(null);
  const currentSongIndexRef = useRef(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio();

    audioRef.current = audio;

    // Always start from the first song.
    currentSongIndexRef.current = 0;

    audio.src = portfolioBGM[0];
    audio.currentTime = 0;
    audio.volume = 0.35;
    audio.muted = false;

    const playMusic = () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    };

    const playNextSong = () => {
      currentSongIndexRef.current =
        (currentSongIndexRef.current + 1) % portfolioBGM.length;

      audio.src = portfolioBGM[currentSongIndexRef.current];

      audio.currentTime = 0;

      playMusic();
    };

    audio.addEventListener("ended", playNextSong);

    // Try autoplay immediately.
    playMusic();

    /*
     * If the browser blocks autoplay,
     * start music after the user's first interaction.
     */
    const handleFirstInteraction = () => {
      playMusic();

      window.removeEventListener("pointerdown", handleFirstInteraction);

      window.removeEventListener("keydown", handleFirstInteraction);

      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction);

    window.addEventListener("keydown", handleFirstInteraction);

    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      audio.pause();
      audio.currentTime = 0;

      audio.removeEventListener("ended", playNextSong);

      window.removeEventListener("pointerdown", handleFirstInteraction);

      window.removeEventListener("keydown", handleFirstInteraction);

      window.removeEventListener("touchstart", handleFirstInteraction);

      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => {});
    }

    audio.muted = !audio.muted;

    setIsMuted(audio.muted);
  };

  return (
    <div className="bgm-speaker-button">
      <button
        type="button"
        onClick={toggleMute}
        aria-label={
          isMuted ? "Unmute background music" : "Mute background music"
        }
      >
        {isMuted ? (
          <VolumeX className="bgm-speaker-off" />
        ) : (
          <Volume2 className="bgm-speaker-on" />
        )}
      </button>
    </div>
  );
}
