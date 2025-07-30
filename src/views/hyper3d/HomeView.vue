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

  //   const pointLight = new THREE.PointLight('white', 10, 100)
  //   pointLight.position.set(-1, 1, 1)
  //   scene.add(pointLight)
  //   const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
  //   scene.add(pointLightHelper)

  //   const spotLight = new THREE.SpotLight('white', 6)
  //   spotLight.position.set(1, 1, 1)
  //   scene.add(spotLight)

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
  const material = new THREE.MeshStandardMaterial({ color: 'green' })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(-3, 0, 0)
  scene.add(cube)

  // Sphere
  const sphereGeometry = new THREE.SphereGeometry()
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 'orange',
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(3, 0, 0)
  scene.add(sphere)

  // Torus
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.2, 16, 100),
    new THREE.MeshBasicMaterial({ color: 'blue' })
  )
  torus.position.set(2, 2, 1)
  scene.add(torus)

  // Interacting with objects
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  const onMouseClick = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length > 0) {
      intersects[0].object.material.color.set('red')
    }
  }

  window.addEventListener('click', onMouseClick)

  const animate = () => {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    sphere.rotation.x += 0.01
    sphere.rotation.y += 0.01
    torus.rotation.x += 0.01
    torus.rotation.y += 0.01

    controls.update()
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
