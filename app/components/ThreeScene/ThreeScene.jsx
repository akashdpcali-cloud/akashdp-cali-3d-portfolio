"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import InfiniteGround from "./InfiniteGround";
import "./ThreeScene.css";

export default function ThreeScene({ selectedCharacter, isRunning }) {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const mixerRef = useRef(null);
  const actionsRef = useRef({
    idle: null,
    walk: null,
    current: null,
  });
  const characterRef = useRef(null);
  const loaderRef = useRef(null);
  const requestRef = useRef(null);
  const isRunningRef = useRef(false);

  const keysRef = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    arrowup: false,
    arrowdown: false,
    arrowleft: false,
    arrowright: false,
  });

  const runningRef = useRef(false);

  const joystickRef = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  const transformRef = useRef({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  });

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

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

    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);

    cameraRef.current = camera;

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
      const character = characterRef.current;

      if (character) {
        const keys = keysRef.current;
        const joystick = joystickRef.current;
        const walkSpeed = 3;
        const runSpeed = 8;
        const shouldRun = runningRef.current || isRunningRef.current;
        const speed = shouldRun ? runSpeed : walkSpeed;
        const rotationSpeed = 10;

        const forward = keys.w || keys.arrowup || joystick.w;
        const backward = keys.s || keys.arrowdown || joystick.s;
        const left = keys.a || keys.arrowleft || joystick.a;
        const right = keys.d || keys.arrowright || joystick.d;

        const isMoving = forward || backward || left || right;

        const direction = new THREE.Vector3(
          Number(right) - Number(left),
          0,
          Number(backward) - Number(forward),
        );

        if (direction.lengthSq() > 0) {
          direction.normalize();

          const targetRotation = Math.atan2(direction.x, direction.z);

          const rotationDifference = Math.atan2(
            Math.sin(targetRotation - character.rotation.y),
            Math.cos(targetRotation - character.rotation.y),
          );

          character.rotation.y +=
            rotationDifference * Math.min(rotationSpeed * delta, 1);
        }

        const moveX = Number(right) - Number(left);
        const moveZ = Number(backward) - Number(forward);

        const movementLength = Math.sqrt(moveX * moveX + moveZ * moveZ);

        if (movementLength > 0) {
          character.position.x += (moveX / movementLength) * speed * delta;
          character.position.z += (moveZ / movementLength) * speed * delta;
        }

        const actions = actionsRef.current;

        let nextAction = actions.idle;

        if (isMoving) {
          nextAction = shouldRun ? actions.run : actions.walk;
        }

        if (nextAction && actions.current !== nextAction) {
          actions.current?.fadeOut(0.2);
          nextAction.reset().fadeIn(0.2).play();
          actions.current = nextAction;
        }
      }

      // TPP camera follows the character

      // Fixed-direction TPP camera
      if (character) {
        // Camera stays at a fixed offset from the character
        const cameraOffset = new THREE.Vector3(0, 4, -8);

        const targetCameraPosition = character.position
          .clone()
          .add(cameraOffset);

        // Smoothly follow the character's position
        camera.position.lerp(targetCameraPosition, 5 * delta);

        // Always look toward the character
        const lookAtPosition = character.position.clone();
        lookAtPosition.y += 1.5;

        camera.lookAt(lookAtPosition);
      }

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

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (event.key === "Shift") {
        runningRef.current = true;
      }

      if (key in keysRef.current) {
        keysRef.current[key] = true;
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();

      if (event.key === "Shift") {
        runningRef.current = false;
      }

      if (key in keysRef.current) {
        keysRef.current[key] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const handleJoystickMove = (event) => {
      const direction = event.detail;

      joystickRef.current = {
        w: Boolean(direction?.includes("W")),
        a: Boolean(direction?.includes("A")),
        s: Boolean(direction?.includes("S")),
        d: Boolean(direction?.includes("D")),
      };
    };

    window.addEventListener("joystickMove", handleJoystickMove);

    return () => {
      disposed = true;

      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", handleResize);

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("joystickMove", handleJoystickMove);

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
      const currentCharacter = characterRef.current;

      transformRef.current = {
        position: {
          x: currentCharacter.position.x,
          y: currentCharacter.position.y,
          z: currentCharacter.position.z,
        },
        rotation: {
          x: currentCharacter.rotation.x,
          y: currentCharacter.rotation.y,
          z: currentCharacter.rotation.z,
        },
      };

      scene.remove(currentCharacter);
      disposeCharacter(currentCharacter);
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

        const savedTransform = transformRef.current;

        fbx.position.set(
          savedTransform.position.x,
          savedTransform.position.y,
          savedTransform.position.z,
        );

        fbx.rotation.set(
          savedTransform.rotation.x,
          savedTransform.rotation.y,
          savedTransform.rotation.z,
        );

        characterRef.current = fbx;
        scene.add(fbx);
        characterRef.current = fbx;

        const mixer = new THREE.AnimationMixer(fbx);
        mixerRef.current = mixer;

        const idleAction =
          fbx.animations.length > 0
            ? mixer.clipAction(fbx.animations[0])
            : null;

        actionsRef.current = {
          idle: idleAction,
          walk: null,
          current: idleAction,
        };

        if (idleAction) {
          idleAction.play();
        } else {
          console.warn(
            `No embedded animation found for ${selectedCharacter.name}.`,
          );
        }

        loader.load(
          selectedCharacter.walk,
          (walkFbx) => {
            if (cancelled || !mixerRef.current) return;

            if (walkFbx.animations.length > 0) {
              actionsRef.current.walk = mixer.clipAction(walkFbx.animations[0]);
            }
          },
          undefined,
          (error) => {
            console.error("Failed to load walk animation:", error);
          },
        );

        loader.load(
          selectedCharacter.run,
          (runFbx) => {
            if (cancelled || !mixerRef.current) return;

            if (runFbx.animations.length > 0) {
              actionsRef.current.run = mixer.clipAction(runFbx.animations[0]);
            }
          },
          undefined,
          (error) => {
            console.error("Failed to load run animation:", error);
          },
        );

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
