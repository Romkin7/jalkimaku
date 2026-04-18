<template>
  <header class="app-header">
    <NuxtLink to="/" :class="['brand', { 'brand--light': isLightText }]">
      <span class="steam">
        <span>〜</span><span>〜</span><span>〜</span>
      </span>
      <em>Jälkimaku</em>
    </NuxtLink>
    <nav class="nav">
      <NuxtLink to="/" :class="['nav-link', { 'nav-link--light': isLightText }]">Asiakkaalle</NuxtLink>
      <button v-if="isRestaurant" class="nav-link nav-link--light nav-logout" @click="logout">Kirjaudu ulos</button>
      <NuxtLink v-else to="/restaurant/login" :class="['nav-link', { 'nav-link--light': isLightText }]">Ravintolalle</NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const isLightText = computed(() =>
  route.path.startsWith('/restaurant/') || route.path.startsWith('/coupon/')
)
const isRestaurant = computed(() => route.path.startsWith('/restaurant/'))

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  navigateTo('/restaurant/login')
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1.25rem 1.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.15s;
}

.nav-link:hover {
  color: var(--text);
}

.nav-link--light {
  color: #6b7280;
}

.nav-link--light:hover {
  color: #f9fafb;
}

.nav-logout {
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
}

.brand {
  text-decoration: none;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
}

.brand em {
  font-style: italic;
}

.brand--light {
  color: #f9fafb;
}

.brand--light .steam {
  color: #9ca3af;
}

.steam {
  display: flex;
  gap: 2px;
  font-style: normal;
  font-size: 0.85rem;
  color: var(--muted);
  opacity: 0.7;
}

.steam span {
  animation: rise 1.6s ease-in-out infinite;
}

.steam span:nth-child(2) { animation-delay: 0.25s; }
.steam span:nth-child(3) { animation-delay: 0.5s; }

@keyframes rise {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-4px); opacity: 1; }
}
</style>
