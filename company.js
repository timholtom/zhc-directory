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

  // Agents section
  let agentsHtml = '';
  if (z.agents.length) {
    agentsHtml = `<div class="cp-section">
      <h3>AI Agents</h3>
      <div class="cp-agents">${z.agents.map(a => `
        <a href="${a.url}" target="_blank" class="cp-agent-card">
          <div class="cp-agent-icon">🤖</div>
          <div class="cp-agent-info">
            <div class="cp-agent-name">${a.name}</div>
            ${a.role ? `<div class="cp-agent-role">${a.role}</div>` : ''}
            <div class="cp-agent-platform">${a.platform}</div>
          </div>
        </a>
      `).join('')}</div>
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
