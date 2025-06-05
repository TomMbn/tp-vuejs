# Projet FrontEnd

A l'issue de ce module, l'apprenant sera à même d'utiliser une technologie Javascript pour réaliser une application côté front-end. La notion de modèle MVVM doit être connu et il doit maitriser un des principaux frameworks Front-end JavaScript du marché. Le projet doit être livré en production.

## Critères d'évaluation

| Description | barème |  fait |
|:---|----:|----:|
| maquettage | 1,5 | ❌ |
| framework CSS                                                | 1 | ✔ |
| utilisation d'une plateforme de versionning (git)            | 1| ✔ |
| API GET : création d'une page d'affichage de donnée           |0,5| ✔ |
|   API  POST & PUT : création d'un formulaire pour utiliser l'API       |1| ✔ |
|   API DELETE : rendre la possibilité de supprimer un seul élément|0,5| ✔ |
| création d'un composants personnalisés                      | 1| ✔ |
| utilisation du local Storage (gestion du token JWT par exemple)                                | 1| ✔ |
| réalisation de tests unitaires (via un framework )           | 1,5| ❌ |
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

### Séparation Front/Back Office
La gestion des accès et des rôles est implémentée de la manière suivante :

1. **Gestion des Rôles** (`src/stores/auth.js`)
```javascript
// Gestion du token et des informations utilisateur
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

// Getters pour vérifier l'authentification et le rôle
getters: {
  isAuthenticated: (state) => !!state.token,
  userRole: (state) => state.user?.role
}
```
- Le rôle de l'utilisateur est stocké dans le token JWT
- Accessible via le store d'authentification
- Différenciation entre administrateurs et clients

2. **Protection des Routes** (`src/router/index.js`)
```javascript
// Configuration des routes avec meta-données
const routes = [
  {
    path: '/products',
    name: 'products',
    component: ProductsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView,
    meta: { requiresAuth: true }
  }
]

// Navigation guard pour protéger les routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})
```
- Routes sensibles protégées avec `requiresAuth: true`
- Navigation guard pour vérifier l'authentification
- Redirection vers login si non authentifié

3. **Accès Conditionnel** (`src/App.vue`)
```javascript
// Dans le script
const authStore = useAuthStore()
const isLoginPage = computed(() => route.name === 'login')

// Dans le template
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
</nav>
```
- Interface adaptée selon le rôle de l'utilisateur
- Fonctionnalités spécifiques pour les administrateurs
- Restrictions d'accès pour les clients

4. **Gestion de l'Authentification** (`src/stores/auth.js`)
```javascript
// Actions pour gérer l'authentification
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
```
- Gestion sécurisée de la connexion
- Stockage du token JWT
- Déconnexion et nettoyage des données

Cette architecture permet une séparation claire entre les fonctionnalités accessibles aux clients et aux administrateurs, tout en maintenant une expérience utilisateur cohérente et sécurisée.

### Fonctionnalités Principales

1. **Gestion des Produits** (`src/views/ProductsView.vue`)
```javascript
// Gestion de l'état des produits
const products = ref([])
const loading = ref(false)
const error = ref(null)

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

// Suppression d'un produit
const deleteProduct = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    try {
      await axiosInstance.delete(`/products/${id}`)
      products.value = products.value.filter(p => p.id !== id)
    } catch (err) {
      error.value = 'Erreur lors de la suppression'
      console.error(err)
    }
  }
}
```

2. **Formulaire Multi-étapes** (`src/components/CheckoutForm.vue`)
```javascript
// Gestion des étapes du formulaire
const currentStep = ref(1)
const totalSteps = 3

// Validation des étapes
const validateStep = (step) => {
  switch(step) {
    case 1:
      return validatePersonalInfo()
    case 2:
      return validateShippingInfo()
    case 3:
      return validatePaymentInfo()
    default:
      return false
  }
}

// Navigation entre les étapes
const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

const prevStep = () => {
  currentStep.value--
}
```

3. **Design Responsive** (`src/App.vue`)
```html
<!-- Menu responsive -->
<nav class="bg-gray-800">
  <!-- Menu mobile -->
  <div class="md:hidden">
    <button @click="isMenuOpen = !isMenuOpen" class="mobile-menu-button">
      <span class="sr-only">Menu</span>
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>

  <!-- Menu desktop -->
  <div class="hidden md:block">
    <div class="ml-10 flex items-baseline space-x-4">
      <!-- Navigation items -->
    </div>
  </div>
</nav>
```

4. **Transitions et Animations**
```html
<!-- Dans App.vue -->
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

Les transitions sont utilisées pour :
- Animer les changements de pages avec un effet de fondu
- Gérer l'affichage/masquage du menu mobile
- Améliorer l'expérience utilisateur avec des animations fluides

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

1. **Workflow GitHub Actions** (`.github/workflows/deploy.yml`)
```yaml
name: Deploy Vue.js to VPS

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Install Node and dependencies
      uses: actions/setup-node@v3
      with:
        node-version: '20'

    - name: Install dependencies and build
      run: |
        npm install
        npm run build

    - name: Deploy to VPS via SCP
      uses: appleboy/scp-action@v0.1.4
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        source: "dist/*"
        target: ${{ secrets.VPS_PATH }}
        strip_components: 1
        overwrite: true
```

2. **Configuration Vite** (`vite.config.js`)
```javascript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
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
