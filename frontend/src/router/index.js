import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Views
import Landing from '@/views/Landing.vue'
import Auth from '@/views/Auth.vue'
import Home from '@/views/Home.vue'
import Camera from '@/views/Camera.vue'
import Recipes from '@/views/Recipes.vue'
import SavedRecipes from '@/views/SavedRecipes.vue'
import Profile from '@/views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
    meta: { requiresGuest: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: { requiresGuest: true }
  },
  {
    path: '/app',
    children: [
      {
        path: '',
        redirect: '/app/home'
      },
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
      },
      {
        path: 'camera',
        name: 'Camera',
        component: Camera,
        meta: { requiresAuth: true }
      },
      {
        path: 'recipes',
        name: 'Recipes',
        component: Recipes,
        meta: { requiresAuth: true }
      },
      {
        path: 'saved',
        name: 'SavedRecipes',
        component: SavedRecipes,
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/app/home')
  } else {
    next()
  }
})

export default router
