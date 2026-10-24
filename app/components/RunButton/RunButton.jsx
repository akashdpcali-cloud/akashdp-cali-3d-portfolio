"use client";

import "./RunButton.css";

import { FaRunning } from "react-icons/fa";

export default function RunButton({ isRunning, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isRunning ? "Disable running" : "Enable running"}
      aria-pressed={isRunning}
      className={`run-button ${isRunning ? "running" : ""}`}
    >
      <FaRunning />
    </button>
  );
}
