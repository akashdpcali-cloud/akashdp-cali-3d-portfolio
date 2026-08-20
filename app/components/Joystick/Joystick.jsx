"use client";

import { useEffect, useRef } from "react";

import "./Joystick.css";

export default function Joystick({ onMove }) {
  const joystickRef = useRef(null);

  useEffect(() => {
    const joystickZone = joystickRef.current;

    if (!joystickZone) return;

    let joystick;

    const setupJoystick = async () => {
      const nipplejs = (await import("nipplejs")).default;

      joystick = nipplejs.create({
        zone: joystickZone,
        mode: "static",
        position: {
          left: "50%",
          top: "50%",
        },
        size: 100,
        color: "white",
        opacity: 0.75,
        restOpacity: 0.5,
        threshold: 0.1,
      });

      joystick.on("move", (event, data) => {
        if (!data?.angle?.degree) return;

        const angle = data.angle.degree;

        let direction;

        if (angle >= 22.5 && angle < 67.5) {
          direction = "W-D";
        } else if (angle >= 67.5 && angle < 112.5) {
          direction = "W";
        } else if (angle >= 112.5 && angle < 157.5) {
          direction = "W-A";
        } else if (angle >= 157.5 && angle < 202.5) {
          direction = "A";
        } else if (angle >= 202.5 && angle < 247.5) {
          direction = "A-S";
        } else if (angle >= 247.5 && angle < 292.5) {
          direction = "S";
        } else if (angle >= 292.5 && angle < 337.5) {
          direction = "S-D";
        } else {
          direction = "D";
        }

        onMove?.(direction);
      });
      joystick.on("end", () => {
        onMove?.(null);
      });
    };

    setupJoystick();

    return () => {
      joystick?.destroy();
    };
  }, [onMove]);

  return (
    <div className="joystick-dev">
      <div className="joystick-direction joystick-forward">↑</div>

      <div className="joystick-direction joystick-backward">↓</div>

      <div className="joystick-direction joystick-left">←</div>

      <div className="joystick-direction joystick-right">→</div>

      <div className="joystick-direction joystick-forward-left">↖</div>

      <div className="joystick-direction joystick-forward-right">↗</div>

      <div className="joystick-direction joystick-backward-left">↙</div>

      <div className="joystick-direction joystick-backward-right">↘</div>

      <div ref={joystickRef} className="joystick-zone" />
    </div>
  );
}
