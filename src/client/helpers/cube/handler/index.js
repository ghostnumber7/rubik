import Giiker from './giiker'
import GoCube from './gocube'

const cubes = [
  Giiker, GoCube
]

let filters = []
let services = []

cubes.forEach(cube => {
  filters.push(...cube.filters)
  services.push(...cube.services)
})

export default cubes
export {
  filters, services
}
