import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js'; // to load 3d models


let scene, camera, renderer, controls, fae;
let mixers = []; //for animation
const clock = new THREE.Clock();

function init() {
    
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 12000);
    camera.position.set(0, -5, 50); 
    camera.rotation.set(4, 2, 2); 

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    const lightHelper = new THREE.PointLightHelper(pointLight);
    const gridHelper = new THREE.GridHelper(200, 50);
    gridHelper.position.y = -10;
    scene.add(lightHelper, gridHelper);

    //orbit controls
    controls = new OrbitControls(camera, renderer.domElement);

   //background
    const spaceTexture = new THREE.TextureLoader().load('assets/dreamy-cloud.jpg');
    scene.background = spaceTexture;

    //stars
    Array(200).fill().forEach(addStar);

    //load models
    const loader = new GLTFLoader();
    loader.load('assets/twin-mushroom.gltf', (gltf) => {
        const twinMushroom = gltf.scene;
        twinMushroom.position.set(20, 0, -10);
        twinMushroom.rotation.y = -Math.PI / 4;
        twinMushroom.position.y -= 10;

        twinMushroom.scale.set(0.1, 0.1, 0.1); 

        scene.add(twinMushroom);
    });

    loader.load('assets/twin-mushroom.gltf', (gltf) => {
        const twinMushroom = gltf.scene;
        twinMushroom.position.set(-10, 0, -20);
        twinMushroom.rotation.y = -Math.PI / 4;
        twinMushroom.position.y -= 10;

        twinMushroom.scale.set(0.1, 0.1, 0.1); //scaling the 3d models

        scene.add(twinMushroom);
    });

    loader.load('assets/twin-mushroom.gltf', (gltf) => {
        const twinMushroom = gltf.scene;
        twinMushroom.position.set(-40, 0, -60);
        twinMushroom.rotation.y = -Math.PI / 4;
        twinMushroom.position.y -= 10;

        twinMushroom.scale.set(0.1, 0.1, 0.1); 

        scene.add(twinMushroom);
    });

    loader.load('assets/twin-mushroom.gltf', (gltf) => {
    const twinMushroom = gltf.scene;
    twinMushroom.position.set(30, 0, -50);
    twinMushroom.rotation.y = -Math.PI / 4;
     twinMushroom.position.y -= 10;

        twinMushroom.scale.set(0.1, 0.1, 0.1); 

        scene.add(twinMushroom);
    });

    loader.load('assets/fae.gltf', (gltf) => {
    fae = gltf.scene;
    fae.position.set(0, 10, 10);
    fae.rotation.y = -Math.PI / 4;
    fae.position.y -= 0;

        fae.scale.set(3, 3, 3); 

        scene.add(fae);
    
 
  
    const faeSound = document.getElementById('faeSound');
    fae.traverse((child) => {
        if (child.isMesh) {
            child.userData = { URL: 'assets/fae.gltf' }; 
        }
    });
//event listener to play and stop th e sound
        window.addEventListener('click', (event) => {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                const intersectedObject = intersects[0].object;
                if (intersectedObject.userData && intersectedObject.userData.URL === 'assets/fae.gltf') {
                    if (faeSound.paused) {
                        faeSound.play();
                    } else {
                        faeSound.pause();
                    }
                }
            }
        });
    });

    loader.load('assets/butterflies.gltf', (gltf) => {
        const butterflies = gltf.scene;
        butterflies.position.set(25, 5, -10);
        butterflies.rotation.y = -Math.PI / 4;
        butterflies.position.y += 10;

        butterflies.scale.set(0.1, 0.1, 0.1); 

        scene.add(butterflies);

        //animation
        const mixer = new THREE.AnimationMixer(butterflies);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
        mixers.push(mixer);
    });
    loader.load('assets/butterflies.gltf', (gltf) => {
        const butterflies = gltf.scene;
        butterflies.position.set(-20, 5, -10);
        butterflies.rotation.y = -Math.PI / 4;
        butterflies.position.y += 10;

        butterflies.scale.set(0.1, 0.1, 0.1); 

        scene.add(butterflies);

        
        const mixer = new THREE.AnimationMixer(butterflies);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
        mixers.push(mixer);
    });
}

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xff2bce });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    camera.rotation.z += -0.01;
    camera.rotation.x += -0.0002;
    camera.rotation.y += -0.0002;
}

document.body.onscroll = moveCamera;

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    mixers.forEach((mixer) => {
        mixer.update(delta);
    });

    if (fae) {
        fae.rotation.y += 0.01;
    }

    controls.update();
    renderer.render(scene, camera);
}

init();
animate();
moveCamera();
