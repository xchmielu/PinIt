const { createContext } = require('react')

const Context = createContext({
    currentUser: null,
    isAuth: false
})

export default Context