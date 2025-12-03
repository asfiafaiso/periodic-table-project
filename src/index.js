import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

// Data from PHP
const data = window.SHEET_DATA;

// Scene setup
let camera, scene, renderer, controls;
const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };

// Table layout
const columns = 20;
const rows = 10;

init();
createObjects();
animate();

// Expose functions for buttons
window.transform = transform;
window.targets = targets;

// ----------------------
// INIT
// ----------------------
function init() {
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 3000;

  scene = new THREE.Scene();

  renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // ----------------------
  // TRACKBALL CONTROLS – EXACTLY LIKE PERIODIC TABLE DEMO
  // ----------------------
  controls = new TrackballControls(camera, renderer.domElement);

  // EXACT demo values
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.minDistance = 500;
  controls.maxDistance = 6000;

  // Mouse bindings used in the demo
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.LEFT,
    MIDDLE: THREE.MOUSE.MIDDLE,
    RIGHT: THREE.MOUSE.RIGHT,
  };

  window.addEventListener("resize", onWindowResize);
}

// ----------------------
// CREATE OBJECTS
// ----------------------
function createObjects() {
  const xSpacing = 140;
  const ySpacing = 180;

  // Create cards
  data.forEach((item, i) => {
    const element = document.createElement("div");

    // Determine net worth class
    let net = parseFloat(item.networth.replace(/[$,]/g, "")) / 1000;
    let netClass = "net-low"; // default
    if (net >= 100 && net <= 200) netClass = "net-mid";
    else if (net > 200) netClass = "net-high";

    element.className = `card ${netClass}`;

    // Card content
    element.innerHTML = `
        <div class="card-header">
            <span>${item.country}</span>
            <span>${item.age}</span>
        </div>
        <div class="card-body">
            <img src="${item.photo}" alt="">
            <h3>${item.name}</h3>
            <p>${item.interest}</p>
        </div>
    `;

    const object = new CSS3DObject(element);
    object.position.set(
      Math.random() * 4000 - 2000,
      Math.random() * 4000 - 2000,
      Math.random() * 4000 - 2000
    );
    scene.add(object);
    objects.push(object);

    const col = i % columns;
    const row = Math.floor(i / columns);
    const tableTarget = new THREE.Object3D();
    tableTarget.position.set(
      col * xSpacing - ((columns - 1) * xSpacing) / 2,
      -(row * ySpacing) + ((rows - 1) * ySpacing) / 2,
      0
    );
    targets.table.push(tableTarget);
  });

  createSphereTargets();
  createHelixTargets();
  createGridTargets();

  // Start with TABLE layout
  transform(targets.table, 2000);

  // Hide spinner
  const spinner = document.getElementById("spinner");
  if (spinner) spinner.style.display = "none";
}

// ----------------------
// SPHERE TARGETS
// ----------------------
function createSphereTargets() {
  const radius = 1200;
  const total = objects.length;
  const vector = new THREE.Vector3();

  for (let i = 0; i < total; i++) {
    const phi = Math.acos(-1 + (2 * i) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;

    const sphereTarget = new THREE.Object3D();
    sphereTarget.position.setFromSphericalCoords(radius, phi, theta);
    vector.copy(sphereTarget.position).multiplyScalar(2);
    sphereTarget.lookAt(vector);

    targets.sphere.push(sphereTarget);
  }
}

// ----------------------
// HELIX TARGETS
// ----------------------
function createHelixTargets() {
  const helixRadius = 900;
  const helixStep = 10;
  const total = objects.length;

  for (let i = 0; i < total; i++) {
    const theta = i * 0.25;
    const y = -(i * helixStep) + 1000;

    // Strand A
    const helixA = new THREE.Object3D();
    helixA.position.set(
      Math.cos(theta) * helixRadius,
      y,
      Math.sin(theta) * helixRadius
    );
    helixA.lookAt(0, y, 0);
    helixA.rotateY(Math.PI);
    targets.helix.push(helixA);

    // Strand B (opposite)
    const helixB = new THREE.Object3D();
    helixB.position.set(
      Math.cos(theta + Math.PI) * helixRadius,
      y,
      Math.sin(theta + Math.PI) * helixRadius
    );
    helixB.lookAt(0, y, 0);
    helixB.rotateY(Math.PI);
    targets.helix.push(helixB);

    if (targets.helix.length >= total) break;
  }
}

// ----------------------
// GRID TARGETS
// ----------------------
function createGridTargets() {
  const gx = 5,
    gy = 4,
    gz = 10;
  let index = 0;

  for (let x = 0; x < gx; x++) {
    for (let y = 0; y < gy; y++) {
      for (let z = 0; z < gz; z++) {
        if (index >= objects.length) break;
        const gridTarget = new THREE.Object3D();
        gridTarget.position.set(
          (x - gx / 2) * 400,
          (y - gy / 2) * 400,
          (z - gz / 2) * 400
        );
        targets.grid.push(gridTarget);
        index++;
      }
    }
  }
}

// ----------------------
// TRANSFORM OBJECTS
// ----------------------
function transform(targetsArray, duration) {
  objects.forEach((object, i) => {
    const target = targetsArray[i];
    if (!target) return;

    new TWEEN.Tween(object.position)
      .to(
        { x: target.position.x, y: target.position.y, z: target.position.z },
        duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to(
        { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
        duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  });

  new TWEEN.Tween(this).to({}, duration).onUpdate(render).start();
}

// ----------------------
// WINDOW RESIZE
// ----------------------
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

// ----------------------
// ANIMATE
// ----------------------
function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();
  render();
}

// ----------------------
// RENDER
// ----------------------
function render() {
  renderer.render(scene, camera);
}
