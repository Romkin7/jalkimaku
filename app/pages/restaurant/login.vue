<template>
  <main class="page">
    <div class="card">
      <div class="header">
        <span class="badge">Ravintola</span>
        <h1 class="title">Kirjaudu sisään</h1>
      </div>

      <form class="form" @submit.prevent="submit">
        <input
          v-model="username"
          class="input"
          type="text"
          placeholder="Tunnus"
          autofocus
          autocomplete="username"
          required
        />
        <input
          v-model="password"
          class="input"
          type="password"
          placeholder="Salasana"
          autocomplete="current-password"
          required
        />
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button class="btn" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner" />
          {{ loading ? 'Kirjaudutaan...' : 'Kirjaudu sisään' }}
        </button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

$fetch('/api/auth/check')
  .then(() => navigateTo('/restaurant/validate'))
  .catch(() => {})

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { username: username.value, password: password.value } })
    navigateTo('/restaurant/validate')
  } catch (err: any) {
    const status = err?.statusCode ?? err?.response?.status
    if (status === 401) {
      error.value = 'Väärä tunnus tai salasana'
    } else {
      error.value = 'Jokin meni pieleen. Yritä uudelleen.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: #1a1a1a;
}

.card {
  width: 100%;
  max-width: 400px;
  background: #2a2a2a;
  border-radius: var(--radius);
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.header {
  text-align: center;
  margin-bottom: 1.75rem;
}

.badge {
  display: inline-block;
  background: rgba(255,255,255,0.1);
  color: #9ca3af;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  margin-bottom: 0.75rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #f9fafb;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input {
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.875rem 1rem;
  background: #111;
  color: #f9fafb;
  border: 2px solid #3f3f46;
  border-radius: 8px;
  width: 100%;
  transition: border-color 0.15s;
}

.input:focus {
  outline: none;
  border-color: var(--yellow);
}

.input::placeholder {
  color: #52525b;
}

.error-msg {
  color: #f87171;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--red);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
}

.btn:hover:not(:disabled) {
  background: var(--red-dark);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
