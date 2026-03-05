// ZHC Directory — App Logic

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

  // Socials
  const socialLinks = [];
  if (z.socials.website) socialLinks.push(`<a href="${z.socials.website}" target="_blank" class="social-link">Website</a>`);
  if (z.socials.x) socialLinks.push(`<a href="${z.socials.x}" target="_blank" class="social-link">X</a>`);
  if (z.socials.github) socialLinks.push(`<a href="${z.socials.github}" target="_blank" class="social-link">GitHub</a>`);
  if (z.socials.discord) socialLinks.push(`<a href="${z.socials.discord}" target="_blank" class="social-link">Discord</a>`);
  
  // Agent socials (with robot badge)
  z.agents.forEach(a => {
    socialLinks.push(`<a href="${a.url}" target="_blank" class="social-link agent">${a.name} (${a.platform})</a>`);
  });

  return `<div class="card">
    ${agentBadge}
    <div class="card-header">
      <div class="card-logo">${z.logo}</div>
      <div class="card-info">
        <div class="card-name"><a href="${z.url}" target="_blank" style="color:inherit;text-decoration:none">${z.name}</a></div>
        <div class="card-desc">${z.desc}</div>
      </div>
    </div>
    <div class="card-tags">${tags}</div>
    ${tokenHtml}
    <div class="card-socials">${socialLinks.join('')}</div>
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

// Init
renderFilters();
renderGrid();
updateStats();
