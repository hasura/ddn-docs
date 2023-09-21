const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

require('dotenv').config();

// Get target path and context enhancement from command line arguments
const targetPath = process.argv[2];
const contextEnhancement = process.argv[3] || '';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Implementing a delay function using setTimeout and Promise
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to generate prompt for user to update front matter
const promptGenerator = (content, additionalContext) => {
  return `You are an SEO expert and your task is to improve only the keywords and descriptions for the front matter of 
  the below page of the documentation site for the Hasura software product.
  
  For the keywords:
  - The improvements should be relevant to the content of the page and should likely lead to increased traffic on the 
    page by using relevant and popular keywords. 
  - Don't add more than 10 keywords.
  - The keywords should all be in lowercase.
  
  For the description:
  - The improvements should be relevant to the content on the page
  - If the description contains any special characters then output it between double quotes. 
  - Do not exceed 320 characters, which is the ideal Google search meta description length.
 
  Only respond with the same front matter between (and including) the "---" characters but with only the "keywords" and 
  "description" values updated. 
  
  Also include a new property on a new line of: "seoFrontMatterUpdated: true", to indicate that the front matter has 
  been updated. If "seoFrontMatterUpdated: false" exists, flip it to true.  
  
  Do not update any of the other values, or change the order of the properties as they appear, and don't include any other 
  text. 
  
  Take into account this additional context for this page (if there is any):
  ** START OF ADDITIONAL CONTEXT **
  ${additionalContext}
  ** END OF ADDITIONAL CONTEXT **
  
  
  Here is the actual content of the page: 
  ** START OF ACTUAL CONTENT **
  ${content}
  ** END OF ACTUAL CONTENT **
  `
}

// improveSEO function to call OpenAI API and get the improved front matter
async function improveSEO(fileContent) {

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: promptGenerator(fileContent) }],
    model: 'gpt-4',
  });

  console.log("improved front matter", completion.choices[0].message.content);

  return completion.choices[0].message.content;
}

// Function to extract front matter from the content
function extractFrontMatter(content) {
  const match = content.match(/---\n([\s\S]*?)\n---/);
  if (match) {
    return match[1];
  }
  return null;
}

// Function to process the file and update the front matter
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

// Function to traverse the directory or file and process recursively
async function processPath(inputPath) {
  const stats = fs.statSync(inputPath);

  if (stats.isDirectory()) {
    const files = fs.readdirSync(inputPath);

    for (const file of files) {
      const filePath = path.join(inputPath, file);

      if (fs.statSync(filePath).isDirectory()) {
        await processPath(filePath);
      } else if (path.extname(filePath) === '.mdx' && !file.startsWith('_')) {
        await processFile(filePath);
        console.log(`Processed ${filePath}. Waiting 2s \n`);
        await delay(2000);  // Waiting for 2 seconds after each API call
        console.log(`Finished waiting. Proceeding \n`);
      }
    }
  } else if (stats.isFile() && path.extname(inputPath) === '.mdx' && !path.basename(inputPath).startsWith('_')) {
    await processFile(inputPath);
    console.log(`Processed ${inputPath}. Waiting 2s \n`);
    await delay(2000);  // Waiting for 2 seconds after each API call
    console.log(`Finished waiting. Proceeding \n`);
  }
}

// Do it
processPath("../docs" + targetPath);
