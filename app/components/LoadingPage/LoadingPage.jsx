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
  const messageRef = useRef(null);
  const modelCanvasRef = useRef(null);

  useEffect(() => {
    /*
    ------------------------------------------------
    MESSAGE ANIMATION
    ------------------------------------------------
    */

    const messageElement = messageRef.current;
    let currentIndex = 0;

    messageElement.textContent = loadingPageData[currentIndex];

    const changeMessage = () => {
      gsap.to(messageElement, {
        xPercent: -100,
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          currentIndex = (currentIndex + 1) % loadingPageData.length;

          messageElement.textContent = loadingPageData[currentIndex];

          gsap.fromTo(
            messageElement,
            {
              xPercent: 100,
              opacity: 0,
            },
            {
              xPercent: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            },
          );
        },
      });
    };

    const messageInterval = setInterval(changeMessage, 3000);

    /*
    ------------------------------------------------
    THREE.JS
    ------------------------------------------------
    */

    const container = modelCanvasRef.current;

    const scene = new THREE.Scene();

    /*
    CAMERA
    */

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    /*
    RENDERER
    */

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    /*
    LIGHTING
    */

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);

    directionalLight.position.set(5, 10, 5);

    scene.add(directionalLight);

    /*
    FBX LOADER
    */

    const loader = new FBXLoader();

    let model = null;
    let mixer = null;

    loader.load(
      "/models/black-spider/black-spider-run.fbx",

      (fbx) => {
        model = fbx;

        console.log("FBX loaded:", fbx);
        console.log("Animations:", fbx.animations);
        console.log("Model:", fbx);

        /*
        MODEL SCALE
        */

        model.scale.setScalar(3);
        model.position.set(0, -3.5, 0);
        model.rotation.set(0, Math.PI / 2, 0);

        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        console.log("Model size:", size);
        console.log("Model center:", center);

        /*
        ANIMATION
        */

        if (fbx.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);

          const action = mixer.clipAction(fbx.animations[0]);

          action.play();
        }
      },

      (progress) => {
        if (progress.total > 0) {
          const percentage = (progress.loaded / progress.total) * 100;

          console.log(`Spider-Man loading: ${percentage.toFixed(0)}%`);
        }
      },

      (error) => {
        console.error("Failed to load Spider-Man FBX:", error);
      },
    );

    /*
    ANIMATION LOOP
    */
    const timer = new Timer();

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      timer.update();

      const delta = timer.getDelta();

      if (mixer) {
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    /*
    RESIZE
    */

    const handleResize = () => {
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    /*
    CLEANUP
    */

    return () => {
      clearInterval(messageInterval);
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener("resize", handleResize);

      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <main className="loading-page-div">
      <picture className="loading-page-background">
        <source
          media="(max-width: 768px)"
          srcSet="/assets/loading-phone-bg.jpeg"
        />

        <img src="/assets/loading-desktop-bg.jpeg" alt="" />
      </picture>

      <div className="loading-page-title">
        Akash D P: Spider-Verse Portfolio
      </div>

      <div className="loading-page-message-display-div">
        <div ref={messageRef} />
      </div>

      <div ref={modelCanvasRef} className="loading-page-model-run-canvas" />

      <div className="loading-page-progress-bar">
        <div className="loading-page-progress-fill" />
      </div>
    </main>
  );
}
