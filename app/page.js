"use client";
import { useState } from "react";

import BGMController from "./components/BGMController/BGMController";
import Joystick from "./components/Joystick/Joystick";
import InstructionPopup from "./components/InstructionPopup/InstructionPopup";
import AiTrigger from "./components/AiTrigger/AiTrigger";
import AiChatSection from "./components/AiChatSection/AiChatSection";

export default function Home() {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  return (
    <main>
      <InstructionPopup />
      <BGMController />
      <Joystick />
      <AiTrigger onClick={() => setIsAiChatOpen(true)} />
      <AiChatSection
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />

      {/* Your future portfolio components will go here */}
    </main>
  );
}
