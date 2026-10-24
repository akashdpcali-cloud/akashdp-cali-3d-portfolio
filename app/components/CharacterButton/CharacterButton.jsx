"use client";

import "./CharacterButton.css";
import { FaUser } from "react-icons/fa";

export default function CharacterButton({ onClick }) {
  return (
    <button className="character-button" onClick={onClick}>
      <FaUser />
    </button>
  );
}
