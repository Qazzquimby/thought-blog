require('dotenv').config();
console.log("Starting up")

// Discord Bot that commits blog posts to GitHub
const { Client, GatewayIntentBits } = require('discord.js');
const { Octokit } = require('octokit');
const moment = require('moment');
const slugify = require('slugify');

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Configuration
const config = {
  discordToken: process.env.DISCORD_TOKEN,
  channelId: process.env.CHANNEL_ID,
  githubOwner: process.env.GITHUB_OWNER,
  githubRepo: process.env.GITHUB_REPO,
  contentPath: 'thought-blog/content/posts', // Where posts are stored in your Gridsome repo
};

// Event: Bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Monitoring channel: ${config.channelId}`);
});

// Event: Message received
client.on('messageCreate', async (message) => {
  // Ignore bot messages and messages from other channels
  if (message.author.bot || message.channelId !== config.channelId) return;

  // Check for command prefix to publish (!blog)
  if (message.content.startsWith('!blog')) {
    // Extract content: !blog Content goes here...
    const content = message.content.slice(6).trim();

    if (!content) {
      await message.reply("You've got to say something. Format: `!blog Your content here...`");
      return;
    }

    const numWordsInTitle = 15
    // Generate title from first 5 words
    const title = content.split(' ').slice(0, numWordsInTitle).join(' ') +
                 (content.split(' ').length > numWordsInTitle ? '...' : '');

    try {
      // Create the Markdown content with frontmatter
      const fileContent = createMarkdownContent(title, message.author.username, [], content);

      // Create filename based on date and title
      const date = moment().format('YYYY-MM-DD');
      const slug = slugify(title, { lower: true, strict: true });
      const filename = `${date}-${slug}.md`;

      // Commit to GitHub
      const result = await commitToGitHub(filename, fileContent);

      // React with a success emoji instead of replying
      await message.react('🎉');
      
      // Optional: DM the user with the commit URL to avoid channel spam
      await message.author.send(`Blog post published successfully: ${result.commitUrl}`);
    } catch (error) {
      console.error('Error publishing to GitHub:', error);
      console.error('Error publishing to GitHub:', error);
      // React with error emoji
      await message.react('❌');
      // DM the error details to avoid channel spam
      await message.author.send(`Error publishing blog post: ${error}`);
    }
  }
});

// Function to create Markdown content with frontmatter
function createMarkdownContent(title, author, tags, content) {
  const date = moment().format('YYYY-MM-DD HH:mm:ss');

  // Create frontmatter
  let frontmatter = `---
title: "${title}"
date: ${date}
author: "${author}"
`;

  if (tags.length > 0) {
    frontmatter += `tags:
${tags.map(tag => `  - "${tag}"`).join('\n')}
`;
  }

  frontmatter += `---\n\n`;

  return frontmatter + content;
}

// Function to commit content to GitHub
async function commitToGitHub(filename, content) {
  try {
    // Get the current reference (HEAD)
    const ref = await octokit.rest.git.getRef({
      owner: config.githubOwner,
      repo: config.githubRepo,
      ref: 'heads/master',
    });

    // Create a blob with the file content
    const blob = await octokit.rest.git.createBlob({
      owner: config.githubOwner,
      repo: config.githubRepo,
      content: Buffer.from(content).toString('base64'),
      encoding: 'base64',
    });

    // Get the current commit to use as parent
    const commit = await octokit.rest.git.getCommit({
      owner: config.githubOwner,
      repo: config.githubRepo,
      commit_sha: ref.data.object.sha,
    });

    // Create a tree with the new file
    const tree = await octokit.rest.git.createTree({
      owner: config.githubOwner,
      repo: config.githubRepo,
      base_tree: commit.data.tree.sha,
      tree: [
        {
          path: `${config.contentPath}/${filename}`,
          mode: '100644',
          type: 'blob',
          sha: blob.data.sha,
        },
      ],
    });

    // Create a commit
    const newCommit = await octokit.rest.git.createCommit({
      owner: config.githubOwner,
      repo: config.githubRepo,
      message: `Add blog post: ${filename}`,
      tree: tree.data.sha,
      parents: [commit.data.sha],
    });

    // Update the reference
    await octokit.rest.git.updateRef({
      owner: config.githubOwner,
      repo: config.githubRepo,
      ref: 'heads/master',
      sha: newCommit.data.sha,
    });

    return {
      success: true,
      commitUrl: `https://github.com/${config.githubOwner}/${config.githubRepo}/commit/${newCommit.data.sha}`,
    };
  } catch (error) {
    console.error('GitHub API Error:', error);
    throw error;
  }
}

// Login to Discord
client.login(config.discordToken);
