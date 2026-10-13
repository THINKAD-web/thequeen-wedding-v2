#!/usr/bin/env node
/** Inject shared mobile hamburger into static HTML pages. */

const fs = require('fs');
const path = require('path');
const {
  MOBILE_MENU_STYLES,
  renderMobileHeaderActions,
  renderMobileMenuOverlayStatic,
  MOBILE_NAV_SCRIPT,
} = require('../data/site-nav');
const { LEGACY_PAGES } = require('./build-shared-layout');

const ROOT = path.resolve(__dirname, '..');

const LEGACY_TEL_ONLY =
  /<a href="tel:054-283-1111" class="lg:hidden rounded-full bg-royal-900 px-4 py-2 text-xs font-semibold text-white">상담<\/a>/;

function upgradeMobileNavHtml(html) {
  let out = html;
  if (!out.includes('id="menuBtn"')) {
    out = out.replace(LEGACY_TEL_ONLY, renderMobileHeaderActions());
  }
  if (!out.includes('id="menuOverlay"')) {
    out = out.replace(/<\/header>\s*\n/, `</header>\n${renderMobileMenuOverlayStatic()}\n`);
  }
  if (!out.includes('.menu-overlay')) {
    out = out.replace('</style>', `${MOBILE_MENU_STYLES}\n</style>`);
  }
  if (!out.includes('site-mobile-nav.js')) {
    out = out.replace(
      '<script src="/chatbot/embed.js"',
      `${MOBILE_NAV_SCRIPT}\n<script src="/chatbot/embed.js"`,
    );
  }
  return out;
}

function applyMobileNav() {
  console.log('\nApplying shared mobile nav:');
  const files = LEGACY_PAGES.map((p) => p.file);
  for (const file of files) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue;
    const html = fs.readFileSync(full, 'utf8');
    const next = upgradeMobileNavHtml(html);
    if (next !== html) {
      fs.writeFileSync(full, next, 'utf8');
      console.log(`  ✓ ${file}`);
    } else {
      console.log(`  · ${file} (already has mobile nav)`);
    }
  }
}

module.exports = { applyMobileNav, upgradeMobileNavHtml };

if (require.main === module) applyMobileNav();
