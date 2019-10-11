import axios from 'axios'

let auth, token

try {
    auth = JSON.parse(window.localStorage.getItem('persist:root')).auth
    token = JSON.parse(auth).token
} catch (err) {
    token = null
}

axios.defaults.baseURL = process.env.REACT_APP_API_BASEURL || 'http://localhost:9600'
axios.defaults.headers.common['authorization'] = `Bearer ${token}`

export default axios