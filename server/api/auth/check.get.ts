import { getSessionConfig } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const session = await useSession(event, getSessionConfig())
  if (!session.data.authenticated || !session.data.username) {
    throw createError({ statusCode: 401 })
  }
  return { ok: true, username: session.data.username as string }
})
