"use client";

import "./CharacterPopup.css";
import { characters } from "../../data/portfolioData";
import { IoClose } from "react-icons/io5";

export default function CharacterPopup({
  isOpen,
  onClose,
  selectedCharacter,
  onSelectCharacter,
}) {
  if (!isOpen) return null;

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
          <div
            className={`character-display-card ${
              selectedCharacter?.id === character.id ? "selected" : ""
            }`}
            key={character.id}
            onClick={() => {
              console.log("Selected character:", character.name);
              onSelectCharacter(character);
            }}
          >
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

            {/* {selectedCharacter?.id === character.id && <span>Selected</span>} */}
          </div>
        ))}
      </div>
    </div>
  );
}
