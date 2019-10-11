import { combineReducers } from 'redux'
import auth from './auth'
import cart from './cart'
import product from './product'

export default combineReducers({ auth, cart, product })