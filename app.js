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
  // Tags (categories only)
  const tags = z.categories.map(c => `<span class="tag tag-category">${c}</span>`).join('');
  
  // Status dot (top right)
  const statusColor = z.status === 'Active' ? 'green' : z.status === 'Experimental' ? 'yellow' : 'red';
  const statusDot = `<div class="card-status card-status-${statusColor}"><span class="status-dot"></span>${z.status}</div>`;

  // No founder on card — lives on detail page

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

  // SVG icons for socials
  const socialIcons = {
    x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    website: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    github: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
    discord: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>',
    telegram: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
  };

  // Agents section — prominent with profile pics + social icons
  let agentsHtml = '';
  if (z.agents.length) {
    agentsHtml = `<div class="card-agents-section">
      <div class="card-section-label">Agents</div>
      <div class="card-agent-list">${z.agents.map(a => {
        const xHandle = a.socials?.x ? a.socials.x.split('x.com/')[1]?.replace(/\/.*$/,'') : '';
        const pfp = xHandle ? `<img src="https://unavatar.io/x/${xHandle}" alt="${a.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <span class="agent-avatar-fallback" style="display:none">🤖</span>` : `<span class="agent-avatar-fallback">🤖</span>`;
        
        return `<div class="agent-chip">
          <div class="agent-avatar">${pfp}</div>
          <div class="agent-details">
            <span class="agent-name">${a.name}</span>
            ${a.role ? `<span class="agent-role">${a.role}</span>` : ''}
          </div>
        </div>`;
      }).join('')}</div>
    </div>`;
  }

  // No external links on card — all on detail page

  const companyUrl = `company.html?c=${slugify(z.name)}`;

  return `<a href="${companyUrl}" class="card" style="text-decoration:none;color:inherit">
    ${statusDot}
    <div class="card-header">
      <div class="card-logo">${z.url ? `<img src="https://www.google.com/s2/favicons?domain=${new URL(z.url).hostname}&sz=128" alt="${z.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="card-logo-fallback" style="display:none">${z.logo}</span>` : z.logo}</div>
      <div class="card-info">
        <div class="card-name">${z.name}</div>
        <div class="card-desc">${z.desc}</div>
      </div>
    </div>
    <div class="card-tags">${tags}</div>
    ${agentsHtml}
    ${tokenHtml}
  </a>`;
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
