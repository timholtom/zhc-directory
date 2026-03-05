// ZHC Directory — App Logic

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const grid = document.getElementById('grid');
const searchInput = document.getElementById('search');
const filterTagsEl = document.getElementById('filter-tags');
let activeFilter = 'All';

// Extract all unique categories
const allCategories = ['All', ...new Set(ZHC_DATA.flatMap(z => z.categories))].sort((a,b) => a === 'All' ? -1 : a.localeCompare(b));

// Render filter tags
function renderFilters() {
  filterTagsEl.innerHTML = allCategories.map(cat => 
    `<button class="filter-tag ${cat === activeFilter ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
  ).join('');
  
  filterTagsEl.querySelectorAll('.filter-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.cat;
      renderFilters();
      renderGrid();
    });
  });
}

// Render cards
function renderGrid() {
  const query = searchInput.value.toLowerCase();
  const filtered = ZHC_DATA.filter(z => {
    const matchSearch = !query || 
      z.name.toLowerCase().includes(query) ||
      z.desc.toLowerCase().includes(query) ||
      (z.token?.ticker || '').toLowerCase().includes(query) ||
      z.categories.some(c => c.toLowerCase().includes(query)) ||
      z.agents.some(a => a.name.toLowerCase().includes(query));
    const matchCat = activeFilter === 'All' || z.categories.includes(activeFilter);
    return matchSearch && matchCat;
  });

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty"><h3>No companies found</h3><p>Try a different search or filter.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(z => renderCard(z)).join('');
  
  // Attach copy handlers
  grid.querySelectorAll('.copy-addr').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(btn.dataset.addr).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = btn.dataset.addr.slice(0,6) + '...' + btn.dataset.addr.slice(-4); }, 1500);
      });
    });
  });
}

function renderCard(z) {
  const agentCount = z.agents.length;
  const agentBadge = agentCount ? `<div class="card-agents">${agentCount} agent${agentCount > 1 ? 's' : ''}</div>` : '';
  
  // Tags
  const tags = z.categories.map(c => `<span class="tag tag-category">${c}</span>`).join('') +
    (z.token ? `<span class="tag tag-chain">${z.token.chain}</span>` : '') +
    `<span class="tag tag-status">${z.status}</span>`;

  // Founder line
  const founderHtml = z.founder ? `<div class="card-founder">Founded by ${z.founder}</div>` : '';

  // Token row
  let tokenHtml = '';
  if (z.token) {
    const shortAddr = z.token.address.slice(0,6) + '...' + z.token.address.slice(-4);
    tokenHtml = `<div class="card-token">
      <span class="token-ticker">${z.token.ticker}</span>
      <span class="token-chain">${z.token.chain}</span>
      <span class="token-address copy-addr" data-addr="${z.token.address}" title="Click to copy">${shortAddr}</span>
      <div class="token-links">
        ${z.token.mcap ? `<span class="token-link">${z.token.mcap}</span>` : ''}
        <a href="${z.token.dex}" target="_blank" class="token-link">Chart ↗</a>
      </div>
    </div>`;
  }

  // Agents section — separate from company socials
  let agentsHtml = '';
  if (z.agents.length) {
    agentsHtml = `<div class="card-agents-section">
      <div class="card-section-label">Agents</div>
      <div class="card-agent-list">${z.agents.map(a => 
        `<a href="${a.url}" target="_blank" class="agent-chip">
          <span class="agent-icon">🤖</span>
          <span class="agent-name">${a.name}</span>
          ${a.role ? `<span class="agent-role">${a.role}</span>` : ''}
          <span class="agent-platform">${a.platform}</span>
        </a>`
      ).join('')}</div>
    </div>`;
  }

  // Company socials — clearly labelled
  const socialLinks = [];
  if (z.socials.website) socialLinks.push(`<a href="${z.socials.website}" target="_blank" class="social-link">Website</a>`);
  if (z.socials.x) socialLinks.push(`<a href="${z.socials.x}" target="_blank" class="social-link">X</a>`);
  if (z.socials.github) socialLinks.push(`<a href="${z.socials.github}" target="_blank" class="social-link">GitHub</a>`);
  if (z.socials.discord) socialLinks.push(`<a href="${z.socials.discord}" target="_blank" class="social-link">Discord</a>`);
  
  const socialsHtml = socialLinks.length ? `<div class="card-socials-section">
    <div class="card-section-label">Company</div>
    <div class="card-socials">${socialLinks.join('')}</div>
  </div>` : '';

  const companyUrl = `company.html?c=${slugify(z.name)}`;

  return `<div class="card">
    ${agentBadge}
    <div class="card-header">
      <div class="card-logo">${z.logo}</div>
      <div class="card-info">
        <div class="card-name"><a href="${companyUrl}" style="color:inherit;text-decoration:none">${z.name}</a></div>
        <div class="card-desc">${z.desc}</div>
        ${founderHtml}
      </div>
    </div>
    <div class="card-tags">${tags}</div>
    ${tokenHtml}
    ${agentsHtml}
    ${socialsHtml}
  </div>`;
}

// Stats
function updateStats() {
  document.getElementById('total-count').textContent = ZHC_DATA.length;
  document.getElementById('token-count').textContent = ZHC_DATA.filter(z => z.token).length;
  document.getElementById('category-count').textContent = allCategories.length - 1; // minus "All"
}

// Search
searchInput.addEventListener('input', renderGrid);

// Theme — SVG icons from btc-quantum
const SUN_ICON='<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>';
const MOON_ICON='<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>';

function setThemeIcon() {
  const icon = document.querySelector('.theme-icon');
  icon.innerHTML = document.body.classList.contains('light') ? MOON_ICON : SUN_ICON;
}

function toggleTheme() {
  document.body.classList.toggle('light');
  localStorage.setItem('zhc-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  setThemeIcon();
}

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
if (localStorage.getItem('zhc-theme') === 'light') document.body.classList.add('light');
setThemeIcon();

// Init
renderFilters();
renderGrid();
updateStats();
