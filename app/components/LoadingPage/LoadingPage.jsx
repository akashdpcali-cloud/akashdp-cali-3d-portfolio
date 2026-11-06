"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { Timer } from "three/src/core/Timer.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import "./LoadingPage.css";

const loadingPageData = [
  "Generating the 3D viewport",
  "Spawning the Three.js scene",
  "Staging the GSAP timeline",
  "Hydrating the virtual DOM",
];

export default function LoadingPage({
  isComplete = false,
  isFadingOut = false,
}) {
  const messageTrackRef = useRef(null);
  const progressRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // =========================================
    // LOADING MESSAGES ANIMATION
    // =========================================

    const messageTrack = messageTrackRef.current;

    const messageTimeline = gsap.timeline({
      repeat: -1,
    });

    loadingPageData.forEach((_, index) => {
      messageTimeline.to(messageTrack, {
        yPercent: -(index + 1) * 25,
        duration: 0.65,
        ease: "power3.inOut",
        delay: index === 0 ? 2.35 : 2.35,
      });

      if (index === loadingPageData.length - 1) {
        messageTimeline.set(messageTrack, {
          yPercent: 0,
        });
      }
    });

    // =========================================
    // PROGRESS BAR ANIMATION
    // =========================================

    // =========================================
    // THREE.JS FBX CHARACTER
    // =========================================

    const container = canvasRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    camera.position.set(0, 2, 7);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.setClearColor(0x000000, 0);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // =========================================
    // LIGHTING
    // =========================================

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);

    directionalLight.position.set(3, 6, 5);
    directionalLight.castShadow = true;

    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0xffd0a0, 3);

    rimLight.position.set(-4, 3, -3);

    scene.add(rimLight);

    // =========================================
    // FBX MODEL
    // =========================================

    const clock = new THREE.Clock();

    let mixer = null;
    let model = null;
    let animationFrameId;

    const loader = new FBXLoader();

    loader.load(
      "/models/peter/peter-run.fbx",

      (fbx) => {
        model = fbx;

        // =====================================
        // MODEL SCALE
        // Change these values to adjust size.
        // =====================================

        model.scale.set(1, 1, 1);

        // =====================================
        // MODEL ROTATION
        // Values are in radians.
        // =====================================

        model.rotation.set(0, Math.PI / 2, 0);

        // =====================================
        // MODEL POSITION
        // =====================================

        model.position.set(0, 0, 0);

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              child.material.needsUpdate = true;
            }
          }
        });

        scene.add(model);

        // =====================================
        // INFINITE RUNNING ANIMATION
        // =====================================

        if (fbx.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);

          fbx.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);

            action.setLoop(THREE.LoopRepeat, Infinity);

            action.play();
          });
        } else {
          console.warn("No animation clips found in peter-run.fbx");
        }
      },

      (progress) => {
        if (progress.total > 0) {
          console.log(
            `FBX loading: ${Math.round(
              (progress.loaded / progress.total) * 100,
            )}%`,
          );
        }
      },

      (error) => {
        console.error("FBX loading failed:", error);
      },
    );

    // =========================================
    // RESIZE HANDLER
    // =========================================

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // =========================================
    // ANIMATION LOOP
    // =========================================

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (mixer) {
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    // =========================================
    // CLEANUP
    // =========================================

    return () => {
      messageTimeline.kill();

      window.removeEventListener("resize", handleResize);

      cancelAnimationFrame(animationFrameId);

      if (mixer && model) {
        mixer.stopAllAction();
      }

      if (model) {
        scene.remove(model);

        model.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();

            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else if (child.material) {
              child.material.dispose();
            }
          }
        });
      }

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);
  useEffect(() => {
    if (!progressRef.current) return;

    if (isComplete) {
      gsap.to(progressRef.current, {
        width: "100%",
        duration: 0.5,
        ease: "power2.out",
      });

      return;
    }

    gsap.set(progressRef.current, {
      width: "0%",
    });

    const progressTween = gsap.to(progressRef.current, {
      width: "90%",
      duration: 7,
      ease: "none",
    });

    return () => {
      progressTween.kill();
      gsap.killTweensOf(progressRef.current);
    };
  }, [isComplete]);

  return (
    <div className={`loadingpage ${isFadingOut ? "loadingpage-fade-out" : ""}`}>
      {/* BACKGROUND DEPTH ELEMENTS */}

      <div className="loading-bg-glow"></div>
      <div className="loading-bg-grid"></div>
      <div className="loading-bg-orb loading-bg-orb-one"></div>
      <div className="loading-bg-orb loading-bg-orb-two"></div>

      {/* LOADING HEADER */}

      <div className="loading-page-content">
        <div className="loading-page-brand">
          <span className="loading-brand-dot"></span>
          INITIALIZING PORTFOLIO
        </div>

        {/* LOADING MESSAGES */}

        <div className="loading-message-window">
          <div className="loading-message-track" ref={messageTrackRef}>
            {loadingPageData.map((message, index) => (
              <div className="loading-message-slide" key={index}>
                <span>{message}</span>

                <div className="loading-page-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D CHARACTER */}

        <div className="loading-page-canvas" ref={canvasRef}></div>

        {/* PROGRESS BAR */}

        <div className="loading-page-progress-container">
          <div className="loading-page-progress-track">
            <div className="loading-page-progressbar" ref={progressRef}></div>
          </div>
        </div>
      </div>

      {/* BOTTOM LABEL */}

      <div className="loading-page-footer">
        <span>PLEASE WAIT</span>
        <span>BUILDING YOUR EXPERIENCE</span>
      </div>
    </div>
  );
}
