import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

require('dotenv').config();

const config: Config = {
  title: 'Hasura GraphQL Docs',
  tagline: 'Instant GraphQL on all your data',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://hasura.io',

  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'hasura', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  staticDirectories: ['static', 'public'],

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: {
    docsBotEndpointURL:
      process.env.NODE_ENV === 'development'
        ? 'ws://localhost:8000/hasura-docs-ai'
        : 'wss://website-api.hasura.io/chat-bot/hasura-docs-ai',
    hasuraVersion: 3,
    DEV_TOKEN: process.env.DEV_TOKEN,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          // editUrl: ({ docPath }) => `https://github.com/hasura/graphql-engine/edit/master/docs/docs/${docPath}`,
          exclude: ['**/*.wip'],
          breadcrumbs: true,
          // showLastUpdateAuthor: true,
          // showLastUpdateTime: true,
          lastVersion: 'current',
          versions: {
            current: {
              label: 'v3.x alpha',
              badge: true,
            },
          },
          sidebarCollapsible: true,
          sidebarPath: './sidebars.ts',

          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        googleTagManager: {
            containerId: 'GTM-PF5MQ2Z',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'wiki',
        path: 'wiki',
        routeBasePath: 'wiki',
        exclude: ['**/*.wip'],
        // sidebarPath: './sidebarsCommunity.js',
        // ... other options
      },
    ],
    async function tailwind(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    algolia: {
      appId: '7M3BTIV34B',
      // Public API key: it is safe to commit it
      apiKey: '10f3d9d2cd836eec903fcabbd6d50139',
      indexName: 'hasura',
    },
    announcementBar: {
      id: 'announcementBar-3', // Increment on change
      content: `This is the documentation for Hasura DDN, the future of data delivery. <a target="_blank" rel="noopener noreferrer" href="https://hasura.io/docs/latest/index/">Click here for the Hasura v2.x docs</a>.`,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo-dark.svg',
        srcDark: '/img/logo-light.svg',
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              href: 'https://hasura.io/docs/',
              label: 'v2.x',
            },
            {
              href: 'https://hasura.io/docs/1.0/graphql/core/index.html',
              label: 'v1.x',
            },
          ],
        },
        // {
        //   type: 'search',
        //   position: 'left',
        // },
        {
          to: 'https://hasura.io/',
          label: 'Hasura.io',
          position: 'right',
        },
        {
          to: 'https://hasura.io/learn/',
          label: 'Tutorials',
          position: 'right',
        },
        // {
        //   to: 'https://cloud.hasura.io/login',
        //   label: 'Log In',
        //   position: 'right',
        // },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
