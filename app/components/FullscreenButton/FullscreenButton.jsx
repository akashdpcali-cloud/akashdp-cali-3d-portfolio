"use client";

import { useEffect, useState } from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import "./FullscreenButton.css";

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", updateFullscreenState);
    return () =>
      document.removeEventListener("fullscreenchange", updateFullscreenState);
  }, []);

  const toggleFullscreen = async () => {
    setErrorMessage("");

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        setErrorMessage("Fullscreen is not supported by this browser.");
      }
    } catch (error) {
      console.error("Unable to change fullscreen mode:", error);
      setErrorMessage("Unable to change fullscreen mode.");
    }
  };

  return (
    <div className="fullscreen-control">
      <button
        type="button"
        className="fullscreen-button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
      </button>
      {errorMessage && (
        <span className="fullscreen-error" role="status">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
