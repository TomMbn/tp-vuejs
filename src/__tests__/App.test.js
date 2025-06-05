import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'
import { useAuthStore } from '../stores/auth'

// Mock de jwt-decode
vi.mock('jwt-decode', () => ({
  default: () => ({ role: 'user' })
}))

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock des routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: { template: '<div>Home</div>' }
  },
  {
    path: '/login',
    name: 'login',
    component: { template: '<div>Login</div>' }
  },
  {
    path: '/products',
    name: 'products',
    component: { template: '<div>Products</div>' }
  }
]

// Création du router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Configuration du test
describe('App.vue', () => {
  let pinia
  let authStore

  beforeEach(() => {
    // Réinitialiser les mocks
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('fake-token')
    
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()
  })

  it('renders navigation when authenticated', async () => {
    // Simuler un utilisateur authentifié
    authStore.token = 'fake-token'
    authStore.user = { role: 'user' }

    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'router-link': true,
          'router-view': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('nav').exists()).toBe(true)
  })

  it('shows login page without navigation', async () => {
    // Simuler un utilisateur non authentifié
    authStore.token = null
    authStore.user = null

    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'router-link': true,
          'router-view': true
        }
      }
    })

    await router.push('/login')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('toggles mobile menu when button is clicked', async () => {
    // Simuler un utilisateur authentifié
    authStore.token = 'fake-token'
    authStore.user = { role: 'user' }

    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'router-link': true,
          'router-view': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    
    // Trouver le bouton du menu mobile en utilisant la classe spécifique
    const mobileMenuButton = wrapper.find('button.inline-flex.items-center.justify-center.p-2')
    expect(mobileMenuButton.exists()).toBe(true)

    // Vérifier l'état initial
    expect(wrapper.vm.mobileMenuOpen).toBe(false)

    // Cliquer sur le bouton
    await mobileMenuButton.trigger('click')

    // Vérifier que le menu est ouvert
    expect(wrapper.vm.mobileMenuOpen).toBe(true)
  })
}) 