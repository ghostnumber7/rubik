import cubes, { filters, services } from './handler'

export default class Cube {
  constructor (device, api) {
    this.device = device
    this.name = device.name
    this.api = api
    this.cube = null
    return this.init()
  }

  init () {
    const Cube = cubes.find(cube => cube.match(this.name))
    if (Cube) {
      return new Cube(this.device, this.api)
    } else {
      this.api.disconnect()
      throw new Error('Invalid Cube')
    }
  }
}

export { filters, services }
