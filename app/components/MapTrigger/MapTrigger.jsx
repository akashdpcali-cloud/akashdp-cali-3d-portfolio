"use client";
import "./MapTrigger.css";

import { IoMdPin } from "react-icons/io";

export default function MapTrigger({ onClick }) {
  return (
    <button className="map-trigger" onClick={onClick}>
      <IoMdPin size={18} />
    </button>
  );
}
