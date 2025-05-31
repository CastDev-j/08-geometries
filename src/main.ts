import "./style.css";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const [width, height] = [
  (canvas.width = window.innerWidth),
  (canvas.height = window.innerHeight),
];

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

mesh.position.normalize();

const camera = new THREE.PerspectiveCamera(75, width / height);
camera.position.set(0, 0, 4);

scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.target.y = 1;
// controls.update();

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animation loop
// const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();

  window.requestAnimationFrame(tick);

  // mesh.rotation.y = elapsedTime;

  // camera.lookAt(mesh.position);

  // update controls to enable damping
  controls.update();

  // render
  renderer.render(scene, camera);
};

tick();

// Handle window resize

window.addEventListener("resize", () => {
  const [width, height] = [
    (canvas.width = window.innerWidth),
    (canvas.height = window.innerHeight),
  ];

  // Update camera aspect ratio and renderer size
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Handle canvas double-click to toggle fullscreen

window.addEventListener("dblclick", () => {

  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      console.error(
        `Error attempting to enable fullscreen mode: ${err.message}`
      );
    });
  } else {
    document.exitFullscreen();
  }
});
