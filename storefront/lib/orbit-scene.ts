import type { Material, Mesh, Object3D, Texture } from "three"

function disposeObject(root: Object3D) {
  const materials = new Set<Material>()
  const textures = new Set<Texture>()
  root.traverse((node) => {
    const mesh = node as Mesh
    if (!mesh.isMesh) return
    mesh.geometry.dispose()
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      materials.add(material)
      for (const value of Object.values(material)) {
        if (value && typeof value === "object" && "isTexture" in value) textures.add(value as Texture)
      }
    }
  })
  textures.forEach((texture) => {
    const image = texture.source?.data
    if (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) image.close()
    texture.dispose()
  })
  materials.forEach((material) => material.dispose())
}

export async function createOrbitScene(
  canvas: HTMLCanvasElement,
  stage: HTMLElement,
  signal: AbortSignal,
  onProgress: (percent: number) => void
) {
  const [THREE, { GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
    import("three"),
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/libs/meshopt_decoder.module.js"),
  ])
  signal.throwIfAborted()
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" })
  const scene = new THREE.Scene()
  const shadows: { dispose: () => void }[] = []
  let disposed = false
  const dispose = () => {
    if (disposed) return
    disposed = true
    signal.removeEventListener("abort", dispose)
    disposeObject(scene)
    shadows.forEach((shadow) => shadow.dispose())
    renderer.dispose()
  }
  signal.addEventListener("abort", dispose, { once: true })

  try {
    renderer.setClearColor(0x0d0d0f, 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // The car and key light are stationary; camera motion does not invalidate the shadow map.
    renderer.shadowMap.autoUpdate = false
    scene.fog = new THREE.Fog(0x0d0d0f, 9, 26)
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60)
    const target = new THREE.Vector3(0, 0.55, 0)
    scene.add(new THREE.HemisphereLight(0x2a2a31, 0x0a0a0b, 0.55))
    const key = new THREE.SpotLight(0xffffff, 130, 0, Math.PI / 6, 0.55, 1.6)
    key.position.set(5, 8, 4)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.bias = -0.0003
    shadows.push(key.shadow)
    scene.add(key, key.target)
    const rim = new THREE.SpotLight(0xe10600, 340, 0, Math.PI / 4, 0.6, 1.8)
    rim.position.set(-6.5, 2.8, -5.5)
    scene.add(rim, rim.target)
    const cool = new THREE.SpotLight(0xffffff, 170, 0, Math.PI / 4, 0.7, 1.8)
    cool.position.set(6.5, 3.2, -4.5)
    scene.add(cool, cool.target)
    const under = new THREE.PointLight(0xe10600, 55, 7, 1.8)
    under.position.set(0, 0.3, 0.6)
    scene.add(under)
    const floor = new THREE.Mesh(new THREE.CircleGeometry(18, 48), new THREE.MeshStandardMaterial({ color: 0x070709, roughness: 0.95, metalness: 0 }))
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    const response = await fetch("/models/lamborghini-temerario-widebody.glb", { signal })
    if (!response.ok) throw new Error(`Vehicle model returned ${response.status}`)
    const total = Number(response.headers.get("content-length"))
    const reader = response.body?.getReader()
    let buffer: ArrayBuffer
    if (reader) {
      const chunks: Uint8Array[] = []
      let bytes = 0
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        bytes += value.length
        if (total > 0) onProgress(Math.min(99, Math.round(bytes / total * 99)))
      }
      const joined = new Uint8Array(bytes)
      let offset = 0
      for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.length }
      buffer = joined.buffer
    } else {
      buffer = await response.arrayBuffer()
    }
    signal.throwIfAborted()
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    const gltf = await loader.parseAsync(buffer, "/models/")
    if (signal.aborted) {
      disposeObject(gltf.scene)
      signal.throwIfAborted()
    }
    const car = gltf.scene
    const box = new THREE.Box3().setFromObject(car)
    const dims = box.getSize(new THREE.Vector3())
    car.scale.setScalar(4.6 / Math.max(dims.x, dims.z))
    const fitted = new THREE.Box3().setFromObject(car)
    car.position.x -= (fitted.min.x + fitted.max.x) / 2
    car.position.z -= (fitted.min.z + fitted.max.z) / 2
    car.position.y -= fitted.min.y
    car.traverse((node) => { if ((node as Mesh).isMesh) (node as Mesh).castShadow = true })
    scene.add(car)
    renderer.shadowMap.needsUpdate = true

    const resize = () => {
      const width = stage.clientWidth
      const height = stage.clientHeight
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 768 ? 1.25 : width < 1024 ? 1.5 : 2))
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.fov = camera.aspect < 1 ? 47 : 36
      camera.updateProjectionMatrix()
    }
    resize()
    return {
      resize,
      dispose,
      tint(color: string) { rim.color.set(color); under.color.set(color) },
      render(progress: number, pointerX: number, pointerY: number, intro: number, staticView = false) {
        if (disposed) return
        const pull = camera.aspect < 1 ? 1.5 : 1
        const az = THREE.MathUtils.degToRad(staticView ? 245 : 200 + progress * 140) + pointerX * 0.04
        const radius = (staticView ? 7.4 : 7.4 - 1.9 * Math.sin(progress * Math.PI)) * pull + (1 - intro) * 2
        const height = (staticView ? 2.1 : 2.3 - 1.05 * Math.sin(Math.min(progress * 1.15, 1) * Math.PI)) + (1 - intro) * 0.8 - pointerY * 0.2
        camera.position.set(Math.sin(az) * radius, height, Math.cos(az) * radius)
        camera.lookAt(target)
        renderer.render(scene, camera)
      },
    }
  } catch (error) {
    dispose()
    throw error
  }
}

export type OrbitScene = Awaited<ReturnType<typeof createOrbitScene>>
