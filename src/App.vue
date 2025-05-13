<script setup>
// Vue core imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Store imports
import { useAuthStore } from './stores/auth'

// Router and store instances
const router = useRouter()
const authStore = useAuthStore()

// State management
const mobileMenuOpen = ref(false)

// Methods
const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 w-full">
    <!-- Navigation -->
    <nav v-if="authStore.isAuthenticated" class="bg-gray-800 w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and desktop navigation -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <router-link to="/" class="text-white font-bold text-xl">
                KliK
              </router-link>
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <router-link
                  to="/products"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  active-class="bg-gray-900 text-white"
                >
                  Produits
                </router-link>
              </div>
            </div>
          </div>

          <!-- Desktop menu -->
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <button
                @click="logout"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
          
          <!-- Mobile menu button -->
          <div class="-mr-2 flex md:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span class="sr-only">Open main menu</span>
              <!-- Menu open: "hidden", Menu closed: "block" -->
              <svg
                :class="{'hidden': mobileMenuOpen, 'block': !mobileMenuOpen}"
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <!-- Menu open: "block", Menu closed: "hidden" -->
              <svg
                :class="{'block': mobileMenuOpen, 'hidden': !mobileMenuOpen}"
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div
        :class="{'block': mobileMenuOpen, 'hidden': !mobileMenuOpen}"
        class="md:hidden"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <router-link
            to="/products"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-gray-900 text-white"
            @click="mobileMenuOpen = false"
          >
            Produits
          </router-link>
          <button
            @click="logout(); mobileMenuOpen = false"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style>
/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
