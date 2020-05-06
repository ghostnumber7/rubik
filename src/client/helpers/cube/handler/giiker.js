import Cube from './base'

const SERVICE_UUID = '0000aadb-0000-1000-8000-00805f9b34fb'
const CHARACTERISTIC_UUID = '0000aadc-0000-1000-8000-00805f9b34fb'

const SYSTEM_SERVICE_UUID = '0000aaaa-0000-1000-8000-00805f9b34fb'
const SYSTEM_READ_UUID = '0000aaab-0000-1000-8000-00805f9b34fb'
const SYSTEM_WRITE_UUID = '0000aaac-0000-1000-8000-00805f9b34fb'

// face indices
const B = 0
const D = 1
const L = 2
const U = 3
const R = 4
const F = 5

const faces = ['B', 'D', 'L', 'U', 'R', 'F']

// color indices
const b = 0
const y = 1
const o = 2
const w = 3
const r = 4
const g = 5

const colors = ['blue', 'yellow', 'orange', 'white', 'red', 'green']

const turns = {
  0: 1,
  1: 2,
  2: -1,
  8: -2
}

const cornerColors = [
  [y, r, g],
  [r, w, g],
  [w, o, g],
  [o, y, g],
  [r, y, b],
  [w, r, b],
  [o, w, b],
  [y, o, b]
]

const cornerLocations = [
  [D, R, F],
  [R, U, F],
  [U, L, F],
  [L, D, F],
  [R, D, B],
  [U, R, B],
  [L, U, B],
  [D, L, B]
]

const edgeLocations = [
  [F, D],
  [F, R],
  [F, U],
  [F, L],
  [D, R],
  [U, R],
  [U, L],
  [D, L],
  [B, D],
  [B, R],
  [B, U],
  [B, L]
]

const edgeColors = [
  [g, y],
  [g, r],
  [g, w],
  [g, o],
  [y, r],
  [w, r],
  [w, o],
  [y, o],
  [b, y],
  [b, r],
  [b, w],
  [b, o]
]

const cornerFaceIndices = [
  [29, 15, 26],
  [9, 8, 20],
  [6, 38, 18],
  [44, 27, 24],
  [17, 35, 51],
  [2, 11, 45],
  [36, 0, 47],
  [33, 42, 53]
]

const edgeFaceIndices = [
  [25, 28],
  [23, 12],
  [19, 7],
  [21, 41],
  [32, 16],
  [5, 10],
  [3, 37],
  [30, 43],
  [52, 34],
  [48, 14],
  [46, 1],
  [50, 39]
]

const colorFaceMapping = {
  blue: 'B',
  yellow: 'D',
  orange: 'L',
  white: 'U',
  red: 'R',
  green: 'F'
}

export default class Giiker extends Cube {
  constructor (...args) {
    super(...args)
    this._systemService = null
    this._state = null
    this.init()
  }

  getBatteryLevel = async () => {
    if (this.connected) {
      const readCharacteristic = await this._systemService.getCharacteristic(SYSTEM_READ_UUID)
      const writeCharacteristic = await this._systemService.getCharacteristic(SYSTEM_WRITE_UUID)
      await readCharacteristic.startNotifications()
      const data = new Uint8Array([0xb5]).buffer
      writeCharacteristic.writeValue(data)

      return new Promise((resolve) => {
        const listener = (event) => {
          const value = event.target.value
          readCharacteristic.removeEventListener('characteristicvaluechanged', listener)
          readCharacteristic.stopNotifications()
          const level = value.getUint8(1)
          if (level !== this.battery) {
            this.onBatteryLevelChanged(level)
          }
          setTimeout(() => {
            this.getBatteryLevel()
          }, 60000)
          resolve(level)
        }
        readCharacteristic.addEventListener('characteristicvaluechanged', listener)
      })
    } else {
      setTimeout(() => {
        this.getBatteryLevel()
      }, 60000)
    }
  }

  get parsedState () {
    const state = {
      corners: [],
      edges: []
    }
    this._state.cornerPositions.forEach((cp, index) => {
      const mappedColors = this._mapCornerColors(
        cornerColors[cp - 1],
        this._state.cornerOrientations[index],
        index
      )
      state.corners.push({
        position: cornerLocations[index].map((f) => faces[f]),
        colors: mappedColors.map((c) => colors[c])
      })
    })
    this._state.edgePositions.forEach((ep, index) => {
      const mappedColors = this._mapEdgeColors(
        edgeColors[ep - 1],
        this._state.edgeOrientations[index]
      )
      state.edges.push({
        position: edgeLocations[index].map((f) => faces[f]),
        colors: mappedColors.map((c) => colors[c])
      })
    })
    return state
  }

  get stateString () {
    const state = this.parsedState
    const faces = []

    state.corners.forEach((corner, cornerIndex) => {
      corner.position.forEach((face, faceIndex) => {
        faces[cornerFaceIndices[cornerIndex][faceIndex]] = colorFaceMapping[corner.colors[faceIndex]]
      })
    })

    state.edges.forEach((edge, edgeIndex) => {
      edge.position.forEach((face, faceIndex) => {
        faces[edgeFaceIndices[edgeIndex][faceIndex]] = colorFaceMapping[edge.colors[faceIndex]]
      })
    })

    faces[4] = 'U'
    faces[13] = 'R'
    faces[22] = 'F'
    faces[31] = 'D'
    faces[40] = 'L'
    faces[49] = 'B'

    return faces.join('')
  }

  _mapCornerColors(colors, orientation, position) {
    const actualColors = []

    if (orientation !== 3) {
      if (position === 0 || position === 2 || position === 5 || position === 7) {
        orientation = 3 - orientation
      }
    }

    switch (orientation) {
      case 1:
        actualColors[0] = colors[1]
        actualColors[1] = colors[2]
        actualColors[2] = colors[0]
        break
      case 2:
        actualColors[0] = colors[2]
        actualColors[1] = colors[0]
        actualColors[2] = colors[1]
        break
      case 3:
        actualColors[0] = colors[0]
        actualColors[1] = colors[1]
        actualColors[2] = colors[2]
        break
    }

    return actualColors
  }

  _mapEdgeColors (colors, orientation) {
    const actualColors = [...colors]
    if (orientation) {
      actualColors.reverse()
    }
    return actualColors
  }

  _parseCubeValue (value) {
    const state = {
      cornerPositions: [],
      cornerOrientations: [],
      edgePositions: [],
      edgeOrientations: []
    }
    const moves = []
    for (let i = 0; i < value.byteLength; i++) {
      const move = value.getUint8(i)
      const highNibble = move >> 4
      const lowNibble = move & 0b1111
      if (i < 4) {
        state.cornerPositions.push(highNibble, lowNibble)
      } else if (i < 8) {
        state.cornerOrientations.push(highNibble, lowNibble)
      } else if (i < 14) {
        state.edgePositions.push(highNibble, lowNibble)
      } else if (i < 16) {
        state.edgeOrientations.push(!!(move & 0b10000000))
        state.edgeOrientations.push(!!(move & 0b01000000))
        state.edgeOrientations.push(!!(move & 0b00100000))
        state.edgeOrientations.push(!!(move & 0b00010000))
        if (i === 14) {
          state.edgeOrientations.push(!!(move & 0b00001000))
          state.edgeOrientations.push(!!(move & 0b00000100))
          state.edgeOrientations.push(!!(move & 0b00000010))
          state.edgeOrientations.push(!!(move & 0b00000001))
        }
      } else {
        moves.push(this._parseMove(highNibble, lowNibble))
      }
    }

    return {state, moves}
  }

  _parseMove (faceIndex, turnIndex) {
    const face = faces[faceIndex - 1]
    const amount = turns[turnIndex - 1]
    let notation = face

    switch (amount) {
      case 2: notation = `${face}2`; break
      case -1: notation = `${face}'`; break
      case -2: notation = `${face}2'`; break
    }

    return {face, amount, notation}
  }

  _onMove = (event) => {
    const value = event.target.value
    const {state: _state, moves} = this._parseCubeValue(value)
    this._state = _state
    super.onMove(moves[0])
  }

  async init () {
    const service = await this.getServerPrimaryService(SERVICE_UUID)
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID)
    await characteristic.startNotifications()
    characteristic.addEventListener('characteristicvaluechanged', this._onMove)

    const value = await characteristic.readValue()
    const _state = this._parseCubeValue(value).state

    this._systemService = await this.getServerPrimaryService(SYSTEM_SERVICE_UUID)
    this._state = _state

    this.getBatteryLevel()
    setTimeout(() => {
      this.onLoaded(true)
    }, 100)
  }
}

const match = name => /^Gi[CS]/.test(name || '')

const filters = [
  { namePrefix: 'GiC' },
  { namePrefix: 'GiS' }
]

const services = [SERVICE_UUID, SYSTEM_SERVICE_UUID]

Giiker.filters = filters
Giiker.services = services
Giiker.match = match
