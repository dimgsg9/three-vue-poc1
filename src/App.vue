<template>
  <div class="container">
    <div class="columns is-multiline">
        <HelloWorld msg="" @new-command="runCommand"/>
      <div class="column is-full">
        <canvas class="webgl" />
      </div>
    </div>
  </div>
</template>

<script setup>

import * as THREE from 'three'
import HelloWorld from './components/HelloWorld.vue'
import { onMounted, reactive, defineComponent } from 'vue'
import { getScene } from './game-world'
import { fadeToAction } from './game-world'

defineComponent({ HelloWorld });

const state = reactive({
    moving: false,
    position: {
        cur: {},
        dst: {
            x: 0,
            y: 0,
            z: 0
        }
    }
});

function runCommand() {
  console.log("run command");
}

onMounted(() => {

getScene(function (response) {
  const world = response;

  // Area sizing
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  // Canvas
  const canvas = document.querySelector('canvas.webgl');

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  // renderer.setAnimationLoop(animate(renderer));
  run(renderer, world);

});

const movingStep = 0.1;

let clock = new THREE.Clock();

function run(renderer, world) {

  renderer.setAnimationLoop(animate);

  function animate() {
    const dt = clock.getDelta()

    if (world.mixer) world.mixer.update(dt);

    if (state.moving) {
      fadeToAction("Walking", 0.01); // why do we fadeToAction on every frame??
      if (world.model.position.z.toFixed(1) != state.position.dst.z.toFixed(1)) {
        world.model.position.z -= movingStep;
      } else {
        state.moving = false;
        fadeToAction("Idle", 0.01);
      }
    }

    renderer.render(world.scene, world.camera)
  }

}



// window.addEventListener('resize', () => {
//     // Update sizes
//     sizes.width = window.innerWidth;
//     sizes.height = window.innerHeight;

//     // Update camera
//     camera.aspect = sizes.width / sizes.height;
//     camera.updateProjectionMatrix();

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });



/**
 * Animate
 */

// const clock = new THREE.Clock()

// const tick = () =>
// {

//     const elapsedTime = clock.getElapsedTime()

//     // Update objects
//     sphere.rotation.y = .5 * elapsedTime

//     // Update Orbital Controls
//     // controls.update()

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()

// const commInput = document.getElementById("command-input")
// commInput.oninput = (e) => {
//     sendCommand(e.target.value)
// }
})



</script>