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

function getRandomFloat(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min + 1) + min;
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

function addCone(parent, remainingDepth) {
    if (remainingDepth === 0) {
        return
    }

    const height = (1 + Math.random()) * (remainingDepth)
    const radius = (1 + Math.random()) * remainingDepth / 3
    const geometry = new THREE.ConeGeometry(radius, height, 32)
    const greenAmount = 1 - remainingDepth / maxDepth
    const material = new THREE.MeshStandardMaterial({ color: 0x69471b, emissive: new THREE.Color(0, greenAmount, 0), emissiveIntensity: 0.5 })
    const cone = new THREE.Mesh(geometry, material)

    cone.position.y = (parent?.geometry?.parameters?.height || 0) / 2

    if (parent !== scene) {
        cone.rotateX(Math.PI * (Math.random() - 0.5))
        cone.rotateZ(Math.PI * (Math.random() - 0.5))
    }

    parent.add(cone)

    setTimeout(() => { addCone(cone, remainingDepth - 1) }, 500)
    setTimeout(() => { addCone(cone, remainingDepth - 1) }, 650)
}

let maxDepth = 5
addCone(scene, maxDepth)

camera.position.y = 0
camera.position.x = 0
camera.position.z = 5
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 0, 0)
controls.update()

const light = new THREE.DirectionalLight(0xffffff, 0.5)
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
