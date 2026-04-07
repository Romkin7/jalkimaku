<template>
  <main class="page">
    <div class="card">
      <div class="header">
        <div class="header-titles">
          <span class="badge">Ravintola</span>
          <h1 class="title">Kupongin tarkistus</h1>
        </div>
        <button class="logout-btn" type="button" @click="logout">Kirjaudu ulos</button>
      </div>

      <form class="form" @submit.prevent="validate">
        <input
          ref="inputRef"
          v-model="code"
          class="input"
          type="text"
          placeholder="ABC123XYZ0"
          required
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <button class="btn" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner" />
          {{ loading ? 'Tarkistetaan...' : 'Tarkista kuponki' }}
        </button>
        <button type="button" class="btn btn-scan" @click="openScanner">
          📷 Skannaa QR
        </button>
      </form>
    </div>

    <Transition name="overlay">
      <div v-if="result" :class="['overlay', result.ok ? 'overlay-ok' : 'overlay-error']" @click="reset">
        <div class="overlay-content">
          <div class="overlay-icon">{{ result.ok ? '✓' : '✗' }}</div>
          <p class="overlay-message">{{ result.message }}</p>

          <dl v-if="result.details" class="overlay-details">
            <template v-for="(val, key) in result.details" :key="key">
              <dt>{{ key }}</dt>
              <dd>{{ val }}</dd>
            </template>
          </dl>

          <button class="overlay-btn" @click.stop="reset">Tarkista uusi kuponki</button>
          <p class="overlay-hint">tai paina Esc</p>
        </div>
      </div>
    </Transition>

    <div v-if="scanning" class="scanner-overlay">
      <video ref="videoRef" class="scanner-video" playsinline autoplay muted />
      <button class="scanner-cancel" @click="closeScanner">Peruuta</button>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'restaurant-auth' })

const code = ref('')
const loading = ref(false)
const result = ref<null | { ok: boolean; message: string; details?: Record<string, string> }>(null)
const inputRef = ref<HTMLInputElement>()
const scanning = ref(false)
const videoRef = ref<HTMLVideoElement>()
let stopScanning: (() => void) | null = null

function formatTs(ts: number) {
  return new Date(ts * 1000).toLocaleString('fi-FI')
}

function reset() {
  result.value = null
  code.value = ''
  nextTick(() => inputRef.value?.focus())
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && scanning.value) {
    closeScanner()
  } else if (e.key === 'Escape' && result.value) {
    reset()
  }
}

onMounted(() => {
  inputRef.value?.focus()
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

async function validate() {
  loading.value = true
  result.value = null
  try {
    const data = await $fetch<{ success: boolean; orderNumber: string; regPlate: string; redeemedAt: number }>(
      '/api/coupon/validate',
      { method: 'POST', body: { code: code.value } },
    )
    result.value = {
      ok: true,
      message: 'Kuponki on voimassa',
      details: {
        Tilausnumero: data.orderNumber,
        Rekisterinumero: data.regPlate,
      },
    }
  } catch (err: any) {
    const status = err?.statusCode ?? err?.response?.status

    if (status === 409) {
      result.value = {
        ok: false,
        message: 'Kuponki on jo käytetty',
        details: err?.data?.data?.redeemedAt
          ? { 'Käytetty': formatTs(err.data.data.redeemedAt) }
          : undefined,
      }
    } else if (status === 410) {
      result.value = { ok: false, message: 'Kuponki on vanhentunut' }
    } else if (status === 404) {
      result.value = { ok: false, message: 'Kuponkia ei löydy' }
    } else {
      result.value = { ok: false, message: 'Jokin meni pieleen. Yritä uudelleen.' }
    }
  } finally {
    loading.value = false
  }
}

async function openScanner() {
  scanning.value = true
  await nextTick()
  const { BrowserMultiFormatReader } = await import('@zxing/browser')
  const reader = new BrowserMultiFormatReader()
  let done = false
  reader.decodeFromVideoDevice(undefined, videoRef.value!, (res) => {
    if (res && !done) {
      done = true
      closeScanner()
      code.value = res.getText()
      validate()
    }
  })
  stopScanning = () => reader.reset()
}

function closeScanner() {
  scanning.value = false
  stopScanning?.()
  stopScanning = null
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  navigateTo('/restaurant/login')
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.75rem;
}

.header-titles {
  text-align: center;
  flex: 1;
}

.logout-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.75rem;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  align-self: flex-start;
}

.logout-btn:hover {
  color: #9ca3af;
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
  font-family: 'Sora', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-align: center;
  padding: 0.875rem 1rem;
  background: #111;
  color: #f9fafb;
  border: 2px solid #3f3f46;
  border-radius: 8px;
  width: 100%;
  transition: border-color 0.15s;
  caret-color: var(--yellow);
}

.input:focus {
  outline: none;
  border-color: var(--yellow);
}

.input::placeholder {
  color: #52525b;
  font-weight: 400;
  letter-spacing: 0.05em;
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

.btn-scan {
  background: #3f3f46;
}

.btn-scan:hover:not(:disabled) {
  background: #52525b;
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

.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer;
}

.overlay-ok {
  background: var(--green);
}

.overlay-error {
  background: #b91c1c;
}

.overlay-content {
  text-align: center;
  color: #fff;
  max-width: 320px;
  cursor: default;
}

.overlay-icon {
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 1rem;
}

.overlay-message {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.overlay-details {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.4rem 1rem;
  text-align: left;
  background: rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.overlay-details dt {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.75;
}

.overlay-details dd {
  margin: 0;
  font-weight: 600;
}

.overlay-btn {
  background: rgba(0,0,0,0.25);
  color: #fff;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
}

.overlay-btn:hover {
  background: rgba(0,0,0,0.35);
}

.overlay-hint {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  opacity: 0.6;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
  transform: scale(1.03);
}

.scanner-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 50;
  gap: 1.5rem;
}

.scanner-video {
  width: 100%;
  max-width: 480px;
  border-radius: 8px;
}

.scanner-cancel {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}
</style>
