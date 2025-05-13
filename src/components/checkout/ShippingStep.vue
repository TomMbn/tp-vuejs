<template>
  <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Informations de livraison</h3>
        <p class="mt-1 text-sm text-gray-500">
          Veuillez remplir vos informations de livraison.
        </p>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <form @submit.prevent="submitForm">
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-3">
              <label for="first-name" class="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                v-model="formData.firstName"
                id="first-name"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div class="col-span-6 sm:col-span-3">
              <label for="last-name" class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                v-model="formData.lastName"
                id="last-name"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div class="col-span-6">
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                v-model="formData.email"
                id="email"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div class="col-span-6">
              <label for="address" class="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                v-model="formData.address"
                id="address"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div class="col-span-6 sm:col-span-2">
              <label for="postal-code" class="block text-sm font-medium text-gray-700">Code postal</label>
              <input
                type="text"
                v-model="formData.postalCode"
                id="postal-code"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div class="col-span-6 sm:col-span-4">
              <label for="city" class="block text-sm font-medium text-gray-700">Ville</label>
              <input
                type="text"
                v-model="formData.city"
                id="city"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="$router.push('/products')"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retour
            </button>
            <button
              type="submit"
              class="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continuer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '../../stores/checkout'

const router = useRouter()
const checkoutStore = useCheckoutStore()
const emit = defineEmits(['submit'])

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  postalCode: '',
  city: ''
})

onMounted(() => {
  // Charger les données sauvegardées si elles existent
  formData.value = { ...checkoutStore.shippingInfo }
})

const submitForm = () => {
  checkoutStore.setShippingInfo(formData.value)
  emit('submit', formData.value)
}
</script> 