<template>
  <footer class="app-footer">
    <div class="footer-inner">

      <div class="footer-section">
        <p class="section-label">Ravintola</p>
        <a href="https://mrpastrami.eu/espoo" target="_blank" rel="noopener" class="link section-name">MR PASTRAMI</a>
        <p class="section-detail">Smoked Meats · Espoo WESTEND</p>
      </div>

      <div class="footer-section">
        <p class="section-label">Rengasliikkeet</p>
        <a href="https://www.rengascenterilola.fi" target="_blank" rel="noopener" class="link section-name">RengasCenterIlola</a>
        <p class="section-detail">Rengas Center — Ilola</p>
        <a href="https://www.klaukkalanrengas.fi" target="_blank" rel="noopener" class="link section-name store-gap">Klaukkalanrengas</a>
        <p class="section-detail">Rengas Center — Klaukkala</p>
      </div>

      <div class="footer-links">
        <NuxtLink to="/kayttoehdot" class="link">Käyttöehdot</NuxtLink>
        <NuxtLink to="/restaurant/login" class="link">Ravintolalle</NuxtLink>
      </div>

      <div class="footer-company">
        ATMD Oy · Y-tunnus: 2470070-6
      </div>

      <div class="footer-credit">
        Made with <span class="heart">&lt;3</span> by
        <a href="https://devdesign.fi" target="_blank" rel="noopener" class="link">devdesign.fi</a>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--border);
  background: var(--surface);
  padding: 2rem 1.5rem;
}

.footer-inner {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
  justify-content: center;
}

.footer-section {
  text-align: center;
}

.section-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-bottom: 0.25rem;
}

.section-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
}

.section-detail {
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 0.15rem;
}

.store-gap {
  display: block;
  margin-top: 0.75rem;
}

.section-detail.muted {
  font-size: 0.75rem;
  opacity: 0.7;
}

.footer-links {
  flex-basis: 100%;
  text-align: center;
  font-size: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.footer-company {
  flex-basis: 100%;
  text-align: center;
  font-size: 0.65rem;
  color: var(--muted);
  opacity: 0.7;
}

.footer-credit {
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  color: var(--muted);
  padding-top: 0.75rem;
}

.heart {
  color: var(--red);
  font-weight: 700;
}

.link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: var(--border);
  transition: color 0.15s, text-decoration-color 0.15s;
}

.link:hover {
  color: var(--text);
  text-decoration-color: var(--muted);
}
</style>
