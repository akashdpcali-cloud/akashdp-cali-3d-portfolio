"use client";

import "./CharacterFrontend.css";
import CharacterButton from "../CharacterButton/CharacterButton";
import CharacterPopup from "../CharacterPopup/CharacterPopup";

import { useState } from "react";

export default function CharacterFrontend() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <>
      <CharacterButton onClick={() => setIsPopupOpen(true)} />
      {isPopupOpen && <CharacterPopup onClose={() => setIsPopupOpen(false)} />}
    </>
  );
}
