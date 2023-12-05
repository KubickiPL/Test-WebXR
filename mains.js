//importowanie biblioteki THREE - kod rozpoczyna się od importowania bibliotek
import * as THREE from "./three_js/three.module.js";
import { GLTFLoader } from "./three_js/GLTFLoader.js";
import { OrbitControls } from "./three_js/OrbitControls.js";

// tworzenie sceny, kamery perspektywicznej
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, //kąt pola widzenia w stopniach
    window.innerWidth / window.innerHeight, // stosunek szerokości do wysokości ekranu
    0.1, //najbliższe odległość renderowania obiektów
    1000); //najdalsza odległość renderowania
camera.position.z = 5; //pozycja kamery na osi Z

// tworzenie rendera 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // Ustawia kolor tła
document.body.appendChild(renderer.domElement);

// ustawienia światła
// Hemisphere Light - światło umieszczone bezpośrednio nad sceną 
// kolor przechodzi od koloru nieba do koloru podłoża
let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444); 
//(kolor nieba - hex, kolor podłoża - hex, intensywność - liczba)
hemiLight.position.set(1, 1, 1);
scene.add(hemiLight);

// Directional Light - światło skierowane w określonym kierunku
let dirLight = new THREE.DirectionalLight(0xffffff, 1); //(kolor-hex, intensywność-liczba)
dirLight.position.set(1, 1, 1).normalize;
scene.add(dirLight);

// Directional Light 2 - drugie źródło światła kierunkowego
let backDirLight = new THREE.DirectionalLight(0xffffff, 1);
backDirLight.position.set(-1, -1, -1).normalize;
scene.add(backDirLight);

// Ambient Light - światło otoczenia, oświetla wszystkie obiekty w równym stopniu
let ambientLight = new THREE.AmbientLight(0xfffff0); //(kolor-hex, intensywność-liczba)
ambientLight.position.set(1, 1, 1);
scene.add(ambientLight);

// Dodawanie modelu GLTF - ustawienie materiałów i parametrów
let mesh;
const loader = new GLTFLoader();
loader.load(
    "./model/dom-10000.gltf",
    function (gltf) {
        mesh = gltf.scene;
        mesh.material = new THREE.MeshLambertMaterial();
        mesh.material.flatShading = true;
        mesh.material.metalness = 0;
        mesh.position.set(0, 0, 0);
        mesh.scale.set(0.1, 0.1, 0.1);
        mesh.rotateY(0);
        scene.add(mesh);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% załadowano"); // postęp ładowania modelu
    },
    function (error) {
        console.log("!!! Błąd !!!"); // komunikat przy błędach
    }
);

// Ustawienia obracania
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// obsługa ruchu obrotu przy pomocy myszy
function onMouseMove(event) {
    if (isMouseDown && mesh) {
        let deltaX = event.clientX - window.innerWidth / 2;
        let deltaY = event.clientY - window.innerHeight / 2;
        mesh.rotation.y += deltaX * 0.005;
        mesh.rotation.x += deltaY * 0.005;
    }
}

// Obracanie gdy przycisk myszy jest wciśnięty
let isMouseDown = false;
document.addEventListener('mousedown', () => (isMouseDown = true), false);
document.addEventListener('mouseup', () => (isMouseDown = false), false);

// zmiana rozmiaru okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

// animacja - płynna animacja i renderowania sceny
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

document.addEventListener('mousemove', onMouseMove, false);
animate();
