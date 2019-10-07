import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { createLogger } from 'redux-logger'
import promiseMiddleware from 'redux-promise-middleware'
import storage from 'redux-persist/lib/storage'
import rootReducers from './reducers'

const config = {
    key: 'root', storage
}

const reducers = persistReducer(config, rootReducers)
const store = createStore(reducers, applyMiddleware(createLogger(), promiseMiddleware))
const persistor = persistStore(store)

export default () => ({ store, persistor })