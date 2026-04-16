// ========================================
// 食べログ帳 - Food History App
// ========================================

const STORAGE_KEY = 'food-history-entries';

// --- Data Layer ---
function getEntries() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getEntryById(id) {
    return getEntries().find(e => e.id === id);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// --- Current state ---
let currentRating = 0;
let currentPhotos = [];
let deleteTargetId = null;

// --- Page Navigation ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.mobile-nav-item').forEach(n => n.classList.remove('active'));

    const page = document.getElementById('page-' + pageId);
    if (page) page.classList.add('active');

    document.querySelectorAll(`.nav-item[data-page="${pageId}"]`).forEach(n => n.classList.add('active'));
    document.querySelectorAll(`.mobile-nav-item[data-page="${pageId}"]`).forEach(n => n.classList.add('active'));

    // Render page content
    switch (pageId) {
        case 'timeline': renderTimeline(); break;
        case 'restaurants': renderRestaurants(); break;
        case 'stats': renderStats(); break;
        case 'search': break;
        case 'add': break;
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// --- Rating ---
function setRating(value) {
    currentRating = (currentRating === value) ? 0 : value;
    updateStarDisplay();
}

function updateStarDisplay() {
    const stars = document.querySelectorAll('#star-rating .star');
    const label = document.getElementById('rating-label');
    const labels = ['', '残念', 'まあまあ', 'おいしい', 'とてもおいしい', '最高！'];

    stars.forEach(star => {
        const val = parseInt(star.getAttribute('data-value'));
        star.classList.toggle('active', val <= currentRating);
    });

    label.textContent = currentRating > 0 ? labels[currentRating] : '未評価';
}

// --- Photo ---
function handlePhotoUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const maxSize = 1200;
                let w = img.width;
                let h = img.height;

                if (w > maxSize || h > maxSize) {
                    if (w > h) {
                        h = Math.round((h * maxSize) / w);
                        w = maxSize;
                    } else {
                        w = Math.round((w * maxSize) / h);
                        h = maxSize;
                    }
                }

                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);

                currentPhotos.push(canvas.toDataURL('image/jpeg', 0.7));
                renderPhotoPreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Reset input so the same file can be selected again
    event.target.value = '';
}

function renderPhotoPreview() {
    const list = document.getElementById('photo-preview-list');
    const placeholder = document.getElementById('photo-placeholder');

    if (currentPhotos.length === 0) {
        list.innerHTML = '';
        placeholder.style.display = 'flex';
        return;
    }

    placeholder.style.display = 'flex';
    list.innerHTML = currentPhotos.map((src, i) => `
        <div class="photo-preview-item">
            <img src="${src}" alt="写真${i + 1}">
            <button type="button" class="btn-remove-photo" onclick="removePhoto(${i})">&#x2715;</button>
        </div>
    `).join('');
}

function removePhoto(index) {
    currentPhotos.splice(index, 1);
    renderPhotoPreview();
}

// --- Suggestions ---
function setupSuggestions() {
    const foodInput = document.getElementById('entry-food');
    const foodDropdown = document.getElementById('food-suggestions');
    const restaurantInput = document.getElementById('entry-restaurant');
    const restaurantDropdown = document.getElementById('restaurant-suggestions');

    setupAutoComplete(foodInput, foodDropdown, () => {
        const entries = getEntries();
        const foods = [...new Set(entries.map(e => e.food))];
        return foods;
    });

    setupAutoComplete(restaurantInput, restaurantDropdown, () => {
        const entries = getEntries();
        const restaurants = [...new Set(entries.map(e => e.restaurant).filter(Boolean))];
        return restaurants;
    });
}

function setupAutoComplete(input, dropdown, getItems) {
    input.addEventListener('input', function () {
        const val = this.value.trim().toLowerCase();
        if (val.length === 0) {
            dropdown.classList.remove('show');
            return;
        }

        const items = getItems().filter(item =>
            item.toLowerCase().includes(val)
        );

        if (items.length === 0) {
            dropdown.classList.remove('show');
            return;
        }

        dropdown.innerHTML = items.slice(0, 8).map(item =>
            `<div class="suggestion-item">${escapeHtml(item)}</div>`
        ).join('');

        dropdown.querySelectorAll('.suggestion-item').forEach(el => {
            el.addEventListener('click', function () {
                input.value = this.textContent;
                dropdown.classList.remove('show');
            });
        });

        dropdown.classList.add('show');
    });

    input.addEventListener('blur', function () {
        setTimeout(() => dropdown.classList.remove('show'), 200);
    });
}

// --- Form ---
function resetForm() {
    document.getElementById('entry-form').reset();
    document.getElementById('entry-id').value = '';
    document.getElementById('form-title').textContent = '新しい記録';
    currentRating = 0;
    currentPhotos = [];
    updateStarDisplay();
    renderPhotoPreview();
    document.getElementById('entry-date').value = formatDate(new Date());
}

function saveEntry(event) {
    event.preventDefault();

    const id = document.getElementById('entry-id').value;
    const entry = {
        id: id || generateId(),
        date: document.getElementById('entry-date').value,
        time: document.getElementById('entry-time').value,
        food: document.getElementById('entry-food').value.trim(),
        category: document.getElementById('entry-category').value,
        restaurant: document.getElementById('entry-restaurant').value.trim(),
        location: document.getElementById('entry-location').value.trim(),
        rating: currentRating,
        price: parseInt(document.getElementById('entry-price').value) || 0,
        photos: currentPhotos.slice(),
        photo: currentPhotos.length > 0 ? currentPhotos[0] : '',
        notes: document.getElementById('entry-notes').value.trim(),
        tags: document.getElementById('entry-tags').value
            .split(/[,、，]/)
            .map(t => t.trim())
            .filter(Boolean),
        createdAt: id ? (getEntryById(id)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const entries = getEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);

    if (existingIndex >= 0) {
        entries[existingIndex] = entry;
    } else {
        entries.unshift(entry);
    }

    saveEntries(entries);
    resetForm();
    showPage('timeline');
}

function editEntry(id) {
    const entry = getEntryById(id);
    if (!entry) return;

    closeDetailModal();

    document.getElementById('entry-id').value = entry.id;
    document.getElementById('form-title').textContent = '記録を編集';
    document.getElementById('entry-date').value = entry.date;
    document.getElementById('entry-time').value = entry.time;
    document.getElementById('entry-food').value = entry.food;
    document.getElementById('entry-category').value = entry.category || '';
    document.getElementById('entry-restaurant').value = entry.restaurant || '';
    document.getElementById('entry-location').value = entry.location || '';
    document.getElementById('entry-price').value = entry.price || '';
    document.getElementById('entry-notes').value = entry.notes || '';
    document.getElementById('entry-tags').value = (entry.tags || []).join(', ');

    currentRating = entry.rating || 0;
    updateStarDisplay();

    // Load photos (support both old single photo and new multi-photo)
    if (entry.photos && entry.photos.length > 0) {
        currentPhotos = entry.photos.slice();
    } else if (entry.photo) {
        currentPhotos = [entry.photo];
    } else {
        currentPhotos = [];
    }
    renderPhotoPreview();

    showPage('add');
}

function deleteEntry(id) {
    deleteTargetId = id;
    document.getElementById('delete-modal').classList.add('show');
    document.body.classList.add('modal-open');
}

function confirmDelete() {
    if (!deleteTargetId) return;

    const entries = getEntries().filter(e => e.id !== deleteTargetId);
    saveEntries(entries);
    deleteTargetId = null;
    closeDeleteModal();
    closeDetailModal();
    renderTimeline();
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('show');
    document.body.classList.remove('modal-open');
    deleteTargetId = null;
}

// --- Timeline ---
function renderTimeline() {
    const container = document.getElementById('timeline-list');
    const emptyState = document.getElementById('timeline-empty');
    const filter = document.getElementById('timeline-filter').value;

    let entries = getEntries();

    // Apply filter
    const now = new Date();
    if (filter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        entries = entries.filter(e => new Date(e.date) >= weekAgo);
    } else if (filter === 'month') {
        entries = entries.filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
    } else if (filter === 'year') {
        entries = entries.filter(e => new Date(e.date).getFullYear() === now.getFullYear());
    }

    // Sort by date descending
    entries.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

    if (entries.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Group by date
    const groups = {};
    entries.forEach(entry => {
        if (!groups[entry.date]) groups[entry.date] = [];
        groups[entry.date].push(entry);
    });

    let html = '';
    for (const [date, items] of Object.entries(groups)) {
        html += `<div class="timeline-date-group">`;
        html += `<div class="timeline-date-label">${formatDisplayDate(date)}</div>`;
        items.forEach(entry => {
            html += renderEntryCard(entry);
        });
        html += `</div>`;
    }

    container.innerHTML = html;
}

function getEntryPhotos(entry) {
    if (entry.photos && entry.photos.length > 0) return entry.photos;
    if (entry.photo) return [entry.photo];
    return [];
}

function renderEntryCard(entry) {
    const stars = entry.rating > 0 ? renderStars(entry.rating) : '';
    const photos = getEntryPhotos(entry);
    const photoHtml = photos.length > 0
        ? `<div class="entry-card-photo">
            <img src="${photos[0]}" alt="" loading="lazy">
            ${photos.length > 1 ? `<span class="photo-count">${photos.length}</span>` : ''}
           </div>`
        : '';

    const metaParts = [];
    if (entry.restaurant) metaParts.push(entry.restaurant);
    if (entry.location) metaParts.push(entry.location);

    return `
        <div class="entry-card" onclick="showDetail('${entry.id}')">
            ${photoHtml}
            <div class="entry-card-body">
                <div class="entry-card-header">
                    <span class="entry-card-food">${escapeHtml(entry.food)}</span>
                    ${stars ? `<span class="entry-card-rating">${stars}</span>` : ''}
                </div>
                ${metaParts.length > 0 ? `<div class="entry-card-meta">${escapeHtml(metaParts.join(' / '))}</div>` : ''}
                <div class="entry-card-footer">
                    <span class="entry-card-time-badge">${escapeHtml(entry.time)}</span>
                    ${entry.category ? `<span class="entry-card-tag">${escapeHtml(entry.category)}</span>` : ''}
                    ${entry.price > 0 ? `<span class="entry-card-price">&yen;${entry.price.toLocaleString()}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// --- Detail Modal ---
function showDetail(id) {
    const entry = getEntryById(id);
    if (!entry) return;

    const content = document.getElementById('detail-content');
    const photos = getEntryPhotos(entry);
    let photoHtml = '';
    if (photos.length === 1) {
        photoHtml = `<img class="detail-photo" src="${photos[0]}" alt="${escapeHtml(entry.food)}">`;
    } else if (photos.length > 1) {
        photoHtml = `<div class="detail-photo-gallery">
            ${photos.map((src, i) => `<img class="detail-photo-item" src="${src}" alt="${escapeHtml(entry.food)} ${i + 1}">`).join('')}
        </div>`;
    }

    const tagsHtml = (entry.tags || []).length > 0
        ? `<div class="detail-tags">${entry.tags.map(t => `<span class="detail-tag">${escapeHtml(t)}</span>`).join('')}</div>`
        : '';

    content.innerHTML = `
        ${photoHtml}
        <div class="detail-food-name">${escapeHtml(entry.food)}</div>
        ${entry.restaurant ? `<div class="detail-restaurant">${escapeHtml(entry.restaurant)}${entry.location ? ' (' + escapeHtml(entry.location) + ')' : ''}</div>` : ''}
        ${entry.rating > 0 ? `<div class="detail-rating">${renderStars(entry.rating)}</div>` : ''}

        <div class="detail-info-grid">
            <div class="detail-info-item">
                <div class="detail-info-label">日付</div>
                <div class="detail-info-value">${formatDisplayDate(entry.date)}</div>
            </div>
            <div class="detail-info-item">
                <div class="detail-info-label">時間帯</div>
                <div class="detail-info-value">${escapeHtml(entry.time)}</div>
            </div>
            ${entry.category ? `
            <div class="detail-info-item">
                <div class="detail-info-label">カテゴリ</div>
                <div class="detail-info-value">${escapeHtml(entry.category)}</div>
            </div>` : ''}
            ${entry.price > 0 ? `
            <div class="detail-info-item">
                <div class="detail-info-label">価格</div>
                <div class="detail-info-value">&yen;${entry.price.toLocaleString()}</div>
            </div>` : ''}
        </div>

        ${entry.notes ? `<div class="detail-notes">${escapeHtml(entry.notes)}</div>` : ''}
        ${tagsHtml}

        <div class="detail-actions">
            <button class="btn btn-secondary btn-sm" onclick="editEntry('${entry.id}')">編集</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEntry('${entry.id}')">削除</button>
        </div>
    `;

    document.getElementById('detail-modal').classList.add('show');
    document.body.classList.add('modal-open');
}

function closeDetailModal() {
    document.getElementById('detail-modal').classList.remove('show');
    document.body.classList.remove('modal-open');
}

function closeModal(event) {
    if (event.target === event.currentTarget) {
        event.target.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
}

// --- Restaurants ---
function renderRestaurants() {
    const container = document.getElementById('restaurant-list');
    const emptyState = document.getElementById('restaurants-empty');
    const sort = document.getElementById('restaurant-sort').value;
    const entries = getEntries();

    // Aggregate restaurant data
    const restaurantMap = {};
    entries.forEach(entry => {
        if (!entry.restaurant) return;
        const key = entry.restaurant;
        if (!restaurantMap[key]) {
            restaurantMap[key] = {
                name: entry.restaurant,
                location: entry.location || '',
                visits: 0,
                totalRating: 0,
                ratedCount: 0,
                totalSpent: 0,
                lastVisit: '',
                categories: new Set(),
            };
        }
        const r = restaurantMap[key];
        r.visits++;
        if (entry.rating > 0) {
            r.totalRating += entry.rating;
            r.ratedCount++;
        }
        if (entry.price > 0) r.totalSpent += entry.price;
        if (entry.date > r.lastVisit) {
            r.lastVisit = entry.date;
            if (entry.location) r.location = entry.location;
        }
        if (entry.category) r.categories.add(entry.category);
    });

    let restaurants = Object.values(restaurantMap);

    if (restaurants.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Sort
    switch (sort) {
        case 'visits':
            restaurants.sort((a, b) => b.visits - a.visits);
            break;
        case 'rating':
            restaurants.sort((a, b) => {
                const avgA = a.ratedCount > 0 ? a.totalRating / a.ratedCount : 0;
                const avgB = b.ratedCount > 0 ? b.totalRating / b.ratedCount : 0;
                return avgB - avgA;
            });
            break;
        case 'recent':
            restaurants.sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
            break;
        case 'name':
            restaurants.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
            break;
    }

    container.innerHTML = restaurants.map(r => {
        const avgRating = r.ratedCount > 0 ? (r.totalRating / r.ratedCount).toFixed(1) : '-';
        const categories = [...r.categories].slice(0, 3).join(', ');
        return `
            <div class="restaurant-card" onclick="searchByRestaurant('${escapeHtml(r.name)}')">
                <div class="restaurant-card-name">${escapeHtml(r.name)}</div>
                <div class="restaurant-card-info">
                    ${r.location ? `<span>&#x1F4CD; ${escapeHtml(r.location)}</span>` : ''}
                    <span>&#x1F37D;&#xFE0F; ${r.visits}回訪問</span>
                    ${avgRating !== '-' ? `<span class="restaurant-card-rating">&#9733; ${avgRating}</span>` : ''}
                    ${r.totalSpent > 0 ? `<span>&yen;${r.totalSpent.toLocaleString()} (合計)</span>` : ''}
                    ${categories ? `<span>${escapeHtml(categories)}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function searchByRestaurant(name) {
    showPage('search');
    document.getElementById('search-keyword').value = name;
    performSearch();
}

// --- Stats ---
function renderStats() {
    const entries = getEntries();
    const now = new Date();

    // Basic stats
    const totalEntries = entries.length;
    const restaurants = new Set(entries.filter(e => e.restaurant).map(e => e.restaurant));
    const rated = entries.filter(e => e.rating > 0);
    const avgRating = rated.length > 0 ? (rated.reduce((s, e) => s + e.rating, 0) / rated.length).toFixed(1) : '-';
    const totalSpent = entries.reduce((s, e) => s + (e.price || 0), 0);
    const priced = entries.filter(e => e.price > 0);
    const avgPrice = priced.length > 0 ? Math.round(totalSpent / priced.length) : 0;
    const thisMonth = entries.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    document.getElementById('stat-total').textContent = totalEntries;
    document.getElementById('stat-restaurants').textContent = restaurants.size;
    document.getElementById('stat-avg-rating').textContent = avgRating !== '-' ? `\u2733 ${avgRating}` : '-';
    document.getElementById('stat-total-spent').textContent = `\u00A5${totalSpent.toLocaleString()}`;
    document.getElementById('stat-this-month').textContent = thisMonth;
    document.getElementById('stat-avg-price').textContent = `\u00A5${avgPrice.toLocaleString()}`;

    // Category chart
    const categoryCounts = {};
    entries.forEach(e => {
        const cat = e.category || 'なし';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    renderBarChart('category-chart', categoryCounts);

    // Monthly chart
    const monthlyCounts = {};
    entries.forEach(e => {
        const d = new Date(e.date);
        const key = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
    });
    const sortedMonths = {};
    Object.keys(monthlyCounts).sort().forEach(k => sortedMonths[k] = monthlyCounts[k]);
    renderBarChart('monthly-chart', sortedMonths);

    // Top restaurants
    renderTopList('top-restaurants', getTopItems(entries, 'restaurant', 5));

    // Top foods
    renderTopList('top-foods', getTopItems(entries, 'food', 5));
}

function renderBarChart(containerId, data) {
    const container = document.getElementById(containerId);
    const entries = Object.entries(data);

    if (entries.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">データがありません</p>';
        return;
    }

    const maxVal = Math.max(...entries.map(([, v]) => v));

    container.innerHTML = entries
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([label, value]) => `
            <div class="bar-row">
                <span class="bar-label" title="${escapeHtml(label)}">${escapeHtml(label)}</span>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${(value / maxVal) * 100}%"></div>
                </div>
                <span class="bar-value">${value}</span>
            </div>
        `).join('');
}

function getTopItems(entries, field, limit) {
    const counts = {};
    entries.forEach(e => {
        const val = e[field];
        if (val) counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, count]) => ({ name, count }));
}

function renderTopList(containerId, items) {
    const container = document.getElementById(containerId);

    if (items.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">データがありません</p>';
        return;
    }

    container.innerHTML = items.map((item, i) => {
        const rankClass = i === 0 ? '' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
        return `
            <div class="top-item">
                <span class="top-rank ${rankClass}">${i + 1}</span>
                <span class="top-name">${escapeHtml(item.name)}</span>
                <span class="top-count">${item.count}回</span>
            </div>
        `;
    }).join('');
}

// --- Search ---
function performSearch() {
    const keyword = document.getElementById('search-keyword').value.trim().toLowerCase();
    const category = document.getElementById('search-category').value;
    const minRating = parseInt(document.getElementById('search-rating').value) || 0;

    const resultsContainer = document.getElementById('search-results');
    const emptyState = document.getElementById('search-empty');
    const initialState = document.getElementById('search-initial');

    if (!keyword && !category && !minRating) {
        resultsContainer.innerHTML = '';
        emptyState.style.display = 'none';
        initialState.style.display = 'block';
        return;
    }

    initialState.style.display = 'none';

    let entries = getEntries();

    if (keyword) {
        entries = entries.filter(e =>
            e.food.toLowerCase().includes(keyword) ||
            (e.restaurant && e.restaurant.toLowerCase().includes(keyword)) ||
            (e.notes && e.notes.toLowerCase().includes(keyword)) ||
            (e.location && e.location.toLowerCase().includes(keyword)) ||
            (e.tags && e.tags.some(t => t.toLowerCase().includes(keyword)))
        );
    }

    if (category) {
        entries = entries.filter(e => e.category === category);
    }

    if (minRating > 0) {
        entries = entries.filter(e => e.rating >= minRating);
    }

    entries.sort((a, b) => b.date.localeCompare(a.date));

    if (entries.length === 0) {
        resultsContainer.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    resultsContainer.innerHTML = entries.map(entry => renderEntryCard(entry)).join('');
}

// --- Utility ---
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '\u2605' : '\u2606';
    }
    return stars;
}

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatDisplayDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (formatDate(today) === dateStr) return '今日';
    if (formatDate(yesterday) === dateStr) return '昨日';

    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 (${days[d.getDay()]})`;
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function () {
    // Set today's date as default
    document.getElementById('entry-date').value = formatDate(new Date());

    // Setup auto-complete
    setupSuggestions();

    // Render timeline
    renderTimeline();
});
