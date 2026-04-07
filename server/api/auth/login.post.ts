import bcrypt from 'bcrypt'
import { admins } from '../../utils/db'
import { getSessionConfig } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body ?? {}

  if (!username || !password) {
    throw createError({ statusCode: 401, message: 'Väärä tunnus tai salasana' })
  }

  const admin = await (await admins()).findOne({ username })

  // Always run bcrypt compare to prevent timing attacks even when user not found
  const hash = admin?.passwordHash ?? '$2a$12$invalidhashtopreventtimingattack000000000000000000000000'
  const valid = await bcrypt.compare(String(password), hash)

  if (!admin || !valid) {
    throw createError({ statusCode: 401, message: 'Väärä tunnus tai salasana' })
  }

  const session = await useSession(event, getSessionConfig())
  await session.update({ authenticated: true })

  return { ok: true }
})
