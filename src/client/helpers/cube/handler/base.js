import { EventEmitter } from 'events'
import CubeJs from 'cubejs'

const Events = {
  LOADED: Symbol.for('cube.loaded'),
  BATTERY_LEVEL_CHANGED: Symbol.for('cube.battery_level_changed'),
  MOVED: Symbol.for('cube.moved'),
  ERROR: Symbol.for('cube.error')
}

const Errors = {
  NOT_AVAILABLE: Symbol.for('cube.error.not_available'),
  CANCELLED: Symbol.for('cube.error.cancelled'),
  OTHER: Symbol.for('cube.error.other')
}

export default class Cube extends EventEmitter {
  constructor (device, api) {
    super()
    this.device = device
    this.name = device.name
    this.battery = null
    this.loaded = false
    this._api = api
    this._cube = null
    this.connected = api.connected || false
    api.on(api.Events.CONNECTED, this.onConnected)
    api.on(api.Events.DISCONNECTED, this.onDisconnected)
  }

  onConnected = () => {
    this.connected = true
  }

  onDisconnected = () => {
    this.connected = false
  }

  getServerPrimaryService = (...opt) => this._api.getServerPrimaryService(...opt)

  onLoaded (isLoaded) {
    this.loaded = isLoaded
    console.log(this.stateString)
    this._cube = CubeJs.fromString(this.stateString)
    this.emit(Events.LOADED, this._cube)
  }

  get solved () {
    return this._cube ? this._cube.isSolved() : false
  }

  get currentState () {
    return this._cube ? this._cube.asString() : null
  }

  onMove (move) {
    if (this.loaded) {
      this._cube.move(move.notation)
      console.log(this._cube.asString())
      this.emit(Events.MOVED, move)
      console.log(move)
    }
  }

  onBatteryLevelChanged (level) {
    this.battery = level
    this.emit(Events.BATTERY_LEVEL_CHANGED, level)
  }
}

Cube.Events = Cube.prototype.Events = Events
Cube.Errors = Cube.prototype.Errors = Errors
