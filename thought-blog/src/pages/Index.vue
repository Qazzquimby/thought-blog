<template>
  <Layout title="~/thoughts">
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
  inject: ['formatDate'],
  metaInfo: {
    title: 'Thoughts'
  },
  methods: {
    formatDate(date) {
      const options = {year: 'numeric', month: 'short', day: 'numeric'};
      return new Date(date).toLocaleDateString('en-US', options);
    }
  },
  computed: {
    filteredPosts() {
      return this.$page.posts.edges.filter(edge => edge.node.type !== 'rumination');
    }
  }
}
</script>
