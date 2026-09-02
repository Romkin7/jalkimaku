<template>
  <main class="page">
    <div class="card">
      <h1 class="title">Käyttöehdot</h1>
      <p class="intro">
        Osta 4 uuden renkaan setti
        <a href="https://www.rengascenterilola.fi" target="_blank" rel="noopener" class="link">Rengas Center Ilolan</a>
        verkkosivuilta, niin saat sähköpostiisi <strong>26,90 €</strong> arvoisen kupongin
        <strong>MR PASTRAMI</strong> -ravintolaan.
      </p>
      <ul class="terms">
        <li>Kupongin arvo on 26,90 €, eikä sitä voida muuttaa rahaksi. Se on voimassa 6 kuukautta.</li>
        <li>Kupongin voi käyttää vain <strong>MR PASTRAMI</strong> -ravintolassa.</li>
        <li>
          Yhden kupongin saa yhtä tilausta kohden, kun tilaus sisältää 4 uutta rengasta
          <a href="https://www.rengascenterilola.fi" target="_blank" rel="noopener" class="link">Rengas Center Ilolasta</a>
          tai
          <a href="https://www.klaukkalanrengas.fi" target="_blank" rel="noopener" class="link">Rengas Center Klaukkalasta</a>.
        </li>
        <li>Kupongilla saa vain yhden aterian.</li>
        <li>Jälkimaku pidättää oikeuden muuttaa näitä käyttöehtoja.</li>
      </ul>
    </div>
  </main>
</template>

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
  max-width: 480px;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 2.5rem 2rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 1.5rem;
}

.intro {
  font-size: 0.95rem;
  color: var(--text);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.terms {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.terms li {
  font-size: 0.95rem;
  color: var(--muted);
  padding-left: 1.25rem;
  position: relative;
  line-height: 1.5;
}

.terms li::before {
  content: '—';
  position: absolute;
  left: 0;
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
