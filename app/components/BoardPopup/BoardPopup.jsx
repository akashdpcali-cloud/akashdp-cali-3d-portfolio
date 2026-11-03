"use client";

import "./BoardPopup.css";
import { IoClose } from "react-icons/io5";

const BoardPopup = ({ data, onClose, onOpen }) => {
  if (!data) return null;

  return (
    <div className="boardpopup">
      <div className="boardpopup-header">
        <div className="boardpopup-title">{data.title}</div>

        <button
          className="boardpopup-close"
          onClick={onClose}
          aria-label="Close popup"
        >
          <IoClose size={22} />
        </button>
      </div>

      <div className="boardpopup-content">{data.content}</div>

      {data.link && (
        <button className="boardpopup-open-link" onClick={onOpen}>
          Open
        </button>
      )}
    </div>
  );
};

export default BoardPopup;
