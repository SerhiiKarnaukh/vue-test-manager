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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const container = ref(null)
let scene, camera, renderer

function renderObject() {
  container.value.innerHTML = ''
  // Scene
  scene = new THREE.Scene()

  // Light
  const ambientLight = new THREE.AmbientLight('white', 1)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight('white', 1)
  dirLight.position.set(5, 5, 5)
  scene.add(dirLight)

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(5, 3, 5)
  camera.lookAt(0, 0, 0)

  // Renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.minDistance = 2
  controls.maxDistance = 10

  // Load
  const loader = new GLTFLoader()
  loader.load(
    '/3dmodels/scene.gltf',
    (gltf) => {
      const model = gltf.scene
      model.scale.set(4, 4, 4)
      model.position.set(1, 1, 1)
      scene.add(model)
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% load')
    },
    (e) => {
      console.log('Error: ' + e)
    }
  )

  const animate = () => {
    requestAnimationFrame(animate)

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
