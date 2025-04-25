<template>
  <Layout>
    <div class="terminal">
      <div class="terminal-header">
        <span class="terminal-title">~/thoughts/{{ $page.post.title.toLowerCase() }}</span>
      </div>
      <div class="terminal-body">
        <div class="post">
          <div class="post-meta">
            <span class="post-date">{{ formatDate($page.post.date) }}</span>
          </div>
          <div class="post-content" v-html="$page.post.content"></div>
          <div class="post-nav">
            <g-link to="/" class="back-link">cd ..</g-link>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query Post ($id: ID!) {
  post(id: $id) {
    title
    content
    date
    author
  }
}
</page-query>

<script>
export default {
  metaInfo() {
    return {
      title: this.$page.post.title
    }
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
.post-nav {
  margin-top: 20px;
}

.back-link {
  color: var(--terminal-green); /* Uses variable defined in Default.vue */
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
