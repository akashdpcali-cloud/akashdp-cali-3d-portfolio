import BGMController from "./components/BGMController/BGMController";
import Joystick from "./components/Joystick/Joystick";
import InstructionPopup from "./components/InstructionPopup/InstructionPopup";

export default function Home() {
  return (
    <main>
      <InstructionPopup />
      <BGMController />
      <Joystick />

      {/* Your future portfolio components will go here */}
    </main>
  );
}
