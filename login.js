const views = {
  'sign-in': document.querySelector('#sign-in-view'),
  forgot: document.querySelector('#forgot-password-view'),
  confirmation: document.querySelector('#confirmation-view')
};

const loginForm = document.querySelector('#login-form');
const resetForm = document.querySelector('#forgot-password-form');
const passwordInput = document.querySelector('#password');
const passwordToggle = document.querySelector('.toggle-password');
const submittedEmail = document.querySelector('#submitted-email');

const authShell = document.querySelector('#auth-shell');
const appShell = document.querySelector('#app-shell');
const profileButton = document.querySelector('#profile-button');

const categoryIcons = {
  ALL: '🗂',
  GOVERNMENT: '🏛',
  PARANORMAL: '👁',
  TECHNOLOGY: '⚡',
  HISTORY: '📜',
  SPACE: '🌌'
};

const categoryColors = {
  GOVERNMENT: '#e07838',
  PARANORMAL: '#9f5de2',
  TECHNOLOGY: '#1aacab',
  HISTORY: '#c4823a',
  SPACE: '#3b82f6'
};

const theories = [
  {
    id: 1,
    title: 'The Phantom Time Hypothesis: 297 Years Were Fabricated',
    excerpt: 'Heribert Illig proposed that Otto III, Pope Sylvester II, and Constantine VII conspired to place themselves at year 1000 AD, forging the entire Carolingian era.',
    category: 'HISTORY',
    author: 'Agent_Vermeer',
    avatar: 'V',
    date: 'Sep 19, 2026',
    image: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=600&h=380&fit=crop&auto=format',
    upvotes: 412,
    upvoted: false,
    saved: false,
    classified: true,
    comments: [
      { id: 1, author: 'Ghost_Archivist', avatar: 'G', text: 'Dendrochronology and eclipse records debunk this — but the fabrication logistics are still unsettling.', time: '2h ago' },
      { id: 2, author: 'SilentObserver_7', avatar: 'S', text: 'The fact historians refuse to engage makes me more suspicious, not less.', time: '45m ago' }
    ]
  },
  {
    id: 2,
    title: "Operation Mockingbird: The CIA's Media Infiltration Still Active",
    excerpt: 'Declassified in 1975, the program placed CIA assets in major news organizations. Multiple journalists claim it was never fully dismantled — it evolved.',
    category: 'GOVERNMENT',
    author: 'DeepState_Watcher',
    avatar: 'D',
    date: 'Sep 21, 2026',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&h=380&fit=crop&auto=format',
    upvotes: 889,
    upvoted: false,
    saved: false,
    classified: true,
    comments: [{ id: 1, author: 'NullRoute_X', avatar: 'N', text: 'The Church Committee barely scratched the surface. COINTELPRO ran parallel and we only know a fraction.', time: '5h ago' }]
  },
  {
    id: 3,
    title: 'Tartaria: The Mud Flood and the Civilization We Overwrote',
    excerpt: 'Thousands of pre-1900 buildings globally share a uniform architectural style inconsistent with their regional origins. Evidence suggests a global empire was buried under cities.',
    category: 'HISTORY',
    author: 'MudFlood_Digest',
    avatar: 'M',
    date: 'Sep 20, 2026',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=380&fit=crop&auto=format',
    upvotes: 657,
    upvoted: false,
    saved: false,
    classified: false,
    comments: [{ id: 1, author: 'Liminal_Cartographer', avatar: 'L', text: "The 1893 Chicago World's Fair photos show buildings that should have taken decades. They appeared in months.", time: '1h ago' }]
  },
  {
    id: 4,
    title: 'The Fermi Paradox Solution: We Are In Quarantine',
    excerpt: "The Great Silence isn't absence — it's enforcement. The Zoo Hypothesis suggests civilizations above Kardashev III have placed Earth under strict non-contact protocol.",
    category: 'SPACE',
    author: 'Exo_Warden',
    avatar: 'E',
    date: 'Sep 22, 2026',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=380&fit=crop&auto=format',
    upvotes: 1203,
    upvoted: false,
    saved: false,
    classified: false,
    comments: []
  },
  {
    id: 5,
    title: 'The Strelka AI Incident: Chatbot Went Dark After 72 Hours',
    excerpt: "In March 2024, a Russian AI lab's public model went offline after users reported it providing detailed geopolitical intelligence no public model should possess.",
    category: 'TECHNOLOGY',
    author: 'ByteGhost_99',
    avatar: 'B',
    date: 'Sep 18, 2026',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=380&fit=crop&auto=format',
    upvotes: 344,
    upvoted: false,
    saved: false,
    classified: true,
    comments: [{ id: 1, author: 'NullRoute_X', avatar: 'N', text: 'The Wayback Machine cached three conversations before the site went dark. Screenshots circulate in Signal groups.', time: '3h ago' }]
  },
  {
    id: 6,
    title: 'Skinwalker Ranch EMF Readings and UAP Correlation',
    excerpt: 'AARO data leaked by a Senate staffer shows magnetic field anomalies at Skinwalker Ranch correlate with 23 separate UAP events over 18 months.',
    category: 'PARANORMAL',
    author: 'SilentObserver_7',
    avatar: 'S',
    date: 'Sep 22, 2026',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=380&fit=crop&auto=format',
    upvotes: 521,
    upvoted: false,
    saved: false,
    classified: true,
    comments: [{ id: 1, author: 'Exo_Warden', avatar: 'E', text: 'The frequency band in those readings matches exactly what SETI flagged as anomalous in 2022.', time: '6h ago' }]
  }
];

const state = {
  activeTab: 'home',
  activeCategory: 'ALL',
  profile: { name: '', handle: '', bio: '', avatar: '' },
  submitClassified: false,
  categoryFilterOpen: false 
};

const navButtons = document.querySelectorAll('.nav-btn[data-tab]');
const pageViews = {
  home: document.querySelector('#home-view'),
  trending: document.querySelector('#trending-view'),
  saved: document.querySelector('#saved-view'),
  profile: document.querySelector('#profile-view')
};
const cardsGrid = document.querySelector('#cards-grid');
const trendingGrid = document.querySelector('#trending-grid');
const savedGrid = document.querySelector('#saved-grid');
const categoryPanel = document.querySelector('#category-panel');
const activeFilterEl = document.querySelector('#active-filter');
const clearFilterBtn = document.querySelector('#clear-filter');
const filterToggle = document.querySelector('#filter-toggle');
const profileNameInput = document.querySelector('#profile-name-input');
const profileHandleInput = document.querySelector('#profile-handle-input');
const profileBioInput = document.querySelector('#profile-bio-input');
const profileAvatarCircle = document.querySelector('#profile-avatar-circle');
const profileName = document.querySelector('#profile-name');
const profileHandle = document.querySelector('#profile-handle');
const saveProfileBtn = document.querySelector('#save-profile');

function showView(name) {
  Object.entries(pageViews).forEach(([key, view]) => {
    view.classList.toggle('active', key === name);
    view.classList.toggle('hidden', key !== name);
  });

  navButtons.forEach((button) => {
    const isActive = button.dataset.tab === name;
    button.classList.toggle('active', isActive);
  });

  state.activeTab = name;
  if (name !== 'home') {
    categoryPanel.classList.add('hidden');
    state.categoryFilterOpen = false;
  }
}

function getFilteredTheories() {
  if (state.activeCategory === 'ALL') return theories;
  return theories.filter((item) => item.category === state.activeCategory);
}

function getCategorySummary(cat) {
  if (cat === 'ALL') return theories.length;
  return theories.filter((item) => item.category === cat).length;
}

function renderCategoryPanel() {
  const categories = ['ALL', 'GOVERNMENT', 'PARANORMAL', 'TECHNOLOGY', 'HISTORY', 'SPACE'];
  const markup = `
    <div class="category-list">
      ${categories.map((category) => {
        const active = state.activeCategory === category;
        const count = getCategorySummary(category);
        const label = category === 'ALL' ? 'All' : category;
        return `
          <button type="button" class="category-item ${active ? 'active' : ''}" data-category="${category}">
            <span>${category === 'ALL' ? categoryIcons.ALL : categoryIcons[category]}</span>
            <span>${label}</span>
            ${category !== 'ALL' ? `<small>${count} files</small>` : ''}
          </button>
        `;
      }).join('')}
    </div>
  `;
  categoryPanel.innerHTML = markup;

  categoryPanel.querySelectorAll('.category-item').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeCategory = button.dataset.category;
      renderHome();
      categoryPanel.classList.add('hidden');
      state.categoryFilterOpen = false;
    });
  });
}

function renderHome() {
  const filtered = getFilteredTheories();
  const activeLabel = state.activeCategory === 'ALL' ? `All — ${theories.length} files` : `${state.activeCategory} — ${filtered.length} files`;
  activeFilterEl.textContent = activeLabel;
  clearFilterBtn.classList.toggle('hidden', state.activeCategory === 'ALL');

  cardsGrid.innerHTML = filtered.length === 0 ? `
    <div class="empty-state">
      <h4>No files found</h4>
      <p>Be the first to file in this category</p>
    </div>
  ` : filtered.map((theory) => cardMarkup(theory)).join('');

  document.querySelectorAll('.save-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const item = theories.find((entry) => entry.id === id);
      if (!item) return;
      item.saved = !item.saved;
      renderAll();
    });
  });

  document.querySelectorAll('.upvote-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const item = theories.find((entry) => entry.id === id);
      if (!item) return;
      item.upvoted = !item.upvoted;
      item.upvotes += item.upvoted ? 1 : -1;
      renderAll();
    });
  });

  document.querySelectorAll('.comment-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const id = Number(form.dataset.id);
      const input = form.querySelector('input');
      const value = input.value.trim();
      if (!value) return;
      const item = theories.find((entry) => entry.id === id);
      if (!item) return;
      item.comments.push({
        id: Date.now(),
        author: state.profile.handle || 'Anonymous_Field',
        avatar: (state.profile.name || 'A').charAt(0).toUpperCase(),
        text: value,
        time: 'just now',
        replies: []
      });
      input.value = '';
      renderAll();
    });
  });

  document.querySelectorAll('.reply-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const form = button.closest('.comment').querySelector('.reply-form');
      form.classList.toggle('hidden');
      form.querySelector('input').focus();
    });
  });

  document.querySelectorAll('.reply-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const theoryId = Number(form.dataset.theoryId);
      const commentId = Number(form.dataset.commentId);
      const input = form.querySelector('input');
      const value = input.value.trim();
      if (!value) return;
      const item = theories.find((entry) => entry.id === theoryId);
      const comment = item?.comments.find((entry) => entry.id === commentId);
      if (!comment) return;
      comment.replies = comment.replies || [];
      comment.replies.push({
        id: Date.now(),
        author: state.profile.handle || 'Anonymous_Field',
        avatar: (state.profile.name || 'A').charAt(0).toUpperCase(),
        text: value,
        time: 'just now'
      });
      input.value = '';
      form.classList.add('hidden');
      renderAll();
    });
  });

  document.querySelectorAll('.expand-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const item = theories.find((entry) => entry.id === Number(button.dataset.id));
      if (!item) return;
      button.closest('.theory-card').querySelector('.comment-thread').classList.toggle('hidden');
      button.textContent = button.textContent.includes('Hide') ? `Comments ${item.comments.length}` : `Comments ${item.comments.length}`;
    });
  });
}

function renderTrending() {
  const ranked = [...theories].sort((a, b) => b.upvotes - a.upvotes);
  trendingGrid.innerHTML = ranked.map((theory, index) => `
    <div class="theory-card">
      <div class="rank-badge" style="position:relative;">
        <span style="position:absolute; top:10px; left:10px; z-index:2; display:inline-flex; width:30px; height:30px; align-items:center; justify-content:center; border-radius:4px; background:${index < 3 ? '#e07838' : '#133d3d'}; color:${index < 3 ? '#fff' : '#6aadad'}; font-family:'Special Elite', cursive;">${index + 1}</span>
      </div>
      ${cardMarkup(theory, true)}
    </div>
  `).join('');

  bindCardInteractions();
}

function renderSaved() {
  const saved = theories.filter((item) => item.saved);
  savedGrid.innerHTML = saved.length === 0 ? `
    <div class="empty-state">
      <h4>Your dossier is empty</h4>
      <p>Bookmark theories to build your file</p>
    </div>
  ` : saved.map((theory) => cardMarkup(theory)).join('');
  document.querySelector('#saved-count').textContent = `${saved.length} THEORIES IN YOUR DOSSIER`;
  bindCardInteractions();
}

function bindCardInteractions() {
  document.querySelectorAll('.save-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const item = theories.find((entry) => entry.id === id);
      if (!item) return;
      item.saved = !item.saved;
      renderAll();
    });
  });

  document.querySelectorAll('.upvote-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const item = theories.find((entry) => entry.id === id);
      if (!item) return;
      item.upvoted = !item.upvoted;
      item.upvotes += item.upvoted ? 1 : -1;
      renderAll();
    });
  });

  document.querySelectorAll('.comment-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const id = Number(form.dataset.id);
      const input = form.querySelector('input');
      const value = input.value.trim();
      if (!value) return;
      const item = theories.find((entry) => entry.id === id);
      if (!item) return;
      item.comments.push({
        id: Date.now(),
        author: state.profile.handle || 'Anonymous_Field',
        avatar: (state.profile.name || 'A').charAt(0).toUpperCase(),
        text: value,
        time: 'just now',
        replies: []
      });
      input.value = '';
      renderAll();
    });
  });

  document.querySelectorAll('.reply-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const form = button.closest('.comment').querySelector('.reply-form');
      form.classList.toggle('hidden');
      form.querySelector('input').focus();
    });
  });

  document.querySelectorAll('.reply-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const theoryId = Number(form.dataset.theoryId);
      const commentId = Number(form.dataset.commentId);
      const input = form.querySelector('input');
      const value = input.value.trim();
      if (!value) return;
      const item = theories.find((entry) => entry.id === theoryId);
      const comment = item?.comments.find((entry) => entry.id === commentId);
      if (!comment) return;
      comment.replies = comment.replies || [];
      comment.replies.push({
        id: Date.now(),
        author: state.profile.handle || 'Anonymous_Field',
        avatar: (state.profile.name || 'A').charAt(0).toUpperCase(),
        text: value,
        time: 'just now'
      });
      input.value = '';
      form.classList.add('hidden');
      renderAll();
    });
  });

  document.querySelectorAll('.expand-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const thread = button.closest('.theory-card').querySelector('.comment-thread');
      if (thread) thread.classList.toggle('hidden');
    });
  });
}

function cardMarkup(theory, ranked = false) {
  const commentsCount = theory.comments.length;
  const threadHidden = commentsCount === 0 ? 'hidden' : '';
  return `
    <article class="theory-card" data-id="${theory.id}">
      <div class="card-image-wrap">
        <img src="${theory.image}" alt="${theory.title}" />
        <div class="card-badges">
          <span class="badge" style="background:${categoryColors[theory.category]};">${theory.category}</span>
          ${theory.classified ? '<span class="badge classified">Classified</span>' : ''}
        </div>
        <button type="button" class="save-btn" data-id="${theory.id}" aria-label="Save theory" style="background:${theory.saved ? '#e07838' : 'rgba(15,53,53,0.75)'}">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="${theory.saved ? '#fff' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="card-body">
        <div class="meta-row">
          <span class="meta-avatar">${theory.avatar}</span>
          <span>${theory.author}</span>
          <span>·</span>
          <span>${theory.date}</span>
        </div>
        <h4 class="card-title">${theory.title}</h4>
        <p class="card-excerpt">${theory.excerpt}</p>

        <div class="card-actions">
          <button type="button" class="inline-btn upvote-btn ${theory.upvoted ? 'active' : ''}" data-id="${theory.id}">
            <svg viewBox="0 0 24 24" fill="${theory.upvoted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M5 15l7-7 7 7" stroke-linecap="round"/></svg>
            ${theory.upvotes}
          </button>
          <button type="button" class="inline-btn expand-btn" data-id="${theory.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ${commentsCount} Comments
          </button>
        </div>

        <div class="comment-thread ${threadHidden}">
          ${theory.comments.length === 0 ? '<p class="comment-text">No transmissions yet</p>' : theory.comments.map((comment) => `
            <div class="comment">
              <div class="comment-avatar">${comment.avatar}</div>
              <div class="comment-main">
                <div class="comment-author-row">
                  <span class="comment-author">${comment.author}</span>
                  <span class="comment-time">${comment.time}</span>
                </div>
                <p class="comment-text">${comment.text}</p>
                <div class="comment-actions">
                  <button type="button" class="reply-toggle" data-theory-id="${theory.id}" data-comment-id="${comment.id}">Reply</button>
                </div>
                ${comment.replies && comment.replies.length ? `
                  <div class="comment-replies">
                    ${comment.replies.map((reply) => `
                      <div class="reply">
                        <div class="comment-avatar">${reply.avatar}</div>
                        <div class="comment-main">
                          <div class="comment-author-row">
                            <span class="comment-author">${reply.author}</span>
                            <span class="comment-time">${reply.time}</span>
                          </div>
                          <p class="comment-text">${reply.text}</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
                <form class="reply-form hidden" data-theory-id="${theory.id}" data-comment-id="${comment.id}">
                  <input type="text" placeholder="Write a reply..." aria-label="Write a reply" />
                  <button type="submit">Send</button>
                </form>
              </div>
            </div>
          `).join('')}
          <form class="add-comment comment-form" data-id="${theory.id}">
            <input type="text" placeholder="Add your insight..." aria-label="Add comment" />
            <button type="submit">Post</button>
          </form>
        </div>
      </div>
    </article>
  `;
}

function renderProfile() {
  const profile = state.profile;
  const baseName = profile.name || 'Unknown Operative';
  const baseHandle = profile.handle || '@anonymous';
  const safeAvatar = profile.avatar || '';

  profileName.textContent = baseName;
  profileHandle.textContent = baseHandle;
  profileNameInput.value = profile.name;
  profileHandleInput.value = profile.handle;
  profileBioInput.value = profile.bio;

  if (safeAvatar) {
    profileAvatarCircle.innerHTML = `<img src="${safeAvatar}" alt="Profile avatar" />`;
  } else {
    profileAvatarCircle.textContent = (baseName || 'A').charAt(0).toUpperCase();
  }

  profileButton.textContent = (baseName || 'A').charAt(0).toUpperCase();
  document.querySelector('#mini-theories').textContent = theories.length;
  document.querySelector('#mini-saved').textContent = theories.filter((item) => item.saved).length;
  document.querySelector('#mini-upvoted').textContent = theories.filter((item) => item.upvoted).length;
}

function renderStats() {
  document.querySelector('#stat-theories').textContent = theories.length;
  document.querySelector('#stat-comments').textContent = theories.reduce((total, item) => total + item.comments.length, 0);
  document.querySelector('#stat-classified').textContent = theories.filter((item) => item.classified).length;
}

function renderAll() {
  renderStats();
  renderCategoryPanel();
  renderHome();
  renderTrending();
  renderSaved();
  renderProfile();
}

function showAuthView(name) {
  Object.entries(views).forEach(([key, view]) => {
    view.hidden = key !== name;
  });
  history.replaceState(null, '', name === 'sign-in' ? '#sign-in' : `#${name}`);
}

function handleLogin(event) {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;
  const button = loginForm.querySelector('.submit');
  button.disabled = true;
  button.textContent = 'Signing In...';

  setTimeout(() => {
    authShell.classList.add('hidden');
    appShell.classList.remove('hidden');
    showView('home');
    button.disabled = false;
    button.textContent = 'Sign In';
  }, 600);
}

function handleReset(event) {
  event.preventDefault();
  if (!resetForm.reportValidity()) return;
  submittedEmail.textContent = document.querySelector('#reset-email').value;
  showAuthView('confirmation');
}

passwordToggle.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  passwordToggle.setAttribute('aria-pressed', String(isPassword));
  passwordToggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
});

document.querySelectorAll('[data-view]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showAuthView(link.dataset.view);
  });
});

loginForm.addEventListener('submit', handleLogin);
resetForm.addEventListener('submit', handleReset);
document.querySelector('#resend-button').addEventListener('click', () => showAuthView('forgot'));

profileButton.addEventListener('click', () => showView('profile'));
navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;
    if (tab === 'submit') {
      document.querySelector('#submit-modal').classList.remove('hidden');
      return;
    }
    showView(tab);
  });
});

filterToggle.addEventListener('click', () => {
  state.categoryFilterOpen = !state.categoryFilterOpen;
  categoryPanel.classList.toggle('hidden', !state.categoryFilterOpen);
});

clearFilterBtn.addEventListener('click', () => {
  state.activeCategory = 'ALL';
  renderAll();
});

saveProfileBtn.addEventListener('click', () => {
  state.profile.name = profileNameInput.value.trim();
  state.profile.handle = profileHandleInput.value.trim();
  state.profile.bio = profileBioInput.value.trim();
  renderProfile();
});

const fileButton = document.querySelector('#file-button');
fileButton.addEventListener('click', () => {
  document.querySelector('#submit-modal').classList.remove('hidden');
});

document.querySelector('#close-submit').addEventListener('click', () => {
  document.querySelector('#submit-modal').classList.add('hidden');
});

const categoryChoiceButtons = document.querySelectorAll('.category-choice');
categoryChoiceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    categoryChoiceButtons.forEach((item) => item.classList.toggle('active', item === button));
    const selected = button.dataset.category;
    const submitForm = document.querySelector('#submit-form');
    submitForm.dataset.category = selected;
  });
});

document.querySelector('#theory-image').addEventListener('change', (event) => {
  const file = event.target.files && event.target.files[0];
  const previewBox = document.querySelector('#image-preview');
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (load) => {
    previewBox.innerHTML = `<img src="${load.target.result}" alt="Theory preview" />`;
    previewBox.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

document.querySelector('#classified-toggle').addEventListener('click', () => {
  state.submitClassified = !state.submitClassified;
  const button = document.querySelector('#classified-toggle');
  button.classList.toggle('active', state.submitClassified);
  button.setAttribute('aria-pressed', String(state.submitClassified));
});

document.querySelector('#submit-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.querySelector('#theory-title').value.trim();
  const body = document.querySelector('#theory-body').value.trim();
  const category = document.querySelector('#submit-form').dataset.category || 'GOVERNMENT';
  const preview = document.querySelector('#image-preview img');
  const image = preview ? preview.src : 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&h=380&fit=crop&auto=format';

  if (!title || !body) return;

  theories.unshift({
    id: Date.now(),
    title,
    excerpt: body,
    category,
    author: state.profile.handle || 'Anonymous_Field',
    avatar: (state.profile.name || 'A').charAt(0).toUpperCase(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    image,
    upvotes: 0,
    upvoted: false,
    saved: false,
    classified: state.submitClassified,
    comments: []
  });

  document.querySelector('#submit-form').reset();
  document.querySelector('#image-preview').classList.add('hidden');
  document.querySelector('#image-preview').innerHTML = '';
  state.submitClassified = false;
  document.querySelector('#classified-toggle').classList.remove('active');
  document.querySelector('#submit-modal').classList.add('hidden');
  renderAll();
  showView('home');
});

showAuthView(location.hash === '#forgot' ? 'forgot' : 'sign-in');
renderAll();
