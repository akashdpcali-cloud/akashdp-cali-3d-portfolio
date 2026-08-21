import BGMController from "./components/BGMController/BGMController";
import Joystick from "./components/Joystick/Joystick";
import InstructionPopup from "./components/InstructionPopup/InstructionPopup";
import AiTrigger from "./components/AiTrigger/AiTrigger";
import AiChatSection from "./components/AiChatSection/AiChatSection";

export default function Home() {
  return (
    <main>
      <InstructionPopup />
      <BGMController />
      <Joystick />
      <AiTrigger />
      <AiChatSection />

      {/* Your future portfolio components will go here */}
    </main>
  );
}
