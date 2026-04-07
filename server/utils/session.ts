export function getSessionConfig() {
  const config = useRuntimeConfig()
  return {
    name: 'restaurant_session',
    password: config.sessionSecret as string,
    maxAge: 60 * 60 * 8,
    cookie: { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' },
  }
}
