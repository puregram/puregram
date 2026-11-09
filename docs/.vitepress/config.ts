import { defineConfig } from 'vitepress'

// shared by both /reference/ (overview) and /api/ (generated pages) so the
// generated methods/objects/updates/filters pages show the same sidebar
const referenceSidebar = [
  {
    text: '★ api reference',
    items: [
      { text: 'overview', link: '/reference/api' },
      { text: 'methods', link: '/api/methods' },
      { text: 'objects', link: '/api/objects' },
      { text: 'updates', link: '/api/updates' },
      { text: 'filters', link: '/api/filters' },
      { text: 'errors', link: '/reference/errors' },
      { text: 'Telegram client', link: '/reference/client' }
    ]
  }
]

export default defineConfig({
  title: 'puregram',
  description: 'powerful and modern telegram bot api sdk for node.js and typescript',
  lang: 'en-US',
  cleanUrls: true,

  // dark by default to match the landing; the light toggle still works
  appearance: 'dark',

  // docs are served at puregram.cool/docs (landing keeps the root)
  base: '/docs/',

  head: [
    // base does not auto-prefix head entries — point at the public asset under base
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/docs/logo.svg' }]
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'guide', link: '/guide/getting-started/introduction' },
      { text: 'plugins', link: '/plugins/' },
      { text: 'api', link: '/reference/api' },
      { text: 'examples', link: '/examples' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '★ getting started',
          items: [
            { text: 'introduction', link: '/guide/getting-started/introduction' },
            { text: 'installation', link: '/guide/getting-started/installation' },
            { text: 'your first bot', link: '/guide/getting-started/your-first-bot' },
            { text: 'ai assistance', link: '/guide/getting-started/ai-assistance' }
          ]
        },
        {
          text: '★ core concepts',
          items: [
            { text: 'the Telegram client', link: '/guide/concepts/the-telegram-client' },
            { text: 'updates', link: '/guide/concepts/updates' },
            { text: 'the three-layer api', link: '/guide/concepts/three-layer-api' },
            { text: 'shortcuts', link: '/guide/concepts/shortcuts' },
            { text: 'plugins & .extend', link: '/guide/concepts/plugins' },
            { text: 'custom updates', link: '/guide/concepts/custom-updates' },
            { text: 'error handling', link: '/guide/concepts/error-handling' },
            { text: 'debugging', link: '/guide/concepts/debugging' }
          ]
        },
        {
          text: '★ handling updates',
          items: [
            { text: 'dispatch & filters', link: '/guide/handling-updates/dispatch-and-filters' },
            { text: 'priority & propagation', link: '/guide/handling-updates/priority-and-propagation' },
            { text: 'middlewares', link: '/guide/handling-updates/middlewares' },
            { text: 'hooks', link: '/guide/handling-updates/hooks' },
            { text: 'service events', link: '/guide/handling-updates/service-events' }
          ]
        },
        {
          text: '★ working with telegram',
          items: [
            { text: 'messages & media', link: '/guide/telegram/messages-and-media' },
            { text: 'keyboards', link: '/guide/telegram/keyboards' },
            { text: 'formatting text', link: '/guide/telegram/formatting-text' },
            { text: 'message extras', link: '/guide/telegram/message-extras' },
            { text: 'chat & admin', link: '/guide/telegram/chat-and-admin' },
            { text: 'polls & stickers', link: '/guide/telegram/polls-and-stickers' },
            { text: 'payments', link: '/guide/telegram/payments' },
            { text: 'inline mode', link: '/guide/telegram/inline-mode' }
          ]
        },
        {
          text: '★ deployment',
          items: [
            { text: 'polling', link: '/guide/deployment/polling' },
            { text: 'webhook', link: '/guide/deployment/webhook' },
            { text: 'telegram serverless', link: '/guide/deployment/serverless' },
            { text: 'resilience', link: '/guide/deployment/resilience' }
          ]
        },
        { text: 'migrating from v2', link: '/guide/migrating-from-v2' },
        { text: 'faq', link: '/guide/faq' }
      ],
      '/plugins/': [
        { text: 'overview', link: '/plugins/' },
        {
          text: '★ flow',
          items: [
            { text: 'overview', link: '/plugins/flow/' },
            { text: 'waiters', link: '/plugins/flow/waiters' },
            { text: 'prompt', link: '/plugins/flow/prompt' },
            { text: 'collect media group', link: '/plugins/flow/collect-media-group' },
            { text: 'persistent flows', link: '/plugins/flow/persistent-flows' }
          ]
        },
        {
          text: '★ markup',
          items: [
            { text: 'overview', link: '/plugins/markup/' },
            { text: 'builders', link: '/plugins/markup/builders' },
            { text: 'parsers', link: '/plugins/markup/parsers' },
            { text: 'codec', link: '/plugins/markup/codec' }
          ]
        },
        {
          text: '★ plugins',
          items: [
            { text: 'rich', link: '/plugins/rich' },
            { text: 'rich for LLMs', link: '/plugins/rich-llm-grammar' },
            { text: 'scenes', link: '/plugins/scenes' },
            { text: 'session', link: '/plugins/session' },
            { text: 'storage', link: '/plugins/storage' },
            { text: 'callback-data', link: '/plugins/callback-data' },
            { text: 'test', link: '/plugins/test' },
            { text: 'media-cacher', link: '/plugins/media-cacher' },
            { text: 'rate-limit', link: '/plugins/rate-limit' },
            { text: 'throttler', link: '/plugins/throttler' },
            { text: 'file-id', link: '/plugins/file-id' },
            { text: 'inline-message-id', link: '/plugins/inline-message-id' },
            { text: 'stream', link: '/plugins/stream' },
            { text: 'utils', link: '/plugins/utils' }
          ]
        }
      ],
      '/reference/': referenceSidebar,
      '/api/': referenceSidebar
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/puregram/puregram' }
    ]
  },

  // i18n-ready: only `root` (english) active now; adding `ru` later is a sibling
  // key + a docs/ru/ tree, no restructure
  locales: {
    root: { label: 'english', lang: 'en' }
  }
})
