// ========================================
// 家族のおもいで - Family Memory App
// ========================================

const STORAGE_KEY = 'family-memory-entries';
const PEOPLE_KEY = 'family-memory-people';

// --- Data Layer ---
function getMemories() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveMemories(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function getMemoryById(id) {
    return getMemories().find(m => m.id === id);
}

function getPeople() {
    try {
        const data = localStorage.getItem(PEOPLE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function savePeople(list) {
    localStorage.setItem(PEOPLE_KEY, JSON.stringify(list));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDate(d) {
    if (!d) return '';
    const date = new Date(d + 'T00:00:00');
    if (isNaN(date)) return d;
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function todayISO() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
}

// --- State ---
let currentPhotos = [];
let currentSelectedPeople = new Set();
let lightboxPhotos = [];
let lightboxIndex = 0;

// --- Page Navigation ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.mobile-nav-item').forEach(n => n.classList.remove('active'));

    const page = document.getElementById('page-' + pageId);
    if (page) page.classList.add('active');

    document.querySelectorAll(`.nav-item[data-page="${pageId}"]`).forEach(n => n.classList.add('active'));
    document.querySelectorAll(`.mobile-nav-item[data-page="${pageId}"]`).forEach(n => n.classList.add('active'));

    switch (pageId) {
        case 'album': renderAlbum(); break;
        case 'add': prepareAddPage(); break;
        case 'onthisday': renderOnThisDay(); break;
        case 'places': renderPlaces(); break;
        case 'people': renderPeople(); break;
        case 'random': renderRandom(); break;
        case 'search': prepareSearchPage(); performSearch(); break;
    }

    window.scrollTo(0, 0);
}

// --- Photo handling ---
function handlePhotoUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const maxSize = 1400;
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
                currentPhotos.push(canvas.toDataURL('image/jpeg', 0.78));
                renderPhotoPreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

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

// --- People (family members) ---
function renderPeopleCheckboxes() {
    const wrap = document.getElementById('people-checkboxes');
    const people = getPeople();
    if (people.length === 0) {
        wrap.innerHTML = '<span style="color:var(--text-muted);font-size:13px;">まだ家族メンバーが登録されていません。下のフォームか「家族メンバー」ページから追加できます。</span>';
        return;
    }
    wrap.innerHTML = people.map(name => {
        const checked = currentSelectedPeople.has(name) ? 'checked' : '';
        const cls = currentSelectedPeople.has(name) ? 'checked' : '';
        return `<label class="person-chip ${cls}">
            <input type="checkbox" value="${escapeHtml(name)}" ${checked} onchange="togglePersonChip(this)">
            ${escapeHtml(name)}
        </label>`;
    }).join('');
}

function togglePersonChip(input) {
    const name = input.value;
    if (input.checked) currentSelectedPeople.add(name);
    else currentSelectedPeople.delete(name);
    input.parentElement.classList.toggle('checked', input.checked);
}

function quickAddPerson() {
    const input = document.getElementById('quick-add-person');
    const name = input.value.trim();
    if (!name) return;
    const people = getPeople();
    if (!people.includes(name)) {
        people.push(name);
        savePeople(people);
    }
    currentSelectedPeople.add(name);
    input.value = '';
    renderPeopleCheckboxes();
}

function addPerson() {
    const input = document.getElementById('add-person-input');
    const name = input.value.trim();
    if (!name) return;
    const people = getPeople();
    if (people.includes(name)) {
        alert('「' + name + '」はすでに登録されています');
        return;
    }
    people.push(name);
    savePeople(people);
    input.value = '';
    renderPeople();
}

function deletePerson(name) {
    if (!confirm('「' + name + '」を家族メンバーから削除しますか？\n（過去の思い出に紐付いた名前はそのまま残ります）')) return;
    const people = getPeople().filter(p => p !== name);
    savePeople(people);
    renderPeople();
}

function renderPeople() {
    const list = document.getElementById('people-list');
    const empty = document.getElementById('people-empty');
    const people = getPeople();
    const memories = getMemories();

    if (people.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    list.innerHTML = people.map(name => {
        const count = memories.filter(m => (m.people || []).includes(name)).length;
        return `<div class="person-card">
            <div class="name">&#x1F464; ${escapeHtml(name)}</div>
            <div class="count">${count} 件の思い出に登場</div>
            <div class="actions">
                <button class="btn-link" onclick="filterByPerson('${escapeHtml(name)}')">この人の思い出を見る</button>
                <button class="btn-link danger" onclick="deletePerson('${escapeHtml(name)}')">削除</button>
            </div>
        </div>`;
    }).join('');
}

function filterByPerson(name) {
    showPage('search');
    document.getElementById('search-keyword').value = '';
    document.getElementById('search-person').value = name;
    performSearch();
}

// --- Add / Edit form ---
function prepareAddPage() {
    if (!document.getElementById('memory-id').value) {
        document.getElementById('memory-date').value = todayISO();
    }
    renderPeopleCheckboxes();
    setupSuggestions();
}

function setupSuggestions() {
    setupAutoComplete(
        document.getElementById('memory-event'),
        document.getElementById('event-suggestions'),
        () => [...new Set(getMemories().map(m => m.event).filter(Boolean))]
    );
    setupAutoComplete(
        document.getElementById('memory-location'),
        document.getElementById('location-suggestions'),
        () => [...new Set(getMemories().map(m => m.location).filter(Boolean))]
    );
}

function setupAutoComplete(input, dropdown, getItems) {
    if (!input || !dropdown || input.dataset.acReady === '1') return;
    input.dataset.acReady = '1';

    input.addEventListener('input', function () {
        const val = this.value.trim().toLowerCase();
        if (val.length === 0) { dropdown.classList.remove('show'); return; }
        const items = getItems().filter(item => item.toLowerCase().includes(val));
        if (items.length === 0) { dropdown.classList.remove('show'); return; }
        dropdown.innerHTML = items.slice(0, 8).map(item =>
            `<div class="suggestion-item">${escapeHtml(item)}</div>`
        ).join('');
        dropdown.querySelectorAll('.suggestion-item').forEach(el => {
            el.addEventListener('mousedown', function (e) {
                e.preventDefault();
                input.value = this.textContent;
                dropdown.classList.remove('show');
            });
        });
        dropdown.classList.add('show');
    });
    input.addEventListener('blur', function () {
        setTimeout(() => dropdown.classList.remove('show'), 150);
    });
}

function saveMemory(event) {
    event.preventDefault();
    const id = document.getElementById('memory-id').value || generateId();
    const date = document.getElementById('memory-date').value;
    const title = document.getElementById('memory-title').value.trim();
    const event_ = document.getElementById('memory-event').value.trim();
    const location = document.getElementById('memory-location').value.trim();
    const notes = document.getElementById('memory-notes').value.trim();
    const mood = document.getElementById('memory-mood').value;
    const favorite = document.getElementById('memory-favorite').checked;
    const tagsRaw = document.getElementById('memory-tags').value.trim();
    const tags = tagsRaw ? tagsRaw.split(/[,、]/).map(t => t.trim()).filter(Boolean) : [];
    const people = [...currentSelectedPeople];

    if (!title || !date) {
        alert('日付とタイトルは必須です');
        return;
    }

    const memories = getMemories();
    const existingIndex = memories.findIndex(m => m.id === id);
    const memory = {
        id, date, title, event: event_, location, notes,
        mood, favorite, tags, people, photos: [...currentPhotos],
        updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
        memory.createdAt = memories[existingIndex].createdAt;
        memories[existingIndex] = memory;
    } else {
        memory.createdAt = new Date().toISOString();
        memories.push(memory);
    }

    try {
        saveMemories(memories);
    } catch (e) {
        alert('保存に失敗しました。写真の枚数が多すぎる可能性があります。\n' + e.message);
        return;
    }

    resetForm();
    showPage('album');
}

function resetForm() {
    document.getElementById('memory-form').reset();
    document.getElementById('memory-id').value = '';
    document.getElementById('form-title').textContent = '新しい思い出';
    currentPhotos = [];
    currentSelectedPeople = new Set();
    renderPhotoPreview();
}

function editMemory(id) {
    const m = getMemoryById(id);
    if (!m) return;
    closeDetailModal();
    showPage('add');
    document.getElementById('memory-id').value = m.id;
    document.getElementById('memory-date').value = m.date;
    document.getElementById('memory-title').value = m.title;
    document.getElementById('memory-event').value = m.event || '';
    document.getElementById('memory-location').value = m.location || '';
    document.getElementById('memory-notes').value = m.notes || '';
    document.getElementById('memory-mood').value = m.mood || '';
    document.getElementById('memory-favorite').checked = !!m.favorite;
    document.getElementById('memory-tags').value = (m.tags || []).join(', ');
    currentPhotos = [...(m.photos || [])];
    currentSelectedPeople = new Set(m.people || []);
    document.getElementById('form-title').textContent = '思い出を編集';
    renderPhotoPreview();
    renderPeopleCheckboxes();
}

function deleteMemory(id) {
    if (!confirm('この思い出を削除しますか？\nこの操作は元に戻せません。')) return;
    const memories = getMemories().filter(m => m.id !== id);
    saveMemories(memories);
    closeDetailModal();
    showPage('album');
}

function toggleFavorite(id) {
    const memories = getMemories();
    const m = memories.find(x => x.id === id);
    if (!m) return;
    m.favorite = !m.favorite;
    saveMemories(memories);
    showDetailModal(id);
    renderAlbum();
}

// --- Album / Timeline ---
function renderAlbum() {
    populateYearFilters();
    populateEventFilters();
    const list = document.getElementById('album-list');
    const empty = document.getElementById('album-empty');
    const statsBar = document.getElementById('album-stats-bar');

    let memories = getMemories().slice();
    const allCount = memories.length;

    if (allCount === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        statsBar.innerHTML = '';
        return;
    }
    empty.style.display = 'none';

    const yearF = document.getElementById('album-year-filter').value;
    const eventF = document.getElementById('album-event-filter').value;
    const favF = document.getElementById('album-favorite-filter').value;

    if (yearF !== 'all') memories = memories.filter(m => m.date && m.date.startsWith(yearF));
    if (eventF !== 'all') memories = memories.filter(m => (m.event || '') === eventF);
    if (favF === 'fav') memories = memories.filter(m => m.favorite);

    memories.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const allPhotos = getMemories().reduce((sum, m) => sum + (m.photos?.length || 0), 0);
    const favCount = getMemories().filter(m => m.favorite).length;
    const placeCount = new Set(getMemories().map(m => m.location).filter(Boolean)).size;
    statsBar.innerHTML = `
        <div class="stat-mini"><span class="num">${allCount}</span><div class="lbl">総思い出数</div></div>
        <div class="stat-mini"><span class="num">${allPhotos}</span><div class="lbl">写真の合計</div></div>
        <div class="stat-mini"><span class="num">${favCount}</span><div class="lbl">お気に入り</div></div>
        <div class="stat-mini"><span class="num">${placeCount}</span><div class="lbl">行った場所</div></div>
    `;

    if (memories.length === 0) {
        list.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">&#x1F50D;</div><h3>この条件に該当する思い出がありません</h3></div>';
        return;
    }

    list.innerHTML = renderMemoryListWithYearHeadings(memories);
}

function renderMemoryListWithYearHeadings(memories) {
    let lastYear = null;
    return memories.map(m => {
        const year = m.date ? m.date.slice(0, 4) : '不明';
        let heading = '';
        if (year !== lastYear) {
            heading = `<div class="year-heading">${year}年</div>`;
            lastYear = year;
        }
        return heading + memoryCardHTML(m);
    }).join('');
}

function memoryCardHTML(m) {
    const photo = (m.photos && m.photos[0]) ? m.photos[0] : null;
    const photoCount = (m.photos || []).length;
    const photoHTML = photo
        ? `<div class="memory-card-photo" style="background-image:url('${photo}');">
             ${m.favorite ? '<div class="fav-badge">&#9733;</div>' : ''}
             ${photoCount > 1 ? `<div class="photo-count">&#x1F5BC;&#xFE0F; ${photoCount}</div>` : ''}
           </div>`
        : `<div class="memory-card-photo no-photo">
             ${m.favorite ? '<div class="fav-badge">&#9733;</div>' : ''}
             <span>&#x1F4F7;</span>
           </div>`;

    const meta = [];
    if (m.date) meta.push(`<span>&#x1F4C5; ${formatDate(m.date)}</span>`);
    if (m.location) meta.push(`<span>&#x1F4CD; ${escapeHtml(m.location)}</span>`);
    if (m.mood) meta.push(`<span>${escapeHtml(m.mood)}</span>`);

    const tags = (m.tags || []).slice(0, 4).map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('');

    return `<div class="memory-card" onclick="showDetailModal('${m.id}')">
        ${photoHTML}
        <div class="memory-card-body">
            <div class="memory-card-title">${escapeHtml(m.title)}</div>
            ${m.event ? `<div class="memory-card-event">&#x1F4D6; ${escapeHtml(m.event)}</div>` : ''}
            <div class="memory-card-meta">${meta.join('')}</div>
            ${m.notes ? `<div class="memory-card-notes">${escapeHtml(m.notes)}</div>` : ''}
            ${tags ? `<div class="memory-card-tags">${tags}</div>` : ''}
        </div>
    </div>`;
}

function populateYearFilters() {
    const years = [...new Set(getMemories().map(m => m.date && m.date.slice(0, 4)).filter(Boolean))].sort().reverse();
    const sel = document.getElementById('album-year-filter');
    const cur = sel.value;
    sel.innerHTML = '<option value="all">すべての年</option>' +
        years.map(y => `<option value="${y}">${y}年</option>`).join('');
    if (years.includes(cur)) sel.value = cur;

    const sel2 = document.getElementById('search-year');
    if (sel2) {
        const cur2 = sel2.value;
        sel2.innerHTML = '<option value="">全ての年</option>' +
            years.map(y => `<option value="${y}">${y}年</option>`).join('');
        if (years.includes(cur2)) sel2.value = cur2;
    }
}

function populateEventFilters() {
    const events = [...new Set(getMemories().map(m => m.event).filter(Boolean))].sort();
    const sel = document.getElementById('album-event-filter');
    const cur = sel.value;
    sel.innerHTML = '<option value="all">すべてのイベント</option>' +
        events.map(e => `<option value="${escapeHtml(e)}">${escapeHtml(e)}</option>`).join('');
    if (events.includes(cur)) sel.value = cur;
}

// --- Detail modal ---
function showDetailModal(id) {
    const m = getMemoryById(id);
    if (!m) return;
    const content = document.getElementById('detail-content');

    const photosHTML = (m.photos && m.photos.length > 0)
        ? `<div class="detail-photo-grid">${m.photos.map((src, i) =>
            `<img src="${src}" alt="写真${i + 1}" onclick="openLightbox('${m.id}', ${i})">`
          ).join('')}</div>`
        : '';

    const peopleHTML = (m.people || []).length
        ? `<div class="detail-section">一緒にいた家族</div>
           <div>${m.people.map(p => `<span class="person-chip checked" style="cursor:default;">${escapeHtml(p)}</span>`).join(' ')}</div>`
        : '';

    const tagsHTML = (m.tags || []).length
        ? `<div class="detail-section">タグ</div>
           <div>${m.tags.map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join(' ')}</div>`
        : '';

    content.innerHTML = `
        ${photosHTML}
        <div class="detail-title">${m.favorite ? '<span style="color:var(--accent);">&#9733;</span> ' : ''}${escapeHtml(m.title)}</div>
        <div class="detail-meta">
            <span>&#x1F4C5; ${formatDate(m.date)}</span>
            ${m.location ? `<span>&#x1F4CD; ${escapeHtml(m.location)}</span>` : ''}
            ${m.event ? `<span>&#x1F4D6; ${escapeHtml(m.event)}</span>` : ''}
            ${m.mood ? `<span>${escapeHtml(m.mood)}</span>` : ''}
        </div>
        ${m.notes ? `<div class="detail-notes">${escapeHtml(m.notes)}</div>` : ''}
        ${peopleHTML}
        ${tagsHTML}
        <div class="detail-actions">
            <button class="btn btn-secondary" onclick="toggleFavorite('${m.id}')">${m.favorite ? '☆ お気に入りを外す' : '★ お気に入りに追加'}</button>
            <button class="btn btn-secondary" onclick="editMemory('${m.id}')">&#x270F;&#xFE0F; 編集</button>
            <button class="btn btn-danger" onclick="deleteMemory('${m.id}')">&#x1F5D1;&#xFE0F; 削除</button>
        </div>
    `;
    document.getElementById('detail-modal').classList.add('show');
}

function closeDetailModal() {
    document.getElementById('detail-modal').classList.remove('show');
}

function closeModal(event) {
    if (event.target.classList.contains('modal-overlay')) closeDetailModal();
}

// --- Lightbox ---
function openLightbox(memoryId, index) {
    const m = getMemoryById(memoryId);
    if (!m || !m.photos || m.photos.length === 0) return;
    lightboxPhotos = m.photos;
    lightboxIndex = index;
    document.getElementById('lightbox-img').src = lightboxPhotos[lightboxIndex];
    document.getElementById('lightbox').classList.add('show');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('show');
}

function lightboxPrev() {
    if (lightboxPhotos.length === 0) return;
    lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
    document.getElementById('lightbox-img').src = lightboxPhotos[lightboxIndex];
}

function lightboxNext() {
    if (lightboxPhotos.length === 0) return;
    lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length;
    document.getElementById('lightbox-img').src = lightboxPhotos[lightboxIndex];
}

document.addEventListener('keydown', function (e) {
    if (!document.getElementById('lightbox').classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
});

// --- On This Day ---
function renderOnThisDay() {
    const dateInput = document.getElementById('onthisday-date');
    if (!dateInput.value) dateInput.value = todayISO();
    const target = dateInput.value;
    const [_, mm, dd] = target.split('-');
    const list = document.getElementById('onthisday-list');
    const empty = document.getElementById('onthisday-empty');

    const matches = getMemories().filter(m => {
        if (!m.date) return false;
        const parts = m.date.split('-');
        return parts[1] === mm && parts[2] === dd;
    }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    if (matches.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    const today = new Date();
    list.innerHTML = matches.map(m => {
        const yr = parseInt(m.date.slice(0, 4));
        const yearsAgo = today.getFullYear() - yr;
        const ago = yearsAgo === 0 ? '今年' : `${yearsAgo}年前`;
        return `<div style="grid-column:1/-1;">
                  <div class="year-heading">${ago} (${m.date.slice(0, 4)}年)</div>
                </div>` + memoryCardHTML(m);
    }).join('');
}

// --- Places ---
function renderPlaces() {
    const list = document.getElementById('places-list');
    const empty = document.getElementById('places-empty');
    const memories = getMemories();
    const map = {};
    memories.forEach(m => {
        if (!m.location) return;
        if (!map[m.location]) map[m.location] = { count: 0, last: '' };
        map[m.location].count++;
        if ((m.date || '') > map[m.location].last) map[m.location].last = m.date;
    });
    const entries = Object.entries(map).sort((a, b) => b[1].count - a[1].count);

    if (entries.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    list.innerHTML = entries.map(([place, info]) =>
        `<div class="place-card" onclick="filterByPlace('${escapeHtml(place).replace(/'/g, "\\'")}')">
            <div class="name">&#x1F4CD; ${escapeHtml(place)}</div>
            <div class="count">${info.count} 回 訪れた</div>
            <div class="last">最近: ${formatDate(info.last)}</div>
         </div>`
    ).join('');
}

function filterByPlace(place) {
    showPage('search');
    document.getElementById('search-keyword').value = place;
    document.getElementById('search-person').value = '';
    performSearch();
}

// --- Random ---
function renderRandom() {
    const memories = getMemories();
    const display = document.getElementById('random-display');
    const empty = document.getElementById('random-empty');
    if (memories.length === 0) {
        display.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    const m = memories[Math.floor(Math.random() * memories.length)];
    const photo = (m.photos && m.photos[0]) ? m.photos[0] : null;

    display.innerHTML = `<div class="random-card">
        ${photo
            ? `<div class="random-photo" style="background-image:url('${photo}');" onclick="showDetailModal('${m.id}')"></div>`
            : `<div class="random-photo no-photo" style="display:flex;align-items:center;justify-content:center;font-size:48px;color:#bbb;">&#x1F4F7;</div>`}
        <div class="random-body">
            <div class="memory-card-title" style="font-size:22px;">${escapeHtml(m.title)}</div>
            <div class="memory-card-meta" style="margin-top:6px;">
                <span>&#x1F4C5; ${formatDate(m.date)}</span>
                ${m.location ? `<span>&#x1F4CD; ${escapeHtml(m.location)}</span>` : ''}
                ${m.event ? `<span>&#x1F4D6; ${escapeHtml(m.event)}</span>` : ''}
            </div>
            ${m.notes ? `<div class="detail-notes" style="margin-top:14px;">${escapeHtml(m.notes)}</div>` : ''}
            <div style="margin-top:14px;">
                <button class="btn btn-primary" onclick="showDetailModal('${m.id}')">詳しく見る</button>
            </div>
        </div>
    </div>`;
}

// --- Search ---
function prepareSearchPage() {
    populateYearFilters();
    const sel = document.getElementById('search-person');
    const people = getPeople();
    const cur = sel.value;
    sel.innerHTML = '<option value="">全メンバー</option>' +
        people.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
    if (people.includes(cur)) sel.value = cur;
}

function performSearch() {
    const kw = (document.getElementById('search-keyword').value || '').trim().toLowerCase();
    const year = document.getElementById('search-year').value;
    const person = document.getElementById('search-person').value;
    const fav = document.getElementById('search-favorite').value;
    const list = document.getElementById('search-results');
    const empty = document.getElementById('search-empty');
    const initial = document.getElementById('search-initial');

    const hasFilter = kw || year || person || fav;
    if (!hasFilter) {
        list.innerHTML = '';
        empty.style.display = 'none';
        initial.style.display = 'block';
        return;
    }
    initial.style.display = 'none';

    let memories = getMemories().slice();
    if (kw) {
        memories = memories.filter(m => {
            const hay = [
                m.title, m.notes, m.location, m.event, m.mood,
                ...(m.tags || []), ...(m.people || [])
            ].filter(Boolean).join(' ').toLowerCase();
            return hay.includes(kw);
        });
    }
    if (year) memories = memories.filter(m => m.date && m.date.startsWith(year));
    if (person) memories = memories.filter(m => (m.people || []).includes(person));
    if (fav === 'fav') memories = memories.filter(m => m.favorite);

    memories.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    if (memories.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    list.innerHTML = memories.map(memoryCardHTML).join('');
}

// --- Settings: export / import / clear / print ---
function exportData() {
    const data = {
        version: 1,
        exportedAt: new Date().toISOString(),
        memories: getMemories(),
        people: getPeople()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-memories-${todayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.memories || !Array.isArray(data.memories)) throw new Error('正しい形式のファイルではありません');
            const existing = getMemories();
            const existingIds = new Set(existing.map(m => m.id));
            let added = 0;
            data.memories.forEach(m => {
                if (!existingIds.has(m.id)) {
                    existing.push(m);
                    added++;
                }
            });
            saveMemories(existing);

            if (data.people && Array.isArray(data.people)) {
                const people = getPeople();
                data.people.forEach(p => { if (!people.includes(p)) people.push(p); });
                savePeople(people);
            }
            alert(`${added} 件の思い出を読み込みました（重複はスキップしました）`);
            showPage('album');
        } catch (err) {
            alert('読み込みに失敗しました: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function clearAllData() {
    if (!confirm('本当にすべてのデータを削除しますか？\nこの操作は元に戻せません。')) return;
    if (!confirm('もう一度確認します。すべての思い出・写真・家族メンバー情報が消えます。よろしいですか？')) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PEOPLE_KEY);
    showPage('album');
}

function printPhotobook() {
    window.print();
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('memory-date').value = todayISO();
    document.getElementById('onthisday-date').value = todayISO();
    renderAlbum();
    renderPeopleCheckboxes();
    setupSuggestions();

    document.getElementById('quick-add-person').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); quickAddPerson(); }
    });
    document.getElementById('add-person-input').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); addPerson(); }
    });
});
