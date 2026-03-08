// ============================================================
// 〇〇社労士事務所 業務管理システム - App Logic
// ============================================================

// --- Data Store ---
let appData = {
    apiKey: '',
    clients: [],
    records: [],
    payrollStatus: [],
    payrollGuides: [],
    govInquiries: [],
    handoverDocs: []
};

// --- Initialization ---
function init() {
    const saved = localStorage.getItem('srOfficeData');
    if (saved) {
        try {
            appData = JSON.parse(saved);
        } catch (e) {
            loadDemoData();
        }
    } else {
        loadDemoData();
    }
    renderAll();
}

function saveData() {
    localStorage.setItem('srOfficeData', JSON.stringify(appData));
}

function renderAll() {
    renderDashboard();
    renderClients();
    renderPayrollGuide();
    renderGovInquiries();
    renderHandover();
    renderSearch();
    updateRecordClientDropdown();

    const today = new Date();
    document.getElementById('dateDisplay').textContent = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    document.getElementById('recordDate').value = today.toISOString().split('T')[0];
    document.getElementById('currentMonth').textContent = `${today.getFullYear()}年${today.getMonth() + 1}月`;

    if (appData.apiKey) {
        document.getElementById('apiKeyInput').value = '••••••••';
        document.getElementById('apiKeyBanner').style.background = '#f0fdf4';
    }
}

// --- Navigation ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.bottom-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    const sidebarLink = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (sidebarLink) sidebarLink.classList.add('active');
    const bottomTab = document.querySelector(`.bottom-tab[data-page="${pageId}"]`);
    if (bottomTab) bottomTab.classList.add('active');
    closeSidebar();
    window.scrollTo(0, 0);
}

// --- Mobile Sidebar ---
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const btn = document.getElementById('hamburgerBtn');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    btn.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const btn = document.getElementById('hamburgerBtn');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    if (btn) btn.classList.remove('active');
}

function showMobileMenu() {
    openModal('メニュー', `
        <div style="display:flex;flex-direction:column;gap:8px">
            <button class="btn btn-outline" onclick="closeModal();showSettings()" style="justify-content:center">⚙️ 設定</button>
            <button class="btn btn-outline" onclick="closeModal();exportData()" style="justify-content:center">💾 エクスポート</button>
            <button class="btn btn-outline" onclick="closeModal();importData()" style="justify-content:center">📦 インポート</button>
            <button class="btn btn-outline" onclick="closeModal();loadDemoData()" style="justify-content:center">🔧 デモデータに戻す</button>
        </div>
    `);
}

// --- Demo Data ---
function loadDemoData() {
    appData = {
        apiKey: '',
        clients: [
            { id: 1, name: '輝工業株式会社', closingDay: '末日締め', payDay: '翌月25日', emoji: '輝', hasPayrollGuide: true },
            { id: 2, name: '株式会社グリーンワーク', closingDay: '20日締め', payDay: '翌月10日', emoji: '株', hasPayrollGuide: true },
            { id: 3, name: '有限会社サンライズ建設', closingDay: '20日締め', payDay: '翌月5日', emoji: 'サ', hasPayrollGuide: true },
            { id: 4, name: '東洋メンテナンス工業', closingDay: '末日締め', payDay: '翌月20日', emoji: '東', hasPayrollGuide: true },
            { id: 5, name: 'テックスタート合同会社', closingDay: '末日締め', payDay: '翌月末日', emoji: 'テ', hasPayrollGuide: true },
            { id: 6, name: 'ベストケア訪問介護', closingDay: '15日締め', payDay: '当月25日', emoji: 'ベ', hasPayrollGuide: true },
            { id: 7, name: 'みどり保育園', closingDay: '25日締め', payDay: '翌月5日', emoji: 'み', hasPayrollGuide: true },
            { id: 8, name: '株式会社プレミアホテル', closingDay: '末日締め', payDay: '翌月25日', emoji: 'プ', hasPayrollGuide: false },
            { id: 9, name: 'NPO法人やさしい手', closingDay: '末日締め', payDay: '翌月15日', emoji: 'N', hasPayrollGuide: false },
            { id: 10, name: 'ハナマル食品', closingDay: '20日締め', payDay: '翌月10日', emoji: 'ハ', hasPayrollGuide: false }
        ],
        records: [
            { id: 1, clientId: 8, category: '相談', date: '2026-02-25', title: '株式会社プレミアホテル', content: '無期転換ルール対応。対象者3名を確認。', memo: '' },
            { id: 2, clientId: 9, category: '相談', date: '2026-02-20', title: 'NPO法人やさしい手', content: '次回訪問時に就業規則改定を提案予定。', memo: '' },
            { id: 3, clientId: 4, category: '給与計算', date: '2026-03-04', title: '東洋メンテナンス工業', content: '3月給与計算完了。助成金対象者確認済み。', memo: '' },
            { id: 4, clientId: 5, category: '給与計算', date: '2026-03-03', title: 'テックスタート合同会社', content: '新入社員1名の給与設定完了。社会保険加入手続き済み。', memo: '' },
            { id: 5, clientId: 8, category: '給与計算', date: '2026-03-02', title: '株式会社プレミアホテル', content: '2月分給与計算。残業時間の確認が必要。', memo: '' },
            { id: 6, clientId: 9, category: 'メモ', date: '2026-03-01', title: 'NPO法人やさしい手', content: '次回訪問時に就業規則改定を提案予定。', memo: '' },
            { id: 7, clientId: 10, category: 'メモ', date: '2026-02-28', title: 'ハナマル食品', content: '渡辺部長（3月末定年）の手続きに使用予定。就業規則の該当ページをスキャンしておく。', memo: '' },
            { id: 8, clientId: 1, category: '給与計算', date: '2026-03-04', title: '輝工業株式会社', content: '3月分勤怠データ収集中。山田さんからの勤怠表PDF待ち。', memo: '' },
            { id: 9, clientId: 3, category: '給与計算', date: '2026-03-03', title: '有限会社サンライズ建設', content: '給与計算中。残業代の計算確認中。', memo: '' },
            { id: 10, clientId: 5, category: '給与計算', date: '2026-03-02', title: 'テックスタート合同会社', content: '給与計算中。フレックス対応確認。', memo: '' },
        ],
        payrollStatus: [
            { clientId: 1, status: 'データ収集待ち' },
            { clientId: 2, status: '完了' },
            { clientId: 3, status: '計算中' },
            { clientId: 4, status: 'データ収集待ち' },
            { clientId: 5, status: '計算中' },
            { clientId: 6, status: '完了' },
            { clientId: 7, status: '完了' }
        ],
        payrollGuides: [
            {
                clientId: 1,
                procedures: [
                    '毎月20〜25日頃に山田さんから勤怠表PDFをメール受領',
                    'Excelファイルもあわせて DL（支給控除一覧）',
                    'PCA給与に各項目を手入力',
                    '給与台帳PDFと支給控除一覧Excelを突き合わせて照合',
                    '経営者・千葉士連の確認を経て健康保険料（マイナム）を確認'
                ],
                allowances: [
                    '基本給：日給制（日給 × 出勤日数）',
                    '職長手当：職長のみ 月額固定',
                    '組打手当：該当者のみ',
                    '家族手当：扶養家族1人につき支給',
                    '通勤手当：内定出勤日 × 基礎'
                ],
                toolOps: [
                    '【Excel読み込み設定】',
                    'header＝None形式で読み込み',
                    '氏名：行4・列1〜7',
                    '出勤日数＝行6 / 有給＝行7 / 基本給＝行8',
                    '職長手当＝行10 / 組打＝行11 / 実費＝行13'
                ],
                notes: [
                    '遅刻控除がある月は補足説明が必要（給与台帳に記載あり）',
                    '氏名照合はスペース・全角スペースを除去して実施',
                    '千葉士建の請求書は毎月異なる金額になるため要確認',
                    '新入社員・退職者がいる月は日割り計算が必要',
                    '年末調整は12月に別途実施'
                ]
            },
            {
                clientId: 2,
                procedures: [
                    '毎月20日締めで佐藤さんからExcelの勤怠表をメール受領',
                    '正社員3名はフレックスタイム制のため残業代を別途計算',
                    'パート8名は時給×実労働時間で計算',
                    'PCA給与に入力後、翌月10日支払い',
                    '計算完了後に給与明細PDFを作成してメールにて送付'
                ],
                allowances: [
                    '正社員：月給制（固定残業代含む）',
                    'フレックス超過分：1時間あたり時給換算で別途支給',
                    'パート：時給制（900〜1,200円、個人差あり）',
                    '通勤手当：実費支給（上限20,000円/月）',
                    '皆勤手当：時間勤務者のみに該当月計算対象'
                ],
                toolOps: [
                    '【Excel読み込み設定】',
                    'シート「勤怠」を使用',
                    '正社員とパートでシートが分かれている',
                    '実労働時間は列Fに記載',
                    'フレックス超過は列Gで自動計算'
                ],
                notes: [
                    'フレックス精算は月単位で行う',
                    'パートの時給は個人ごとに異なるため要確認',
                    '社会保険料は標準報酬月額から計算',
                    '住民税は特別徴収で処理'
                ]
            }
        ],
        govInquiries: [
            {
                id: 1, type: 'ハローワーク', date: '2026-02-28',
                contact: '鈴木氏', phone: '043-242-1171',
                inquiry: '外国人労働者（技能実習生）の雇用保険加入要件について確認。週所定労働時間20時間以上で31日以上雇用見込みがある場合の加入手続きを問い合わせ。',
                answer: '技能実習生も日本人と同様に加入要件を満たせば雇用保険に加入義務あり。在留資格の種類は問わない。資格取得届は翌月10日までに提出。雇用保険被保険者証の交付は通常1〜2週間とのこと。',
                memo: '輝工業の技能実習生2名について来月手続き予定。在留カードのコピーを事前に取得しておくこと。'
            },
            {
                id: 2, type: '年金事務所', date: '2026-02-20',
                contact: '田中氏（千葉北年金事務所）', phone: '043-244-1521',
                inquiry: '定年退職後の再雇用における社会保険の同日得喪手続きについて。同日付で喪失・取得する際の添付書類と処理期間を確認。',
                answer: '同日得喪は資格喪失届と資格取得届を同日に提出。添付書類は就業規則（定年・再雇用規定のページ）または労働契約書のコピー。処理は通常1週間程度。電子申請の場合は備考欄に「同日得喪」と明記すること。',
                memo: 'ハナマル食品の渡辺部長（3月末定年）の手続きに使用予定。就業規則の該当ページをスキャンしておく。'
            },
            {
                id: 3, type: '労基署', date: '2026-02-10',
                contact: '労働基準監督官・佐藤氏', phone: '043-308-0685',
                inquiry: 'フレックスタイム制の清算期間を1ヶ月から3ヶ月に変更する際の届出について確認。労使協定の届出方法と記載事項を問い合わせ。',
                answer: '3ヶ月清算のフレックスは労使協定を締結し、所轄労基署への届出が必要。届出様式は「フレックスタイム制に関する協定届（様式第3号の3）」。清算期間・総労働時間・コアタイム等を記載。届出は協定締結後速やかに。',
                memo: 'グリーンワークで導入検討中。来月の訪問時に詳細を説明予定。'
            },
            {
                id: 4, type: 'ハローワーク', date: '2026-02-05',
                contact: '山田氏', phone: '043-242-1171',
                inquiry: '特定求職者雇用開発助成金（特定就職困難者コース）の支給申請について。60歳以上の新規雇用者の申請手続きを確認。',
                answer: '支給申請は雇入れ日から6ヶ月経過後に第1期分を申請。支給申請書（様式第1号）に雇用契約書、出勤簿、賃金台帳の写しを添付。申請期限は支給対象期末日の翌日から2ヶ月以内。',
                memo: 'ベストケア訪問介護の新規雇用者（62歳）について4月に第1期申請予定。'
            },
            {
                id: 5, type: '年金事務所', date: '2026-01-28',
                contact: '高橋氏（千葉北年金事務所）', phone: '043-244-1521',
                inquiry: '算定基礎届の提出時期と対象者の確認。4月〜6月の報酬をもとにした届出について。',
                answer: '算定基礎届は毎年7月1日〜10日に提出。4月・5月・6月に支払われた報酬の平均で標準報酬月額を決定。対象は7月1日現在の被保険者（6月1日以降の資格取得者を除く）。',
                memo: '例年通り6月中に各クライアントの報酬データを準備する。'
            },
            {
                id: 6, type: '労基署', date: '2026-01-20',
                contact: '労働基準監督官・渡辺氏', phone: '043-308-0685',
                inquiry: '36協定の特別条項について。月80時間を超える時間外労働の上限規制と届出方法の確認。',
                answer: '特別条項付き36協定でも、時間外労働は年720時間以内、複数月平均80時間以内、月100時間未満が上限。特別条項の発動は年6回まで。届出は「時間外労働・休日労働に関する協定届（様式第9号の2）」を使用。',
                memo: '東洋メンテナンス工業の36協定更新（4月）に向けて準備。特別条項の内容を再確認。'
            },
            {
                id: 7, type: 'その他', date: '2026-01-15',
                contact: '千葉県社労士会・事務局', phone: '043-301-6855',
                inquiry: '研修会の参加申込方法と倫理研修の単位認定について確認。',
                answer: '研修会はWebサイトからオンライン申込。倫理研修は年度内に1回以上の受講が必要。受講証明は研修後にメールで送付される。',
                memo: '3月の倫理研修に申込済み。'
            }
        ],
        handoverDocs: [
            {
                id: 1,
                title: '月次業務フロー',
                content: `【毎月の流れ】
1日〜10日：前月分の給与計算最終確認・振込処理
10日〜15日：社会保険関連の届出処理
15日〜20日：各クライアントからの勤怠データ収集開始
20日〜25日：勤怠データ確認・給与計算
25日〜末日：給与明細作成・クライアントへの送付

【注意事項】
・輝工業は毎月20〜25日に山田さんからPDFが届く
・グリーンワークは20日締めなので21日以降に着手
・ベストケアは15日締めのため、月の前半で処理が必要`,
                updatedAt: '2026-02-15'
            },
            {
                id: 2,
                title: '各行政機関の連絡先・担当者一覧',
                content: `【ハローワーク千葉】
電話：043-242-1171
主な担当：鈴木氏、山田氏
対応時間：8:30〜17:15（平日）

【千葉北年金事務所】
電話：043-244-1521
主な担当：田中氏、高橋氏
対応時間：8:30〜17:15（平日）

【千葉労働基準監督署】
電話：043-308-0685
主な担当：佐藤監督官、渡辺監督官
対応時間：8:30〜17:15（平日）

【千葉県社労士会】
電話：043-301-6855`,
                updatedAt: '2026-01-20'
            },
            {
                id: 3,
                title: 'PCA給与ソフトの操作手順',
                content: `【基本操作】
1. ログイン → メインメニュー → 給与計算
2. 対象月を選択して「データ入力」
3. クライアントごとにフォルダが分かれている
4. 勤怠データをExcelから転記
5. 計算実行 → 確認 → 確定

【トラブル時】
・計算が合わない場合：控除項目を再確認
・エラーが出る場合：PCAサポート（0120-XXX-XXX）に連絡
・バックアップは毎日17時に自動実行`,
                updatedAt: '2026-02-01'
            }
        ]
    };
    saveData();
    if (document.getElementById('dateDisplay')) {
        renderAll();
    }
    showToast('デモデータを読み込みました');
}

// --- Dashboard ---
function renderDashboard() {
    renderKanban();
    renderDashboardRecords();
}

function renderKanban() {
    const board = document.getElementById('kanbanBoard');
    const statuses = ['データ収集待ち', '計算中', '完了'];
    const colClasses = ['kanban-col-data', 'kanban-col-calc', 'kanban-col-done'];
    const icons = ['📋', '🖩', '✅'];

    const groups = { 'データ収集待ち': [], '計算中': [], '完了': [] };
    appData.payrollStatus.forEach(ps => {
        const client = appData.clients.find(c => c.id === ps.clientId);
        if (client) groups[ps.status].push({ ...ps, client });
    });

    const total = appData.payrollStatus.length;
    const done = groups['完了'].length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    document.getElementById('payrollProgress').style.width = pct + '%';
    document.getElementById('payrollProgressText').textContent = `${done}/${total}社 完了 (${pct}%)`;

    board.innerHTML = statuses.map((status, i) => `
        <div class="kanban-column ${colClasses[i]}">
            <div class="kanban-header">
                <span>${icons[i]} ${status}</span>
                <span class="count">${groups[status].length}</span>
            </div>
            <div class="kanban-items">
                ${groups[status].map(item => `
                    <div class="kanban-card">
                        <div class="kanban-card-title">${item.client.name}</div>
                        <div class="kanban-card-sub">${item.client.closingDay} → ${item.client.payDay}</div>
                        <div class="kanban-card-btns">
                            <button class="status-btn status-btn-data ${item.status === 'データ収集待ち' ? 'active-status' : ''}" onclick="changePayrollStatus(${item.clientId}, 'データ収集待ち')">📋 データ収集待ち</button>
                            <button class="status-btn status-btn-calc ${item.status === '計算中' ? 'active-status' : ''}" onclick="changePayrollStatus(${item.clientId}, '計算中')">🖩 計算中</button>
                            <button class="status-btn status-btn-done ${item.status === '完了' ? 'active-status' : ''}" onclick="changePayrollStatus(${item.clientId}, '完了')">✅ 完了</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function changePayrollStatus(clientId, newStatus) {
    const ps = appData.payrollStatus.find(p => p.clientId === clientId);
    if (ps) {
        ps.status = newStatus;
        saveData();
        renderKanban();
    }
}

function renderDashboardRecords() {
    const container = document.getElementById('dashboardRecords');
    const categories = [
        { name: '行政問い合わせ', icon: '🏛️', color: '#e8dff5', textColor: '#5a3d96' },
        { name: '相談', icon: '💬', color: '#fed7aa', textColor: '#9a3412' },
        { name: '給与計算', icon: '📒', color: '#dbeafe', textColor: '#1e40af' },
        { name: 'メモ', icon: '📌', color: '#fecaca', textColor: '#991b1b' },
        { name: 'その他', icon: '👤', color: '#e5e7eb', textColor: '#374151' }
    ];

    container.innerHTML = categories.map(cat => {
        let items = [];
        let count = 0;
        if (cat.name === '行政問い合わせ') {
            items = appData.govInquiries.slice(0, 3);
            count = appData.govInquiries.length;
        } else {
            items = appData.records.filter(r => r.category === cat.name).slice(0, 3);
            count = appData.records.filter(r => r.category === cat.name).length;
        }

        return `
            <div class="record-cat-column">
                <div class="record-cat-header" style="background:${cat.color};color:${cat.textColor}">
                    <span>${cat.icon} ${cat.name}</span>
                    <span class="count" style="background:${cat.textColor};color:white;border-radius:50%;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:0.7rem">${count}</span>
                </div>
                <div class="record-cat-items">
                    ${items.length === 0 ? '<div style="text-align:center;color:#999;font-size:0.8rem;padding:12px">記録なし</div>' : ''}
                    ${items.map(item => {
                        if (cat.name === '行政問い合わせ') {
                            return `<div class="record-mini-card" onclick="showPage('gov-inquiries')">
                                <h4><span class="gov-badge gov-badge-${item.type}">${item.type}</span></h4>
                                <p>${item.inquiry.substring(0, 30)}...</p>
                                <div class="date">${item.date}</div>
                            </div>`;
                        }
                        return `<div class="record-mini-card" onclick="showRecordDetail(${item.id})">
                            <h4>${item.title}</h4>
                            <p>${item.content.substring(0, 30)}...</p>
                            <div class="date">${item.date}</div>
                        </div>`;
                    }).join('')}
                    <button class="add-record-btn" onclick="showPage('add-record')">＋ 追加</button>
                </div>
            </div>
        `;
    }).join('');
}

// --- Clients ---
function renderClients() {
    const list = document.getElementById('clientList');
    list.innerHTML = appData.clients.map(c => `
        <div class="client-card">
            <div class="client-info">
                <div class="client-avatar">${c.emoji}</div>
                <div>
                    <div class="client-name">${c.name}</div>
                    <div class="client-detail">${c.closingDay} → ${c.payDay}</div>
                </div>
            </div>
            <div class="client-actions">
                ${c.hasPayrollGuide ? '<span class="registered-badge">✅ 登録済み</span>' : ''}
                <button class="btn btn-sm btn-outline" onclick="editClient(${c.id})">✏️ 編集</button>
                <button class="btn btn-sm btn-danger" onclick="deleteClient(${c.id})">削除</button>
            </div>
        </div>
    `).join('');
}

function showAddClientModal() {
    openModal('新規クライアント追加', `
        <div class="form-group">
            <label>会社名</label>
            <input type="text" id="modalClientName" class="form-input" placeholder="例：株式会社〇〇">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>締め日</label>
                <input type="text" id="modalClientClosing" class="form-input" placeholder="例：末日締め">
            </div>
            <div class="form-group">
                <label>支払日</label>
                <input type="text" id="modalClientPayDay" class="form-input" placeholder="例：翌月25日">
            </div>
        </div>
        <div class="form-group">
            <label>アイコン文字（1文字）</label>
            <input type="text" id="modalClientEmoji" class="form-input" maxlength="2" placeholder="例：株">
        </div>
        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="addClient()">追加</button>
        </div>
    `);
}

function addClient() {
    const name = document.getElementById('modalClientName').value.trim();
    const closing = document.getElementById('modalClientClosing').value.trim();
    const payDay = document.getElementById('modalClientPayDay').value.trim();
    const emoji = document.getElementById('modalClientEmoji').value.trim() || name.charAt(0);

    if (!name) { showToast('会社名を入力してください'); return; }

    const id = Math.max(0, ...appData.clients.map(c => c.id)) + 1;
    appData.clients.push({ id, name, closingDay: closing || '末日締め', payDay: payDay || '翌月25日', emoji, hasPayrollGuide: false });
    saveData();
    renderClients();
    updateRecordClientDropdown();
    closeModal();
    showToast('クライアントを追加しました');
}

function editClient(id) {
    const c = appData.clients.find(cl => cl.id === id);
    if (!c) return;
    openModal('クライアント編集', `
        <div class="form-group">
            <label>会社名</label>
            <input type="text" id="modalClientName" class="form-input" value="${c.name}">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>締め日</label>
                <input type="text" id="modalClientClosing" class="form-input" value="${c.closingDay}">
            </div>
            <div class="form-group">
                <label>支払日</label>
                <input type="text" id="modalClientPayDay" class="form-input" value="${c.payDay}">
            </div>
        </div>
        <div class="form-group">
            <label>アイコン文字</label>
            <input type="text" id="modalClientEmoji" class="form-input" maxlength="2" value="${c.emoji}">
        </div>
        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="updateClient(${id})">保存</button>
        </div>
    `);
}

function updateClient(id) {
    const c = appData.clients.find(cl => cl.id === id);
    if (!c) return;
    c.name = document.getElementById('modalClientName').value.trim();
    c.closingDay = document.getElementById('modalClientClosing').value.trim();
    c.payDay = document.getElementById('modalClientPayDay').value.trim();
    c.emoji = document.getElementById('modalClientEmoji').value.trim() || c.name.charAt(0);
    saveData();
    renderAll();
    closeModal();
    showToast('クライアント情報を更新しました');
}

function deleteClient(id) {
    if (!confirm('このクライアントを削除しますか？')) return;
    appData.clients = appData.clients.filter(c => c.id !== id);
    appData.records = appData.records.filter(r => r.clientId !== id);
    appData.payrollStatus = appData.payrollStatus.filter(p => p.clientId !== id);
    appData.payrollGuides = appData.payrollGuides.filter(p => p.clientId !== id);
    saveData();
    renderAll();
    showToast('クライアントを削除しました');
}

// --- Add Record ---
function updateRecordClientDropdown() {
    const sel = document.getElementById('recordClient');
    sel.innerHTML = '<option value="">選択してください</option>' +
        appData.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function selectCategory(btn) {
    document.querySelectorAll('#categoryButtons .cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function switchInputTab(tab, btn) {
    document.querySelectorAll('.input-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('voiceInputArea').style.display = tab === 'voice' ? 'block' : 'none';
    document.getElementById('textInputArea').style.display = tab === 'text' ? 'block' : 'none';
}

let isRecording = false;
let recognition = null;

function toggleRecording() {
    const micBtn = document.getElementById('micButton');
    const micHint = document.getElementById('micHint');

    if (!isRecording) {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            showToast('お使いのブラウザは音声入力に対応していません。テキスト入力をご利用ください。');
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = function(event) {
            let transcript = '';
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            document.getElementById('recordContent').value = transcript;
        };

        recognition.onerror = function(event) {
            showToast('音声認識エラー: ' + event.error);
            stopRecording();
        };

        recognition.onend = function() {
            if (isRecording) {
                recognition.start();
            }
        };

        recognition.start();
        isRecording = true;
        micBtn.classList.add('recording');
        micHint.textContent = '録音中... もう一度押して停止';
    } else {
        stopRecording();
    }
}

function stopRecording() {
    isRecording = false;
    if (recognition) recognition.stop();
    document.getElementById('micButton').classList.remove('recording');
    document.getElementById('micHint').textContent = 'ボタンを押して録音開始';
}

function clearRecordForm() {
    document.getElementById('recordContent').value = '';
    document.getElementById('recordClient').value = '';
    document.querySelectorAll('#categoryButtons .cat-btn').forEach((b, i) => {
        b.classList.toggle('active', i === 0);
    });
}

function autoSave() {
    const content = document.getElementById('recordContent').value.trim();
    if (!content) {
        showToast('内容を入力してください');
        return;
    }

    if (!appData.apiKey) {
        showToast('AIおまかせ保存にはAPIキーが必要です。手動で保存します。');
        manualSave();
        return;
    }

    callAnthropicAPI(content).then(result => {
        if (result) {
            openModal('おまかせ保存 - 確認', `
                <p>AIが以下のように判定しました。確認して保存してください。</p>
                <div class="form-group">
                    <label>クライアント</label>
                    <select id="modalAutoClient" class="form-select">
                        <option value="">不明</option>
                        ${appData.clients.map(c => `<option value="${c.id}" ${result.clientId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>種別</label>
                    <select id="modalAutoCat" class="form-select">
                        ${['相談','給与計算','手続き','メモ','その他'].map(cat => `<option ${result.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>要約</label>
                    <textarea id="modalAutoSummary" class="form-textarea" rows="3">${result.summary}</textarea>
                </div>
                <div class="form-actions">
                    <button class="btn btn-outline" onclick="closeModal()">キャンセル</button>
                    <button class="btn btn-primary" onclick="confirmAutoSave()">保存</button>
                </div>
            `);
        }
    }).catch(() => {
        showToast('AI解析に失敗しました。手動で保存してください。');
    });
}

async function callAnthropicAPI(content) {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': appData.apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 500,
                messages: [{
                    role: 'user',
                    content: `以下は社労士事務所の業務記録です。この内容を分析して、JSON形式で回答してください。

内容: "${content}"

クライアント候補: ${appData.clients.map(c => `${c.id}:${c.name}`).join(', ')}

以下のJSON形式で回答してください（JSONのみ、説明不要）:
{"clientId": クライアントID（不明なら0）, "category": "相談|給与計算|手続き|メモ|その他のいずれか", "summary": "要約（50文字以内）"}`
                }]
            })
        });

        const data = await response.json();
        const text = data.content[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error('API Error:', e);
    }
    return { clientId: 0, category: 'メモ', summary: content.substring(0, 50) };
}

function confirmAutoSave() {
    const clientId = parseInt(document.getElementById('modalAutoClient').value) || 0;
    const category = document.getElementById('modalAutoCat').value;
    const summary = document.getElementById('modalAutoSummary').value;
    const client = appData.clients.find(c => c.id === clientId);

    const id = Math.max(0, ...appData.records.map(r => r.id)) + 1;
    appData.records.unshift({
        id,
        clientId,
        category,
        date: document.getElementById('recordDate').value,
        title: client ? client.name : '不明',
        content: summary,
        memo: ''
    });
    saveData();
    renderAll();
    closeModal();
    clearRecordForm();
    showToast('記録を保存しました');
}

function manualSave() {
    const clientId = parseInt(document.getElementById('recordClient').value) || 0;
    const activeBtn = document.querySelector('#categoryButtons .cat-btn.active');
    const category = activeBtn ? activeBtn.dataset.cat : '相談';
    const content = document.getElementById('recordContent').value.trim();
    const client = appData.clients.find(c => c.id === clientId);

    if (!content) { showToast('内容を入力してください'); return; }

    const id = Math.max(0, ...appData.records.map(r => r.id)) + 1;
    appData.records.unshift({
        id,
        clientId,
        category,
        date: document.getElementById('recordDate').value,
        title: client ? client.name : '不明',
        content,
        memo: ''
    });
    saveData();
    renderAll();
    clearRecordForm();
    showToast('記録を保存しました');
}

function saveWithAISummary() {
    const content = document.getElementById('recordContent').value.trim();
    if (!content) { showToast('内容を入力してください'); return; }

    if (!appData.apiKey) {
        showToast('APIキーが設定されていません。手動で保存します。');
        manualSave();
        return;
    }

    autoSave();
}

// --- Search ---
let currentSearchFilter = 'all';

function renderSearch() {
    searchRecords();
}

function filterSearch(btn, filter) {
    document.querySelectorAll('.filter-row .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSearchFilter = filter;
    searchRecords();
}

function searchRecords() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const container = document.getElementById('searchResults');

    let results = appData.records;
    if (currentSearchFilter !== 'all') {
        results = results.filter(r => r.category === currentSearchFilter);
    }
    if (query) {
        results = results.filter(r =>
            r.title.toLowerCase().includes(query) ||
            r.content.toLowerCase().includes(query) ||
            (r.memo && r.memo.toLowerCase().includes(query))
        );
    }

    results.sort((a, b) => b.date.localeCompare(a.date));

    container.innerHTML = results.length === 0
        ? '<div class="empty-state">記録が見つかりません</div>'
        : results.map(r => `
            <div class="record-card">
                <div class="record-card-header">
                    <div class="record-card-meta">
                        <span class="record-badge badge-${r.category}">${r.category}</span>
                        <span>${r.date}</span>
                        <span>${r.title}</span>
                    </div>
                    <div class="record-card-actions">
                        <button class="btn btn-sm btn-outline" onclick="editRecord(${r.id})">編集</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteRecord(${r.id})">削除</button>
                    </div>
                </div>
                <div class="record-section section-content">
                    <div class="record-section-content">${escapeHtml(r.content)}</div>
                </div>
                ${r.memo ? `<div class="record-section section-memo"><div class="record-section-title">📌 メモ</div><div class="record-section-content">${escapeHtml(r.memo)}</div></div>` : ''}
            </div>
        `).join('');
}

function showRecordDetail(id) {
    const r = appData.records.find(rec => rec.id === id);
    if (!r) return;
    openModal(r.title, `
        <div class="record-card-meta" style="margin-bottom:12px">
            <span class="record-badge badge-${r.category}">${r.category}</span>
            <span>${r.date}</span>
        </div>
        <div class="record-section section-content">
            <div class="record-section-content">${escapeHtml(r.content)}</div>
        </div>
        ${r.memo ? `<div class="record-section section-memo" style="margin-top:8px"><div class="record-section-title">📌 メモ</div><div class="record-section-content">${escapeHtml(r.memo)}</div></div>` : ''}
        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeModal()">閉じる</button>
            <button class="btn btn-primary" onclick="closeModal();editRecord(${r.id})">編集</button>
        </div>
    `);
}

function editRecord(id) {
    const r = appData.records.find(rec => rec.id === id);
    if (!r) return;
    openModal('記録を編集', `
        <div class="form-group">
            <label>クライアント</label>
            <select id="modalEditClient" class="form-select">
                <option value="">選択なし</option>
                ${appData.clients.map(c => `<option value="${c.id}" ${r.clientId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>種別</label>
                <select id="modalEditCat" class="form-select">
                    ${['相談','給与計算','手続き','メモ','その他'].map(cat => `<option ${r.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>日付</label>
                <input type="date" id="modalEditDate" class="form-input" value="${r.date}">
            </div>
        </div>
        <div class="form-group">
            <label>内容</label>
            <textarea id="modalEditContent" class="form-textarea" rows="4">${escapeHtml(r.content)}</textarea>
        </div>
        <div class="form-group">
            <label>メモ</label>
            <textarea id="modalEditMemo" class="form-textarea" rows="2">${escapeHtml(r.memo || '')}</textarea>
        </div>
        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="updateRecord(${id})">保存</button>
        </div>
    `);
}

function updateRecord(id) {
    const r = appData.records.find(rec => rec.id === id);
    if (!r) return;
    const clientId = parseInt(document.getElementById('modalEditClient').value) || 0;
    const client = appData.clients.find(c => c.id === clientId);
    r.clientId = clientId;
    r.category = document.getElementById('modalEditCat').value;
    r.date = document.getElementById('modalEditDate').value;
    r.content = document.getElementById('modalEditContent').value;
    r.memo = document.getElementById('modalEditMemo').value;
    r.title = client ? client.name : r.title;
    saveData();
    renderAll();
    closeModal();
    showToast('記録を更新しました');
}

function deleteRecord(id) {
    if (!confirm('この記録を削除しますか？')) return;
    appData.records = appData.records.filter(r => r.id !== id);
    saveData();
    renderAll();
    showToast('記録を削除しました');
}

// --- Payroll Guide ---
function renderPayrollGuide() {
    const list = document.getElementById('payrollGuideList');
    const guidedCount = appData.payrollGuides.length;
    const totalCount = appData.clients.length;
    document.getElementById('payrollGuideCount').textContent = `登録済み ${guidedCount} / ${totalCount} 社`;

    list.innerHTML = appData.payrollGuides.map(guide => {
        const client = appData.clients.find(c => c.id === guide.clientId);
        if (!client) return '';
        return `
            <div class="payroll-client-card">
                <div class="payroll-client-header">
                    <div class="payroll-client-info">
                        <div class="client-avatar">${client.emoji}</div>
                        <div>
                            <div class="client-name">${client.name}</div>
                            <div class="client-detail">${client.closingDay} → ${client.payDay}</div>
                        </div>
                    </div>
                    <div>
                        <span class="registered-badge">✅ 登録済み</span>
                        <button class="btn btn-sm btn-outline" onclick="editPayrollGuide(${client.id})">✏️ 編集</button>
                    </div>
                </div>
                <div class="payroll-grid">
                    <div class="payroll-section payroll-procedure">
                        <h4>📝 手順・ルール</h4>
                        <ol>${guide.procedures.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ol>
                    </div>
                    <div class="payroll-section payroll-allowance">
                        <h4>💰 手当ルール</h4>
                        <ul>${guide.allowances.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>
                    </div>
                    <div class="payroll-section payroll-tool">
                        <h4>🖥️ ツール操作</h4>
                        <ul>${guide.toolOps.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
                    </div>
                    <div class="payroll-section payroll-notes">
                        <h4>⚠️ 注意点</h4>
                        <ul>${guide.notes.map(n => `<li>${escapeHtml(n)}</li>`).join('')}</ul>
                    </div>
                </div>
                <div class="payroll-footer">
                    <button class="btn btn-sm btn-outline">詳細を見る →</button>
                </div>
            </div>
        `;
    }).join('');
}

function editPayrollGuide(clientId) {
    const guide = appData.payrollGuides.find(g => g.clientId === clientId);
    if (!guide) return;
    openModal('給与計算ガイド編集', `
        <div class="form-group">
            <label>手順・ルール（1行1項目）</label>
            <textarea id="modalGuideProcedures" class="form-textarea" rows="5">${guide.procedures.join('\n')}</textarea>
        </div>
        <div class="form-group">
            <label>手当ルール（1行1項目）</label>
            <textarea id="modalGuideAllowances" class="form-textarea" rows="5">${guide.allowances.join('\n')}</textarea>
        </div>
        <div class="form-group">
            <label>ツール操作（1行1項目）</label>
            <textarea id="modalGuideToolOps" class="form-textarea" rows="5">${guide.toolOps.join('\n')}</textarea>
        </div>
        <div class="form-group">
            <label>注意点（1行1項目）</label>
            <textarea id="modalGuideNotes" class="form-textarea" rows="5">${guide.notes.join('\n')}</textarea>
        </div>
        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="updatePayrollGuide(${clientId})">保存</button>
        </div>
    `);
}

function updatePayrollGuide(clientId) {
    const guide = appData.payrollGuides.find(g => g.clientId === clientId);
    if (!guide) return;
    guide.procedures = document.getElementById('modalGuideProcedures').value.split('\n').filter(l => l.trim());
    guide.allowances = document.getElementById('modalGuideAllowances').value.split('\n').filter(l => l.trim());
    guide.toolOps = document.getElementById('modalGuideToolOps').value.split('\n').filter(l => l.trim());
    guide.notes = document.getElementById('modalGuideNotes').value.split('\n').filter(l => l.trim());
    saveData();
    renderPayrollGuide();
    closeModal();
    showToast('給与計算ガイドを更新しました');
}

// --- Government Inquiries ---
let currentGovFilter = 'all';

function renderGovInquiries() {
    const types = [...new Set(appData.govInquiries.map(g => g.type))];
    const filterRow = document.getElementById('govFilterRow');
    filterRow.innerHTML = `
        <button class="filter-btn ${currentGovFilter === 'all' ? 'active' : ''}" onclick="filterGov(this, 'all')">すべて (${appData.govInquiries.length})</button>
        ${types.map(t => {
            const count = appData.govInquiries.filter(g => g.type === t).length;
            return `<button class="filter-btn ${currentGovFilter === t ? 'active' : ''}" onclick="filterGov(this, '${t}')">🏛️ ${t} (${count})</button>`;
        }).join('')}
    `;
    renderGovList();
}

function filterGov(btn, type) {
    document.querySelectorAll('#govFilterRow .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentGovFilter = type;
    renderGovList();
}

function searchGovInquiries() {
    renderGovList();
}

function renderGovList() {
    const query = document.getElementById('govSearchInput').value.toLowerCase();
    const list = document.getElementById('govInquiryList');

    let items = appData.govInquiries;
    if (currentGovFilter !== 'all') {
        items = items.filter(g => g.type === currentGovFilter);
    }
    if (query) {
        items = items.filter(g =>
            g.inquiry.toLowerCase().includes(query) ||
            g.answer.toLowerCase().includes(query) ||
            g.memo.toLowerCase().includes(query) ||
            g.contact.toLowerCase().includes(query)
        );
    }

    items.sort((a, b) => b.date.localeCompare(a.date));

    list.innerHTML = items.length === 0
        ? '<div class="empty-state">記録が見つかりません</div>'
        : items.map(g => `
            <div class="record-card gov-card type-${g.type}">
                <div class="record-card-header">
                    <div class="record-card-meta">
                        <span class="gov-badge gov-badge-${g.type}">🏛️ ${g.type}</span>
                        <span>${g.date}</span>
                        <span>担当：${escapeHtml(g.contact)}</span>
                        <span>📞 ${escapeHtml(g.phone)}</span>
                    </div>
                    <div class="record-card-actions">
                        <button class="btn btn-sm btn-outline" onclick="editGovInquiry(${g.id})">編集</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteGovInquiry(${g.id})">削除</button>
                    </div>
                </div>
                <div class="record-section section-inquiry">
                    <div class="record-section-title">❓ 問い合わせ内容</div>
                    <div class="record-section-content">${escapeHtml(g.inquiry)}</div>
                </div>
                <div class="record-section section-answer">
                    <div class="record-section-title">💬 回答・結果</div>
                    <div class="record-section-content">${escapeHtml(g.answer)}</div>
                </div>
                ${g.memo ? `
                <div class="record-section section-memo">
                    <div class="record-section-title">📌 メモ・TODO</div>
                    <div class="record-section-content">${escapeHtml(g.memo)}</div>
                </div>` : ''}
            </div>
        `).join('');
}

function showAddGovInquiryModal() {
    openModal('新規 行政問い合わせ記録', `
        <div class="form-row">
            <div class="form-group">
                <label>種類</label>
                <select id="modalGovType" class="form-select">
                    <option>ハローワーク</option>
                    <option>労基署</option>
                    <option>年金事務所</option>
                    <option>その他</option>
                </select>
            </div>
            <div class="form-group">
                <label>日付</label>
                <input type="date" id="modalGovDate" class="form-input" value="${new Date().toISOString().split('T')[0]}">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>担当者</label>
                <input type="text" id="modalGovContact" class="form-input" placeholder="例：鈴木氏">
            </div>
            <div class="form-group">
                <label>電話番号</label>
                <input type="text" id="modalGovPhone" class="form-input" placeholder="例：043-XXX-XXXX">
            </div>
        </div>
        <div class="form-group">
            <label>問い合わせ内容</label>
            <textarea id="modalGovInquiry" class="form-textarea" rows="3" placeholder="問い合わせた内容を入力"></textarea>
        </div>
        <div class="form-group">
            <label>回答・結果</label>
            <textarea id="modalGovAnswer" class="form-textarea" rows="3" placeholder="得られた回答を入力"></textarea>
        </div>
        <div class="form-group">
            <label>メモ・TODO</label>
            <textarea id="modalGovMemo" class="form-textarea" rows="2" placeholder="補足メモやTODOを入力"></textarea>
        </div>
        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="addGovInquiry()">保存</button>
        </div>
    `);
}

function addGovInquiry() {
    const inquiry = document.getElementById('modalGovInquiry').value.trim();
    if (!inquiry) { showToast('問い合わせ内容を入力してください'); return; }

    const id = Math.max(0, ...appData.govInquiries.map(g => g.id)) + 1;
    appData.govInquiries.unshift({
        id,
        type: document.getElementById('modalGovType').value,
        date: document.getElementById('modalGovDate').value,
        contact: document.getElementById('modalGovContact').value,
        phone: document.getElementById('modalGovPhone').value,
        inquiry,
        answer: document.getElementById('modalGovAnswer').value,
        memo: document.getElementById('modalGovMemo').value
    });
    saveData();
    renderGovInquiries();
    closeModal();
    showToast('行政問い合わせ記録を追加しました');
}

function editGovInquiry(id) {
    const g = appData.govInquiries.find(gi => gi.id === id);
    if (!g) return;
    openModal('行政問い合わせ記録を編集', `
        <div class="form-row">
            <div class="form-group">
                <label>種類</label>
                <select id="modalGovType" class="form-select">
                    ${['ハローワーク','労基署','年金事務所','その他'].map(t => `<option ${g.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>日付</label>
                <input type="date" id="modalGovDate" class="form-input" value="${g.date}">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>担当者</label>
                <input type="text" id="modalGovContact" class="form-input" value="${escapeHtml(g.contact)}">
            </div>
            <div class="form-group">
                <label>電話番号</label>
                <input type="text" id="modalGovPhone" class="form-input" value="${escapeHtml(g.phone)}">
            </div>
        </div>
        <div class="form-group">
            <label>問い合わせ内容</label>
            <textarea id="modalGovInquiry" class="form-textarea" rows="3">${escapeHtml(g.inquiry)}</textarea>
        </div>
        <div class="form-group">
            <label>回答・結果</label>
            <textarea id="modalGovAnswer" class="form-textarea" rows="3">${escapeHtml(g.answer)}</textarea>
        </div>
        <div class="form-group">
            <label>メモ・TODO</label>
            <textarea id="modalGovMemo" class="form-textarea" rows="2">${escapeHtml(g.memo)}</textarea>
        </div>
        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="updateGovInquiry(${id})">保存</button>
        </div>
    `);
}

function updateGovInquiry(id) {
    const g = appData.govInquiries.find(gi => gi.id === id);
    if (!g) return;
    g.type = document.getElementById('modalGovType').value;
    g.date = document.getElementById('modalGovDate').value;
    g.contact = document.getElementById('modalGovContact').value;
    g.phone = document.getElementById('modalGovPhone').value;
    g.inquiry = document.getElementById('modalGovInquiry').value;
    g.answer = document.getElementById('modalGovAnswer').value;
    g.memo = document.getElementById('modalGovMemo').value;
    saveData();
    renderGovInquiries();
    closeModal();
    showToast('記録を更新しました');
}

function deleteGovInquiry(id) {
    if (!confirm('この記録を削除しますか？')) return;
    appData.govInquiries = appData.govInquiries.filter(g => g.id !== id);
    saveData();
    renderGovInquiries();
    renderDashboard();
    showToast('記録を削除しました');
}

// --- Handover ---
function renderHandover() {
    const list = document.getElementById('handoverList');
    list.innerHTML = appData.handoverDocs.length === 0
        ? '<div class="empty-state">引き継ぎ資料がありません</div>'
        : appData.handoverDocs.map(doc => `
            <div class="handover-card">
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                    <div class="handover-title">📄 ${escapeHtml(doc.title)}</div>
                    <div style="display:flex;gap:6px">
                        <button class="btn btn-sm btn-outline" onclick="editHandover(${doc.id})">編集</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteHandover(${doc.id})">削除</button>
                    </div>
                </div>
                <div class="handover-content">${escapeHtml(doc.content)}</div>
                <div class="handover-meta">最終更新：${doc.updatedAt}</div>
            </div>
        `).join('');
}

function showAddHandoverModal() {
    openModal('新規引き継ぎ資料', `
        <div class="form-group">
            <label>タイトル</label>
            <input type="text" id="modalHandoverTitle" class="form-input" placeholder="資料タイトル">
        </div>
        <div class="form-group">
            <label>内容</label>
            <textarea id="modalHandoverContent" class="form-textarea" rows="10" placeholder="引き継ぎ内容を入力"></textarea>
        </div>
        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="addHandover()">保存</button>
        </div>
    `);
}

function addHandover() {
    const title = document.getElementById('modalHandoverTitle').value.trim();
    const content = document.getElementById('modalHandoverContent').value.trim();
    if (!title || !content) { showToast('タイトルと内容を入力してください'); return; }

    const id = Math.max(0, ...appData.handoverDocs.map(d => d.id)) + 1;
    appData.handoverDocs.push({
        id, title, content,
        updatedAt: new Date().toISOString().split('T')[0]
    });
    saveData();
    renderHandover();
    closeModal();
    showToast('引き継ぎ資料を追加しました');
}

function editHandover(id) {
    const doc = appData.handoverDocs.find(d => d.id === id);
    if (!doc) return;
    openModal('引き継ぎ資料を編集', `
        <div class="form-group">
            <label>タイトル</label>
            <input type="text" id="modalHandoverTitle" class="form-input" value="${escapeHtml(doc.title)}">
        </div>
        <div class="form-group">
            <label>内容</label>
            <textarea id="modalHandoverContent" class="form-textarea" rows="10">${escapeHtml(doc.content)}</textarea>
        </div>
        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="updateHandover(${id})">保存</button>
        </div>
    `);
}

function updateHandover(id) {
    const doc = appData.handoverDocs.find(d => d.id === id);
    if (!doc) return;
    doc.title = document.getElementById('modalHandoverTitle').value.trim();
    doc.content = document.getElementById('modalHandoverContent').value.trim();
    doc.updatedAt = new Date().toISOString().split('T')[0];
    saveData();
    renderHandover();
    closeModal();
    showToast('引き継ぎ資料を更新しました');
}

function deleteHandover(id) {
    if (!confirm('この資料を削除しますか？')) return;
    appData.handoverDocs = appData.handoverDocs.filter(d => d.id !== id);
    saveData();
    renderHandover();
    showToast('資料を削除しました');
}

// --- Settings ---
function saveApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (key && !key.startsWith('••')) {
        appData.apiKey = key;
        saveData();
        document.getElementById('apiKeyInput').value = '••••••••';
        document.getElementById('apiKeyBanner').style.background = '#f0fdf4';
        showToast('APIキーを保存しました');
    }
}

function showSettings() {
    openModal('設定', `
        <div class="form-group">
            <label>Anthropic APIキー</label>
            <input type="password" id="modalApiKey" class="form-input" value="${appData.apiKey}" placeholder="sk-ant-...">
            <small style="color:#666">AI要約機能に使用されます</small>
        </div>
        <div class="form-actions">
            <button class="btn btn-outline" onclick="closeModal()">キャンセル</button>
            <button class="btn btn-primary" onclick="saveSettingsModal()">保存</button>
        </div>
    `);
}

function saveSettingsModal() {
    appData.apiKey = document.getElementById('modalApiKey').value.trim();
    saveData();
    renderAll();
    closeModal();
    showToast('設定を保存しました');
}

// --- Export / Import ---
function exportData() {
    const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sr-office-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('データをエクスポートしました');
}

function importData() {
    document.getElementById('importFileInput').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            appData = data;
            saveData();
            renderAll();
            showToast('データをインポートしました');
        } catch (err) {
            showToast('ファイルの読み込みに失敗しました');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// --- Modal ---
function openModal(title, bodyHtml) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// --- Toast ---
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- Utilities ---
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Init ---
document.addEventListener('DOMContentLoaded', init);
