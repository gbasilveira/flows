import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Flows',
  description: 'A stateful, secure, JavaScript-embedded DAG workflow executor designed for frontend applications',
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API Reference', link: '/api/core' },
      { text: 'Examples', link: '/examples/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Core Concepts', link: '/guide/core-concepts' }
          ]
        },
        {
          text: 'Configuration',
          items: [
            { text: 'Storage Options', link: '/guide/storage' },
            { text: 'Security Features', link: '/guide/security' },
            { text: 'Logging', link: '/guide/logging' }
          ]
        },
        {
          text: 'Workflows',
          items: [
            { text: 'Creating Workflows', link: '/guide/workflows' },
            { text: 'Node Types', link: '/guide/node-types' },
            { text: 'Dependencies', link: '/guide/dependencies' },
            { text: 'Custom Node Executors', link: '/guide/custom-executors' }
          ]
        },
        {
          text: 'Event System',
          items: [
            { text: 'Event-Driven Workflows', link: '/guide/events' },
            { text: 'Waiting for Events', link: '/guide/event-handling' },
            { text: 'Event History', link: '/guide/event-history' }
          ]
        },
        {
          text: 'Failure Handling',
          items: [
            { text: 'Overview', link: '/guide/failure-handling' },
            { text: 'Retry Strategies', link: '/guide/retry-strategies' },
            { text: 'Circuit Breaker', link: '/guide/circuit-breaker' },
            { text: 'Dead Letter Queue', link: '/guide/dead-letter-queue' },
            { text: 'Monitoring & Alerts', link: '/guide/monitoring' },
            { text: 'Poison Messages', link: '/guide/poison-messages' }
          ]
        },
        {
          text: 'Advanced Topics',
          items: [
            { text: 'Workflow State Management', link: '/guide/state-management' },
            { text: 'Performance Optimization', link: '/guide/performance' },
            { text: 'Enterprise Configuration', link: '/guide/enterprise' },
            { text: 'Testing Workflows', link: '/guide/testing' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Core Classes', link: '/api/core' },
            { text: 'Utility Functions', link: '/api/utilities' },
            { text: 'Types & Interfaces', link: '/api/types' },
            { text: 'Enums', link: '/api/enums' },
            { text: 'Configuration', link: '/api/configuration' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Simple Workflow', link: '/examples/simple-workflow' },
            { text: 'Subflow Patterns', link: '/examples/subflow-patterns' },
            { text: 'Failure Handling', link: '/examples/failure-handling' },
            { text: 'Event-Driven Workflows', link: '/examples/event-driven' },
            { text: 'Custom Node Executors', link: '/examples/custom-executors' },
            { text: 'Enterprise Patterns', link: '/examples/enterprise' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/flows' }
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/your-org/flows/edit/main/docs/:path'
    },

    footer: {
      message: 'Released under the ISC License.',
      copyright: 'Copyright © 2024 Flows'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
}) 