"use client";
import { useState } from "react";

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
  return (
    <main>
      <ThreeScene />

      <InstructionPopup />
      <BGMController />
      <ClickSound />
      <CharacterFrontend />
      {/* <CharacterButton />
      <CharacterPopup /> */}
      <Joystick />
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
