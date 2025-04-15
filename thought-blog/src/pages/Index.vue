<template>
  <Layout>
    <div class="terminal">
      <div class="terminal-header">
        <span class="terminal-title">~/thoughts</span>
      </div>
      <div class="terminal-body">
        <div v-for="edge in $page.posts.edges" :key="edge.node.id" class="post">
          <div class="post-meta">
            <span class="post-date">{{ formatDate(edge.node.date) }}</span>
          </div>
          <div class="post-content" v-html="edge.node.content"></div>
          <div class="post-link">
            <g-link :to="edge.node.path">permalink</g-link>
          </div>
          <div class="terminal-divider"></div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query {
  posts: allPost(sortBy: "date", order: DESC) {
    edges {
      node {
        id
        title
        date
        content
        author
        path
      }
    }
  }
}
</page-query>

<script>
export default {
  metaInfo: {
    title: 'Thoughts'
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options);
    }
  }
}
</script>

<style>
:root {
  --terminal-bg: #282a36;
  --terminal-text: #f8f8f2;
  --terminal-green: #50fa7b;
  --terminal-header: #44475a;
  --terminal-divider: #44475a;
}

body {
  color: #333;
  font-family: 'Courier New', monospace;
}

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
  color: #bd93f9;
}

.post-date {
  margin-right: 10px;
}

.post-author {
  color: #8be9fd;
}

.post-content {
  margin-bottom: 8px;
  line-height: 1.5;
}

.post-link a {
  color: var(--terminal-green);
  text-decoration: none;
  font-size: 0.8em;
}

.post-link a:hover {
  text-decoration: underline;
}

.terminal-divider {
  height: 1px;
  background-color: var(--terminal-divider);
  margin: 15px 0;
}
</style>
