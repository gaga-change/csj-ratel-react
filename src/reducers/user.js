const KEY = 'STORE_USER'
const user = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      cahce(action.user)
      return action.user
    default:
      return cahce()
  }
}

function cahce(user) {
  if (user) {
    localStorage.setItem(KEY, JSON.stringify(user))
  } else {
    let temp = localStorage.getItem(KEY)
    try {
      let obj = JSON.parse(temp)
      return obj
    } catch (err) {
      localStorage.removeItem(KEY)
      return null
    }
  }
}

export default user
