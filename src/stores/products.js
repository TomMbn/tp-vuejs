import { defineStore } from 'pinia'
import axiosInstance from '../api/axios'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        const response = await axiosInstance.get('/products')
        this.products = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createProduct(productData) {
      try {
        const response = await axiosInstance.post('/products', productData)
        this.products.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateProduct(id, productData) {
      try {
        console.log('Updating product with ID:', id, 'Data:', productData)
        const response = await axiosInstance.put(`/products/${id}`, productData)
        console.log('API Response:', response.data)
        
        // Ensure we have the updated data
        const updatedProduct = {
          ...productData,
          ...response.data,
          id_produit: id // Make sure we keep the ID
        }
        
        // Find and update the product in the array
        const index = this.products.findIndex(p => p.id_produit === id)
        console.log('Found product at index:', index)
        
        if (index !== -1) {
          // Update using Vue's reactivity
          this.products[index] = updatedProduct
          console.log('Updated products array:', this.products)
        } else {
          console.warn('Product not found in local state:', id)
          // If we can't find the product, refresh the whole list
          await this.fetchProducts()
        }
        
        return updatedProduct
      } catch (error) {
        console.error('Error updating product:', error)
        this.error = error.message
        throw error
      }
    },

    async deleteProduct(id) {
      try {
        await axiosInstance.delete(`/products/${id}`)
        this.products = this.products.filter(p => p.id_produit !== id)
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
}) 