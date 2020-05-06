import React from 'react'
import bluetoothFilters from './cubes/index.js'
import { mapContextToProps } from 'Context'

class BluetoothButton extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      connected: false,
      canReconnect: null
    }
  }

  componentDidMount () {
    this.props.bluetooth.on(this.props.bluetooth.Events.CONNECTED, this.onConnected)
    this.props.bluetooth.on(this.props.bluetooth.Events.DISCONNECTED, this.onDisconnected)
  }

  componentWillUnmount () {
    this.props.bluetooth.off(this.props.bluetooth.Events.CONNECTED, this.onConnected)
    this.props.bluetooth.off(this.props.bluetooth.Events.DISCONNECTED, this.onDisconnected)
  }

  onConnected = data => {
    this.setState({
      connected: data.connected
    })
  }

  onDisconnected = data => {
    this.setState({
      connected: false,
      canReconnect: data.canReconnect
    })
  }

  disconnect = () => {
    this.props.bluetooth.disconnect()
  }

  connect = () => {
    const {
      filters, services
    } = this.props
    this.props.bluetooth.connect({ filters, services })
  }

  reconnect = () => {
    this.props.bluetooth.reconnect()
  }

  render () {
    return (
      <React.Fragment>
        {
          this.state.connected
          ? <button onClick={this.disconnect}>DISCONNECT</button>
          : <React.Fragment>
              <button onClick={this.connect}>CONNECT</button>
              {
                this.state.canReconnect
                  ? <button onClick={this.reconnect}>RE-CONNECT</button>
                  : null
              }
            </React.Fragment>
        }
      </React.Fragment>
    )
  }
}

const contextmapper = context => ({
  bluetooth: context.bluetooth
})

export default mapContextToProps(contextmapper)(BluetoothButton)
