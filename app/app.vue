<template>
  <AppHeader />
  <NuxtPage />
  <AppFooter />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --red: #f97316;
  --red-dark: #ea6c0a;
  --blue: #003087;
  --yellow: #ffcc00;
  --text: #1a1a1a;
  --muted: #6b7280;
  --surface: #ffffff;
  --bg: #f7f7f5;
  --border: #e5e7eb;
  --green: #16a34a;
  --green-bg: #f0fdf4;
  --green-border: #86efac;
  --error: #c0392b;
  --error-bg: #fef2f2;
  --error-border: #fca5a5;
  --radius: 12px;
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

html {
  font-family: 'Sora', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100dvh;
}
</style>
