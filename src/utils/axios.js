import axios from 'axios'

const { auth } = JSON.parse(window.localStorage.getItem('persist:root')) || {}
const { token } = JSON.parse(auth) || null

export default axios.create({
    baseURL: process.env.REACT_APP_API_BASEURL || 'http://localhost:9600',
    headers: {
        authorization: `Bearer ${token}`
    }
})