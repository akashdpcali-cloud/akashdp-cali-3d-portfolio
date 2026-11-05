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
import RunButton from "./components/RunButton/RunButton";
import ExitTruckButton from "./components/ExitTruckButton/ExitTruckButton";
import BoardPopup from "./components/BoardPopup/BoardPopup";
import FeedbackPopup from "./components/FeedbackPopup/FeedbackPopup";
import AboutPopup from "./components/AboutPopup/AboutPopup";
import MapTrigger from "./components/MapTrigger/MapTrigger";
import MapPopup from "./components/MapPopup/MapPopup";
// import CharacterButton from "./components/CharacterButton/CharacterButton";
// import CharacterPopup from "./components/CharacterPopup/CharacterPopup";
import LoadingPage from "./components/LoadingPage/LoadingPage";

export default function Home() {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Peter is the default character.
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);

  const [isRunning, setIsRunning] = useState(false);
  const [isDriving, setIsDriving] = useState(false);

  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [mapTarget, setMapTarget] = useState(null);

  return (
    <main>
      <ThreeScene
        selectedCharacter={selectedCharacter}
        isRunning={isRunning}
        isDriving={isDriving}
        onEnterTruck={() => setIsDriving(true)}
        onExitTruck={() => {
          setIsDriving(false);
          setIsRunning(false);
        }}
        onBoardClick={setSelectedBoard}
        onPostBoxClick={() => setIsFeedbackOpen(true)}
        onUfcBeltClick={() => setIsAboutOpen(true)}
        teleportTarget={mapTarget}
      />

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

      {isDriving ? (
        <ExitTruckButton
          onExit={() => {
            window.dispatchEvent(new CustomEvent("exitTruck"));
          }}
        />
      ) : (
        <RunButton
          isRunning={isRunning}
          onToggle={() => setIsRunning((prev) => !prev)}
        />
      )}

      <BoardPopup
        data={selectedBoard}
        onClose={() => setSelectedBoard(null)}
        onOpen={() => {
          if (selectedBoard?.link) {
            window.open(selectedBoard.link, "_blank", "noopener,noreferrer");
          }
        }}
      />

      <FeedbackPopup
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {isAboutOpen && (
        <AboutPopup
          onClose={() => setIsAboutOpen(false)}
          summary={`I'm Akash, an engineering student and developer interested in building interactive web experiences.`}
          linkedinUrl="https://www.linkedin.com/in/YOUR_USERNAME/"
          githubUrl="https://github.com/YOUR_USERNAME"
          email="akashdpcali@gmail.com"
        />
      )}

      <MapTrigger onClick={() => setIsMapOpen(true)} />

      {isMapOpen && (
        <MapPopup
          onClose={() => setIsMapOpen(false)}
          onLocationSelect={(coords) => {
            setMapTarget({
              x: coords[0],
              z: coords[1],
            });

            setIsMapOpen(false);
          }}
        />
      )}

      {/* <LoadingPage /> */}

      {/* Your future portfolio components will go here */}
    </main>
  );
}
