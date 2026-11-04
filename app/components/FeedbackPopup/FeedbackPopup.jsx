"use client";

import "./FeedbackPopup.css";
import { FiX, FiSend } from "react-icons/fi";

export default function FeedbackPopup() {
  return (
    <div className="feedback-popup">
      <div className="feedback-popup-header">
        <div className="feedback-popup-title">feedback</div>
        <button className="feedback-popup-close">
          <FiX />
        </button>
      </div>
      <textarea
        placeholder="great portfolio"
        name=""
        id=""
        className="feedback-popup-input"
      ></textarea>
      <button className="feedback-popup-send">
        <FiSend />
      </button>
    </div>
  );
}
