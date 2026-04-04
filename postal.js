// ===== 税理士法人向け 送付状作成ツール =====

// --- 書類カテゴリ定義（税理士法人用） ---
const DOC_CATEGORIES = [
  {
    name: '法人税関連',
    docs: [
      '法人税確定申告書', '法人税中間申告書', '法人税修正申告書',
      '法人税予定申告書', '別表一～別表十六'
    ]
  },
  {
    name: '消費税関連',
    docs: [
      '消費税確定申告書', '消費税中間申告書', '消費税修正申告書',
      '簡易課税制度選択届出書', '課税事業者届出書',
      '課税事業者選択届出書', '適格請求書発行事業者届出書'
    ]
  },
  {
    name: '所得税関連',
    docs: [
      '所得税確定申告書', '所得税修正申告書', '青色申告決算書',
      '青色申告承認申請書', '収支内訳書'
    ]
  },
  {
    name: '決算・財務関連',
    docs: [
      '決算報告書', '貸借対照表', '損益計算書',
      '株主資本等変動計算書', '個別注記表',
      '勘定科目内訳明細書', '事業概況説明書（概況書）',
      '法人事業概況説明書'
    ]
  },
  {
    name: '地方税関連',
    docs: [
      '法人住民税申告書', '法人事業税申告書',
      '均等割申告書', '償却資産申告書'
    ]
  },
  {
    name: '源泉徴収・年末調整関連',
    docs: [
      '源泉徴収票', '給与支払報告書', '法定調書合計表',
      '年末調整関連書類（一式）', '扶養控除等申告書',
      '保険料控除申告書', '住宅借入金等特別控除申告書'
    ]
  },
  {
    name: '届出・申請書類',
    docs: [
      '法人設立届出書', '異動届出書', '給与支払事務所開設届出書',
      '棚卸資産の評価方法の届出書', '減価償却資産の償却方法の届出書',
      '事前確定届出給与に関する届出書', '納期の特例の承認申請書'
    ]
  },
  {
    name: '相続・贈与税関連',
    docs: [
      '相続税申告書', '贈与税申告書', '財産目録',
      '遺産分割協議書（写）'
    ]
  },
  {
    name: 'その他',
    docs: [
      '顧問契約書', '議事録', '納付書', '各種届出書',
      '請求書', '領収書', '委任状', '本人確認書類（写）'
    ]
  }
];

// --- ストレージキー ---
const STORAGE_KEYS = {
  history: 'postal_history',
  addresses: 'postal_addresses',
  settings: 'postal_settings'
};

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  initDate();
  renderDocCategories();
  loadAddresses();
  loadSettings();
  renderHistory();
  bindEvents();
  updatePreview();
});

// --- 日付の初期化 ---
function initDate() {
  const today = new Date();
  document.getElementById('sendDate').value = today.toISOString().split('T')[0];
}

// --- 書類カテゴリの描画 ---
function renderDocCategories() {
  const container = document.getElementById('documentCategories');
  container.innerHTML = '';
  DOC_CATEGORIES.forEach((cat, ci) => {
    const div = document.createElement('div');
    div.className = 'doc-category';
    div.innerHTML = `<div class="doc-category-title">・${cat.name}</div>`;
    cat.docs.forEach((doc, di) => {
      const id = `doc_${ci}_${di}`;
      const item = document.createElement('div');
      item.className = 'doc-item';
      item.innerHTML = `
        <input type="checkbox" id="${id}" data-doc="${doc}" class="doc-check" />
        <span class="doc-label">${doc}</span>
        <input type="number" value="1" min="1" max="99" class="doc-count" data-for="${id}" />
        <select class="doc-unit" data-for="${id}">
          <option value="部">部</option>
          <option value="枚">枚</option>
          <option value="通">通</option>
          <option value="式">式</option>
          <option value="冊">冊</option>
        </select>
      `;
      div.appendChild(item);
    });
    container.appendChild(div);
  });
}

// --- イベントバインド ---
function bindEvents() {
  // タブ切り替え
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // プレビュー自動更新
  const inputs = document.querySelectorAll('#sendDate, #addressSelect, #addressSuffix, #addressDirect, #contactPerson, #contactSuffix_sama, #subject, #remarks');
  inputs.forEach(el => el.addEventListener('input', updatePreview));
  inputs.forEach(el => el.addEventListener('change', updatePreview));
  document.querySelectorAll('input[name="deliveryMethod"]').forEach(r => r.addEventListener('change', updatePreview));
  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('doc-check') || e.target.classList.contains('doc-count') || e.target.classList.contains('doc-unit')) {
      updatePreview();
    }
  });

  // 宛先選択 → 直接入力クリア
  document.getElementById('addressSelect').addEventListener('change', function() {
    if (this.value) {
      document.getElementById('addressDirect').value = '';
      const addresses = getAddresses();
      const addr = addresses.find(a => a.name === this.value);
      if (addr && addr.contact) {
        document.getElementById('contactPerson').value = addr.contact;
      }
    }
    updatePreview();
  });
  document.getElementById('addressDirect').addEventListener('input', function() {
    if (this.value) document.getElementById('addressSelect').value = '';
    updatePreview();
  });

  // その他書類追加
  document.getElementById('btnAddCustomDoc').addEventListener('click', addCustomDoc);

  // アクションボタン
  document.getElementById('btnConfirm').addEventListener('click', confirmAndRecord);
  document.getElementById('btnPrint').addEventListener('click', () => window.print());
  document.getElementById('btnReset').addEventListener('click', resetForm);

  // 一覧タブ
  document.getElementById('listSearch').addEventListener('input', renderHistory);
  document.getElementById('filterMethod').addEventListener('change', renderHistory);
  document.getElementById('filterYear').addEventListener('change', renderHistory);
  document.getElementById('btnCsvExport').addEventListener('click', exportCsv);
  document.getElementById('btnDeleteAll').addEventListener('click', deleteAllHistory);

  // テーブルソート
  document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => sortTable(th.dataset.sort));
  });

  // 宛先管理
  document.getElementById('btnAddAddr').addEventListener('click', addAddress);

  // 事務所設定
  document.getElementById('btnSettings').addEventListener('click', () => {
    loadSettingsToModal();
    document.getElementById('settingsModal').style.display = 'flex';
  });
  document.getElementById('btnCloseSettings').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = 'none';
  });
  document.getElementById('btnSaveSettings').addEventListener('click', saveSettings);
}

// --- プレビュー更新 ---
function updatePreview() {
  const area = document.getElementById('previewArea');
  const settings = getSettings();
  const date = document.getElementById('sendDate').value;
  const addrSelect = document.getElementById('addressSelect').value;
  const addrDirect = document.getElementById('addressDirect').value;
  const addrSuffix = document.getElementById('addressSuffix').value;
  const contact = document.getElementById('contactPerson').value;
  const contactSama = document.getElementById('contactSuffix_sama').checked;
  const subject = document.getElementById('subject').value;
  const remarks = document.getElementById('remarks').value;
  const docs = getSelectedDocs();

  const toName = addrDirect || addrSelect || '（宛先）';
  const dateStr = date ? formatJapaneseDate(date) : '';

  let docsHtml = '';
  if (docs.length > 0) {
    docsHtml = '<table>';
    docs.forEach(d => {
      docsHtml += `<tr><td>【送付書類】</td><td>${d.name}</td><td>${d.count}${d.unit}</td></tr>`;
    });
    docsHtml += '</table>';
  }

  let contactLine = '';
  if (contact) {
    contactLine = `<br>${contact}${contactSama ? ' 様' : ''}`;
  }

  let subjectLine = '';
  if (subject) {
    subjectLine = `<div class="pv-subject"><strong>件名：${subject}</strong></div>`;
  }

  let remarksLine = '';
  if (remarks) {
    remarksLine = `<div class="pv-remarks">※ ${remarks}</div>`;
  }

  area.innerHTML = `
    <div class="pv-date">${dateStr}</div>
    <div class="pv-to">${toName}　${addrSuffix}${contactLine}</div>
    <div class="pv-from">
      ${settings.zip ? settings.zip + ' ' : '〒000-0000 '}${settings.address || '〇〇県〇〇市〇〇町1-2-3'}<br>
      ${settings.name || '税理士法人 〇〇事務所'}<br>
      ${settings.repName || '〇〇 〇〇'}<br>
      ${settings.tel ? 'TEL：' + settings.tel : 'TEL：000-0000-0000'}
    </div>
    <div class="pv-title-wrap"><span class="pv-title">書類送付のご案内</span></div>
    <div class="pv-body">
      拝啓　時下ますますご清栄のこととお慶び申し上げます。<br>
      平素では大変お世話になっております。下記の書類をお送りいたしますのでご査収の程よろしくお願い申し上げます。
    </div>
    <div class="pv-keigo">敬具</div>
    <div class="pv-ki">記</div>
    ${subjectLine}
    <div class="pv-docs">${docsHtml || '<p style="color:#999;">（送付書類を選択してください）</p>'}</div>
    <div class="pv-ijo">以　上</div>
    ${remarksLine}
  `;
}

// --- 選択中の書類取得 ---
function getSelectedDocs() {
  const docs = [];
  document.querySelectorAll('.doc-check:checked').forEach(cb => {
    const id = cb.id;
    const count = document.querySelector(`.doc-count[data-for="${id}"]`).value;
    const unit = document.querySelector(`.doc-unit[data-for="${id}"]`).value;
    docs.push({ name: cb.dataset.doc, count, unit });
  });
  // カスタム書類
  document.querySelectorAll('#customDocList li').forEach(li => {
    docs.push({
      name: li.dataset.name,
      count: li.dataset.count,
      unit: li.dataset.unit
    });
  });
  return docs;
}

// --- カスタム書類追加 ---
function addCustomDoc() {
  const nameEl = document.getElementById('customDocName');
  const countEl = document.getElementById('customDocCount');
  const unitEl = document.getElementById('customDocUnit');
  const name = nameEl.value.trim();
  if (!name) return;

  const li = document.createElement('li');
  li.dataset.name = name;
  li.dataset.count = countEl.value;
  li.dataset.unit = unitEl.value;
  li.innerHTML = `<span>${name}（${countEl.value}${unitEl.value}）</span><button onclick="this.parentElement.remove();updatePreview();">✕</button>`;
  document.getElementById('customDocList').appendChild(li);
  nameEl.value = '';
  countEl.value = '1';
  updatePreview();
}

// --- 送付確定 ---
function confirmAndRecord() {
  const addrSelect = document.getElementById('addressSelect').value;
  const addrDirect = document.getElementById('addressDirect').value;
  const toName = addrDirect || addrSelect;
  if (!toName) {
    alert('宛先を入力または選択してください。');
    return;
  }
  const docs = getSelectedDocs();
  if (docs.length === 0) {
    alert('送付書類を1つ以上選択してください。');
    return;
  }

  const suffix = document.getElementById('addressSuffix').value;
  const contact = document.getElementById('contactPerson').value;
  const method = document.querySelector('input[name="deliveryMethod"]:checked').value;
  const subject = document.getElementById('subject').value;
  const memo = document.getElementById('internalMemo').value;
  const date = document.getElementById('sendDate').value;

  const record = {
    id: Date.now(),
    date,
    to: toName + '　' + suffix + (contact ? '　' + contact : ''),
    docs: docs.map(d => `${d.name}（${d.count}${d.unit}）`).join('、'),
    method,
    subject,
    memo
  };

  const history = getHistory();
  history.unshift(record);
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));

  alert('送付を記録しました。');
  renderHistory();

  // 一覧タブに切り替え
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('[data-tab="list"]').classList.add('active');
  document.getElementById('tab-list').classList.add('active');
}

// --- フォームリセット ---
function resetForm() {
  document.getElementById('addressSelect').value = '';
  document.getElementById('addressDirect').value = '';
  document.getElementById('contactPerson').value = '';
  document.getElementById('subject').value = '';
  document.getElementById('remarks').value = '';
  document.getElementById('internalMemo').value = '';
  document.querySelectorAll('.doc-check').forEach(cb => cb.checked = false);
  document.querySelectorAll('.doc-count').forEach(el => el.value = '1');
  document.getElementById('customDocList').innerHTML = '';
  document.querySelector('input[name="deliveryMethod"][value="普通郵便"]').checked = true;
  initDate();
  updatePreview();
}

// --- 履歴 ---
function getHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.history)) || []; }
  catch { return []; }
}

let currentSort = { key: 'date', asc: false };

function renderHistory() {
  const history = getHistory();
  const search = (document.getElementById('listSearch').value || '').toLowerCase();
  const methodFilter = document.getElementById('filterMethod').value;
  const yearFilter = document.getElementById('filterYear').value;

  // 年フィルターの選択肢を更新
  updateYearFilter(history);

  let filtered = history.filter(r => {
    if (search && !r.to.toLowerCase().includes(search) && !r.docs.toLowerCase().includes(search) && !(r.subject || '').toLowerCase().includes(search)) return false;
    if (methodFilter && r.method !== methodFilter) return false;
    if (yearFilter && !r.date.startsWith(yearFilter)) return false;
    return true;
  });

  // ソート
  filtered.sort((a, b) => {
    let va = a[currentSort.key] || '';
    let vb = b[currentSort.key] || '';
    if (currentSort.key === 'date') {
      return currentSort.asc ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    return currentSort.asc ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const tbody = document.getElementById('historyBody');
  tbody.innerHTML = filtered.map(r => `
    <tr>
      <td>${r.date}</td>
      <td>${escHtml(r.to)}</td>
      <td>${escHtml(r.docs)}</td>
      <td><span class="method-badge method-${r.method}">${r.method}</span></td>
      <td>${escHtml(r.subject || '')}${r.memo ? '<br><small style="color:#888;">' + escHtml(r.memo) + '</small>' : ''}</td>
      <td><button class="btn-del-row" onclick="deleteRecord(${r.id})">🗑</button></td>
    </tr>
  `).join('');

  document.getElementById('listCount').textContent = `${filtered.length}件`;
}

function updateYearFilter(history) {
  const select = document.getElementById('filterYear');
  const current = select.value;
  const years = [...new Set(history.map(r => r.date.substring(0, 4)))].sort().reverse();
  const opts = '<option value="">すべての年</option>' + years.map(y => `<option value="${y}">${y}年</option>`).join('');
  select.innerHTML = opts;
  select.value = current;
}

function sortTable(key) {
  if (currentSort.key === key) {
    currentSort.asc = !currentSort.asc;
  } else {
    currentSort = { key, asc: true };
  }
  renderHistory();
}

function deleteRecord(id) {
  if (!confirm('この記録を削除しますか？')) return;
  const history = getHistory().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  renderHistory();
}

function deleteAllHistory() {
  if (!confirm('全件削除しますか？この操作は取り消せません。')) return;
  localStorage.removeItem(STORAGE_KEYS.history);
  renderHistory();
}

// --- CSVエクスポート ---
function exportCsv() {
  const history = getHistory();
  if (history.length === 0) { alert('データがありません。'); return; }
  const header = '送付日,宛先,送付書類,送付方法,件名,メモ';
  const rows = history.map(r =>
    [r.date, csvEsc(r.to), csvEsc(r.docs), r.method, csvEsc(r.subject || ''), csvEsc(r.memo || '')].join(',')
  );
  const csv = '\uFEFF' + header + '\n' + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `送付履歴_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function csvEsc(str) {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// --- 宛先管理 ---
function getAddresses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.addresses)) || []; }
  catch { return []; }
}

function loadAddresses() {
  const addresses = getAddresses();
  // セレクト更新
  const select = document.getElementById('addressSelect');
  select.innerHTML = '<option value="">▼ 一覧から選択</option>';
  addresses.forEach(a => {
    select.innerHTML += `<option value="${escHtml(a.name)}">${escHtml(a.name)}${a.contact ? ' / ' + escHtml(a.contact) : ''}</option>`;
  });
  // 宛先リスト描画
  const list = document.getElementById('addressList');
  list.innerHTML = addresses.map((a, i) => `
    <li>
      <div class="addr-info">
        ${escHtml(a.name)}
        ${a.contact ? '<span class="addr-contact">' + escHtml(a.contact) + '</span>' : ''}
      </div>
      <button onclick="deleteAddress(${i})">✕</button>
    </li>
  `).join('');
}

function addAddress() {
  const name = document.getElementById('newAddrName').value.trim();
  if (!name) return;
  const contact = document.getElementById('newAddrContact').value.trim();
  const addresses = getAddresses();
  addresses.push({ name, contact });
  localStorage.setItem(STORAGE_KEYS.addresses, JSON.stringify(addresses));
  document.getElementById('newAddrName').value = '';
  document.getElementById('newAddrContact').value = '';
  loadAddresses();
}

function deleteAddress(index) {
  const addresses = getAddresses();
  addresses.splice(index, 1);
  localStorage.setItem(STORAGE_KEYS.addresses, JSON.stringify(addresses));
  loadAddresses();
}

// --- 事務所設定 ---
function getSettings() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.settings)) || {}; }
  catch { return {}; }
}

function loadSettings() {
  // 設定があればヘッダーに反映
  const s = getSettings();
  if (s.name) {
    document.querySelector('.header-sub').textContent = s.name;
  }
}

function loadSettingsToModal() {
  const s = getSettings();
  document.getElementById('settingOfficeName').value = s.name || '';
  document.getElementById('settingZip').value = s.zip || '';
  document.getElementById('settingAddress').value = s.address || '';
  document.getElementById('settingRepName').value = s.repName || '';
  document.getElementById('settingTel').value = s.tel || '';
}

function saveSettings() {
  const settings = {
    name: document.getElementById('settingOfficeName').value.trim(),
    zip: document.getElementById('settingZip').value.trim(),
    address: document.getElementById('settingAddress').value.trim(),
    repName: document.getElementById('settingRepName').value.trim(),
    tel: document.getElementById('settingTel').value.trim()
  };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  loadSettings();
  updatePreview();
  document.getElementById('settingsModal').style.display = 'none';
  alert('設定を保存しました。');
}

// --- ユーティリティ ---
function formatJapaneseDate(dateStr) {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  // 令和計算
  let reiwa = year - 2018;
  let eraStr = `令和${reiwa}年${month}月${day}日`;

  return eraStr;
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
