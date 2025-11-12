<template>
  <div class="layout">
    <header class="header">
      <strong class="site-title">
        <g-link to="/">Murmuring into the void</g-link>
      </strong>
<!--      <nav class="nav">-->
<!--        <g-link class="nav__link" to="/">Home</g-link>-->
<!--        <g-link class="nav__link" to="/about/">About</g-link>-->
<!--      </nav>-->
    </header>
    <div class="terminal">
      <div class="terminal-header">
        <span class="terminal-title">{{ title }}</span>
        <div class="view-toggle">
          <g-link to="/">Thoughts</g-link>
          <g-link to="/ruminations">Ruminations</g-link>
        </div>
      </div>
      <div class="terminal-body">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style>
@font-face {
  font-family: 'Courier Prime';
  src: url('../assets/fonts/CourierPrime-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

:root {
  --bg-color: #1f1f23;
  --accent-color: #50fa7b;
  --link-color: #6272a4;
  /* Terminal Colors */
  --terminal-bg: #282a36;
  --terminal-text: #f8f8f2;
  --terminal-green: #50fa7b; /* Same as accent-color */
  --terminal-header: #44475a;
  --terminal-divider: #44475a; /* Same as header */
}

body {
  color: var(--terminal-text);
  font-family: 'Courier Prime', serif;
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  line-height: 1.5;
  background-color: var(--bg-color);
}

.layout {
  max-width: 820px;
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
  color: #463b67;
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

/* Terminal Styles */
.terminal {
  background-color: var(--terminal-bg);
  color: var(--terminal-text);
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  margin: 20px 0;
}

.terminal-header {
  background-color: var(--terminal-header);
  padding: 10px 15px;
  font-size: 14px;
}

.terminal-title {
  color: var(--terminal-green);
}

.terminal-body {
  padding: 15px;
}

.post {
  margin-bottom: 20px;
}

.post-meta {
  margin-bottom: 8px;
  font-size: 0.9em;
  color: #bd93f9; /* Consider moving this to :root if used elsewhere */
}

.post-date {
  margin-right: 10px;
}

.post-author {
  color: #8be9fd; /* Consider moving this to :root if used elsewhere */
}

.post-content {
  margin-bottom: 8px;
  line-height: 1.5;
}

.post-content blockquote {
  border-left: 3px solid var(--terminal-green); /* Use accent color for the line */
  padding-left: 15px;
  margin-left: 10px;
  margin-right: 10px;
  color: #bbbbbb;
  font-style: italic;
}

.post-content code {

}

.post-content h1,
.post-content h2,
.post-content h3,
.post-content h4,
.post-content h5,
.post-content h6 {
  margin-top: 1.5em; /* More space above */
  margin-bottom: 0.5em; /* Less space below */
}

.post-content em {
  color: #f6abca; /* Slightly muted text color for readability */
}



.post-link a {
  color: var(--terminal-green);
  text-decoration: none;
  font-size: 0.8em;
}

.post-link a:hover {
  text-decoration: underline;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.view-toggle a {
  color: inherit;
  text-decoration: none;
  margin: 0 0.5em;
}
.view-toggle a.active {
  text-decoration: underline;
}

.terminal-divider {
  height: 1px;
  background-color: var(--terminal-divider);
  margin: 15px 0;
}
</style>
