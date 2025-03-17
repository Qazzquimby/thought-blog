// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

// This is the main configuration file for your Gridsome site
// Learn more: https://gridsome.org/docs/config

module.exports = {
  siteName: 'Thoughts Blog',
  siteDescription: 'Muttering into the Void',

  templates: {
    Post: '/blog/:slug',
  },

  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'Post',
        path: './content/posts/*.md',
        refs: {
          tags: {
            typeName: 'Tag',
            create: true
          }
        }
      }
    }
  ],

  transformers: {
    remark: {
      externalLinksTarget: '_blank',
      externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
      plugins: [
        // Add remark plugins here if needed
      ]
    }
  }
}
