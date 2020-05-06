import React from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const COLOUR_TABLE = {
  'B': new THREE.Color('blue'),
  'F': new THREE.Color('green'),
  'R': new THREE.Color('red'),
  'L': new THREE.Color('darkorange'),
  'B': new THREE.Color('yellow'),
  'U': new THREE.Color('ghostwhite'),
  '-': new THREE.Color(0x282828)
}

const PIECE_MATERIAL = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  vertexColors: THREE.FaceColors,
  metalness: 0,
  roughness: 0,
  clearcoat: 1,
  reflectivity: 1
})

const LIGHT_COLOUR = 0xffffff
const LIGHT_INTENSITY = 1.2
const LIGHT_DISTANCE = 10

const light1 = new THREE.DirectionalLight(LIGHT_COLOUR, LIGHT_INTENSITY)
light1.position.set(0, 0, LIGHT_DISTANCE)

const light2 = new THREE.DirectionalLight(LIGHT_COLOUR, LIGHT_INTENSITY)
light2.position.set(0, 0, -LIGHT_DISTANCE)

const light3 = new THREE.DirectionalLight(LIGHT_COLOUR, LIGHT_INTENSITY)
light3.position.set(0, LIGHT_DISTANCE, 0)

const light4 = new THREE.DirectionalLight(LIGHT_COLOUR, LIGHT_INTENSITY)
light4.position.set(0, -LIGHT_DISTANCE, 0)

const light5 = new THREE.DirectionalLight(LIGHT_COLOUR, LIGHT_INTENSITY)
light5.position.set(LIGHT_DISTANCE, 0, 0)

const light6 = new THREE.DirectionalLight(LIGHT_COLOUR, LIGHT_INTENSITY)
light6.position.set(-LIGHT_DISTANCE, 0, 0)

// const w = container.offsetWidth
// const h = container.offsetHeight
// globals.renderer = new THREE.WebGLRenderer({ antialias: true })
// globals.renderer.setSize(w, h)
// container.appendChild(globals.renderer.domElement)

// const scene = new THREE.Scene()

// const material = new THREE.MeshBasicMaterial({
//   color: 0xffffff,
//   vertexColors: THREE.FaceColors
// })

// const newCubeGeometry = new THREE.BoxGeometry(0.95, 0.95, 0.95)
// const newCubeMesh = THREE.Mesh(cubeGeometries[cubeNum], material)
// scene.add(newCubeMesh)

// const newCubePositions = []
// for (let z = 1; z >= -1; z--) {
//   for (let y = -1; y <= 1; y++) {
//     for (let x = 1; x >= -1; x--) {
//       newCubePositions.push([x, y, z])
//     }
//   }
// }


const str = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'

export default class Cube extends React.PureComponent {
  constructor (props) {
    super(props)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    this.state = {
      renderer,
      mounted: false
    }
  }

  async componentDidMount () {
    this._updateRenderSize()

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    const camera = new THREE.PerspectiveCamera(34, w / h, 1, 100)
    camera.position.set(3, 3, 12)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    scene.add(globals.camera)

    scene.add(light1)
    scene.add(light2)
    scene.add(light3)
    scene.add(light4)
    scene.add(light5)
    scene.add(light6)

    const puzzleGroup = new THREE.Group()
    scene.add(puzzleGroup)

    const animationGroup = new THREE.Group()
    scene.add(animationGroup)

    controls = new OrbitControls(camera, this.state.renderer.domElement)
    controls.minDistance = 5.0
    controls.maxDistance = 40.0
    controls.enableDamping = true
    controls.dampingFactor = 0.9
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.0

    const clock = new THREE.Clock()
    animationMixer = new THREE.AnimationMixer()

    const pieceGeometry = await new Promise(resolve => {
      const loader = new GLTFLoader()
      loader.load(
        '/cube-bevelled.glb',
        gltf => {
          const bufferGeometry = gltf.scene.children[0].geometry
          const geometry = new THREE.Geometry()
          geometry.fromBufferGeometry(bufferGeometry)
          resolve(geometry)
        },
        undefined,
        reject
      )
    })

    // createUiPieces(globals.cube, pieceGeometry)

    // animate()
    // scramble()

    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResize)
  }

  onResize = () => {
    this._updateRenderSize()
    if (this.state.camera) {
      this.state.camera.updateProjectionMatrix()
    }
  }

  componentDidUpdate () {
    this._updateRenderSize()
  }

  _updateRenderSize () {
    if (this._ref) {
      const w = this._ref.offsetWidth
      const h = this._ref.offsetHeight
      const aspect = w / h
      this.state.renderer.setSize(w, h)
      if (this.state.camera) {
        this.state.camera.aspect = aspect
      }
      if (!this.state.mounted) {
        this._ref.appendChild(this.state.renderer.domElement)
        this.setState({
          mounted: true,
          w, h, aspect
        })
      } else if (this.state.w !== w || this.state.h !== h) {
        this.setState({ w, h, aspect })
      }
    }
  }

  render () {
    return (
      <div ref={ref => { this._ref = ref }}>

      </div>
    )
  }

    // createCube () {
  //



  //   // Generating coordinates for all cubes


  //   // Set state to store coordinates of all cubes
  //   this.setState({
  //     cubePositions: newCubePositions
  //   }, () => {
  //     // Use Three.JS methods to set position of each cube
  //     for (let cubeNum in cubes) {
  //       cubes[cubeNum].position.set(...this.state.cubePositions[cubeNum]);
  //     }
  //   })
  // }
}
