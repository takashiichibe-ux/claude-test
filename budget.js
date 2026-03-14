// ============================================================
// 予算管理システム v1.0
// ============================================================

// --- State ---
let state = {
    fiscalYear: 2025,
    fiscalStartMonth: 4, // 期首月
    elapsedMonths: 0,     // 経過月数（実績確定月数）
    rates: {
        health: 5.00,
        pension: 9.15,
        employment: 0.60,
        accident: 0.30,
        care: 0.91,
        child: 0.36
    },
    employees: [],
    accounts: [],
    actuals: {},       // { "勘定科目名": [月1, 月2, ..., 月12] }
    salesBudget: [],   // [月1予算, 月2予算, ..., 月12予算]
    salesActual: [],   // [月1実績, 月2実績, ..., 月12実績]
    pcaParsed: null
};

// Default accounts
const DEFAULT_ACCOUNTS = [
    { category: 'revenue', name: '売上高', method: 'manual', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'cogs', name: '売上原価', method: 'prevYear', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '役員報酬', method: 'fixed', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '給与手当', method: 'auto', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '法定福利費', method: 'auto', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '福利厚生費', method: 'prevYear', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '旅費交通費', method: 'prevYear', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '通信費', method: 'prevYear', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '消耗品費', method: 'prevYear', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '水道光熱費', method: 'prevYear', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '地代家賃', method: 'fixed', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '保険料', method: 'fixed', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '租税公課', method: 'prevYear', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '減価償却費', method: 'fixed', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '支払手数料', method: 'prevYear', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'expense', name: '雑費', method: 'prevYear', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'non_op_income', name: '営業外収益', method: 'prevYear', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
    { category: 'non_op_expense', name: '営業外費用', method: 'prevYear', prevYear: 0, budget: 0, monthly: new Array(12).fill(0) },
];

// --- Utility ---
function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' toast-' + type : '');
    setTimeout(() => t.className = 'toast', 3000);
}

function fmt(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Math.round(num).toLocaleString('ja-JP');
}

function parseNum(str) {
    if (!str) return 0;
    return parseInt(String(str).replace(/[,，\s]/g, ''), 10) || 0;
}

function getMonthLabels() {
    const labels = [];
    for (let i = 0; i < 12; i++) {
        const m = ((state.fiscalStartMonth - 1 + i) % 12) + 1;
        labels.push(m + '月');
    }
    return labels;
}

function getMonthIndices() {
    const indices = [];
    for (let i = 0; i < 12; i++) {
        indices.push(((state.fiscalStartMonth - 1 + i) % 12));
    }
    return indices;
}

// --- Navigation ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${pageId}"]`).classList.add('active');

    if (pageId === 'pl') renderPL();
    if (pageId === 'employees') renderMonthlyPersonnel();
    if (pageId === 'accounts') renderMonthlyAccounts();
    if (pageId === 'sales') renderSalesTable();
    if (pageId === 'dashboard') updateDashboard();
}

// --- Fiscal Year ---
function applyFiscalYear() {
    state.fiscalYear = parseInt(document.getElementById('fiscalYear').value);
    state.fiscalStartMonth = parseInt(document.getElementById('fiscalStartMonth').value);
    updateElapsedMonthOptions();
    recalcAll();
    showToast('年度設定を適用しました', 'success');
}

function updateElapsedMonthOptions() {
    const sel = document.getElementById('elapsedMonth');
    const labels = getMonthLabels();
    sel.innerHTML = '<option value="0">なし</option>';
    for (let i = 1; i <= 12; i++) {
        sel.innerHTML += `<option value="${i}">${labels[i-1]}まで（${i}ヶ月）</option>`;
    }
    sel.value = state.elapsedMonths;
}

function updateElapsedMonth() {
    state.elapsedMonths = parseInt(document.getElementById('elapsedMonth').value);
    recalcAll();
}

// --- Employee Management ---
function addEmployee() {
    state.employees.push({
        id: Date.now(),
        name: '',
        hireDate: '',
        monthlySalary: 0,
        bonusMonths: 2,        // 賞与何ヶ月分
        bonusPayMonths: '6,12', // 賞与支給月
        isOver40: false
    });
    renderEmployeeTable();
}

function removeEmployee(idx) {
    state.employees.splice(idx, 1);
    renderEmployeeTable();
    recalcAll();
}

function calcTenure(hireDate) {
    if (!hireDate) return '-';
    const hire = new Date(hireDate);
    const now = new Date();
    const years = now.getFullYear() - hire.getFullYear();
    const months = now.getMonth() - hire.getMonth();
    const totalMonths = years * 12 + months;
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    return y + '年' + m + 'ヶ月';
}

function isOver40(hireDate) {
    // Simple approximation: assume employee age based on hire date
    // In reality, you'd want a birthdate field
    // For now, we'll add a checkbox
    return false;
}

function calcEmployeeCosts(emp) {
    const monthly = emp.monthlySalary || 0;
    const annualSalary = monthly * 12;
    const bonusMonths = emp.bonusMonths || 0;
    const annualBonus = monthly * bonusMonths;
    const annualPay = annualSalary + annualBonus;

    const rates = state.rates;
    let siRate = (rates.health + rates.pension + rates.employment + rates.accident + rates.child) / 100;
    if (emp.isOver40) {
        siRate += rates.care / 100;
    }

    const annualSI = Math.round(annualPay * siRate);

    return {
        annualSalary,
        annualBonus,
        annualPay,
        annualSI,
        annualTotal: annualPay + annualSI,
        monthlyBase: monthly,
        monthlySI: Math.round(monthly * siRate),
        bonusSI: Math.round(annualBonus * siRate)
    };
}

function getEmployeeMonthlyBreakdown(emp) {
    const costs = calcEmployeeCosts(emp);
    const rates = state.rates;
    let siRate = (rates.health + rates.pension + rates.employment + rates.accident + rates.child) / 100;
    if (emp.isOver40) siRate += rates.care / 100;

    const monthly = emp.monthlySalary || 0;
    const bonusPayMonths = (emp.bonusPayMonths || '').split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const bonusPerPayment = bonusPayMonths.length > 0 ? (monthly * (emp.bonusMonths || 0)) / bonusPayMonths.length : 0;

    const breakdown = { salary: new Array(12).fill(0), si: new Array(12).fill(0) };

    for (let i = 0; i < 12; i++) {
        const calendarMonth = ((state.fiscalStartMonth - 1 + i) % 12) + 1;
        let monthPay = monthly;
        if (bonusPayMonths.includes(calendarMonth)) {
            monthPay += bonusPerPayment;
        }
        breakdown.salary[i] = monthPay;
        breakdown.si[i] = Math.round(monthPay * siRate);
    }

    return breakdown;
}

function renderEmployeeTable() {
    const tbody = document.getElementById('employeeTableBody');
    if (state.employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:#999;padding:20px">社員が登録されていません。「＋ 社員追加」ボタンで追加してください。</td></tr>';
        return;
    }

    tbody.innerHTML = state.employees.map((emp, i) => {
        const costs = calcEmployeeCosts(emp);
        const tenure = calcTenure(emp.hireDate);
        return `<tr>
            <td><input type="text" value="${emp.name}" style="width:100px" onchange="updateEmp(${i},'name',this.value)"></td>
            <td><input type="date" value="${emp.hireDate}" onchange="updateEmp(${i},'hireDate',this.value)"></td>
            <td>${tenure}</td>
            <td><input type="number" value="${emp.monthlySalary}" style="width:100px" onchange="updateEmp(${i},'monthlySalary',parseInt(this.value)||0)"></td>
            <td><input type="number" value="${emp.bonusMonths}" style="width:60px" step="0.5" onchange="updateEmp(${i},'bonusMonths',parseFloat(this.value)||0)"></td>
            <td><input type="text" value="${emp.bonusPayMonths}" style="width:80px" placeholder="6,12" onchange="updateEmp(${i},'bonusPayMonths',this.value)"></td>
            <td>${fmt(costs.annualPay)}</td>
            <td>${fmt(costs.annualSI)}</td>
            <td style="font-weight:600">${fmt(costs.annualTotal)}</td>
            <td>
                <label style="font-size:0.75rem;display:flex;align-items:center;gap:2px">
                    <input type="checkbox" ${emp.isOver40 ? 'checked' : ''} onchange="updateEmp(${i},'isOver40',this.checked)"> 40歳↑
                </label>
                <button class="row-delete-btn" onclick="removeEmployee(${i})">✕</button>
            </td>
        </tr>`;
    }).join('');
}

function updateEmp(idx, field, value) {
    state.employees[idx][field] = value;
    renderEmployeeTable();
    recalcAll();
}

function renderMonthlyPersonnel() {
    const labels = getMonthLabels();
    const thead = document.getElementById('monthlyPersonnelHead');
    thead.innerHTML = `<tr><th>社員名</th><th>項目</th>${labels.map(l => `<th>${l}</th>`).join('')}<th>年合計</th></tr>`;

    const tbody = document.getElementById('monthlyPersonnelBody');
    if (state.employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="15" style="text-align:center;color:#999;padding:16px">社員データがありません</td></tr>';
        return;
    }

    let totalSalary = new Array(12).fill(0);
    let totalSI = new Array(12).fill(0);
    let rows = '';

    state.employees.forEach(emp => {
        const bd = getEmployeeMonthlyBreakdown(emp);
        const salarySum = bd.salary.reduce((a, b) => a + b, 0);
        const siSum = bd.si.reduce((a, b) => a + b, 0);

        rows += `<tr>
            <td rowspan="2" style="vertical-align:middle;font-weight:600">${emp.name || '(未入力)'}</td>
            <td>給与・賞与</td>
            ${bd.salary.map(v => `<td>${fmt(v)}</td>`).join('')}
            <td style="font-weight:600">${fmt(salarySum)}</td>
        </tr><tr>
            <td>法定福利費</td>
            ${bd.si.map(v => `<td>${fmt(v)}</td>`).join('')}
            <td style="font-weight:600">${fmt(siSum)}</td>
        </tr>`;

        for (let i = 0; i < 12; i++) {
            totalSalary[i] += bd.salary[i];
            totalSI[i] += bd.si[i];
        }
    });

    const grandSalary = totalSalary.reduce((a, b) => a + b, 0);
    const grandSI = totalSI.reduce((a, b) => a + b, 0);

    rows += `<tr style="background:#e8edf5;font-weight:700">
        <td>合計</td><td>給与手当</td>
        ${totalSalary.map(v => `<td>${fmt(v)}</td>`).join('')}
        <td>${fmt(grandSalary)}</td>
    </tr><tr style="background:#e8edf5;font-weight:700">
        <td></td><td>法定福利費</td>
        ${totalSI.map(v => `<td>${fmt(v)}</td>`).join('')}
        <td>${fmt(grandSI)}</td>
    </tr>`;

    tbody.innerHTML = rows;
}

// --- Account Management ---
function addAccount() {
    state.accounts.push({
        category: 'expense',
        name: '',
        method: 'prevYear',
        prevYear: 0,
        budget: 0,
        monthly: new Array(12).fill(0)
    });
    renderAccountTable();
}

function removeAccount(idx) {
    const acct = state.accounts[idx];
    if (acct.name === '給与手当' || acct.name === '法定福利費' || acct.name === '売上高') {
        showToast('この科目は削除できません', 'error');
        return;
    }
    state.accounts.splice(idx, 1);
    renderAccountTable();
    recalcAll();
}

function renderAccountTable() {
    const tbody = document.getElementById('accountTableBody');
    if (state.accounts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999;padding:16px">科目がありません</td></tr>';
        return;
    }

    const categoryLabels = {
        revenue: '売上',
        cogs: '原価',
        expense: '販管費',
        non_op_income: '営業外収益',
        non_op_expense: '営業外費用'
    };

    tbody.innerHTML = state.accounts.map((acct, i) => {
        const isAuto = acct.method === 'auto';
        const monthlyBudget = getAccountMonthlyBudget(acct);
        const annualBudget = monthlyBudget.reduce((a, b) => a + b, 0);
        const avgMonthly = Math.round(annualBudget / 12);

        return `<tr>
            <td>
                <select onchange="updateAcct(${i},'category',this.value)" ${isAuto ? 'disabled' : ''}>
                    ${Object.entries(categoryLabels).map(([k, v]) => `<option value="${k}" ${acct.category === k ? 'selected' : ''}>${v}</option>`).join('')}
                </select>
            </td>
            <td><input type="text" value="${acct.name}" style="width:120px" onchange="updateAcct(${i},'name',this.value)" ${isAuto ? 'readonly' : ''}></td>
            <td>
                <select onchange="updateAcct(${i},'method',this.value)" ${isAuto ? 'disabled' : ''}>
                    <option value="prevYear" ${acct.method === 'prevYear' ? 'selected' : ''}>前年実績按分</option>
                    <option value="fixed" ${acct.method === 'fixed' ? 'selected' : ''}>固定月額</option>
                    <option value="manual" ${acct.method === 'manual' ? 'selected' : ''}>月別手入力</option>
                    <option value="auto" ${acct.method === 'auto' ? 'selected' : ''}>自動（人件費）</option>
                </select>
            </td>
            <td><input type="number" value="${acct.prevYear}" style="width:110px" onchange="updateAcct(${i},'prevYear',parseInt(this.value)||0)" ${isAuto ? 'readonly' : ''}></td>
            <td><input type="number" value="${acct.method === 'prevYear' ? acct.prevYear : annualBudget}" style="width:110px" onchange="updateAcct(${i},'budget',parseInt(this.value)||0)" ${isAuto || acct.method === 'prevYear' ? 'readonly' : ''}></td>
            <td>${fmt(avgMonthly)}</td>
            <td>${!isAuto ? `<button class="row-delete-btn" onclick="removeAccount(${i})">✕</button>` : ''}</td>
        </tr>`;
    }).join('');
}

function updateAcct(idx, field, value) {
    state.accounts[idx][field] = value;
    if (field === 'method' && value === 'prevYear') {
        state.accounts[idx].budget = state.accounts[idx].prevYear;
    }
    if (field === 'prevYear' && state.accounts[idx].method === 'prevYear') {
        state.accounts[idx].budget = value;
    }
    renderAccountTable();
    renderMonthlyAccounts();
    recalcAll();
}

function getAccountMonthlyBudget(acct) {
    if (acct.method === 'auto') {
        // Calculated from employees
        if (acct.name === '給与手当') return getPersonnelMonthlySalary();
        if (acct.name === '法定福利費') return getPersonnelMonthlySI();
        return new Array(12).fill(0);
    }
    if (acct.method === 'manual') {
        return acct.monthly || new Array(12).fill(0);
    }
    if (acct.method === 'fixed') {
        const monthlyVal = Math.round((acct.budget || 0) / 12);
        return new Array(12).fill(monthlyVal);
    }
    // prevYear - distribute evenly
    const monthlyVal = Math.round((acct.prevYear || 0) / 12);
    return new Array(12).fill(monthlyVal);
}

function getPersonnelMonthlySalary() {
    const result = new Array(12).fill(0);
    state.employees.forEach(emp => {
        const bd = getEmployeeMonthlyBreakdown(emp);
        for (let i = 0; i < 12; i++) result[i] += bd.salary[i];
    });
    return result;
}

function getPersonnelMonthlySI() {
    const result = new Array(12).fill(0);
    state.employees.forEach(emp => {
        const bd = getEmployeeMonthlyBreakdown(emp);
        for (let i = 0; i < 12; i++) result[i] += bd.si[i];
    });
    return result;
}

function renderMonthlyAccounts() {
    const labels = getMonthLabels();
    const thead = document.getElementById('monthlyAccountHead');
    thead.innerHTML = `<tr><th>勘定科目</th>${labels.map(l => `<th>${l}</th>`).join('')}<th>年合計</th></tr>`;

    const tbody = document.getElementById('monthlyAccountBody');
    let rows = '';

    state.accounts.filter(a => a.category === 'expense').forEach((acct, i) => {
        const idx = state.accounts.indexOf(acct);
        const monthly = getAccountMonthlyBudget(acct);
        const total = monthly.reduce((a, b) => a + b, 0);
        const isManual = acct.method === 'manual';

        rows += `<tr>
            <td style="font-weight:600">${acct.name}</td>
            ${monthly.map((v, mi) => {
                if (isManual) {
                    return `<td><input type="number" value="${v}" style="width:80px" onchange="updateAcctMonthly(${idx},${mi},parseInt(this.value)||0)"></td>`;
                }
                return `<td>${fmt(v)}</td>`;
            }).join('')}
            <td style="font-weight:600">${fmt(total)}</td>
        </tr>`;
    });

    tbody.innerHTML = rows || '<tr><td colspan="14" style="text-align:center;color:#999">経費科目がありません</td></tr>';
}

function updateAcctMonthly(acctIdx, monthIdx, value) {
    if (!state.accounts[acctIdx].monthly) {
        state.accounts[acctIdx].monthly = new Array(12).fill(0);
    }
    state.accounts[acctIdx].monthly[monthIdx] = value;
    renderMonthlyAccounts();
    recalcAll();
}

// --- PL (Profit & Loss) ---
function renderPL() {
    const labels = getMonthLabels();
    const elapsed = state.elapsedMonths;

    const thead = document.getElementById('plTableHead');
    thead.innerHTML = `<tr>
        <th style="min-width:140px">勘定科目</th>
        ${labels.map((l, i) => `<th class="${i < elapsed ? 'cell-actual' : ''}">${l}${i < elapsed ? '(実)' : ''}</th>`).join('')}
        <th>年合計</th>
    </tr>`;

    const tbody = document.getElementById('plTableBody');
    let rows = '';

    // Get monthly data
    const revenueAccounts = state.accounts.filter(a => a.category === 'revenue');
    const cogsAccounts = state.accounts.filter(a => a.category === 'cogs');
    const expenseAccounts = state.accounts.filter(a => a.category === 'expense');
    const nonOpIncomeAccounts = state.accounts.filter(a => a.category === 'non_op_income');
    const nonOpExpenseAccounts = state.accounts.filter(a => a.category === 'non_op_expense');

    function getMonthlyValues(acct) {
        const budget = getAccountMonthlyBudget(acct);
        const actual = state.actuals[acct.name] || new Array(12).fill(null);
        const result = [];
        for (let i = 0; i < 12; i++) {
            if (i < elapsed && actual[i] !== null && actual[i] !== undefined) {
                result.push({ value: actual[i], isActual: true });
            } else {
                result.push({ value: budget[i], isActual: false });
            }
        }
        return result;
    }

    function renderAccountRow(acct) {
        const mv = getMonthlyValues(acct);
        const total = mv.reduce((a, b) => a + b.value, 0);
        return `<tr>
            <td>${acct.name}</td>
            ${mv.map(v => `<td class="${v.isActual ? 'cell-actual' : 'cell-budget'}">${fmt(v.value)}</td>`).join('')}
            <td style="font-weight:600">${fmt(total)}</td>
        </tr>`;
    }

    function sumMonthlyValues(accounts) {
        const sums = new Array(12).fill(null).map(() => ({ value: 0, isActual: false }));
        accounts.forEach(acct => {
            const mv = getMonthlyValues(acct);
            for (let i = 0; i < 12; i++) {
                sums[i].value += mv[i].value;
                if (mv[i].isActual) sums[i].isActual = true;
            }
        });
        return sums;
    }

    function renderSumRow(label, sums, cssClass) {
        const total = sums.reduce((a, b) => a + b.value, 0);
        return `<tr class="${cssClass}">
            <td>${label}</td>
            ${sums.map(v => `<td class="${v.isActual ? 'cell-actual' : ''}">${fmt(v.value)}</td>`).join('')}
            <td>${fmt(total)}</td>
        </tr>`;
    }

    // Sales section - use salesBudget/salesActual if available, otherwise use account data
    const salesMonthly = getSalesMonthlyValues();

    // === 売上高 ===
    rows += `<tr class="row-category"><td colspan="${14}">【売上高】</td></tr>`;
    const salesTotal = salesMonthly.reduce((a, b) => a + b.value, 0);
    rows += `<tr class="row-total">
        <td>売上高合計</td>
        ${salesMonthly.map(v => `<td class="${v.isActual ? 'cell-actual' : ''}">${fmt(v.value)}</td>`).join('')}
        <td>${fmt(salesTotal)}</td>
    </tr>`;

    // === 売上原価 ===
    rows += `<tr class="row-category"><td colspan="${14}">【売上原価】</td></tr>`;
    cogsAccounts.forEach(acct => { rows += renderAccountRow(acct); });
    const cogsSums = sumMonthlyValues(cogsAccounts);
    rows += renderSumRow('売上原価合計', cogsSums, 'row-subtotal');

    // === 売上総利益 ===
    const grossProfit = salesMonthly.map((s, i) => ({
        value: s.value - cogsSums[i].value,
        isActual: s.isActual || cogsSums[i].isActual
    }));
    rows += renderSumRow('売上総利益', grossProfit, 'row-total');

    // === 販管費 ===
    rows += `<tr class="row-category"><td colspan="${14}">【販売費及び一般管理費】</td></tr>`;
    expenseAccounts.forEach(acct => { rows += renderAccountRow(acct); });
    const expSums = sumMonthlyValues(expenseAccounts);
    rows += renderSumRow('販管費合計', expSums, 'row-subtotal');

    // === 営業利益 ===
    const opProfit = grossProfit.map((g, i) => ({
        value: g.value - expSums[i].value,
        isActual: g.isActual || expSums[i].isActual
    }));
    rows += renderSumRow('営業利益', opProfit, 'row-total');

    // === 営業外損益 ===
    if (nonOpIncomeAccounts.length > 0 || nonOpExpenseAccounts.length > 0) {
        rows += `<tr class="row-category"><td colspan="${14}">【営業外損益】</td></tr>`;
        nonOpIncomeAccounts.forEach(acct => { rows += renderAccountRow(acct); });
        nonOpExpenseAccounts.forEach(acct => { rows += renderAccountRow(acct); });

        const noiSums = sumMonthlyValues(nonOpIncomeAccounts);
        const noeSums = sumMonthlyValues(nonOpExpenseAccounts);
        const ordinaryProfit = opProfit.map((o, i) => ({
            value: o.value + noiSums[i].value - noeSums[i].value,
            isActual: o.isActual || noiSums[i].isActual || noeSums[i].isActual
        }));
        rows += renderSumRow('経常利益', ordinaryProfit, 'row-total');
    }

    tbody.innerHTML = rows;
}

function getSalesMonthlyValues() {
    const elapsed = state.elapsedMonths;
    const result = [];
    const salesAcct = state.accounts.find(a => a.name === '売上高');
    const budget = salesAcct ? getAccountMonthlyBudget(salesAcct) : new Array(12).fill(0);

    for (let i = 0; i < 12; i++) {
        // Priority: salesActual (from MyCommon) > actuals (from PCA) > salesBudget > account budget
        if (i < elapsed) {
            if (state.salesActual[i]) {
                result.push({ value: state.salesActual[i], isActual: true });
            } else if (state.actuals['売上高'] && state.actuals['売上高'][i] !== null) {
                result.push({ value: state.actuals['売上高'][i], isActual: true });
            } else {
                result.push({ value: state.salesBudget[i] || budget[i], isActual: false });
            }
        } else {
            result.push({ value: state.salesBudget[i] || budget[i], isActual: false });
        }
    }
    return result;
}

// --- PCA Import ---
function parsePCAData() {
    const text = document.getElementById('pcaPasteArea').value.trim();
    if (!text) {
        showToast('データを貼り付けてください', 'error');
        return;
    }

    const lines = text.split('\n').map(l => l.split('\t'));
    if (lines.length < 2) {
        showToast('データ形式が正しくありません', 'error');
        return;
    }

    const header = lines[0];
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].length < 2) continue;
        const name = lines[i][0].trim();
        if (!name) continue;
        const values = lines[i].slice(1).map(v => parseNum(v));
        data.push({ name, values });
    }

    state.pcaParsed = { header: header.slice(1), data };

    // Render preview
    const previewCard = document.getElementById('pcaPreviewCard');
    previewCard.style.display = 'block';

    const thead = document.getElementById('pcaPreviewHead');
    thead.innerHTML = `<tr><th>勘定科目</th>${header.slice(1).map(h => `<th>${h}</th>`).join('')}</tr>`;

    const tbody = document.getElementById('pcaPreviewBody');
    tbody.innerHTML = data.map(d => `<tr>
        <td>${d.name}</td>
        ${d.values.map(v => `<td>${fmt(v)}</td>`).join('')}
    </tr>`).join('');

    showToast(`${data.length}件のデータを読み込みました`, 'success');
}

function applyPCAData() {
    if (!state.pcaParsed) return;

    const monthLabels = getMonthLabels();

    state.pcaParsed.data.forEach(d => {
        // Map PCA months to our fiscal months
        const values = new Array(12).fill(null);
        state.pcaParsed.header.forEach((h, hi) => {
            const monthStr = h.replace(/[^0-9]/g, '');
            const month = parseInt(monthStr);
            if (!isNaN(month)) {
                const fiscalIdx = monthLabels.findIndex(l => l === month + '月');
                if (fiscalIdx >= 0 && hi < d.values.length) {
                    values[fiscalIdx] = d.values[hi];
                }
            }
        });

        state.actuals[d.name] = values;

        // Also match to accounts
        const acct = state.accounts.find(a => a.name === d.name);
        if (acct && d.name === '売上高') {
            for (let i = 0; i < 12; i++) {
                if (values[i] !== null) {
                    state.salesActual[i] = values[i];
                }
            }
        }
    });

    // Auto-set elapsed months based on data
    let maxElapsed = 0;
    Object.values(state.actuals).forEach(arr => {
        for (let i = 0; i < 12; i++) {
            if (arr[i] !== null && arr[i] !== undefined) {
                maxElapsed = Math.max(maxElapsed, i + 1);
            }
        }
    });
    if (maxElapsed > 0) {
        state.elapsedMonths = maxElapsed;
        document.getElementById('elapsedMonth').value = maxElapsed;
    }

    recalcAll();
    showToast('実績データを反映しました', 'success');
}

// --- Sales (MyCommon) ---
function parseSalesData() {
    const text = document.getElementById('salesPasteArea').value.trim();
    if (!text) {
        showToast('データを貼り付けてください', 'error');
        return;
    }

    const lines = text.split('\n').map(l => l.split('\t'));
    const monthLabels = getMonthLabels();

    // Check if it's client-based (header row has month names)
    const firstLine = lines[0];
    const hasHeader = firstLine.length > 2 && firstLine.slice(1).some(h => /\d+月/.test(h));

    if (hasHeader) {
        // Client-based format
        const header = firstLine.slice(1);
        const monthlySums = new Array(12).fill(0);

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].length < 2) continue;
            const values = lines[i].slice(1).map(v => parseNum(v));
            header.forEach((h, hi) => {
                const monthStr = h.replace(/[^0-9]/g, '');
                const month = parseInt(monthStr);
                if (!isNaN(month)) {
                    const fiscalIdx = monthLabels.findIndex(l => l === month + '月');
                    if (fiscalIdx >= 0 && hi < values.length) {
                        monthlySums[fiscalIdx] += values[hi];
                    }
                }
            });
        }

        state.salesBudget = monthlySums;
        // Update the sales account
        const salesAcct = state.accounts.find(a => a.name === '売上高');
        if (salesAcct) {
            salesAcct.method = 'manual';
            salesAcct.monthly = [...monthlySums];
        }
    } else {
        // Simple month-amount format
        const monthlySums = new Array(12).fill(0);
        lines.forEach(line => {
            if (line.length < 2) return;
            const monthStr = line[0].replace(/[^0-9]/g, '');
            const month = parseInt(monthStr);
            const value = parseNum(line[1]);
            if (!isNaN(month)) {
                const fiscalIdx = monthLabels.findIndex(l => l === month + '月');
                if (fiscalIdx >= 0) {
                    monthlySums[fiscalIdx] = value;
                }
            }
        });

        state.salesBudget = monthlySums;
        const salesAcct = state.accounts.find(a => a.name === '売上高');
        if (salesAcct) {
            salesAcct.method = 'manual';
            salesAcct.monthly = [...monthlySums];
        }
    }

    renderSalesTable();
    recalcAll();
    showToast('売上データを取り込みました', 'success');
}

function renderSalesTable() {
    const labels = getMonthLabels();
    const elapsed = state.elapsedMonths;

    const thead = document.getElementById('salesTableHead');
    thead.innerHTML = `<tr><th>区分</th>${labels.map((l, i) => `<th class="${i < elapsed ? 'cell-actual' : ''}">${l}</th>`).join('')}<th>年合計</th></tr>`;

    const tbody = document.getElementById('salesTableBody');
    const budget = state.salesBudget.length ? state.salesBudget : new Array(12).fill(0);
    const actual = state.salesActual.length ? state.salesActual : new Array(12).fill(0);

    const budgetTotal = budget.reduce((a, b) => a + b, 0);
    const actualTotal = actual.reduce((a, b) => a + (b || 0), 0);

    tbody.innerHTML = `
        <tr>
            <td style="font-weight:600">売上予算</td>
            ${budget.map((v, i) => `<td><input type="number" value="${v}" style="width:90px" onchange="updateSalesBudget(${i},parseInt(this.value)||0)"></td>`).join('')}
            <td style="font-weight:600">${fmt(budgetTotal)}</td>
        </tr>
        <tr>
            <td style="font-weight:600">売上実績</td>
            ${labels.map((_, i) => `<td class="${i < elapsed ? 'cell-actual' : ''}">${i < elapsed ? fmt(actual[i] || 0) : '-'}</td>`).join('')}
            <td style="font-weight:600">${fmt(actualTotal)}</td>
        </tr>
        <tr style="font-weight:600;background:#f0f4f8">
            <td>予実差異</td>
            ${labels.map((_, i) => {
                if (i >= elapsed) return '<td>-</td>';
                const diff = (actual[i] || 0) - budget[i];
                return `<td class="${diff < 0 ? 'val-negative' : ''}">${fmt(diff)}</td>`;
            }).join('')}
            <td></td>
        </tr>
    `;
}

function updateSalesBudget(monthIdx, value) {
    if (!state.salesBudget.length) state.salesBudget = new Array(12).fill(0);
    state.salesBudget[monthIdx] = value;

    const salesAcct = state.accounts.find(a => a.name === '売上高');
    if (salesAcct) {
        salesAcct.method = 'manual';
        if (!salesAcct.monthly) salesAcct.monthly = new Array(12).fill(0);
        salesAcct.monthly[monthIdx] = value;
    }

    renderSalesTable();
    recalcAll();
}

// --- Dashboard ---
function updateDashboard() {
    const salesMonthly = getSalesMonthlyValues();
    const salesTotal = salesMonthly.reduce((a, b) => a + b.value, 0);

    let personnelTotal = 0;
    state.employees.forEach(emp => {
        personnelTotal += calcEmployeeCosts(emp).annualTotal;
    });

    let expenseTotal = 0;
    state.accounts.filter(a => a.category === 'expense').forEach(acct => {
        const monthly = getAccountMonthlyBudget(acct);
        expenseTotal += monthly.reduce((a, b) => a + b, 0);
    });

    let cogsTotal = 0;
    state.accounts.filter(a => a.category === 'cogs').forEach(acct => {
        const monthly = getAccountMonthlyBudget(acct);
        cogsTotal += monthly.reduce((a, b) => a + b, 0);
    });

    const profit = salesTotal - cogsTotal - expenseTotal;

    document.getElementById('dashSales').textContent = fmt(salesTotal) + '円';
    document.getElementById('dashPersonnel').textContent = fmt(personnelTotal) + '円';
    document.getElementById('dashExpenses').textContent = fmt(expenseTotal) + '円';

    const profitEl = document.getElementById('dashProfit');
    profitEl.textContent = fmt(profit) + '円';
    profitEl.className = 'dash-card-value' + (profit < 0 ? ' val-negative' : '');
}

// --- Recalculate All ---
function recalcAll() {
    // Sync insurance rates from inputs
    state.rates.health = parseFloat(document.getElementById('rateHealth').value) || 0;
    state.rates.pension = parseFloat(document.getElementById('ratePension').value) || 0;
    state.rates.employment = parseFloat(document.getElementById('rateEmployment').value) || 0;
    state.rates.accident = parseFloat(document.getElementById('rateAccident').value) || 0;
    state.rates.care = parseFloat(document.getElementById('rateCare').value) || 0;
    state.rates.child = parseFloat(document.getElementById('rateChild').value) || 0;

    renderEmployeeTable();
    renderMonthlyPersonnel();
    renderAccountTable();
    renderMonthlyAccounts();
    renderSalesTable();
    updateDashboard();

    // Auto-save
    saveToLocalStorage();
}

// --- Save / Load ---
function saveToLocalStorage() {
    try {
        localStorage.setItem('budgetApp', JSON.stringify(state));
    } catch (e) {
        // ignore
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('budgetApp');
        if (saved) {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
            return true;
        }
    } catch (e) {
        // ignore
    }
    return false;
}

function saveAllData() {
    saveToLocalStorage();
    showToast('データを保存しました', 'success');
}

function exportData() {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget_${state.fiscalYear}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('データをエクスポートしました', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const parsed = JSON.parse(e.target.result);
            state = { ...state, ...parsed };
            initUI();
            recalcAll();
            showToast('データをインポートしました', 'success');
        } catch (err) {
            showToast('ファイル形式が正しくありません', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function clearAllData() {
    if (!confirm('全データを削除しますか？この操作は取り消せません。')) return;
    localStorage.removeItem('budgetApp');
    location.reload();
}

// --- Initialize ---
function initUI() {
    document.getElementById('fiscalYear').value = state.fiscalYear;
    document.getElementById('fiscalStartMonth').value = state.fiscalStartMonth;
    document.getElementById('rateHealth').value = state.rates.health;
    document.getElementById('ratePension').value = state.rates.pension;
    document.getElementById('rateEmployment').value = state.rates.employment;
    document.getElementById('rateAccident').value = state.rates.accident;
    document.getElementById('rateCare').value = state.rates.care;
    document.getElementById('rateChild').value = state.rates.child;

    updateElapsedMonthOptions();
    document.getElementById('elapsedMonth').value = state.elapsedMonths;
}

document.addEventListener('DOMContentLoaded', () => {
    const loaded = loadFromLocalStorage();
    if (!loaded) {
        state.accounts = JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS));
        state.salesBudget = new Array(12).fill(0);
        state.salesActual = new Array(12).fill(0);
    }
    initUI();
    recalcAll();
});
