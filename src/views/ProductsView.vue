<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="flex flex-col space-y-4">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Produits</h1>
          <div class="flex items-center space-x-4">
            <ShoppingCart v-if="!isAdmin" />
            <button
              v-if="isAdmin"
              @click="openAddModal"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ajouter un produit
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Type de produit</label>
              <select
                v-model="filters.type"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Tous les types</option>
                <option v-for="type in availableTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <select
                v-model="filters.marque"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Toutes les marques</option>
                <option v-for="brand in availableBrands" :key="brand" :value="brand">
                  {{ brand }}
                </option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                @click="resetFilters"
                class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content states -->
      <div v-if="productStore.loading" class="text-center py-12">
        <div class="spinner"></div>
        <p class="mt-4 text-gray-500">Chargement des produits...</p>
      </div>

      <div v-else-if="productStore.error" class="text-center py-12">
        <p class="text-red-600">{{ productStore.error }}</p>
        <button
          @click="productStore.fetchProducts"
          class="mt-4 text-indigo-600 hover:text-indigo-500"
        >
          Réessayer
        </button>
      </div>

      <!-- Product list -->
      <div v-else class="mt-6">
        <!-- No results message -->
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <p class="text-gray-500">Aucun produit ne correspond aux filtres sélectionnés</p>
          <button
            @click="resetFilters"
            class="mt-4 text-indigo-600 hover:text-indigo-500"
          >
            Réinitialiser les filtres
          </button>
        </div>

        <!-- Products grid with pagination -->
        <div v-else>
          <!-- Products grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="product in paginatedProducts"
              :key="product.id_produit"
              class="bg-white overflow-hidden shadow rounded-lg flex flex-col"
            >
              <div class="p-6 flex-1">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ product.nom_modele }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ product.marque }}
                </p>
                <p class="mt-2 text-sm text-gray-900">
                  {{ product.description }}
                </p>
                <div class="mt-4">
                  <span class="text-xl font-bold text-gray-900">
                    {{ product.prix }}€
                  </span>
                  <span v-if="isAdmin" class="ml-2 text-sm text-gray-500">
                    Stock: {{ product.stock }}
                  </span>
                </div>
              </div>
              <div class="px-6 pb-6">
                <div class="flex space-x-3">
                  <template v-if="isAdmin">
                    <button
                      @click="editProduct(product)"
                      class="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Modifier
                    </button>
                    <button
                      @click="deleteProduct(product.id_produit)"
                      class="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Supprimer
                    </button>
                  </template>
                  <template v-else>
                    <button
                      @click="addToCart(product)"
                      :disabled="product.stock === 0"
                      class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {{ product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier' }}
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination controls -->
          <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div class="flex flex-1 justify-between sm:hidden">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                Précédent
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
              >
                Suivant
              </button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Affichage de
                  <span class="font-medium">{{ ((currentPage - 1) * ITEMS_PER_PAGE) + 1 }}</span>
                  à
                  <span class="font-medium">{{ Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length) }}</span>
                  sur
                  <span class="font-medium">{{ filteredProducts.length }}</span>
                  résultats
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                  >
                    <span class="sr-only">Précédent</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      page === currentPage
                        ? 'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                  >
                    <span class="sr-only">Suivant</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center" @click="handleClickOutside">
      <div ref="modalRef" class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            {{ editingProduct ? 'Modifier le produit' : 'Ajouter un produit' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span class="sr-only">Fermer</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Marque</label>
            <input
              v-model="productForm.marque"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Modèle</label>
            <input
              v-model="productForm.nom_modele"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="productForm.description"
              rows="3"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Prix</label>
            <input
              v-model.number="productForm.prix"
              type="number"
              step="0.01"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Stock</label>
            <input
              v-model.number="productForm.stock"
              type="number"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Fournisseur</label>
            <select
              v-model="productForm.id_fournisseur"
              required
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled selected>Sélectionnez un fournisseur</option>
              <option
                v-for="supplier in supplierStore.suppliers"
                :key="supplier.id_fournisseur"
                :value="supplier.id_fournisseur"
              >
                {{ supplier.fullName }}
              </option>
            </select>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {{ editingProduct ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vue core imports
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

// Store imports
import { useProductStore } from '../stores/products'
import { useSupplierStore } from '../stores/suppliers'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

// Component imports
import ShoppingCart from '../components/ShoppingCart.vue'

// Store instances
const productStore = useProductStore()
const supplierStore = useSupplierStore()
const authStore = useAuthStore()
const cartStore = useCartStore()

// Constants
const ITEMS_PER_PAGE = 25

// State management
const showAddModal = ref(false)
const editingProduct = ref(null)
const modalRef = ref(null)
const currentPage = ref(1)

const productForm = ref({
  id_produit: null,
  marque: '',
  nom_modele: '',
  description: '',
  type: '',
  prix: 0,
  stock: 0,
  id_fournisseur: ''
})

const filters = ref({
  type: '',
  marque: ''
})

// Computed properties
const isAdmin = computed(() => authStore.userRole === 'admin')

const availableTypes = computed(() => {
  const types = new Set(productStore.products.map(p => p.type))
  return Array.from(types).filter(Boolean).sort()
})

const availableBrands = computed(() => {
  const brands = new Set(productStore.products.map(p => p.marque))
  return Array.from(brands).filter(Boolean).sort()
})

const filteredProducts = computed(() => {
  return productStore.products.filter(product => {
    const matchesType = !filters.value.type || product.type === filters.value.type
    const matchesBrand = !filters.value.marque || product.marque === filters.value.marque
    return matchesType && matchesBrand
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / ITEMS_PER_PAGE)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return filteredProducts.value.slice(start, end)
})

// Methods - Form handling
const resetForm = () => {
  productForm.value = {
    id_produit: null,
    marque: '',
    nom_modele: '',
    description: '',
    type: '',
    prix: 0,
    stock: 0,
    id_fournisseur: ''
  }
  editingProduct.value = null
}

const handleSubmit = async () => {
  try {
    const formData = {
      ...productForm.value,
      id_fournisseur: parseInt(productForm.value.id_fournisseur, 10)
    }
    
    if (editingProduct.value) {
      await productStore.updateProduct(formData.id_produit, formData)
    } else {
      await productStore.createProduct(formData)
    }
    showAddModal.value = false
    resetForm()
    await productStore.fetchProducts()
  } catch (error) {
    console.error('Error submitting product:', error)
    productStore.error = error.message || 'Une erreur est survenue lors de la soumission du produit'
  }
}

// Methods - Modal handling
const openAddModal = () => {
  resetForm()
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  resetForm()
}

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    closeModal()
  }
}

const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && showAddModal.value) {
    closeModal()
  }
}

// Methods - Product operations
const editProduct = (product) => {
  editingProduct.value = product
  productForm.value = {
    id_produit: product.id_produit,
    marque: product.marque,
    nom_modele: product.nom_modele,
    description: product.description,
    prix: product.prix,
    stock: product.stock,
    type: product.type,
    id_fournisseur: product.id_fournisseur || ''
  }
  showAddModal.value = true
}

const deleteProduct = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    try {
      await productStore.deleteProduct(id)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }
}

const addToCart = (product) => {
  cartStore.addToCart(product)
}

// Methods - Filtering and pagination
const resetFilters = () => {
  filters.value = {
    type: '',
    marque: ''
  }
  currentPage.value = 1
}

const goToPage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const previousPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
  Promise.all([
    productStore.fetchProducts(),
    supplierStore.fetchSuppliers()
  ]).catch(error => {
    console.error('Error loading data:', error)
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
})

// Watchers
watch(filters, () => {
  currentPage.value = 1
})
</script>

<style scoped>
/* Spinner animation */
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #4f46e5;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 