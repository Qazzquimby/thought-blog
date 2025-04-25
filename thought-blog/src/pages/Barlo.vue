<template>
  <Layout>
    <div class="terminal">
      <div class="terminal-header">
        <span class="terminal-title">~/thoughts/barlo</span>
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
  posts: allBarloPost(sortBy: "date", order: DESC) {
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
    title: "Barlo"
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options);
    }
  }
}
</script>
