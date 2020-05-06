import Giiker, {
  filter as GiikerFilter,
  services as GiikerServices
} from './Giiker.jsx'

const options = {
  filters: [
    ...GiikerFilter
  ],
  optionalServices: [
    ...GiikerServices
  ]
}

export default options
const cubes = [
  Giiker
]

export { cubes }