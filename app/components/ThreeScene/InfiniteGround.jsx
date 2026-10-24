import * as THREE from "three";

export default function InfiniteGround(scene) {
  // Change this color whenever you want to change the ground.
  const GRASS_COLOR = 0x9bdc8b;

  const groundGeometry = new THREE.PlaneGeometry(2000, 2000);

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: GRASS_COLOR,
    roughness: 1,
    metalness: 0,
  });

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);

  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;

  scene.add(ground);

  return { ground };
}
