<template>
  <Layout title="~/ruminations">
    <div v-for="(edge, index) in filteredPosts" :key="edge.node.id" class="post">
      <div class="post-meta" @click="toggle(index)">
        <span class="post-date">{{ formatDate(edge.node.date) }}</span> - <span class="post-title">{{
          edge.node.title
        }}</span>
      </div>
      <div v-show="isExpanded(index)">
        <div class="post-content" v-html="edge.node.content"></div>
        <div class="post-link">
          <g-link :to="edge.node.path">permalink</g-link>
        </div>
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
    title: 'Ruminations'
  },
  data() {
    return {
      expanded: []
    }
  },
  computed: {
    filteredPosts() {
      return this.$page.posts.edges.filter(edge => edge.node.type === 'rumination');
    }
  },
  methods: {
    toggle(index) {
      const i = this.expanded.indexOf(index);
      if (i > -1) {
        this.expanded.splice(i, 1);
      } else {
        this.expanded.push(index);
      }
    },
    formatDate(date) {
      const options = {year: 'numeric', month: 'short', day: 'numeric'};
      return new Date(date).toLocaleDateString('en-US', options);
    },
    isExpanded(index) {
      return this.expanded.includes(index);
    }
    },
};
</script>

<style scoped>
.post-meta {
  cursor: pointer;
}

.post-title {
  font-family: sans-serif;
  font-weight: bold;
  font-size: 1.1em;
}
</style>
