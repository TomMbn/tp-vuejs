import { defineStore } from 'pinia'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    shippingInfo: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      postalCode: '',
      city: ''
    },
    paymentInfo: {
      cardType: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    }
  }),

  actions: {
    setShippingInfo(info) {
      this.shippingInfo = info
    },

    setPaymentInfo(info) {
      this.paymentInfo = info
    },

    clearCheckoutData() {
      this.shippingInfo = {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        postalCode: '',
        city: ''
      }
      this.paymentInfo = {
        cardType: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'checkout',
        storage: sessionStorage // Utilisation de sessionStorage pour plus de sécurité
      }
    ]
  }
}) 