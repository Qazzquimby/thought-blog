<template>
  <Layout>
    <div class="terminal">
      <div class="terminal-header">
        <span class="terminal-title">~/ruminations</span>
        <div class="view-toggle">
          <g-link to="/">Thoughts</g-link>
          <g-link to="/ruminations">Ruminations</g-link>
        </div>
      </div>
      <div class="terminal-body">
        <div v-for="(edge, index) in filteredPosts" :key="edge.node.id" class="post">
          <div class="post-meta" @click="toggle(index)">
            <span class="post-date">{{ formatDate(edge.node.date) }}</span> - <span class="">{{ edge.node.title }}</span>
          </div>
          <div v-show="isExpanded(index)">
            <div class="post-content" v-html="edge.node.content"></div>
            <div class="post-link">
              <g-link :to="edge.node.path">permalink</g-link>
            </div>
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
    formatDate(date) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
    toggle(index) {
      const i = this.expanded.indexOf(index);
      if (i > -1) {
        this.expanded.splice(i, 1);
      } else {
        this.expanded.push(index);
      }
    },
    isExpanded(index) {
      return this.expanded.includes(index);
    }
  }
}
</script>

<style scoped>
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
.post-meta {
  cursor: pointer;
}
</style>
