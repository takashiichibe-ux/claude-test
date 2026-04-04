/**
 * 社労士請求書 月次自動化 - Google Apps Script
 *
 * 【セットアップ手順】
 * 1. Google Apps Script (https://script.google.com) で新規プロジェクト作成
 * 2. このファイルの内容を貼り付け
 * 3. SETTINGS の値を自分の情報に書き換え
 * 4. 「デプロイ」→「ウェブアプリ」として公開
 * 5. 月初トリガーを設定（下記 setupTrigger() を1回実行）
 *
 * 【使い方】
 * - 月初に自動実行: setupTrigger() でトリガー設定
 * - 手動実行: runMonthlyInvoice() を実行
 * - Webアプリ経由: invoice.html から POST で連携
 * - iPhone Shortcuts 経由: ショートカットからURL叩くだけ
 */

// ========================================
// 設定（★ここを書き換えてください）
// ========================================
const SETTINGS = {
  // 事務所情報
  officeName: '○○社会保険労務士事務所',
  officeRepresentative: '○○ ○○',
  officeZip: '100-0001',
  officeAddress: '東京都千代田区○○1-2-3',
  officeTel: '03-1234-5678',
  officeEmail: 'info@example-sr.com',
  officeInvoiceNo: 'T1234567890123', // インボイス登録番号

  // 振込先
  bankName: '○○銀行',
  bankBranch: '○○支店',
  bankType: '普通',
  bankAccount: '1234567',
  bankHolder: 'シャロウシジムショ',

  // 請求設定
  taxRate: 0.10,
  dueDateType: 'nextMonthEnd', // 'thisMonthEnd', 'nextMonthEnd', 'twoMonthsEnd'
  invoicePrefix: 'INV-',

  // Google Drive
  invoiceFolderId: '★Google DriveのフォルダIDを入れてください★',

  // スプレッドシート（顧問先マスタ）
  clientSheetId: '★スプレッドシートIDを入れてください★',
  clientSheetName: '顧問先マスタ',

  // メールテンプレート
  emailSubject: '【請求書】{month}月分顧問料のご請求（{officeName}）',
  emailBody: `{clientName} 御中

いつもお世話になっております。
{officeName}の{representative}です。

{month}月分の顧問料につきまして、請求書をPDFにて送付いたします。
ご査収のほどよろしくお願いいたします。

■ ご請求額: ¥{total}（税込）
■ お支払期限: {dueDate}
■ お振込先: {bankName} {bankBranch} {bankType} {bankAccount}
  口座名義: {bankHolder}

ご不明な点がございましたら、お気軽にお問い合わせください。

{officeName}
{representative}
TEL: {tel}
Email: {email}
`
};

// ========================================
// メイン処理: 月次請求書一括処理
// ========================================
function runMonthlyInvoice() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  Logger.log(`=== ${year}年${month}月分 請求書一括処理開始 ===`);

  // 顧問先一覧を取得
  const clients = getClients();
  if (clients.length === 0) {
    Logger.log('有効な顧問先がありません');
    return;
  }

  const results = [];

  for (const client of clients) {
    try {
      Logger.log(`処理中: ${client.name}`);

      // 1. 請求書データ生成
      const invoiceData = buildInvoiceData(client, year, month);

      // 2. PDF生成
      const pdfBlob = generateInvoicePdf(invoiceData);

      // 3. Google Driveに保存
      const fileUrl = saveToDrive(pdfBlob, invoiceData, year, month);

      // 4. メール送信
      sendInvoiceEmail(client, invoiceData, pdfBlob);

      results.push({
        client: client.name,
        status: 'success',
        invoiceNo: invoiceData.invoiceNo,
        total: invoiceData.total,
        fileUrl
      });

      Logger.log(`完了: ${client.name} - ${invoiceData.invoiceNo}`);

    } catch (err) {
      Logger.log(`エラー: ${client.name} - ${err.message}`);
      results.push({
        client: client.name,
        status: 'error',
        error: err.message
      });
    }
  }

  // 処理結果を自分にメール通知
  sendSummaryEmail(results, year, month);

  Logger.log(`=== 処理完了: ${results.length}件 ===`);
  return results;
}

// ========================================
// 顧問先マスタ取得（スプレッドシートから）
// ========================================
function getClients() {
  const ss = SpreadsheetApp.openById(SETTINGS.clientSheetId);
  const sheet = ss.getSheetByName(SETTINGS.clientSheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const clients = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const client = {};
    headers.forEach((h, idx) => {
      client[h] = row[idx];
    });

    // 「有効」列がTRUEまたは空でないもののみ
    if (client['有効'] === true || client['有効'] === 'TRUE' || client['有効'] === '○') {
      clients.push({
        name: client['会社名'] || client['氏名'] || '',
        email: client['メール'] || client['email'] || '',
        zip: client['郵便番号'] || '',
        address: client['住所'] || '',
        contact: client['担当者'] || '',
        fee: parseInt(client['顧問料']) || 0,
        itemName: client['請求項目'] || '顧問料',
        additionalItems: parseAdditionalItems(client['追加項目'])
      });
    }
  }

  return clients.filter(c => c.name && c.email && c.fee > 0);
}

function parseAdditionalItems(str) {
  if (!str) return [];
  // 形式: "項目名:金額,項目名:金額"
  return String(str).split(',').map(item => {
    const [name, amount] = item.split(':');
    return { name: (name || '').trim(), amount: parseInt(amount) || 0 };
  }).filter(i => i.name && i.amount > 0);
}

// ========================================
// 請求書データ構築
// ========================================
function buildInvoiceData(client, year, month) {
  const items = [{
    name: `${client.itemName}（${month}月分）`,
    quantity: 1,
    unitPrice: client.fee,
    amount: client.fee
  }];

  if (client.additionalItems) {
    client.additionalItems.forEach(ai => {
      items.push({
        name: `${ai.name}（${month}月分）`,
        quantity: 1,
        unitPrice: ai.amount,
        amount: ai.amount
      });
    });
  }

  const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
  const tax = Math.floor(subtotal * SETTINGS.taxRate);
  const total = subtotal + tax;

  return {
    invoiceNo: generateInvoiceNo(year, month),
    date: `${year}年${month}月1日`,
    year,
    month,
    client,
    items,
    subtotal,
    tax,
    total,
    dueDate: getDueDate(year, month)
  };
}

function generateInvoiceNo(year, month) {
  const ym = `${year}${String(month).padStart(2, '0')}`;
  const timestamp = new Date().getTime().toString(36).slice(-4).toUpperCase();
  return `${SETTINGS.invoicePrefix}${ym}-${timestamp}`;
}

function getDueDate(year, month) {
  let target;
  switch (SETTINGS.dueDateType) {
    case 'thisMonthEnd':
      target = new Date(year, month, 0);
      break;
    case 'twoMonthsEnd':
      target = new Date(year, month + 1, 0);
      break;
    case 'nextMonthEnd':
    default:
      target = new Date(year, month, 0);
      // month+1の末日 = month+2の0日目
      target = new Date(year, month + 1, 0);
      break;
  }
  return `${target.getFullYear()}年${target.getMonth() + 1}月${target.getDate()}日`;
}

// ========================================
// PDF生成（HTML → PDF変換）
// ========================================
function generateInvoicePdf(data) {
  const html = buildInvoiceHtml(data);
  const blob = HtmlService.createHtmlOutput(html)
    .getBlob()
    .setName(`請求書_${data.client.name}_${data.year}年${data.month}月.pdf`);
  return blob;
}

function buildInvoiceHtml(data) {
  const itemRows = data.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td class="r">1</td>
      <td class="r">¥${number(item.unitPrice)}</td>
      <td class="r">¥${number(item.amount)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body { font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif; padding: 40px; color: #1f2937; line-height: 1.7; font-size: 14px; }
  h2 { text-align: center; letter-spacing: 0.5em; font-size: 20px; margin-bottom: 24px; }
  .meta { text-align: right; font-size: 12px; color: #4b5563; margin-bottom: 8px; }
  .to { font-size: 16px; font-weight: 700; border-bottom: 2px solid #1f2937; padding-bottom: 4px; margin-bottom: 16px; }
  .from { text-align: right; font-size: 12px; color: #4b5563; margin-bottom: 24px; }
  .from .name { font-weight: 700; font-size: 14px; color: #1f2937; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th, td { padding: 8px 10px; border: 1px solid #d1d5db; font-size: 13px; }
  th { background: #f3f4f6; font-weight: 600; }
  .r { text-align: right; }
  tfoot td { font-weight: 600; }
  .total { background: #dbeafe; font-size: 16px; font-weight: 700; }
  .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #4b5563; }
</style></head><body>
  <h2>請 求 書</h2>
  <div class="meta">
    <p>請求書番号: ${data.invoiceNo}</p>
    <p>請求日: ${data.date}</p>
    ${SETTINGS.officeInvoiceNo ? `<p>登録番号: ${SETTINGS.officeInvoiceNo}</p>` : ''}
  </div>
  <div class="to">${data.client.name} 御中</div>
  <div class="from">
    <p class="name">${SETTINGS.officeName}</p>
    <p>〒${SETTINGS.officeZip} ${SETTINGS.officeAddress}</p>
    <p>TEL: ${SETTINGS.officeTel}</p>
    <p>${SETTINGS.officeEmail}</p>
  </div>
  <p>下記の通りご請求申し上げます。</p>
  <table>
    <thead><tr><th>項目</th><th class="r">数量</th><th class="r">単価</th><th class="r">金額</th></tr></thead>
    <tbody>${itemRows}</tbody>
    <tfoot>
      <tr><td colspan="3" class="r">小計</td><td class="r">¥${number(data.subtotal)}</td></tr>
      <tr><td colspan="3" class="r">消費税（${SETTINGS.taxRate * 100}%）</td><td class="r">¥${number(data.tax)}</td></tr>
      <tr class="total"><td colspan="3" class="r">合計</td><td class="r">¥${number(data.total)}</td></tr>
    </tfoot>
  </table>
  <div class="footer">
    <p>お振込先: ${SETTINGS.bankName} ${SETTINGS.bankBranch} ${SETTINGS.bankType} ${SETTINGS.bankAccount}</p>
    <p>口座名義: ${SETTINGS.bankHolder}</p>
    <p>お支払期限: ${data.dueDate}</p>
  </div>
</body></html>`;
}

function number(n) {
  return n.toLocaleString('ja-JP');
}

// ========================================
// Google Drive保存
// ========================================
function saveToDrive(pdfBlob, data, year, month) {
  const folder = DriveApp.getFolderById(SETTINGS.invoiceFolderId);

  // 年月サブフォルダ作成
  const subFolderName = `${year}年${String(month).padStart(2, '0')}月`;
  let subFolder;
  const existing = folder.getFoldersByName(subFolderName);
  if (existing.hasNext()) {
    subFolder = existing.next();
  } else {
    subFolder = folder.createFolder(subFolderName);
  }

  const file = subFolder.createFile(pdfBlob);
  return file.getUrl();
}

// ========================================
// メール送信
// ========================================
function sendInvoiceEmail(client, data, pdfBlob) {
  const month = data.month;
  const subject = SETTINGS.emailSubject
    .replace(/{month}/g, month)
    .replace(/{officeName}/g, SETTINGS.officeName);

  const body = SETTINGS.emailBody
    .replace(/{clientName}/g, client.name)
    .replace(/{month}/g, month)
    .replace(/{total}/g, number(data.total))
    .replace(/{dueDate}/g, data.dueDate)
    .replace(/{officeName}/g, SETTINGS.officeName)
    .replace(/{representative}/g, SETTINGS.officeRepresentative)
    .replace(/{bankName}/g, SETTINGS.bankName)
    .replace(/{bankBranch}/g, SETTINGS.bankBranch)
    .replace(/{bankType}/g, SETTINGS.bankType)
    .replace(/{bankAccount}/g, SETTINGS.bankAccount)
    .replace(/{bankHolder}/g, SETTINGS.bankHolder)
    .replace(/{tel}/g, SETTINGS.officeTel)
    .replace(/{email}/g, SETTINGS.officeEmail);

  GmailApp.sendEmail(client.email, subject, body, {
    attachments: [pdfBlob],
    name: SETTINGS.officeName
  });
}

// ========================================
// 処理結果通知メール
// ========================================
function sendSummaryEmail(results, year, month) {
  const success = results.filter(r => r.status === 'success');
  const errors = results.filter(r => r.status === 'error');

  let body = `${year}年${month}月分 請求書処理結果\n\n`;
  body += `処理件数: ${results.length}件\n`;
  body += `成功: ${success.length}件\n`;
  body += `エラー: ${errors.length}件\n\n`;

  body += '--- 詳細 ---\n\n';

  success.forEach(r => {
    body += `✓ ${r.client}: ${r.invoiceNo} ¥${number(r.total)}\n`;
  });

  errors.forEach(r => {
    body += `✗ ${r.client}: ${r.error}\n`;
  });

  GmailApp.sendEmail(
    SETTINGS.officeEmail,
    `【請求書処理完了】${year}年${month}月分 - ${success.length}/${results.length}件成功`,
    body,
    { name: '請求書自動化システム' }
  );
}

// ========================================
// Webアプリ（POST受信）
// ========================================
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    switch (payload.action) {
      case 'runAll':
        const results = runMonthlyInvoice();
        return ContentService.createTextOutput(JSON.stringify({ success: true, results }))
          .setMimeType(ContentService.MimeType.JSON);

      case 'sendEmail':
        sendInvoiceEmailDirect(payload);
        return ContentService.createTextOutput(JSON.stringify({ success: true }))
          .setMimeType(ContentService.MimeType.JSON);

      case 'saveToDrive':
        // invoiceDataからPDF生成してDrive保存
        const pdfBlob = generateInvoicePdf(payload.invoiceData);
        saveToDrive(pdfBlob, payload.invoiceData, payload.invoiceData.year, payload.invoiceData.month);
        return ContentService.createTextOutput(JSON.stringify({ success: true }))
          .setMimeType(ContentService.MimeType.JSON);

      default:
        return ContentService.createTextOutput(JSON.stringify({ error: 'Unknown action' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // ヘルスチェック & ステータス用
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    service: '社労士請求書自動化',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function sendInvoiceEmailDirect(payload) {
  GmailApp.sendEmail(payload.to, payload.subject, payload.body, {
    name: SETTINGS.officeName
  });
}

// ========================================
// トリガー設定（月初自動実行）
// ========================================
function setupTrigger() {
  // 既存トリガー削除
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'runMonthlyInvoice') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // 毎月1日 9:00に実行
  ScriptApp.newTrigger('runMonthlyInvoice')
    .timeBased()
    .onMonthDay(1)
    .atHour(9)
    .create();

  Logger.log('月初トリガーを設定しました（毎月1日 9:00）');
}

// ========================================
// iPhone ショートカット用エンドポイント
// ========================================
// iPhoneの「ショートカット」アプリから以下のURLにPOSTするだけ:
// URL: [デプロイしたWebアプリURL]
// Body: {"action": "runAll"}
//
// ショートカット設定例:
// 1. 新規ショートカット作成
// 2. 「URLの内容を取得」アクションを追加
// 3. URL: デプロイしたGAS URL
// 4. メソッド: POST
// 5. 本文: JSON → {"action": "runAll"}
// 6. ショートカット名: 「請求書作って」
//
// これでSiriに「請求書作って」と言うだけで実行されます！

// ========================================
// スプレッドシートのテンプレート作成
// ========================================
function createClientSheet() {
  const ss = SpreadsheetApp.openById(SETTINGS.clientSheetId);
  let sheet = ss.getSheetByName(SETTINGS.clientSheetName);

  if (!sheet) {
    sheet = ss.insertSheet(SETTINGS.clientSheetName);
  }

  // ヘッダー設定
  const headers = ['会社名', 'メール', '郵便番号', '住所', '担当者', '顧問料', '請求項目', '追加項目', '有効'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#f3f4f6');

  // サンプルデータ
  sheet.getRange(2, 1, 1, headers.length).setValues([[
    'サンプル株式会社',
    'sample@example.com',
    '100-0001',
    '東京都千代田区○○1-2-3',
    '総務 田中',
    50000,
    '顧問料',
    '給与計算:10000,手続き代行:5000',
    '○'
  ]]);

  sheet.autoResizeColumns(1, headers.length);
  Logger.log('顧問先マスタシートを作成しました');
}
