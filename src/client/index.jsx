import React from 'react'
import ReactDOM from 'react-dom'
import BluetoothButton from './components/BluetoothButton'
import BatteryStatus from './components/BatteryStatus'
import CubeRender from './components/Cube'
import Bluetooth from 'Helper/bluetooth'
import Cube, { filters, services } from 'Helper/cube'
import { Provider } from 'Context'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      bluetooth: new Bluetooth()
    }
  }

  componentDidMount () {
    this.state.bluetooth.on(this.state.bluetooth.Events.CONNECTED, this.onConnected)
    this.state.bluetooth.on(this.state.bluetooth.Events.DISCONNECTED, this.onDisonnected)
  }

  componentWillUnmount () {
    this.state.bluetooth.off(this.state.bluetooth.Events.CONNECTED, this.onConnected)
    this.state.bluetooth.off(this.state.bluetooth.Events.DISCONNECTED, this.onDisonnected)
  }

  onConnected = data => {
    const cube = new Cube(data, this.state.bluetooth)
    this.setState({
      cube
    })
  }

  onDisonnected = () => {
    this.setState({
      cube: null
    })
  }

  render () {
    return (
      <Provider {...this.state}>
        <div>
          Bluetooth: <BluetoothButton filters={filters} services={services}/>
        </div>
        <BatteryStatus />
        <div>
          <CubeRender />
        </div>
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
