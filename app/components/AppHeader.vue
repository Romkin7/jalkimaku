<template>
  <header class="app-header">
    <NuxtLink to="/" class="brand">
      <span class="steam">
        <span>〜</span><span>〜</span><span>〜</span>
      </span>
      <em>Jälkimaku</em>
    </NuxtLink>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  padding: 1.25rem 1.5rem;
  z-index: 10;
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
