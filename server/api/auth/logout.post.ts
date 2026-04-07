import { getSessionConfig } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const session = await useSession(event, getSessionConfig())
  await session.clear()
  return { ok: true }
})
