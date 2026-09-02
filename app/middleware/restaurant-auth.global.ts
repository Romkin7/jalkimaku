export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/restaurant/') || to.path === '/restaurant/login') return

  const { error } = await useFetch('/api/auth/check')
  if (error.value?.statusCode === 401) {
    return navigateTo('/restaurant/login')
  }
})
