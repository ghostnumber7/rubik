import { EventEmitter } from 'events'
import AppError from 'Helper/error'
import * as Bluetooth from 'react-bluetooth'

const Events = {
  CONNECTED: Symbol.for('bluetooth.connected'),
  DISCONNECTED: Symbol.for('bluetooth.disconnected'),
  ERROR: Symbol.for('bluetooth.error')
}

const Errors = {
  NOT_AVAILABLE: Symbol.for('bluetooth.error.not_available'),
  CANCELLED: Symbol.for('bluetooth.error.cancelled'),
  OTHER: Symbol.for('bluetooth.error.other')
}

export default class BluetoothEmitter extends EventEmitter {
  constructor (...args) {
    super(...args)
    this.device = null
    this.server = null
    this.name = null
    this.id = null
    this.gatt = null
    this.connected = false
    this.canReconnect = false
  }

  get _data () {
    const {
      device, server, name, id, gatt, connected, canReconnect
    } = this

    return {
      device, server, name, id, gatt, connected, canReconnect
    }
  }

  emit (event, ...args) {
    if (event === Events.ERROR) {
      return super.emit(event, new AppError(...args))
    }
    return super.emit(event, ...args)
  }

  async connect ({ filters, services }) {
    const options = {
      filters, optionalServices: services
    }
    console.log(options)
    try {
      if (await Bluetooth.getAvailabilityAsync() && !this.connected) {
        const result = await Bluetooth.requestDeviceAsync(options)

        if (result.type === 'cancel') {
          this.emit(Events.ERROR, 'Bluetooth Pareing cancelled by user', Errors.CANCELLED)
          return
        }

        const device = result.device

        this.device = device
        this.name = device.name
        this.id = device.id

        if (device.gatt) {
          const server = await device.gatt.connect()
          this.server = server
          this.gatt = device.gatt
          this.connected = true
        }
        device.addEventListener('gattserverdisconnected', this._onDisconnected.bind(this))
        this.emit(Events.CONNECTED, this._data)
      } else {
        this.emit(Events.ERROR, 'Bluetooth service not available', Errors.NOT_AVAILABLE)
      }
    } catch ({ message, code }) {
      this.emit(Events.ERROR, message, Errors.OTHER)
    }
  }

  async reconnect () {
    try {
      await this.gatt.connect()
      this.connected = true
      this.canReconnect = null
      this.emit(Events.CONNECTED, this._data)
    } catch (err) {
      this.emit(Events.ERROR, err, Errors.OTHER)
    }
  }

  async disconnect () {
    try {
      await this.gatt.disconnect()
      this.device = null
      this.server = null
      this.name = null
      this.id = null
      this.gatt = null
      this.connected = false
      this.canReconnect = false
      this.emit(Events.DISCONNECTED, this._data)
    } catch (err) {
      this.emit(Events.ERROR, err, Errors.OTHER)
    }
  }

  _onDisconnected () {
    if (this.connected) {
      this.connected = false
      this.canReconnect = true
      this.emit(Events.DISCONNECTED, this._data)
    }
  }

  getServerPrimaryService = (...opt) => this.server.getPrimaryService(...opt)

}

BluetoothEmitter.Events = BluetoothEmitter.prototype.Events = Events
BluetoothEmitter.Errors = BluetoothEmitter.prototype.Errors = Errors

export {
  Events, Errors
}
