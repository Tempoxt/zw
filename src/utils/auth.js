
const TokenKey = 'zw'
const auth = {
  getToken() {
    return sessionStorage.getItem(TokenKey)
  },
  setToken(token) {
    return sessionStorage.setItem(TokenKey, token)
  },
  removeToken() {
    return sessionStorage.removeItem(TokenKey)
  }
}

export default auth
