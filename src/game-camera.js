import * as THREE from 'three'

export function getCamera() {
    // Camera
    const width = 20;
    const height = width * (window.innerHeight / window.innerWidth);

    const camera = new THREE.OrthographicCamera(
        -width,
        width,
        height,
        -height,
        1,
        100
    );
    camera.position.set(16, 16, 16);
    camera.lookAt(0, 0, 0);

    return camera;
}