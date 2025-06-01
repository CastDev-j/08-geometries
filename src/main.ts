import "./style.css";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";

const gui = new GUI({
  // width: 300,
  autoPlace: true,
  title: "Cool Debug Panel",
  closeFolders: true,
})
  .close();
  // .hide();

const cubeFolder = gui.addFolder("Cube");

const debugObject = {
  color: "#a778d8",
  isAnimated: true,
  speed: 1,
  subdivisions: 1,
  spin: () => {
    gsap.to(mesh.rotation, {
      duration: 1,
      y: mesh.rotation.y + Math.PI * 2,
      ease: "power1.inOut",
    });
  },
};

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const [width, height] = [
  (canvas.width = window.innerWidth),
  (canvas.height = window.innerHeight),
];

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

cubeFolder
  .add(mesh.position, "y")
  .min(-1)
  .max(1)
  .step(0.01)
  .name("Mesh Y Position");

cubeFolder.add(mesh, "visible");
cubeFolder.add(mesh.material, "wireframe");

// cubeFolder.add(debugObject, "isAnimated").name("Animate Mesh");
// cubeFolder.add(debugObject, "speed").min(0).max(5).step(0.01).name("Animation Speed");

cubeFolder.addColor(debugObject, "color").onChange(() => {
  mesh.material.color.set(debugObject.color);
});

cubeFolder
  .add(debugObject, "subdivisions")
  .min(1)
  .max(32)
  .step(1)
  .name("Subdivisions")
  .onFinishChange(() => {
    const { subdivisions } = debugObject;
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      subdivisions,
      subdivisions,
      subdivisions
    );
  });

cubeFolder.add(debugObject, "spin").name("Spin Mesh");

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

  // animations
  // if (debugObject.isAnimated) {
  //   mesh.rotation.y = elapsedTime * debugObject.speed;
  // }

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

// Show the GUI

document.addEventListener("keydown", (event) => {
  if (event.key === "g") {
    gui.show(gui._hidden);
  }
});
