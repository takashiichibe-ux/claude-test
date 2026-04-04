/**
 * 社労士請求書 月次自動化ツール
 * 「請求書作って」ワンタップで月次請求を一括処理
 */

(function () {
    'use strict';

    // ========================================
    // データ管理
    // ========================================
    const STORAGE_KEYS = {
        clients: 'invoice_clients',
        settings: 'invoice_settings',
        history: 'invoice_history',
        counter: 'invoice_counter'
    };

    function loadData(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || null;
        } catch {
            return null;
        }
    }

    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function getClients() {
        return loadData(STORAGE_KEYS.clients) || [];
    }

    function saveClients(clients) {
        saveData(STORAGE_KEYS.clients, clients);
    }

    function getSettings() {
        return loadData(STORAGE_KEYS.settings) || getDefaultSettings();
    }

    function saveSettings(settings) {
        saveData(STORAGE_KEYS.settings, settings);
    }

    function getHistory() {
        return loadData(STORAGE_KEYS.history) || [];
    }

    function addHistory(entry) {
        const hist = getHistory();
        hist.unshift(entry);
        if (hist.length > 100) hist.length = 100;
        saveData(STORAGE_KEYS.history, hist);
    }

    function getNextInvoiceNo() {
        const settings = getSettings();
        let counter = loadData(STORAGE_KEYS.counter) || 0;
        counter++;
        saveData(STORAGE_KEYS.counter, counter);
        const prefix = settings.invoicePrefix || 'INV-';
        const now = new Date();
        const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
        return `${prefix}${ym}-${String(counter).padStart(3, '0')}`;
    }

    function getDefaultSettings() {
        return {
            officeName: '',
            officeRepresentative: '',
            officeZip: '',
            officeAddress: '',
            officeTel: '',
            officeEmail: '',
            officeInvoiceNo: '',
            bankName: '',
            bankBranch: '',
            bankType: '普通',
            bankAccount: '',
            bankHolder: '',
            dueDateOffset: '30',
            invoicePrefix: 'INV-',
            taxRate: 10,
            emailSubject: '【請求書】{month}月分顧問料のご請求',
            emailBody: 'いつもお世話になっております。\n{month}月分の顧問料につきまして、請求書を送付いたします。\nご確認のほどよろしくお願いいたします。',
            gasUrl: '',
            driveFolderId: ''
        };
    }

    // ========================================
    // ユーティリティ
    // ========================================
    function formatCurrency(amount) {
        return amount.toLocaleString('ja-JP');
    }

    function getCurrentMonth() {
        return new Date().getMonth() + 1;
    }

    function getCurrentYear() {
        return new Date().getFullYear();
    }

    function getTargetMonth() {
        return getCurrentMonth();
    }

    function getDueDate(offsetDays) {
        const now = new Date();
        const offset = parseInt(offsetDays) || 30;
        // 当月末を基準にoffset日後の月末
        let target;
        if (offset === 0) {
            target = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else if (offset === 30) {
            target = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        } else {
            target = new Date(now.getFullYear(), now.getMonth() + 3, 0);
        }
        return `${target.getFullYear()}年${target.getMonth() + 1}月${target.getDate()}日`;
    }

    function formatDate(date) {
        const d = new Date(date);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    // ========================================
    // タブ切り替え
    // ========================================
    function initTabs() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
            });
        });
    }

    // ========================================
    // 顧問先管理
    // ========================================
    function renderClients() {
        const list = document.getElementById('clientList');
        const clients = getClients();

        if (clients.length === 0) {
            list.innerHTML = '<p class="empty-state">顧問先が登録されていません。<br>「+ 顧問先追加」から追加してください。</p>';
            return;
        }

        list.innerHTML = clients.map(c => `
            <div class="client-card ${c.active ? '' : 'inactive'}" data-id="${c.id}">
                <div class="client-info">
                    <div class="client-name">${escapeHtml(c.name)}</div>
                    <div class="client-detail">${escapeHtml(c.email)}${c.active ? '' : ' (停止中)'}</div>
                </div>
                <div class="client-fee">&yen;${formatCurrency(c.fee)}</div>
                <div class="client-actions">
                    <button class="btn-icon-small btn-edit" data-id="${c.id}" title="編集">&#9998;</button>
                    <button class="btn-icon-small btn-delete" data-id="${c.id}" title="削除">&#128465;</button>
                </div>
            </div>
        `).join('');

        list.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openClientModal(btn.dataset.id);
            });
        });

        list.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('この顧問先を削除しますか？')) {
                    deleteClient(btn.dataset.id);
                }
            });
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function openClientModal(editId) {
        const modal = document.getElementById('clientModal');
        const form = document.getElementById('clientForm');
        const title = document.getElementById('modalTitle');

        form.reset();
        document.getElementById('additionalItems').innerHTML = '';
        document.getElementById('clientId').value = '';

        if (editId) {
            title.textContent = '顧問先編集';
            const client = getClients().find(c => c.id === editId);
            if (!client) return;

            document.getElementById('clientId').value = client.id;
            document.getElementById('clientName').value = client.name;
            document.getElementById('clientEmail').value = client.email;
            document.getElementById('clientZip').value = client.zip || '';
            document.getElementById('clientAddress').value = client.address || '';
            document.getElementById('clientContact').value = client.contact || '';
            document.getElementById('clientFee').value = client.fee;
            document.getElementById('clientItemName').value = client.itemName || '顧問料';
            document.getElementById('clientActive').checked = client.active;
            document.getElementById('clientNote').value = client.note || '';

            if (client.additionalItems) {
                client.additionalItems.forEach(item => addAdditionalItemRow(item.name, item.amount));
            }
        } else {
            title.textContent = '顧問先追加';
        }

        modal.classList.remove('hidden');
    }

    function closeModal(modal) {
        modal.classList.add('hidden');
    }

    function deleteClient(id) {
        const clients = getClients().filter(c => c.id !== id);
        saveClients(clients);
        renderClients();
    }

    function addAdditionalItemRow(name, amount) {
        const container = document.getElementById('additionalItems');
        const row = document.createElement('div');
        row.className = 'additional-item-row';
        row.innerHTML = `
            <input type="text" placeholder="項目名" value="${escapeHtml(name || '')}">
            <input type="number" placeholder="金額" value="${amount || ''}">
            <button type="button" class="btn-remove-item">&times;</button>
        `;
        row.querySelector('.btn-remove-item').addEventListener('click', () => row.remove());
        container.appendChild(row);
    }

    function initClientForm() {
        document.getElementById('btnAddClient').addEventListener('click', () => openClientModal(null));
        document.getElementById('btnAddItem').addEventListener('click', () => addAdditionalItemRow('', ''));

        document.getElementById('clientForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('clientId').value || generateId();
            const additionalItems = [];
            document.querySelectorAll('#additionalItems .additional-item-row').forEach(row => {
                const inputs = row.querySelectorAll('input');
                if (inputs[0].value && inputs[1].value) {
                    additionalItems.push({
                        name: inputs[0].value,
                        amount: parseInt(inputs[1].value) || 0
                    });
                }
            });

            const client = {
                id,
                name: document.getElementById('clientName').value,
                email: document.getElementById('clientEmail').value,
                zip: document.getElementById('clientZip').value,
                address: document.getElementById('clientAddress').value,
                contact: document.getElementById('clientContact').value,
                fee: parseInt(document.getElementById('clientFee').value) || 0,
                itemName: document.getElementById('clientItemName').value || '顧問料',
                additionalItems,
                active: document.getElementById('clientActive').checked,
                note: document.getElementById('clientNote').value
            };

            const clients = getClients();
            const idx = clients.findIndex(c => c.id === id);
            if (idx >= 0) {
                clients[idx] = client;
            } else {
                clients.push(client);
            }
            saveClients(clients);
            closeModal(document.getElementById('clientModal'));
            renderClients();
        });

        // モーダル閉じる
        document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
            el.addEventListener('click', () => {
                closeModal(el.closest('.modal'));
            });
        });
    }

    // ========================================
    // 設定管理
    // ========================================
    function loadSettingsToForm() {
        const s = getSettings();
        Object.keys(s).forEach(key => {
            const el = document.getElementById(key);
            if (el) {
                el.value = s[key];
            }
        });
    }

    function initSettingsForm() {
        loadSettingsToForm();

        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const s = {};
            const fields = [
                'officeName', 'officeRepresentative', 'officeZip', 'officeAddress',
                'officeTel', 'officeEmail', 'officeInvoiceNo',
                'bankName', 'bankBranch', 'bankType', 'bankAccount', 'bankHolder',
                'dueDateOffset', 'invoicePrefix', 'taxRate',
                'emailSubject', 'emailBody', 'gasUrl', 'driveFolderId'
            ];
            fields.forEach(f => {
                const el = document.getElementById(f);
                s[f] = el ? el.value : '';
            });
            s.taxRate = parseInt(s.taxRate) || 10;
            saveSettings(s);
            alert('設定を保存しました');
        });
    }

    // ========================================
    // 請求書生成
    // ========================================
    function generateInvoiceData(client) {
        const settings = getSettings();
        const month = getTargetMonth();
        const year = getCurrentYear();
        const taxRate = settings.taxRate / 100;

        const items = [{
            name: `${client.itemName || '顧問料'}（${month}月分）`,
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

        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const tax = Math.floor(subtotal * taxRate);
        const total = subtotal + tax;

        return {
            invoiceNo: getNextInvoiceNo(),
            date: `${year}年${month}月1日`,
            year,
            month,
            client: {
                name: client.name,
                email: client.email,
                zip: client.zip,
                address: client.address,
                contact: client.contact
            },
            office: {
                name: settings.officeName,
                representative: settings.officeRepresentative,
                zip: settings.officeZip,
                address: settings.officeAddress,
                tel: settings.officeTel,
                email: settings.officeEmail,
                invoiceNo: settings.officeInvoiceNo
            },
            bank: {
                name: settings.bankName,
                branch: settings.bankBranch,
                type: settings.bankType,
                account: settings.bankAccount,
                holder: settings.bankHolder
            },
            items,
            subtotal,
            tax,
            total,
            taxRate: settings.taxRate,
            dueDate: getDueDate(settings.dueDateOffset)
        };
    }

    function renderInvoiceHtml(data) {
        const itemRows = data.items.map(item => `
            <tr>
                <td>${escapeHtml(item.name)}</td>
                <td style="text-align:right">1</td>
                <td style="text-align:right">&yen;${formatCurrency(item.unitPrice)}</td>
                <td style="text-align:right">&yen;${formatCurrency(item.amount)}</td>
            </tr>
        `).join('');

        return `
        <div class="invoice-doc">
            <div class="invoice-header-doc">
                <h3>請 求 書</h3>
                <div class="invoice-meta">
                    <p>請求書番号: ${escapeHtml(data.invoiceNo)}</p>
                    <p>請求日: ${escapeHtml(data.date)}</p>
                    ${data.office.invoiceNo ? `<p>登録番号: ${escapeHtml(data.office.invoiceNo)}</p>` : ''}
                </div>
            </div>
            <div class="invoice-to">
                <p>${escapeHtml(data.client.name)} 御中</p>
            </div>
            <div class="invoice-from">
                <p style="font-weight:700">${escapeHtml(data.office.name)}</p>
                ${data.office.zip ? `<p>〒${escapeHtml(data.office.zip)}</p>` : ''}
                <p>${escapeHtml(data.office.address)}</p>
                <p>TEL: ${escapeHtml(data.office.tel)}</p>
            </div>
            <div class="invoice-body">
                <p>下記の通りご請求申し上げます。</p>
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>項目</th>
                            <th style="text-align:right">数量</th>
                            <th style="text-align:right">単価</th>
                            <th style="text-align:right">金額</th>
                        </tr>
                    </thead>
                    <tbody>${itemRows}</tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="text-align:right">小計</td>
                            <td style="text-align:right">&yen;${formatCurrency(data.subtotal)}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="text-align:right">消費税（${data.taxRate}%）</td>
                            <td style="text-align:right">&yen;${formatCurrency(data.tax)}</td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="3" style="text-align:right">合計</td>
                            <td style="text-align:right">&yen;${formatCurrency(data.total)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="invoice-footer-doc">
                <p>お振込先: ${escapeHtml(data.bank.name)} ${escapeHtml(data.bank.branch)} ${escapeHtml(data.bank.type)} ${escapeHtml(data.bank.account)}</p>
                <p>口座名義: ${escapeHtml(data.bank.holder)}</p>
                <p>お支払期限: ${escapeHtml(data.dueDate)}</p>
            </div>
        </div>`;
    }

    // ========================================
    // PDF生成（ブラウザ内）
    // ========================================
    function generatePdf(invoiceData) {
        return new Promise((resolve) => {
            const html = renderInvoiceHtml(invoiceData);

            // 印刷用ウィンドウで PDF 保存を促す
            const printWindow = window.open('', '_blank', 'width=800,height=1100');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="ja">
                <head>
                    <meta charset="UTF-8">
                    <title>請求書 - ${invoiceData.client.name}</title>
                    <style>
                        body {
                            font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif;
                            padding: 40px;
                            color: #1f2937;
                            line-height: 1.6;
                        }
                        .invoice-doc { max-width: 600px; margin: 0 auto; }
                        .invoice-header-doc { text-align: center; margin-bottom: 24px; }
                        .invoice-header-doc h3 { font-size: 1.5rem; letter-spacing: 0.5em; }
                        .invoice-meta { text-align: right; font-size: 0.85rem; color: #4b5563; }
                        .invoice-to { margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #1f2937; font-size: 1.1rem; font-weight: 600; }
                        .invoice-from { text-align: right; font-size: 0.85rem; color: #4b5563; margin-bottom: 24px; }
                        .invoice-body > p { margin-bottom: 12px; }
                        .invoice-table { width: 100%; border-collapse: collapse; }
                        .invoice-table th, .invoice-table td { padding: 8px 10px; border: 1px solid #d1d5db; font-size: 0.85rem; }
                        .invoice-table th { background: #f3f4f6; font-weight: 600; }
                        .invoice-table tfoot td { font-weight: 600; }
                        .total-row td { background: #dbeafe; font-size: 1rem; font-weight: 700; }
                        .invoice-footer-doc { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 0.85rem; color: #4b5563; }
                        .invoice-footer-doc p { margin-bottom: 4px; }
                        @media print { body { padding: 20px; } }
                    </style>
                </head>
                <body>${html}
                    <script>
                        window.onload = function() {
                            window.print();
                        };
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
            resolve(true);
        });
    }

    // ========================================
    // メール送信（mailto / GAS連携）
    // ========================================
    function sendEmail(invoiceData) {
        const settings = getSettings();
        const month = invoiceData.month;
        const subject = (settings.emailSubject || '【請求書】{month}月分顧問料のご請求')
            .replace(/{month}/g, month);
        const body = (settings.emailBody || '')
            .replace(/{month}/g, month)
            .replace(/{clientName}/g, invoiceData.client.name)
            .replace(/{total}/g, formatCurrency(invoiceData.total))
            .replace(/{dueDate}/g, invoiceData.dueDate);

        // GAS URLがあればAPI経由で送信
        if (settings.gasUrl) {
            return sendViaGas(settings.gasUrl, {
                action: 'sendEmail',
                to: invoiceData.client.email,
                subject,
                body,
                invoiceData
            });
        }

        // GAS未設定ならmailtoで開く
        const mailto = `mailto:${invoiceData.client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailto);
        return Promise.resolve(true);
    }

    // ========================================
    // GAS API連携
    // ========================================
    function sendViaGas(gasUrl, payload) {
        return fetch(gasUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(() => true).catch(err => {
            console.error('GAS連携エラー:', err);
            return false;
        });
    }

    function saveToGasDrive(gasUrl, invoiceData) {
        return sendViaGas(gasUrl, {
            action: 'saveToDrive',
            invoiceData
        });
    }

    // ========================================
    // 一括処理（「請求書作って」ボタン）
    // ========================================
    async function runAllWorkflow() {
        const clients = getClients().filter(c => c.active);
        const settings = getSettings();

        if (clients.length === 0) {
            alert('有効な顧問先が登録されていません。\n「顧問先一覧」タブから追加してください。');
            return;
        }

        if (!settings.officeName) {
            alert('事務所情報が未設定です。\n「設定」タブから入力してください。');
            return;
        }

        const progressArea = document.getElementById('progressArea');
        const progressFill = document.getElementById('progressFill');
        const progressStatus = document.getElementById('progressStatus');
        const progressLog = document.getElementById('progressLog');

        progressArea.classList.remove('hidden');
        progressLog.innerHTML = '';
        progressFill.style.width = '0%';

        const totalSteps = clients.length * 3; // PDF生成 + メール + 保存
        let currentStep = 0;
        const month = getTargetMonth();

        function updateProgress(message, status) {
            currentStep++;
            const pct = Math.round((currentStep / totalSteps) * 100);
            progressFill.style.width = pct + '%';
            progressStatus.textContent = `${pct}% - ${message}`;
            const li = document.createElement('li');
            li.className = status;
            li.innerHTML = `${status === 'step-done' ? '&#10003;' : status === 'step-error' ? '&#10007;' : '&#9679;'} ${message}`;
            progressLog.appendChild(li);
            progressLog.scrollTop = progressLog.scrollHeight;
        }

        progressStatus.textContent = `${month}月分の請求書を作成中...`;

        const results = [];

        for (const client of clients) {
            const invoiceData = generateInvoiceData(client);
            let pdfOk = false;
            let emailOk = false;
            let saveOk = false;

            // Step 1: PDF生成
            try {
                await generatePdf(invoiceData);
                pdfOk = true;
                updateProgress(`${client.name}: PDF生成完了`, 'step-done');
            } catch {
                updateProgress(`${client.name}: PDF生成失敗`, 'step-error');
            }

            // Step 2: メール送信
            try {
                await sendEmail(invoiceData);
                emailOk = true;
                updateProgress(`${client.name}: メール送信完了`, 'step-done');
            } catch {
                updateProgress(`${client.name}: メール送信失敗`, 'step-error');
            }

            // Step 3: ドライブ保存
            if (settings.gasUrl && settings.driveFolderId) {
                try {
                    await saveToGasDrive(settings.gasUrl, invoiceData);
                    saveOk = true;
                    updateProgress(`${client.name}: Drive保存完了`, 'step-done');
                } catch {
                    updateProgress(`${client.name}: Drive保存失敗`, 'step-error');
                }
            } else {
                saveOk = true;
                updateProgress(`${client.name}: ローカル保存（GAS未設定）`, 'step-done');
            }

            results.push({
                clientName: client.name,
                invoiceNo: invoiceData.invoiceNo,
                total: invoiceData.total,
                pdf: pdfOk,
                email: emailOk,
                save: saveOk
            });
        }

        // 完了
        const allOk = results.every(r => r.pdf && r.email && r.save);
        progressFill.style.width = '100%';
        progressStatus.textContent = allOk
            ? `全${clients.length}件の請求書処理が完了しました`
            : `処理完了（一部エラーあり）`;

        // 履歴に追加
        addHistory({
            date: new Date().toISOString(),
            month,
            year: getCurrentYear(),
            count: clients.length,
            results,
            status: allOk ? 'success' : 'partial'
        });

        renderHistory();
    }

    // ========================================
    // テンプレートプレビュー
    // ========================================
    function updateTemplatePreview() {
        const settings = getSettings();
        const month = getTargetMonth();

        document.getElementById('previewOfficeName').textContent = settings.officeName || '（事務所名）';
        document.getElementById('previewOfficeAddress').textContent =
            (settings.officeZip ? '〒' + settings.officeZip + ' ' : '') + (settings.officeAddress || '（住所）');
        document.getElementById('previewOfficeTel').textContent = settings.officeTel ? 'TEL: ' + settings.officeTel : '（電話番号）';
        document.getElementById('previewBank').textContent =
            settings.bankName ? `${settings.bankName} ${settings.bankBranch} ${settings.bankType} ${settings.bankAccount}` : '（振込先）';
        document.getElementById('previewDueDate').textContent = getDueDate(settings.dueDateOffset);

        document.querySelectorAll('.preview-month').forEach(el => {
            el.textContent = month;
        });
    }

    // ========================================
    // 履歴表示
    // ========================================
    function renderHistory() {
        const list = document.getElementById('historyList');
        const history = getHistory();

        if (history.length === 0) {
            list.innerHTML = '<p class="empty-state">まだ履歴がありません</p>';
            return;
        }

        list.innerHTML = history.map(h => {
            const badge = h.status === 'success'
                ? '<span class="history-badge badge-success">成功</span>'
                : '<span class="history-badge badge-partial">一部エラー</span>';

            const details = h.results
                ? h.results.map(r => `${r.clientName}: ¥${formatCurrency(r.total)}`).join('、')
                : '';

            return `
                <div class="history-item">
                    <div class="history-header">
                        <span class="history-date">${h.year}年${h.month}月分（${formatDate(h.date)}処理）</span>
                        ${badge}
                    </div>
                    <div class="history-detail">${h.count}件処理 - ${details}</div>
                </div>
            `;
        }).join('');
    }

    // ========================================
    // 初期化
    // ========================================
    function init() {
        initTabs();
        initClientForm();
        initSettingsForm();
        renderClients();
        renderHistory();
        updateTemplatePreview();

        document.getElementById('btnRunAll').addEventListener('click', runAllWorkflow);

        // PDF保存ボタン
        document.getElementById('btnDownloadPdf').addEventListener('click', () => {
            // プレビューモーダルから
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
