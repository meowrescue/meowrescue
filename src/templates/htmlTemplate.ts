import { SEO_DOMAIN, navLinks } from '@/utils/seo';
import { HelmetServerState } from 'react-helmet-async';

interface HtmlTemplateProps {
  html: string;
  helmet: HelmetServerState;
  state: any;
  url: string;
  hasContent: boolean;
}

export function generateHtmlTemplate({ html, helmet, state, url, hasContent }: HtmlTemplateProps) {
  const baseUrl = SEO_DOMAIN;
  
  // Create scripts for both React Query state and page data
  const stateScript = `
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify(state).replace(/</g, '\\u003c')}
    </script>
  `;
  
  // Add page data script if available
  const pageDataScript = state.pageData ? `
    <script id="__PAGE_DATA__" type="application/json">
      ${JSON.stringify(state.pageData).replace(/</g, '\\u003c')}
    </script>
  ` : '';

  // Component initialization script for static HTML
  const componentInitScript = `
    <script>
      // Initialize UI components before React hydration
      (function() {
        // Initialize dropdown toggles for navbar and other components
        document.addEventListener('DOMContentLoaded', function() {
          // Handle dropdowns
          const dropdownToggles = document.querySelectorAll('[data-dropdown-toggle]');
          dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
              e.preventDefault();
              const targetId = this.getAttribute('data-dropdown-toggle');
              const target = document.getElementById(targetId);
              if (target) {
                const isVisible = target.classList.contains('block');
                target.classList.toggle('hidden', isVisible);
                target.classList.toggle('block', !isVisible);
              }
            });
          });

          // Initialize filter toggles for transparency page
          const filterToggles = document.querySelectorAll('[data-filter-toggle]');
          filterToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
              e.preventDefault();
              const targetId = this.getAttribute('data-filter-toggle');
              const target = document.getElementById(targetId);
              if (target) {
                const isVisible = target.classList.contains('block');
                target.classList.toggle('hidden', isVisible);
                target.classList.toggle('block', !isVisible);
              }
            });
          });

          // Setup tabs for component initialization
          const tabToggles = document.querySelectorAll('[data-tab-toggle]');
          tabToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
              e.preventDefault();
              const targetId = this.getAttribute('data-tab-toggle');
              const tabGroup = this.closest('[data-tab-group]')?.getAttribute('data-tab-group');
              
              // Hide all tabs in the same group
              if (tabGroup) {
                document.querySelectorAll('[data-tab-content="' + tabGroup + '"]').forEach(tab => {
                  tab.classList.add('hidden');
                });
                document.querySelectorAll('[data-tab-toggle][data-tab-group="' + tabGroup + '"]').forEach(btn => {
                  btn.classList.remove('bg-primary', 'text-white');
                  btn.classList.add('bg-gray-100', 'text-gray-700');
                });
              }
              
              // Show selected tab
              const target = document.getElementById(targetId);
              if (target) {
                target.classList.remove('hidden');
                this.classList.remove('bg-gray-100', 'text-gray-700');
                this.classList.add('bg-primary', 'text-white');
              }
            });
          });
        });
      })();
    </script>
  `;

  return `<!DOCTYPE html>
<html ${helmet?.htmlAttributes?.toString() || 'lang="en"'}>
  <head>
    <meta charset="UTF-8" />
    ${helmet?.title?.toString() || '<title>MeowRescue - Cat Adoption & Foster Care</title>'}
    ${helmet?.meta?.toString() || '<meta name="description" content="MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need." />'}
    ${helmet?.link?.toString() || ''}
    ${helmet?.style?.toString() || ''}
    ${helmet?.script?.toString() || ''}
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="sitemap" type="application/xml" href="${baseUrl}/sitemap.xml" />
    <link rel="canonical" href="${baseUrl}${url}" />
    <style>
      body { margin: 0; padding: 0; background-color: #F7F8FC; font-family: 'Open Sans', sans-serif; }
      .site-header { background-color: rgba(255, 255, 255, 0.95); box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
      h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; margin-top: 0; }
      /* Hide fallback when SSG content is present */
      #ssg-content ~ .fallback-content { display: none; }
      .fallback-content { max-width: 1200px; margin: 0 auto; padding: 20px; }
      .visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
      @media (max-width: 768px) { body { font-size: 16px; } h1 { font-size: 1.8rem; } h2 { font-size: 1.5rem; } }
    </style>
    <link rel="preload" as="style" href="/assets/index.css" />
    <link rel="stylesheet" href="/assets/index.css" />
    ${componentInitScript}
    ${pageDataScript}
  </head>
  <body ${helmet?.bodyAttributes?.toString() || ''}>
    <div id="ssg-content">${html}</div>
    <div id="root"></div>
    ${stateScript}
    <script type="module" src="/assets/main.js" defer></script>
  </body>
</html>`;
}
