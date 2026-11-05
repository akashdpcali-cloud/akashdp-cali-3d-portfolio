"use client";

import "./MapPopup.css";
import { IoMdPin } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const coordinates = {
  spawn: [0, 0],
  explore: [0, 46],
  feedback: [-52, 55],
  about: [-46, 103],
  cave: [10, 118],
  projects: [47, 102],
  tech_stack: [48, 69],
  conor: [-45, 136],
  me: [0, 136],
  old: [50, 136],
};

export default function MapPopup() {
  return (
    <div className="map-popup">
      <div className="map-popup-header">
        <div className="map-popup-title">Map</div>
        <button className="map-popup-close">
          <IoClose size={22} />
        </button>
      </div>
      <div className="map-display-div">
        <img src="/assets/map.jpeg" alt="" className="map-img" />

        <div className="location spawn" data-tooltip="SPAWN">
          <IoMdPin size={32} />
        </div>

        <div className="location explore" data-tooltip="EXPLORE">
          <IoMdPin size={32} />
        </div>

        <div className="location feedback" data-tooltip="FEEDBACK">
          <IoMdPin size={32} />
        </div>
        <div className="location about_me" data-tooltip="ABOUT">
          <IoMdPin size={32} />
        </div>

        <div className="location cave" data-tooltip="CAVE">
          <IoMdPin size={32} />
        </div>
        <div className="location projects" data-tooltip="PROJECTS">
          <IoMdPin size={32} />
        </div>
        <div className="location tech_stack" data-tooltip="TECH STACK">
          <IoMdPin size={32} />
        </div>
        <div className="location inspiration" data-tooltip="INSPIRATION">
          <IoMdPin size={32} />
        </div>
        <div className="location profession" data-tooltip="PROFESSION">
          <IoMdPin size={32} />
        </div>
        <div className="location old_me" data-tooltip="OLD ME">
          <IoMdPin size={32} />
        </div>
      </div>
    </div>
  );
}
