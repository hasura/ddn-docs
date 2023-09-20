const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

require('dotenv').config();

const targetPath = process.argv[2];
const contextEnhancement = process.argv[3] || '';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Implementing a delay function using setTimeout and Promise
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const promptGenerator = (content, additionalContext) => {
  return `You are an SEO expert and your task is to improve only the keywords and descriptions for the front matter of 
  the below page of the documentation site for the Hasura software product.
  
  For the keywords:
  - The improvements should be relevant to the content of the page and should likely lead to increased traffic on the 
    page by using relevant and popular keywords. 
  - Don't add more than 10 keywords.
  - The keywords should all be in lowercase.
  
  For the description:
  - The improvements should be relevant to the content on the page and
  - Do not exceed 320 characters, which is the ideal Google search meta description length.
 
  Only respond with the same front matter between (and including) the "---" characters but with only the "keywords" and 
  "description" values updated. 
  
  Also include a new property on a new line of: "seoFrontMatterUpdated: true", to indicate that the front matter has 
  been updated.  If "seoFrontMatterUpdated: false" exists, flip it to true.  
  
  Do not update any of the other values, or change the order of the keys as they appear, and don't include any other 
  text. 
  
  Take into account this additional context for this page (if there is any):
  ${additionalContext}
  
  /End of additional context/
  
  Here is the actual content of the page: 
  ${content}
  
  /End of additional content/
  `
}

async function improveSEO(fileContent) {

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: promptGenerator(fileContent) }],
    model: 'gpt-4',
  });

  console.log("improved front matter", completion.choices[0].message.content);

  return completion.choices[0].message.content;
}

function extractFrontMatter(content) {
  const match = content.match(/---\n([\s\S]*?)\n---/);
  if (match) {
    return match[1];
  }
  return null;
}

async function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Trim the content to 8000 characters
  const trimmedContent = content.substring(0, 8000);

  const frontMatter = "---\n" + extractFrontMatter(trimmedContent) + "\n---";

  if (frontMatter) {

    if (frontMatter.includes("seoFrontMatterUpdated: true")) {
      console.log(`Skipping ${filePath} as it's already updated.`);
      return;
    }

    const improvedSEO = await improveSEO(trimmedContent);

    const updatedContent = content.replace(/---\n([\s\S]*?)\n---/, `${improvedSEO}`);
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
  }
}

async function traverseDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      await traverseDirectory(filePath);
    } else if (path.extname(filePath) === '.mdx' && !file.startsWith('_')) {
      await processFile(filePath);
      console.log(`Processed ${filePath}. Waiting 2s \n`);
      await delay(2000);  // Waiting for 2 seconds after each API call
      console.log(`Finished waiting. Proceeding \n`);
    }
  }
}

traverseDirectory("../docs" + targetPath);
