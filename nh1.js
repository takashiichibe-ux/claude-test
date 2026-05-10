/* ==========================================================
   ニューホライゾン 中1 英語学習アプリ
   ホーム画面 / ユニット画面 / 会話・単語・テスト・並べ替え
   ========================================================== */

// ============== 教科書データ（New Horizon 中1 Unit 1〜4） ==============
const UNITS = [
    {
        id: 1,
        icon: '👋',
        title: 'Welcome to Junior High',
        sub: 'はじめまして・自己紹介',
        grammar: 'I am 〜. / You are 〜. / Are you 〜?',
        // 会話文（オリジナルアレンジ）
        conv: [
            { sp:'A', en:'Hello. I am Saki. Nice to meet you.', ja:'こんにちは。私はさきです。はじめまして。' },
            { sp:'B', en:'Hi, Saki. I am Tom. Nice to meet you, too.', ja:'こんにちは、さき。ぼくはトムだよ。こちらこそはじめまして。' },
            { sp:'A', en:'Are you from America?', ja:'アメリカ出身ですか？' },
            { sp:'B', en:'Yes, I am. I am from New York.', ja:'はい、そうです。ニューヨーク出身です。' },
            { sp:'A', en:'I am a junior high school student.', ja:'私は中学生です。' },
            { sp:'B', en:'Me too. I am twelve years old.', ja:'ぼくもだよ。12歳です。' },
            { sp:'A', en:'I am a soccer fan. Are you?', ja:'私はサッカーファンです。あなたは？' },
            { sp:'B', en:'Yes, I am. Soccer is fun.', ja:'うん、ぼくも。サッカーは楽しいよ。' }
        ],
        // 単語データ（覚えるべき単語）
        vocab: [
            { en:'hello', ja:'こんにちは', pos:'感' },
            { en:'I', ja:'私は、私が', pos:'代' },
            { en:'am', ja:'〜です（主語が I）', pos:'動' },
            { en:'you', ja:'あなた、あなたは', pos:'代' },
            { en:'are', ja:'〜です（主語が you 等）', pos:'動' },
            { en:'from', ja:'〜から、〜出身', pos:'前' },
            { en:'name', ja:'名前', pos:'名' },
            { en:'student', ja:'生徒、学生', pos:'名' },
            { en:'school', ja:'学校', pos:'名' },
            { en:'meet', ja:'会う', pos:'動' },
            { en:'too', ja:'〜もまた', pos:'副' },
            { en:'America', ja:'アメリカ', pos:'名' },
            { en:'Japan', ja:'日本', pos:'名' },
            { en:'fan', ja:'ファン', pos:'名' },
            { en:'twelve', ja:'12', pos:'数' }
        ],
        // 並べ替え用センテンス（リスニング作文）
        sentences: [
            { en:'I am Saki.', ja:'私はさきです。' },
            { en:'Nice to meet you.', ja:'はじめまして。' },
            { en:'I am from Japan.', ja:'私は日本出身です。' },
            { en:'Are you from America?', ja:'あなたはアメリカ出身ですか？' },
            { en:'I am a student.', ja:'私は生徒です。' },
            { en:'You are my friend.', ja:'あなたは私の友だちです。' },
            { en:'I am twelve years old.', ja:'私は12歳です。' },
            { en:'I am a soccer fan.', ja:'私はサッカーファンです。' }
        ]
    },
    {
        id: 2,
        icon: '⚽',
        title: 'Club Activities',
        sub: '一般動詞・好きなこと',
        grammar: 'I like 〜. / Do you 〜? / I don\'t 〜.',
        conv: [
            { sp:'A', en:'Do you like sports?', ja:'スポーツは好き？' },
            { sp:'B', en:'Yes, I do. I like soccer very much.', ja:'うん、すき。サッカーが大好きだよ。' },
            { sp:'A', en:'Do you play soccer every day?', ja:'毎日サッカーするの？' },
            { sp:'B', en:'No, I don\'t. I play it on Sundays.', ja:'いや、毎日じゃないよ。日曜日にやるんだ。' },
            { sp:'A', en:'I like baseball. I watch games on TV.', ja:'私は野球が好き。テレビで試合を見るよ。' },
            { sp:'B', en:'Cool! Do you have a favorite team?', ja:'いいね！好きなチームはあるの？' },
            { sp:'A', en:'Yes. I like the Tigers very much.', ja:'うん。タイガースが大好きなんだ。' },
            { sp:'B', en:'I see. I want to watch a game with you.', ja:'なるほど。一緒に試合見たいな。' }
        ],
        vocab: [
            { en:'like', ja:'〜が好きである', pos:'動' },
            { en:'play', ja:'(スポーツを)する、演奏する', pos:'動' },
            { en:'have', ja:'〜を持っている', pos:'動' },
            { en:'want', ja:'〜が欲しい', pos:'動' },
            { en:'watch', ja:'見る', pos:'動' },
            { en:'every', ja:'毎〜', pos:'形' },
            { en:'day', ja:'日、一日', pos:'名' },
            { en:'sports', ja:'スポーツ', pos:'名' },
            { en:'soccer', ja:'サッカー', pos:'名' },
            { en:'baseball', ja:'野球', pos:'名' },
            { en:'team', ja:'チーム', pos:'名' },
            { en:'TV', ja:'テレビ', pos:'名' },
            { en:'do', ja:'〜する（疑問文を作る）', pos:'助' },
            { en:'don\'t', ja:'〜しない', pos:'助' },
            { en:'favorite', ja:'お気に入りの', pos:'形' }
        ],
        sentences: [
            { en:'I like soccer.', ja:'私はサッカーが好きです。' },
            { en:'Do you like sports?', ja:'スポーツは好きですか？' },
            { en:'I play soccer every day.', ja:'私は毎日サッカーをします。' },
            { en:'I don\'t like cats.', ja:'私はネコが好きではありません。' },
            { en:'Do you have a pen?', ja:'ペンを持っていますか？' },
            { en:'I want a new bike.', ja:'私は新しい自転車が欲しいです。' },
            { en:'I watch TV every day.', ja:'私は毎日テレビを見ます。' },
            { en:'I have a favorite team.', ja:'私には好きなチームがあります。' }
        ]
    },
    {
        id: 3,
        icon: '🎸',
        title: 'Enjoy the Summer',
        sub: 'can・できることを話す',
        grammar: 'I can 〜. / Can you 〜? / I can\'t 〜.',
        conv: [
            { sp:'A', en:'Can you play the guitar?', ja:'ギターは弾ける？' },
            { sp:'B', en:'Yes, I can. I can play it well.', ja:'うん、弾けるよ。じょうずに弾けるんだ。' },
            { sp:'A', en:'Wow! Can you sing, too?', ja:'すごい！歌も歌える？' },
            { sp:'B', en:'No, I can\'t. I can\'t sing well.', ja:'いや、無理。歌は上手じゃないんだ。' },
            { sp:'A', en:'I can play the piano. Let\'s play together.', ja:'私はピアノが弾けるよ。一緒に演奏しよう。' },
            { sp:'B', en:'Sounds great. I can swim, too.', ja:'いいね。ぼくは泳ぐこともできるよ。' },
            { sp:'A', en:'Really? Can you swim fast?', ja:'本当？速く泳げるの？' },
            { sp:'B', en:'Yes. I can swim very fast.', ja:'うん。とても速く泳げるよ。' }
        ],
        vocab: [
            { en:'can', ja:'〜できる', pos:'助' },
            { en:'can\'t', ja:'〜できない', pos:'助' },
            { en:'guitar', ja:'ギター', pos:'名' },
            { en:'piano', ja:'ピアノ', pos:'名' },
            { en:'sing', ja:'歌う', pos:'動' },
            { en:'swim', ja:'泳ぐ', pos:'動' },
            { en:'run', ja:'走る', pos:'動' },
            { en:'fast', ja:'速く', pos:'副' },
            { en:'well', ja:'じょうずに', pos:'副' },
            { en:'together', ja:'いっしょに', pos:'副' },
            { en:'really', ja:'本当に', pos:'副' },
            { en:'cook', ja:'料理する', pos:'動' },
            { en:'speak', ja:'話す', pos:'動' },
            { en:'English', ja:'英語', pos:'名' },
            { en:'great', ja:'すごい、すばらしい', pos:'形' }
        ],
        sentences: [
            { en:'I can play the piano.', ja:'私はピアノが弾けます。' },
            { en:'Can you swim?', ja:'あなたは泳げますか？' },
            { en:'I can\'t run fast.', ja:'私は速く走れません。' },
            { en:'She can sing well.', ja:'彼女はじょうずに歌えます。' },
            { en:'Let\'s sing together.', ja:'いっしょに歌いましょう。' },
            { en:'I can speak English.', ja:'私は英語を話せます。' },
            { en:'Can you cook?', ja:'あなたは料理ができますか？' },
            { en:'I can swim very fast.', ja:'私はとても速く泳げます。' }
        ]
    },
    {
        id: 4,
        icon: '👨‍👩‍👧',
        title: 'Our New Friend',
        sub: '三人称・友だちの紹介',
        grammar: 'This is 〜. / He/She is 〜. / Where is 〜?',
        conv: [
            { sp:'A', en:'Hi, this is my friend, Ken. He is from Osaka.', ja:'こちらは友だちのケンです。大阪出身だよ。' },
            { sp:'B', en:'Nice to meet you, Ken. Where are you from in Osaka?', ja:'はじめまして、ケン。大阪のどこの出身？' },
            { sp:'A', en:'He is from Namba. He likes takoyaki.', ja:'彼は難波出身だよ。たこ焼きが好きなんだ。' },
            { sp:'B', en:'Cool! Who is that girl?', ja:'いいね！あの女の子はだれ？' },
            { sp:'A', en:'That is my sister, Yuki. She is twelve.', ja:'あれはぼくの妹のユキだよ。12歳。' },
            { sp:'B', en:'Where is she now?', ja:'彼女は今どこにいるの？' },
            { sp:'A', en:'She is in the gym. She plays basketball.', ja:'体育館にいるよ。バスケをしてるんだ。' },
            { sp:'B', en:'Wow, she is good at sports.', ja:'おお、スポーツが得意なんだね。' }
        ],
        vocab: [
            { en:'this', ja:'これ、こちら', pos:'代' },
            { en:'that', ja:'あれ、あちら', pos:'代' },
            { en:'is', ja:'〜です（主語が he/she/it）', pos:'動' },
            { en:'he', ja:'彼は', pos:'代' },
            { en:'she', ja:'彼女は', pos:'代' },
            { en:'who', ja:'だれ', pos:'代' },
            { en:'where', ja:'どこ', pos:'副' },
            { en:'what', ja:'なに', pos:'代' },
            { en:'friend', ja:'友だち', pos:'名' },
            { en:'sister', ja:'姉、妹', pos:'名' },
            { en:'brother', ja:'兄、弟', pos:'名' },
            { en:'gym', ja:'体育館', pos:'名' },
            { en:'now', ja:'今', pos:'副' },
            { en:'good', ja:'良い、上手な', pos:'形' },
            { en:'basketball', ja:'バスケットボール', pos:'名' }
        ],
        sentences: [
            { en:'This is my friend.', ja:'こちらは私の友だちです。' },
            { en:'He is from Osaka.', ja:'彼は大阪出身です。' },
            { en:'She is twelve years old.', ja:'彼女は12歳です。' },
            { en:'Who is that girl?', ja:'あの女の子はだれですか？' },
            { en:'Where is she now?', ja:'彼女は今どこにいますか？' },
            { en:'She is in the gym.', ja:'彼女は体育館にいます。' },
            { en:'He likes takoyaki.', ja:'彼はたこ焼きが好きです。' },
            { en:'That is my sister.', ja:'あれは私の妹です。' }
        ]
    }
];

// バッジ定義
const BADGES = [
    { id:'first',    emoji:'🌱', name:'はじめの一歩', test:s => s.totalStars >= 1 },
    { id:'streak3',  emoji:'🔥', name:'3日連続',     test:s => s.streak >= 3 },
    { id:'streak7',  emoji:'⚡', name:'1週間連続',   test:s => s.streak >= 7 },
    { id:'unit1',    emoji:'1️⃣', name:'Unit 1 完了', test:s => s.unitDone[1] },
    { id:'unit2',    emoji:'2️⃣', name:'Unit 2 完了', test:s => s.unitDone[2] },
    { id:'unit3',    emoji:'3️⃣', name:'Unit 3 完了', test:s => s.unitDone[3] },
    { id:'unit4',    emoji:'4️⃣', name:'Unit 4 完了', test:s => s.unitDone[4] },
    { id:'allunit',  emoji:'🏆', name:'全ユニット制覇', test:s => [1,2,3,4].every(u => s.unitDone[u]) },
    { id:'star20',   emoji:'⭐', name:'スター20',     test:s => s.totalStars >= 20 },
    { id:'star50',   emoji:'🌟', name:'スター50',     test:s => s.totalStars >= 50 },
    { id:'perfect',  emoji:'💯', name:'パーフェクト', test:s => s.perfectCount >= 1 },
    { id:'master',   emoji:'👑', name:'マスター',     test:s => s.totalStars >= 100 }
];

// ============== グローバル状態 ==============
const STORAGE_KEY = 'nh1_v1_state';

let state = loadState();
let currentUnit = null;
let currentMode = 'conv';
let speakRate = 0.9;
let voices = [];
let chosenVoice = null;

// 単語テスト状態
let wtest = { questions: [], idx: 0, score: 0 };
// 並べ替え状態
let arr = { questions: [], idx: 0, score: 0, answer: [], pool: [] };

// ============== 状態管理 ==============
function defaultState() {
    return {
        nick: '',
        voiceURI: '',
        totalStars: 0,
        streak: 0,
        lastDate: '',
        firstDate: '',
        weekActivity: {},     // { 'YYYY-MM-DD': stars }
        unitProgress: {       // { [unitId]: { vocabBest, arrBest } }
            1: { vocabBest:0, arrBest:0 },
            2: { vocabBest:0, arrBest:0 },
            3: { vocabBest:0, arrBest:0 },
            4: { vocabBest:0, arrBest:0 }
        },
        unitDone: { 1:false, 2:false, 3:false, 4:false },
        perfectCount: 0,
        earnedBadges: []
    };
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultState();
        const s = JSON.parse(raw);
        // マイグレーション
        const def = defaultState();
        return Object.assign(def, s, { unitProgress: Object.assign(def.unitProgress, s.unitProgress||{}) });
    } catch(e) {
        return defaultState();
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${dd}`;
}

function addStars(n) {
    if (!n) return;
    const t = todayStr();
    state.weekActivity[t] = (state.weekActivity[t] || 0) + n;
    state.totalStars += n;

    // 連続記録
    if (state.lastDate !== t) {
        const yest = new Date(); yest.setDate(yest.getDate()-1);
        const yestStr = yest.toISOString().slice(0,10);
        if (state.lastDate === yestStr) {
            state.streak += 1;
        } else {
            state.streak = 1;
        }
        state.lastDate = t;
        if (!state.firstDate) state.firstDate = t;
    }

    // 1週間以上前のデータを削除
    const week = new Date(); week.setDate(week.getDate()-13);
    Object.keys(state.weekActivity).forEach(k => {
        if (new Date(k) < week) delete state.weekActivity[k];
    });

    saveState();
}

// ============== 画面切り替え ==============
function show(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo(0, 0);
}

function goHome() {
    stopSpeak();
    currentUnit = null;
    show('screen-home');
    renderHome();
}

function openUnit(uid) {
    stopSpeak();
    currentUnit = UNITS.find(u => u.id === uid);
    document.getElementById('unitTitle').textContent = `Unit ${currentUnit.id}: ${currentUnit.title}`;
    document.getElementById('unitDesc').textContent = `${currentUnit.sub} ｜ ${currentUnit.grammar}`;
    show('screen-unit');
    switchMode('conv');
    renderUnitProgress();
}

function switchMode(mode) {
    stopSpeak();
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === mode);
    });
    document.querySelectorAll('.mode-panel').forEach(p => {
        p.classList.toggle('active', p.id === `panel-${mode}`);
    });
    if (mode === 'conv') renderConversation();
    if (mode === 'vocab') renderVocab();
    if (mode === 'wtest') startWtest();
    if (mode === 'arrange') startArrange();
}

function setRate(r) {
    speakRate = r;
    document.querySelectorAll('.seg-mini-btn').forEach(b => {
        b.classList.toggle('active', parseFloat(b.dataset.rate) === r);
    });
}

// ============== ホーム画面の描画 ==============
function renderHome() {
    // 挨拶（時間帯別）
    const h = new Date().getHours();
    let emoji = '🌅', hello = 'おはよう！';
    if (h >= 11 && h < 17) { emoji = '☀️'; hello = 'こんにちは！'; }
    else if (h >= 17 && h < 22) { emoji = '🌆'; hello = 'こんばんは！'; }
    else if (h >= 22 || h < 5) { emoji = '🌙'; hello = 'おそくまでがんばるね！'; }
    if (state.nick) hello = state.nick + 'さん、' + hello;
    document.getElementById('homeEmoji').textContent = emoji;
    document.getElementById('homeHello').textContent = hello;

    // ヒーロー数値
    document.getElementById('totalStars').textContent = state.totalStars;
    document.getElementById('streakDays').textContent = state.streak;
    const totalDays = state.firstDate
        ? Math.floor((Date.now() - new Date(state.firstDate).getTime()) / 86400000) + 1
        : 0;
    document.getElementById('totalDays').textContent = totalDays;

    // 応援メッセージ
    const msgs = [
        '今日も少しずつ進めよう！🚀',
        'コツコツ続けるのが一番！💪',
        '英語は声に出すと覚えやすいよ🎤',
        'できることがどんどん増えるよ✨',
        '昨日のあなたに勝とう！🔥',
        'Listening は何度もくり返そう👂',
        '小さな一歩が大きな力になる🌱'
    ];
    if (state.streak >= 3) {
        document.getElementById('heroMsg').textContent = `${state.streak}日連続！🔥 すごい！この調子！`;
    } else if (state.totalStars === 0) {
        document.getElementById('heroMsg').textContent = 'はじめての勉強、ようこそ！🎉';
    } else {
        document.getElementById('heroMsg').textContent = msgs[Math.floor(Math.random() * msgs.length)];
    }

    // 全体達成度（最大: 各ユニット = vocab10 + arr10 = 20スター × 4 = 80）
    const maxStars = UNITS.length * 20;
    const earned = UNITS.reduce((sum, u) => {
        const p = state.unitProgress[u.id] || { vocabBest:0, arrBest:0 };
        return sum + (p.vocabBest||0) + (p.arrBest||0);
    }, 0);
    const pct = Math.min(100, Math.round((earned / maxStars) * 100));
    document.getElementById('overallPct').textContent = pct + '%';
    document.getElementById('overallBar').style.width = pct + '%';
    if (pct === 0) {
        document.getElementById('overallSub').textContent = 'ユニット1から始めよう！🌱';
    } else if (pct < 50) {
        document.getElementById('overallSub').textContent = `ナイスペース！あと ${maxStars - earned} スターでコンプリート！`;
    } else if (pct < 100) {
        document.getElementById('overallSub').textContent = `半分以上クリア！もうひといき！`;
    } else {
        document.getElementById('overallSub').textContent = `🏆 すべてのユニットをマスター！おめでとう！`;
    }

    // 7日間グラフ
    renderWeekChart();

    // バッジ
    renderBadges();

    // ユニットリスト
    renderUnitGrid();
}

function renderWeekChart() {
    const chart = document.getElementById('weekChart');
    chart.innerHTML = '';
    const today = new Date();
    const days = [];
    let max = 1;
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today); d.setDate(today.getDate() - i);
        const k = d.toISOString().slice(0,10);
        const v = state.weekActivity[k] || 0;
        days.push({ d, k, v });
        if (v > max) max = v;
    }
    const dayNames = ['日','月','火','水','木','金','土'];
    days.forEach((day, i) => {
        const isToday = i === 6;
        const h = day.v > 0 ? Math.max(8, (day.v / max) * 70) : 4;
        const bar = document.createElement('div');
        bar.className = 'week-bar';
        bar.innerHTML = `
            <div class="week-bar-val">${day.v > 0 ? day.v + '⭐' : ''}</div>
            <div class="week-bar-fill ${day.v === 0 ? 'empty' : ''} ${isToday ? 'today' : ''}" style="height:${h}%;"></div>
            <div class="week-bar-day">${dayNames[day.d.getDay()]}</div>
        `;
        chart.appendChild(bar);
    });
}

function renderBadges() {
    const grid = document.getElementById('badgeGrid');
    grid.innerHTML = '';
    BADGES.forEach(b => {
        const earned = b.test(state);
        if (earned && !state.earnedBadges.includes(b.id)) {
            state.earnedBadges.push(b.id);
            saveState();
        }
        const el = document.createElement('div');
        el.className = 'badge-item ' + (earned ? 'earned' : 'locked');
        el.innerHTML = `
            <div class="badge-emoji">${earned ? b.emoji : '🔒'}</div>
            <div class="badge-name">${b.name}</div>
        `;
        grid.appendChild(el);
    });
}

function renderUnitGrid() {
    const grid = document.getElementById('unitGrid');
    grid.innerHTML = '';
    UNITS.forEach(u => {
        const p = state.unitProgress[u.id] || { vocabBest:0, arrBest:0 };
        const earned = (p.vocabBest||0) + (p.arrBest||0);
        const pct = Math.min(100, Math.round((earned / 20) * 100));
        const stars = Math.min(3, Math.floor(earned / 7));
        const done = state.unitDone[u.id];

        const card = document.createElement('button');
        card.className = 'unit-card' + (done ? ' completed' : '');
        card.onclick = () => openUnit(u.id);
        card.innerHTML = `
            ${done ? '<span class="unit-card-badge">完了!</span>' : ''}
            <div class="unit-card-icon">${u.icon}</div>
            <div class="unit-card-num">UNIT ${u.id}</div>
            <div class="unit-card-title">${u.title}</div>
            <div class="unit-card-desc">${u.sub}</div>
            <div class="unit-card-progress">
                <div class="unit-card-progress-bar" style="width:${pct}%;"></div>
            </div>
            <div class="unit-card-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)} <small style="color:var(--text-sub);font-size:10px;">${earned}/20</small></div>
        `;
        grid.appendChild(card);
    });
}

function renderUnitProgress() {
    if (!currentUnit) return;
    const p = state.unitProgress[currentUnit.id] || { vocabBest:0, arrBest:0 };
    const vMax = currentUnit.vocab.length;
    const aMax = currentUnit.sentences.length;
    document.getElementById('upVocab').style.width = (p.vocabBest / vMax * 100) + '%';
    document.getElementById('upVocabNum').textContent = `${p.vocabBest}/${vMax}`;
    document.getElementById('upArr').style.width = (p.arrBest / aMax * 100) + '%';
    document.getElementById('upArrNum').textContent = `${p.arrBest}/${aMax}`;
}

// ============== 会話文モード ==============
function renderConversation() {
    if (!currentUnit) return;
    const list = document.getElementById('convList');
    const showJa = document.getElementById('showJa').checked;
    list.innerHTML = '';
    currentUnit.conv.forEach((line, i) => {
        const row = document.createElement('div');
        row.className = `conv-line speaker-${line.sp}`;
        row.innerHTML = `
            <div class="conv-spkr">${line.sp}</div>
            <div class="conv-body">
                <div class="conv-en">${escapeHtml(line.en)}</div>
                ${showJa ? `<div class="conv-ja">${escapeHtml(line.ja)}</div>` : ''}
            </div>
            <button class="play-btn" data-i="${i}" aria-label="再生">🔊</button>
        `;
        row.querySelector('.play-btn').onclick = () => speakLine(line.en, row.querySelector('.play-btn'));
        list.appendChild(row);
    });
}

function playWholeConv() {
    if (!currentUnit) return;
    stopSpeak();
    let i = 0;
    const lines = currentUnit.conv;
    const playNext = () => {
        if (i >= lines.length) return;
        speak(lines[i].en, () => { i++; setTimeout(playNext, 350); });
    };
    playNext();
}

// ============== 単語一覧モード ==============
function renderVocab() {
    if (!currentUnit) return;
    const list = document.getElementById('vocabList');
    list.innerHTML = '';
    currentUnit.vocab.forEach(v => {
        const row = document.createElement('div');
        row.className = 'vocab-row';
        row.innerHTML = `
            <div class="vocab-en">${escapeHtml(v.en)}</div>
            <div class="vocab-info">
                <span class="vocab-pos">${v.pos}</span>
                <span class="vocab-mean">${escapeHtml(v.ja)}</span>
            </div>
            <button class="play-btn" aria-label="再生">🔊</button>
        `;
        row.querySelector('.play-btn').onclick = () => speakLine(v.en, row.querySelector('.play-btn'));
        list.appendChild(row);
    });
}

function playAllVocab() {
    if (!currentUnit) return;
    stopSpeak();
    let i = 0;
    const list = currentUnit.vocab;
    const next = () => {
        if (i >= list.length) return;
        speak(list[i].en, () => { i++; setTimeout(next, 600); });
    };
    next();
}

// ============== 単語テスト ==============
function startWtest() {
    if (!currentUnit) return;
    const vocab = currentUnit.vocab;
    const n = Math.min(10, vocab.length);
    const shuffled = [...vocab].sort(() => Math.random() - 0.5).slice(0, n);
    wtest = {
        questions: shuffled.map(v => ({
            ...v,
            // ダミー選択肢
            choices: makeChoices(v, vocab, 4)
        })),
        idx: 0,
        score: 0
    };
    document.getElementById('wtestProg').style.display = '';
    renderWtestQuestion();
}

function makeChoices(correct, pool, count) {
    const others = pool.filter(v => v.en !== correct.en);
    const dummies = others.sort(() => Math.random() - 0.5).slice(0, count - 1);
    const all = [...dummies, correct].sort(() => Math.random() - 0.5);
    return all;
}

function restartWtest() {
    stopSpeak();
    startWtest();
}

function renderWtestQuestion() {
    const q = wtest.questions[wtest.idx];
    const total = wtest.questions.length;
    document.getElementById('wtestBar').style.width = ((wtest.idx) / total * 100) + '%';
    document.getElementById('wtestText').textContent = `問題 ${wtest.idx+1} / ${total}`;
    const area = document.getElementById('wtestArea');
    area.innerHTML = `
        <div class="wtest-question">
            <div class="wtest-q-label">この意味の英単語は？</div>
            <div class="wtest-q-text">${escapeHtml(q.ja)}<br><small style="font-size:13px;color:var(--text-sub);font-weight:500;">（${q.pos}）</small></div>
        </div>
        <div class="wtest-options" id="wtestOpts"></div>
        <div id="wtestFeedback"></div>
    `;
    const opts = document.getElementById('wtestOpts');
    q.choices.forEach(c => {
        const b = document.createElement('button');
        b.className = 'wtest-opt';
        b.textContent = c.en;
        b.onclick = () => answerWtest(b, c, q);
        opts.appendChild(b);
    });
}

function answerWtest(btn, choice, q) {
    const opts = document.querySelectorAll('.wtest-opt');
    opts.forEach(o => o.disabled = true);
    const correct = choice.en === q.en;
    if (correct) {
        btn.classList.add('correct');
        wtest.score += 1;
        document.getElementById('wtestFeedback').innerHTML =
            `<div class="wtest-feedback ok">⭕ 正解！　<small>${escapeHtml(q.en)} = ${escapeHtml(q.ja)}</small></div>`;
    } else {
        btn.classList.add('wrong');
        opts.forEach(o => { if (o.textContent === q.en) o.classList.add('correct'); });
        document.getElementById('wtestFeedback').innerHTML =
            `<div class="wtest-feedback ng">❌ ざんねん。正解は <strong>${escapeHtml(q.en)}</strong></div>`;
    }
    speakLine(q.en, null);

    setTimeout(() => {
        wtest.idx += 1;
        if (wtest.idx >= wtest.questions.length) {
            finishWtest();
        } else {
            renderWtestQuestion();
        }
    }, 1500);
}

function finishWtest() {
    const total = wtest.questions.length;
    const score = wtest.score;
    const p = state.unitProgress[currentUnit.id];
    const before = p.vocabBest || 0;
    if (score > before) p.vocabBest = score;
    addStars(score);
    if (score === total) state.perfectCount += 1;
    checkUnitDone();
    saveState();

    document.getElementById('wtestBar').style.width = '100%';
    document.getElementById('wtestText').textContent = `終了！${score} / ${total}`;
    showResult(score, total, '単語テスト', () => startWtest());
}

// ============== リスニング作文（単語並べ替え） ==============
function startArrange() {
    if (!currentUnit) return;
    const sents = currentUnit.sentences;
    const all = [...sents].sort(() => Math.random() - 0.5);
    arr = {
        questions: all.map(s => ({
            ...s,
            words: s.en.replace(/\?/g,' ?').replace(/\./g,' .').replace(/,/g,' ,').split(/\s+/).filter(Boolean)
        })),
        idx: 0,
        score: 0,
        answer: [],
        pool: []
    };
    renderArrangeQuestion();
}

function restartArrange() {
    stopSpeak();
    startArrange();
}

function renderArrangeQuestion() {
    const q = arr.questions[arr.idx];
    const total = arr.questions.length;
    document.getElementById('arrBar').style.width = (arr.idx / total * 100) + '%';
    document.getElementById('arrText').textContent = `問題 ${arr.idx+1} / ${total}`;

    // ダミー単語2個追加してシャッフル
    const dummyPool = [];
    currentUnit.vocab.forEach(v => dummyPool.push(v.en));
    UNITS.forEach(u => u.vocab.forEach(v => dummyPool.push(v.en)));
    const usedLower = q.words.map(w => w.toLowerCase());
    const dummies = [...new Set(dummyPool)]
        .filter(w => !usedLower.includes(w.toLowerCase()) && /^[a-zA-Z']+$/.test(w))
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    arr.pool = [...q.words, ...dummies].sort(() => Math.random() - 0.5);
    arr.answer = [];

    const area = document.getElementById('arrangeArea');
    area.innerHTML = `
        <div class="arrange-area">
            <div class="arrange-audio">
                <button class="arrange-play-big" id="arrPlayBig" aria-label="再生">🔊</button>
                <div class="arrange-hint">タップして英文を聞こう</div>
                <button class="arrange-slow" onclick="playArrSlow()">🐢 ゆっくり再生</button>
            </div>
            <div class="arrange-answer empty" id="arrAnswer"></div>
            <div class="word-pool" id="arrPool"></div>
            <div class="arrange-actions">
                <button class="btn btn-ghost btn-sm" onclick="clearArrAnswer()">↻ クリア</button>
                <button class="btn btn-primary" id="arrCheckBtn" onclick="checkArrange()" disabled>こたえあわせ</button>
            </div>
            <div id="arrFeedback"></div>
        </div>
    `;
    document.getElementById('arrPlayBig').onclick = () => speakLine(q.en, document.getElementById('arrPlayBig'));
    renderArrPool();
    // 自動再生
    setTimeout(() => speakLine(q.en, document.getElementById('arrPlayBig')), 300);
}

function renderArrPool() {
    const pool = document.getElementById('arrPool');
    const ans = document.getElementById('arrAnswer');
    pool.innerHTML = '';
    arr.pool.forEach((w, i) => {
        const used = arr.answer.includes(i);
        const c = document.createElement('button');
        c.className = 'word-chip' + (used ? ' used' : '');
        c.textContent = w;
        c.onclick = () => addWord(i);
        pool.appendChild(c);
    });
    ans.innerHTML = '';
    if (arr.answer.length === 0) {
        ans.classList.add('empty');
    } else {
        ans.classList.remove('empty');
        arr.answer.forEach((idx, pos) => {
            const c = document.createElement('button');
            c.className = 'word-chip in-answer';
            c.textContent = arr.pool[idx];
            c.onclick = () => removeWord(pos);
            ans.appendChild(c);
        });
    }
    document.getElementById('arrCheckBtn').disabled = arr.answer.length === 0;
}

function playArrSlow() {
    if (!arr.questions[arr.idx]) return;
    speakLine(arr.questions[arr.idx].en, document.getElementById('arrPlayBig'), 0.65);
}

function addWord(poolIdx) {
    if (arr.answer.includes(poolIdx)) return;
    arr.answer.push(poolIdx);
    renderArrPool();
}

function removeWord(answerPos) {
    arr.answer.splice(answerPos, 1);
    renderArrPool();
}

function clearArrAnswer() {
    arr.answer = [];
    renderArrPool();
}

function checkArrange() {
    const q = arr.questions[arr.idx];
    const userWords = arr.answer.map(i => arr.pool[i]);
    const userSent = userWords.join(' ').replace(/\s+([.?,!])/g, '$1').trim();
    const correctSent = q.words.join(' ').replace(/\s+([.?,!])/g, '$1').trim();
    const ok = userSent.toLowerCase() === correctSent.toLowerCase();
    const ans = document.getElementById('arrAnswer');
    const fb = document.getElementById('arrFeedback');
    if (ok) {
        ans.classList.add('correct');
        arr.score += 1;
        fb.innerHTML = `
            <div class="wtest-feedback ok">⭕ 正解！</div>
            <div class="arrange-translation">${escapeHtml(q.ja)}</div>
        `;
        speakLine(q.en, null);
    } else {
        ans.classList.add('wrong');
        fb.innerHTML = `
            <div class="wtest-feedback ng">❌ おしい！正しい答え：</div>
            <div class="arrange-correct">${escapeHtml(q.en)}</div>
            <div class="arrange-translation">${escapeHtml(q.ja)}</div>
        `;
        speakLine(q.en, null);
    }
    document.getElementById('arrCheckBtn').disabled = true;
    document.querySelectorAll('#arrPool .word-chip').forEach(c => c.disabled = true);

    setTimeout(() => {
        arr.idx += 1;
        if (arr.idx >= arr.questions.length) {
            finishArrange();
        } else {
            renderArrangeQuestion();
        }
    }, 2200);
}

function finishArrange() {
    const total = arr.questions.length;
    const score = arr.score;
    const p = state.unitProgress[currentUnit.id];
    const before = p.arrBest || 0;
    if (score > before) p.arrBest = score;
    addStars(score);
    if (score === total) state.perfectCount += 1;
    checkUnitDone();
    saveState();

    document.getElementById('arrBar').style.width = '100%';
    document.getElementById('arrText').textContent = `終了！${score} / ${total}`;
    showResult(score, total, 'リスニング作文', () => startArrange());
}

function checkUnitDone() {
    const p = state.unitProgress[currentUnit.id];
    const vMax = currentUnit.vocab.length;
    const aMax = currentUnit.sentences.length;
    if ((p.vocabBest >= Math.floor(vMax * 0.8)) && (p.arrBest >= Math.floor(aMax * 0.8))) {
        state.unitDone[currentUnit.id] = true;
    }
}

// ============== 結果モーダル ==============
let _retryFn = null;

function showResult(score, total, title, retryFn) {
    _retryFn = retryFn;
    const ratio = score / total;
    let emoji = '🎉', stars = '⭐⭐⭐', msg = '完璧！すごい！';
    if (ratio === 1)        { emoji='🏆'; stars='⭐⭐⭐'; msg='完璧！100点満点！'; }
    else if (ratio >= 0.8) { emoji='🌟'; stars='⭐⭐'; msg='よくできました！もう少しでパーフェクト！'; }
    else if (ratio >= 0.5) { emoji='👍'; stars='⭐'; msg='いい感じ！くり返して覚えよう！'; }
    else                   { emoji='💪'; stars='☆'; msg='少しずつでOK！もう一度チャレンジ！'; }
    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultTitle').textContent = `${title} 終了！`;
    document.getElementById('resultScore').textContent = `${score} / ${total}`;
    document.getElementById('resultStars').textContent = stars;
    document.getElementById('resultMsg').textContent = msg + ` （+${score}⭐ ゲット！）`;
    document.getElementById('resultModal').classList.add('active');
}

function closeResult() {
    document.getElementById('resultModal').classList.remove('active');
    renderUnitProgress();
}

function closeResultBg(e) {
    if (e.target.id === 'resultModal') closeResult();
}

function retryAfterResult() {
    closeResult();
    if (_retryFn) _retryFn();
}

// ============== 設定モーダル ==============
function openSettings() {
    document.getElementById('nickInput').value = state.nick || '';
    populateVoices();
    document.getElementById('settingsModal').classList.add('active');
}

function saveSettings() {
    state.nick = document.getElementById('nickInput').value.trim();
    state.voiceURI = document.getElementById('voiceSelect').value;
    chosenVoice = voices.find(v => v.voiceURI === state.voiceURI) || pickDefaultVoice();
    saveState();
    document.getElementById('settingsModal').classList.remove('active');
    renderHome();
}

function closeSettingsBg(e) {
    if (e.target.id === 'settingsModal') document.getElementById('settingsModal').classList.remove('active');
}

function resetAll() {
    if (!confirm('本当に学習データをすべてリセットしますか？')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    renderHome();
    document.getElementById('settingsModal').classList.remove('active');
}

// ============== 音声合成 ==============
function loadVoices() {
    voices = (window.speechSynthesis ? window.speechSynthesis.getVoices() : []) || [];
    if (state.voiceURI) {
        chosenVoice = voices.find(v => v.voiceURI === state.voiceURI) || pickDefaultVoice();
    } else {
        chosenVoice = pickDefaultVoice();
    }
    populateVoices();
}

function pickDefaultVoice() {
    if (!voices.length) return null;
    // 英語で女性らしい声を優先
    const enVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
    if (enVoices.length === 0) return voices[0];
    const preferred = enVoices.find(v => /female|samantha|karen|moira|allison|kate|serena|fiona|emma/i.test(v.name));
    return preferred || enVoices[0];
}

function populateVoices() {
    const sel = document.getElementById('voiceSelect');
    if (!sel) return;
    sel.innerHTML = '';
    const enVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
    if (enVoices.length === 0) {
        sel.innerHTML = '<option>(英語の音声が利用できません)</option>';
        return;
    }
    enVoices.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.voiceURI;
        opt.textContent = `${v.name} (${v.lang})`;
        if (chosenVoice && v.voiceURI === chosenVoice.voiceURI) opt.selected = true;
        sel.appendChild(opt);
    });
}

function speak(text, onend) {
    if (!('speechSynthesis' in window)) {
        alert('お使いのブラウザは音声合成に対応していません。');
        if (onend) onend();
        return;
    }
    try { window.speechSynthesis.cancel(); } catch(e){}
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = speakRate;
    u.pitch = 1.0;
    if (chosenVoice) u.voice = chosenVoice;
    u.onend = () => { if (onend) onend(); };
    u.onerror = () => { if (onend) onend(); };
    window.speechSynthesis.speak(u);
}

let _playingBtn = null;
function speakLine(text, btn, rateOverride) {
    if (_playingBtn) _playingBtn.classList.remove('playing');
    if (btn) {
        btn.classList.add('playing');
        _playingBtn = btn;
    }
    const oldRate = speakRate;
    if (rateOverride) speakRate = rateOverride;
    speak(text, () => {
        if (btn) btn.classList.remove('playing');
        _playingBtn = null;
        speakRate = oldRate;
    });
}

function stopSpeak() {
    if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch(e){}
    }
    if (_playingBtn) {
        _playingBtn.classList.remove('playing');
        _playingBtn = null;
    }
}

// ============== ユーティリティ ==============
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
}

// ============== 初期化 ==============
window.addEventListener('DOMContentLoaded', () => {
    if ('speechSynthesis' in window) {
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }
    renderHome();
});

// ページ離脱時に音声停止
window.addEventListener('beforeunload', stopSpeak);
window.addEventListener('pagehide', stopSpeak);
