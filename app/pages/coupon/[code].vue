<template>
  <main class="page">
    <div class="ticket">
      <div class="ticket-top">
        <div class="brand">🍽️ Ilmainen ateria</div>
        <h1 class="heading">Kuponkisi on valmis!</h1>

        <div class="qr-wrap">
          <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR-koodi" class="qr" />
          <div v-else class="qr-placeholder">Ladataan...</div>
        </div>

        <div class="code-box">{{ code }}</div>
      </div>

      <div class="ticket-divider">
        <span class="notch notch-left" />
        <div class="dashes" />
        <span class="notch notch-right" />
      </div>

      <div class="ticket-bottom">
        <dl class="details">
          <dt>Tilausnumero</dt>
          <dd>{{ orderNumber }}</dd>
          <dt>Voimassa</dt>
          <dd :class="{ 'expiry-soon': isExpiringSoon }">{{ expiryFormatted }} asti</dd>
        </dl>

        <p class="instructions">
          Näytä tämä kuponki ravintolassa saadaksesi ilmaisen aterian. Ota kuvakaappaus varmuuden vuoksi.
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

const route = useRoute()
const code = route.params.code as string

const { data } = await useFetch<{ code: string; expiresAt: number; orderNumber: string | null }>(
  `/api/coupon/${code}`,
)

const orderNumber = computed(() => data.value?.orderNumber ?? '')
const expiresAtRaw = computed(() => data.value?.expiresAt ?? 0)

const qrDataUrl = ref('')

onMounted(async () => {
  qrDataUrl.value = await QRCode.toDataURL(code, {
    width: 200,
    margin: 1,
    color: { dark: '#003087', light: '#ffffff' },
  })
})

const expiryFormatted = computed(() => {
  if (!expiresAtRaw.value) return ''
  return new Date(expiresAtRaw.value * 1000).toLocaleDateString('fi-FI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
})

const isExpiringSoon = computed(() => {
  if (!expiresAtRaw.value) return false
  return expiresAtRaw.value - Math.floor(Date.now() / 1000) < 86400
})
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

.ticket {
  width: 100%;
  max-width: 360px;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: visible;
}

.ticket-top {
  padding: 2rem 2rem 1.5rem;
  text-align: center;
}

.brand {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-bottom: 0.5rem;
}

.heading {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 1.5rem;
}

.qr-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.qr {
  width: 180px;
  height: 180px;
  border-radius: 8px;
  border: 3px solid var(--border);
}

.qr-placeholder {
  width: 180px;
  height: 180px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 0.85rem;
}

.code-box {
  font-family: monospace;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--blue);
  background: #eff6ff;
  border: 2px dashed #93c5fd;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  display: inline-block;
}

.ticket-divider {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 -1px;
}

.notch {
  display: block;
  width: 20px;
  height: 20px;
  background: var(--bg);
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.notch-left {
  margin-left: -10px;
  box-shadow: inset -4px 0 6px rgba(0,0,0,0.06);
}

.notch-right {
  margin-right: -10px;
  box-shadow: inset 4px 0 6px rgba(0,0,0,0.06);
}

.dashes {
  flex: 1;
  border-top: 2px dashed var(--border);
}

.ticket-bottom {
  padding: 1.5rem 2rem 2rem;
}

.details {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.4rem 1rem;
  margin-bottom: 1.25rem;
}

.details dt {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
  padding-top: 2px;
}

.details dd {
  margin: 0;
  font-weight: 600;
  color: var(--text);
}

.expiry-soon {
  color: var(--red);
}

.instructions {
  font-size: 0.85rem;
  color: var(--muted);
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  line-height: 1.5;
}
</style>
