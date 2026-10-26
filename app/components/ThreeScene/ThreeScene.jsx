"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import InfiniteGround from "./InfiniteGround";
import "./ThreeScene.css";

export default function ThreeScene({ selectedCharacter, isRunning }) {
  //Charecter
  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const cameraOrbitRef = useRef({
    yaw: Math.PI / 4,
    pitch: Math.atan2(7, 11),
    dragging: false,
    lastX: 0,
    lastY: 0,
    userAdjusted: false,
  });
  const truckCameraOrbitRef = useRef({
    yaw: Math.PI / 4,
    pitch: Math.atan2(5, 10),
    dragging: false,
    lastX: 0,
    lastY: 0,
  });
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

  const cameraForwardRef = useRef(new THREE.Vector3(0, 0, -1));
  const cameraRightRef = useRef(new THREE.Vector3(1, 0, 0));

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

  //truck
  const truckRef = useRef(null);
  const isDrivingRef = useRef(false);
  const drivePromptRef = useRef(null);
  const truckBodyRef = useRef(null);

  const truckFrontLeftWheelRef = useRef(null);
  const truckFrontRightWheelRef = useRef(null);
  const truckBackWheelsRef = useRef(null);

  const truckFrontLeftOriginalYRef = useRef(0);
  const truckFrontRightOriginalYRef = useRef(0);

  const truckFrontLeftOriginalRotationRef = useRef(new THREE.Euler());
  const truckFrontRightOriginalRotationRef = useRef(new THREE.Euler());

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // Initialize the Three.js scene only once.
  useEffect(() => {
    const debugMovement = (event) => {
      const key = event.key.toLowerCase();

      if (!["w", "a", "s", "d"].includes(key)) return;

      console.log("Key pressed:", key.toUpperCase(), {
        cameraForward: cameraForwardRef.current.toArray(),
        cameraRight: cameraRightRef.current.toArray(),
      });
    };

    window.addEventListener("keydown", debugMovement);

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

    const canvas = renderer.domElement;

    canvas.style.touchAction = "none";

    const activeOrbitRef = { current: null };

    const handlePointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      // Choose the camera controls for the current mode.
      const orbit = isDrivingRef.current
        ? truckCameraOrbitRef.current
        : cameraOrbitRef.current;

      activeOrbitRef.current = orbit;

      orbit.dragging = true;
      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;

      canvas.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
      const orbit = activeOrbitRef.current;

      if (!orbit || !orbit.dragging) return;

      const deltaX = event.clientX - orbit.lastX;
      const deltaY = event.clientY - orbit.lastY;

      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;

      orbit.yaw -= deltaX * 0.005;
      orbit.pitch += deltaY * 0.005;

      orbit.pitch = THREE.MathUtils.clamp(orbit.pitch, 0.05, 1.45);

      // Only the character camera uses this flag.
      if (!isDrivingRef.current) {
        orbit.userAdjusted = true;
      }
    };

    const handlePointerUp = (event) => {
      if (activeOrbitRef.current) {
        activeOrbitRef.current.dragging = false;
        activeOrbitRef.current = null;
      }

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handleTruckClick = (event) => {
      if (isDrivingRef.current) return;

      const character = characterRef.current;
      const truck = truckRef.current;
      const truckBody = truckBodyRef.current;
      const frontLeftWheel = truckFrontLeftWheelRef.current;
      const frontRightWheel = truckFrontRightWheelRef.current;
      const backWheels = truckBackWheelsRef.current;

      if (!character || !truck || !truckBody) return;

      // Check whether the character is within 5 units of the truck body.
      const characterPosition = character.getWorldPosition(new THREE.Vector3());

      const bodyBox = new THREE.Box3().setFromObject(truckBody);
      const closestPoint = bodyBox.clampPoint(
        characterPosition,
        new THREE.Vector3(),
      );

      const distance = characterPosition.distanceTo(closestPoint);

      if (distance > 5) return;

      // Find whether the click hit the truck body or either wheel.
      const rect = canvas.getBoundingClientRect();

      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const clickableObjects = [
        truckBody,
        frontLeftWheel,
        frontRightWheel,
        backWheels,
      ].filter(Boolean);

      const hits = raycaster.intersectObjects(clickableObjects, true);

      if (hits.length === 0) return;

      // Enter the truck.
      isDrivingRef.current = true;
      character.visible = false;

      if (drivePromptRef.current) {
        drivePromptRef.current.visible = false;
      }

      console.log("Entered truck. Distance:", distance);
    };

    canvas.addEventListener("click", handleTruckClick);

    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x334155, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const { ground } = InfiniteGround(scene);

    // Load the monster truck.
    const truckLoader = new GLTFLoader();

    truckLoader.load(
      "/models/truck/truck.glb",
      (gltf) => {
        const truck = gltf.scene;

        truck.traverse((child) => {
          console.log(
            "Truck object:",
            child.name,
            "World position:",
            child.getWorldPosition(new THREE.Vector3()),
          );
        });
        const truckBody = truck.getObjectByName("truck_body");

        const truckFrontLeftWheel = truck.getObjectByName(
          "truck_front_left_wheel",
        );

        const truckFrontRightWheel = truck.getObjectByName(
          "truck_front_right_wheel",
        );

        if (truckFrontLeftWheel) {
          truckFrontLeftOriginalRotationRef.current.copy(
            truckFrontLeftWheel.rotation,
          );
        }

        if (truckFrontRightWheel) {
          truckFrontRightOriginalRotationRef.current.copy(
            truckFrontRightWheel.rotation,
          );
        }

        truckFrontLeftOriginalYRef.current = truckFrontLeftWheel
          ? truckFrontLeftWheel.rotation.y
          : 0;

        truckFrontRightOriginalYRef.current = truckFrontRightWheel
          ? truckFrontRightWheel.rotation.y
          : 0;

        const truckBackWheels = truck.getObjectByName("truck_back_wheels");

        truckBodyRef.current = truckBody;
        truckFrontLeftWheelRef.current = truckFrontLeftWheel;
        truckFrontRightWheelRef.current = truckFrontRightWheel;
        truckBackWheelsRef.current = truckBackWheels;

        if (!truckFrontLeftWheel || !truckFrontRightWheel || !truckBackWheels) {
          console.error("One or more truck wheel objects could not be found.");
        }

        if (!truckBody) {
          console.error("truck_body not found in truck.glb");
          return;
        }

        truck.position.set(5, 0, 0);

        // Ensure the truck rests on the ground.
        const box = new THREE.Box3().setFromObject(truck);
        truck.position.y -= box.min.y;

        truck.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(truck);
        truckRef.current = truck;
        // Create the "Click to Drive" prompt.
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = 512;
        canvas.height = 128;

        context.fillStyle = "rgba(15, 23, 42, 0.9)";
        context.beginPath();
        context.roundRect(10, 10, 492, 108, 24);
        context.fill();

        context.fillStyle = "#ffffff";
        context.font = "bold 42px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("Click to Drive", 256, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
        });

        const prompt = new THREE.Sprite(material);
        prompt.scale.set(3, 0.75, 1);
        prompt.visible = false;

        // Position the prompt above the truck.
        const truckBox = new THREE.Box3().setFromObject(truck);
        const bodyBox = new THREE.Box3().setFromObject(truckBody);

        const worldPromptPosition = new THREE.Vector3(
          (bodyBox.min.x + bodyBox.max.x) / 2,
          bodyBox.max.y + 1.5,
          (bodyBox.min.z + bodyBox.max.z) / 2,
        );

        prompt.position.copy(truck.worldToLocal(worldPromptPosition));

        truck.add(prompt);
        drivePromptRef.current = prompt;

        console.log("Truck loaded:", truck);
      },
      undefined,
      (error) => {
        console.error("Failed to load truck:", error);
      },
    );

    const loader = new FBXLoader();
    loaderRef.current = loader;

    const clock = new THREE.Clock();

    let disposed = false;

    function animate() {
      if (disposed) return;

      requestRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const character = characterRef.current;
      const truck = truckRef.current;
      const prompt = drivePromptRef.current;

      const orbit = cameraOrbitRef.current;
      const keys = keysRef.current;
      const joystick = joystickRef.current;

      const isMoving =
        keys.w ||
        keys.a ||
        keys.s ||
        keys.d ||
        keys.arrowup ||
        keys.arrowdown ||
        keys.arrowleft ||
        keys.arrowright ||
        joystick.w ||
        joystick.a ||
        joystick.s ||
        joystick.d;

      if (orbit.userAdjusted && isMoving && !isDrivingRef.current) {
        orbit.yaw = Math.PI / 4;
        orbit.pitch = Math.atan2(7, 11);
        orbit.userAdjusted = false;
      }

      console.log("Proximity check:", {
        character: !!character,
        truck: !!truck,
        prompt: !!prompt,
      });

      if (character && truck && prompt && !isDrivingRef.current) {
        const truckBody = truck.getObjectByName("truck_body");
        const box = new THREE.Box3().setFromObject(truckBody);

        console.log("Truck body bounds:", {
          min: box.min.toArray(),
          max: box.max.toArray(),
          center: box.getCenter(new THREE.Vector3()).toArray(),
          size: box.getSize(new THREE.Vector3()).toArray(),
        });
        console.log("Truck body found:", !!truckBody);

        if (truckBody) {
          const characterPosition = new THREE.Vector3();
          const truckBodyPosition = new THREE.Vector3();

          character.getWorldPosition(characterPosition);
          truckBody.getWorldPosition(truckBodyPosition);

          console.log("Character world position:", characterPosition);
          console.log("Truck body world position:", truckBodyPosition);
          console.log(
            "Distance to truck body:",
            characterPosition.distanceTo(truckBodyPosition),
          );

          const bodyBox = new THREE.Box3().setFromObject(truckBody);

          const closestPoint = new THREE.Vector3();
          bodyBox.clampPoint(characterPosition, closestPoint);

          const distance = characterPosition.distanceTo(closestPoint);
          console.log(
            "Character X/Z:",
            characterPosition.x,
            characterPosition.z,
          );
          console.log(
            "Truck body X/Z:",
            truckBodyPosition.x,
            truckBodyPosition.z,
          );
          console.log("Distance:", distance);
          console.log("Distance to truck surface:", distance);

          prompt.visible = distance <= 5;
          console.log("Prompt visible after update:", prompt.visible);
        }
      }

      if (character && !isDrivingRef.current) {
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

        const orbit = cameraOrbitRef.current;

        if (orbit.userAdjusted && isMoving && !isDrivingRef.current) {
          orbit.yaw = Math.PI / 4;
          orbit.pitch = Math.atan2(7, 11);
          orbit.userAdjusted = false;
        }

        // Calculate input
        const moveX = Number(right) - Number(left);
        const moveZ = Number(backward) - Number(forward);

        const movementLength = Math.hypot(moveX, moveZ);

        if (movementLength > 0) {
          const inputX = moveX / movementLength;
          const inputZ = moveZ / movementLength;

          console.log("Camera forward:", cameraForwardRef.current.toArray());
          console.log("Camera right:", cameraRightRef.current.toArray());

          const cameraForward = new THREE.Vector3();
          camera.getWorldDirection(cameraForward);

          cameraForward.y = 0;
          cameraForward.normalize();

          // W should move toward the character's viewing direction.
          cameraForward.negate();

          const cameraRight = new THREE.Vector3()
            .crossVectors(cameraForward, new THREE.Vector3(0, 1, 0))
            .normalize();

          const movementDirection = new THREE.Vector3(
            -inputX, // A = -X, D = +X
            0,
            -inputZ, // W = -Z, S = +Z
          ).normalize();

          console.log("Movement direction:", movementDirection.toArray());

          // Rotate the character toward its movement direction
          const targetRotation = Math.atan2(
            movementDirection.x,
            movementDirection.z,
          );

          const rotationDifference = Math.atan2(
            Math.sin(targetRotation - character.rotation.y),
            Math.cos(targetRotation - character.rotation.y),
          );

          character.rotation.y +=
            rotationDifference * Math.min(rotationSpeed * delta, 1);

          // Move relative to the fixed camera directions
          character.position.x += movementDirection.x * speed * delta;
          character.position.z += movementDirection.z * speed * delta;
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

      // Monster truck driving controls
      if (truck && isDrivingRef.current) {
        const keys = keysRef.current;
        const joystick = joystickRef.current;

        const forward = keys.w || keys.arrowup || joystick.w;
        const backward = keys.s || keys.arrowdown || joystick.s;
        const left = keys.a || keys.arrowleft || joystick.a;
        const right = keys.d || keys.arrowright || joystick.d;

        const throttle = Number(forward) - Number(backward);
        const steering = Number(right) - Number(left);

        const driveSpeed = 8;
        const turnSpeed = 1.5;

        // Move in the direction the truck is facing.
        if (throttle !== 0) {
          truck.position.x -=
            Math.sin(truck.rotation.y) * throttle * driveSpeed * delta;

          truck.position.z +=
            Math.cos(truck.rotation.y) * throttle * driveSpeed * delta;
        }

        // Turn while moving.
        if (throttle !== 0 && steering !== 0) {
          truck.rotation.y -=
            steering * turnSpeed * delta * Math.sign(throttle);
        }

        // Animate the wheels.

        // Front-left wheel: roll and steer
        if (truckFrontLeftWheelRef.current) {
          const wheel = truckFrontLeftWheelRef.current;
          const originalRotation = truckFrontLeftOriginalRotationRef.current;

          wheel.rotation.order = "YXZ";

          wheel.rotation.x += throttle * driveSpeed * delta;

          wheel.rotation.y = THREE.MathUtils.lerp(
            wheel.rotation.y,
            truckFrontLeftOriginalYRef.current - steering * 0.5,
            Math.min(10 * delta, 1),
          );

          wheel.rotation.z = originalRotation.z;
        }

        // Front-right wheel: roll and steer
        if (truckFrontRightWheelRef.current) {
          const wheel = truckFrontRightWheelRef.current;
          const originalRotation = truckFrontRightOriginalRotationRef.current;

          wheel.rotation.order = "YXZ";

          wheel.rotation.x += throttle * driveSpeed * delta;

          wheel.rotation.y = THREE.MathUtils.lerp(
            wheel.rotation.y,
            truckFrontRightOriginalYRef.current - steering * 0.5,
            Math.min(10 * delta, 1),
          );

          wheel.rotation.z = originalRotation.z;
        }

        // Rear wheels: roll only
        if (truckBackWheelsRef.current) {
          truckBackWheelsRef.current.rotation.x +=
            throttle * driveSpeed * delta;
        }
      }

      // Camera follows the truck without rotating with the truck.
      if (isDrivingRef.current && truckBodyRef.current) {
        const orbit = truckCameraOrbitRef.current;

        // Follow the truck body's world position.
        const targetPosition = truckBodyRef.current.getWorldPosition(
          new THREE.Vector3(),
        );

        const cameraDistance = 10;

        // This offset uses world coordinates, not the truck's rotation.
        const cameraOffset = new THREE.Vector3(
          Math.sin(orbit.yaw) * cameraDistance * Math.cos(orbit.pitch),

          cameraDistance * Math.sin(orbit.pitch),

          -Math.cos(orbit.yaw) * cameraDistance * Math.cos(orbit.pitch),
        );

        const targetCameraPosition = targetPosition.clone().add(cameraOffset);

        // Follow immediately so turning does not cause camera lag or swing.
        camera.position.copy(targetCameraPosition);

        const lookAtPosition = targetPosition.clone();
        lookAtPosition.y += 1.5;

        camera.lookAt(lookAtPosition);
      } else if (character) {
        // Existing character TPP camera behavior remains unchanged.
        const orbit = cameraOrbitRef.current;
        const cameraDistance = 8;

        const horizontalDistance =
          (cameraDistance * Math.cos(orbit.pitch)) /
          Math.cos(Math.atan2(7, 11));

        const verticalDistance =
          (cameraDistance * Math.sin(orbit.pitch)) /
          Math.sin(Math.atan2(7, 11));

        const cameraOffset = new THREE.Vector3(
          Math.sin(orbit.yaw) * horizontalDistance,
          verticalDistance,
          -Math.cos(orbit.yaw) * horizontalDistance,
        );

        const targetPosition = character.getWorldPosition(new THREE.Vector3());

        const targetCameraPosition = targetPosition.clone().add(cameraOffset);

        camera.position.lerp(targetCameraPosition, Math.min(5 * delta, 1));

        const lookAtPosition = targetPosition.clone();
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
      window.removeEventListener("keydown", debugMovement);

      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);

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
