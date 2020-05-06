import React from 'react'
import * as Bluetooth from 'react-bluetooth'
import bluetoothFilters, { cubes } from './cubes/index.js'
import { mapContextToProps } from 'Context'

class BluetoothWrapper extends React.PureComponent {
  constructor (props) {
    console.log('*** constructor props', props)
    super(props)
    this.state = {
      battery: null,
      device: null,
      server: null,
      name: null,
      connected: false,
      gatt: null
    }
  }

  async disconnect () {
    try {
      await this.state.gatt.disconnect()
      this.setState({
        connected: false
      })
    } catch (err) {
      console.log('disconnect error', err)
    }
  }

  async reconnect () {
    try {
      await this.state.gatt.connect()
      this.setState({
        connected: true
      })
    } catch (err) {
      console.log('reconnect error', err)
    }
  }

  async connect () {
    try {
      if (await Bluetooth.getAvailabilityAsync()) {
        // const options = {
        //   acceptAllDevices: true,
        //   // filters: [
        //   //   { services: Object.keys(GiCube.filter) },
        //   //   { services: Object.keys(GoCube.filter) }
        //   // ],
        //   optionalServices: [
        //     ...(Object.values(GiCube.service)),
        //     ...(Object.keys(GiCube.filter)),
        //     ...(Object.values(GoCube.service)),
        //     ...(Object.keys(GoCube.filter))
        //   ]
        // }

        const result = await Bluetooth.requestDeviceAsync(bluetoothFilters)

        if (result.type === 'cancel') {
          return
        }

        const device = result.device

        const newState = {
          device
        }

        newState.name = device.name

        if (device.gatt) {
          const server = await device.gatt.connect()
          newState.server = server
          newState.gatt = device.gatt
          newState.connected = true

        //   const services = await server.getPrimaryServices()
        //   console.log(`Bluetooth: Got service:`, services)

        //   const info = {}

        //   const config = services.map(service => {
        //     if (GiCube.filter[service.uuid]) {
        //       return GiCube
        //     }
        //     if (GoCube.filter[service.uuid]) {
        //       return GoCube
        //     }
        //   }).find(v => v)

        //   if (!config) return device.gatt.disconnect()

        //   info.type = config.name
        //   info.config = config

        //   info.battery = await this.loadBattery(server, config)
        //   info.state = await this.loadState(server, config)

        //   this.setState(info)

        //   // await services.forEach(async service => {
        //   //   if (~config.serviceKeys.indexOf(service.uuid)) {
        //   //     const characteristics = await service.getCharacteristics()
        //   //     return console.log(characteristics)
        //   //     await characteristics.filter(characteristic => characteristic)
        //   //   }
        //   //   // console.log(`Bluetooth: Got characteristic:`, characteristic)
        //   // })
        //   console.log('DONE AWAIT')
        //   // const value = await characteristic.readValue()
        //   // console.log(`Bluetooth: Got value:`, value)
        //   // const battery = value.getUint8(0)
        //   // console.log(`Success: Got battery:`, battery)
        }
        this.setState(newState)
      } else {
        console.log('bluetooth not available')
      }
    } catch ({ message, code }) {
      console.log('Error:', message, code)
    }
  }

  onDisconnected () {
    this.setState({
      connected: false
    })
  }

  componentDidMount () {
    this._batteryInterval = setInterval(this.getBatteryLevel.bind(this), 10000)
  }

  componentWillMount () {
    clearInterval(this._batteryInterval)
  }

  getBatteryLevel = async () => {
    if (this._getBatteryLevel && this.state.connected) {
      const battery = await this._getBatteryLevel()
      if (!isNaN(Number(battery))) {
        this.setState({ battery })
      }
      console.log('*** battery level', battery)
    }
  }

  setBatteryGetter (fn) {
    if (this._getBatteryLevel !== fn) {
      this._getBatteryLevel = fn
      this.getBatteryLevel()
    }
  }

  render () {
    // console.log((this.state.state || []).map(n => String.fromCharCode(n + 48)).join('-'))
    return (
      <React.Fragment>
        {
          this.state.connected
            ? <button onClick={() => this.disconnect()}>DISCONNECT</button>
            : <React.Fragment>
                {
                  this.state.gatt ? <button onClick={() => this.reconnect()}>RECONNECT</button> : null
                }
                <button onClick={() => this.connect()}>CONNECT</button>
              </React.Fragment>
        }
        {
          this.state.connected
            ? <div>Battery: {this.state.battery !== null ? this.state.battery + '%' : 'unknown'}</div>
            : null
        }
        <div>
          {
            cubes.map((Cube, n) => (
              <Cube
                key={n}
                {...this.state}
                setBatteryGetter={this.setBatteryGetter.bind(this)}
                onDisconnected={this.onDisconnected.bind(this)}
              />
            ))
          }
        </div>
      </React.Fragment>
    )
  }
}

const contextMapper = context => ({
  set: context.set
})

export default mapContextToProps(contextMapper)(BluetoothWrapper)
