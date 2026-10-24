import { useEffect } from "react";

export default function ClickSound() {
  useEffect(() => {
    const clickAudio = new Audio("/audio/click.mp3");
    clickAudio.volume = 0.1;

    const handleClick = (event) => {
      if (event.target.closest("button")) {
        clickAudio.currentTime = 0;
        clickAudio.play();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
