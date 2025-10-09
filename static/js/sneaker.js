const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('sneaker-canvas').appendChild(renderer.domElement);

// Sneaker-like shape (placeholder)
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.7,
    roughness: 0.2
});
const sneaker = new THREE.Mesh(geometry, material);
scene.add(sneaker);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(10, 10, 10);
scene.add(spotLight);

// Animation
function animate() {
    requestAnimationFrame(animate);
    sneaker.rotation.x += 0.01;
    sneaker.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
