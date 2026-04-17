<template>
  <main class="page">
    <div class="card">
      <div class="hero-icon">🍽️</div>
      <h1 class="title">Ilmainen ateria sinulle</h1>
      <p class="subtitle">Oston jälkeen lisää tähän kenttään auton rekisterinumero ja paina "Lähetä". Tervetuloa maistamaan kaupungin parasta pastramia.</p>

      <form class="form" @submit.prevent="claim">
        <label class="label" for="reg-plate">Rekisterinumero</label>
        <RegPlateInput
          id="reg-plate"
          v-model="regPlate"
          placeholder="ABC-123"
          required
        />
        <button class="btn" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner" />
          {{ loading ? 'Haetaan...' : 'Lähetä' }}
        </button>
      </form>

      <div v-if="error" class="error-box" role="alert">
        <span class="error-icon">⚠️</span>
        {{ error }}
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const regPlate = ref('')
const loading = ref(false)
const error = ref('')

async function claim() {
  error.value = ''
  loading.value = true
  try {
    const data = await $fetch<{ code: string }>('/api/coupon/claim', {
      method: 'POST',
      body: { regPlate: regPlate.value },
    })
    await navigateTo(`/coupon/${data.code}`)
  } catch (err: any) {
    error.value =
      err?.data?.message === 'Ei löydy voimassa olevaa kuponkia tälle rekisterinumerolle'
        ? 'Ei löydy voimassa olevaa kuponkia tälle rekisterinumerolle. Tarkista rekisterinumero ja yritä uudelleen.'
        : 'Jokin meni pieleen. Yritä uudelleen.'
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
  background: linear-gradient(160deg, #fff8e7 0%, #f7f7f5 60%);
}

.card {
  width: 100%;
  max-width: 420px;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 2.5rem 2rem;
  text-align: center;
}

.hero-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1;
}

.title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.subtitle {
  color: var(--muted);
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--red);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  width: 100%;
  max-width: 280px;
  justify-content: center;
}

.btn:hover:not(:disabled) {
  background: var(--red-dark);
  transform: translateY(-1px);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
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

.error-box {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 1.25rem;
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  border-radius: 8px;
  padding: 0.875rem 1rem;
  font-size: 0.9rem;
  color: var(--error);
  text-align: left;
}

.error-icon {
  flex-shrink: 0;
  margin-top: 1px;
}
</style>
