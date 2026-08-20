import BGMController from "./components/BGMController/BGMController";
import Joystick from "./components/Joystick/Joystick";
import InstructionPopup from "./components/InstructionPopup/InstructionPopup";
import AiTrigger from "./components/AiTrigger/AiTrigger";

export default function Home() {
  return (
    <main>
      <InstructionPopup />
      <BGMController />
      <Joystick />
      <AiTrigger />

      {/* Your future portfolio components will go here */}
    </main>
  );
}
