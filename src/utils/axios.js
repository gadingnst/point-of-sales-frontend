import axios from 'axios'

let auth, token

try {
    auth = JSON.parse(window.localStorage.getItem('persist:root')).auth
    token = JSON.parse(auth).token
} catch (err) {
    token = null
}

console.log(token)

export default axios.create({
    baseURL: process.env.REACT_APP_API_BASEURL || 'http://localhost:9600',
    headers: {
        authorization: `Bearer ${token}`
    }
})