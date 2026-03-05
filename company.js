// Theme — same as app.js
const SUN_ICON='<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>';
const MOON_ICON='<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>';
function setThemeIcon(){const i=document.querySelector('.theme-icon');i.innerHTML=document.body.classList.contains('light')?MOON_ICON:SUN_ICON}
function toggleTheme(){document.body.classList.toggle('light');localStorage.setItem('zhc-theme',document.body.classList.contains('light')?'light':'dark');setThemeIcon()}
document.getElementById('theme-toggle').addEventListener('click',toggleTheme);
if(localStorage.getItem('zhc-theme')==='light')document.body.classList.add('light');
setThemeIcon();

// Slug helper
function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Get company from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get('c');
const company = ZHC_DATA.find(z => slugify(z.name) === slug);

if (!company) {
  document.getElementById('company-page').innerHTML = `<div class="container"><div class="cp-not-found"><h2>Company not found</h2><p><a href="/">← Back to directory</a></p></div></div>`;
} else {
  document.title = `${company.name} — ZHC Directory`;
  document.querySelector('meta[name="description"]').content = company.desc;
  renderCompanyPage(company);
}

function renderCompanyPage(z) {
  const page = document.getElementById('company-page');
  
  // Tags
  const tags = z.categories.map(c => `<span class="tag tag-category">${c}</span>`).join('') +
    (z.token ? `<span class="tag tag-chain">${z.token.chain}</span>` : '') +
    `<span class="tag tag-status">${z.status}</span>`;

  // Token section
  let tokenHtml = '';
  if (z.token) {
    tokenHtml = `<div class="cp-section">
      <h3>Token</h3>
      <div class="cp-token-grid">
        <div class="cp-token-row"><span class="cp-label">Ticker</span><span class="cp-value">${z.token.ticker}</span></div>
        <div class="cp-token-row"><span class="cp-label">Chain</span><span class="cp-value">${z.token.chain}</span></div>
        <div class="cp-token-row"><span class="cp-label">Contract</span><span class="cp-value cp-address" id="token-addr" title="Click to copy">${z.token.address}</span></div>
        ${z.token.mcap ? `<div class="cp-token-row"><span class="cp-label">Market Cap</span><span class="cp-value">${z.token.mcap}</span></div>` : ''}
        <div class="cp-token-row"><span class="cp-label">Chart</span><span class="cp-value"><a href="${z.token.dex}" target="_blank">DexScreener ↗</a></span></div>
      </div>
    </div>`;
  }

  // Social icon SVGs
  const icons = {
    x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    website: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    github: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
    discord: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>',
    telegram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
  };

  // Agents section
  let agentsHtml = '';
  if (z.agents.length) {
    agentsHtml = `<div class="cp-section">
      <h3>AI Agents</h3>
      <div class="cp-agents">${z.agents.map(a => {
        const xHandle = a.socials?.x ? a.socials.x.split('x.com/')[1]?.replace(/\/.*$/,'') : '';
        const pfp = xHandle ? `<img src="https://unavatar.io/x/${xHandle}" alt="${a.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <span class="cp-agent-avatar-fallback" style="display:none">🤖</span>` : `<span class="cp-agent-avatar-fallback">🤖</span>`;
        
        const agentSocials = Object.entries(a.socials || {}).map(([key, url]) => 
          `<a href="${url}" target="_blank" class="cp-agent-social" title="${key}">${icons[key] || key}</a>`
        ).join('');

        return `<div class="cp-agent-card">
          <div class="cp-agent-avatar">${pfp}</div>
          <div class="cp-agent-info">
            <div class="cp-agent-name">${a.name}</div>
            ${a.role ? `<div class="cp-agent-role">${a.role}</div>` : ''}
            <div class="cp-agent-socials">${agentSocials}</div>
          </div>
        </div>`;
      }).join('')}</div>
    </div>`;
  }

  // Products
  const productsHtml = z.products?.length ? `<div class="cp-section">
    <h3>Products & Services</h3>
    <div class="cp-pills">${z.products.map(p => `<span class="cp-pill">${p}</span>`).join('')}</div>
  </div>` : '';

  // Stack
  const stackHtml = z.stack?.length ? `<div class="cp-section">
    <h3>Tech Stack</h3>
    <div class="cp-pills">${z.stack.map(s => `<span class="cp-pill cp-pill-stack">${s}</span>`).join('')}</div>
  </div>` : '';

  // Company socials
  const socials = [];
  if (z.socials.website) socials.push(`<a href="${z.socials.website}" target="_blank" class="cp-social">Website ↗</a>`);
  if (z.socials.x) socials.push(`<a href="${z.socials.x}" target="_blank" class="cp-social">X / Twitter ↗</a>`);
  if (z.socials.github) socials.push(`<a href="${z.socials.github}" target="_blank" class="cp-social">GitHub ↗</a>`);
  if (z.socials.discord) socials.push(`<a href="${z.socials.discord}" target="_blank" class="cp-social">Discord ↗</a>`);
  const socialsHtml = socials.length ? `<div class="cp-section">
    <h3>Company Links</h3>
    <div class="cp-socials">${socials.join('')}</div>
  </div>` : '';

  // Team
  const teamHtml = `<div class="cp-section">
    <h3>Team</h3>
    <div class="cp-team-grid">
      ${z.founder ? `<div class="cp-team-row"><span class="cp-label">Founder</span><span class="cp-value">${z.founder}</span></div>` : ''}
      <div class="cp-team-row"><span class="cp-label">Humans</span><span class="cp-value">${z.humans}</span></div>
      <div class="cp-team-row"><span class="cp-label">AI Agents</span><span class="cp-value">${z.aiAgents}</span></div>
      <div class="cp-team-row"><span class="cp-label">Founded</span><span class="cp-value">${z.founded}</span></div>
    </div>
  </div>`;

  page.innerHTML = `<div class="container">
    <div class="cp-header">
      <div class="cp-logo">${z.logo}</div>
      <div>
        <h1 class="cp-name">${z.name}</h1>
        <p class="cp-desc">${z.desc}</p>
        <div class="cp-tags">${tags}</div>
      </div>
    </div>
    <div class="cp-grid">
      <div class="cp-main">
        ${tokenHtml}
        ${agentsHtml}
        ${productsHtml}
        ${stackHtml}
      </div>
      <div class="cp-sidebar">
        ${teamHtml}
        ${socialsHtml}
      </div>
    </div>
  </div>`;

  // Copy address handler
  const addrEl = document.getElementById('token-addr');
  if (addrEl) {
    addrEl.style.cursor = 'pointer';
    addrEl.addEventListener('click', () => {
      navigator.clipboard.writeText(z.token.address).then(() => {
        addrEl.textContent = 'Copied!';
        setTimeout(() => { addrEl.textContent = z.token.address; }, 1500);
      });
    });
  }
}
