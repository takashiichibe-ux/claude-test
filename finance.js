/* ========================================================================
   経営分析工房 - 月次報告書 & トークスクリプト生成
   完全クライアントサイド動作 (PDF.js + Chart.js)
   ======================================================================== */

if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

/* ---------- State ---------- */
const state = {
    files: [],
    extractedText: '',
    company: { name: '', month: '', fiscalEnd: 3, employees: 0 },
    data: { prev: {}, curr: {} },
    industry: null,
    indicators: null,
    scores: null,
    radarChart: null,
    trendChart: null,
};

/* ---------- 業種別ベンチマーク (中小企業実態調査ベースの代表値) ---------- */
const INDUSTRIES = {
    manufacturing: { name: '製造業', icon: '🏭',
        grossMargin: 22, opMargin: 3.5, ordMargin: 4.2,
        equityRatio: 41, currentRatio: 165, quickRatio: 105, fixedRatio: 130,
        totalAssetTurnover: 1.05, laborShare: 50, salesPerEmployee: 32000 },
    construction: { name: '建設業', icon: '🏗️',
        grossMargin: 21, opMargin: 3.8, ordMargin: 4.5,
        equityRatio: 40, currentRatio: 170, quickRatio: 130, fixedRatio: 95,
        totalAssetTurnover: 1.30, laborShare: 22, salesPerEmployee: 45000 },
    wholesale: { name: '卸売業', icon: '📦',
        grossMargin: 15, opMargin: 1.8, ordMargin: 2.3,
        equityRatio: 38, currentRatio: 160, quickRatio: 110, fixedRatio: 90,
        totalAssetTurnover: 1.80, laborShare: 14, salesPerEmployee: 80000 },
    retail: { name: '小売業', icon: '🏪',
        grossMargin: 30, opMargin: 2.5, ordMargin: 3.0,
        equityRatio: 34, currentRatio: 140, quickRatio: 70, fixedRatio: 140,
        totalAssetTurnover: 1.85, laborShare: 18, salesPerEmployee: 25000 },
    restaurant: { name: '飲食業', icon: '🍴',
        grossMargin: 60, opMargin: 1.5, ordMargin: 2.2,
        equityRatio: 18, currentRatio: 95, quickRatio: 75, fixedRatio: 200,
        totalAssetTurnover: 1.40, laborShare: 38, salesPerEmployee: 9000 },
    service: { name: 'サービス業', icon: '💼',
        grossMargin: 45, opMargin: 4.5, ordMargin: 5.0,
        equityRatio: 36, currentRatio: 160, quickRatio: 135, fixedRatio: 115,
        totalAssetTurnover: 1.20, laborShare: 50, salesPerEmployee: 18000 },
    realestate: { name: '不動産業', icon: '🏢',
        grossMargin: 30, opMargin: 9.5, ordMargin: 9.0,
        equityRatio: 30, currentRatio: 150, quickRatio: 100, fixedRatio: 150,
        totalAssetTurnover: 0.40, laborShare: 12, salesPerEmployee: 60000 },
    transport: { name: '運輸業', icon: '🚚',
        grossMargin: 15, opMargin: 3.0, ordMargin: 3.5,
        equityRatio: 36, currentRatio: 145, quickRatio: 120, fixedRatio: 145,
        totalAssetTurnover: 1.10, laborShare: 45, salesPerEmployee: 15000 },
    it: { name: '情報通信業', icon: '💻',
        grossMargin: 40, opMargin: 6.0, ordMargin: 6.5,
        equityRatio: 50, currentRatio: 220, quickRatio: 195, fixedRatio: 65,
        totalAssetTurnover: 1.10, laborShare: 55, salesPerEmployee: 18000 },
    medical: { name: '医療・福祉', icon: '🏥',
        grossMargin: 50, opMargin: 4.0, ordMargin: 4.5,
        equityRatio: 30, currentRatio: 175, quickRatio: 145, fixedRatio: 150,
        totalAssetTurnover: 1.00, laborShare: 60, salesPerEmployee: 12000 },
};

/* ---------- ナビゲーション ---------- */
function showStep(n) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${n}`).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector(`.nav-item[data-step="${n}"]`)?.classList.add('active');

    if (n === 3) renderIndustries();
    if (n === 4) runAnalysis();
    if (n === 5) generateReport();
    if (n === 6) generateTalkScript();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- PDF ドロップ処理 ---------- */
function initDropZone() {
    const dz = document.getElementById('dropZone');
    const input = document.getElementById('fileInput');
    dz.addEventListener('click', () => input.click());
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
    dz.addEventListener('drop', e => {
        e.preventDefault();
        dz.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    input.addEventListener('change', e => handleFiles(e.target.files));
}

async function handleFiles(fileList) {
    const pdfs = Array.from(fileList).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (!pdfs.length) {
        setStatus('PDFファイルが見つかりませんでした。', 'error');
        return;
    }
    for (const f of pdfs) {
        state.files.push({ name: f.name, size: f.size, status: '処理中…' });
        renderFileList();
        try {
            const text = await extractPDFText(f);
            state.extractedText += `\n\n========== ${f.name} ==========\n${text}`;
            state.files[state.files.length - 1].status = '✓ 解析済';
            state.files[state.files.length - 1].done = true;
        } catch (err) {
            console.error(err);
            state.files[state.files.length - 1].status = '✗ 失敗';
            state.files[state.files.length - 1].error = true;
        }
        renderFileList();
    }

    document.getElementById('extractedTextBox').textContent = state.extractedText.slice(0, 8000);
    const parsed = parseFinancialData(state.extractedText);
    if (parsed.matched > 0) {
        applyParsedData(parsed);
        setStatus(`${parsed.matched}件の科目を自動抽出しました。Step 2 で内容を確認してください。`, 'success');
    } else {
        setStatus('科目の自動抽出ができませんでした。Step 2 で手入力してください（PDFがスキャン画像の場合はテキスト化が必要です）。', '');
    }
}

function renderFileList() {
    const html = state.files.map(f => `
        <div class="file-item">
            <span class="file-item-icon">📄</span>
            <span class="file-item-name">${escapeHtml(f.name)}</span>
            <span class="file-item-status ${f.done ? 'done' : ''} ${f.error ? 'error' : ''}">${escapeHtml(f.status)}</span>
        </div>`).join('');
    document.getElementById('fileList').innerHTML = html;
}

function setStatus(msg, type = '') {
    const el = document.getElementById('extractionStatus');
    el.textContent = msg;
    el.className = 'extraction-status' + (type ? ' ' + type : '');
}

/* ---------- PDF.js テキスト抽出 (座標付き) ---------- */
async function extractPDFText(file) {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let allLines = [];
    for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        // y座標でグルーピング
        const rows = {};
        for (const item of content.items) {
            const y = Math.round(item.transform[5]);
            // 同一行とみなす範囲
            let key = null;
            for (const k of Object.keys(rows)) {
                if (Math.abs(k - y) < 4) { key = k; break; }
            }
            if (key === null) key = y;
            (rows[key] = rows[key] || []).push({ x: item.transform[4], str: item.str });
        }
        const sortedKeys = Object.keys(rows).map(Number).sort((a, b) => b - a);
        for (const k of sortedKeys) {
            const sorted = rows[k].sort((a, b) => a.x - b.x);
            const line = sorted.map(s => s.str).join(' ').replace(/\s+/g, ' ').trim();
            if (line) allLines.push(line);
        }
        allLines.push('---PAGE---');
    }
    return allLines.join('\n');
}

/* ---------- 数値抽出ロジック ---------- */
const ACCOUNT_PATTERNS = [
    { key: 'sales',              labels: ['売上高合計', '売上高', '売上合計', '売上', '営業収益'] },
    { key: 'cogs',               labels: ['売上原価合計', '売上原価', '当期商品仕入高'] },
    { key: 'grossProfit',        labels: ['売上総利益', '粗利益', '粗利'] },
    { key: 'sga',                labels: ['販売費及び一般管理費合計', '販売費及び一般管理費', '販売費・一般管理費', '販管費', '一般管理費'] },
    { key: 'operatingIncome',    labels: ['営業利益', '営業損失'] },
    { key: 'nonOpIncome',        labels: ['営業外収益合計', '営業外収益'] },
    { key: 'nonOpExpense',       labels: ['営業外費用合計', '営業外費用'] },
    { key: 'ordinaryIncome',    labels: ['経常利益', '経常損失'] },
    { key: 'netIncome',          labels: ['当期純利益', '当期利益', '税引後当期純利益', '当期純損失'] },
    { key: 'personnel',          labels: ['人件費', '給料手当', '役員報酬'] },
    { key: 'depreciation',       labels: ['減価償却費'] },
    { key: 'currentAssets',      labels: ['流動資産合計', '流動資産'] },
    { key: 'cash',               labels: ['現金及び預金', '現金預金', '現預金'] },
    { key: 'receivables',        labels: ['売掛金', '受取手形及び売掛金', '売上債権'] },
    { key: 'inventory',          labels: ['棚卸資産', '商品', '製品', '在庫'] },
    { key: 'fixedAssets',        labels: ['固定資産合計', '固定資産'] },
    { key: 'totalAssets',        labels: ['資産合計', '資産の部合計', '総資産'] },
    { key: 'currentLiabilities', labels: ['流動負債合計', '流動負債'] },
    { key: 'payables',           labels: ['買掛金', '支払手形及び買掛金', '仕入債務'] },
    { key: 'fixedLiabilities',   labels: ['固定負債合計', '固定負債'] },
    { key: 'longDebt',           labels: ['長期借入金'] },
    { key: 'equity',             labels: ['純資産合計', '純資産', '株主資本合計', '自己資本'] },
];

function parseFinancialData(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const result = { prev: {}, curr: {}, matched: 0 };

    for (const line of lines) {
        // 行から科目とすべての数値を取り出す
        const nums = extractNumbersInLine(line);
        if (nums.length === 0) continue;
        const matched = matchAccount(line);
        if (!matched) continue;

        // 2期比較表ならば数値が2つ以上 → [前期, 当期] or [当期, 前期]
        // 試算表など1期だけならば数値1つ → 当期のみ
        // 一般的に左から「前期→当期」「前年同月→当月」と並ぶケースが多い
        if (nums.length >= 2) {
            // すでに値が入っていれば上書きしない
            if (result.prev[matched.key] === undefined) {
                result.prev[matched.key] = nums[0];
                result.matched++;
            }
            if (result.curr[matched.key] === undefined) {
                result.curr[matched.key] = nums[1];
                result.matched++;
            }
        } else {
            if (result.curr[matched.key] === undefined) {
                result.curr[matched.key] = nums[0];
                result.matched++;
            }
        }
    }
    return result;
}

function matchAccount(line) {
    for (const acc of ACCOUNT_PATTERNS) {
        for (const lbl of acc.labels) {
            if (line.includes(lbl)) return acc;
        }
    }
    return null;
}

function extractNumbersInLine(line) {
    // △ や ▲ は負値、(123) も負値、3桁区切り対応
    const cleaned = line.replace(/[,，]/g, '');
    const re = /([△▲\-\(])?\s*(\d{1,12})(?:\.\d+)?\s*\)?/g;
    const nums = [];
    let m;
    while ((m = re.exec(cleaned))) {
        const sign = (m[1] === '△' || m[1] === '▲' || m[1] === '-' || m[1] === '(') ? -1 : 1;
        const v = parseInt(m[2], 10) * sign;
        if (Math.abs(v) >= 1) nums.push(v);
    }
    // フィルタ: 日付らしい数字(2000-2099など年や月日)はノイズ。ただし金額に2025などはほぼないので、許容する。
    return nums;
}

function applyParsedData(parsed) {
    document.querySelectorAll('input[data-key]').forEach(input => {
        const period = input.dataset.period;
        const key = input.dataset.key;
        const v = parsed[period]?.[key];
        if (v !== undefined && !input.value) input.value = v;
    });
    recalcDerived();
}

/* ---------- データテーブル: 派生計算 ---------- */
function readInputs() {
    const d = { prev: {}, curr: {} };
    document.querySelectorAll('input[data-key]').forEach(i => {
        const p = i.dataset.period, k = i.dataset.key;
        d[p][k] = i.value === '' ? 0 : Number(i.value);
    });
    return d;
}

function recalcDerived() {
    const d = readInputs();
    for (const p of ['prev', 'curr']) {
        const x = d[p];
        const grossProfit = (x.sales || 0) - (x.cogs || 0);
        const operatingIncome = grossProfit - (x.sga || 0);
        const ordinaryIncome = operatingIncome + (x.nonOpIncome || 0) - (x.nonOpExpense || 0);
        const totalAssets = (x.currentAssets || 0) + (x.fixedAssets || 0);
        const equity = totalAssets - (x.currentLiabilities || 0) - (x.fixedLiabilities || 0);
        setCalc(`${p}-grossProfit`, grossProfit);
        setCalc(`${p}-operatingIncome`, operatingIncome);
        setCalc(`${p}-ordinaryIncome`, ordinaryIncome);
        setCalc(`${p}-totalAssets`, totalAssets);
        setCalc(`${p}-equity`, equity);
        d[p].grossProfit = grossProfit;
        d[p].operatingIncome = operatingIncome;
        d[p].ordinaryIncome = ordinaryIncome;
        d[p].totalAssets = totalAssets;
        d[p].equity = equity;
    }
    state.data = d;
}

function setCalc(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = formatNumber(val);
}

function formatNumber(n) {
    if (n === undefined || n === null || isNaN(n)) return '-';
    return Math.round(n).toLocaleString('ja-JP');
}

/* ---------- 業種選択 ---------- */
function renderIndustries() {
    const grid = document.getElementById('industryGrid');
    grid.innerHTML = Object.entries(INDUSTRIES).map(([key, ind]) => `
        <div class="industry-card${state.industry === key ? ' selected' : ''}" onclick="selectIndustry('${key}')">
            <div class="industry-card-icon">${ind.icon}</div>
            <div class="industry-card-name">${ind.name}</div>
        </div>`).join('');
    if (state.industry) showIndustryDetail(state.industry);
}

function selectIndustry(key) {
    state.industry = key;
    renderIndustries();
    showIndustryDetail(key);
}

function showIndustryDetail(key) {
    const ind = INDUSTRIES[key];
    document.getElementById('industryDetailCard').style.display = 'block';
    document.getElementById('industryDetail').innerHTML = `
    <table>
        <tr><th>指標</th><th>平均値</th></tr>
        <tr><td>売上総利益率</td><td>${ind.grossMargin}%</td></tr>
        <tr><td>営業利益率</td><td>${ind.opMargin}%</td></tr>
        <tr><td>経常利益率</td><td>${ind.ordMargin}%</td></tr>
        <tr><td>自己資本比率</td><td>${ind.equityRatio}%</td></tr>
        <tr><td>流動比率</td><td>${ind.currentRatio}%</td></tr>
        <tr><td>当座比率</td><td>${ind.quickRatio}%</td></tr>
        <tr><td>固定比率（低いほど良）</td><td>${ind.fixedRatio}%</td></tr>
        <tr><td>総資本回転率</td><td>${ind.totalAssetTurnover}回</td></tr>
        <tr><td>労働分配率（低いほど良）</td><td>${ind.laborShare}%</td></tr>
        <tr><td>一人当たり売上高</td><td>${ind.salesPerEmployee.toLocaleString()}千円</td></tr>
    </table>`;
}

/* ---------- 分析エンジン ---------- */
function calcIndicators(period) {
    const x = state.data[period] || {};
    const emp = state.company.employees || 1;
    const ratio = (a, b) => b ? (a / b) * 100 : 0;
    const quickAssets = (x.cash || 0) + (x.receivables || 0);
    const equity = x.equity || 0;
    const fixedLong = equity + (x.fixedLiabilities || 0);
    return {
        sales: x.sales || 0,
        grossMargin: ratio(x.grossProfit || 0, x.sales || 0),
        opMargin: ratio(x.operatingIncome || 0, x.sales || 0),
        ordMargin: ratio(x.ordinaryIncome || 0, x.sales || 0),
        netMargin: ratio(x.netIncome || 0, x.sales || 0),
        equityRatio: ratio(equity, x.totalAssets || 0),
        currentRatio: ratio(x.currentAssets || 0, x.currentLiabilities || 0),
        quickRatio: ratio(quickAssets, x.currentLiabilities || 0),
        fixedRatio: ratio(x.fixedAssets || 0, equity || 1),
        fixedLongRatio: ratio(x.fixedAssets || 0, fixedLong || 1),
        totalAssetTurnover: (x.totalAssets || 0) ? (x.sales || 0) / x.totalAssets : 0,
        laborShare: ratio(x.personnel || 0, x.grossProfit || 1),
        salesPerEmployee: (x.sales || 0) / emp,
        roa: ratio(x.ordinaryIncome || 0, x.totalAssets || 0),
        roe: ratio(x.netIncome || 0, equity || 1),
    };
}

function judgeRatio(actual, avg, higherBetter = true) {
    if (!avg) return { label: '判定不能', cls: 'j-normal', score: 3, gap: 0 };
    const ratio = actual / avg;
    const eff = higherBetter ? ratio : 1 / Math.max(ratio, 0.01);
    if (eff >= 1.3) return { label: '優秀', cls: 'j-excellent', score: 5, gap: actual - avg };
    if (eff >= 1.1) return { label: '良好', cls: 'j-good', score: 4, gap: actual - avg };
    if (eff >= 0.9) return { label: '標準', cls: 'j-normal', score: 3, gap: actual - avg };
    if (eff >= 0.7) return { label: '要注意', cls: 'j-warning', score: 2, gap: actual - avg };
    return { label: '要改善', cls: 'j-poor', score: 1, gap: actual - avg };
}

function runAnalysis() {
    // 会社情報を最新化
    state.company.name = document.getElementById('companyName').value || '貴社';
    state.company.month = document.getElementById('reportMonth').value || '';
    state.company.employees = Number(document.getElementById('employees').value) || 1;
    state.company.fiscalEnd = Number(document.getElementById('fiscalEnd').value) || 3;

    if (!state.industry) {
        document.getElementById('scoreGrid').innerHTML = '<p class="text-muted">業種を選択してください（Step 3）</p>';
        document.getElementById('analysisTable').innerHTML = '';
        document.getElementById('findings').innerHTML = '';
        return;
    }

    recalcDerived();

    const ind = INDUSTRIES[state.industry];
    const curr = calcIndicators('curr');
    const prev = calcIndicators('prev');
    state.indicators = { curr, prev, ind };

    // 評価項目
    const items = [
        { key: 'grossMargin',        name: '売上総利益率',     unit: '%',   higherBetter: true,  avg: ind.grossMargin },
        { key: 'opMargin',           name: '営業利益率',       unit: '%',   higherBetter: true,  avg: ind.opMargin },
        { key: 'ordMargin',          name: '経常利益率',       unit: '%',   higherBetter: true,  avg: ind.ordMargin },
        { key: 'equityRatio',        name: '自己資本比率',     unit: '%',   higherBetter: true,  avg: ind.equityRatio },
        { key: 'currentRatio',       name: '流動比率',         unit: '%',   higherBetter: true,  avg: ind.currentRatio },
        { key: 'quickRatio',         name: '当座比率',         unit: '%',   higherBetter: true,  avg: ind.quickRatio },
        { key: 'fixedRatio',         name: '固定比率',         unit: '%',   higherBetter: false, avg: ind.fixedRatio },
        { key: 'totalAssetTurnover', name: '総資本回転率',     unit: '回',  higherBetter: true,  avg: ind.totalAssetTurnover },
        { key: 'laborShare',         name: '労働分配率',       unit: '%',   higherBetter: false, avg: ind.laborShare },
        { key: 'salesPerEmployee',   name: '一人当たり売上高', unit: '千円', higherBetter: true,  avg: ind.salesPerEmployee },
    ];

    const judgements = items.map(it => ({ ...it, val: curr[it.key], prevVal: prev[it.key], j: judgeRatio(curr[it.key], it.avg, it.higherBetter) }));

    // カテゴリ別スコア（5指標）
    const scoreMap = {
        '収益性': avgScore([judgements.find(j => j.key === 'grossMargin'), judgements.find(j => j.key === 'opMargin'), judgements.find(j => j.key === 'ordMargin')]),
        '安全性': avgScore([judgements.find(j => j.key === 'equityRatio'), judgements.find(j => j.key === 'currentRatio'), judgements.find(j => j.key === 'fixedRatio')]),
        '効率性': avgScore([judgements.find(j => j.key === 'totalAssetTurnover')]),
        '生産性': avgScore([judgements.find(j => j.key === 'laborShare'), judgements.find(j => j.key === 'salesPerEmployee')]),
        '成長性': growthScore(prev, curr),
    };
    state.scores = { categories: scoreMap, items: judgements };

    renderScores(scoreMap);
    renderAnalysisTable(judgements);
    renderRadarChart(judgements);
    renderTrendChart(prev, curr);
    renderFindings(judgements, prev, curr, ind);
}

function avgScore(arr) {
    const valid = arr.filter(Boolean).filter(j => j.j.score);
    if (!valid.length) return 0;
    return Math.round((valid.reduce((s, j) => s + j.j.score, 0) / valid.length) * 10) / 10;
}

function growthScore(prev, curr) {
    if (!prev.sales) return 0;
    const salesGrowth = (curr.sales - prev.sales) / prev.sales * 100;
    const ordGrowth = prev.ordMargin ? curr.ordMargin - prev.ordMargin : 0;
    let s = 3;
    if (salesGrowth > 10) s += 1.5;
    else if (salesGrowth > 3) s += 0.7;
    else if (salesGrowth < -5) s -= 1.5;
    else if (salesGrowth < 0) s -= 0.7;
    if (ordGrowth > 1) s += 0.5;
    else if (ordGrowth < -1) s -= 0.5;
    s = Math.max(1, Math.min(5, s));
    return Math.round(s * 10) / 10;
}

function renderScores(map) {
    const html = Object.entries(map).map(([name, score]) => {
        const cls = score >= 4.5 ? 'excellent' : score >= 3.5 ? 'good' : score >= 2.5 ? 'normal' : score >= 1.5 ? 'warning' : 'poor';
        const stars = '★'.repeat(Math.round(score)) + '☆'.repeat(5 - Math.round(score));
        return `
        <div class="score-card ${cls}">
            <div class="score-card-label">${name}</div>
            <div class="score-card-value">${score || '-'}</div>
            <div class="score-card-stars">${stars}</div>
        </div>`;
    }).join('');
    document.getElementById('scoreGrid').innerHTML = html;
}

function renderAnalysisTable(judgements) {
    const head = `<thead><tr><th>指標</th><th class="numeric">前期</th><th class="numeric">当期</th><th class="numeric">業種平均</th><th class="numeric">差</th><th>判定</th></tr></thead>`;
    const body = judgements.map(j => `
        <tr>
            <td>${j.name}</td>
            <td class="numeric">${fmtMetric(j.prevVal, j.unit)}</td>
            <td class="numeric">${fmtMetric(j.val, j.unit)}</td>
            <td class="numeric">${fmtMetric(j.avg, j.unit)}</td>
            <td class="numeric">${j.gap !== undefined ? (j.j.gap > 0 ? '+' : '') + fmtMetric(j.j.gap, j.unit) : '-'}</td>
            <td><span class="judgement ${j.j.cls}">${j.j.label}</span></td>
        </tr>`).join('');
    document.getElementById('analysisTable').innerHTML = head + '<tbody>' + body + '</tbody>';
}

function fmtMetric(v, unit) {
    if (v === undefined || v === null || isNaN(v)) return '-';
    if (unit === '千円') return Math.round(v).toLocaleString() + '千円';
    if (unit === '回') return v.toFixed(2) + '回';
    return v.toFixed(1) + unit;
}

function renderRadarChart(judgements) {
    const ctx = document.getElementById('radarChart');
    if (state.radarChart) state.radarChart.destroy();
    const labels = judgements.map(j => j.name);
    const yourData = judgements.map(j => j.j.score);
    const avgData = judgements.map(() => 3);
    state.radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels,
            datasets: [
                { label: '貴社', data: yourData, backgroundColor: 'rgba(43,93,140,0.2)', borderColor: '#2b5d8c', borderWidth: 2, pointBackgroundColor: '#2b5d8c' },
                { label: '業種平均', data: avgData, backgroundColor: 'rgba(234,88,12,0.1)', borderColor: '#ea580c', borderWidth: 2, borderDash: [5, 5], pointBackgroundColor: '#ea580c' },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } },
        },
    });
}

function renderTrendChart(prev, curr) {
    const ctx = document.getElementById('trendChart');
    if (state.trendChart) state.trendChart.destroy();
    state.trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['売上高', '売上総利益', '営業利益', '経常利益'],
            datasets: [
                { label: '前期', data: [prev.sales, state.data.prev.grossProfit, state.data.prev.operatingIncome, state.data.prev.ordinaryIncome], backgroundColor: '#94a3b8' },
                { label: '当期', data: [curr.sales, state.data.curr.grossProfit, state.data.curr.operatingIncome, state.data.curr.ordinaryIncome], backgroundColor: '#2b5d8c' },
            ],
        },
        options: { responsive: true, maintainAspectRatio: false },
    });
}

function renderFindings(judgements, prev, curr, ind) {
    const f = [];

    // 収益性
    const op = judgements.find(j => j.key === 'opMargin');
    if (op.j.score >= 4) f.push({ type: 'positive', title: '収益性が高水準',
        body: `営業利益率 ${op.val.toFixed(1)}%（業種平均${ind.opMargin}%）。コスト構造と価格設定がうまく機能しています。` });
    if (op.j.score <= 2) f.push({ type: 'negative', title: '収益性に課題',
        body: `営業利益率が ${op.val.toFixed(1)}%（業種平均${ind.opMargin}%）。粗利率の確保または販管費の見直しが必要です。` });

    // 売上推移
    if (prev.sales) {
        const growth = (curr.sales - prev.sales) / prev.sales * 100;
        if (growth >= 5) f.push({ type: 'positive', title: '売上が前期比+' + growth.toFixed(1) + '%',
            body: '前期から増収。継続的なトップライン拡大が利益にも反映しているかを確認しましょう。' });
        else if (growth <= -5) f.push({ type: 'negative', title: '売上が前期比' + growth.toFixed(1) + '%',
            body: '前期比で減収となっています。原因分析（数量/単価/客数の分解）と対策の検討が必要です。' });
    }

    // 安全性
    const eq = judgements.find(j => j.key === 'equityRatio');
    if (eq.j.score >= 4) f.push({ type: 'positive', title: '財務基盤が安定',
        body: `自己資本比率 ${eq.val.toFixed(1)}%（業種平均${ind.equityRatio}%）。健全なバランスシートを維持しています。` });
    if (eq.j.score <= 2) f.push({ type: 'negative', title: '財務基盤の強化が必要',
        body: `自己資本比率 ${eq.val.toFixed(1)}%（業種平均${ind.equityRatio}%）。利益蓄積と借入の見直しで自己資本の充実が望まれます。` });

    // 流動比率
    const cr = judgements.find(j => j.key === 'currentRatio');
    if (cr.j.score <= 2) f.push({ type: 'negative', title: '短期支払能力に注意',
        body: `流動比率 ${cr.val.toFixed(1)}%（目安150%）。資金繰り表で当面のキャッシュアウトを必ず把握してください。` });

    // 労働分配率
    const ls = judgements.find(j => j.key === 'laborShare');
    if (ls.j.score <= 2) f.push({ type: 'negative', title: '労働分配率が高い',
        body: `労働分配率 ${ls.val.toFixed(1)}%（業種平均${ind.laborShare}%）。粗利の伸長または人員効率の改善が論点となります。` });

    if (f.length === 0) f.push({ type: 'neutral', title: '全体としてバランスの取れた水準',
        body: '主要指標は業種平均近傍にあります。次の打ち手として注力領域を定めて伸ばしていきましょう。' });

    document.getElementById('findings').innerHTML = f.map(x => `
        <div class="findings-item ${x.type}">
            <div class="findings-title">${x.title}</div>
            <div>${x.body}</div>
        </div>`).join('');
}

/* ---------- 報告書生成 ---------- */
function generateReport() {
    if (!state.indicators) {
        document.getElementById('reportPreview').innerHTML = '<p class="text-muted">先に Step 4 で分析を実行してください。</p>';
        return;
    }
    const html = buildReportHTML();
    document.getElementById('reportPreview').innerHTML = html;
}

function buildReportHTML() {
    const c = state.company;
    const ind = INDUSTRIES[state.industry];
    const { curr, prev } = state.indicators;
    const dp = state.data.prev, dc = state.data.curr;
    const monthLabel = c.month ? c.month.replace('-', '年') + '月度' : '当月度';
    const today = new Date().toLocaleDateString('ja-JP');
    const comment = (document.getElementById('extraComment').value || '').trim();
    const findingsHTML = document.getElementById('findings').innerHTML;

    const plRow = (label, key) => {
        const a = dp[key] || 0, b = dc[key] || 0;
        return `<tr><td>${label}</td><td class="num">${formatNumber(a)}</td><td class="num">${formatNumber(b)}</td><td class="num">${formatNumber(b - a)}</td><td class="num">${growthBadge(a, b)}</td></tr>`;
    };
    const bsRow = (label, key) => {
        const a = dp[key] || 0, b = dc[key] || 0;
        return `<tr><td>${label}</td><td class="num">${formatNumber(a)}</td><td class="num">${formatNumber(b)}</td><td class="num">${formatNumber(b - a)}</td></tr>`;
    };
    const scoreCard = Object.entries(state.scores.categories).map(([n, s]) => `<tr><td>${n}</td><td class="num">${s} / 5.0</td><td>${'★'.repeat(Math.round(s))}${'☆'.repeat(5 - Math.round(s))}</td></tr>`).join('');

    const j = state.scores.items;
    const indRow = j.map(x => `<tr><td>${x.name}</td><td class="num">${fmtMetric(x.val, x.unit)}</td><td class="num">${fmtMetric(x.avg, x.unit)}</td><td class="num">${(x.j.gap > 0 ? '+' : '') + fmtMetric(x.j.gap, x.unit)}</td><td>${x.j.label}</td></tr>`).join('');

    return `
<div class="report-doc">
    <h1>月次経営報告書</h1>
    <p class="report-subtitle">${escapeHtml(monthLabel)} ／ ${escapeHtml(c.name || '貴社')} 様</p>

    <h2>1. 基本情報</h2>
    <table class="meta-table">
        <tr><td>会社名</td><td>${escapeHtml(c.name || '-')}</td></tr>
        <tr><td>業種</td><td>${ind.icon} ${ind.name}</td></tr>
        <tr><td>従業員数</td><td>${c.employees || '-'} 人</td></tr>
        <tr><td>決算月</td><td>${c.fiscalEnd}月</td></tr>
        <tr><td>報告対象</td><td>${escapeHtml(monthLabel)}</td></tr>
        <tr><td>作成日</td><td>${today}</td></tr>
    </table>

    <h2>2. 総合評価サマリー</h2>
    <table>
        <thead><tr><th>評価軸</th><th>スコア</th><th>レベル</th></tr></thead>
        ${scoreCard}
    </table>

    <h2>3. 損益計算書サマリー（千円）</h2>
    <table>
        <thead><tr><th>項目</th><th>前期</th><th>当期</th><th>差額</th><th>前期比</th></tr></thead>
        ${plRow('売上高', 'sales')}
        ${plRow('売上原価', 'cogs')}
        ${plRow('売上総利益', 'grossProfit')}
        ${plRow('販管費', 'sga')}
        ${plRow('営業利益', 'operatingIncome')}
        ${plRow('経常利益', 'ordinaryIncome')}
        ${plRow('当期純利益', 'netIncome')}
    </table>

    <h2>4. 貸借対照表サマリー（千円）</h2>
    <table>
        <thead><tr><th>項目</th><th>前期</th><th>当期</th><th>増減</th></tr></thead>
        ${bsRow('流動資産', 'currentAssets')}
        ${bsRow('固定資産', 'fixedAssets')}
        ${bsRow('総資産', 'totalAssets')}
        ${bsRow('流動負債', 'currentLiabilities')}
        ${bsRow('固定負債', 'fixedLiabilities')}
        ${bsRow('純資産', 'equity')}
    </table>

    <h2>5. 業種平均との比較</h2>
    <table>
        <thead><tr><th>指標</th><th>貴社</th><th>業種平均</th><th>差</th><th>判定</th></tr></thead>
        ${indRow}
    </table>
    <p style="font-size:0.78rem;color:#6b7280;margin-top:6px;">※ 業種平均は中小企業実態調査ベースの代表値を参照しています。</p>

    <h2>6. 所見と注力ポイント</h2>
    <div class="summary-box">${findingsHTML}</div>

    ${comment ? `<h2>7. 申し送り事項</h2><div class="comment-box">${escapeHtml(comment).replace(/\n/g, '<br>')}</div>` : ''}

    <p style="text-align:right;font-size:0.78rem;color:#9ca3af;margin-top:24px;">本資料はクライアントとの月次面談用に作成しています。</p>
</div>`;
}

function growthBadge(prev, curr) {
    if (!prev) return '-';
    const r = (curr - prev) / Math.abs(prev) * 100;
    if (Math.abs(r) < 0.5) return `<span class="badge b-flat">${r.toFixed(1)}%</span>`;
    if (r > 0) return `<span class="badge b-up">+${r.toFixed(1)}%</span>`;
    return `<span class="badge b-down">${r.toFixed(1)}%</span>`;
}

function printReport() {
    if (!state.indicators) { alert('先に Step 4 で分析を実行してください。'); return; }
    window.print();
}

function downloadReportHTML() {
    if (!state.indicators) { alert('先に Step 4 で分析を実行してください。'); return; }
    const c = state.company;
    const monthLabel = c.month ? c.month.replace('-', '年') + '月度' : '当月度';
    const css = fetchInlineCSS();
    const body = buildReportHTML();
    const full = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>月次報告書 ${escapeHtml(monthLabel)} ${escapeHtml(c.name)}</title>
<style>${css}</style></head><body><div style="max-width:880px;margin:30px auto;padding:40px;background:white;">${body}</div></body></html>`;
    const fname = `月次報告書_${(c.name || '会社名').replace(/[\\/:*?"<>|]/g, '')}_${(c.month || '').replace(/-/g, '')}.html`;
    downloadFile(fname, full, 'text/html');
}

function fetchInlineCSS() {
    return `
    body { font-family: 'Hiragino Kaku Gothic ProN','Yu Gothic','Meiryo',sans-serif; color: #1f2937; line-height: 1.6; background: #f8fafc; }
    h1 { font-size: 1.7rem; text-align: center; color: #1f4768; border-bottom: 3px double #2b5d8c; padding-bottom: 12px; margin-bottom: 4px; }
    .report-subtitle { text-align: center; color: #4b5563; margin-bottom: 24px; }
    h2 { font-size: 1.1rem; color: #1f4768; border-left: 5px solid #2b5d8c; padding-left: 10px; margin: 24px 0 12px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 0.9rem; }
    th { background: #e8f0f8; padding: 8px 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 700; }
    td { padding: 7px 10px; border: 1px solid #cbd5e1; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .meta-table td:first-child { background: #f8fafc; font-weight: 600; width: 30%; }
    .comment-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px; margin: 12px 0; }
    .summary-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px 18px; }
    .badge { display: inline-block; padding: 1px 9px; border-radius: 10px; font-size: 0.76rem; font-weight: 700; margin-left: 6px; }
    .b-up { background: #dcfce7; color: #16a34a; }
    .b-down { background: #fee2e2; color: #dc2626; }
    .b-flat { background: #f1f5f9; color: #4b5563; }
    .findings-item { padding: 12px 14px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid; background: #fafafa; }
    .findings-item.positive { border-color: #16a34a; background: #dcfce7; }
    .findings-item.negative { border-color: #dc2626; background: #fee2e2; }
    .findings-item.neutral { border-color: #2563eb; background: #dbeafe; }
    .findings-title { font-weight: 700; margin-bottom: 4px; }
    `;
}

function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type: type + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- トークスクリプト生成 ---------- */
function generateTalkScript() {
    if (!state.indicators) {
        document.getElementById('talkPreview').textContent = '先に Step 4 で分析を実行してください。';
        return;
    }
    const length = document.querySelector('input[name="scriptLength"]:checked')?.value || 'standard';
    const script = buildTalkScript(length);
    document.getElementById('talkPreview').textContent = script;
}

function buildTalkScript(length) {
    const c = state.company;
    const ind = INDUSTRIES[state.industry];
    const { curr, prev } = state.indicators;
    const dp = state.data.prev, dc = state.data.curr;
    const monthLabel = c.month ? c.month.replace('-', '年') + '月度' : '当月度';

    const salesGrowth = prev.sales ? (curr.sales - prev.sales) / prev.sales * 100 : 0;
    const ordGrowth = prev.ordMargin ? curr.ordMargin - prev.ordMargin : 0;
    const scoreCat = state.scores.categories;
    const items = state.scores.items;
    const top = [...items].sort((a, b) => b.j.score - a.j.score)[0];
    const bottom = [...items].sort((a, b) => a.j.score - b.j.score)[0];

    const detail = length === 'long';
    const short = length === 'short';

    const lines = [];
    lines.push(`【月次面談トークスクリプト】`);
    lines.push(`クライアント: ${c.name || '貴社'} 様`);
    lines.push(`対象月: ${monthLabel}　業種: ${ind.name}　従業員数: ${c.employees}名`);
    lines.push(`想定所要時間: ${length === 'short' ? '約10分' : length === 'long' ? '約40分' : '約20分'}`);
    lines.push(`────────────────────────────────────`);
    lines.push('');

    // 1. オープニング
    lines.push(`■ 1. オープニング（${short ? '1分' : '2分'}）`);
    lines.push(`「${c.name || '社長'}、本日もお時間をいただきありがとうございます。`);
    lines.push(`本日は ${monthLabel} の決算数値が確定しましたので、ポイントを5つに絞ってご報告いたします。`);
    lines.push(`最後に来月以降の打ち手についてご相談させていただければと思います。」`);
    lines.push('');

    // 2. 業績サマリー
    lines.push(`■ 2. 業績サマリー（${short ? '2分' : '4分'}）`);
    lines.push(`「まず、当月の主要数値をご説明します。`);
    lines.push(` ・売上高 ${formatNumber(curr.sales)}千円（前期比 ${signed(salesGrowth)}%）`);
    lines.push(` ・営業利益 ${formatNumber(dc.operatingIncome)}千円（営業利益率 ${curr.opMargin.toFixed(1)}%）`);
    lines.push(` ・経常利益 ${formatNumber(dc.ordinaryIncome)}千円（経常利益率 ${curr.ordMargin.toFixed(1)}%）`);
    if (salesGrowth >= 3)
        lines.push(`売上は前期から ${signed(salesGrowth)}% と堅調に推移しております。`);
    else if (salesGrowth <= -3)
        lines.push(`売上は前期比で ${signed(salesGrowth)}% と減収となっておりますので、原因をこの後ご一緒に整理させていただければと思います。`);
    else
        lines.push(`売上は前期と概ね同水準で推移しております。`);
    lines.push('」');
    lines.push('');

    // 3. 業種比較
    lines.push(`■ 3. 業種平均との比較（${short ? '2分' : '5分'}）`);
    lines.push(`「次に、${ind.name}の業種平均との比較をご覧ください。`);
    lines.push(` 5つの評価軸でスコアリングしています：`);
    Object.entries(scoreCat).forEach(([k, v]) => {
        lines.push(`   ・${k}: ${v} / 5.0 （${stars(v)}）`);
    });
    lines.push('');
    if (top) lines.push(` 特に評価できるのは「${top.name}」で、${fmtMetric(top.val, top.unit)}（業種平均${fmtMetric(top.avg, top.unit)}）と${top.j.label}水準です。`);
    if (bottom && bottom.j.score < 3) lines.push(` 一方、改善余地があるのは「${bottom.name}」で、${fmtMetric(bottom.val, bottom.unit)}（業種平均${fmtMetric(bottom.avg, bottom.unit)}）と${bottom.j.label}な状態です。」`);
    else lines.push('」');
    lines.push('');

    if (detail || !short) {
        // 4. 収益性
        lines.push(`■ 4. 収益性の深掘り（${detail ? '6分' : '3分'}）`);
        const gm = items.find(i => i.key === 'grossMargin');
        const om = items.find(i => i.key === 'opMargin');
        lines.push(`「収益性についてですが、`);
        lines.push(` 売上総利益率は ${gm.val.toFixed(1)}%（業種平均${gm.avg}%）`);
        lines.push(` 営業利益率は ${om.val.toFixed(1)}%（業種平均${om.avg}%）です。`);
        if (gm.j.score < 3) lines.push(` 粗利率が業種平均を下回っているため、価格設定の見直し、または原価構造の改善を検討する余地があります。`);
        else if (gm.j.score >= 4) lines.push(` 粗利率が業種平均を上回っており、付加価値の高い商売ができている状態です。`);
        if (gm.j.score >= 3 && om.j.score < 3) lines.push(` 粗利は確保できている一方で営業利益率が伸び悩んでいるのは、販管費の割合が大きいことが要因と考えられます。`);
        lines.push(`次の月次までに、もし可能でしたら主力商品の限界利益分析にも踏み込めればと思います。」`);
        lines.push('');

        // 5. 安全性
        lines.push(`■ 5. 安全性の確認（${detail ? '5分' : '2分'}）`);
        const eq = items.find(i => i.key === 'equityRatio');
        const cr = items.find(i => i.key === 'currentRatio');
        lines.push(`「財務の安全性ですが、`);
        lines.push(` 自己資本比率 ${eq.val.toFixed(1)}%（業種平均${eq.avg}%）`);
        lines.push(` 流動比率 ${cr.val.toFixed(1)}%（${cr.j.label}水準）`);
        if (cr.j.score <= 2) lines.push(` 流動比率が業種平均を下回っているため、念のため資金繰り表で90日先までのキャッシュアウトを確認させていただきます。`);
        if (eq.j.score >= 4) lines.push(` 自己資本比率は十分な水準で、外部環境のショックに対する耐性は確保できております。`);
        if (eq.j.score <= 2) lines.push(` 自己資本比率が業種平均を下回っているため、当面は利益蓄積を優先し、不要不急の借入は控える方針が望ましいと考えます。`);
        lines.push(`」`);
        lines.push('');
    }

    if (detail) {
        // 6. 効率性・生産性
        lines.push(`■ 6. 効率性と生産性（5分）`);
        const tat = items.find(i => i.key === 'totalAssetTurnover');
        const ls = items.find(i => i.key === 'laborShare');
        const spe = items.find(i => i.key === 'salesPerEmployee');
        lines.push(`「資産の使い方と人の働き方の効率を見ていきます。`);
        lines.push(` 総資本回転率 ${tat.val.toFixed(2)}回（業種平均${tat.avg}回）`);
        lines.push(` 労働分配率 ${ls.val.toFixed(1)}%（業種平均${ls.avg}%）`);
        lines.push(` 一人当たり売上高 ${formatNumber(spe.val)}千円（業種平均${formatNumber(spe.avg)}千円）`);
        if (ls.j.score <= 2) lines.push(` 労働分配率が業種平均を上回っているため、人件費の水準そのものではなく粗利を増やす方向での改善が必要と考えます。`);
        if (spe.j.score >= 4) lines.push(` 一人当たり売上が業種平均より高く、生産性の高い体制ができています。`);
        lines.push(`」`);
        lines.push('');
    }

    // 7. アクションプラン
    lines.push(`■ ${detail ? '7' : (short ? '4' : '6')}. 来月に向けた打ち手（${short ? '2分' : '4分'}）`);
    lines.push(`「今月の数字を踏まえると、来月以降は次の3点に注力することをご提案します：`);
    const actions = buildActionItems(items, scoreCat, salesGrowth);
    actions.forEach((a, i) => lines.push(`  ${i + 1}. ${a}`));
    lines.push(`「いずれも来月の月次面談で進捗を一緒に確認させてください。」`);
    lines.push('');

    // 8. クロージング
    lines.push(`■ ${detail ? '8' : (short ? '5' : '7')}. クロージング（1分）`);
    lines.push(`「以上が ${monthLabel} のご報告となります。`);
    lines.push(`本日の中でご不明点や、もう少し深掘りしたい論点はございますでしょうか？`);
    lines.push(`お気づきの点があれば、その場で対応いたしますし、宿題として持ち帰って次回までにご回答することも可能です。`);
    lines.push(`本日もありがとうございました。」`);
    lines.push('');

    lines.push(`────────────────────────────────────`);
    lines.push(`【想定Q&A】`);
    const qas = buildQA(items, scoreCat);
    qas.forEach(q => {
        lines.push(`Q: ${q.q}`);
        lines.push(`A: ${q.a}`);
        lines.push('');
    });

    lines.push(`────────────────────────────────────`);
    lines.push(`【トークの注意点】`);
    lines.push(`・専門用語（自己資本比率・労働分配率等）は必ず一度噛み砕いて説明する`);
    lines.push(`・悪い数字は先に課題提起→改善策の順で。社長を責めるトーンにしない`);
    lines.push(`・良い数字は具体的な金額やパーセントで称賛し、横展開可能性も提示する`);
    lines.push(`・「業種平均」は参考値であり経営判断の絶対基準ではないことを必要に応じて補足する`);
    lines.push(`・最後は必ず社長に発言を促し、対話で終える`);

    return lines.join('\n');
}

function stars(v) {
    const r = Math.round(v);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
}

function signed(n) {
    return (n >= 0 ? '+' : '') + n.toFixed(1);
}

function buildActionItems(items, scoreCat, salesGrowth) {
    const acts = [];
    const op = items.find(i => i.key === 'opMargin');
    const eq = items.find(i => i.key === 'equityRatio');
    const ls = items.find(i => i.key === 'laborShare');
    const cr = items.find(i => i.key === 'currentRatio');
    const gm = items.find(i => i.key === 'grossMargin');

    if (gm.j.score <= 2) acts.push('粗利率改善：商品/サービス別の粗利率を一覧化し、低粗利品の値上げ余地と高粗利品の販促強化を検討する');
    if (op.j.score <= 2) acts.push('販管費削減：定期支払いを含む販管費を勘定科目別に総点検し、3か月以内に5%圧縮を目指す');
    if (cr.j.score <= 2) acts.push('資金繰り強化：13週キャッシュフロー予測を週次で更新し、与信枠の事前確保を行う');
    if (eq.j.score <= 2) acts.push('自己資本充実：当期純利益の社内留保比率を高め、借入返済計画を再策定する');
    if (ls.j.score <= 2) acts.push('生産性向上：人件費の絶対額ではなく粗利の絶対額を増やす施策（高付加価値案件への注力等）を進める');
    if (salesGrowth <= -3) acts.push('売上回復：減収要因を「数量×単価」「既存×新規」で分解し、最優先1施策を特定する');
    if (salesGrowth >= 5) acts.push('成長持続：好調要因の再現性を分析し、リソース配分を増やす');

    while (acts.length < 3) {
        const defaults = [
            '月次の数値モニタリング体制を継続し、変化点に早期対応する',
            '主要KPI（売上・粗利率・営業利益率）の社内ダッシュボード化を進める',
            '次月までに主力商品/サービスの限界利益分析を実施する',
        ];
        const next = defaults[acts.length];
        if (next && !acts.includes(next)) acts.push(next);
        else break;
    }
    return acts.slice(0, 3);
}

function buildQA(items, scoreCat) {
    const qas = [
        { q: 'なぜ業種平均と比較するのですか？',
          a: '同業他社と並べることで、自社の強み/弱みが客観的に見えるためです。ただし業種平均は中央値や代表値であり、立地・規模・ビジネスモデルによって最適値は変動しますので、参考値として位置付けてご活用ください。' },
        { q: 'スコアが3点台でも改善は必要ですか？',
          a: '3点は業種平均ど真ん中の水準です。守りの面では問題ありませんが、競合より一歩抜け出すためには「収益性」または「生産性」のどちらかを4以上に押し上げる打ち手が有効です。' },
    ];
    const ls = items.find(i => i.key === 'laborShare');
    if (ls && ls.j.score <= 2) qas.push({
        q: '労働分配率が高いということは、人件費を下げるべきですか？',
        a: '必ずしも人件費の絶対額を減らすという話ではありません。分母である粗利を伸ばすことで分配率を下げる方が、社員のモチベーションを維持しながら経営指標を改善できます。' });
    const eq = items.find(i => i.key === 'equityRatio');
    if (eq && eq.j.score <= 2) qas.push({
        q: '自己資本比率が低いことのリスクは？',
        a: '景気後退・売上急減・取引先倒産といった外部ショックに対する耐性が落ちます。一般に中小企業では30%以上を目安に、徐々に積み増していくことが推奨されます。' });
    return qas;
}

function downloadTalkScriptMD() {
    if (!state.indicators) { alert('先に分析を実行してください。'); return; }
    const length = document.querySelector('input[name="scriptLength"]:checked')?.value || 'standard';
    const raw = buildTalkScript(length);
    // 簡易 Markdown 化
    const md = raw
        .replace(/^【(.+)】$/gm, '# $1')
        .replace(/^■ (.+)$/gm, '## $1')
        .replace(/^────+$/gm, '---');
    const fname = `トークスクリプト_${(state.company.name || '会社名').replace(/[\\/:*?"<>|]/g, '')}_${(state.company.month || '').replace(/-/g, '')}.md`;
    downloadFile(fname, md, 'text/markdown');
}

function downloadTalkScriptTXT() {
    if (!state.indicators) { alert('先に分析を実行してください。'); return; }
    const length = document.querySelector('input[name="scriptLength"]:checked')?.value || 'standard';
    const txt = buildTalkScript(length);
    const fname = `トークスクリプト_${(state.company.name || '会社名').replace(/[\\/:*?"<>|]/g, '')}_${(state.company.month || '').replace(/-/g, '')}.txt`;
    downloadFile(fname, txt, 'text/plain');
}

/* ---------- サンプルデータ ---------- */
function loadSampleData() {
    document.getElementById('companyName').value = '株式会社サンプル製作所';
    const dt = new Date();
    document.getElementById('reportMonth').value = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('employees').value = '24';
    document.getElementById('fiscalEnd').value = '3';

    const sample = {
        prev: { sales: 480000, cogs: 380000, sga: 85000, nonOpIncome: 800, nonOpExpense: 2500, netIncome: 9500, personnel: 110000, depreciation: 7500,
                currentAssets: 165000, cash: 60000, receivables: 75000, inventory: 22000, fixedAssets: 95000, currentLiabilities: 105000, payables: 55000, fixedLiabilities: 55000, longDebt: 45000 },
        curr: { sales: 512000, cogs: 398000, sga: 90000, nonOpIncome: 950, nonOpExpense: 2300, netIncome: 14800, personnel: 118000, depreciation: 8200,
                currentAssets: 178000, cash: 72000, receivables: 78000, inventory: 23000, fixedAssets: 92000, currentLiabilities: 99000, payables: 53000, fixedLiabilities: 48000, longDebt: 40000 },
    };
    document.querySelectorAll('input[data-key]').forEach(i => {
        const v = sample[i.dataset.period]?.[i.dataset.key];
        if (v !== undefined) i.value = v;
    });
    recalcDerived();
    selectIndustry('manufacturing');
    setStatus('サンプルデータを読み込みました（製造業／従業員24名）。', 'success');
}

/* ---------- Utility ---------- */
function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- 初期化 ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initDropZone();
    document.querySelectorAll('input[data-key]').forEach(i => i.addEventListener('input', recalcDerived));
    document.getElementById('companyName').addEventListener('input', e => state.company.name = e.target.value);
    document.getElementById('reportMonth').addEventListener('input', e => state.company.month = e.target.value);
    document.getElementById('employees').addEventListener('input', e => state.company.employees = Number(e.target.value));
    document.getElementById('fiscalEnd').addEventListener('input', e => state.company.fiscalEnd = Number(e.target.value));

    // 今月をデフォルト
    const dt = new Date();
    document.getElementById('reportMonth').value = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
});
