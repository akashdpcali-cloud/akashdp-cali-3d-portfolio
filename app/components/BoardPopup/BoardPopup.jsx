"use client";

import "./BoardPopup.css";
import { IoClose } from "react-icons/io5";
import usePopupAnimation from "../usePopupAnimation";

const BoardPopup = ({ data, onClose, onOpen }) => {
  const popupRef = usePopupAnimation(onOpen);
  if (!data) return null;

  return (
    <div className="boardpopup" ref={popupRef}>
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
