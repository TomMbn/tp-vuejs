# Projet FrontEnd

A l'issue de ce module, l'apprenant sera à même d'utiliser une technologie Javascript pour réaliser une application côté front-end. La notion de modèle MVVM doit être connu et il doit maitriser un des principaux frameworks Front-end JavaScript du marché. Le projet doit être livré en production.

## Critères d'évaluation

| Description | barème |  fait |
|:---|----:|----:|
| maquettage | 1,5 | ✔ |
| framework CSS                                                | 1 | ✔ |
| utilisation d'une plateforme de versionning (git)            | 1| ✔ |
| API GET : création d'une page d'affichage de donnée           |0,5| ✔ |
|   API  POST & PUT : création d'un formulaire pour utiliser l'API       |1| ✔ |
|   API DELETE : rendre la possibilité de supprimer un seul élément|0,5| ✔ |
| création d'un composants personnalisés                      | 1| ✔ |
| utilisation du local Storage (gestion du token JWT par exemple)                                | 1| ✔ |
| réalisation de tests unitaires (via un framework )           | 1,5| ✔ |
| formulaire multi etape                                       | 1| ✔ |
| transition                                                   | 1| ✔ |
| site web responsive                                          | 1,5| ✔ |
| Le design du site                                            | 1,5| ✔ |
| mise en prod d'une version optimiser pour la prod            | 3| ✔ |
| présentation du projet                                       | 2| ❌ |

L'évaluation se fera durant une présentation de 12 minutes avec un retour de 8 minutes par le jury composé de Clément et Swann.

## BONUS

Des points bonus peuvent être ajoutés pour l'ajout de fonctionnalités intéréssantes dont voici quelques exemples :

* mise en place intégration et déploiement continue
* utilisation d'une bibliothèque de composant  
* utilisation de docker
* rendre le site traductible

# Présentation Détaillée du Projet KliK

## 1. Introduction

KliK est une application web moderne de gestion de produits, développée avec Vue.js 3. L'application permet aux utilisateurs de :
- Se connecter de manière sécurisée
- Consulter une liste de produits
- Ajouter, modifier et supprimer des produits
- Naviguer de manière intuitive sur différentes tailles d'écran

### Stack Technique
- **Vue.js 3** : Framework moderne avec l'API de Composition
- **Tailwind CSS** : Framework CSS utilitaire pour un design responsive et moderne
- **Pinia** : Gestion d'état
- **Vue Router** : Gestion des routes
- **Vitest** : Framework de test

### Pourquoi Pinia ?
Le choix de Pinia comme gestionnaire d'état s'est fait pour plusieurs raisons :

1. **Intégration Native avec Vue 3**
   - Solution officiellement recommandée par l'équipe Vue.js
   - Meilleure performance que Vuex
   - Support natif de TypeScript

2. **Architecture Modulaire**
   - Stores indépendants et réutilisables
   - Meilleure organisation du code
   - Plus facile à maintenir et à tester

3. **Gestion de l'Authentification**
   - Stockage sécurisé du token JWT
   - Gestion de l'état d'authentification
   - Persistance des données via localStorage

## 2. Architecture et Structure

### Organisation du Projet
```
src/
├── api/          # Configuration et services API
├── assets/       # Ressources statiques
├── components/   # Composants réutilisables
├── router/       # Configuration des routes
├── stores/       # Gestion d'état avec Pinia
├── views/        # Pages de l'application
├── __tests__/    # Tests unitaires
├── App.vue       # Composant racine
└── main.js       # Point d'entrée
```

### Pattern MVVM avec Vue.js
- **Model** : Stores Pinia et API
- **View** : Composants Vue et templates
- **ViewModel** : Logique de présentation dans les composants

## 3. Fonctionnalités Principales

### Authentification et Sécurité
- Système de login/logout
- Gestion du token JWT
- Protection des routes

### Gestion des Produits
- API GET : Affichage de la liste des produits
- API POST/PUT : Formulaire d'ajout/modification
- API DELETE : Suppression de produits
- Composants personnalisés

### Interface Utilisateur
- Design responsive avec Tailwind CSS
- Transitions et animations
- Menu mobile/desktop
- Formulaire multi-étapes

### Navigation et Design Responsive
Le composant principal `App.vue` gère la navigation responsive avec un menu adaptatif pour mobile et desktop. Il inclut également des transitions de page pour une meilleure expérience utilisateur.

```vue
<!-- Navigation responsive -->
<nav v-if="authStore.isAuthenticated" class="bg-gray-800 w-full">
  <!-- Menu desktop -->
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

  <!-- Menu mobile -->
  <div class="md:hidden">
    <button
      @click="mobileMenuOpen = !mobileMenuOpen"
      class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
    >
      <span class="sr-only">Menu</span>
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
</nav>

<!-- Transitions de page -->
<router-view v-slot="{ Component }">
  <transition name="page" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
```

### Gestion des Produits
Le composant `ProductsView.vue` implémente la logique de gestion des produits avec pagination, filtres et gestion des erreurs. Il utilise l'API de Composition de Vue 3 pour une meilleure organisation du code.

```javascript
// Gestion de l'état des produits
const products = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const ITEMS_PER_PAGE = 25

// Filtres et tri
const filters = ref({
  type: '',
  marque: ''
})

// Récupération des produits
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await axiosInstance.get('/products')
    products.value = response.data
  } catch (err) {
    error.value = 'Erreur lors du chargement des produits'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / ITEMS_PER_PAGE)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return filteredProducts.value.slice(start, end)
})
```

### Gestion de l'Authentification
Le store Pinia `auth.js` gère l'authentification des utilisateurs, incluant le stockage sécurisé du token JWT et la persistance de l'état de connexion. Il utilise le localStorage pour maintenir la session utilisateur.

```javascript
// Store Pinia pour l'authentification
export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('token')
    let user = null
    
    if (token) {
      try {
        user = jwtDecode(token)
      } catch (error) {
        console.error('Error decoding token:', error)
        localStorage.removeItem('token')
      }
    }
    
    return {
      token,
      user
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role
  },

  actions: {
    async login(email, password) {
      try {
        const response = await axiosInstance.post('/auth/login', {
          email,
          mot_de_passe: password
        })
        
        const { token } = response.data
        this.token = token
        localStorage.setItem('token', token)
        this.user = jwtDecode(token)
        
        return true
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})
```

### Gestion du Panier
Le store Pinia `cart.js` implémente la logique du panier d'achat avec des fonctionnalités d'ajout, suppression et mise à jour des quantités. Il calcule automatiquement le total et le nombre d'articles.

```javascript
// Store Pinia pour la gestion du panier
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0
  }),

  getters: {
    cartTotal: (state) => {
      return state.items.reduce((total, item) => total + (item.prix * item.quantity), 0)
    },
    itemCount: (state) => {
      return state.items.reduce((count, item) => count + item.quantity, 0)
    }
  },

  actions: {
    addToCart(product, quantity = 1) {
      const existingItem = this.items.find(item => item.id_produit === product.id_produit)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({
          ...product,
          quantity
        })
      }
    },

    removeFromCart(productId) {
      const index = this.items.findIndex(item => item.id_produit === productId)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id_produit === productId)
      if (item) {
        item.quantity = Math.max(0, quantity)
        if (item.quantity === 0) {
          this.removeFromCart(productId)
        }
      }
    },

    clearCart() {
      this.items = []
    }
  }
})
```

### Tests Unitaires
Les tests unitaires dans `App.test.js` vérifient le bon fonctionnement de l'application, notamment la navigation et l'authentification. Ils utilisent Vitest et Vue Test Utils pour simuler les interactions utilisateur.

```javascript
// Configuration des tests
describe('App.vue', () => {
  let pinia
  let authStore

  beforeEach(() => {
    // Réinitialisation des mocks
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('fake-token')
    
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()
  })

  // Test de l'affichage de la navigation pour un utilisateur authentifié
  it('renders navigation when authenticated', async () => {
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

  // Test de l'affichage de la page de login pour un utilisateur non authentifié
  it('shows login page without navigation', async () => {
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
})
```

## 5. Optimisation et Production

### Build de Production
- Minification du code
- Optimisation des assets
- Variables d'environnement

### Déploiement Automatisé
- GitHub Actions
- Déploiement sur VPS
- Intégration continue

### Configuration du Déploiement

1. **Workflow GitHub Actions**
Le fichier `.github/workflows/deploy.yml` définit le pipeline CI/CD qui automatise le déploiement de l'application sur le VPS. Il gère la construction et le déploiement des fichiers à chaque push sur la branche main.

```yaml
# Nom du workflow
name: Deploy Vue.js to VPS

# Déclenchement du workflow sur push vers main
on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    # Étape 1: Récupération du code source
    - name: Checkout repository
      uses: actions/checkout@v3

    # Étape 2: Installation de Node.js et des dépendances
    - name: Install Node and dependencies
      uses: actions/setup-node@v3
      with:
        node-version: '20'

    # Étape 3: Installation des dépendances et build
    - name: Install dependencies and build
      run: |
        npm install
        npm run build

    # Étape 4: Déploiement sur le VPS via SCP
    - name: Deploy to VPS via SCP
      uses: appleboy/scp-action@v0.1.4
      with:
        host: ${{ secrets.VPS_HOST }}        # Hôte du serveur
        username: ${{ secrets.VPS_USER }}    # Utilisateur SSH
        key: ${{ secrets.SSH_PRIVATE_KEY }}  # Clé SSH privée
        source: "dist/*"                     # Fichiers à déployer
        target: ${{ secrets.VPS_PATH }}      # Destination sur le serveur
        strip_components: 1
        overwrite: true
```

2. **Configuration Vite**
Le fichier `vite.config.js` configure l'environnement de développement et de production, incluant les plugins Vue, les alias d'importation et la configuration du proxy pour l'API.

```javascript
// Import des dépendances nécessaires
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Configuration de Vite
export default defineConfig({
  // Plugins utilisés pour le développement
  plugins: [
    vue(),           // Plugin principal pour Vue.js
    vueDevTools(),   // Outils de développement Vue
  ],
  // Configuration des alias pour les imports
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // Configuration du serveur de développement
  server: {
    proxy: {
      '/v1': {
        target: 'http://tom.mauboussin.angers.mds-project.fr:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

Cette configuration assure :
- L'utilisation des plugins Vue et Vue DevTools
- La configuration des alias pour les imports
- La configuration du proxy pour l'API backend
- L'optimisation du développement

3. **Configuration du Serveur**
Pour le déploiement en production, il est recommandé de :
- Configurer un serveur web (Nginx ou Apache) pour servir les fichiers statiques
- Mettre en place un proxy pour l'API
- Configurer les en-têtes de sécurité appropriés
- Activer la compression gzip
- Configurer le cache des assets statiques

## Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build pour la production
npm run build

# Lancement des tests
npm test
```

## Configuration du Déploiement

Le déploiement est automatisé via GitHub Actions. Les secrets suivants doivent être configurés :
- `VPS_HOST` : Adresse du serveur
- `VPS_USER` : Utilisateur SSH
- `SSH_PRIVATE_KEY` : Clé SSH privée
- `VPS_PATH` : Chemin de déploiement

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request
