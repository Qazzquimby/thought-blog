<template>
  <Layout>

    No layout here yet.

    <page-query>
query {
  posts: allPost(sortBy: "date", order: DESC) {
    edges {
      node {
        id
        title
        date
        author
        excerpt
        path
        tags {
          id
          title
          path
        }
      }
    }
  }
}
</page-query>

  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: 'Thoughts'
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
