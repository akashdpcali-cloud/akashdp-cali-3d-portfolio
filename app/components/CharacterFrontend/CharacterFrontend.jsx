"use client";

import "./CharacterFrontend.css";
import CharacterButton from "../CharacterButton/CharacterButton";
import CharacterPopup from "../CharacterPopup/CharacterPopup";

import { useState } from "react";

export default function CharacterFrontend({
  selectedCharacter,
  onSelectCharacter,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <>
      <CharacterButton onClick={() => setIsPopupOpen(true)} />
      <CharacterPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        selectedCharacter={selectedCharacter}
        onSelectCharacter={(character) => {
          onSelectCharacter(character);
          setIsPopupOpen(false);
        }}
      />
    </>
  );
}
