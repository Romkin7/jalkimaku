import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { admins } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body ?? {}

  if (!username || !password) {
    throw createError({ statusCode: 400, message: 'username and password are required' })
  }

  if (typeof password !== 'string' || password.length < 8) {
    throw createError({ statusCode: 400, message: 'password must be at least 8 characters' })
  }

  const adminsCol = await admins()
  const existing = await adminsCol.findOne({ username })
  if (existing) {
    throw createError({ statusCode: 409, message: 'username already taken' })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await adminsCol.insertOne({
    _id: nanoid(),
    username,
    passwordHash,
    createdAt: Math.floor(Date.now() / 1000),
  })

  return { ok: true }
})
