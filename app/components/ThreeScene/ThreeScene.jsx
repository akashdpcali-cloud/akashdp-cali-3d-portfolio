"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import InfiniteGround from "./InfiniteGround";
import "./ThreeScene.css";

export default function ThreeScene({ selectedCharacter }) {
  const mountRef = useRef(null);

  const sceneRef = useRef(null);
  const mixerRef = useRef(null);
  const characterRef = useRef(null);
  const loaderRef = useRef(null);
  const requestRef = useRef(null);

  // Initialize the Three.js scene only once.
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      3000,
    );

    camera.position.set(0, 8, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x334155, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const { ground } = InfiniteGround(scene);

    const loader = new FBXLoader();
    loaderRef.current = loader;

    const clock = new THREE.Clock();

    let disposed = false;

    function animate() {
      if (disposed) return;

      requestRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      renderer.render(scene, camera);
    }

    animate();

    function handleResize() {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;

      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", handleResize);

      if (mixerRef.current) {
        mixerRef.current.stopAllAction();

        if (characterRef.current) {
          mixerRef.current.uncacheRoot(characterRef.current);
        }

        mixerRef.current = null;
      }

      if (characterRef.current) {
        scene.remove(characterRef.current);
        disposeCharacter(characterRef.current);
        characterRef.current = null;
      }

      scene.remove(ground);
      ground.geometry.dispose();
      ground.material.dispose();

      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }

      sceneRef.current = null;
      loaderRef.current = null;
    };
  }, []);

  // Load a new character whenever the selection changes.
  useEffect(() => {
    const scene = sceneRef.current;
    const loader = loaderRef.current;

    if (!scene || !loader || !selectedCharacter?.idle) return;

    let cancelled = false;
    let loadedCharacter = null;

    // Stop and remove the previous character.
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();

      if (characterRef.current) {
        mixerRef.current.uncacheRoot(characterRef.current);
      }

      mixerRef.current = null;
    }

    if (characterRef.current) {
      scene.remove(characterRef.current);
      disposeCharacter(characterRef.current);
      characterRef.current = null;
    }

    console.log("Loading character:", selectedCharacter.name);
    console.log("Model path:", selectedCharacter.idle);

    loader.load(
      selectedCharacter.idle,
      (fbx) => {
        if (cancelled || !sceneRef.current) {
          disposeCharacter(fbx);
          return;
        }

        loadedCharacter = fbx;

        fbx.scale.setScalar(1);
        fbx.position.set(0, 0, 0);

        fbx.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(fbx);
        characterRef.current = fbx;

        const mixer = new THREE.AnimationMixer(fbx);
        mixerRef.current = mixer;

        if (fbx.animations.length > 0) {
          mixer.clipAction(fbx.animations[0]).play();
        } else {
          console.warn(
            `No embedded animation found for ${selectedCharacter.name}.`,
          );
        }

        console.log("Character loaded:", selectedCharacter.name);
      },
      undefined,
      (error) => {
        if (!cancelled) {
          console.error(
            `Failed to load ${selectedCharacter.name}'s model:`,
            error,
          );
        }
      },
    );

    return () => {
      cancelled = true;

      if (loadedCharacter && characterRef.current !== loadedCharacter) {
        disposeCharacter(loadedCharacter);
      }
    };
  }, [selectedCharacter]);

  return <div ref={mountRef} className="three-scene" />;
}

function disposeCharacter(character) {
  character.traverse((child) => {
    if (child.isMesh) {
      child.geometry.dispose();

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((material) => {
        material.dispose();
      });
    }
  });
}
