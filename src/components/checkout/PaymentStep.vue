<template>
  <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Informations de paiement</h3>
        <p class="mt-1 text-sm text-gray-500">
          Veuillez saisir vos informations de paiement en toute sécurité.
        </p>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <form @submit.prevent="submitForm">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Type de carte</label>
              <div class="mt-1 space-x-4">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="formData.cardType"
                    value="visa"
                    class="form-radio h-4 w-4 text-indigo-600"
                    required
                  />
                  <span class="ml-2">Visa</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="formData.cardType"
                    value="mastercard"
                    class="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span class="ml-2">Mastercard</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Numéro de carte</label>
              <input
                type="text"
                v-model="formData.cardNumber"
                pattern="[0-9]{16}"
                maxlength="16"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700">Date d'expiration</label>
                <input
                  type="text"
                  v-model="formData.expiryDate"
                  pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                  maxlength="5"
                  required
                  placeholder="MM/YY"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  v-model="formData.cvv"
                  pattern="[0-9]{3,4}"
                  maxlength="4"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="123"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Nom sur la carte</label>
              <input
                type="text"
                v-model="formData.cardholderName"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="JEAN DUPONT"
              />
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('back')"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retour
            </button>
            <button
              type="submit"
              class="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Payer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCheckoutStore } from '../../stores/checkout'

const checkoutStore = useCheckoutStore()
const emit = defineEmits(['submit', 'back'])

const formData = ref({
  cardType: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
})

onMounted(() => {
  // Charger les données sauvegardées si elles existent
  formData.value = { ...checkoutStore.paymentInfo }
})

const submitForm = () => {
  checkoutStore.setPaymentInfo(formData.value)
  emit('submit', formData.value)
}
</script> 