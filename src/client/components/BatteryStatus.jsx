import React from 'react'
import { mapContextToProps } from 'Context'

class BatteryStatus extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      connected: false,
      battery: '--',
      cube: null,
      oldCube: null,
      shouldBindCube: false
    }
  }

  componentDidMount () {
    this.props.bluetooth.on(this.props.bluetooth.Events.CONNECTED, this.onConnected)
    this.props.bluetooth.on(this.props.bluetooth.Events.DISCONNECTED, this.onDisconnected)
  }

  componentWillUnmount () {
    this.props.bluetooth.off(this.props.bluetooth.Events.CONNECTED, this.onConnected)
    this.props.bluetooth.off(this.props.bluetooth.Events.DISCONNECTED, this.onDisconnected)
    if (this.state.cube) {
      this.unbindCube(this.state.cube)
    }
  }

  componentDidUpdate () {
    const {
      cube, oldCube, shouldBindCube
    } = this.state
    if (shouldBindCube) {
      if (oldCube) {
        this.unbindCube(oldCube)
      }
      if (cube) {
        this.bindCube(cube)
      }

      this.setState({
        shouldBindCube: false,
        oldCube: null
      })
    }
  }

  static getDerivedStateFromProps (props, state) {
    return props.cube !== state.cube ? {
      cube: props.cube,
      oldCube: state.cube,
      shouldBindCube: true
    } : null
  }

  bindCube (cube) {
    cube.on(cube.Events.BATTERY_LEVEL_CHANGED, this.onBatteryLevelChanged)
  }

  unbindCube (cube) {
    cube.off(cube.Events.BATTERY_LEVEL_CHANGED, this.onBatteryLevelChanged)
  }

  onBatteryLevelChanged = level => {
    this.setState({
      battery: level
    })
  }

  onConnected = data => {
    this.setState({
      connected: true
    })
  }

  onDisconnected = data => {
    this.setState({
      connected: false,
      battery: '--'
    })
  }

  render () {
    console.log('**** render', this.props)
    return (
      <React.Fragment>
        <div>
          Battery: {
            this.state.connected
              ? (this.state.battery) + '%'
              : '--'
          }
        </div>
      </React.Fragment>
    )
  }
}

const contextmapper = context => ({
  bluetooth: context.bluetooth,
  cube: context.cube
})

export default mapContextToProps(contextmapper)(BatteryStatus)
