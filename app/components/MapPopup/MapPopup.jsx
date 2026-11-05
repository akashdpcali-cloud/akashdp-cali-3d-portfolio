"use client";

import "./MapPopup.css";
import { IoMdPin } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const coordinates = {
  SPAWN: [0, 0],
  EXPLORE: [0, 46],
  FEEDBACK: [-52, 55],
  ABOUT: [-46, 103],
  CAVE: [10, 118],
  PROJECTS: [47, 102],
  "TECH STACK": [48, 69],
  INSPIRATION: [-45, 136],
  PROFESSION: [0, 136],
  "OLD ME": [50, 136],
};

export default function MapPopup({ onClose, onLocationSelect }) {
  return (
    <div className="map-popup">
      <div className="map-popup-header">
        <div className="map-popup-title">Map</div>

        <button
          className="map-popup-close"
          onClick={onClose}
          aria-label="Close map"
        >
          <IoClose size={22} />
        </button>
      </div>

      <div className="map-display-div">
        <img src="/assets/map.jpeg" alt="" className="map-img" />

        <button
          className="location spawn"
          data-tooltip="SPAWN"
          onClick={() => onLocationSelect(coordinates.SPAWN)}
        >
          <IoMdPin size={32} />
        </button>

        <button
          className="location explore"
          data-tooltip="EXPLORE"
          onClick={() => onLocationSelect(coordinates.EXPLORE)}
        >
          <IoMdPin size={32} />
        </button>

        <button
          className="location feedback"
          data-tooltip="FEEDBACK"
          onClick={() => onLocationSelect(coordinates.FEEDBACK)}
        >
          <IoMdPin size={32} />
        </button>

        <button
          className="location about_me"
          data-tooltip="ABOUT"
          onClick={() => onLocationSelect(coordinates.ABOUT)}
        >
          <IoMdPin size={32} />
        </button>

        <button
          className="location cave"
          data-tooltip="CAVE"
          onClick={() => onLocationSelect(coordinates.CAVE)}
        >
          <IoMdPin size={32} />
        </button>

        <button
          className="location projects"
          data-tooltip="PROJECTS"
          onClick={() => onLocationSelect(coordinates.PROJECTS)}
        >
          <IoMdPin size={32} />
        </button>

        <button
          className="location tech_stack"
          data-tooltip="TECH STACK"
          onClick={() => onLocationSelect(coordinates["TECH STACK"])}
        >
          <IoMdPin size={32} />
        </button>

        <button
          className="location inspiration"
          data-tooltip="INSPIRATION"
          onClick={() => onLocationSelect(coordinates.INSPIRATION)}
        >
          <IoMdPin size={32} />
        </button>

        <button
          className="location profession"
          data-tooltip="PROFESSION"
          onClick={() => onLocationSelect(coordinates.PROFESSION)}
        >
          <IoMdPin size={32} />
        </button>

        <button
          className="location old_me"
          data-tooltip="OLD ME"
          onClick={() => onLocationSelect(coordinates["OLD ME"])}
        >
          <IoMdPin size={32} />
        </button>
      </div>
    </div>
  );
}
