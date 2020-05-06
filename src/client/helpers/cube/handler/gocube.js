import Cube from './base'

const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
const CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
const CHARACTERISTIC_WRITE_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'

const WRITE_BATTERY = 50
const WRITE_STATE = 51

export default class GoCube extends Cube {
  constructor (...args) {
    super(...args)
    this._systemService = null
    this._state = null
    this.init()
  }

  getBatteryLevel = async () => {
    if (this.connected) {
      await this._systemService.writeValue(new Uint8Array([WRITE_BATTERY]).buffer)
      setTimeout(() => {
        this.getBatteryLevel()
      }, 60000)
    } else {
      setTimeout(() => {
        this.getBatteryLevel()
      }, 60000)
    }
  }

  get stateString () {
    return this._state
  }

  _onMove = (event) => {
    const value = event.target.value

    if (value.byteLength < 4) return

    if (
      value.getUint8(0) != 0x2a ||
			value.getUint8(value.byteLength - 2) != 0x0d ||
      value.getUint8(value.byteLength - 1) != 0x0a
    ) {
      return
    }

    const msgType = value.getUint8(2)
    const msgLen = value.byteLength - 4
    switch (msgType) {
      case 1: // Move
        const moves = Array.from({ length: msgLen / 2 }, (v, idx) => {
          const charPos = (idx * 2) + 3
          const axis = "BFUDRL".charAt(value.getUint8(charPos) >> 1)
          if (axis) {
            const power = [1, -1][value.getUint8(charPos) & 1]
            const notation = `${axis}${power === 1 ? '' : "'"}`
            return {
              axis,
              power,
              notation
            }
          }
        }).filter(data => data).forEach(data => {
          super.onMove(data)
        })
        break
      case 2: // State
        const facelet = []

        const axisPerm = [5, 2, 0, 3, 1, 4];
        const facePerm = [0, 1, 2, 5, 8, 7, 6, 3];
        const faceOffset = [0, 0, 6, 2, 0, 0];

        for (let a = 0; a < 6; a++) {
					const axis = axisPerm[a] * 9;
					const aoff = faceOffset[a];
					facelet[axis + 4] = "BFUDRL".charAt(value.getUint8(3 + a * 9));
					for (let i = 0; i < 8; i++) {
						facelet[axis + facePerm[(i + aoff) % 8]] = "BFUDRL".charAt(value.getUint8(3 + a * 9 + i + 1));
					}
				}
        const newFacelet = facelet.join('');
        this._state = newFacelet

        this.onLoaded(true)
        break
      case 3: // Quaternion
        break
      case 5: // Battery
        const battery = value.getUint8(3)
        if (battery !== this.battery) {
          this.battery = battery
          this.onBatteryLevelChanged(battery)
        }
        break
      case 7: // Offline status
        break
      case 8: // Cube type
        break
    }
    return
  }

  async init () {
    const service = await this.getServerPrimaryService(SERVICE_UUID)
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID)

    characteristic.addEventListener('characteristicvaluechanged', this._onMove)
    await characteristic.startNotifications()

    this._systemService = await service.getCharacteristic(CHARACTERISTIC_WRITE_UUID)

    await this._systemService.writeValue(new Uint8Array([WRITE_STATE]).buffer)

    this.getBatteryLevel()
  }
}

const match = name => /^GoCube/.test(name || '')

const filters = [
  { namePrefix: 'GoCube' }
]

const services = [SERVICE_UUID]

GoCube.filters = filters
GoCube.services = services
GoCube.match = match
