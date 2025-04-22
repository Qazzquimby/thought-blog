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



async function getRecentPosts() {
  try {
    const response = await octokit.rest.repos.getContent({
      owner: config.githubOwner,
      repo: config.githubRepo,
      path: `${config.baseContentPath}/posts`,
    });

    // Sort files by name (which includes date) in reverse order
    const files = response.data
      .filter(file => file.name.endsWith('.md'))
      .sort((a, b) => b.name.localeCompare(a.name))
      .slice(0, 5);

    const posts = [];
    for (const file of files) {
      const content = await octokit.rest.repos.getContent({
        owner: config.githubOwner,
        repo: config.githubRepo,
        path: file.path,
      });
      
      // Decode content from base64
      const decodedContent = Buffer.from(content.data.content, 'base64').toString();
      
      // Extract just the content after frontmatter
      const postContent = decodedContent.split('---')[2] || '';
      
      // Take first few sentences (up to 3)
      const sentences = postContent.split(/[.!?]+/).slice(0, 3).join('. ').trim();
      posts.push(sentences);
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
}

async function generateResponse(content) {
  const recentPosts = await getRecentPosts();
  const recentContext = recentPosts.length > 0 
    ? `Recent posts:\n${recentPosts.join('\n\n')}\n\nCurrent post:\n` 
    : '';

  const system_message = {
    role: "system",
    content: `
You're an automatic commenter on a personal microblog service. Users enter their thoughts, mostly as a means of journaling.
You respond to a post very briefly, and only if you think you have something highly beneficial to say. Maybe they're making a serious error, or there's a name for the thing they're thinking of, or you know the answer to their question, etc.
In any other cases, just respond with [No comment]. Please answer with only your reply or [No comment].
We really don't want the comment system filled up with trivia or "That's a fascinating idea! Let me parrot it back to you" style noise.`
  };

  const userMessage = {
    role: "user",
    content: recentContext + content
  };

  const message = [system_message, userMessage];

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "google/gemini-2.5-pro-preview-03-25", // TODO: Confirm if this is the desired model
      messages: message
    }, {
      headers: {
        'Authorization': `Bearer ${config.openRouterKey}`,
      }
    });

    const aiResponse = response.data.choices[0].message.content.trim();
    return aiResponse.toLowerCase() === '[no comment]' ? null : aiResponse;
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    return null;
  }
}

// Function to generate a direct response using a different system prompt
async function generateDirectResponse(content) {
  const recentPosts = await getRecentPosts(); // Still provide context
  const recentContext = recentPosts.length > 0
    ? `Recent posts:\n${recentPosts.join('\n\n')}\n\nCurrent message:\n`
    : '';

  const system_message = {
    role: "system",
    content: `
You're a bot on a discord server, sometimes called commenter. Please respond to the current message.
`
  };

  const userMessage = {
    role: "user",
    content: recentContext + content
  };

  const messages = [system_message, userMessage];

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "google/gemini-2.5-pro-preview-03-25",
      messages: messages
    }, {
      headers: {
        'Authorization': `Bearer ${config.openRouterKey}`,
      }
    });

    // Return the response directly, without filtering for "[No comment]"
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenRouter API Error (Direct Response):', error);
    // Return a user-friendly error message instead of null
    return "Sorry, I encountered an error trying to generate a response.";
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
      const fileContent = createMarkdownContent(title, message.author.username, [], content);

      const date = moment().format('YYYY-MM-DD');
      const slug = slugify(title, { lower: true, strict: true });
      const filename = `${date}-${slug}.md`;

      const authorPath = message.author.username === BARLO_NAME ? 'posts/barlo' : 'posts';
      await commitToGitHub(filename, fileContent, authorPath);
      await message.react('🎉');

      const aiResponse = await generateResponse(content);
      if (aiResponse) {
        await message.reply(aiResponse);
      }
    } catch (error) {
      console.error('Error during post processing (GitHub or AI response):', error);
      await message.react('❌');
      // Send a generic error message, or differentiate based on error type if needed
      await message.author.send(`Error processing your post: ${error.message || error}`);
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

    // Fetch the message if it's a partial
    if (reaction.partial) {
      await reaction.fetch();
    }
    if (reaction.message.partial) {
      await reaction.message.fetch();
    }

    // Fetch the full message to get its content and author
    const message = reaction.message;

    // Ignore if the message is from a bot or has no content
    if (message.author.bot || !message.content) return;

    const content = message.content;

    // --- Handle Blog Post Reaction (💭) ---
    if (reaction.emoji.name === '💭') {
      // Fetch the message if it's a partial (redundant check, but safe)
      if (reaction.partial) { // This check might be redundant now but kept for safety
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
        await message.author.send(`Error publishing blog post: ${error.message || error}`);
      }
    }
    // --- Handle Direct Question Reaction (❓) ---
    else if (reaction.emoji.name === '❓') {
      try {
        // React to show processing started
        await message.react('🤔'); // Thinking face emoji

        const aiResponse = await generateDirectResponse(content);

        if (aiResponse) {
          await message.reply(aiResponse);
          // Remove the thinking emoji after replying
          await reaction.message.reactions.resolve('🤔')?.users.remove(client.user.id);
        } else {
          // Handle case where generateDirectResponse might return null/empty (though current impl returns error string)
           await message.reply("I couldn't generate a response for some reason.");
           await reaction.message.reactions.resolve('🤔')?.users.remove(client.user.id);
           await message.react('❌'); // Indicate failure
        }

      } catch (error) {
          console.error('Error generating direct AI response:', error);
          await message.reply("Sorry, something went wrong while I was thinking about that.");
          // Ensure thinking emoji is removed even on error
          await reaction.message.reactions.resolve('🤔')?.users.remove(client.user.id);
          await message.react('❌'); // Indicate failure
          // Optionally DM user with more details
          // await message.author.send(`Error generating AI response: ${error.message || error}`);
      }
    }
    // --- End Handle Direct Question Reaction ---

  } catch (error) {
    console.error('Error handling reaction:', error);
    // Attempt to notify user if possible, depending on where the error occurred
    try {
        await reaction.message.react('❌');
        // Avoid sending DM here as the error might be unrelated to a specific user action
    } catch (reactError) {
        console.error('Failed to add error reaction:', reactError);
    }
  }
});

// Login to Discord with partials enabled for reactions
client.login(config.discordToken);
