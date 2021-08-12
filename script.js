// Helper function to pick randomly from an array.
Array.prototype.sample = function() {
    return this[Math.floor(Math.random() * this.length)];
}

// Make values unique.
Array.prototype.uniq = function() {
    return [...new Set(this)]
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const loader = new THREE.GLTFLoader()

function loadModel(name) {
    return new Promise(resolve => {
        loader.load(
            `${name}`,
            function(gltf) {
                resolve(gltf.scene)
            }
        )
    })
}


const scene = new THREE.Scene()
scene.background = new THREE.Color('gray')

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.ConeGeometry(1, 2, 32)
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: new THREE.Color('blue'), emissiveIntensity: 0.5 })
const cone = new THREE.Mesh(geometry, material);
scene.add(cone);

camera.position.y = 4
camera.position.x = -3
camera.position.z = 2
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 0, 0)
controls.update()

const light = new THREE.DirectionalLight(0xfffff, 0.5)
light.position.x = 4
scene.add(light);

function clearThree(obj) {
    while (obj.children.length > 0) {
        clearThree(obj.children[0]);
        obj.remove(obj.children[0]);
    }
}

const animate = function() {
    requestAnimationFrame(animate)

    controls.update()
    renderer.render(scene, camera)
}

animate()
