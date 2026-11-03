"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

import { Props } from "@/app/data/portfolioData";

import InfiniteGround from "./InfiniteGround";
import "./ThreeScene.css";

export default function ThreeScene({
  selectedCharacter,
  isRunning,
  onEnterTruck,
  onExitTruck,
}) {
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

  //collision walls

  const wallsRef = useRef(null);

  const wallMeshesRef = useRef([]);

  const wallTrianglesRef = useRef([]);

  //props

  const knightLabelRef = useRef(null);
  const knightPositionRef = useRef(new THREE.Vector3());

  const conorLabelRef = useRef(null);
  const conorPositionRef = useRef(new THREE.Vector3());

  const animalLabelsRef = useRef([]);

  //computers
  const computerRaycasterRef = useRef(new THREE.Raycaster());
  const computerPointerRef = useRef(new THREE.Vector2());
  const hoveredComputerRef = useRef(null);
  const computerObjectsRef = useRef([]);
  const computerOutlinesRef = useRef([]);

  //animals jump

  const animalObjectsRef = useRef([]);
  const animalAnimationsRef = useRef([]);
  const hoveredAnimalRef = useRef(null);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    const handleTruckShortcut = (event) => {
      if (event.key.toLowerCase() !== "f" || event.repeat) return;

      // Don't trigger the shortcut while typing in an input.
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }

      event.preventDefault();

      // If already driving, exit the truck.
      if (isDrivingRef.current) {
        window.dispatchEvent(new CustomEvent("exitTruck"));
        return;
      }

      const character = characterRef.current;
      const truckBody = truckBodyRef.current;

      if (!character || !truckBody) return;

      // Get world positions for the character and truck body.
      const characterPosition = new THREE.Vector3();
      const truckBodyPosition = new THREE.Vector3();

      character.getWorldPosition(characterPosition);
      truckBody.getWorldPosition(truckBodyPosition);

      // Only enter when close enough to the truck body.
      const distance = characterPosition.distanceTo(truckBodyPosition);

      if (distance > 7) return;

      // Enter the truck.
      isDrivingRef.current = true;
      character.visible = false;

      if (drivePromptRef.current) {
        drivePromptRef.current.visible = false;
      }

      onEnterTruck?.();
    };

    window.addEventListener("keydown", handleTruckShortcut);

    return () => {
      window.removeEventListener("keydown", handleTruckShortcut);
    };
  }, [onEnterTruck]);

  // Keep the internal Three.js driving flag synchronized with React state.

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
    knightLabelRef.current = null;
    conorLabelRef.current = null;

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      3000,
    );

    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);

    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const pixelRatio = Math.min(window.devicePixelRatio, 2);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);

    renderer.shadowMap.enabled = true;

    // Canvas
    const canvas = renderer.domElement;

    // Effect Composer
    const composer = new EffectComposer(renderer);

    composer.setPixelRatio(pixelRatio);
    composer.setSize(width, height);

    // Render Pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Outline Pass
    const outlinePass = new OutlinePass(
      new THREE.Vector2(width, height),
      scene,
      camera,
    );

    outlinePass.downSampleRatio = 1;

    outlinePass.edgeStrength = 5;
    outlinePass.edgeGlow = 1;
    outlinePass.edgeThickness = 2;
    outlinePass.pulsePeriod = 0;

    outlinePass.visibleEdgeColor.set("#ffff00");
    outlinePass.hiddenEdgeColor.set("#ffff00");

    composer.addPass(outlinePass);

    // Output Pass
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

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

      // Tell React to replace the Run button with the Exit button.
      onEnterTruck?.();

      console.log("Entered truck. Distance:", distance);
    };

    canvas.addEventListener("click", handleTruckClick);

    // Called when the user clicks the React Exit Truck button.
    const handleExitTruck = () => {
      const character = characterRef.current;
      const truckBody = truckBodyRef.current;

      if (!character || !truckBody) return;

      // Calculate the exit position beside the truck body.
      truckBody.updateWorldMatrix(true, false);

      const exitOffset = new THREE.Vector3(-3, 0, 0);
      const exitPosition = truckBody.localToWorld(exitOffset);

      // Keep the character's existing Y position.
      exitPosition.y = character.position.y;

      character.position.copy(exitPosition);
      character.visible = true;

      // Exit driving mode.
      isDrivingRef.current = false;

      // Reset keyboard inputs without changing their expected structure.
      keysRef.current = {
        w: false,
        a: false,
        s: false,
        d: false,
        arrowup: false,
        arrowdown: false,
        arrowleft: false,
        arrowright: false,
      };

      // Reset joystick inputs.
      joystickRef.current = {
        w: false,
        a: false,
        s: false,
        d: false,
      };

      // Hide the prompt safely.
      if (drivePromptRef.current?.style) {
        drivePromptRef.current.style.display = "none";
      }

      // Notify the parent component.
      onExitTruck?.();
    };
    window.addEventListener("exitTruck", handleExitTruck);

    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x334155, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const { ground } = InfiniteGround(scene);

    let disposed = false;

    // Load the monster truck.
    const truckLoader = new GLTFLoader();

    truckLoader.load(
      "/models/truck/truck.glb",
      (gltf) => {
        if (disposed || sceneRef.current !== scene) return;

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
        context.fillText(`${Props.truck}`, 256, 64);

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

    // Load the low-poly world.
    const worldLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
    );

    worldLoader.setDRACOLoader(dracoLoader);
    worldLoader.load(
      "/models/world/lowpoly_world.glb",
      (gltf) => {
        if (disposed || sceneRef.current !== scene) return;

        const world = gltf.scene;

        world.name = "lowpoly_world";

        console.log("World loaded");
        console.log("walls object:", world.getObjectByName("walls"));
        console.log("knight object:", world.getObjectByName("knight"));

        world.traverse((object) => {
          if (object.name.toLowerCase().includes("knight")) {
            console.log("Knight-like object:", object.name, object.type);
          }
        });

        const walls = world.getObjectByName("walls");

        if (walls && walls.isMesh) {
          wallsRef.current = walls;

          const geometry = walls.geometry;
          const position = geometry.attributes.position;
          const index = geometry.index;

          const triangles = [];

          // Update world transformation before extracting vertices.
          scene.add(world);

          const knight = world.getObjectByName("knight");

          if (knight) {
            // Get the knight's world-space position and bounds
            knight.updateWorldMatrix(true, true);

            const knightBounds = new THREE.Box3().setFromObject(knight);
            const knightCenter = new THREE.Vector3();

            knightBounds.getCenter(knightCenter);

            knightPositionRef.current.copy(knightCenter);

            // Create canvas
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 128;

            const context = canvas.getContext("2d");

            // Background
            context.fillStyle = "rgba(15, 23, 42, 0.9)";
            context.beginPath();
            context.roundRect(10, 10, 492, 108, 24);
            context.fill();

            // Text
            context.fillStyle = "#ffffff";
            context.font = "bold 42px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(`${Props.knight}`, 256, 64);

            // Create texture
            const texture = new THREE.CanvasTexture(canvas);

            // Create sprite
            const material = new THREE.SpriteMaterial({
              map: texture,
              transparent: true,
              depthTest: false,
            });

            const label = new THREE.Sprite(material);

            label.scale.set(4, 1, 1);

            // Position above the knight
            label.position.set(
              knightCenter.x,
              knightCenter.y + 3,
              knightCenter.z,
            );

            label.visible = false;

            scene.add(label);

            knightLabelRef.current = label;

            console.log("Knight label created.");
          } else {
            console.error('Could not find object named "knight".');
          }

          const conor = world.getObjectByName("conor");

          if (conor) {
            conor.updateWorldMatrix(true, true);

            const conorBounds = new THREE.Box3().setFromObject(conor);
            const conorCenter = conorBounds.getCenter(new THREE.Vector3());
            conorPositionRef.current.copy(conorCenter);

            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 128;

            const context = canvas.getContext("2d");
            context.fillStyle = "rgba(15, 23, 42, 0.9)";
            context.beginPath();
            context.roundRect(10, 10, 492, 108, 24);
            context.fill();

            context.fillStyle = "#ffffff";
            context.font = "bold 42px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(Props.mcgregor, 256, 64);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({
              map: texture,
              transparent: true,
              depthTest: false,
            });

            const label = new THREE.Sprite(material);
            label.scale.set(4, 1, 1);
            label.position.set(conorCenter.x, conorCenter.y + 2, conorCenter.z);
            label.visible = false;

            scene.add(label);
            conorLabelRef.current = label;
          } else {
            console.error('Could not find object named "conor".');
          }

          animalLabelsRef.current = [];

          for (const [animalType, props] of Object.entries({
            sheep: Props.sheep,
            cow: Props.cow,
          })) {
            props.forEach((text, index) => {
              const animalName = `${animalType}${index + 1}`;
              const animal = world.getObjectByName(animalName);

              if (!animal) {
                console.error(`Could not find object named "${animalName}".`);
                return;
              }

              animal.updateWorldMatrix(true, true);

              const bounds = new THREE.Box3().setFromObject(animal);
              const center = bounds.getCenter(new THREE.Vector3());

              const canvas = document.createElement("canvas");
              canvas.width = 512;
              canvas.height = 128;

              const context = canvas.getContext("2d");
              context.fillStyle = "rgba(15, 23, 42, 0.9)";
              context.beginPath();
              context.roundRect(10, 10, 492, 108, 24);
              context.fill();

              context.fillStyle = "#ffffff";
              context.font = "bold 42px Arial";
              context.textAlign = "center";
              context.textBaseline = "middle";
              context.fillText(text, 256, 64);

              const texture = new THREE.CanvasTexture(canvas);
              const material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                depthTest: false,
              });

              const label = new THREE.Sprite(material);
              label.scale.set(4, 1, 1);
              label.position.set(center.x, center.y + 1.5, center.z);
              label.visible = false;

              scene.add(label);
              animalLabelsRef.current.push({ label, position: center });
            });
          }

          // Find all sheep and cows
          const animalNames = [
            ...Array.from({ length: 11 }, (_, i) => `sheep${i + 1}`),
            ...Array.from({ length: 11 }, (_, i) => `cow${i + 1}`),
          ];

          animalObjectsRef.current = animalNames
            .map((name) => world.getObjectByName(name))
            .filter(Boolean);

          const handleAnimalPointerMove = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();

            const pointer = new THREE.Vector2(
              ((event.clientX - rect.left) / rect.width) * 2 - 1,
              -((event.clientY - rect.top) / rect.height) * 2 + 1,
            );

            const raycaster = new THREE.Raycaster();

            raycaster.setFromCamera(pointer, camera);

            const intersections = raycaster.intersectObjects(
              animalObjectsRef.current,
              true,
            );

            let hoveredAnimal = null;

            if (intersections.length > 0) {
              let object = intersections[0].object;

              while (object && !animalObjectsRef.current.includes(object)) {
                object = object.parent;
              }

              hoveredAnimal = object;
            }

            hoveredAnimalRef.current = hoveredAnimal;

            renderer.domElement.style.cursor =
              hoveredAnimal || hoveredComputerRef.current
                ? "pointer"
                : "default";
          };

          renderer.domElement.addEventListener(
            "pointermove",
            handleAnimalPointerMove,
          );

          console.log(
            "Animals found:",
            animalObjectsRef.current.map((animal) => animal.name),
          );

          const handleAnimalClick = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();

            const pointer = new THREE.Vector2(
              ((event.clientX - rect.left) / rect.width) * 2 - 1,
              -((event.clientY - rect.top) / rect.height) * 2 + 1,
            );

            const raycaster = new THREE.Raycaster();

            raycaster.setFromCamera(pointer, camera);

            const intersections = raycaster.intersectObjects(
              animalObjectsRef.current,
              true,
            );

            if (intersections.length === 0) return;

            let animal = intersections[0].object;

            while (animal && !animalObjectsRef.current.includes(animal)) {
              animal = animal.parent;
            }

            if (!animal) return;

            // Don't restart an existing animation
            if (
              animalAnimationsRef.current.some(
                (animation) => animation.object === animal,
              )
            ) {
              return;
            }

            animalAnimationsRef.current.push({
              object: animal,
              originalPosition: animal.position.clone(),
              originalScale: animal.scale.clone(),
              elapsed: 0,
            });
          };

          renderer.domElement.addEventListener("click", handleAnimalClick);

          world.updateMatrixWorld(true);

          const vertexA = new THREE.Vector3();
          const vertexB = new THREE.Vector3();
          const vertexC = new THREE.Vector3();

          const totalTriangles = index ? index.count / 3 : position.count / 3;

          for (let i = 0; i < totalTriangles; i++) {
            const a = index ? index.getX(i * 3) : i * 3;
            const b = index ? index.getX(i * 3 + 1) : i * 3 + 1;
            const c = index ? index.getX(i * 3 + 2) : i * 3 + 2;

            vertexA.fromBufferAttribute(position, a);
            vertexB.fromBufferAttribute(position, b);
            vertexC.fromBufferAttribute(position, c);

            // Convert local coordinates into world coordinates.
            vertexA.applyMatrix4(walls.matrixWorld);
            vertexB.applyMatrix4(walls.matrixWorld);
            vertexC.applyMatrix4(walls.matrixWorld);

            triangles.push(
              new THREE.Triangle(
                vertexA.clone(),
                vertexB.clone(),
                vertexC.clone(),
              ),
            );
          }

          wallTrianglesRef.current = triangles;
          walls.visible = false;

          const wallBounds = new THREE.Box3().setFromObject(walls);

          console.log("WALL BOUNDS:", {
            min: wallBounds.min.toArray(),
            max: wallBounds.max.toArray(),
            size: wallBounds.getSize(new THREE.Vector3()).toArray(),
          });

          console.log(
            "Walls world position:",
            walls.getWorldPosition(new THREE.Vector3()),
          );

          console.log(
            "Walls world bounds:",
            new THREE.Box3().setFromObject(walls),
          );

          console.log("First wall triangle:", triangles[0]);

          console.log("Wall collision triangles:", triangles.length);
        } else {
          console.error('Could not find a mesh named "walls".');
        }

        const handleComputerPointerMove = (event) => {
          const rect = renderer.domElement.getBoundingClientRect();

          computerPointerRef.current.x =
            ((event.clientX - rect.left) / rect.width) * 2 - 1;

          computerPointerRef.current.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1;

          computerRaycasterRef.current.setFromCamera(
            computerPointerRef.current,
            camera,
          );

          const intersections = computerRaycasterRef.current.intersectObjects(
            computerObjectsRef.current,
            true,
          );

          let foundComputer = null;

          if (intersections.length > 0) {
            let object = intersections[0].object;

            while (object && !computerObjectsRef.current.includes(object)) {
              object = object.parent;
            }

            foundComputer = object;
          }

          // Restore the previously hovered computer
          if (hoveredComputerRef.current !== foundComputer) {
            if (hoveredComputerRef.current) {
              const previous = hoveredComputerRef.current;

              previous.scale.copy(previous.userData.originalScale);
            }

            hoveredComputerRef.current = foundComputer;

            // Highlight the newly hovered computer
            if (foundComputer) {
              foundComputer.scale
                .copy(foundComputer.userData.originalScale)
                .multiplyScalar(1.5);

              outlinePass.selectedObjects = [foundComputer];
            }
            if (!foundComputer) {
              outlinePass.selectedObjects = [];
            }
          }

          renderer.domElement.style.cursor =
            foundComputer || hoveredAnimalRef.current ? "pointer" : "default";
        };

        const handleComputerClick = (event) => {
          const rect = renderer.domElement.getBoundingClientRect();
          computerPointerRef.current.set(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1,
          );

          computerRaycasterRef.current.setFromCamera(
            computerPointerRef.current,
            camera,
          );

          const intersections = computerRaycasterRef.current.intersectObjects(
            computerObjectsRef.current,
            true,
          );

          if (intersections.length === 0) return;

          let computer = intersections[0].object;

          while (computer && !computerObjectsRef.current.includes(computer)) {
            computer = computer.parent;
          }

          if (!computer) return;

          window.open(
            "https://akashdp-project-archive.vercel.app/",
            "_blank",
            "noopener,noreferrer",
          );
        };

        renderer.domElement.addEventListener(
          "pointermove",
          handleComputerPointerMove,
        );

        renderer.domElement.addEventListener("click", handleComputerClick);

        // Find the three computers
        const computerNames = ["computer1", "computer2", "computer3"];

        computerObjectsRef.current = computerNames
          .map((name) => world.getObjectByName(name))
          .filter(Boolean);

        // Store original scales and create outlines
        computerObjectsRef.current.forEach((computer) => {
          computer.userData.originalScale = computer.scale.clone();
        });

        console.log(
          "Interactive computers found:",
          computerObjectsRef.current.map((computer) => computer.name),
        );

        if (!world.parent) {
          scene.add(world);
        }

        console.log("Low-poly world loaded:", world);
      },
      undefined,
      (error) => {
        console.error("Error loading low-poly world:", error);
      },
    );

    const loader = new FBXLoader();
    loaderRef.current = loader;

    const clock = new THREE.Clock();

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

      // console.log("Proximity check:", {
      //   character: !!character,
      //   truck: !!truck,
      //   prompt: !!prompt,
      // });

      if (character && truck && prompt && !isDrivingRef.current) {
        const truckBody = truck.getObjectByName("truck_body");
        const box = new THREE.Box3().setFromObject(truckBody);

        // console.log("Truck body bounds:", {
        //   min: box.min.toArray(),
        //   max: box.max.toArray(),
        //   center: box.getCenter(new THREE.Vector3()).toArray(),
        //   size: box.getSize(new THREE.Vector3()).toArray(),
        // });
        // console.log("Truck body found:", !!truckBody);

        if (truckBody) {
          const characterPosition = new THREE.Vector3();
          const truckBodyPosition = new THREE.Vector3();

          character.getWorldPosition(characterPosition);
          truckBody.getWorldPosition(truckBodyPosition);

          // console.log("Character world position:", characterPosition);
          // console.log("Truck body world position:", truckBodyPosition);

          const bodyBox = new THREE.Box3().setFromObject(truckBody);

          const closestPoint = new THREE.Vector3();
          bodyBox.clampPoint(characterPosition, closestPoint);

          const distance = characterPosition.distanceTo(closestPoint);
          // console.log(
          //   "Character X/Z:",
          //   characterPosition.x,
          //   characterPosition.z,
          // );
          // console.log(
          //   "Truck body X/Z:",
          //   truckBodyPosition.x,
          //   truckBodyPosition.z,
          // );
          // console.log("Distance:", distance);
          // console.log("Distance to truck surface:", distance);

          prompt.visible = distance <= 5;
          // console.log("Prompt visible after update:", prompt.visible);
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

        const truckCollisionObjects = [
          truckBodyRef.current,
          truckBackWheelsRef.current,
          truckFrontLeftWheelRef.current,
          truckFrontRightWheelRef.current,
        ].filter(Boolean);

        if (movementLength > 0) {
          const inputX = moveX / movementLength;
          const inputZ = moveZ / movementLength;

          // console.log("Camera forward:", cameraForwardRef.current.toArray());
          // console.log("Camera right:", cameraRightRef.current.toArray());

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

          // console.log("Movement direction:", movementDirection.toArray());

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
          // Calculate where the character would move next.
          // Calculate the proposed movement.
          // Collision objects on the truck.
          // Truck parts that block the character.
          const truckCollisionObjects = [
            truckBodyRef.current,
            truckBackWheelsRef.current,
            truckFrontLeftWheelRef.current,
            truckFrontRightWheelRef.current,
          ].filter(Boolean);

          // Create a smaller collision box around the character.
          character.updateWorldMatrix(true, true);

          const characterBounds = new THREE.Box3().setFromObject(character);
          const characterSize = new THREE.Vector3();
          characterBounds.getSize(characterSize);

          // Reduce the box so animations and outstretched limbs don't block movement.
          const halfWidth = Math.min(characterSize.x * 0.25, 0.35);
          const halfDepth = Math.min(characterSize.z * 0.25, 0.35);

          const characterCenter = new THREE.Vector3();
          characterBounds.getCenter(characterCenter);

          const collisionBox = new THREE.Box3(
            new THREE.Vector3(
              characterCenter.x - halfWidth,
              characterBounds.min.y,
              characterCenter.z - halfDepth,
            ),
            new THREE.Vector3(
              characterCenter.x + halfWidth,
              characterBounds.max.y,
              characterCenter.z + halfDepth,
            ),
          );

          console.log("CHARACTER BOX MIN:", collisionBox.min.toArray());
          console.log("CHARACTER BOX MAX:", collisionBox.max.toArray());
          console.log("CHARACTER POSITION:", character.position.toArray());

          console.log("CHARACTER COLLISION BOX:", {
            min: collisionBox.min.toArray(),
            max: collisionBox.max.toArray(),
          });

          // Test whether the character can move to a proposed position.
          const canMoveTo = (testPosition) => {
            const offset = testPosition.clone().sub(character.position);
            const testBox = collisionBox.clone().translate(offset);

            // CHECK TRUCK COLLISIONS
            for (const part of truckCollisionObjects) {
              part.updateWorldMatrix(true, true);

              const truckBox = new THREE.Box3().setFromObject(part);

              const truckCenter = new THREE.Vector3();
              truckBox.getCenter(truckCenter);

              const xScaleFactor = 0.7;
              const halfX =
                (truckBox.max.x - truckBox.min.x) * 0.5 * xScaleFactor;

              truckBox.min.x = truckCenter.x - halfX;
              truckBox.max.x = truckCenter.x + halfX;

              const zScaleFactor = 0.7;
              const halfZ =
                (truckBox.max.z - truckBox.min.z) * 0.5 * zScaleFactor;

              truckBox.min.z = truckCenter.z - halfZ;
              truckBox.max.z = truckCenter.z + halfZ;

              const zOffset = 0.6;

              truckBox.min.z += zOffset;
              truckBox.max.z += zOffset;

              if (testBox.intersectsBox(truckBox)) {
                return false;
              }
            }

            // CHECK WALL COLLISIONS
            let hitCount = 0;

            for (const triangle of wallTrianglesRef.current) {
              if (testBox.intersectsTriangle(triangle)) {
                hitCount++;
              }
            }

            if (hitCount > 0) {
              console.log("WALL COLLISION DETECTED:", {
                hitCount,
                position: testPosition.toArray(),
                boxMin: testBox.min.toArray(),
                boxMax: testBox.max.toArray(),
              });

              return false;
            }

            return true;
          };

          // Resolve X and Z separately to allow sliding around the truck.
          const moveStepX = movementDirection.x * speed * delta;
          const moveStepZ = movementDirection.z * speed * delta;

          const nextX = character.position.clone();
          nextX.x += moveStepX;

          if (canMoveTo(nextX)) {
            character.position.x = nextX.x;
          }

          const nextZ = character.position.clone();
          nextZ.z += moveStepZ;

          if (canMoveTo(nextZ)) {
            character.position.z = nextZ.z;
          }
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

        const driveSpeed = 15;
        const turnSpeed = 1.5;

        // Move in the direction the truck is facing.
        // Get the truck's forward direction in world space.
        const forwardDirection = new THREE.Vector3(0, 0, 1)
          .applyQuaternion(truck.quaternion)
          .setY(0)
          .normalize();

        if (throttle !== 0) {
          const movement = forwardDirection
            .clone()
            .multiplyScalar(throttle * driveSpeed * delta);

          const truckBody = truckBodyRef.current;

          const canMoveTruckBy = (offset) => {
            if (!truckBody) {
              return false;
            }

            truck.updateWorldMatrix(true, true);
            truckBody.updateWorldMatrix(true, true);

            const truckBounds = new THREE.Box3().setFromObject(truckBody);
            const center = truckBounds.getCenter(new THREE.Vector3());
            const size = truckBounds.getSize(new THREE.Vector3());

            size.x *= 0.7; // reduce width by 10%
            size.z *= 0.9; // reduce length by 10%

            truckBounds.setFromCenterAndSize(center, size);
            const nextBounds = truckBounds.clone().translate(offset);

            return !wallTrianglesRef.current.some((triangle) =>
              nextBounds.intersectsTriangle(triangle),
            );
          };

          const moveX = new THREE.Vector3(movement.x, 0, 0);
          if (movement.x !== 0 && canMoveTruckBy(moveX)) {
            truck.position.x += movement.x;
          }

          const moveZ = new THREE.Vector3(0, 0, movement.z);
          if (movement.z !== 0 && canMoveTruckBy(moveZ)) {
            truck.position.z += movement.z;
          }
        }

        // Turn only while moving. Reverse steering flips the turn direction.
        if (throttle !== 0 && steering !== 0) {
          const truckBody = truckBodyRef.current;
          const yawChange = steering * turnSpeed * delta * Math.sign(throttle);

          if (truckBody) {
            // Keep the truck_body origin fixed while rotating the truck root.
            truck.updateWorldMatrix(true, true);
            const pivotWorldBefore = truckBody.getWorldPosition(
              new THREE.Vector3(),
            );

            truck.rotation.y -= yawChange;
            truck.updateWorldMatrix(true, true);

            const pivotWorldAfter = truckBody.getWorldPosition(
              new THREE.Vector3(),
            );

            const pivotBeforeInParent =
              truck.parent.worldToLocal(pivotWorldBefore);
            const pivotAfterInParent =
              truck.parent.worldToLocal(pivotWorldAfter);

            truck.position.add(pivotBeforeInParent.sub(pivotAfterInParent));
          } else {
            truck.rotation.y -= yawChange;
          }
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

      const targetPosition = new THREE.Vector3();
      if (isDrivingRef.current && truckBodyRef.current) {
        truckBodyRef.current.updateWorldMatrix(true, true);
        new THREE.Box3()
          .setFromObject(truckBodyRef.current)
          .getCenter(targetPosition);
      } else if (character) {
        character.getWorldPosition(targetPosition);
      }

      const hasProximityTarget = isDrivingRef.current
        ? Boolean(truckBodyRef.current)
        : Boolean(character);

      if (hasProximityTarget) {
        if (knightLabelRef.current) {
          const knightPosition = knightPositionRef.current;
          const distance = Math.hypot(
            targetPosition.x - knightPosition.x,
            targetPosition.z - knightPosition.z,
          );
          knightLabelRef.current.visible = distance <= 5;
        }

        if (conorLabelRef.current) {
          const conorPosition = conorPositionRef.current;
          const distance = Math.hypot(
            targetPosition.x - conorPosition.x,
            targetPosition.z - conorPosition.z,
          );
          conorLabelRef.current.visible = distance <= 4;
        }
        for (const { label, position } of animalLabelsRef.current) {
          const distance = Math.hypot(
            targetPosition.x - position.x,
            targetPosition.z - position.z,
          );

          label.visible = distance <= 5;
        }
      } else {
        if (knightLabelRef.current) knightLabelRef.current.visible = false;
        if (conorLabelRef.current) conorLabelRef.current.visible = false;
        for (const { label } of animalLabelsRef.current) {
          label.visible = false;
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

      computerOutlinesRef.current.forEach((outline) => {
        if (outline.visible) {
          outline.update();
        }
      });

      const completedAnimations = [];

      animalAnimationsRef.current.forEach((animation, index) => {
        animation.elapsed += delta;

        const squashDuration = 0.15;
        const jumpDuration = 0.5;

        const elapsed = animation.elapsed;

        if (elapsed < squashDuration) {
          // PHASE 1: Squash

          const progress = elapsed / squashDuration;

          const squash = 1 - 0.3 * progress;

          animation.object.scale.set(
            animation.originalScale.x,
            animation.originalScale.y * squash,
            animation.originalScale.z,
          );

          animation.object.position.y = animation.originalPosition.y;
        } else {
          // PHASE 2: Jump

          const progress = Math.min(
            (elapsed - squashDuration) / jumpDuration,
            1,
          );

          // Smooth jump curve
          const jumpHeight = Math.sin(progress * Math.PI);

          // Restore original scale while jumping
          animation.object.scale.copy(animation.originalScale);

          // Move upward and return to original position
          animation.object.position.y =
            animation.originalPosition.y + jumpHeight;
        }

        // Animation finished
        if (elapsed >= squashDuration + jumpDuration) {
          animation.object.position.copy(animation.originalPosition);

          animation.object.scale.copy(animation.originalScale);

          completedAnimations.push(index);
        }
      });

      // Remove completed animations
      for (const index of completedAnimations.reverse()) {
        animalAnimationsRef.current.splice(index, 1);
      }

      composer.render();
    }
    animate();

    function handleResize() {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      if (!width || !height) return;

      const pixelRatio = Math.min(window.devicePixelRatio, 2);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height);

      composer.setPixelRatio(pixelRatio);
      composer.setSize(width, height);
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
      knightLabelRef.current = null;
      conorLabelRef.current = null;
      window.removeEventListener("resize", handleResize);

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("joystickMove", handleJoystickMove);
      window.removeEventListener("exitTruck", handleExitTruck);
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
