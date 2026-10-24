"use client";

import "./CharacterPopup.css";
import { characters } from "../../data/portfolioData";
import { IoClose } from "react-icons/io5";

export default function CharacterPopup({ onClose }) {
  return (
    <div className="character-popup">
      <div className="character-popup-header">
        <div className="character-popup-title">PICK YOUR CHARACTER</div>
        <button
          className="character-popup-close"
          onClick={onClose}
          aria-label="Close popup"
        >
          <IoClose />
        </button>
      </div>

      <div className="character-display-grid">
        {characters.map((character) => (
          <div className="character-display-card" key={character.id}>
            <div className="character-display-picture">
              <img
                src={character.image}
                alt={character.fullname}
                className="character-display-picture-img"
              />
            </div>
            <div className="character-display-fullname">
              {character.fullname.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
