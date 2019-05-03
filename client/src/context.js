const { createContext } = require('react')

const Context = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  currentPin: null,
  pins: [],
})

export default Context
