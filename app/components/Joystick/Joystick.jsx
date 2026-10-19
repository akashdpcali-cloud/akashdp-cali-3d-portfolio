"use client";

import { useEffect, useRef, useState } from "react";
import "./Joystick.css";

export default function Joystick({ onMove }) {
  const containerRef = useRef(null);
  const knobRef = useRef(null);
  const [activeDirection, setActiveDirection] = useState(null);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let center = { x: 0, y: 0 };
    const maxRadius = 45;

    const getCenter = () => {
      const rect = container.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };

    const handleStart = (clientX, clientY) => {
      isDragging = true;
      center = getCenter();
      setIsTouched(true);
      handleMove(clientX, clientY);
    };

    const handleMove = (clientX, clientY) => {
      if (!isDragging) return;

      const dx = clientX - center.x;
      const dy = clientY - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angleRad = Math.atan2(-dy, dx);
      let angleDeg = (angleRad * 180) / Math.PI;
      if (angleDeg < 0) angleDeg += 360;

      const clampedDistance = Math.min(distance, maxRadius);
      const knobX = Math.cos(angleRad) * clampedDistance;
      const knobY = -Math.sin(angleRad) * clampedDistance;

      if (knobRef.current) {
        knobRef.current.style.transform = `translate(${knobX}px, ${knobY}px)`;
      }

      if (distance < 10) {
        setActiveDirection(null);
        onMove?.(null);
        return;
      }

      let direction = null;
      if (angleDeg >= 22.5 && angleDeg < 67.5) direction = "W-D";
      else if (angleDeg >= 67.5 && angleDeg < 112.5) direction = "W";
      else if (angleDeg >= 112.5 && angleDeg < 157.5) direction = "W-A";
      else if (angleDeg >= 157.5 && angleDeg < 202.5) direction = "A";
      else if (angleDeg >= 202.5 && angleDeg < 247.5) direction = "A-S";
      else if (angleDeg >= 247.5 && angleDeg < 292.5) direction = "S";
      else if (angleDeg >= 292.5 && angleDeg < 337.5) direction = "S-D";
      else direction = "D";

      setActiveDirection(direction);
      onMove?.(direction);
    };

    const handleEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      setIsTouched(false);
      setActiveDirection(null);
      if (knobRef.current) {
        knobRef.current.style.transform = `translate(0px, 0px)`;
      }
      onMove?.(null);
    };

    // --- Mouse Event Wrappers ---
    const onMouseDown = (e) => handleStart(e.clientX, e.clientY);
    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();

    // --- Touch Event Wrappers ---
    const onTouchStart = (e) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    };
    const onTouchMove = (e) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => handleEnd();

    // Attach Mouse Listeners
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Attach Touch Listeners
    container.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMove]);

  return (
    <div className="joystick-wrapper">
      <div
        ref={containerRef}
        className={`sf2-joystick ${isTouched ? "active" : ""}`}
      >
        {/* Outer Directional Arrows (Shadow Fight Style) */}
        <div
          className={`arrow arrow-up ${activeDirection?.includes("W") ? "glowing" : ""}`}
        />
        <div
          className={`arrow arrow-down ${activeDirection?.includes("S") ? "glowing" : ""}`}
        />
        <div
          className={`arrow arrow-left ${activeDirection?.includes("A") ? "glowing" : ""}`}
        />
        <div
          className={`arrow arrow-right ${activeDirection?.includes("D") ? "glowing" : ""}`}
        />

        {/* Inner Track Ring */}
        <div className="track-ring" />

        {/* Central Moving Metallic Knob */}
        <div ref={knobRef} className="joystick-knob">
          <div className="knob-core" />
        </div>
      </div>
    </div>
  );
}
