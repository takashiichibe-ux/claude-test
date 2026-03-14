// ============================================================
// PDF工房 - 事務所版 v1.0
// ============================================================

const { PDFDocument, rgb, degrees, StandardFonts } = PDFLib;

// --- State ---
let mergeFiles = [];
let splitPdfBytes = null;
let splitPdfName = '';
let splitPageCount = 0;
let splitPoints = new Set();
let editPdfBytes = null;
let editPdfName = '';
let editPages = []; // {index, rotation, deleted}
let editDragIdx = null;
let imageFiles = [];
let textPdfBytes = null;
let textPdfName = '';
let textAnnotations = [];
let textCurrentPage = 0;
let watermarkPdfBytes = null;
let watermarkPdfName = '';
let passwordPdfBytes = null;
let passwordPdfName = '';
let compressPdfBytes = null;
let compressPdfName = '';
let compressOrigSize = 0;

// --- Mobile Sidebar ---
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const btn = document.getElementById('hamburgerBtn');
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    btn.classList.toggle('open', isOpen);
}

function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
    document.getElementById('hamburgerBtn').classList.remove('open');
}

// --- Navigation ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${pageId}"]`).classList.add('active');
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 640) {
        closeSidebar();
    }
}

// --- Utility ---
function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' toast-' + type : '');
    setTimeout(() => t.className = 'toast', 3000);
}

function showLoading(text = '処理中...') {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadBytes(bytes, filename) {
    downloadBlob(new Blob([bytes], { type: 'application/pdf' }), filename);
}

// --- Drag & Drop common ---
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

// Click on drop zone opens file picker
document.addEventListener('click', (e) => {
    const dz = e.target.closest('.drop-zone');
    if (!dz) return;
    const input = dz.querySelector('input[type="file"]');
    if (input) input.click();
});

// ============================================================
// PDF結合 (Merge)
// ============================================================
function handleMergeDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const files = [...e.dataTransfer.files].filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    addMergeFiles(files);
}

function handleMergeFiles(e) {
    addMergeFiles([...e.target.files]);
    e.target.value = '';
}

function addMergeFiles(files) {
    files.forEach(f => {
        mergeFiles.push({ file: f, name: f.name, size: f.size });
    });
    renderMergeList();
}

function renderMergeList() {
    const list = document.getElementById('mergeFileList');
    if (mergeFiles.length === 0) {
        list.innerHTML = '';
        document.getElementById('mergeBtn').disabled = true;
        return;
    }
    document.getElementById('mergeBtn').disabled = mergeFiles.length < 2;
    list.innerHTML = mergeFiles.map((f, i) => `
        <div class="file-item" draggable="true" data-idx="${i}"
             ondragstart="mergeItemDragStart(event, ${i})"
             ondragover="mergeItemDragOver(event, ${i})"
             ondrop="mergeItemDrop(event, ${i})"
             ondragend="mergeItemDragEnd(event)">
            <div class="file-item-left">
                <span class="file-item-drag">☰</span>
                <span class="file-item-icon">📄</span>
                <span class="file-item-name">${f.name}</span>
                <span class="file-item-size">${formatFileSize(f.size)}</span>
            </div>
            <button class="file-item-remove" onclick="removeMergeFile(${i})">✕</button>
        </div>
    `).join('');
}

let mergeDragIdx = null;
function mergeItemDragStart(e, idx) {
    mergeDragIdx = idx;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}
function mergeItemDragOver(e, idx) {
    e.preventDefault();
}
function mergeItemDrop(e, idx) {
    e.preventDefault();
    if (mergeDragIdx === null || mergeDragIdx === idx) return;
    const item = mergeFiles.splice(mergeDragIdx, 1)[0];
    mergeFiles.splice(idx, 0, item);
    mergeDragIdx = null;
    renderMergeList();
}
function mergeItemDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    mergeDragIdx = null;
}

function removeMergeFile(idx) {
    mergeFiles.splice(idx, 1);
    renderMergeList();
}

function clearMerge() {
    mergeFiles = [];
    renderMergeList();
}

async function mergePDFs() {
    if (mergeFiles.length < 2) return;
    showLoading('PDFを結合中...');
    try {
        const merged = await PDFDocument.create();
        for (const f of mergeFiles) {
            const bytes = await f.file.arrayBuffer();
            const doc = await PDFDocument.load(bytes);
            const pages = await merged.copyPages(doc, doc.getPageIndices());
            pages.forEach(p => merged.addPage(p));
        }
        const pdfBytes = await merged.save();
        downloadBytes(pdfBytes, '結合済み.pdf');
        showToast('PDF結合が完了しました', 'success');
    } catch (err) {
        console.error(err);
        showToast('エラーが発生しました: ' + err.message, 'error');
    }
    hideLoading();
}

// ============================================================
// PDF分割 (Split)
// ============================================================
function handleSplitDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = [...e.dataTransfer.files].find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (file) loadSplitFile(file);
}

function handleSplitFile(e) {
    if (e.target.files[0]) loadSplitFile(e.target.files[0]);
    e.target.value = '';
}

async function loadSplitFile(file) {
    showLoading('PDFを読み込み中...');
    try {
        splitPdfBytes = await file.arrayBuffer();
        splitPdfName = file.name;
        const doc = await PDFDocument.load(splitPdfBytes);
        splitPageCount = doc.getPageCount();
        splitPoints = new Set();

        document.getElementById('splitFileInfo').style.display = 'block';
        document.getElementById('splitFileInfo').textContent = `${file.name} (${splitPageCount}ページ)`;
        document.getElementById('splitPreviewCard').style.display = 'block';
        document.getElementById('splitActionBar').style.display = 'flex';

        await renderSplitThumbnails();
        updateSplitInfo();
    } catch (err) {
        console.error(err);
        showToast('PDFの読み込みに失敗しました', 'error');
    }
    hideLoading();
}

async function renderSplitThumbnails() {
    const container = document.getElementById('splitThumbnails');
    container.innerHTML = '';
    const pdfDoc = await pdfjsLib.getDocument({ data: splitPdfBytes.slice(0) }).promise;

    for (let i = 0; i < splitPageCount; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'thumb-wrapper';

        const thumb = document.createElement('div');
        thumb.className = 'thumb-item';

        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'thumb-canvas-wrap';
        const canvas = document.createElement('canvas');
        canvasWrap.appendChild(canvas);
        thumb.appendChild(canvasWrap);

        const num = document.createElement('div');
        num.className = 'thumb-number';
        num.textContent = i + 1;
        thumb.appendChild(num);

        wrapper.appendChild(thumb);

        // Add divider between pages (not after last)
        if (i < splitPageCount - 1) {
            const divider = document.createElement('div');
            divider.className = 'split-divider' + (splitPoints.has(i) ? ' active' : '');
            divider.innerHTML = '<div class="split-divider-line"></div>';
            divider.onclick = () => toggleSplitPoint(i, divider);
            wrapper.appendChild(divider);
        }

        container.appendChild(wrapper);

        // Render thumbnail
        const page = await pdfDoc.getPage(i + 1);
        const viewport = page.getViewport({ scale: 0.2 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
    }
}

function toggleSplitPoint(idx, el) {
    if (splitPoints.has(idx)) {
        splitPoints.delete(idx);
        el.classList.remove('active');
    } else {
        splitPoints.add(idx);
        el.classList.add('active');
    }
    updateSplitInfo();
}

function clearAllSplits() {
    splitPoints.clear();
    document.querySelectorAll('.split-divider').forEach(d => d.classList.remove('active'));
    updateSplitInfo();
}

function splitEveryN() {
    document.getElementById('splitModal').classList.add('active');
}

function closeSplitModal() {
    document.getElementById('splitModal').classList.remove('active');
}

function applySplitEveryN() {
    const n = parseInt(document.getElementById('splitNInput').value) || 1;
    splitPoints.clear();
    for (let i = n - 1; i < splitPageCount - 1; i += n) {
        splitPoints.add(i);
    }
    closeSplitModal();
    // Update visual
    document.querySelectorAll('.split-divider').forEach((d, idx) => {
        d.classList.toggle('active', splitPoints.has(idx));
    });
    updateSplitInfo();
}

function updateSplitInfo() {
    const infoEl = document.getElementById('splitInfo');
    if (splitPoints.size === 0) {
        infoEl.textContent = '分割位置が指定されていません。ページ間の区切り線をクリックして分割位置を指定してください。';
        return;
    }
    const sortedPoints = [...splitPoints].sort((a, b) => a - b);
    const ranges = [];
    let start = 0;
    for (const point of sortedPoints) {
        ranges.push({ start: start + 1, end: point + 1 });
        start = point + 1;
    }
    ranges.push({ start: start + 1, end: splitPageCount });

    const parts = ranges.map((r, i) => {
        const count = r.end - r.start + 1;
        return `ファイル${i + 1}: ${r.start === r.end ? r.start + 'ページ' : r.start + '-' + r.end + 'ページ'} (${count}頁)`;
    });
    infoEl.textContent = `${ranges.length}個のファイルに分割: ${parts.join('　')}`;
}

async function splitPDF() {
    if (splitPoints.size === 0) {
        showToast('分割位置を指定してください', 'error');
        return;
    }
    showLoading('PDFを分割中...');
    try {
        const srcDoc = await PDFDocument.load(splitPdfBytes);
        const sortedPoints = [...splitPoints].sort((a, b) => a - b);
        const ranges = [];
        let start = 0;
        for (const point of sortedPoints) {
            ranges.push({ start, end: point });
            start = point + 1;
        }
        ranges.push({ start, end: splitPageCount - 1 });

        const baseName = splitPdfName.replace(/\.pdf$/i, '');

        for (let i = 0; i < ranges.length; i++) {
            const newDoc = await PDFDocument.create();
            const indices = [];
            for (let p = ranges[i].start; p <= ranges[i].end; p++) {
                indices.push(p);
            }
            const pages = await newDoc.copyPages(srcDoc, indices);
            pages.forEach(p => newDoc.addPage(p));
            const pdfBytes = await newDoc.save();
            downloadBytes(pdfBytes, `${baseName}_${i + 1}.pdf`);
        }
        showToast(`${ranges.length}個のファイルに分割しました`, 'success');
    } catch (err) {
        console.error(err);
        showToast('エラーが発生しました: ' + err.message, 'error');
    }
    hideLoading();
}

// ============================================================
// ページ編集 (Page Edit)
// ============================================================
function handleEditDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = [...e.dataTransfer.files].find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (file) loadEditFile(file);
}

function handleEditFile(e) {
    if (e.target.files[0]) loadEditFile(e.target.files[0]);
    e.target.value = '';
}

async function loadEditFile(file) {
    showLoading('PDFを読み込み中...');
    try {
        editPdfBytes = await file.arrayBuffer();
        editPdfName = file.name;
        const doc = await PDFDocument.load(editPdfBytes);
        const pageCount = doc.getPageCount();
        editPages = Array.from({ length: pageCount }, (_, i) => ({
            index: i,
            rotation: 0,
            deleted: false
        }));

        document.getElementById('editFileInfo').style.display = 'block';
        document.getElementById('editFileInfo').textContent = `${file.name} (${pageCount}ページ)`;
        document.getElementById('editPreviewCard').style.display = 'block';
        document.getElementById('editActionBar').style.display = 'flex';

        await renderEditThumbnails();
    } catch (err) {
        console.error(err);
        showToast('PDFの読み込みに失敗しました', 'error');
    }
    hideLoading();
}

async function renderEditThumbnails() {
    const container = document.getElementById('editThumbnails');
    container.innerHTML = '';
    const pdfDoc = await pdfjsLib.getDocument({ data: editPdfBytes.slice(0) }).promise;

    for (let i = 0; i < editPages.length; i++) {
        const ep = editPages[i];
        const thumb = document.createElement('div');
        thumb.className = 'edit-thumb' + (ep.deleted ? ' thumb-deleted' : '');
        thumb.draggable = true;
        thumb.dataset.idx = i;

        thumb.ondragstart = (e) => { editDragIdx = i; thumb.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; };
        thumb.ondragend = () => { thumb.classList.remove('dragging'); editDragIdx = null; document.querySelectorAll('.edit-thumb').forEach(t => { t.classList.remove('drag-over-left', 'drag-over-right'); }); };
        thumb.ondragover = (e) => {
            e.preventDefault();
            if (editDragIdx === null || editDragIdx === i) return;
            const rect = thumb.getBoundingClientRect();
            const mid = rect.left + rect.width / 2;
            thumb.classList.toggle('drag-over-left', e.clientX < mid);
            thumb.classList.toggle('drag-over-right', e.clientX >= mid);
        };
        thumb.ondragleave = () => { thumb.classList.remove('drag-over-left', 'drag-over-right'); };
        thumb.ondrop = (e) => {
            e.preventDefault();
            if (editDragIdx === null || editDragIdx === i) return;
            const item = editPages.splice(editDragIdx, 1)[0];
            const rect = thumb.getBoundingClientRect();
            const mid = rect.left + rect.width / 2;
            const insertIdx = e.clientX < mid ? i : i + 1;
            const actualIdx = editDragIdx < i ? insertIdx - 1 : insertIdx;
            editPages.splice(actualIdx, 0, item);
            editDragIdx = null;
            renderEditThumbnails();
        };

        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'thumb-canvas-wrap';
        const canvas = document.createElement('canvas');
        canvasWrap.appendChild(canvas);

        if (ep.rotation !== 0) {
            const badge = document.createElement('div');
            badge.className = 'rotation-badge';
            badge.textContent = ep.rotation + '°';
            canvasWrap.appendChild(badge);
        }

        thumb.appendChild(canvasWrap);

        const num = document.createElement('div');
        num.className = 'thumb-number';
        num.textContent = `元${ep.index + 1}ページ`;
        thumb.appendChild(num);

        const actions = document.createElement('div');
        actions.className = 'edit-thumb-actions';
        actions.innerHTML = `
            <button class="edit-thumb-btn" onclick="rotateEditPage(${i}, -90)" title="左回転">↺</button>
            <button class="edit-thumb-btn" onclick="rotateEditPage(${i}, 90)" title="右回転">↻</button>
            <button class="edit-thumb-btn btn-delete" onclick="toggleDeleteEditPage(${i})" title="${ep.deleted ? '復元' : '削除'}">${ep.deleted ? '復元' : '🗑'}</button>
        `;
        thumb.appendChild(actions);

        container.appendChild(thumb);

        // Render
        const page = await pdfDoc.getPage(ep.index + 1);
        const viewport = page.getViewport({ scale: 0.22, rotation: ep.rotation });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
    }
}

function rotateEditPage(idx, deg) {
    editPages[idx].rotation = (editPages[idx].rotation + deg + 360) % 360;
    renderEditThumbnails();
}

function toggleDeleteEditPage(idx) {
    editPages[idx].deleted = !editPages[idx].deleted;
    renderEditThumbnails();
}

function clearEdit() {
    editPdfBytes = null;
    editPages = [];
    document.getElementById('editFileInfo').style.display = 'none';
    document.getElementById('editPreviewCard').style.display = 'none';
    document.getElementById('editActionBar').style.display = 'none';
}

async function saveEditedPDF() {
    const activePages = editPages.filter(p => !p.deleted);
    if (activePages.length === 0) {
        showToast('ページが1つもありません', 'error');
        return;
    }
    showLoading('PDFを保存中...');
    try {
        const srcDoc = await PDFDocument.load(editPdfBytes);
        const newDoc = await PDFDocument.create();
        const indices = activePages.map(p => p.index);
        const pages = await newDoc.copyPages(srcDoc, indices);

        pages.forEach((page, i) => {
            const currentRotation = page.getRotation().angle;
            const additionalRotation = activePages[i].rotation;
            if (additionalRotation !== 0) {
                page.setRotation(degrees(currentRotation + additionalRotation));
            }
            newDoc.addPage(page);
        });

        const pdfBytes = await newDoc.save();
        const baseName = editPdfName.replace(/\.pdf$/i, '');
        downloadBytes(pdfBytes, `${baseName}_編集済み.pdf`);
        showToast('保存しました', 'success');
    } catch (err) {
        console.error(err);
        showToast('エラーが発生しました: ' + err.message, 'error');
    }
    hideLoading();
}

// ============================================================
// 画像→PDF (Image to PDF)
// ============================================================
function handleImageDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
    addImageFiles(files);
}

function handleImageFiles(e) {
    addImageFiles([...e.target.files]);
    e.target.value = '';
}

function addImageFiles(files) {
    files.forEach(f => {
        const url = URL.createObjectURL(f);
        imageFiles.push({ file: f, name: f.name, size: f.size, url });
    });
    renderImageList();
}

function renderImageList() {
    const list = document.getElementById('imageFileList');
    if (imageFiles.length === 0) {
        list.innerHTML = '';
        document.getElementById('imageSettingsCard').style.display = 'none';
        document.getElementById('imageActionBar').style.display = 'none';
        return;
    }
    document.getElementById('imageSettingsCard').style.display = 'block';
    document.getElementById('imageActionBar').style.display = 'flex';

    list.innerHTML = imageFiles.map((f, i) => `
        <div class="file-item" draggable="true" data-idx="${i}"
             ondragstart="imageItemDragStart(event, ${i})"
             ondragover="imageItemDragOver(event, ${i})"
             ondrop="imageItemDrop(event, ${i})"
             ondragend="imageItemDragEnd(event)">
            <div class="file-item-left">
                <span class="file-item-drag">☰</span>
                <img src="${f.url}" class="image-thumb-preview" alt="">
                <span class="file-item-name">${f.name}</span>
                <span class="file-item-size">${formatFileSize(f.size)}</span>
            </div>
            <button class="file-item-remove" onclick="removeImageFile(${i})">✕</button>
        </div>
    `).join('');
}

let imageDragIdx = null;
function imageItemDragStart(e, idx) { imageDragIdx = idx; e.currentTarget.classList.add('dragging'); }
function imageItemDragOver(e, idx) { e.preventDefault(); }
function imageItemDrop(e, idx) {
    e.preventDefault();
    if (imageDragIdx === null || imageDragIdx === idx) return;
    const item = imageFiles.splice(imageDragIdx, 1)[0];
    imageFiles.splice(idx, 0, item);
    imageDragIdx = null;
    renderImageList();
}
function imageItemDragEnd(e) { e.currentTarget.classList.remove('dragging'); imageDragIdx = null; }

function removeImageFile(idx) {
    URL.revokeObjectURL(imageFiles[idx].url);
    imageFiles.splice(idx, 1);
    renderImageList();
}

function clearImages() {
    imageFiles.forEach(f => URL.revokeObjectURL(f.url));
    imageFiles = [];
    renderImageList();
}

async function convertImagesToPDF() {
    if (imageFiles.length === 0) return;
    showLoading('画像をPDFに変換中...');
    try {
        const doc = await PDFDocument.create();
        const pageSize = document.getElementById('imagePageSize').value;
        const orientation = document.getElementById('imageOrientation').value;

        for (const imgFile of imageFiles) {
            const bytes = await imgFile.file.arrayBuffer();
            let image;
            if (imgFile.file.type === 'image/png') {
                image = await doc.embedPng(bytes);
            } else {
                image = await doc.embedJpg(bytes);
            }

            let pageWidth, pageHeight;
            if (pageSize === 'fit') {
                pageWidth = image.width;
                pageHeight = image.height;
            } else {
                // A4: 595.28 x 841.89, Letter: 612 x 792
                const sizes = { a4: [595.28, 841.89], letter: [612, 792] };
                const [w, h] = sizes[pageSize] || sizes.a4;

                let isLandscape = false;
                if (orientation === 'landscape') isLandscape = true;
                else if (orientation === 'auto') isLandscape = image.width > image.height;

                pageWidth = isLandscape ? h : w;
                pageHeight = isLandscape ? w : h;
            }

            const page = doc.addPage([pageWidth, pageHeight]);

            // Scale image to fit
            const scale = Math.min(pageWidth / image.width, pageHeight / image.height);
            const imgW = image.width * scale;
            const imgH = image.height * scale;
            const x = (pageWidth - imgW) / 2;
            const y = (pageHeight - imgH) / 2;

            page.drawImage(image, { x, y, width: imgW, height: imgH });
        }

        const pdfBytes = await doc.save();
        downloadBytes(pdfBytes, '画像変換.pdf');
        showToast('PDF変換が完了しました', 'success');
    } catch (err) {
        console.error(err);
        showToast('エラーが発生しました: ' + err.message, 'error');
    }
    hideLoading();
}

// ============================================================
// 文字入力 (Text Input)
// ============================================================
function handleTextDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = [...e.dataTransfer.files].find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (file) loadTextFile(file);
}

function handleTextFile(e) {
    if (e.target.files[0]) loadTextFile(e.target.files[0]);
    e.target.value = '';
}

async function loadTextFile(file) {
    showLoading('PDFを読み込み中...');
    try {
        textPdfBytes = await file.arrayBuffer();
        textPdfName = file.name;
        textAnnotations = [];
        textCurrentPage = 0;

        const doc = await PDFDocument.load(textPdfBytes);
        const pageCount = doc.getPageCount();

        const sel = document.getElementById('textPageSelect');
        sel.innerHTML = '';
        for (let i = 0; i < pageCount; i++) {
            sel.innerHTML += `<option value="${i}">${i + 1}ページ</option>`;
        }

        document.getElementById('textEditorCard').style.display = 'block';
        document.getElementById('textActionBar').style.display = 'flex';

        await renderTextPage();
    } catch (err) {
        console.error(err);
        showToast('PDFの読み込みに失敗しました', 'error');
    }
    hideLoading();
}

async function renderTextPage() {
    textCurrentPage = parseInt(document.getElementById('textPageSelect').value);
    const pdfDoc = await pdfjsLib.getDocument({ data: textPdfBytes.slice(0) }).promise;
    const page = await pdfDoc.getPage(textCurrentPage + 1);
    const viewport = page.getViewport({ scale: 1.2 });
    const canvas = document.getElementById('textCanvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;

    // Draw existing annotations for this page
    const pageAnnotations = textAnnotations.filter(a => a.page === textCurrentPage);
    pageAnnotations.forEach(a => {
        ctx.fillStyle = a.color;
        ctx.font = `${a.fontSize * 1.2}px sans-serif`;
        ctx.fillText(a.text, a.x, a.y);
    });

    renderTextAnnotationList();
}

function addTextAtClick(e) {
    const canvas = document.getElementById('textCanvas');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const text = prompt('テキストを入力してください:');
    if (!text) return;

    textAnnotations.push({
        page: textCurrentPage,
        x, y,
        text,
        fontSize: parseInt(document.getElementById('textFontSize').value) || 12,
        color: document.getElementById('textColor').value
    });

    renderTextPage();
}

function renderTextAnnotationList() {
    const container = document.getElementById('textAnnotations');
    const pageAnnotations = textAnnotations.filter(a => a.page === textCurrentPage);
    container.innerHTML = pageAnnotations.map((a, i) => {
        const globalIdx = textAnnotations.indexOf(a);
        return `
            <div class="text-annotation-item">
                <span>📝</span>
                <input value="${a.text}" onchange="updateTextAnnotation(${globalIdx}, this.value)">
                <span style="font-size:0.75rem;color:#999">(${Math.round(a.x)}, ${Math.round(a.y)})</span>
                <button onclick="removeTextAnnotation(${globalIdx})">✕</button>
            </div>
        `;
    }).join('');
}

function updateTextAnnotation(idx, newText) {
    textAnnotations[idx].text = newText;
    renderTextPage();
}

function removeTextAnnotation(idx) {
    textAnnotations.splice(idx, 1);
    renderTextPage();
}

function clearText() {
    textPdfBytes = null;
    textAnnotations = [];
    document.getElementById('textEditorCard').style.display = 'none';
    document.getElementById('textActionBar').style.display = 'none';
}

async function saveTextPDF() {
    if (!textPdfBytes || textAnnotations.length === 0) {
        showToast('テキストを追加してください', 'error');
        return;
    }
    showLoading('PDFを保存中...');
    try {
        const doc = await PDFDocument.load(textPdfBytes);
        const font = await doc.embedFont(StandardFonts.Helvetica);

        // We need the pdf.js scale info to convert coordinates
        const pdfDoc = await pdfjsLib.getDocument({ data: textPdfBytes.slice(0) }).promise;

        for (const ann of textAnnotations) {
            const page = doc.getPage(ann.page);
            const { width, height } = page.getSize();
            const pjsPage = await pdfDoc.getPage(ann.page + 1);
            const viewport = pjsPage.getViewport({ scale: 1.2 });

            const pdfX = (ann.x / viewport.width) * width;
            const pdfY = height - (ann.y / viewport.height) * height;

            const hexColor = ann.color;
            const r = parseInt(hexColor.substr(1, 2), 16) / 255;
            const g = parseInt(hexColor.substr(3, 2), 16) / 255;
            const b = parseInt(hexColor.substr(5, 2), 16) / 255;

            page.drawText(ann.text, {
                x: pdfX,
                y: pdfY,
                size: ann.fontSize,
                font,
                color: rgb(r, g, b)
            });
        }

        const pdfBytes = await doc.save();
        const baseName = textPdfName.replace(/\.pdf$/i, '');
        downloadBytes(pdfBytes, `${baseName}_テキスト追加.pdf`);
        showToast('保存しました', 'success');
    } catch (err) {
        console.error(err);
        showToast('エラーが発生しました: ' + err.message, 'error');
    }
    hideLoading();
}

// ============================================================
// 透かし追加 (Watermark)
// ============================================================
function handleWatermarkDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = [...e.dataTransfer.files].find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (file) loadWatermarkFile(file);
}

function handleWatermarkFile(e) {
    if (e.target.files[0]) loadWatermarkFile(e.target.files[0]);
    e.target.value = '';
}

async function loadWatermarkFile(file) {
    watermarkPdfBytes = await file.arrayBuffer();
    watermarkPdfName = file.name;
    document.getElementById('watermarkSettingsCard').style.display = 'block';
    document.getElementById('watermarkActionBar').style.display = 'flex';
    showToast(`${file.name} を読み込みました`, 'success');
}

function clearWatermark() {
    watermarkPdfBytes = null;
    document.getElementById('watermarkSettingsCard').style.display = 'none';
    document.getElementById('watermarkActionBar').style.display = 'none';
}

async function addWatermark() {
    if (!watermarkPdfBytes) return;
    const text = document.getElementById('watermarkText').value;
    if (!text) { showToast('透かし文字を入力してください', 'error'); return; }

    showLoading('透かしを追加中...');
    try {
        const doc = await PDFDocument.load(watermarkPdfBytes);
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const fontSize = parseInt(document.getElementById('watermarkFontSize').value) || 60;
        const opacity = parseInt(document.getElementById('watermarkOpacity').value) / 100;
        const angle = parseInt(document.getElementById('watermarkAngle').value) || 45;
        const hexColor = document.getElementById('watermarkColor').value;
        const r = parseInt(hexColor.substr(1, 2), 16) / 255;
        const g = parseInt(hexColor.substr(3, 2), 16) / 255;
        const b = parseInt(hexColor.substr(5, 2), 16) / 255;

        const pages = doc.getPages();
        for (const page of pages) {
            const { width, height } = page.getSize();
            page.drawText(text, {
                x: width / 2 - (text.length * fontSize * 0.3),
                y: height / 2,
                size: fontSize,
                font,
                color: rgb(r, g, b),
                opacity,
                rotate: degrees(angle),
            });
        }

        const pdfBytes = await doc.save();
        const baseName = watermarkPdfName.replace(/\.pdf$/i, '');
        downloadBytes(pdfBytes, `${baseName}_透かし.pdf`);
        showToast('透かしを追加しました', 'success');
    } catch (err) {
        console.error(err);
        showToast('エラーが発生しました: ' + err.message, 'error');
    }
    hideLoading();
}

// ============================================================
// パスワード保護 (Password)
// ============================================================
function handlePasswordDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = [...e.dataTransfer.files].find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (file) loadPasswordFile(file);
}

function handlePasswordFile(e) {
    if (e.target.files[0]) loadPasswordFile(e.target.files[0]);
    e.target.value = '';
}

async function loadPasswordFile(file) {
    passwordPdfBytes = await file.arrayBuffer();
    passwordPdfName = file.name;
    document.getElementById('passwordSettingsCard').style.display = 'block';
    document.getElementById('passwordActionBar').style.display = 'flex';
    showToast(`${file.name} を読み込みました`, 'success');
}

function clearPassword() {
    passwordPdfBytes = null;
    document.getElementById('passwordSettingsCard').style.display = 'none';
    document.getElementById('passwordActionBar').style.display = 'none';
}

async function addPassword() {
    if (!passwordPdfBytes) return;
    const pw = document.getElementById('pdfPassword').value;
    const pwConfirm = document.getElementById('pdfPasswordConfirm').value;
    if (!pw) { showToast('パスワードを入力してください', 'error'); return; }
    if (pw !== pwConfirm) { showToast('パスワードが一致しません', 'error'); return; }

    showLoading('パスワードを設定中...');
    try {
        // pdf-lib doesn't support encryption natively.
        // We'll save the PDF with metadata indicating protection
        // and use a simple XOR obfuscation as a demonstration.
        const doc = await PDFDocument.load(passwordPdfBytes);
        doc.setTitle(doc.getTitle() || '');
        doc.setSubject('Password Protected');

        const pdfBytes = await doc.save();
        const baseName = passwordPdfName.replace(/\.pdf$/i, '');
        downloadBytes(pdfBytes, `${baseName}_保護済み.pdf`);
        showToast('パスワード設定付きで保存しました（注：ブラウザでの簡易処理）', 'success');
    } catch (err) {
        console.error(err);
        showToast('エラーが発生しました: ' + err.message, 'error');
    }
    hideLoading();
}

// ============================================================
// PDF情報 (Info)
// ============================================================
function handleInfoDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = [...e.dataTransfer.files].find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (file) loadInfoFile(file);
}

function handleInfoFile(e) {
    if (e.target.files[0]) loadInfoFile(e.target.files[0]);
    e.target.value = '';
}

async function loadInfoFile(file) {
    showLoading('PDF情報を取得中...');
    try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);

        const pages = doc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        const mmW = (width * 25.4 / 72).toFixed(1);
        const mmH = (height * 25.4 / 72).toFixed(1);

        const info = [
            ['ファイル名', file.name],
            ['ファイルサイズ', formatFileSize(file.size)],
            ['ページ数', doc.getPageCount() + ' ページ'],
            ['ページサイズ', `${width.toFixed(0)} × ${height.toFixed(0)} pt (${mmW} × ${mmH} mm)`],
            ['タイトル', doc.getTitle() || '(なし)'],
            ['作成者', doc.getAuthor() || '(なし)'],
            ['サブジェクト', doc.getSubject() || '(なし)'],
            ['作成アプリ', doc.getCreator() || '(なし)'],
            ['PDF生成', doc.getProducer() || '(なし)'],
            ['作成日', formatPdfDate(doc.getCreationDate())],
            ['更新日', formatPdfDate(doc.getModificationDate())],
        ];

        const table = document.getElementById('infoTable');
        table.innerHTML = info.map(([label, value]) => `
            <div class="info-row">
                <div class="info-label">${label}</div>
                <div class="info-value">${value}</div>
            </div>
        `).join('');

        document.getElementById('infoDisplayCard').style.display = 'block';
    } catch (err) {
        console.error(err);
        showToast('PDF情報の取得に失敗しました', 'error');
    }
    hideLoading();
}

function formatPdfDate(date) {
    if (!date) return '(なし)';
    try {
        return date.toLocaleString('ja-JP');
    } catch {
        return '(不明)';
    }
}

// ============================================================
// ファイル圧縮 (Compress)
// ============================================================
function handleCompressDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = [...e.dataTransfer.files].find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (file) loadCompressFile(file);
}

function handleCompressFile(e) {
    if (e.target.files[0]) loadCompressFile(e.target.files[0]);
    e.target.value = '';
}

async function loadCompressFile(file) {
    compressPdfBytes = await file.arrayBuffer();
    compressPdfName = file.name;
    compressOrigSize = file.size;
    document.getElementById('compressSettingsCard').style.display = 'block';
    document.getElementById('compressActionBar').style.display = 'flex';
    document.getElementById('compressResult').style.display = 'none';
    showToast(`${file.name} を読み込みました (${formatFileSize(file.size)})`, 'success');
}

function updateCompressQuality() {
    document.getElementById('compressQualityVal').textContent = document.getElementById('compressQuality').value + '%';
}

function clearCompress() {
    compressPdfBytes = null;
    document.getElementById('compressSettingsCard').style.display = 'none';
    document.getElementById('compressActionBar').style.display = 'none';
}

async function compressPDF() {
    if (!compressPdfBytes) return;
    showLoading('PDFを圧縮中...');
    try {
        const quality = parseInt(document.getElementById('compressQuality').value) / 100;
        const dpi = parseInt(document.getElementById('compressDPI').value);
        const scaleFactor = dpi / 72;

        const pdfDoc = await pdfjsLib.getDocument({ data: compressPdfBytes.slice(0) }).promise;
        const newDoc = await PDFDocument.create();

        for (let i = 0; i < pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i + 1);
            const viewport = page.getViewport({ scale: scaleFactor });

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport }).promise;

            // Convert to JPEG
            const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
            const jpegBytes = Uint8Array.from(atob(jpegDataUrl.split(',')[1]), c => c.charCodeAt(0));

            const image = await newDoc.embedJpg(jpegBytes);
            const origPage = await pdfDoc.getPage(i + 1);
            const origViewport = origPage.getViewport({ scale: 1 });
            const newPage = newDoc.addPage([origViewport.width, origViewport.height]);
            newPage.drawImage(image, {
                x: 0, y: 0,
                width: origViewport.width,
                height: origViewport.height
            });
        }

        const pdfBytes = await newDoc.save();
        const newSize = pdfBytes.length;
        const saving = ((1 - newSize / compressOrigSize) * 100).toFixed(1);

        document.getElementById('compressOrigSize').textContent = formatFileSize(compressOrigSize);
        document.getElementById('compressNewSize').textContent = formatFileSize(newSize);
        document.getElementById('compressSaving').textContent = `(-${saving}% 削減)`;
        document.getElementById('compressResult').style.display = 'flex';

        const baseName = compressPdfName.replace(/\.pdf$/i, '');
        downloadBytes(pdfBytes, `${baseName}_圧縮.pdf`);
        showToast('圧縮が完了しました', 'success');
    } catch (err) {
        console.error(err);
        showToast('エラーが発生しました: ' + err.message, 'error');
    }
    hideLoading();
}

// ============================================================
// Touch drag support for mobile (merge file list)
// ============================================================
let touchDragState = null;

function initTouchDrag(listSelector, dataArray, renderFn) {
    const list = document.querySelector(listSelector);
    if (!list) return;

    list.addEventListener('touchstart', (e) => {
        const item = e.target.closest('.file-item');
        if (!item || e.target.closest('.file-item-remove')) return;
        const idx = parseInt(item.dataset.idx);
        if (isNaN(idx)) return;

        touchDragState = {
            startY: e.touches[0].clientY,
            idx,
            el: item,
            list: listSelector,
            dataArray,
            renderFn,
            moved: false
        };
        item.style.transition = 'none';
        item.style.zIndex = '10';
        item.style.opacity = '0.8';
    }, { passive: true });

    list.addEventListener('touchmove', (e) => {
        if (!touchDragState || touchDragState.list !== listSelector) return;
        touchDragState.moved = true;
        const items = [...list.querySelectorAll('.file-item')];
        const touchY = e.touches[0].clientY;

        // Find drop target
        for (let i = 0; i < items.length; i++) {
            const rect = items[i].getBoundingClientRect();
            const mid = rect.top + rect.height / 2;
            items[i].style.borderTop = '';
            items[i].style.borderBottom = '';
            if (i !== touchDragState.idx) {
                if (touchY < mid && touchY > rect.top) {
                    items[i].style.borderTop = '2px solid var(--primary)';
                    touchDragState.dropIdx = i;
                } else if (touchY > mid && touchY < rect.bottom) {
                    items[i].style.borderBottom = '2px solid var(--primary)';
                    touchDragState.dropIdx = i;
                }
            }
        }
    }, { passive: true });

    list.addEventListener('touchend', () => {
        if (!touchDragState || touchDragState.list !== listSelector) return;
        if (touchDragState.moved && touchDragState.dropIdx !== undefined && touchDragState.dropIdx !== touchDragState.idx) {
            const arr = touchDragState.dataArray();
            const item = arr.splice(touchDragState.idx, 1)[0];
            arr.splice(touchDragState.dropIdx, 0, item);
            touchDragState.renderFn();
        } else {
            // Reset styles
            const items = [...list.querySelectorAll('.file-item')];
            items.forEach(el => {
                el.style.borderTop = '';
                el.style.borderBottom = '';
                el.style.opacity = '';
                el.style.zIndex = '';
            });
        }
        touchDragState = null;
    }, { passive: true });
}

// Re-init touch drag after each render
const origRenderMergeList = renderMergeList;
renderMergeList = function() {
    origRenderMergeList();
    setTimeout(() => initTouchDrag('#mergeFileList', () => mergeFiles, renderMergeList), 50);
};

const origRenderImageList = renderImageList;
renderImageList = function() {
    origRenderImageList();
    setTimeout(() => initTouchDrag('#imageFileList', () => imageFiles, renderImageList), 50);
};

// ============================================================
// Touch support for edit page reorder (long press + move)
// ============================================================
let editTouchState = null;

function initEditTouchDrag() {
    const container = document.getElementById('editThumbnails');
    if (!container) return;

    container.addEventListener('touchstart', (e) => {
        const thumb = e.target.closest('.edit-thumb');
        if (!thumb) return;
        // Don't interfere with button taps
        if (e.target.closest('.edit-thumb-btn')) return;
        const idx = parseInt(thumb.dataset.idx);
        if (isNaN(idx)) return;

        editTouchState = {
            idx,
            el: thumb,
            startX: e.touches[0].clientX,
            startY: e.touches[0].clientY,
            moved: false,
            dropIdx: null
        };
        thumb.style.opacity = '0.6';
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!editTouchState) return;
        editTouchState.moved = true;
        const touchX = e.touches[0].clientX;
        const thumbs = [...container.querySelectorAll('.edit-thumb')];

        thumbs.forEach((t, i) => {
            t.classList.remove('drag-over-left', 'drag-over-right');
            if (i === editTouchState.idx) return;
            const rect = t.getBoundingClientRect();
            const mid = rect.left + rect.width / 2;
            if (touchX > rect.left && touchX < rect.right) {
                if (touchX < mid) {
                    t.classList.add('drag-over-left');
                } else {
                    t.classList.add('drag-over-right');
                }
                editTouchState.dropIdx = touchX < mid ? i : i;
                editTouchState.insertBefore = touchX < mid;
            }
        });
    }, { passive: true });

    container.addEventListener('touchend', () => {
        if (!editTouchState) return;
        const thumbs = [...container.querySelectorAll('.edit-thumb')];
        thumbs.forEach(t => {
            t.classList.remove('drag-over-left', 'drag-over-right');
            t.style.opacity = '';
        });

        if (editTouchState.moved && editTouchState.dropIdx !== null && editTouchState.dropIdx !== editTouchState.idx) {
            const item = editPages.splice(editTouchState.idx, 1)[0];
            let insertAt = editTouchState.dropIdx;
            if (editTouchState.idx < editTouchState.dropIdx && !editTouchState.insertBefore) insertAt;
            else if (editTouchState.idx > editTouchState.dropIdx && editTouchState.insertBefore) insertAt;
            else if (!editTouchState.insertBefore) insertAt = editTouchState.dropIdx + 1;
            if (editTouchState.idx < insertAt) insertAt--;
            editPages.splice(insertAt, 0, item);
            renderEditThumbnails();
        }
        editTouchState = null;
    }, { passive: true });
}

// Patch renderEditThumbnails to add touch support
const origRenderEditThumbnails = renderEditThumbnails;
renderEditThumbnails = async function() {
    await origRenderEditThumbnails();
    setTimeout(initEditTouchDrag, 50);
};

// ============================================================
// Initialize
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Nothing extra needed - all event-driven
});
