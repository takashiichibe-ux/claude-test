// 顧客マスタ・必要資料リスト・提出状況の共通データ
// localStorage をストレージとして使い、初回のみ初期データを投入する

const REQUIRED_DOC_TEMPLATE = (targetMonth) => ([
  {
    id: 'bank_csv',
    label: '預金のCSV',
    description: `${targetMonth}月分の預金取引明細CSV。各銀行口座のオンラインバンキングからダウンロードしてください。`,
    accept: '.csv',
    multiple: true,
    rules: {
      minFiles: 1,
      extensions: ['csv'],
      // ファイル名にyyyymm or yyyy-mm が含まれていることを期待
      filenameMustIncludeMonth: true,
    },
  },
  {
    id: 'gmo_aozora_card',
    label: 'GMOあおぞらカード明細',
    description: `${targetMonth}月使用分のGMOあおぞらカードの利用明細PDFまたはCSV。`,
    accept: '.pdf,.csv',
    multiple: false,
    rules: {
      minFiles: 1,
      extensions: ['pdf', 'csv'],
      filenameMustIncludeMonth: true,
    },
  },
  {
    id: 'expense_receipts',
    label: '経費精算（領収書）',
    description: `${targetMonth}月使用分の経費精算用領収書（PDF/JPG/PNG）。複数枚アップロード可。`,
    accept: '.pdf,.jpg,.jpeg,.png',
    multiple: true,
    rules: {
      minFiles: 1,
      extensions: ['pdf', 'jpg', 'jpeg', 'png'],
      filenameMustIncludeMonth: false,
    },
  },
]);

const INITIAL_CLIENTS = [
  {
    id: 'hrt-consulting',
    name: 'HRTコンサルティング株式会社',
    contactPerson: '山田 太郎',
    email: 'yamada@hrt-consulting.example.co.jp',
    targetMonth: 6,
    fiscalYear: 2026,
    deadlineDay: 15, // 翌月15日締切
  },
];

const STORAGE_KEYS = {
  CLIENTS: 'cdc_clients_v1',
  SUBMISSIONS: 'cdc_submissions_v1',
};

function loadClients() {
  const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    return INITIAL_CLIENTS;
  }
  return JSON.parse(raw);
}

function saveClients(clients) {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

function loadSubmissions() {
  const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
  return raw ? JSON.parse(raw) : {};
}

function saveSubmissions(submissions) {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
}

// クライアント×対象月のキーを生成
function submissionKey(clientId, fiscalYear, targetMonth) {
  return `${clientId}__${fiscalYear}-${String(targetMonth).padStart(2, '0')}`;
}

// 指定クライアント・対象月の必要資料リストを取得
function getRequiredDocs(client) {
  return REQUIRED_DOC_TEMPLATE(client.targetMonth);
}

// 提出状況を取得（存在しなければ空オブジェクトを返す）
function getSubmissionState(clientId, fiscalYear, targetMonth) {
  const all = loadSubmissions();
  const key = submissionKey(clientId, fiscalYear, targetMonth);
  return all[key] || { docs: {}, updatedAt: null };
}

function setSubmissionState(clientId, fiscalYear, targetMonth, state) {
  const all = loadSubmissions();
  const key = submissionKey(clientId, fiscalYear, targetMonth);
  state.updatedAt = new Date().toISOString();
  all[key] = state;
  saveSubmissions(all);
}

// 不足判定: 必要資料リストと提出状況を突き合わせ、未提出/不足のリストを返す
function detectMissing(client) {
  const required = getRequiredDocs(client);
  const state = getSubmissionState(client.id, client.fiscalYear, client.targetMonth);
  const missing = [];

  for (const doc of required) {
    const submitted = state.docs[doc.id];
    if (!submitted || !submitted.files || submitted.files.length === 0) {
      missing.push({ doc, reason: '未提出' });
      continue;
    }

    const files = submitted.files;

    if (files.length < doc.rules.minFiles) {
      missing.push({ doc, reason: `ファイル数不足（${files.length}/${doc.rules.minFiles}）` });
      continue;
    }

    const badExt = files.find((f) => {
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      return !doc.rules.extensions.includes(ext);
    });
    if (badExt) {
      missing.push({ doc, reason: `拡張子不正: ${badExt.name}` });
      continue;
    }

    if (doc.rules.filenameMustIncludeMonth) {
      const mm = String(client.targetMonth).padStart(2, '0');
      const yyyy = String(client.fiscalYear);
      const hit = files.some((f) => {
        const n = f.name;
        return n.includes(`${yyyy}${mm}`)
            || n.includes(`${yyyy}-${mm}`)
            || n.includes(`${yyyy}_${mm}`)
            || n.includes(`${mm}月`);
      });
      if (!hit) {
        missing.push({ doc, reason: `対象月（${client.targetMonth}月）がファイル名に見当たりません` });
        continue;
      }
    }
  }

  return missing;
}

// 進捗率（0-100）
function calcProgress(client) {
  const required = getRequiredDocs(client);
  const missing = detectMissing(client);
  const done = required.length - missing.length;
  return Math.round((done / required.length) * 100);
}
