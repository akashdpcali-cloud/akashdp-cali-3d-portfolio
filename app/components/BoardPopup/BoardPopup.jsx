"use client";

import "./BoardPopup.css";
import { IoClose } from "react-icons/io5";

export default function BoardPopup() {
  return (
    <div className="boardpopup">
      <div className="boardpopup-header">
        <div className="boardpopup-title">title</div>
        <button className="boardpopup-close">
          <IoClose size={24} color="#333" />
        </button>
      </div>
      <div className="boardpopup-content">hello one two three</div>
      <button className="boardpopup-open-link">open</button>
    </div>
  );
}
