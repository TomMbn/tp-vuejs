import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import axiosInstance from '../api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('token')
    let user = null
    
    if (token) {
      try {
        user = jwtDecode(token)
      } catch (error) {
        console.error('Error decoding token:', error)
        localStorage.removeItem('token')
      }
    }
    
    return {
      token,
      user
    }
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role
  },
  
  actions: {
    async login(email, password) {
      try {
        const response = await axiosInstance.post('/auth/login', {
          email,
          mot_de_passe: password
        })
        
        const { token } = response.data
        this.token = token
        localStorage.setItem('token', token)
        this.user = jwtDecode(token)
        
        return true
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },

    initializeFromToken() {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          this.token = token
          this.user = jwtDecode(token)
        } catch (error) {
          console.error('Error initializing from token:', error)
          this.logout()
        }
      }
    }
  }
}) 