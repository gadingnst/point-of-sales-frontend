import { combineReducers } from 'redux'
import auth from './auth'
import cart from './cart'

export default combineReducers({ auth, cart })