import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { getCamera } from './game-camera'

let activeAction, mixer, model, previousAction;
let actions = {};

const camera = getCamera();

export function getScene(callback) {

    const world = {};
    const scene = new THREE.Scene();
    // Debug stuff
    // const size = 30
    // const divisions = 30
    // const gridHelper = new THREE.GridHelper(size, divisions)
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Generic THREEJS parameters


    // Orbit Controls
    const canvas = document.querySelector('canvas.webgl');
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Geometries
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const blockGeometry = new THREE.BoxGeometry(1, 2, 5);
    const skyGeometry = new THREE.BoxGeometry(80, 80, 80);

    const meshSize = 50;
    const meshStep = 5;
    let points = [];
    for (let i = -meshSize; i <= meshSize; i += meshStep) {
        points.push(new THREE.Vector3(-meshSize, 0.04, i));
        points.push(new THREE.Vector3(meshSize, 0.04, i));
        points.push(new THREE.Vector3(i, 0.04, -meshSize));
        points.push(new THREE.Vector3(i, 0.04, meshSize));
    }
    const floorGridGeometry = new THREE.BufferGeometry().setFromPoints(points);

    // Materials
    const wallMaterial = new THREE.MeshLambertMaterial({
        color: 0xfb8e00
    });
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: "gray",
        side: THREE.DoubleSide
    });
    const floorGridMaterial = new THREE.LineBasicMaterial({
        color: "green"
    });
    const skyBoxMaterial = new THREE.MeshBasicMaterial({
        color: "white"
    });
    skyBoxMaterial.side = THREE.BackSide;

    // Mesh objects
    const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    floorPlane.rotation.x = -Math.PI / 2;

    const floorPlaneMesh = new THREE.LineSegments(floorGridGeometry, floorGridMaterial);
    floorPlaneMesh.position.set(0, 0, 0);

    const wallBlock = new THREE.Mesh(blockGeometry, wallMaterial);
    wallBlock.position.set(0, 1, 13);

    const skyMesh = new THREE.Mesh(skyGeometry, skyBoxMaterial);

    scene.add(wallBlock);
    scene.add(floorPlane);
    scene.add(floorPlaneMesh);
    scene.add(skyMesh);



    const loader = new GLTFLoader()

    loader.load('src/assets/RobotExpressive.glb', function (gltf) {

        model = gltf.scene;
        model.position.z = 14;
        model.position.x = -3;
        model.rotateY(Math.PI);
        scene.add(model);

        createGUI(model, gltf.animations);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.x = 2;
        pointLight.position.y = 3;
        pointLight.position.z = 4;
        scene.add(pointLight);

        world.scene = scene;
        world.mixer = mixer;
        world.model = model;
        world.camera = camera;

        callback(world);   

    }, undefined, function (e) {
        console.error(e);
    });

    function createGUI(model, animations) {

        const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
        const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

        // gui = new GUI();

        mixer = new THREE.AnimationMixer(model);

        // actions = {};

        for (let i = 0; i < animations.length; i++) {

            const clip = animations[i];
            const action = mixer.clipAction(clip);
            actions[clip.name] = action;

            if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {

                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;

            }

        }

        activeAction = actions['Idle'];
        activeAction.play();

    }
}


export function fadeToAction(name, duration) {

    previousAction = activeAction;
    activeAction = actions[name];

    if (previousAction !== activeAction) {

        previousAction.fadeOut(duration);
    }

    activeAction
        // .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();

}


// function sendCommand(value) {
//     console.log(value)
//     if (value == "WALK") {
//         renderer.setAnimationLoop(animate2Go);
//         console.log("Activating Walking mode")
//         fadeToAction("Walking", 0.2);

//     }
// }