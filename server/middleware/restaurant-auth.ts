import { getSessionConfig } from '../utils/session'

export default defineEventHandler(async (event) => {
  const url = event.path.split('?')[0]
  const guarded = ['/restaurant/validate', '/api/coupon/validate']
  if (!guarded.some(p => url.startsWith(p))) return

  const session = await useSession(event, getSessionConfig())
  if (!session.data.authenticated || !session.data.username) {
    if (url.startsWith('/api/')) {
      throw createError({ statusCode: 401 })
    } else {
      return sendRedirect(event, '/restaurant/login', 302)
    }
  }
})
