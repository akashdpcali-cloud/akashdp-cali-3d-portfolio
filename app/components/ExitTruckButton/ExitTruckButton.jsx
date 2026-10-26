"use client";

import "./ExitTruckButton.css";
import { FaSignOutAlt } from "react-icons/fa";

export default function ExitTruckButton({ onExit }) {
  return (
    <button
      type="button"
      onClick={onExit}
      aria-label="Exit truck"
      className="exit-truck-button"
    >
      {" "}
      <FaSignOutAlt />{" "}
    </button>
  );
}
