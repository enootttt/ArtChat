import Welcome from './index.vue'

export type * from './interface'

type WelcomeType = typeof Welcome

export default Welcome as WelcomeType
