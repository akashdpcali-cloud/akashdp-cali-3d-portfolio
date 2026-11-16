"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import "./BGMController.css";

import { portfolioBGM } from "@/app/data/portfolioData";

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
    audio.volume = 0.1;
    audio.muted = false;

    let playbackPending = false;
    let removeInteractionListeners = () => {};

    const playMusic = (fromUserInteraction = false) => {
      if (!audio.paused) {
        removeInteractionListeners();
        return;
      }

      if (playbackPending && !fromUserInteraction) return;

      playbackPending = true;
      audio
        .play()
        .then(() => {
          playbackPending = false;
          removeInteractionListeners();
        })
        .catch((error) => {
          playbackPending = false;

          if (error?.name !== "NotAllowedError") {
            console.error("Failed to play background music:", error);
          }
        });
    };

    const playNextSong = () => {
      currentSongIndexRef.current =
        (currentSongIndexRef.current + 1) % portfolioBGM.length;

      audio.src = portfolioBGM[currentSongIndexRef.current];

      audio.currentTime = 0;

      playMusic();
    };

    const handleFirstInteraction = () => {
      playMusic(true);
    };

    const interactionEvents = ["pointerdown", "touchstart", "keydown", "click"];
    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleFirstInteraction, true);
    });

    removeInteractionListeners = () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction, true);
      });
    };

    const cleanup = () => {
      removeInteractionListeners();
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("ended", playNextSong);
      audio.src = "";
      audioRef.current = null;
    };

    audio.addEventListener("ended", playNextSong);

    // Try autoplay; if blocked, retry from a user interaction.
    playMusic();

    return cleanup;
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
