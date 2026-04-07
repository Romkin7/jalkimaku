export default defineNuxtRouteMiddleware(async () => {
  const { error } = await useFetch('/api/auth/check')
  if (error.value?.statusCode === 401) {
    return navigateTo('/restaurant/login')
  }
})
