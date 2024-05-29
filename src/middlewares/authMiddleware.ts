import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function authMiddleware (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const isAuthenticated = !!localStorage.getItem('authToken')

  if (isAuthenticated && to.name === 'Login') {
    next({ name: 'Home' })
  } else if (!isAuthenticated && to.meta.requiresAuth) {
    next({ name: 'Login' })
  } else {
    next()
  }
}
