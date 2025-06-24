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
import { gsap } from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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
  camera.position.z = 5

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

  // Cube
  const geometry = new THREE.BoxGeometry()
  const originMaterial = new THREE.MeshStandardMaterial({ color: 'red' })
  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: 'yellow',
    emissive: 'white',
    emissiveIntensity: 0.5,
  })
  const cube = new THREE.Mesh(geometry, originMaterial)
  cube.position.set(0, 0, 0)
  scene.add(cube)

  // Sphere
  const sphereGeometry = new THREE.SphereGeometry()
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 'orange',
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(3, 0, 0)
  scene.add(sphere)

  // Interacting with objects
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  const onMouseMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  window.addEventListener('mousemove', onMouseMove)

  let isHovered = false

  const animate = () => {
    requestAnimationFrame(animate)
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObject(cube)

    if (intersects.length > 0 && !isHovered) {
      cube.material = highlightMaterial
      isHovered = true
      gsap.to(cube.scale, {
        y: 1.5,
        x: 1.5,
        duration: 1.5,
        ease: 'power1.out',
      })
    } else if (intersects.length == 0 && isHovered) {
      cube.material = originMaterial
      isHovered = false
      gsap.to(cube.scale, {
        y: 1,
        x: 1,
        duration: 1.5,
        ease: 'power1.out',
      })
    }

    controls.update()
    renderer.render(scene, camera)
  }
  mouse.x = -999
  mouse.y = -999
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
