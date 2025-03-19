<template>
  <div class="layout">
    <header class="header">
      <strong class="site-title">
        <g-link to="/">{{ $static.metadata.siteName }}</g-link>
      </strong>
<!--      <nav class="nav">-->
<!--        <g-link class="nav__link" to="/">Home</g-link>-->
<!--        <g-link class="nav__link" to="/about/">About</g-link>-->
<!--      </nav>-->
    </header>
    <slot/>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style>
:root {
  --bg-color: #1f1f23;
  --text-color: #333;
  --accent-color: #50fa7b;
  --link-color: #6272a4;
}

body {
  font-family: 'Courier New', monospace;
  margin: 0;
  padding: 0;
  line-height: 1.5;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 80px;
  border-bottom: 1px solid #ddd;
}

.site-title a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: bold;
}

.nav__link {
  margin-left: 20px;
  color: var(--link-color);
  text-decoration: none;
}

.nav__link:hover {
  text-decoration: underline;
  color: var(--accent-color);
}
</style>
