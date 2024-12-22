import Cookies from 'js-cookie'

const TokenKey = 'authorization'
const SessionKey = 'authorization'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getSession() {
  return Cookies.get(SessionKey)
}

export function setSession(session) {
  return Cookies.set(SessionKey, session)
}

export function removeSession() {
  return Cookies.remove(SessionKey)
}
