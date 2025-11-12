<template>
  <Layout>
    <div class="terminal">
      <div class="terminal-header">
        <span class="terminal-title">~/thoughts</span>
        <div class="view-toggle">
          <g-link class="nav__link" to="/">Thoughts</g-link>
          <g-link class="nav__link" to="/ruminations">Ruminations</g-link>
        </div>
      </div>
      <div class="terminal-body">
        <div v-for="edge in filteredPosts" :key="edge.node.id" class="post">
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
        type
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
  computed: {
    filteredPosts() {
      return this.$page.posts.edges.filter(edge => edge.node.type !== 'rumination');
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
