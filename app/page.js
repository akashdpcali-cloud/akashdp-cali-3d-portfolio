"use client";

import { useState, useEffect, useCallback } from "react";

import { characters } from "./data/portfolioData";
import "./LoadingIntegration.css";

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
import LoadingPage from "./components/LoadingPage/LoadingPage";

export default function Home() {
  // =========================================
  // LOADING STATES
  // =========================================

  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isMinimumTimeElapsed, setIsMinimumTimeElapsed] = useState(false);

  const [isLoadingVisible, setIsLoadingVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const isAppReady = isSceneReady && isMinimumTimeElapsed;

  const handleSceneReady = useCallback(() => {
    setIsSceneReady(true);
  }, []);

  // Minimum loading duration: 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinimumTimeElapsed(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // Fade out loading screen after everything is ready
  useEffect(() => {
    if (!isAppReady) return;

    setIsFadingOut(true);

    const timer = setTimeout(() => {
      setIsLoadingVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAppReady]);

  // =========================================
  // EXISTING STATES
  // =========================================

  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);

  const [isRunning, setIsRunning] = useState(false);
  const [isDriving, setIsDriving] = useState(false);

  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [mapTarget, setMapTarget] = useState(null);

  // =========================================
  // RENDER
  // =========================================

  return (
    <main className="portfolio-root">
      {/* =====================================
          THREE.JS SCENE
          Starts dark and reveals when ready
      ===================================== */}

      <div className={`scene-reveal ${isAppReady ? "scene-reveal-ready" : ""}`}>
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
          onSceneReady={handleSceneReady}
        />
      </div>

      {/* =====================================
          OTHER PORTFOLIO COMPONENTS
      ===================================== */}

      <div className={`portfolio-ui ${isAppReady ? "portfolio-ui-ready" : ""}`}>
        <InstructionPopup />

        <BGMController />

        <ClickSound />

        <CharacterFrontend
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
        />

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
            onLocationSelect={(coords, truckCoords) => {
              setMapTarget({
                x: coords[0],
                z: coords[1],
                truckTarget: {
                  x: truckCoords[0],
                  z: truckCoords[1],
                },
              });

              setIsMapOpen(false);
            }}
          />
        )}
      </div>

      {/* =====================================
          LOADING SCREEN
      ===================================== */}

      {isLoadingVisible && (
        <LoadingPage isComplete={isAppReady} isFadingOut={isFadingOut} />
      )}
    </main>
  );
}
