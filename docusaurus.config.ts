import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import path from "path";

const config: Config = {
  title: 'Hasura GraphQL Docs',
  tagline: 'Instant GraphQL on all your data',
  favicon: 'img/favicon.ico',

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
    // image: 'img/docusaurus-social-card.jpg',
    // navbar: {
    //   title: '',
    //   logo: {
    //     alt: 'My Site Logo',
    //     src: 'img/logo.svg',
    //   },
    //   items: [
    //     // {
    //     //   type: 'docSidebar',
    //     //   sidebarId: 'tutorialSidebar',
    //     //   position: 'left',
    //     //   label: 'Tutorial',
    //     // },
    //     // {
    //     //   href: 'https://github.com/facebook/docusaurus',
    //     //   label: 'GitHub',
    //     //   position: 'right',
    //     // },
    //   ],
    // },
    // footer: {
    //   style: 'dark',
    //   links: [
    //     {
    //       title: 'Docs',
    //       items: [
    //         {
    //           label: 'Tutorial',
    //           to: '/docs/intro',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Community',
    //       items: [
    //         {
    //           label: 'Stack Overflow',
    //           href: 'https://stackoverflow.com/questions/tagged/docusaurus',
    //         },
    //         {
    //           label: 'Discord',
    //           href: 'https://discordapp.com/invite/docusaurus',
    //         },
    //         {
    //           label: 'Twitter',
    //           href: 'https://twitter.com/docusaurus',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'More',
    //       items: [
    //         {
    //           label: 'GitHub',
    //           href: 'https://github.com/facebook/docusaurus',
    //         },
    //       ],
    //     },
    //   ],
    //   copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    // },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
