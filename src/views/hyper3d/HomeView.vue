<template>
  <v-container fluid class="main_container">
    <v-main>
      <v-row justify="center">
        <v-col cols="12" md="12">
          <div ref="container"></div>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
const container = ref(null)
let scene, camera, renderer

function renderObject() {
  container.value.innerHTML = ''
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.z = 5
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial({ color: 'green' })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(-3, 0, 0)
  scene.add(cube)

  const sphereGeometry = new THREE.SphereGeometry(0.5, 6, 6)
  const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 'orange',
    emissive: '#fff',
    shininess: 100,
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(3, 0, 0)
  scene.add(sphere)

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.2, 16, 100),
    new THREE.MeshBasicMaterial({ color: 'blue' })
  )
  torus.position.set(2, 2, 1)
  scene.add(torus)

  const animate = () => {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    sphere.rotation.x += 0.01
    sphere.rotation.y += 0.01
    torus.rotation.x += 0.01
    torus.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  animate()
}

onMounted(() => {
  renderObject()
})
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.main_container {
  background-color: black;
}
</style>
