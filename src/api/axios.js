import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/v1'
})

// Add a request interceptor to add the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance 