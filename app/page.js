"use client";
import { useState } from "react";

import { characters } from "./data/portfolioData";

import ThreeScene from "./components/ThreeScene/ThreeScene";
import BGMController from "./components/BGMController/BGMController";
import ClickSound from "./components/ClickSound/ClickSound";
import Joystick from "./components/Joystick/Joystick";
import InstructionPopup from "./components/InstructionPopup/InstructionPopup";
import AiTrigger from "./components/AiTrigger/AiTrigger";
import AiChatSection from "./components/AiChatSection/AiChatSection";
import CharacterFrontend from "./components/CharacterFrontend/CharacterFrontend";

// import CharacterButton from "./components/CharacterButton/CharacterButton";
// import CharacterPopup from "./components/CharacterPopup/CharacterPopup";
import LoadingPage from "./components/LoadingPage/LoadingPage";

export default function Home() {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Peter is the default character.
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);

  return (
    <main>
      <ThreeScene selectedCharacter={selectedCharacter} />

      <InstructionPopup />
      <BGMController />
      <ClickSound />
      <CharacterFrontend
        selectedCharacter={selectedCharacter}
        onSelectCharacter={setSelectedCharacter}
      />
      {/* <CharacterButton />
      <CharacterPopup /> */}
      <Joystick
        onMove={(direction) => {
          window.dispatchEvent(
            new CustomEvent("joystickMove", {
              detail: direction,
            }),
          );
        }}
      />
      <AiTrigger onClick={() => setIsAiChatOpen(true)} />
      <AiChatSection
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />

      {/* <LoadingPage /> */}

      {/* Your future portfolio components will go here */}
    </main>
  );
}
