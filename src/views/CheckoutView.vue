<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

        <CheckoutSteps :steps="steps" :current-step="currentStep" />

        <!-- Cart Summary -->
        <div v-if="cartStore.items.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div class="px-4 py-5 sm:px-6">
            <h2 class="text-lg font-medium text-gray-900">Récapitulatif de votre panier</h2>
          </div>
          <div class="border-t border-gray-200">
            <ul class="divide-y divide-gray-200">
              <li v-for="item in cartStore.items" :key="item.id_produit" class="px-4 py-4">
                <div class="flex justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">{{ item.nom_modele }}</h3>
                    <p class="text-sm text-gray-500">{{ item.marque }}</p>
                    <p class="text-sm text-gray-500">Quantité: {{ item.quantity }}</p>
                  </div>
                  <p class="text-sm font-medium text-gray-900">{{ (item.prix * item.quantity).toFixed(2) }}€</p>
                </div>
              </li>
            </ul>
            <div class="px-4 py-4 bg-gray-50">
              <div class="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>{{ cartStore.cartTotal.toFixed(2) }}€</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Cart Message -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500">Votre panier est vide</p>
          <button
            @click="router.push('/products')"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retourner aux produits
          </button>
        </div>

        <!-- Steps Content -->
        <div v-if="cartStore.items.length > 0">
          <div v-if="currentStep === 1">
            <ShippingStep @submit="handleShippingSubmit" />
          </div>

          <div v-if="currentStep === 2">
            <PaymentStep @submit="handlePaymentSubmit" @back="currentStep = 1" />
          </div>

          <!-- Order Confirmation -->
          <div v-if="currentStep === 3" class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" stroke-width="2" stroke="currentColor" fill="none" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M32 18l-8 8-4-4" />
              </svg>
              <h2 class="mt-4 text-lg font-medium text-gray-900">Commande confirmée</h2>
              <p class="mt-2 text-sm text-gray-500">
                Merci pour votre commande ! Vous recevrez un email de confirmation dans quelques instants.
              </p>
              <div class="mt-6">
                <button
                  @click="finishOrder"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Retour à la boutique
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '../stores/checkout'
import CheckoutSteps from '../components/CheckoutSteps.vue'
import ShippingStep from '../components/checkout/ShippingStep.vue'
import PaymentStep from '../components/checkout/PaymentStep.vue'

const router = useRouter()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()
const currentStep = ref(1)

const steps = [
  { name: 'Livraison' },
  { name: 'Paiement' },
  { name: 'Confirmation' }
]

const orderData = ref({
  shipping: null,
  payment: null
})

onMounted(() => {
  if (cartStore.items.length === 0) {
    router.push('/products')
  }
})

const handleShippingSubmit = (data) => {
  orderData.value.shipping = data
  currentStep.value = 2
}

const handlePaymentSubmit = async (data) => {
  orderData.value.payment = data
  
  try {
    // Ici, vous pouvez ajouter la logique pour traiter le paiement avec votre backend
    console.log('Order data:', {
      items: cartStore.items,
      total: cartStore.cartTotal,
      ...orderData.value
    })
    
    currentStep.value = 3
  } catch (error) {
    console.error('Error processing payment:', error)
  }
}

const finishOrder = () => {
  cartStore.clearCart()
  checkoutStore.clearCheckoutData()
  router.push('/products')
}
</script> 