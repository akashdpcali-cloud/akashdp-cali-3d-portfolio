"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { Timer } from "three/src/core/Timer.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import "./LoadingPage.css";

const loadingPageData = [
  "Welcome to my Spider-Verse 3D Portfolio",
  "Powered by Next.js, Three.js and GSAP animations",
  "Explore different sections of the world to see my work",
];

export default function LoadingPage() {
  return <div className="loadingpage">loading</div>;
}
