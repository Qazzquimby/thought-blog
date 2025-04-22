require('dotenv').config();
console.log("Starting up")

// Discord Bot that commits blog posts to GitHub
const { Client, GatewayIntentBits } = require('discord.js');
const { Octokit } = require('octokit');
const moment = require('moment');
const slugify = require('slugify');
const axios = require('axios');

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'], // Needed to detect reactions to older messages
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
  baseContentPath: 'thought-blog/content', // Base path for all posts
  openRouterKey: process.env.OPENROUTER_API_KEY,
};



async function generateResponse(content) {
  // TODO get past 5 posts, capping their length at a few sentences ach.
  // create message for "recent posts"


  const messages = []


  messages.push(```
You're an automatic commenter on a personal microblog service. Users enter their thoughts, mostly as a means of journaling.
You respond to a post very briefly, and only if you think you have something highly beneficial to say. Maybe they're making a serious error, or there's a name for the thing they're thinking of, or you know the answer to their question, etc.
In any other cases, just respond with [No comment]. Please answer with only your reply or [No comment].
We really don't want the comment system filled up with trivia or "That's a fascinating idea! Let me parrot it back to you" style noise.```)

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "google/gemini-2.5-pro-preview-03-25",
      messages: [
        {
          role: "user",
          content: content
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${config.openRouterKey}`,
      }
    });

    const aiResponse = response.data.choices[0].message.content.trim();
    return aiResponse === '[No Comment]' ? null : aiResponse;
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    return null;
  }
}

// Event: Bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Monitoring channel: ${config.channelId}`);
});

const QAZZ_NAME = "qazzquimby"
const BARLO_NAME = "junglejimbo"

// Event: Message received
client.on('messageCreate', async (message) => {
  if (message.author.bot || message.channelId !== config.channelId) return;

  if (message.content.includes('💭') || message.content.includes('🧿')) {
    const content = message.content;

    if (!content) {
      await message.reply("You've got to say something.");
      return;
    }

    const numWordsInTitle = 15;
    let title = content.split(' ').slice(0, numWordsInTitle).join(' ') +
                (content.split(' ').length > numWordsInTitle ? '...' : '');
    // Remove quotes and other problematic characters
    title = title.replace(/["'`]/g, '').replace(/[^\w\s-]/g, ' ').trim();

    try {
      // Create the Markdown content with frontmatter
      const fileContent = createMarkdownContent(title, message.author.username, [], content);

      // Create filename based on date and title
      const date = moment().format('YYYY-MM-DD');
      const slug = slugify(title, { lower: true, strict: true });
      const filename = `${date}-${slug}.md`;

      // Determine the content path based on author
      const authorPath = message.author.username === BARLO_NAME ? 'posts/barlo' : 'posts';
      const result = await commitToGitHub(filename, fileContent, authorPath);

      await message.react('🎉');
    } catch (error) {
      console.error('Error publishing to GitHub:', error);
      await message.react('❌');
      await message.author.send(`Error publishing blog post: ${error}`);
    }

    const aiResponse = await generateResponse(content);
    if (aiResponse) {
      await message.reply(aiResponse);
    }
  }
});

// Function to create Markdown content with frontmatter
function createMarkdownContent(title, author, tags, content) {
  const date = moment().format('YYYY-MM-DD HH:mm:ss');
  
  // Escape quotes in title and author for YAML
  const escapedTitle = title.replace(/"/g, '\\"');
  const escapedAuthor = author.replace(/"/g, '\\"');

  // Create frontmatter
  let frontmatter = `---
title: "${escapedTitle}"
date: ${date}
author: "${escapedAuthor}"
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
async function commitToGitHub(filename, content, authorPath) {
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
          path: `${config.baseContentPath}/${authorPath}/${filename}`,
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

// Event: Reaction added
client.on('messageReactionAdd', async (reaction, user) => {
  try {
    // Ignore reactions from bots and reactions in other channels
    if (user.bot || reaction.message.channelId !== config.channelId) return;
    
    // Check if the reaction is a thought_balloon emoji
    if (reaction.emoji.name === '💭') {
      // Fetch the message if it's a partial
      if (reaction.partial) {
        await reaction.fetch();
      }
      
      // Fetch the full message to get its content
      const message = await reaction.message.fetch();
      
      // Ignore if the message is from a bot or has no content
      if (message.author.bot || !message.content) return;
      
      const content = message.content;
      
      // Generate title from first 15 words
      const numWordsInTitle = 15;
      let title = content.split(' ').slice(0, numWordsInTitle).join(' ') +
                  (content.split(' ').length > numWordsInTitle ? '...' : '');
      // Remove quotes and other problematic characters
      title = title.replace(/["'`]/g, '').replace(/[^\w\s-]/g, ' ').trim();

      try {
        // Create the Markdown content with frontmatter
        const fileContent = createMarkdownContent(title, message.author.username, [], content);

        // Create filename based on date and title
        const date = moment().format('YYYY-MM-DD');
        const slug = slugify(title, { lower: true, strict: true });
        const filename = `${date}-${slug}.md`;

        // Commit to GitHub
        // Determine the content path based on author
        const authorPath = message.author.username === BARLO_NAME ? 'posts/barlo' : 'posts';
        const result = await commitToGitHub(filename, fileContent, authorPath);

        // React with a success emoji
        await message.react('🎉');
        
        // Optional: DM the user with the commit URL to avoid channel spam
        await message.author.send(`Blog post published successfully: ${result.commitUrl}`);
      } catch (error) {
        console.error('Error publishing to GitHub:', error);
        // React with error emoji
        await message.react('❌');
        // DM the error details to avoid channel spam
        await message.author.send(`Error publishing blog post: ${error}`);
      }
    }
  } catch (error) {
    console.error('Error handling reaction:', error);
  }
});

// Login to Discord with partials enabled for reactions
client.login(config.discordToken);
