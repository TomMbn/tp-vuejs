import { defineStore } from 'pinia'
import axiosInstance from '../api/axios'

export const useSupplierStore = defineStore('suppliers', {
  state: () => ({
    suppliers: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchSuppliers() {
      this.loading = true
      try {
        const response = await axiosInstance.get('/users/role/fournisseur')
        this.suppliers = response.data.map(supplier => ({
          ...supplier,
          id_fournisseur: supplier.id_user,
          fullName: `${supplier.nom} ${supplier.prenom}`
        }))
        return this.suppliers
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 