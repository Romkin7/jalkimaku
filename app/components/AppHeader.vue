<template>
  <header :class="['app-header', { 'app-header--dark': isRestaurant }]">
    <NuxtLink to="/" :class="['brand', { 'brand--light': isLightText }]">
      <span class="steam">
        <span>〜</span><span>〜</span><span>〜</span>
      </span>
      <em>Jälkimaku</em>
    </NuxtLink>
    <nav class="nav">
      <NuxtLink to="/" :class="['nav-link', { 'nav-link--light': isLightText }]">Asiakkaalle</NuxtLink>
      <div v-if="authenticated" ref="menuRef" class="user-menu">
        <button
          class="nav-link nav-link--light user-menu-trigger"
          type="button"
          aria-haspopup="true"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          {{ username }}
          <svg class="chevron" :class="{ 'chevron--open': menuOpen }" width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <div v-if="menuOpen" class="user-menu-dropdown">
          <span class="user-menu-name">{{ username }}</span>
          <button class="user-menu-logout" type="button" @click="logout">Kirjaudu ulos</button>
        </div>
      </div>
      <NuxtLink v-else-if="!isRestaurant" to="/restaurant/login" :class="['nav-link', { 'nav-link--light': isLightText }]">Ravintolalle</NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const isLightText = computed(() =>
  route.path.startsWith('/restaurant/')
)
const isRestaurant = computed(() => route.path.startsWith('/restaurant/'))

const username = ref('')
const authenticated = ref(false)
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

watch(() => route.path, async (path) => {
  menuOpen.value = false
  if (!path.startsWith('/restaurant/')) {
    authenticated.value = false
    username.value = ''
    return
  }
  try {
    const data = await $fetch<{ ok: boolean; username?: string }>('/api/auth/check')
    authenticated.value = true
    username.value = data.username ?? ''
  } catch {
    authenticated.value = false
    username.value = ''
  }
}, { immediate: true })

function onClickOutside(event: MouseEvent) {
  if (menuOpen.value && menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

async function logout() {
  menuOpen.value = false
  await $fetch('/api/auth/logout', { method: 'POST' })
  authenticated.value = false
  username.value = ''
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

.app-header--dark {
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
}

.user-menu {
  position: relative;
}

.user-menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
}

.chevron {
  transition: transform 0.15s;
}

.chevron--open {
  transform: rotate(180deg);
}

.user-menu-dropdown {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  display: flex;
  flex-direction: column;
  min-width: 160px;
  background: #2a2a2a;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.user-menu-name {
  padding: 0.5rem 0.6rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #f9fafb;
  border-bottom: 1px solid #3f3f46;
  margin-bottom: 0.25rem;
}

.user-menu-logout {
  background: none;
  border: none;
  padding: 0.5rem 0.6rem;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.user-menu-logout:hover {
  background: rgba(255,255,255,0.08);
  color: #f9fafb;
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
