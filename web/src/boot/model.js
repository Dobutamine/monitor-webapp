import { ModelInterface } from 'app/public/modelInterface'

// eslint-disable-next-line prefer-const
let modelInterface = new ModelInterface()

export default ({ Vue }) => {
  Vue.prototype.$model = modelInterface
}

export { modelInterface as model }
