<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()
const isOpen = ref(false)

const updateQuantity = (productId, quantity) => {
  cartStore.updateQuantity(productId, quantity)
}

const removeFromCart = (productId) => {
  cartStore.removeFromCart(productId)
}

const checkout = () => {
  isOpen.value = false
  router.push('/checkout')
}
</script>

<template>
  <div class="relative">
    <!-- Cart Button -->
    <button
      @click="isOpen = !isOpen"
      class="relative p-2 text-gray-400 hover:text-gray-500"
    >
      <span class="sr-only">Panier</span>
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
        {{ cartStore.itemCount }}
      </span>
    </button>

    <!-- Cart Panel -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg z-50"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Panier</h2>
          <button
            @click="isOpen = false"
            class="text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">Fermer</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div v-if="cartStore.items.length === 0" class="text-center py-8">
          <p class="text-gray-500">Votre panier est vide</p>
        </div>

        <div v-else>
          <ul class="divide-y divide-gray-200">
            <li v-for="item in cartStore.items" :key="item.id_produit" class="py-4 flex">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">{{ item.nom_modele }}</h3>
                <p class="text-sm text-gray-500">{{ item.marque }}</p>
                <div class="flex items-center mt-2">
                  <button
                    @click="updateQuantity(item.id_produit, item.quantity - 1)"
                    class="text-gray-500 hover:text-gray-600"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="mx-2 text-gray-600">{{ item.quantity }}</span>
                  <button
                    @click="updateQuantity(item.id_produit, item.quantity + 1)"
                    class="text-gray-500 hover:text-gray-600"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="ml-4 flex flex-col items-end">
                <p class="text-sm font-medium text-gray-900">{{ (item.prix * item.quantity).toFixed(2) }}€</p>
                <button
                  @click="removeFromCart(item.id_produit)"
                  class="text-sm text-red-600 hover:text-red-500 mt-2"
                >
                  Supprimer
                </button>
              </div>
            </li>
          </ul>

          <div class="mt-4 border-t border-gray-200 pt-4">
            <div class="flex justify-between text-base font-medium text-gray-900">
              <p>Total</p>
              <p>{{ cartStore.cartTotal.toFixed(2) }}€</p>
            </div>
            <div class="mt-6">
              <button
                @click="checkout"
                class="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Commander
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 