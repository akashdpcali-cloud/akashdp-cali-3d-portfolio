"use client";

import { useState } from "react";
import { Circle } from "lucide-react";

import "./InstructionPopup.css";

const instructionPopupData = [
  "Welcome to my interactive 3D portfolio, inspired by the visual world of Spider-Verse.",
  "Use W, A, S, and D to navigate your character through the environment.",
  "Explore the world to discover my projects, skills, experience, and other work.",
];

export default function InstructionPopup() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="instruction-popup-div">
      <div className="instruction-popup-title">Instruction</div>

      <div className="instruction-popup-data-display-div">
        {instructionPopupData.map((point, index) => (
          <div className="instruction-popup-data" key={index}>
            <Circle className="instruction-popup-dot" />

            <div className="instruction-popup-point">{point}</div>
          </div>
        ))}
      </div>

      <button
        className="instruction-popup-ok-button"
        type="button"
        onClick={() => setIsVisible(false)}
      >
        Okay
      </button>
    </div>
  );
}
