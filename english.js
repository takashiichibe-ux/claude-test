// =====================================================
// English Learning App - 中学生向け（英検5〜3級）
// =====================================================

// ---------- Topic & Conversation data ----------
const TOPICS = [
  {
    id: 'school', icon: '🏫', name: '学校生活', desc: '学校・授業・部活のこと',
    interview: [
      { key: 'grade', q: '今、何年生ですか？', options: [
        { ja: '中学1年生', en: 'in the seventh grade' },
        { ja: '中学2年生', en: 'in the eighth grade' },
        { ja: '中学3年生', en: 'in the ninth grade' }
      ]},
      { key: 'subject', q: '一番好きな教科は？', options: [
        { ja: '英語', en: 'English' }, { ja: '数学', en: 'math' },
        { ja: '理科', en: 'science' }, { ja: '社会', en: 'social studies' },
        { ja: '国語', en: 'Japanese' }, { ja: '体育', en: 'P.E.' },
        { ja: '音楽', en: 'music' }, { ja: '美術', en: 'art' }
      ]},
      { key: 'club', q: '入っている部活は？', options: [
        { ja: 'サッカー部', en: 'the soccer club' },
        { ja: 'バスケ部', en: 'the basketball club' },
        { ja: '野球部', en: 'the baseball club' },
        { ja: '吹奏楽部', en: 'the brass band club' },
        { ja: '美術部', en: 'the art club' },
        { ja: '帰宅部', en: 'no club' }
      ]}
    ]
  },
  {
    id: 'family', icon: '👨‍👩‍👧', name: '家族', desc: '家族構成・両親・兄弟のこと',
    interview: [
      { key: 'size', q: '何人家族ですか？', options: [
        { ja: '3人', en: 'three' }, { ja: '4人', en: 'four' },
        { ja: '5人', en: 'five' }, { ja: '6人以上', en: 'six' }
      ]},
      { key: 'sibling', q: '兄弟はいますか？', options: [
        { ja: '兄がいる', en: 'an older brother' },
        { ja: '姉がいる', en: 'an older sister' },
        { ja: '弟がいる', en: 'a younger brother' },
        { ja: '妹がいる', en: 'a younger sister' },
        { ja: '一人っ子', en: 'no siblings' }
      ]},
      { key: 'pet', q: 'ペットを飼っていますか？', options: [
        { ja: '犬', en: 'a dog' }, { ja: '猫', en: 'a cat' },
        { ja: '魚', en: 'fish' }, { ja: '飼っていない', en: 'no pets' }
      ]}
    ]
  },
  {
    id: 'hobby', icon: '🎨', name: '趣味', desc: '好きなこと・最近ハマってること',
    interview: [
      { key: 'hobby', q: '休みの日に何をするのが好き？', options: [
        { ja: 'ゲームをする', en: 'playing video games' },
        { ja: '本を読む', en: 'reading books' },
        { ja: 'マンガを読む', en: 'reading comics' },
        { ja: '絵を描く', en: 'drawing pictures' },
        { ja: '動画を見る', en: 'watching videos' },
        { ja: '音楽を聞く', en: 'listening to music' }
      ]},
      { key: 'when', q: 'いつそれをしますか？', options: [
        { ja: '毎日', en: 'every day' },
        { ja: '週末', en: 'on weekends' },
        { ja: '放課後', en: 'after school' }
      ]},
      { key: 'with', q: '誰とすることが多い？', options: [
        { ja: '一人で', en: 'alone' },
        { ja: '友達と', en: 'with my friends' },
        { ja: '家族と', en: 'with my family' }
      ]}
    ]
  },
  {
    id: 'sports', icon: '⚽', name: 'スポーツ', desc: '好きなスポーツ・運動',
    interview: [
      { key: 'sport', q: '一番好きなスポーツは？', options: [
        { ja: 'サッカー', en: 'soccer' }, { ja: '野球', en: 'baseball' },
        { ja: 'バスケットボール', en: 'basketball' }, { ja: 'テニス', en: 'tennis' },
        { ja: '水泳', en: 'swimming' }, { ja: 'バドミントン', en: 'badminton' }
      ]},
      { key: 'play', q: 'する派？見る派？', options: [
        { ja: 'する', en: 'play' },
        { ja: '見る', en: 'watch' },
        { ja: '両方', en: 'both play and watch' }
      ]},
      { key: 'when', q: 'どのくらいやりますか？', options: [
        { ja: '毎日', en: 'every day' },
        { ja: '週に2〜3回', en: 'two or three times a week' },
        { ja: '週末だけ', en: 'only on weekends' }
      ]}
    ]
  },
  {
    id: 'food', icon: '🍱', name: '食べ物', desc: '好きな食べ物・料理',
    interview: [
      { key: 'food', q: '一番好きな食べ物は？', options: [
        { ja: 'カレー', en: 'curry and rice' },
        { ja: 'ラーメン', en: 'ramen' },
        { ja: 'すし', en: 'sushi' },
        { ja: 'ハンバーガー', en: 'hamburgers' },
        { ja: 'ピザ', en: 'pizza' },
        { ja: 'パスタ', en: 'pasta' }
      ]},
      { key: 'fruit', q: '好きな果物は？', options: [
        { ja: 'りんご', en: 'apples' }, { ja: 'バナナ', en: 'bananas' },
        { ja: 'いちご', en: 'strawberries' }, { ja: 'みかん', en: 'oranges' },
        { ja: 'ぶどう', en: 'grapes' }
      ]},
      { key: 'cook', q: '料理しますか？', options: [
        { ja: 'よくする', en: 'often' },
        { ja: 'たまにする', en: 'sometimes' },
        { ja: 'しない', en: 'never' }
      ]}
    ]
  },
  {
    id: 'friends', icon: '👫', name: '友達', desc: '友達と過ごす時間',
    interview: [
      { key: 'count', q: '仲のいい友達は何人くらい？', options: [
        { ja: '1〜2人', en: 'one or two' },
        { ja: '3〜5人', en: 'three to five' },
        { ja: 'たくさん', en: 'a lot of' }
      ]},
      { key: 'do', q: '友達と何をする？', options: [
        { ja: '話をする', en: 'talk' },
        { ja: 'ゲームをする', en: 'play video games' },
        { ja: 'スポーツをする', en: 'play sports' },
        { ja: '買い物に行く', en: 'go shopping' },
        { ja: '勉強する', en: 'study together' }
      ]},
      { key: 'where', q: 'どこで会う？', options: [
        { ja: '学校で', en: 'at school' },
        { ja: '公園で', en: 'at the park' },
        { ja: '家で', en: 'at home' },
        { ja: 'ショッピングモールで', en: 'at the mall' }
      ]}
    ]
  },
  {
    id: 'travel', icon: '✈️', name: '旅行', desc: '行ってみたい場所',
    interview: [
      { key: 'place', q: '行ってみたい国は？', options: [
        { ja: 'アメリカ', en: 'America' }, { ja: 'イギリス', en: 'the UK' },
        { ja: 'オーストラリア', en: 'Australia' }, { ja: 'カナダ', en: 'Canada' },
        { ja: 'ハワイ', en: 'Hawaii' }, { ja: '韓国', en: 'Korea' }
      ]},
      { key: 'see', q: 'そこで何を見たい？', options: [
        { ja: '有名な場所', en: 'famous places' },
        { ja: '美しい自然', en: 'beautiful nature' },
        { ja: 'おいしい食べ物', en: 'delicious food' },
        { ja: 'テーマパーク', en: 'theme parks' }
      ]},
      { key: 'who', q: '誰と行きたい？', options: [
        { ja: '家族', en: 'my family' },
        { ja: '友達', en: 'my friends' },
        { ja: '一人', en: 'alone' }
      ]}
    ]
  },
  {
    id: 'dream', icon: '🌟', name: '夢・将来', desc: '将来の目標・なりたいもの',
    interview: [
      { key: 'job', q: '将来なりたい職業は？', options: [
        { ja: '医者', en: 'a doctor' }, { ja: '先生', en: 'a teacher' },
        { ja: 'エンジニア', en: 'an engineer' }, { ja: 'スポーツ選手', en: 'a professional athlete' },
        { ja: 'ユーチューバー', en: 'a YouTuber' }, { ja: 'アーティスト', en: 'an artist' },
        { ja: '科学者', en: 'a scientist' }, { ja: '会社員', en: 'an office worker' }
      ]},
      { key: 'why', q: 'なぜそれになりたい？', options: [
        { ja: '人を助けたいから', en: 'I want to help people' },
        { ja: 'おもしろそうだから', en: 'it looks fun' },
        { ja: 'お金を稼ぎたいから', en: 'I want to earn money' },
        { ja: '夢だから', en: "it's my dream" }
      ]},
      { key: 'effort', q: '今、何をがんばってる？', options: [
        { ja: '勉強', en: 'studying' },
        { ja: 'スポーツ', en: 'sports' },
        { ja: '英語', en: 'English' },
        { ja: '特にない', en: 'nothing special' }
      ]}
    ]
  }
];

// ---------- Conversations & Vocab per topic + level ----------
// Templates use {{key}} placeholders that get replaced from interview answers (en) or {{keyJa}} (ja).
const CONVERSATIONS = {
  school: {
    '5': {
      conv: [
        { sp:'A', en:'Hi! What grade are you in?', ja:'こんにちは！何年生ですか？' },
        { sp:'B', en:"I'm {{grade}}.", ja:"私は{{gradeJa}}です。" },
        { sp:'A', en:'What subject do you like?', ja:'好きな教科は何ですか？' },
        { sp:'B', en:'I like {{subject}}. It is fun.', ja:'{{subjectJa}}が好きです。楽しいです。' },
        { sp:'A', en:'Are you in any club?', ja:'部活には入っていますか？' },
        { sp:'B', en:"Yes, I'm in {{club}}.", ja:'はい、{{clubJa}}に入っています。' }
      ],
      vocab: [
        { w:'grade', p:'名', m:'学年', ex:"I'm in the seventh grade.", exJa:'私は中学1年生です。' },
        { w:'subject', p:'名', m:'教科', ex:'My favorite subject is math.', exJa:'好きな教科は数学です。' },
        { w:'club', p:'名', m:'部活、クラブ', ex:'I am in the soccer club.', exJa:'サッカー部に入っています。' },
        { w:'fun', p:'形', m:'楽しい', ex:'English is fun.', exJa:'英語は楽しいです。' },
        { w:'like', p:'動', m:'〜が好き', ex:'I like science.', exJa:'理科が好きです。' }
      ]
    },
    '4': {
      conv: [
        { sp:'A', en:'Which school do you go to?', ja:'どこの学校に通っていますか？' },
        { sp:'B', en:"I go to a junior high school in my town. I'm {{grade}}.", ja:'町の中学校に通っています。{{gradeJa}}です。' },
        { sp:'A', en:'What did you study yesterday?', ja:'昨日は何を勉強しましたか？' },
        { sp:'B', en:'I studied {{subject}} for two hours.', ja:'{{subjectJa}}を2時間勉強しました。' },
        { sp:'A', en:'Are you doing any club activities?', ja:'部活はやっていますか？' },
        { sp:'B', en:"Yes, I'm practicing every day in {{club}}.", ja:'はい、{{clubJa}}で毎日練習しています。' }
      ],
      vocab: [
        { w:'study', p:'動', m:'勉強する', ex:'I studied English yesterday.', exJa:'昨日英語を勉強しました。' },
        { w:'practice', p:'動', m:'練習する', ex:'We practice after school.', exJa:'放課後に練習します。' },
        { w:'club activities', p:'熟', m:'部活動', ex:'I enjoy club activities.', exJa:'部活動を楽しんでいます。' },
        { w:'every day', p:'熟', m:'毎日', ex:'I read books every day.', exJa:'毎日本を読みます。' },
        { w:'junior high school', p:'名', m:'中学校', ex:'I go to junior high school.', exJa:'中学校に通っています。' }
      ]
    },
    '3': {
      conv: [
        { sp:'A', en:'How long have you been in this school?', ja:'この学校に入って何年経ちますか？' },
        { sp:'B', en:"I've been here since last year. I'm {{grade}} now.", ja:'去年からです。今は{{gradeJa}}です。' },
        { sp:'A', en:'What subject are you most interested in?', ja:'一番興味のある教科は？' },
        { sp:'B', en:"I'm really interested in {{subject}}, because it is taught in a fun way.", ja:'{{subjectJa}}にとても興味があります。授業が楽しいんです。' },
        { sp:'A', en:'Tell me about your club. What do you do there?', ja:'部活について教えて。何をしていますか？' },
        { sp:'B', en:'In {{club}}, we practice hard so that we can win the next tournament.', ja:'{{clubJa}}では、次の大会で勝てるよう一生懸命練習しています。' }
      ],
      vocab: [
        { w:'be interested in', p:'熟', m:'〜に興味がある', ex:"I'm interested in science.", exJa:'理科に興味があります。' },
        { w:'be taught', p:'熟', m:'教えられる(受動態)', ex:'English is taught here.', exJa:'ここでは英語が教えられます。' },
        { w:'so that', p:'接', m:'〜できるように', ex:'I study so that I can pass.', exJa:'合格できるよう勉強します。' },
        { w:'tournament', p:'名', m:'大会', ex:'We won the tournament.', exJa:'大会で優勝しました。' },
        { w:'have been', p:'動', m:'(現在完了)ずっと〜', ex:"I've been here for a year.", exJa:'1年間ここにいます。' }
      ]
    }
  },

  family: {
    '5': {
      conv: [
        { sp:'A', en:'How many people are in your family?', ja:'何人家族ですか？' },
        { sp:'B', en:"There are {{size}} people in my family.", ja:'{{sizeJa}}家族です。' },
        { sp:'A', en:'Do you have any brothers or sisters?', ja:'兄弟はいますか？' },
        { sp:'B', en:"I have {{sibling}}.", ja:'{{siblingJa}}。' },
        { sp:'A', en:'Do you have a pet?', ja:'ペットは飼っていますか？' },
        { sp:'B', en:'Yes, I have {{pet}}.', ja:'はい、{{petJa}}を飼っています。' }
      ],
      vocab: [
        { w:'family', p:'名', m:'家族', ex:'I love my family.', exJa:'家族が大好きです。' },
        { w:'brother', p:'名', m:'兄、弟', ex:'I have one brother.', exJa:'兄(弟)が一人います。' },
        { w:'sister', p:'名', m:'姉、妹', ex:'My sister is kind.', exJa:'姉(妹)はやさしいです。' },
        { w:'pet', p:'名', m:'ペット', ex:'My pet is a cat.', exJa:'うちのペットは猫です。' },
        { w:'people', p:'名', m:'人々', ex:'There are five people.', exJa:'5人います。' }
      ]
    },
    '4': {
      conv: [
        { sp:'A', en:'Tell me about your family.', ja:'家族について教えて。' },
        { sp:'B', en:"My family has {{size}} members. I have {{sibling}}.", ja:'{{sizeJa}}家族です。{{siblingJa}}。' },
        { sp:'A', en:'What did you do with your family last weekend?', ja:'先週末、家族と何をした？' },
        { sp:'B', en:'We went out for dinner. It was a lot of fun.', ja:'外食しました。とても楽しかったです。' },
        { sp:'A', en:'Are you going to do something with them this weekend?', ja:'今週末も何かする予定？' },
        { sp:'B', en:"Yes, we're going to take {{pet}} for a walk.", ja:'はい、{{petJa}}と散歩に行く予定です。' }
      ],
      vocab: [
        { w:'member', p:'名', m:'メンバー、家族の一員', ex:'There are four members.', exJa:'4人のメンバーがいます。' },
        { w:'go out', p:'熟', m:'外出する', ex:'We went out yesterday.', exJa:'昨日外出しました。' },
        { w:'be going to', p:'熟', m:'〜する予定だ', ex:"I'm going to study.", exJa:'勉強する予定です。' },
        { w:'take a walk', p:'熟', m:'散歩する', ex:'I take a walk every day.', exJa:'毎日散歩します。' },
        { w:'a lot of', p:'熟', m:'たくさんの', ex:'I have a lot of books.', exJa:'本がたくさんあります。' }
      ]
    },
    '3': {
      conv: [
        { sp:'A', en:'How would you describe your family?', ja:'あなたの家族はどんな家族？' },
        { sp:'B', en:"My family has {{size}} people, and we've always been close.", ja:'{{sizeJa}}家族で、ずっと仲良しです。' },
        { sp:'A', en:'Do you have any siblings? Get along well?', ja:'兄弟はいる？仲はいい？' },
        { sp:'B', en:'I have {{sibling}}, who is two years apart from me. We sometimes argue, but we get along well.', ja:'{{siblingJa}}で、私とは2歳差です。たまにケンカしますが、仲良しです。' },
        { sp:'A', en:'Do you have any pets you can tell me about?', ja:'飼っているペットがいたら教えて。' },
        { sp:'B', en:"We have {{pet}} that has been with us for years. It has become a part of our family.", ja:'{{petJa}}を何年も飼っていて、もう家族の一員です。' }
      ],
      vocab: [
        { w:'describe', p:'動', m:'説明する', ex:'Describe your hometown.', exJa:'故郷を説明してください。' },
        { w:'close', p:'形', m:'親しい、近い', ex:'We are close friends.', exJa:'私たちは親友です。' },
        { w:'get along', p:'熟', m:'仲良くする', ex:'They get along well.', exJa:'彼らは仲良しです。' },
        { w:'apart', p:'副', m:'離れて', ex:'We are two years apart.', exJa:'2歳差です。' },
        { w:'become', p:'動', m:'〜になる', ex:'He became a doctor.', exJa:'彼は医者になりました。' }
      ]
    }
  },

  hobby: {
    '5': {
      conv: [
        { sp:'A', en:'What do you like to do in your free time?', ja:'ひまな時、何をするのが好き？' },
        { sp:'B', en:'I like {{hobby}}.', ja:'{{hobbyJa}}が好きです。' },
        { sp:'A', en:'When do you do it?', ja:'いつしますか？' },
        { sp:'B', en:'I do it {{when}}.', ja:'{{whenJa}}にやります。' },
        { sp:'A', en:'Who do you do it with?', ja:'誰とやりますか？' },
        { sp:'B', en:'I do it {{with}}.', ja:'{{withJa}}やります。' }
      ],
      vocab: [
        { w:'free time', p:'熟', m:'ひまな時間', ex:'I read in my free time.', exJa:'ひまな時間に読書します。' },
        { w:'hobby', p:'名', m:'趣味', ex:'My hobby is reading.', exJa:'私の趣味は読書です。' },
        { w:'do', p:'動', m:'する', ex:'I do my homework.', exJa:'宿題をします。' },
        { w:'when', p:'疑', m:'いつ', ex:'When do you study?', exJa:'いつ勉強しますか？' },
        { w:'with', p:'前', m:'〜と一緒に', ex:'I play with my friend.', exJa:'友達と遊びます。' }
      ]
    },
    '4': {
      conv: [
        { sp:'A', en:'What were you doing last night?', ja:'昨日の夜は何していたの？' },
        { sp:'B', en:'I was {{hobby}}. I really enjoyed it.', ja:'{{hobbyJa}}をしていました。とても楽しかったです。' },
        { sp:'A', en:'Do you do it often?', ja:'よくやるの？' },
        { sp:'B', en:'Yes, I do it {{when}}.', ja:'はい、{{whenJa}}やります。' },
        { sp:'A', en:'Will you keep doing it?', ja:'これからも続ける？' },
        { sp:'B', en:"Yes, I'll keep doing it because I love it.", ja:'はい、大好きなので続けます。' }
      ],
      vocab: [
        { w:'enjoy', p:'動', m:'楽しむ', ex:'I enjoyed the movie.', exJa:'映画を楽しみました。' },
        { w:'often', p:'副', m:'よく、しばしば', ex:'I often play tennis.', exJa:'よくテニスをします。' },
        { w:'will', p:'助', m:'〜するつもり', ex:'I will study tonight.', exJa:'今夜勉強します。' },
        { w:'keep', p:'動', m:'続ける', ex:'Keep practicing.', exJa:'練習を続けて。' },
        { w:'because', p:'接', m:'〜なので', ex:"I'm happy because it's sunny.", exJa:'晴れているのでうれしいです。' }
      ]
    },
    '3': {
      conv: [
        { sp:'A', en:'What is the hobby you have been into recently?', ja:'最近ハマっている趣味は？' },
        { sp:'B', en:"I've been into {{hobby}} for the last few months.", ja:'ここ数か月、{{hobbyJa}}にハマっています。' },
        { sp:'A', en:"How often do you do it, and who do you usually do it with?", ja:'どれくらいの頻度で、誰とやりますか？' },
        { sp:'B', en:'I do it {{when}}, mostly {{with}}.', ja:'{{whenJa}}にやって、たいてい{{withJa}}やります。' },
        { sp:'A', en:'What do you find interesting about it?', ja:'どんなところが面白い？' },
        { sp:'B', en:"It's something I can keep improving at, and that makes me feel good.", ja:'続けることでどんどん上達できるところが楽しいです。' }
      ],
      vocab: [
        { w:'be into', p:'熟', m:'〜にハマっている', ex:"I'm into anime now.", exJa:'今アニメにハマっています。' },
        { w:'recently', p:'副', m:'最近', ex:'I started recently.', exJa:'最近始めました。' },
        { w:'how often', p:'熟', m:'どのくらい頻繁に', ex:'How often do you read?', exJa:'どのくらい読書しますか？' },
        { w:'improve', p:'動', m:'上達する', ex:'My English is improving.', exJa:'英語が上達しています。' },
        { w:'mostly', p:'副', m:'たいてい', ex:'I mostly stay home.', exJa:'たいてい家にいます。' }
      ]
    }
  },

  sports: {
    '5': {
      conv: [
        { sp:'A', en:'Do you play sports?', ja:'スポーツはしますか？' },
        { sp:'B', en:'Yes, I {{play}} {{sport}}.', ja:'はい、{{sportJa}}を{{playJa}}。' },
        { sp:'A', en:'Is it fun?', ja:'楽しいですか？' },
        { sp:'B', en:"Yes, it's a lot of fun.", ja:'はい、とても楽しいです。' },
        { sp:'A', en:'How often do you play?', ja:'どのくらいしますか？' },
        { sp:'B', en:'I play {{when}}.', ja:'{{whenJa}}します。' }
      ],
      vocab: [
        { w:'play', p:'動', m:'(球技などを)する', ex:'I play soccer.', exJa:'サッカーをします。' },
        { w:'sport', p:'名', m:'スポーツ', ex:'My favorite sport is tennis.', exJa:'好きなスポーツはテニスです。' },
        { w:'fun', p:'形/名', m:'楽しい', ex:'Soccer is fun.', exJa:'サッカーは楽しいです。' },
        { w:'often', p:'副', m:'よく、しばしば', ex:'I often swim.', exJa:'よく泳ぎます。' },
        { w:'every day', p:'熟', m:'毎日', ex:'I run every day.', exJa:'毎日走ります。' }
      ]
    },
    '4': {
      conv: [
        { sp:'A', en:'Did you play any sports yesterday?', ja:'昨日スポーツしましたか？' },
        { sp:'B', en:'Yes, I played {{sport}} after school. It was tiring but fun.', ja:'はい、放課後{{sportJa}}をしました。疲れたけど楽しかったです。' },
        { sp:'A', en:'Can you play it well?', ja:'上手にできますか？' },
        { sp:'B', en:"I can play {{sport}} pretty well, but I want to be better.", ja:'{{sportJa}}はそこそこできますが、もっと上手くなりたいです。' },
        { sp:'A', en:'How often will you practice?', ja:'これからどのくらい練習する予定？' },
        { sp:'B', en:"I'll practice {{when}}.", ja:'{{whenJa}}練習する予定です。' }
      ],
      vocab: [
        { w:'tiring', p:'形', m:'疲れる', ex:'Soccer is tiring.', exJa:'サッカーは疲れます。' },
        { w:'pretty', p:'副', m:'かなり、まあまあ', ex:"It's pretty good.", exJa:'なかなかいいです。' },
        { w:'better', p:'形', m:'もっと良い', ex:'I want to be better.', exJa:'もっと上手くなりたい。' },
        { w:'after school', p:'熟', m:'放課後', ex:'I play after school.', exJa:'放課後にします。' },
        { w:'practice', p:'動', m:'練習する', ex:'I practice every day.', exJa:'毎日練習します。' }
      ]
    },
    '3': {
      conv: [
        { sp:'A', en:'How long have you been playing your favorite sport?', ja:'好きなスポーツはどれくらいやってますか？' },
        { sp:'B', en:"I've been {{play}}ing {{sport}} for several years now.", ja:'{{sportJa}}をもう数年{{playJa}}います。' },
        { sp:'A', en:'What got you into it?', ja:'始めたきっかけは？' },
        { sp:'B', en:'My friend invited me, and I got hooked right away.', ja:'友達に誘われて、すぐにハマりました。' },
        { sp:'A', en:"What's your goal in the sport?", ja:'目標は何ですか？' },
        { sp:'B', en:'I hope to become good enough to play in big tournaments someday.', ja:'いつか大会に出られるくらい上手くなりたいです。' }
      ],
      vocab: [
        { w:'have been -ing', p:'文', m:'(現在完了進行形)ずっと〜している', ex:"I've been studying for an hour.", exJa:'1時間ずっと勉強しています。' },
        { w:'invite', p:'動', m:'招待する、誘う', ex:'She invited me.', exJa:'彼女が誘ってくれた。' },
        { w:'get hooked', p:'熟', m:'夢中になる', ex:'I got hooked on it.', exJa:'それに夢中になりました。' },
        { w:'goal', p:'名', m:'目標', ex:'My goal is to win.', exJa:'目標は勝つことです。' },
        { w:'someday', p:'副', m:'いつか', ex:'I will travel someday.', exJa:'いつか旅行します。' }
      ]
    }
  },

  food: {
    '5': {
      conv: [
        { sp:'A', en:'What food do you like?', ja:'好きな食べ物は何？' },
        { sp:'B', en:'I like {{food}}.', ja:'{{foodJa}}が好きです。' },
        { sp:'A', en:'What fruit do you like?', ja:'好きな果物は？' },
        { sp:'B', en:'I like {{fruit}}.', ja:'{{fruitJa}}が好きです。' },
        { sp:'A', en:'Do you cook?', ja:'料理しますか？' },
        { sp:'B', en:'Yes, I cook {{cook}}.', ja:'はい、{{cookJa}}します。' }
      ],
      vocab: [
        { w:'food', p:'名', m:'食べ物', ex:'Japanese food is great.', exJa:'日本食はすばらしい。' },
        { w:'fruit', p:'名', m:'果物', ex:'Apples are fruit.', exJa:'りんごは果物です。' },
        { w:'cook', p:'動', m:'料理する', ex:'My mom cooks well.', exJa:'母は料理が上手です。' },
        { w:'breakfast', p:'名', m:'朝食', ex:'I eat breakfast at 7.', exJa:'7時に朝食を食べます。' },
        { w:'delicious', p:'形', m:'おいしい', ex:'This pizza is delicious.', exJa:'このピザはおいしい。' }
      ]
    },
    '4': {
      conv: [
        { sp:'A', en:'What did you have for dinner last night?', ja:'昨日の夜は何を食べた？' },
        { sp:'B', en:'I had {{food}}. It was really good.', ja:'{{foodJa}}を食べました。とてもおいしかった。' },
        { sp:'A', en:'Do you eat fruit every day?', ja:'果物は毎日食べる？' },
        { sp:'B', en:'Yes, I usually eat {{fruit}} for breakfast.', ja:'はい、朝食で{{fruitJa}}をよく食べます。' },
        { sp:'A', en:'Can you cook?', ja:'料理はできますか？' },
        { sp:'B', en:'I can cook {{cook}}. I want to learn more dishes.', ja:'{{cookJa}}します。もっとレパートリーを増やしたいです。' }
      ],
      vocab: [
        { w:'have', p:'動', m:'食べる、飲む', ex:'I have rice for lunch.', exJa:'昼食に米を食べる。' },
        { w:'really', p:'副', m:'本当に', ex:'It was really fun.', exJa:'本当に楽しかった。' },
        { w:'usually', p:'副', m:'たいてい', ex:'I usually eat at 7.', exJa:'たいてい7時に食べます。' },
        { w:'dish', p:'名', m:'料理', ex:'This dish is sweet.', exJa:'この料理は甘い。' },
        { w:'learn', p:'動', m:'学ぶ', ex:'I want to learn cooking.', exJa:'料理を学びたい。' }
      ]
    },
    '3': {
      conv: [
        { sp:'A', en:'What kind of food have you been craving lately?', ja:'最近食べたい食べ物は？' },
        { sp:'B', en:"I've been wanting {{food}} for a few days now.", ja:'ここ数日、{{foodJa}}が食べたいです。' },
        { sp:'A', en:'Are there any fruits you eat regularly?', ja:'よく食べる果物はありますか？' },
        { sp:'B', en:'I eat {{fruit}}, which are full of vitamins.', ja:'{{fruitJa}}を食べます。ビタミンが豊富なんです。' },
        { sp:'A', en:'Have you ever cooked something challenging?', ja:'何か難しい料理に挑戦したことは？' },
        { sp:'B', en:"Yes, I once tried making curry from scratch, and it turned out great.", ja:'カレーを一から作ったことがあって、上手にできました。' }
      ],
      vocab: [
        { w:'crave', p:'動', m:'無性に食べたい', ex:'I crave chocolate.', exJa:'チョコが食べたくて仕方ない。' },
        { w:'lately', p:'副', m:'最近', ex:'It has been hot lately.', exJa:'最近暑いです。' },
        { w:'regularly', p:'副', m:'定期的に', ex:'I exercise regularly.', exJa:'定期的に運動します。' },
        { w:'from scratch', p:'熟', m:'最初から、一から', ex:'I baked it from scratch.', exJa:'一から焼きました。' },
        { w:'turn out', p:'熟', m:'結果〜になる', ex:'It turned out well.', exJa:'うまくいきました。' }
      ]
    }
  },

  friends: {
    '5': {
      conv: [
        { sp:'A', en:'Do you have many friends?', ja:'友達は多い？' },
        { sp:'B', en:'I have {{count}} good friends.', ja:'仲のいい友達は{{countJa}}います。' },
        { sp:'A', en:'What do you do with them?', ja:'友達と何をする？' },
        { sp:'B', en:'We {{do}}.', ja:'{{doJa}}します。' },
        { sp:'A', en:'Where do you meet?', ja:'どこで会う？' },
        { sp:'B', en:'We meet {{where}}.', ja:'{{whereJa}}会います。' }
      ],
      vocab: [
        { w:'friend', p:'名', m:'友達', ex:'He is my friend.', exJa:'彼は私の友達です。' },
        { w:'good', p:'形', m:'よい', ex:'He is a good friend.', exJa:'彼はいい友達です。' },
        { w:'meet', p:'動', m:'会う', ex:'I meet him at school.', exJa:'学校で彼に会います。' },
        { w:'school', p:'名', m:'学校', ex:'I go to school.', exJa:'学校に行きます。' },
        { w:'park', p:'名', m:'公園', ex:'We play at the park.', exJa:'公園で遊びます。' }
      ]
    },
    '4': {
      conv: [
        { sp:'A', en:'Did you hang out with friends yesterday?', ja:'昨日は友達と遊んだ？' },
        { sp:'B', en:'Yes, I met {{count}} of them and we {{do}}.', ja:'はい、{{countJa}}友達と会って、{{doJa}}しました。' },
        { sp:'A', en:'Where did you go?', ja:'どこに行ったの？' },
        { sp:'B', en:'We went to {{where}}, and it was great.', ja:'{{whereJa}}行って、楽しかったです。' },
        { sp:'A', en:'Will you meet them again this weekend?', ja:'今週末も会う？' },
        { sp:'B', en:"Yes, we're going to see a movie.", ja:'はい、映画を見に行く予定です。' }
      ],
      vocab: [
        { w:'hang out', p:'熟', m:'遊ぶ、つるむ', ex:'I hang out with friends.', exJa:'友達と遊びます。' },
        { w:'met', p:'動', m:'meet の過去形', ex:'I met him yesterday.', exJa:'昨日彼に会いました。' },
        { w:'great', p:'形', m:'すばらしい', ex:'The party was great.', exJa:'パーティーは最高でした。' },
        { w:'movie', p:'名', m:'映画', ex:'Let’s see a movie.', exJa:'映画を見ましょう。' },
        { w:'again', p:'副', m:'再び', ex:'See you again.', exJa:'また会いましょう。' }
      ]
    },
    '3': {
      conv: [
        { sp:'A', en:'How long have you known your closest friends?', ja:'一番仲のいい友達とは何年来？' },
        { sp:'B', en:"I've known {{count}} friends since elementary school.", ja:'仲のいい{{countJa}}友達とは小学校からの付き合いです。' },
        { sp:'A', en:'What is something you enjoy doing together?', ja:'一緒にやって楽しいことは？' },
        { sp:'B', en:'We love to {{do}} when we get together.', ja:'集まると{{doJa}}するのが好きです。' },
        { sp:'A', en:'Where is the place you go most often?', ja:'よく行く場所はどこ？' },
        { sp:'B', en:"The place we go most is {{where}}, where we can relax and talk for hours.", ja:'よく行くのは{{whereJa}}で、何時間も話せる場所です。' }
      ],
      vocab: [
        { w:'have known', p:'文', m:'(現在完了)ずっと知っている', ex:"I've known him for years.", exJa:'何年も彼を知っています。' },
        { w:'closest', p:'形', m:'最も親しい', ex:'My closest friend is Emi.', exJa:'一番の親友はえみです。' },
        { w:'elementary school', p:'熟', m:'小学校', ex:'I went to elementary school.', exJa:'小学校に通っていました。' },
        { w:'get together', p:'熟', m:'集まる', ex:'We get together every month.', exJa:'毎月集まります。' },
        { w:'relax', p:'動', m:'リラックスする', ex:'I relax on Sundays.', exJa:'日曜はリラックスします。' }
      ]
    }
  },

  travel: {
    '5': {
      conv: [
        { sp:'A', en:'Where do you want to go?', ja:'どこに行きたい？' },
        { sp:'B', en:'I want to go to {{place}}.', ja:'{{placeJa}}に行きたいです。' },
        { sp:'A', en:'What do you want to see there?', ja:'そこで何を見たい？' },
        { sp:'B', en:'I want to see {{see}}.', ja:'{{seeJa}}を見たいです。' },
        { sp:'A', en:'Who do you want to go with?', ja:'誰と行きたい？' },
        { sp:'B', en:'I want to go with {{who}}.', ja:'{{whoJa}}と行きたいです。' }
      ],
      vocab: [
        { w:'want', p:'動', m:'〜したい', ex:'I want to study.', exJa:'勉強したいです。' },
        { w:'go', p:'動', m:'行く', ex:'I go to school.', exJa:'学校に行きます。' },
        { w:'see', p:'動', m:'見る', ex:'I see a star.', exJa:'星が見えます。' },
        { w:'place', p:'名', m:'場所', ex:'This place is nice.', exJa:'この場所はいいです。' },
        { w:'with', p:'前', m:'〜と一緒に', ex:'I go with my mom.', exJa:'母と一緒に行きます。' }
      ]
    },
    '4': {
      conv: [
        { sp:'A', en:'Have you ever traveled abroad?', ja:'海外旅行に行ったことある？' },
        { sp:'B', en:"Not yet, but I'm going to {{place}} next year.", ja:'まだですが、来年{{placeJa}}に行く予定です。' },
        { sp:'A', en:'What are you most excited about?', ja:'何が一番楽しみ？' },
        { sp:'B', en:"I'm excited to see {{see}}.", ja:'{{seeJa}}を見るのが楽しみです。' },
        { sp:'A', en:'Are you going to travel alone?', ja:'一人で行くの？' },
        { sp:'B', en:"No, I'll travel with {{who}}.", ja:'いいえ、{{whoJa}}と一緒に行きます。' }
      ],
      vocab: [
        { w:'travel', p:'動', m:'旅行する', ex:'I travel every summer.', exJa:'毎夏旅行します。' },
        { w:'abroad', p:'副', m:'海外で(に)', ex:'I want to study abroad.', exJa:'海外留学したい。' },
        { w:'next year', p:'熟', m:'来年', ex:'I will graduate next year.', exJa:'来年卒業します。' },
        { w:'excited', p:'形', m:'わくわくして', ex:"I'm excited!", exJa:'わくわくする！' },
        { w:'alone', p:'副', m:'一人で', ex:'I came alone.', exJa:'一人で来ました。' }
      ]
    },
    '3': {
      conv: [
        { sp:'A', en:'If you could travel anywhere, where would you go?', ja:'どこへでも行けるとしたら、どこへ？' },
        { sp:'B', en:"I'd love to visit {{place}}, which I've always dreamed of seeing.", ja:'ずっと行きたかった{{placeJa}}に行きたいです。' },
        { sp:'A', en:'What is something you would like to experience there?', ja:'そこで体験したいことは？' },
        { sp:'B', en:"I want to experience {{see}}, which I've only seen in pictures.", ja:'写真でしか見たことのない{{seeJa}}を体験したいです。' },
        { sp:'A', en:'Would you go alone or with someone?', ja:'一人で行く？誰かと？' },
        { sp:'B', en:"I'd take {{who}} with me, so we could share the memory.", ja:'{{whoJa}}を連れて行って、思い出を分かち合いたいです。' }
      ],
      vocab: [
        { w:'would', p:'助', m:'(仮定法)〜するだろう', ex:"I'd love to go.", exJa:'行きたいです。' },
        { w:'visit', p:'動', m:'訪れる', ex:'I visited Kyoto.', exJa:'京都を訪れた。' },
        { w:'dream of', p:'熟', m:'〜を夢見る', ex:'I dream of being a pilot.', exJa:'パイロットを夢見る。' },
        { w:'experience', p:'動', m:'体験する', ex:'I experienced new things.', exJa:'新しいことを体験した。' },
        { w:'share', p:'動', m:'共有する', ex:'Let’s share the food.', exJa:'食べ物を分けよう。' }
      ]
    }
  },

  dream: {
    '5': {
      conv: [
        { sp:'A', en:'What do you want to be?', ja:'将来何になりたい？' },
        { sp:'B', en:'I want to be {{job}}.', ja:'{{jobJa}}になりたいです。' },
        { sp:'A', en:'Why?', ja:'なぜ？' },
        { sp:'B', en:'Because {{why}}.', ja:'{{whyJa}}からです。' },
        { sp:'A', en:'What do you do now?', ja:'今、何をしている？' },
        { sp:'B', en:"I'm working hard on {{effort}}.", ja:'{{effortJa}}をがんばっています。' }
      ],
      vocab: [
        { w:'want to be', p:'熟', m:'〜になりたい', ex:'I want to be a doctor.', exJa:'医者になりたい。' },
        { w:'why', p:'疑', m:'なぜ', ex:'Why are you sad?', exJa:'なぜ悲しいの？' },
        { w:'because', p:'接', m:'〜だから', ex:"Because I'm tired.", exJa:'疲れているから。' },
        { w:'work hard', p:'熟', m:'頑張る', ex:'I work hard.', exJa:'頑張ります。' },
        { w:'now', p:'副', m:'今', ex:"I'm busy now.", exJa:'今忙しい。' }
      ]
    },
    '4': {
      conv: [
        { sp:'A', en:'What did you want to be when you were a kid?', ja:'子どもの頃、何になりたかった？' },
        { sp:'B', en:'I wanted to be {{job}} for as long as I can remember.', ja:'物心ついた頃から{{jobJa}}になりたかったです。' },
        { sp:'A', en:'Are you going to keep that goal?', ja:'その目標は変わらない？' },
        { sp:'B', en:"Yes, because {{why}}, so I'm not going to give up.", ja:'はい、{{whyJa}}ので、あきらめません。' },
        { sp:'A', en:'What are you doing for it now?', ja:'今は何をしている？' },
        { sp:'B', en:"I'm focusing on {{effort}} every day.", ja:'毎日{{effortJa}}に集中しています。' }
      ],
      vocab: [
        { w:'kid', p:'名', m:'子ども', ex:'I was a kid then.', exJa:'当時、子どもでした。' },
        { w:'remember', p:'動', m:'覚えている', ex:'I remember you.', exJa:'あなたを覚えています。' },
        { w:'give up', p:'熟', m:'あきらめる', ex:'Don’t give up.', exJa:'あきらめないで。' },
        { w:'focus on', p:'熟', m:'〜に集中する', ex:'Focus on your goal.', exJa:'目標に集中して。' },
        { w:'goal', p:'名', m:'目標', ex:'Set a goal.', exJa:'目標を立てて。' }
      ]
    },
    '3': {
      conv: [
        { sp:'A', en:'Have you decided what you want to do in the future?', ja:'将来、何をしたいかはもう決めた？' },
        { sp:'B', en:"Yes, I've made up my mind to be {{job}}.", ja:'はい、{{jobJa}}になると決心しました。' },
        { sp:'A', en:'What is the reason behind your choice?', ja:'なぜそれを選んだ？' },
        { sp:'B', en:'I chose this because {{why}}, which has always inspired me.', ja:'{{whyJa}}からで、それが私を動かしてきました。' },
        { sp:'A', en:'How are you preparing yourself for it?', ja:'そのためにどう準備している？' },
        { sp:'B', en:"I've been spending most of my time on {{effort}} lately.", ja:'最近は{{effortJa}}に時間をかけています。' }
      ],
      vocab: [
        { w:'decide', p:'動', m:'決める', ex:'I decided to study.', exJa:'勉強することに決めた。' },
        { w:'make up one’s mind', p:'熟', m:'決心する', ex:'I made up my mind.', exJa:'決心しました。' },
        { w:'choose / chose', p:'動', m:'選ぶ／選んだ', ex:'I chose blue.', exJa:'青を選びました。' },
        { w:'inspire', p:'動', m:'やる気にさせる', ex:'She inspired me.', exJa:'彼女に感化されました。' },
        { w:'prepare', p:'動', m:'準備する', ex:'Prepare for the test.', exJa:'テストに備えて。' }
      ]
    }
  }
};

// =====================================================
// NEW HORIZON 教科書データ（中1/中2/中3）
// 中間・期末テスト対策に対応
// =====================================================
const NH_UNITS = {
  '1': [
    {
      id: 'nh1u1', icon: '👋', name: 'Unit 1: 自己紹介',
      desc: 'be動詞 (am/are)・自己紹介',
      grammar: 'I am 〜. / You are 〜. / Are you 〜?',
      conv: [
        { sp:'A', en:'Hello. I am Saki. Nice to meet you.', ja:'こんにちは。私はさきです。はじめまして。' },
        { sp:'B', en:'Hi, Saki. I am Tom. Nice to meet you, too.', ja:'こんにちは、さき。私はトムです。こちらこそはじめまして。' },
        { sp:'A', en:'I am from Japan. Are you from America?', ja:'私は日本出身です。あなたはアメリカ出身ですか？' },
        { sp:'B', en:'Yes, I am. I am from New York.', ja:'はい、そうです。私はニューヨーク出身です。' },
        { sp:'A', en:'I am a junior high school student.', ja:'私は中学生です。' },
        { sp:'B', en:'Me too. I am twelve years old.', ja:'私もです。12歳です。' }
      ],
      vocab: [
        { w:'student', p:'名', m:'生徒、学生', ex:'I am a student.', exJa:'私は生徒です。' },
        { w:'from', p:'前', m:'〜から、〜出身', ex:'I am from Japan.', exJa:'私は日本出身です。' },
        { w:'too', p:'副', m:'〜もまた', ex:'I am happy, too.', exJa:'私もうれしいです。' },
        { w:'meet', p:'動', m:'会う', ex:'Nice to meet you.', exJa:'はじめまして。' },
        { w:'year', p:'名', m:'年', ex:'I am twelve years old.', exJa:'私は12歳です。' }
      ],
      blanks: [
        { q:'I (___) Saki.', a:'am', hint:'主語が I のときの be動詞' },
        { q:'(___) you from America?', a:'Are', hint:'疑問文。文頭は大文字' },
        { q:'I am (___) Japan.', a:'from', hint:'〜出身' },
        { q:'You (___) a student.', a:'are', hint:'主語が You のときの be動詞' }
      ],
      trans: [
        { ja:'私は中学生です。', en:'I am a junior high school student.' },
        { ja:'あなたは東京出身ですか？', en:'Are you from Tokyo?' },
        { ja:'はじめまして。', en:'Nice to meet you.' },
        { ja:'私は12歳です。', en:'I am twelve years old.' }
      ]
    },
    {
      id: 'nh1u2', icon: '⚽', name: 'Unit 2: 一般動詞',
      desc: '一般動詞 (Do you 〜?)・好きなこと',
      grammar: 'I like 〜. / Do you 〜? / I don\'t 〜.',
      conv: [
        { sp:'A', en:'Do you like sports?', ja:'スポーツは好き？' },
        { sp:'B', en:'Yes, I do. I like soccer very much.', ja:'はい。サッカーが大好きです。' },
        { sp:'A', en:'Do you play it every day?', ja:'毎日するの？' },
        { sp:'B', en:'No, I don\'t. I play it on Sundays.', ja:'いいえ。日曜日にします。' },
        { sp:'A', en:'I like baseball. I watch games on TV.', ja:'私は野球が好き。テレビで試合を見ます。' },
        { sp:'B', en:'That\'s nice. I want to watch a baseball game with you.', ja:'いいね。一緒に野球を見たいな。' }
      ],
      vocab: [
        { w:'like', p:'動', m:'〜が好き', ex:'I like dogs.', exJa:'犬が好き。' },
        { w:'play', p:'動', m:'(スポーツを)する', ex:'I play tennis.', exJa:'テニスをします。' },
        { w:'watch', p:'動', m:'見る', ex:'I watch TV.', exJa:'テレビを見ます。' },
        { w:'every', p:'形', m:'毎〜', ex:'every day', exJa:'毎日' },
        { w:'want', p:'動', m:'〜が欲しい、したい', ex:'I want a book.', exJa:'本が欲しい。' }
      ],
      blanks: [
        { q:'(___) you like music?', a:'Do', hint:'一般動詞の疑問文' },
        { q:'I don\'t (___) cats.', a:'like', hint:'否定文' },
        { q:'I (___) tennis on Sundays.', a:'play', hint:'スポーツをする' },
        { q:'Do you watch TV (___) day?', a:'every', hint:'毎日' }
      ],
      trans: [
        { ja:'あなたは犬が好きですか？', en:'Do you like dogs?' },
        { ja:'私は音楽が好きではありません。', en:'I don\'t like music.' },
        { ja:'私は毎日サッカーをします。', en:'I play soccer every day.' },
        { ja:'私は本がほしいです。', en:'I want a book.' }
      ]
    },
    {
      id: 'nh1u3', icon: '🎸', name: 'Unit 3: can',
      desc: '助動詞 can・できること',
      grammar: 'I can 〜. / Can you 〜? / I can\'t 〜.',
      conv: [
        { sp:'A', en:'Can you play the guitar?', ja:'ギターは弾ける？' },
        { sp:'B', en:'Yes, I can. I can play it well.', ja:'はい。じょうずに弾けます。' },
        { sp:'A', en:'Wow! Can you sing, too?', ja:'すごい！歌も歌える？' },
        { sp:'B', en:'No, I can\'t. I can\'t sing well.', ja:'いいえ。歌は上手じゃないです。' },
        { sp:'A', en:'I can play the piano. Let\'s play together.', ja:'ピアノが弾けるよ。一緒に演奏しよう。' },
        { sp:'B', en:'That sounds great. I want to play with you.', ja:'いいね。一緒に演奏したい。' }
      ],
      vocab: [
        { w:'can', p:'助', m:'〜できる', ex:'I can swim.', exJa:'泳げます。' },
        { w:'guitar', p:'名', m:'ギター', ex:'I play the guitar.', exJa:'ギターを弾きます。' },
        { w:'well', p:'副', m:'じょうずに', ex:'She sings well.', exJa:'彼女はじょうずに歌います。' },
        { w:'sing', p:'動', m:'歌う', ex:'I sing every day.', exJa:'毎日歌います。' },
        { w:'together', p:'副', m:'一緒に', ex:'Let\'s study together.', exJa:'一緒に勉強しよう。' }
      ],
      blanks: [
        { q:'I (___) play the piano.', a:'can', hint:'〜できる' },
        { q:'(___) you swim?', a:'Can', hint:'canの疑問文' },
        { q:'She can\'t (___) well.', a:'sing', hint:'動詞の原形' },
        { q:'Let\'s play (___).', a:'together', hint:'一緒に' }
      ],
      trans: [
        { ja:'私はピアノが弾けます。', en:'I can play the piano.' },
        { ja:'あなたは泳げますか？', en:'Can you swim?' },
        { ja:'私は速く走れません。', en:'I can\'t run fast.' },
        { ja:'一緒に歌いましょう。', en:'Let\'s sing together.' }
      ]
    },
    {
      id: 'nh1u4', icon: '👨‍👩‍👧', name: 'Unit 6: 三人称単数',
      desc: '三人称単数現在形・家族や友達の紹介',
      grammar: 'He/She likes 〜. / Does he 〜?',
      conv: [
        { sp:'A', en:'This is my brother, Ken. He plays soccer.', ja:'こちらは兄のケンです。サッカーをします。' },
        { sp:'B', en:'Does he play it every day?', ja:'毎日するの？' },
        { sp:'A', en:'Yes, he does. He likes it very much.', ja:'はい。とても好きなんです。' },
        { sp:'B', en:'My sister plays the violin. She practices every evening.', ja:'うちの姉はバイオリンを弾きます。毎晩練習しています。' },
        { sp:'A', en:'Does she go to a music school?', ja:'音楽教室に通っているの？' },
        { sp:'B', en:'Yes, she does. She wants to be a musician.', ja:'はい。音楽家になりたいんです。' }
      ],
      vocab: [
        { w:'brother', p:'名', m:'兄、弟', ex:'My brother is tall.', exJa:'兄は背が高い。' },
        { w:'sister', p:'名', m:'姉、妹', ex:'My sister is kind.', exJa:'姉はやさしい。' },
        { w:'practice', p:'動', m:'練習する', ex:'He practices tennis.', exJa:'彼はテニスを練習する。' },
        { w:'evening', p:'名', m:'夕方、晩', ex:'in the evening', exJa:'夕方に' },
        { w:'musician', p:'名', m:'音楽家', ex:'She is a musician.', exJa:'彼女は音楽家です。' }
      ],
      blanks: [
        { q:'He (___) soccer every day.', a:'plays', hint:'三人称単数のs' },
        { q:'(___) she play the violin?', a:'Does', hint:'三単現の疑問文' },
        { q:'My sister (___) music.', a:'likes', hint:'三人称単数のs' },
        { q:'He doesn\'t (___) tennis.', a:'play', hint:'否定文の動詞は原形' }
      ],
      trans: [
        { ja:'彼はサッカーをします。', en:'He plays soccer.' },
        { ja:'彼女は野球が好きですか？', en:'Does she like baseball?' },
        { ja:'私の兄はバイオリンを弾きません。', en:'My brother doesn\'t play the violin.' },
        { ja:'彼女は音楽家になりたいです。', en:'She wants to be a musician.' }
      ]
    }
  ],

  '2': [
    {
      id: 'nh2u1', icon: '🌻', name: 'Unit 1: 過去形',
      desc: '過去形・夏休みの思い出',
      grammar: 'I went 〜. / I was 〜. / Did you 〜?',
      conv: [
        { sp:'A', en:'How was your summer vacation?', ja:'夏休みはどうだった？' },
        { sp:'B', en:'It was great. I went to Hokkaido with my family.', ja:'最高だったよ。家族で北海道に行ったんだ。' },
        { sp:'A', en:'What did you do there?', ja:'そこで何したの？' },
        { sp:'B', en:'I visited a beautiful park. I ate delicious food.', ja:'きれいな公園に行ったよ。おいしい食べ物も食べた。' },
        { sp:'A', en:'Did you take many pictures?', ja:'写真はたくさん撮ったの？' },
        { sp:'B', en:'Yes, I did. I will show them to you.', ja:'うん、たくさん撮ったよ。見せるね。' }
      ],
      vocab: [
        { w:'went', p:'動', m:'goの過去形', ex:'I went to school.', exJa:'学校に行った。' },
        { w:'visited', p:'動', m:'visitの過去形', ex:'I visited Kyoto.', exJa:'京都を訪れた。' },
        { w:'ate', p:'動', m:'eatの過去形', ex:'I ate rice.', exJa:'米を食べた。' },
        { w:'beautiful', p:'形', m:'美しい', ex:'a beautiful flower', exJa:'美しい花' },
        { w:'vacation', p:'名', m:'休暇', ex:'summer vacation', exJa:'夏休み' }
      ],
      blanks: [
        { q:'I (___) to Tokyo last week.', a:'went', hint:'go の過去形' },
        { q:'(___) you visit Kyoto?', a:'Did', hint:'過去形の疑問文' },
        { q:'I (___) sushi yesterday.', a:'ate', hint:'eat の過去形' },
        { q:'It (___) sunny yesterday.', a:'was', hint:'is の過去形' }
      ],
      trans: [
        { ja:'私は昨日京都に行きました。', en:'I went to Kyoto yesterday.' },
        { ja:'あなたはお寿司を食べましたか？', en:'Did you eat sushi?' },
        { ja:'私は写真をたくさん撮りました。', en:'I took many pictures.' },
        { ja:'夏休みは楽しかったです。', en:'My summer vacation was fun.' }
      ]
    },
    {
      id: 'nh2u2', icon: '🚀', name: 'Unit 2: 未来形',
      desc: 'be going to / will・将来の予定',
      grammar: 'I am going to 〜. / I will 〜.',
      conv: [
        { sp:'A', en:'What are you going to do this weekend?', ja:'今週末は何をする予定？' },
        { sp:'B', en:'I am going to study English with my friend.', ja:'友達と英語を勉強する予定だよ。' },
        { sp:'A', en:'That\'s nice. I will visit my grandmother.', ja:'いいね。私はおばあちゃんに会いに行くよ。' },
        { sp:'B', en:'Will she be at home?', ja:'彼女、家にいるの？' },
        { sp:'A', en:'Yes, she will. I am going to help her cook.', ja:'うん、いるよ。料理を手伝う予定。' },
        { sp:'B', en:'That sounds fun. Have a great weekend!', ja:'楽しそう！よい週末を！' }
      ],
      vocab: [
        { w:'going to', p:'熟', m:'〜する予定', ex:'I am going to swim.', exJa:'泳ぐ予定。' },
        { w:'will', p:'助', m:'〜だろう、〜するつもり', ex:'I will help you.', exJa:'手伝うよ。' },
        { w:'weekend', p:'名', m:'週末', ex:'on the weekend', exJa:'週末に' },
        { w:'grandmother', p:'名', m:'祖母', ex:'my grandmother', exJa:'私の祖母' },
        { w:'help', p:'動', m:'手伝う', ex:'Help me.', exJa:'手伝って。' }
      ],
      blanks: [
        { q:'I am (___) to study English.', a:'going', hint:'be going to の形' },
        { q:'(___) you help me?', a:'Will', hint:'will の疑問文' },
        { q:'It (___) rain tomorrow.', a:'will', hint:'未来の予測' },
        { q:'I will (___) you tomorrow.', a:'see', hint:'動詞の原形' }
      ],
      trans: [
        { ja:'私は明日サッカーをする予定です。', en:'I am going to play soccer tomorrow.' },
        { ja:'手伝ってくれる？', en:'Will you help me?' },
        { ja:'明日は晴れるでしょう。', en:'It will be sunny tomorrow.' },
        { ja:'私はおばあちゃんに会うつもりです。', en:'I am going to see my grandmother.' }
      ]
    },
    {
      id: 'nh2u3', icon: '✏️', name: 'Unit 5: 不定詞',
      desc: '不定詞 (to + 動詞の原形)・〜したい/するために',
      grammar: 'I want to 〜. / I went to 〜 to 〜. / It is 〜 to 〜.',
      conv: [
        { sp:'A', en:'What do you want to be in the future?', ja:'将来何になりたい？' },
        { sp:'B', en:'I want to be a teacher. I love children.', ja:'先生になりたい。子どもが大好きだから。' },
        { sp:'A', en:'That\'s great. Why do you want to be a teacher?', ja:'すてきだね。なぜ先生になりたいの？' },
        { sp:'B', en:'I want to help students. It is fun to teach.', ja:'生徒を助けたいから。教えるのは楽しいよ。' },
        { sp:'A', en:'I study hard to be a doctor.', ja:'私は医者になるために一生懸命勉強しています。' },
        { sp:'B', en:'That\'s a wonderful dream.', ja:'すばらしい夢だね。' }
      ],
      vocab: [
        { w:'future', p:'名', m:'未来、将来', ex:'in the future', exJa:'将来' },
        { w:'teacher', p:'名', m:'先生', ex:'My teacher is kind.', exJa:'先生はやさしい。' },
        { w:'children', p:'名', m:'子どもたち', ex:'I love children.', exJa:'子どもが大好き。' },
        { w:'teach', p:'動', m:'教える', ex:'She teaches English.', exJa:'彼女は英語を教える。' },
        { w:'doctor', p:'名', m:'医者', ex:'be a doctor', exJa:'医者になる' }
      ],
      blanks: [
        { q:'I want (___) be a teacher.', a:'to', hint:'不定詞' },
        { q:'I went to the library (___) study.', a:'to', hint:'目的を表す不定詞' },
        { q:'It is fun (___) play soccer.', a:'to', hint:'It is ... to 〜' },
        { q:'I have something (___) tell you.', a:'to', hint:'形容詞用法' }
      ],
      trans: [
        { ja:'私は医者になりたいです。', en:'I want to be a doctor.' },
        { ja:'私は英語を勉強するために学校に行きます。', en:'I go to school to study English.' },
        { ja:'サッカーをするのは楽しいです。', en:'It is fun to play soccer.' },
        { ja:'読む本がたくさんあります。', en:'I have many books to read.' }
      ]
    },
    {
      id: 'nh2u4', icon: '⛰️', name: 'Unit 7: 比較',
      desc: '比較級・最上級・〜より/一番',
      grammar: 'A is taller than B. / A is the tallest of/in 〜.',
      conv: [
        { sp:'A', en:'Mt. Fuji is the highest mountain in Japan.', ja:'富士山は日本で一番高い山だよ。' },
        { sp:'B', en:'Really? Is it higher than Mt. Tate?', ja:'そうなんだ。立山より高いの？' },
        { sp:'A', en:'Yes. Mt. Fuji is much higher.', ja:'うん。富士山のほうがずっと高いよ。' },
        { sp:'B', en:'I think Mt. Fuji is the most beautiful mountain in the world.', ja:'富士山は世界で一番美しい山だと思うよ。' },
        { sp:'A', en:'I agree. Have you climbed it before?', ja:'同感。登ったことある？' },
        { sp:'B', en:'No, but I want to climb it someday.', ja:'いや、でもいつか登りたい。' }
      ],
      vocab: [
        { w:'higher', p:'形', m:'もっと高い', ex:'Mt. Fuji is higher.', exJa:'富士山のほうが高い。' },
        { w:'highest', p:'形', m:'一番高い', ex:'the highest mountain', exJa:'一番高い山' },
        { w:'than', p:'接', m:'〜より', ex:'taller than me', exJa:'私より背が高い' },
        { w:'most', p:'副', m:'最も', ex:'the most beautiful', exJa:'最も美しい' },
        { w:'mountain', p:'名', m:'山', ex:'a high mountain', exJa:'高い山' }
      ],
      blanks: [
        { q:'Tom is (___) than Ken.', a:'taller', hint:'比較級 (-er)' },
        { q:'This is the (___) book in the library.', a:'oldest', hint:'最上級 (the -est)' },
        { q:'English is more (___) than math for me.', a:'interesting', hint:'比較級 (more)' },
        { q:'She runs the (___) of all.', a:'fastest', hint:'最上級' }
      ],
      trans: [
        { ja:'私の父は私より背が高いです。', en:'My father is taller than me.' },
        { ja:'これは日本で一番大きな湖です。', en:'This is the biggest lake in Japan.' },
        { ja:'英語は数学よりおもしろい。', en:'English is more interesting than math.' },
        { ja:'彼は私たちの中で一番速く走ります。', en:'He runs the fastest of us.' }
      ]
    }
  ],

  '3': [
    {
      id: 'nh3u1', icon: '🌍', name: 'Unit 1: 受動態',
      desc: '受動態 (be + 過去分詞)・〜される',
      grammar: 'A is 〜ed by B. / Is 〜 spoken in 〜?',
      conv: [
        { sp:'A', en:'English is spoken in many countries.', ja:'英語は多くの国で話されているよ。' },
        { sp:'B', en:'Really? Is it spoken in India, too?', ja:'そうなの？インドでも話されてるの？' },
        { sp:'A', en:'Yes, it is. It is used as an official language there.', ja:'うん。公用語として使われているよ。' },
        { sp:'B', en:'This book was written by a famous writer.', ja:'この本は有名な作家によって書かれた。' },
        { sp:'A', en:'When was it published?', ja:'いつ出版されたの？' },
        { sp:'B', en:'It was published twenty years ago.', ja:'20年前に出版されたんだ。' }
      ],
      vocab: [
        { w:'spoken', p:'動', m:'speakの過去分詞', ex:'English is spoken.', exJa:'英語が話される。' },
        { w:'written', p:'動', m:'writeの過去分詞', ex:'It is written in English.', exJa:'英語で書かれている。' },
        { w:'used', p:'動', m:'useの過去分詞', ex:'It is used here.', exJa:'ここで使われる。' },
        { w:'famous', p:'形', m:'有名な', ex:'a famous singer', exJa:'有名な歌手' },
        { w:'country', p:'名', m:'国', ex:'many countries', exJa:'多くの国' }
      ],
      blanks: [
        { q:'English (___) spoken in Australia.', a:'is', hint:'受動態のbe動詞' },
        { q:'This book was (___) by him.', a:'written', hint:'writeの過去分詞' },
        { q:'(___) it made in Japan?', a:'Is', hint:'受動態の疑問文' },
        { q:'The car was washed (___) my father.', a:'by', hint:'〜によって' }
      ],
      trans: [
        { ja:'英語は世界中で話されています。', en:'English is spoken all over the world.' },
        { ja:'この本は10年前に書かれました。', en:'This book was written ten years ago.' },
        { ja:'これは日本で作られましたか？', en:'Was this made in Japan?' },
        { ja:'その手紙は彼によって書かれました。', en:'The letter was written by him.' }
      ]
    },
    {
      id: 'nh3u2', icon: '⏳', name: 'Unit 2: 現在完了形',
      desc: '現在完了形 (have + 過去分詞)・経験/継続/完了',
      grammar: 'I have 〜ed. / Have you ever 〜? / I have been 〜 for/since 〜.',
      conv: [
        { sp:'A', en:'Have you ever been to Hokkaido?', ja:'北海道に行ったことある？' },
        { sp:'B', en:'Yes, I have. I have been there twice.', ja:'うん、2回行ったことがあるよ。' },
        { sp:'A', en:'How long have you lived in this town?', ja:'この町にどのくらい住んでるの？' },
        { sp:'B', en:'I have lived here for ten years.', ja:'10年間住んでいるよ。' },
        { sp:'A', en:'I have just finished my homework.', ja:'ちょうど宿題を終えたところだよ。' },
        { sp:'B', en:'Great. Let\'s go out and play.', ja:'いいね。外で遊ぼう。' }
      ],
      vocab: [
        { w:'ever', p:'副', m:'今までに', ex:'Have you ever been?', exJa:'行ったことある？' },
        { w:'twice', p:'副', m:'2回', ex:'I have been twice.', exJa:'2回行ったことがある。' },
        { w:'lived', p:'動', m:'liveの過去分詞', ex:'I have lived here.', exJa:'ここに住んでいる。' },
        { w:'just', p:'副', m:'ちょうど', ex:'I have just eaten.', exJa:'ちょうど食べたところ。' },
        { w:'finished', p:'動', m:'finishの過去分詞', ex:'I have finished.', exJa:'終えた。' }
      ],
      blanks: [
        { q:'I (___) lived here for ten years.', a:'have', hint:'現在完了形' },
        { q:'Have you (___) been to Kyoto?', a:'ever', hint:'今までに' },
        { q:'I have lived here (___) 2015.', a:'since', hint:'〜以来' },
        { q:'I have (___) finished my homework.', a:'just', hint:'ちょうど' }
      ],
      trans: [
        { ja:'私は3回京都に行ったことがあります。', en:'I have been to Kyoto three times.' },
        { ja:'あなたは寿司を食べたことがありますか？', en:'Have you ever eaten sushi?' },
        { ja:'私はここに10年間住んでいます。', en:'I have lived here for ten years.' },
        { ja:'私はちょうど宿題を終えました。', en:'I have just finished my homework.' }
      ]
    },
    {
      id: 'nh3u3', icon: '🔗', name: 'Unit 4: 関係代名詞',
      desc: '関係代名詞 (who / which / that)・人や物を説明',
      grammar: 'The boy who 〜 is 〜. / The book which 〜 is 〜.',
      conv: [
        { sp:'A', en:'Do you know the boy who is playing the guitar?', ja:'ギターを弾いている男の子知ってる？' },
        { sp:'B', en:'Yes, he is my brother. He is a student who studies music.', ja:'うん、私の兄だよ。音楽を勉強している学生なんだ。' },
        { sp:'A', en:'I have a book which has many beautiful pictures.', ja:'美しい写真がたくさんある本を持ってるよ。' },
        { sp:'B', en:'Can I see the book that you have?', ja:'その本見せてくれる？' },
        { sp:'A', en:'Sure. The book that I bought yesterday is on the desk.', ja:'いいよ。昨日買った本は机の上にあるよ。' },
        { sp:'B', en:'Thank you. I love books that have nice pictures.', ja:'ありがとう。きれいな写真のある本が好きなんだ。' }
      ],
      vocab: [
        { w:'who', p:'関代', m:'(人)〜する', ex:'a boy who runs fast', exJa:'速く走る男の子' },
        { w:'which', p:'関代', m:'(物)〜する', ex:'a book which is new', exJa:'新しい本' },
        { w:'that', p:'関代', m:'人/物どちらも', ex:'a person that I know', exJa:'私が知っている人' },
        { w:'bought', p:'動', m:'buyの過去形', ex:'I bought a book.', exJa:'本を買った。' },
        { w:'picture', p:'名', m:'写真、絵', ex:'a nice picture', exJa:'すてきな写真' }
      ],
      blanks: [
        { q:'I have a friend (___) lives in Tokyo.', a:'who', hint:'人を説明 (関係代名詞)' },
        { q:'This is the book (___) I read.', a:'which', hint:'物を説明' },
        { q:'The girl (___) is singing is my sister.', a:'who', hint:'人 + 動作' },
        { q:'The cake (___) my mother made is delicious.', a:'that', hint:'関係代名詞 that' }
      ],
      trans: [
        { ja:'私には京都に住んでいる友達がいます。', en:'I have a friend who lives in Kyoto.' },
        { ja:'これは私が昨日買った本です。', en:'This is the book that I bought yesterday.' },
        { ja:'走っている男の子は私の弟です。', en:'The boy who is running is my brother.' },
        { ja:'母が作ったケーキはおいしいです。', en:'The cake that my mother made is delicious.' }
      ]
    },
    {
      id: 'nh3u4', icon: '🤔', name: 'Unit 6: 間接疑問文',
      desc: '間接疑問文・I don\'t know what 〜.',
      grammar: 'I know what 〜. / Do you know where 〜? / Tell me how 〜.',
      conv: [
        { sp:'A', en:'Do you know where Tom is?', ja:'トムがどこにいるか知ってる？' },
        { sp:'B', en:'No, I don\'t. I don\'t know where he is.', ja:'いや、彼がどこにいるか知らない。' },
        { sp:'A', en:'Can you tell me what time the movie starts?', ja:'映画が何時に始まるか教えてくれる？' },
        { sp:'B', en:'Sure. It starts at seven.', ja:'いいよ。7時に始まるよ。' },
        { sp:'A', en:'I don\'t know what to do this weekend.', ja:'今週末、何をしたらいいかわからないな。' },
        { sp:'B', en:'How about going to the museum with me?', ja:'一緒に博物館に行くのはどう？' }
      ],
      vocab: [
        { w:'where', p:'疑', m:'どこに', ex:'where he lives', exJa:'彼が住んでいる場所' },
        { w:'what time', p:'熟', m:'何時に', ex:'what time it is', exJa:'今何時か' },
        { w:'how', p:'疑', m:'どうやって、どう', ex:'how to swim', exJa:'泳ぎ方' },
        { w:'museum', p:'名', m:'博物館', ex:'go to the museum', exJa:'博物館に行く' },
        { w:'start', p:'動', m:'始まる', ex:'The class starts.', exJa:'授業が始まる。' }
      ],
      blanks: [
        { q:'I don\'t know (___) he lives.', a:'where', hint:'場所を尋ねる' },
        { q:'Tell me (___) time it is.', a:'what', hint:'何時' },
        { q:'I don\'t know (___) to swim.', a:'how', hint:'方法' },
        { q:'Do you know (___) is in the box?', a:'what', hint:'何が入っているか' }
      ],
      trans: [
        { ja:'私は彼がどこに住んでいるか知りません。', en:'I don\'t know where he lives.' },
        { ja:'今何時か教えてください。', en:'Please tell me what time it is.' },
        { ja:'泳ぎ方を知っていますか？', en:'Do you know how to swim?' },
        { ja:'私は何をしたらいいかわからない。', en:'I don\'t know what to do.' }
      ]
    }
  ]
};

// ---------- State ----------
const STORAGE_KEY = 'englishApp_state_v2';
const state = loadState();
let currentTopicId = null;
let currentMode = 'interview';
let interviewAnswers = {};
let activeConversation = null;

let speechQueue = [];
let speakStop = false;
let shadowingActive = false;
let instantActive = false;

let dictation = { idx: 0, total: 0, correct: 0, wrong: 0, sentences: [], current: null, finished: false };
let arrange = { idx: 0, total: 0, correct: 0, wrong: 0, sentences: [], current: null, target: [], pool: [], finished: false };
let vocab = { idx: 0, total: 0, correct: 0, wrong: 0, items: [], shown: false, finished: false };
let practice = { history: [], step: 0, mic: null };

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (!s.dailyStats) s.dailyStats = {};
      if (!s.material) s.material = 'eiken';
      if (!s.grade) s.grade = '1';
      return s;
    }
  } catch (e) {}
  return {
    level: '5', material: 'eiken', grade: '1',
    learned: {}, dailyStats: {},
    jaVoiceName: '', enVoiceName: ''
  };
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

// ---------- Session tracking ----------
let sessionStart = null;
let sessionMode = null;
function startSession(mode) {
  endSession(); // close previous
  sessionStart = Date.now();
  sessionMode = mode;
}
function endSession() {
  if (!sessionStart || !sessionMode) return;
  const elapsed = Date.now() - sessionStart;
  if (elapsed < 1000) { sessionStart = null; sessionMode = null; return; }
  const today = todayKey();
  if (!state.dailyStats[today]) state.dailyStats[today] = { totalMs: 0, byMode: {} };
  state.dailyStats[today].totalMs += elapsed;
  state.dailyStats[today].byMode[sessionMode] = (state.dailyStats[today].byMode[sessionMode] || 0) + elapsed;
  saveState();
  sessionStart = null;
  sessionMode = null;
}
function todayKey(d) {
  const dt = d ? new Date(d) : new Date();
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2,'0');
  const day = String(dt.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
window.addEventListener('beforeunload', endSession);
window.addEventListener('visibilitychange', () => { if (document.hidden) endSession(); });

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  syncLevelUI();
  renderTopics();
  renderDashboard();
  initVoices();
  document.querySelectorAll('#levelSeg .seg-btn').forEach(b => {
    b.addEventListener('click', () => setLevel(b.dataset.level));
  });
  document.querySelectorAll('#gradeSeg .seg-btn').forEach(b => {
    b.addEventListener('click', () => setGrade(b.dataset.grade));
  });
  document.querySelectorAll('#materialSeg .seg-btn').forEach(b => {
    b.addEventListener('click', () => setMaterial(b.dataset.material));
  });
  // Refresh dashboard every 30s if visible
  setInterval(() => {
    if (document.getElementById('screen-topics').classList.contains('active')) {
      renderDashboard();
    }
  }, 30000);
});

function syncLevelUI() {
  // Material segment
  document.querySelectorAll('#materialSeg .seg-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.material === state.material);
  });
  // Show eiken vs grade row
  document.getElementById('eikenLevelRow').style.display = state.material === 'eiken' ? '' : 'none';
  document.getElementById('nhGradeRow').style.display = state.material === 'newhorizon' ? '' : 'none';
  // Level segment
  document.querySelectorAll('#levelSeg .seg-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.level === state.level);
  });
  document.querySelectorAll('#gradeSeg .seg-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.grade === state.grade);
  });
  // Banner
  const badge = document.getElementById('currentLevelBadge');
  if (state.material === 'eiken') {
    badge.textContent = '英検' + state.level + '級';
  } else {
    badge.textContent = 'ニューホライゾン 中' + state.grade;
  }
}

// Returns the current source: array of topic-like items
function getCurrentTopics() {
  if (state.material === 'eiken') return TOPICS;
  return NH_UNITS[state.grade] || [];
}
// Returns conversation+vocab data for given topicId in current material/level
function getCurrentData(topicId) {
  if (state.material === 'eiken') {
    const data = CONVERSATIONS[topicId];
    return data ? data[state.level] : null;
  }
  // For NH, the data is the topic itself
  const units = NH_UNITS[state.grade] || [];
  const u = units.find(x => x.id === topicId);
  return u ? { conv: u.conv, vocab: u.vocab, blanks: u.blanks, trans: u.trans, grammar: u.grammar } : null;
}
// Look up topic info (icon, name) regardless of material
function findTopic(id) {
  if (state.material === 'eiken') return TOPICS.find(t => t.id === id);
  for (const g of ['1','2','3']) {
    const u = (NH_UNITS[g] || []).find(x => x.id === id);
    if (u) return u;
  }
  return null;
}

// ---------- Top tabs ----------
function switchTopTab(tab) {
  document.querySelectorAll('.top-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('screen-topics').classList.toggle('active', tab === 'topics');
  document.getElementById('screen-learned').classList.toggle('active', tab === 'learned');
  document.getElementById('screen-detail').classList.remove('active');
  if (tab === 'learned') renderLearned();
}

// ---------- Topic list ----------
function currentLevelKey() {
  return state.material === 'eiken' ? state.level : 'g' + state.grade;
}
function renderTopics() {
  const grid = document.getElementById('topicGrid');
  const topics = getCurrentTopics();
  const lk = currentLevelKey();
  grid.innerHTML = topics.map(t => {
    const learned = state.learned[t.id] && state.learned[t.id][lk];
    return `<button class="topic-card ${learned?'learned':''}" onclick="openTopic('${t.id}')">
      ${learned ? '<span class="topic-badge">学習済み</span>' : ''}
      <div class="topic-icon">${t.icon}</div>
      <div class="topic-name">${escapeHtml(t.name)}</div>
      <div class="topic-desc">${escapeHtml(t.desc)}</div>
    </button>`;
  }).join('');
}

function renderLearned() {
  const grid = document.getElementById('learnedGrid');
  const empty = document.getElementById('learnedEmpty');
  // Combine all sources
  const all = [...TOPICS];
  ['1','2','3'].forEach(g => (NH_UNITS[g] || []).forEach(u => all.push(u)));
  const learned = all.filter(t => state.learned[t.id] && Object.keys(state.learned[t.id]).length > 0);
  if (learned.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = learned.map(t => {
    const lvls = Object.keys(state.learned[t.id]).sort().map(l =>
      l.startsWith('g') ? 'NH中'+l.slice(1) : '英検'+l+'級'
    ).join(' / ');
    return `<button class="topic-card learned" onclick="openLearnedTopic('${t.id}')">
      <div class="topic-icon">${t.icon}</div>
      <div class="topic-name">${escapeHtml(t.name)}</div>
      <div class="topic-desc">${lvls}</div>
    </button>`;
  }).join('');
}
function openLearnedTopic(id) {
  // Switch material/level if needed
  for (const g of ['1','2','3']) {
    if ((NH_UNITS[g] || []).find(x => x.id === id)) {
      state.material = 'newhorizon'; state.grade = g;
      saveState(); syncLevelUI();
      openTopic(id);
      return;
    }
  }
  if (TOPICS.find(t => t.id === id)) {
    state.material = 'eiken';
    saveState(); syncLevelUI();
    openTopic(id);
  }
}

// ---------- Topic open ----------
function openTopic(id) {
  endSession();
  currentTopicId = id;
  interviewAnswers = {};
  activeConversation = null;
  const topic = findTopic(id);
  if (!topic) return;
  document.getElementById('detailTitle').textContent = topic.icon + ' ' + topic.name;
  const lvlText = state.material === 'eiken' ? '英検' + state.level + '級' : '中' + state.grade + ' (NH)';
  document.getElementById('detailLevel').textContent = lvlText;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-detail').classList.add('active');
  // Show/hide interview tab depending on material
  const interviewTab = document.querySelector('.mode-tab[data-mode="interview"]');
  if (state.material === 'newhorizon') {
    interviewTab.style.display = 'none';
    switchMode('conversation');
  } else {
    interviewTab.style.display = '';
    switchMode('interview');
    renderInterview();
  }
}
function backToTopics() {
  endSession();
  stopAll();
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-topics').classList.add('active');
  document.querySelectorAll('.top-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === 'topics'));
  renderTopics();
  renderDashboard();
}

// ---------- Mode switching ----------
function switchMode(m) {
  stopAll();
  currentMode = m;
  startSession(m);
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
  document.querySelectorAll('.mode-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('mode-' + m).classList.add('active');

  if (m === 'conversation') {
    if (!activeConversation) buildConversation();
    renderConversation();
  } else if (m === 'vocabulary') {
    if (!activeConversation) buildConversation();
    initVocab();
    renderVocab();
  } else if (m === 'shadowing') {
    if (!activeConversation) buildConversation();
    renderShadowList();
  } else if (m === 'arrange') {
    if (!activeConversation) buildConversation();
    initArrange();
    renderArrange();
  } else if (m === 'dictation') {
    if (!activeConversation) buildConversation();
    initDictation();
    renderDictation();
  } else if (m === 'practice') {
    if (!activeConversation) buildConversation();
    initPractice();
    renderPractice();
  } else if (m === 'instant') {
    if (!activeConversation) buildConversation();
    document.getElementById('instantDisplay').innerHTML = '<div class="big-status">▶ 開始ボタンで始まります</div>';
  } else if (m === 'test') {
    if (!activeConversation) buildConversation();
    if (!testState.type) testState.type = 'word';
    initTest();
    renderTest();
  }
}

// ---------- Interview ----------
function renderInterview() {
  const topic = TOPICS.find(t => t.id === currentTopicId);
  const area = document.getElementById('interviewArea');
  area.innerHTML = topic.interview.map((q, i) => `
    <div class="q-block">
      <div class="q-num">質問 ${i+1}</div>
      <div class="q-text">${q.q}</div>
      <div class="q-options">
        ${q.options.map((o, oi) => `
          <button class="q-option ${interviewAnswers[q.key]?.idx === oi ? 'selected' : ''}"
            onclick="selectAnswer('${q.key}', ${oi})">${o.ja}</button>
        `).join('')}
      </div>
    </div>
  `).join('');
  updateGenerateBtn();
}
function selectAnswer(key, idx) {
  const topic = TOPICS.find(t => t.id === currentTopicId);
  const q = topic.interview.find(x => x.key === key);
  interviewAnswers[key] = { idx, en: q.options[idx].en, ja: q.options[idx].ja };
  renderInterview();
}
function updateGenerateBtn() {
  const topic = TOPICS.find(t => t.id === currentTopicId);
  const allAnswered = topic.interview.every(q => interviewAnswers[q.key]);
  document.getElementById('generateBtn').disabled = !allAnswered;
}
function resetInterview() {
  interviewAnswers = {};
  activeConversation = null;
  renderInterview();
}
function generateConversation() {
  buildConversation();
  switchMode('conversation');
}

// ---------- Build conversation from interview (or directly for NH) ----------
function buildConversation() {
  const topic = findTopic(currentTopicId);
  const data = getCurrentData(currentTopicId);
  if (!data) return;
  if (state.material === 'eiken' && topic.interview) {
    topic.interview.forEach(q => {
      if (!interviewAnswers[q.key]) {
        interviewAnswers[q.key] = { idx: 0, en: q.options[0].en, ja: q.options[0].ja };
      }
    });
    const replace = (text) => {
      return text.replace(/\{\{(\w+?)(Ja)?\}\}/g, (m, key, ja) => {
        const a = interviewAnswers[key];
        if (!a) return m;
        return ja ? a.ja : a.en;
      });
    };
    const conv = data.conv.map(line => ({
      sp: line.sp,
      en: replace(line.en),
      ja: replace(line.ja)
    }));
    activeConversation = { conv, vocab: data.vocab.map(v => ({...v})) };
  } else {
    // NEW HORIZON: just use the data directly
    activeConversation = {
      conv: data.conv.map(l => ({...l})),
      vocab: data.vocab.map(v => ({...v})),
      blanks: (data.blanks || []).map(b => ({...b})),
      trans: (data.trans || []).map(t => ({...t})),
      grammar: data.grammar
    };
  }
}

// ---------- Conversation render ----------
function renderConversation() {
  if (!activeConversation) return;
  const showJa = document.getElementById('showJaToggle').checked;
  const list = document.getElementById('conversationList');
  list.innerHTML = activeConversation.conv.map((line, i) => `
    <div class="conv-item ${line.sp === 'B' ? 'you' : ''}">
      <div class="conv-speaker">${line.sp === 'A' ? 'AI' : 'You'}</div>
      <div class="conv-bubble">
        <div class="conv-en">${escapeHtml(line.en)}</div>
        ${showJa ? `<div class="conv-ja">${escapeHtml(line.ja)}</div>` : ''}
      </div>
      <button class="play-icon" onclick="speakOne(${i})" title="再生">🔊</button>
    </div>
  `).join('');
}
function speakOne(i) {
  if (!activeConversation) return;
  stopSpeak();
  speakEn(activeConversation.conv[i].en, 1.0);
}
function playWholeConversation() {
  if (!activeConversation) return;
  stopSpeak();
  const lines = activeConversation.conv.map(l => ({ text: l.en, lang: 'en', rate: 1.0 }));
  speakSequence(lines, 600);
}

// ---------- Vocabulary (flashcard) ----------
function initVocab() {
  if (!activeConversation) return;
  vocab.items = activeConversation.vocab;
  vocab.idx = 0;
  vocab.total = vocab.items.length;
  vocab.correct = 0; vocab.wrong = 0;
  vocab.shown = false; vocab.finished = false;
}
function renderVocab() {
  const container = document.getElementById('vocabFlashcard');
  const progress = document.getElementById('vocabProgress');
  if (vocab.finished) {
    progress.style.width = '100%';
    container.innerHTML = `<div class="fc-result">
      <h3>🎉 全${vocab.total}問完了！</h3>
      <p>合ってた: ${vocab.correct}　違った: ${vocab.wrong}</p>
      <button class="btn btn-primary" onclick="initVocab(); renderVocab();">もう一度</button>
    </div>`;
    return;
  }
  const v = vocab.items[vocab.idx];
  progress.style.width = ((vocab.idx) / vocab.total * 100) + '%';
  // Build a fill-in phrase from the example
  const phraseBlank = v.ex.replace(new RegExp('\\b' + escapeReg(v.w) + '\\b', 'i'), '(_____)');
  container.innerHTML = `
    <div class="flashcard">
      <div class="fc-hint-label">意味 / Hint  (${vocab.idx+1} / ${vocab.total})</div>
      <div class="fc-meaning">${escapeHtml(v.m)}</div>
      <div class="fc-hint-ja">${escapeHtml(v.exJa)}</div>
      <div class="fc-phrase-box">
        <div class="fc-phrase-label">フレーズ（空欄を埋めてください）</div>
        <div class="fc-phrase">${escapeHtml(phraseBlank)}</div>
      </div>
      ${vocab.shown ? `
        <div class="fc-answer-box">
          <div class="fc-answer-label">正解</div>
          <div class="fc-answer">${escapeHtml(v.w)}</div>
          <div class="fc-answer-full">${escapeHtml(v.ex)}</div>
        </div>
        <div class="fc-audio-row">
          <button class="fc-audio-btn" onclick="speakEn('${escapeJs(v.w)}', 1.0)">🔊 単語</button>
          <button class="fc-audio-btn" onclick="speakEn('${escapeJs(v.ex)}', 1.0)">🔊 フレーズ</button>
        </div>
        <div class="fc-actions">
          <button class="fc-judge wrong" onclick="judgeVocab(false)">× 違った</button>
          <button class="fc-judge right" onclick="judgeVocab(true)">○ 合ってた</button>
        </div>
      ` : `
        <button class="fc-show-btn" onclick="showVocabAnswer()">答えを見る</button>
      `}
    </div>
  `;
}
function showVocabAnswer() { vocab.shown = true; renderVocab(); }
function judgeVocab(right) {
  if (right) vocab.correct++; else vocab.wrong++;
  vocab.idx++;
  vocab.shown = false;
  if (vocab.idx >= vocab.total) vocab.finished = true;
  renderVocab();
}

// ---------- Shadowing ----------
function initVoices() {
  const update = () => {
    const voices = speechSynthesis.getVoices();
    const jaVoices = voices.filter(v => v.lang.startsWith('ja'));
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const jaSel = document.getElementById('jaVoiceSelect');
    const enSel = document.getElementById('enVoiceSelect');
    if (jaSel) {
      jaSel.innerHTML = jaVoices.length ?
        jaVoices.map(v => `<option value="${v.name}">${v.name}</option>`).join('') :
        '<option value="">(日本語の声が見つかりません)</option>';
      if (state.jaVoiceName && [...jaSel.options].some(o => o.value === state.jaVoiceName)) {
        jaSel.value = state.jaVoiceName;
      }
      jaSel.onchange = () => { state.jaVoiceName = jaSel.value; saveState(); };
    }
    if (enSel) {
      enSel.innerHTML = enVoices.length ?
        enVoices.map(v => `<option value="${v.name}">${v.name}</option>`).join('') :
        '<option value="">(英語の声が見つかりません)</option>';
      if (state.enVoiceName && [...enSel.options].some(o => o.value === state.enVoiceName)) {
        enSel.value = state.enVoiceName;
      }
      enSel.onchange = () => { state.enVoiceName = enSel.value; saveState(); };
    }
  };
  update();
  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = update;
  }
}
function updateSpeedLabel() {
  const v = parseFloat(document.getElementById('shadowSpeed').value);
  document.getElementById('speedLabel').textContent = v.toFixed(1) + 'x';
}
function renderShadowList() {
  const list = document.getElementById('shadowList');
  if (!activeConversation) { list.innerHTML = ''; return; }
  list.innerHTML = activeConversation.conv.map((line, i) => `
    <div class="shadow-item" id="shadow-item-${i}">
      <div class="conv-ja">${escapeHtml(line.ja)}</div>
      <div class="conv-en">${escapeHtml(line.en)}</div>
      <span class="shadow-check">✓</span>
    </div>
  `).join('');
}
async function startShadowing() {
  if (!activeConversation) return;
  stopAll();
  shadowingActive = true;
  speakStop = false;
  const speed = parseFloat(document.getElementById('shadowSpeed').value);
  const repeat = parseInt(document.getElementById('shadowRepeat').value);
  const gap = parseInt(document.getElementById('shadowGap').value);
  const auto = document.getElementById('shadowAuto').checked;
  const conv = activeConversation.conv;

  let round = 0;
  while (shadowingActive && (repeat === 0 || round < repeat)) {
    for (let i = 0; i < conv.length && shadowingActive; i++) {
      const item = document.getElementById('shadow-item-' + i);
      document.querySelectorAll('.shadow-item').forEach(el => el.classList.remove('active'));
      if (item) item.classList.add('active');
      await speakAsync(conv[i].en, 'en', speed);
      if (item) item.classList.add('done');
      if (!shadowingActive) break;
      await sleep(gap);
    }
    round++;
    if (!auto) break;
  }
  document.querySelectorAll('.shadow-item').forEach(el => el.classList.remove('active'));
  shadowingActive = false;
}
function stopShadowing() {
  shadowingActive = false;
  stopSpeak();
  document.querySelectorAll('.shadow-item').forEach(el => el.classList.remove('active'));
}

// ---------- Instant English ----------
async function startInstant() {
  if (!activeConversation) return;
  stopAll();
  instantActive = true;
  speakStop = false;
  const pause = parseInt(document.getElementById('instantPause').value) * 1000;
  const speed = parseFloat(document.getElementById('instantSpeed').value);
  const display = document.getElementById('instantDisplay');
  display.classList.add('active');
  const conv = activeConversation.conv;
  for (let i = 0; i < conv.length && instantActive; i++) {
    display.innerHTML = `
      <div class="big-status">${i+1} / ${conv.length}　日本語</div>
      <div class="big-ja">${escapeHtml(conv[i].ja)}</div>`;
    await speakAsync(conv[i].ja, 'ja', 1.0);
    if (!instantActive) break;
    display.innerHTML = `
      <div class="big-status">考えてみよう...</div>
      <div class="big-ja">${escapeHtml(conv[i].ja)}</div>`;
    await sleep(pause);
    if (!instantActive) break;
    display.innerHTML = `
      <div class="big-status">英語</div>
      <div class="big-en">${escapeHtml(conv[i].en)}</div>
      <div class="big-ja">${escapeHtml(conv[i].ja)}</div>`;
    await speakAsync(conv[i].en, 'en', speed);
    await sleep(700);
  }
  if (instantActive) {
    display.innerHTML = `<div class="big-status">✅ 完了！</div>`;
  }
  display.classList.remove('active');
  instantActive = false;
}
function stopInstant() {
  instantActive = false;
  stopSpeak();
  document.getElementById('instantDisplay').classList.remove('active');
  document.getElementById('instantDisplay').innerHTML = '<div class="big-status">⏹ 停止しました</div>';
}

// ---------- Word arrangement ----------
function initArrange() {
  if (!activeConversation) return;
  const lines = activeConversation.conv.filter(l => l.en.split(/\s+/).length >= 3 && l.en.split(/\s+/).length <= 12);
  arrange.sentences = shuffle(lines.slice());
  arrange.total = arrange.sentences.length;
  arrange.idx = 0;
  arrange.correct = 0; arrange.wrong = 0;
  arrange.finished = false;
  loadArrangeQuestion();
}
function loadArrangeQuestion() {
  if (arrange.idx >= arrange.total) { arrange.finished = true; return; }
  const sent = arrange.sentences[arrange.idx];
  arrange.current = sent;
  // Tokenize: split on whitespace but keep punctuation attached
  const tokens = sent.en.split(/\s+/);
  arrange.target = [];
  arrange.pool = shuffle(tokens.map((t, i) => ({ word: t, id: i })));
}
function renderArrange() {
  const area = document.getElementById('arrangeArea');
  const progress = document.getElementById('arrangeProgress');
  if (arrange.finished) {
    progress.style.width = '100%';
    area.innerHTML = `<div class="fc-result">
      <h3>🎉 全${arrange.total}問完了！</h3>
      <p>正解: ${arrange.correct}　ミス: ${arrange.wrong}</p>
      <button class="btn btn-primary" onclick="initArrange(); renderArrange();">もう一度</button>
    </div>`;
    return;
  }
  const sent = arrange.current;
  progress.style.width = (arrange.idx / arrange.total * 100) + '%';
  area.innerHTML = `
    <div class="arrange-question">
      <div class="arrange-meaning">
        <div class="arrange-meaning-label">日本語の意味 (${arrange.idx+1} / ${arrange.total})</div>
        <div class="arrange-meaning-text">${escapeHtml(sent.ja)}</div>
      </div>
      <button class="arrange-listen-btn" onclick="speakEn('${escapeJs(sent.en)}', 1.0)">🔊 音声を聞く</button>
      <div class="arrange-target ${arrange.target.length === 0 ? 'empty' : ''}" id="arrangeTarget"></div>
      <div class="arrange-pool" id="arrangePool"></div>
      <button class="btn btn-primary btn-block" onclick="checkArrange()" ${arrange.target.length===0?'disabled':''}>確認する</button>
      <div id="arrangeResult"></div>
    </div>
  `;
  renderArrangeChips();
}
function renderArrangeChips() {
  const target = document.getElementById('arrangeTarget');
  const pool = document.getElementById('arrangePool');
  if (!target || !pool) return;
  target.classList.toggle('empty', arrange.target.length === 0);
  target.innerHTML = arrange.target.map((t, i) =>
    `<button class="word-chip placed" onclick="unplaceWord(${i})">${escapeHtml(t.word)}</button>`).join('');
  pool.innerHTML = arrange.pool.map((p, i) =>
    `<button class="word-chip" onclick="placeWord(${i})">${escapeHtml(p.word)}</button>`).join('');
}
function placeWord(i) {
  arrange.target.push(arrange.pool[i]);
  arrange.pool.splice(i, 1);
  renderArrangeChips();
  document.querySelector('#arrangeArea .btn-primary').disabled = arrange.target.length === 0;
}
function unplaceWord(i) {
  arrange.pool.push(arrange.target[i]);
  arrange.target.splice(i, 1);
  renderArrangeChips();
  document.querySelector('#arrangeArea .btn-primary').disabled = arrange.target.length === 0;
}
function checkArrange() {
  const userOrder = arrange.target.map(t => t.word).join(' ');
  const correct = arrange.current.en;
  const isCorrect = userOrder.toLowerCase() === correct.toLowerCase();
  const result = document.getElementById('arrangeResult');
  if (isCorrect) {
    arrange.correct++;
    result.className = 'arrange-result correct';
    result.innerHTML = `✅ 正解です！<div class="dict-correct-line">${escapeHtml(correct)}</div>
      <button class="btn btn-primary" style="margin-top:10px" onclick="nextArrange()">次へ →</button>`;
  } else {
    arrange.wrong++;
    result.className = 'arrange-result wrong';
    result.innerHTML = `❌ 違います。<br>あなた: ${escapeHtml(userOrder)}
      <div class="dict-correct-line">正解: ${escapeHtml(correct)}</div>
      <button class="btn btn-primary" style="margin-top:10px" onclick="nextArrange()">次へ →</button>`;
  }
  speakEn(correct, 1.0);
}
function nextArrange() {
  arrange.idx++;
  loadArrangeQuestion();
  renderArrange();
}

// ---------- Dictation ----------
function initDictation() {
  if (!activeConversation) return;
  dictation.sentences = shuffle(activeConversation.conv.slice());
  dictation.total = dictation.sentences.length;
  dictation.idx = 0;
  dictation.correct = 0; dictation.wrong = 0;
  dictation.finished = false;
  dictation.current = dictation.sentences[0];
}
function renderDictation() {
  const area = document.getElementById('dictationArea');
  if (dictation.finished) {
    area.innerHTML = `<div class="fc-result">
      <h3>🎉 全${dictation.total}問完了！</h3>
      <p>正解: ${dictation.correct}　ミス: ${dictation.wrong}</p>
      <button class="btn btn-primary" onclick="initDictation(); renderDictation();">もう一度</button>
    </div>`;
    return;
  }
  area.innerHTML = `
    <div class="dict-stats">
      <div class="dict-stat">問題: ${dictation.idx+1} / ${dictation.total}</div>
      <div class="dict-stat">正解: ${dictation.correct}</div>
      <div class="dict-stat">ミス: ${dictation.wrong}</div>
    </div>
    <div class="dict-question">
      <button class="dict-listen-btn" onclick="speakDict()">🔊 英文を聞く</button>
      <textarea class="dict-input" id="dictInput" rows="3" placeholder="聞こえた英文を入力..."></textarea>
      <div style="display:flex; gap:10px; margin-top:10px;">
        <button class="btn btn-primary" onclick="checkDictation()">答え合わせ</button>
        <button class="btn btn-ghost" onclick="dictHint()">ヒント(日本語)</button>
        <button class="btn btn-ghost" onclick="dictSkip()">スキップ</button>
      </div>
      <div id="dictResult"></div>
    </div>
  `;
}
function speakDict() {
  if (dictation.current) speakEn(dictation.current.en, 0.9);
}
function dictHint() {
  const r = document.getElementById('dictResult');
  r.className = 'dict-result';
  r.style.background = '#fffbea';
  r.style.border = '1px solid #fbd38d';
  r.style.color = '#744210';
  r.innerHTML = '💡 日本語: ' + escapeHtml(dictation.current.ja);
}
function dictSkip() {
  nextDict();
}
function checkDictation() {
  const input = document.getElementById('dictInput').value.trim();
  if (!input) return;
  const result = document.getElementById('dictResult');
  const correct = dictation.current.en;
  const cleanA = input.toLowerCase().replace(/[.,!?'"]/g, '').replace(/\s+/g, ' ').trim();
  const cleanB = correct.toLowerCase().replace(/[.,!?'"]/g, '').replace(/\s+/g, ' ').trim();
  if (cleanA === cleanB) {
    dictation.correct++;
    result.className = 'dict-result correct';
    result.innerHTML = `✅ 正解！<div class="dict-correct-line">${escapeHtml(correct)}</div>
      <button class="btn btn-primary" style="margin-top:10px" onclick="nextDict()">次の問題 →</button>`;
  } else {
    dictation.wrong++;
    result.className = 'dict-result wrong';
    result.innerHTML = `❌ 違います。<br>${diffHtml(input, correct)}
      <div class="dict-correct-line">正解: ${escapeHtml(correct)}</div>
      <div class="conv-ja">日本語: ${escapeHtml(dictation.current.ja)}</div>
      <button class="btn btn-primary" style="margin-top:10px" onclick="nextDict()">次の問題 →</button>`;
  }
}
function nextDict() {
  dictation.idx++;
  if (dictation.idx >= dictation.total) {
    dictation.finished = true;
  } else {
    dictation.current = dictation.sentences[dictation.idx];
  }
  renderDictation();
}
function diffHtml(user, correct) {
  const u = user.toLowerCase().replace(/[.,!?'"]/g, '').split(/\s+/).filter(Boolean);
  const c = correct.toLowerCase().replace(/[.,!?'"]/g, '').split(/\s+/).filter(Boolean);
  const out = [];
  const max = Math.max(u.length, c.length);
  for (let i = 0; i < max; i++) {
    if (u[i] === c[i]) out.push(`<span class="diff-correct">${escapeHtml(u[i] || '')}</span>`);
    else if (u[i] && c[i]) out.push(`<span class="diff-wrong">${escapeHtml(u[i])}</span>(<span class="diff-missing">${escapeHtml(c[i])}</span>)`);
    else if (u[i]) out.push(`<span class="diff-wrong">${escapeHtml(u[i])}</span>`);
    else out.push(`<span class="diff-missing">${escapeHtml(c[i])}</span>`);
  }
  return 'あなた: ' + out.join(' ');
}

// ---------- AI Practice ----------
function initPractice() {
  if (!activeConversation) return;
  const topic = TOPICS.find(t => t.id === currentTopicId);
  practice.history = [];
  practice.step = 0;
  // AI starts the conversation
  const greeting = `Hi! Let's practice English conversation about "${topic.name}". You can type or use the mic. What would you like to talk about?`;
  practice.history.push({ role: 'ai', text: greeting, ja: `こんにちは！「${topic.name}」について英会話を練習しましょう。タイプかマイクで答えてね。何を話したい？` });
  practice.suggested = activeConversation.conv.filter(l => l.sp === 'B').slice(0, 3).map(l => l.en);
}
function renderPractice() {
  const area = document.getElementById('practiceArea');
  const conv = activeConversation ? activeConversation.conv : [];
  const histHtml = practice.history.map(m => {
    if (m.role === 'feedback') {
      return `<div class="practice-feedback">💡 ${escapeHtml(m.text)}</div>`;
    }
    const avatar = m.role === 'ai' ? '🤖' : '👤';
    return `
      <div class="practice-msg ${m.role}">
        <div class="practice-avatar">${avatar}</div>
        <div class="practice-bubble">
          ${escapeHtml(m.text)}
          ${m.ja ? `<small>${escapeHtml(m.ja)}</small>` : ''}
          ${m.role === 'ai' ? `<button class="play-icon" style="margin-top:6px" onclick="speakEn('${escapeJs(m.text)}', 1.0)">🔊</button>` : ''}
        </div>
      </div>`;
  }).join('');
  const suggestions = (practice.suggested && practice.suggested.length) ? `
    <div class="suggested-replies">
      ${practice.suggested.map(s => `<button class="suggested-reply" onclick="usePracticeSuggestion('${escapeJs(s)}')">${escapeHtml(s)}</button>`).join('')}
    </div>` : '';
  area.innerHTML = `
    <div class="practice-history">${histHtml}</div>
    ${suggestions}
    <div class="practice-input-row">
      <textarea class="practice-input" id="practiceInput" rows="2" placeholder="英語で入力するか、マイクで話してね"></textarea>
      <button class="mic-btn" id="practiceMic" onclick="togglePracticeMic()">🎤</button>
      <button class="practice-send" onclick="sendPractice()">送信</button>
    </div>
  `;
  // auto-scroll
  const h = area.querySelector('.practice-history');
  if (h) h.scrollTop = h.scrollHeight;
  // speak the latest AI message
  const last = practice.history[practice.history.length - 1];
  if (last && last.role === 'ai') {
    setTimeout(() => speakEn(last.text, 1.0), 200);
  }
}
function usePracticeSuggestion(s) {
  document.getElementById('practiceInput').value = s;
}
function sendPractice() {
  const input = document.getElementById('practiceInput');
  const text = (input.value || '').trim();
  if (!text) return;
  practice.history.push({ role: 'user', text });
  // Generate feedback
  const fb = generateFeedback(text);
  if (fb) practice.history.push({ role: 'feedback', text: fb });
  // AI follow-up
  const reply = generateAiReply(text);
  practice.history.push({ role: 'ai', text: reply.en, ja: reply.ja });
  practice.suggested = generateSuggestions(text);
  input.value = '';
  renderPractice();
}
function generateFeedback(text) {
  const fb = [];
  // Capitalization
  if (text[0] && text[0] !== text[0].toUpperCase()) {
    fb.push('文の最初は大文字で始めましょう。');
  }
  // Period at end
  if (!/[.!?]$/.test(text)) {
    fb.push('文末にピリオド(.)や疑問符(?)を付けましょう。');
  }
  // I lowercase
  if (/\bi\b/.test(text)) {
    fb.push('「I」(私) はいつも大文字で書きます。');
  }
  // Common JP-EN mistakes (basic)
  if (/\bi am like\b/i.test(text)) {
    fb.push('「I am like 〜」ではなく「I like 〜」が正しいです。');
  }
  if (/\bi like to (.+ing)\b/i.test(text)) {
    fb.push('「like to + 動詞の原形」または「like + ing」の形にします。');
  }
  // Length
  const words = text.trim().split(/\s+/).length;
  if (words < 3 && !/^(yes|no|ok|sure)/i.test(text)) {
    fb.push('もう少し詳しく答えてみよう！「I」「because」などを使うとよいです。');
  } else if (words > 0 && fb.length === 0) {
    fb.push('いい英文です！👍 同じ話題でもう少し詳しく話してみよう。');
  }
  return fb.join(' ');
}
function generateAiReply(userText) {
  const lower = userText.toLowerCase();
  // Use the topic's conversation as a guide for follow-up question
  const topic = TOPICS.find(t => t.id === currentTopicId);
  const aiQuestions = activeConversation.conv.filter(l => l.sp === 'A');
  // pick next question from canonical list
  practice.step = (practice.step || 0) + 1;
  let q = aiQuestions[practice.step % aiQuestions.length];
  // If user used a keyword, generate a contextual reaction
  let reaction = pickReaction(lower);
  return {
    en: reaction + ' ' + q.en,
    ja: q.ja
  };
}
function pickReaction(lower) {
  if (/\bbecause\b/.test(lower)) return "That's a good reason!";
  if (/\b(love|like|enjoy)\b/.test(lower)) return "That sounds great!";
  if (/\bdon'?t\s+like\b|\bhate\b/.test(lower)) return "Oh, I see.";
  if (/\?$/.test(lower)) return "Good question!";
  if (/\b(yes|sure|of course)\b/.test(lower)) return "Nice!";
  if (/\b(no|not really)\b/.test(lower)) return "I see.";
  return "Cool!";
}
function generateSuggestions(userText) {
  // Suggest 3 sample replies from the canonical conversation
  return activeConversation.conv.filter(l => l.sp === 'B').slice(0, 3).map(l => l.en);
}
function togglePracticeMic() {
  const btn = document.getElementById('practiceMic');
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert('お使いのブラウザは音声認識に対応していません。テキスト入力をご利用ください。');
    return;
  }
  if (practice.mic && practice.mic.recording) {
    practice.mic.rec.stop();
    return;
  }
  const rec = new SR();
  rec.lang = 'en-US';
  rec.interimResults = false;
  rec.continuous = false;
  rec.onstart = () => {
    btn.classList.add('recording');
    btn.textContent = '🎙 録音中';
  };
  rec.onresult = (e) => {
    const text = e.results[0][0].transcript;
    document.getElementById('practiceInput').value = text;
  };
  rec.onerror = (e) => {
    alert('音声認識エラー: ' + e.error);
  };
  rec.onend = () => {
    btn.classList.remove('recording');
    btn.textContent = '🎤';
    practice.mic.recording = false;
  };
  practice.mic = { rec, recording: true };
  rec.start();
}

// ---------- Speech utilities ----------
function speakEn(text, rate) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate || 1.0;
  const v = pickVoice('en');
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
function pickVoice(lang) {
  if (!('speechSynthesis' in window)) return null;
  const voices = speechSynthesis.getVoices();
  const want = lang === 'ja' ? state.jaVoiceName : state.enVoiceName;
  if (want) {
    const v = voices.find(v => v.name === want);
    if (v) return v;
  }
  return voices.find(v => v.lang.startsWith(lang === 'ja' ? 'ja' : 'en'));
}
function speakAsync(text, lang, rate) {
  return new Promise(resolve => {
    if (!('speechSynthesis' in window) || speakStop) { resolve(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'ja' ? 'ja-JP' : 'en-US';
    u.rate = rate || 1.0;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}
async function speakSequence(items, gap) {
  speakStop = false;
  for (const it of items) {
    if (speakStop) break;
    await speakAsync(it.text, it.lang, it.rate);
    if (speakStop) break;
    await sleep(gap || 500);
  }
}
function stopSpeak() {
  speakStop = true;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
function stopAll() {
  stopSpeak();
  shadowingActive = false;
  instantActive = false;
  if (practice.mic && practice.mic.rec) {
    try { practice.mic.rec.stop(); } catch(e) {}
  }
}

// ---------- Settings ----------
function openSettings() { document.getElementById('settingsModal').classList.add('active'); }
function closeSettings() { document.getElementById('settingsModal').classList.remove('active'); }
function closeSettingsBg(e) { if (e.target.id === 'settingsModal') closeSettings(); }
function setLevel(lv) {
  state.level = lv;
  saveState();
  syncLevelUI();
  renderTopics();
  if (currentTopicId) {
    activeConversation = null;
    document.getElementById('detailLevel').textContent = '英検' + lv + '級';
    if (currentMode !== 'interview') {
      switchMode(currentMode);
    }
  }
}
function setGrade(g) {
  state.grade = g;
  saveState();
  syncLevelUI();
  renderTopics();
  // If currently viewing a topic, return to topics since unit list changed
  if (currentTopicId) backToTopics();
}
function setMaterial(m) {
  state.material = m;
  saveState();
  syncLevelUI();
  renderTopics();
  if (currentTopicId) backToTopics();
}
function resetAllProgress() {
  if (!confirm('学習履歴と勉強時間をすべて削除します。よろしいですか？')) return;
  state.learned = {};
  state.dailyStats = {};
  saveState();
  renderTopics();
  renderLearned();
  renderDashboard();
}

function markAsLearned() {
  if (!currentTopicId) return;
  if (!state.learned[currentTopicId]) state.learned[currentTopicId] = {};
  state.learned[currentTopicId][currentLevelKey()] = Date.now();
  saveState();
  const topic = findTopic(currentTopicId);
  const lvlText = state.material === 'eiken' ? '英検' + state.level + '級' : 'NH中' + state.grade;
  alert('🎉 「' + topic.name + '」(' + lvlText + ') を学習済みにしました！');
}

// =====================================================
// テスト対策モード（中間・期末対応）
// =====================================================
const testState = {
  type: 'word',  // 'word' | 'blank' | 'trans'
  idx: 0, total: 0, correct: 0, wrong: 0,
  items: [], current: null, finished: false, shown: false
};

function switchTestType(type) {
  testState.type = type;
  document.querySelectorAll('#testTypeSeg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.type === type));
  initTest();
  renderTest();
}
function initTest() {
  if (!activeConversation) return;
  let items = [];
  if (testState.type === 'word') {
    items = activeConversation.vocab.map(v => ({
      q: v.m,                       // 意味
      hint: v.exJa,                  // ヒント例文(日本語)
      a: v.w,                        // 答え (英単語)
      example: v.ex,                 // 答え合わせ用例文
      kind: 'word'
    }));
  } else if (testState.type === 'blank') {
    if (state.material === 'newhorizon' && activeConversation.blanks && activeConversation.blanks.length) {
      items = activeConversation.blanks.map(b => ({
        q: b.q, hint: b.hint, a: b.a, kind: 'blank'
      }));
    } else {
      // For Eiken: build blanks by hiding key vocab from conversation
      items = [];
      activeConversation.vocab.forEach(v => {
        const re = new RegExp('\\b(' + escapeReg(v.w) + ')\\b', 'i');
        const line = activeConversation.conv.find(l => re.test(l.en));
        if (line) {
          items.push({
            q: line.en.replace(re, '(___)'),
            hint: v.m, a: v.w, kind: 'blank',
            ja: line.ja
          });
        }
      });
    }
  } else if (testState.type === 'trans') {
    if (state.material === 'newhorizon' && activeConversation.trans && activeConversation.trans.length) {
      items = activeConversation.trans.map(t => ({
        q: t.ja, a: t.en, kind: 'trans'
      }));
    } else {
      items = activeConversation.conv.map(l => ({
        q: l.ja, a: l.en, kind: 'trans'
      }));
    }
  }
  testState.items = shuffle(items);
  testState.total = testState.items.length;
  testState.idx = 0;
  testState.correct = 0; testState.wrong = 0;
  testState.finished = false;
  testState.shown = false;
  testState.current = testState.items[0] || null;
  // Update description
  const desc = document.getElementById('testDesc');
  if (desc) {
    if (state.material === 'newhorizon') {
      const t = findTopic(currentTopicId);
      desc.innerHTML = `📘 ${escapeHtml(t.name)} <small style="display:block; color:#718096; margin-top:3px">文法: ${escapeHtml(activeConversation.grammar || '-')}</small>`;
    } else {
      desc.textContent = '会話文の単語・表現を使ったテスト問題で実力チェック！';
    }
  }
}
function renderTest() {
  const area = document.getElementById('testArea');
  if (!testState.current || testState.total === 0) {
    area.innerHTML = '<p class="empty-text">この単元にはテスト問題がありません。</p>';
    return;
  }
  if (testState.finished) {
    const rate = Math.round(testState.correct / testState.total * 100);
    area.innerHTML = `<div class="fc-result">
      <h3>🎉 テスト完了！</h3>
      <p style="font-size:24px; font-weight:800; color:#2f855a;">${rate}点</p>
      <p>正解 ${testState.correct} / ${testState.total} 問</p>
      <button class="btn btn-primary" onclick="initTest(); renderTest();">もう一度</button>
    </div>`;
    return;
  }
  const it = testState.current;
  const inputId = 'testInput';
  const labelMap = { word: '単語テスト', blank: '空欄補充', trans: '和文英訳' };
  const promptMap = {
    word: '日本語の意味から英単語を答えてください',
    blank: '空欄に入る語を答えてください',
    trans: '日本語を英語にしてください'
  };
  area.innerHTML = `
    <div class="dict-stats">
      <div class="dict-stat">${labelMap[it.kind]}: ${testState.idx+1}/${testState.total}</div>
      <div class="dict-stat">正解: ${testState.correct}</div>
      <div class="dict-stat">ミス: ${testState.wrong}</div>
    </div>
    <div class="dict-question">
      <div class="arrange-meaning">
        <div class="arrange-meaning-label">${promptMap[it.kind]}</div>
        <div class="arrange-meaning-text" style="font-size:16px; font-weight:600;">${escapeHtml(it.q)}</div>
        ${it.hint ? `<div class="conv-ja" style="margin-top:6px;">💡 ヒント: ${escapeHtml(it.hint)}</div>` : ''}
        ${it.ja ? `<div class="conv-ja" style="margin-top:6px;">日本語: ${escapeHtml(it.ja)}</div>` : ''}
      </div>
      ${it.kind === 'trans' ? `<textarea class="dict-input" id="${inputId}" rows="2" placeholder="英語で入力..."></textarea>`
        : `<input class="dict-input" id="${inputId}" type="text" placeholder="${it.kind==='word'?'英単語':'語句'}を入力...">`}
      <div style="display:flex; gap:10px; margin-top:10px;">
        <button class="btn btn-primary" onclick="checkTest()">答え合わせ</button>
        <button class="btn btn-ghost" onclick="skipTest()">スキップ</button>
      </div>
      <div id="testResult"></div>
    </div>
  `;
  setTimeout(() => { const i = document.getElementById(inputId); if (i) i.focus(); }, 50);
}
function normalize(s) {
  return String(s || '').toLowerCase().replace(/[.,!?'"]/g,'').replace(/\s+/g,' ').trim();
}
function checkTest() {
  const input = document.getElementById('testInput');
  if (!input) return;
  const userRaw = input.value.trim();
  if (!userRaw) return;
  const user = normalize(userRaw);
  const ans = normalize(testState.current.a);
  const isCorrect = user === ans;
  const result = document.getElementById('testResult');
  if (isCorrect) {
    testState.correct++;
    result.className = 'dict-result correct';
    result.innerHTML = `✅ 正解！<div class="dict-correct-line">${escapeHtml(testState.current.a)}</div>
      ${testState.current.example ? `<div class="conv-ja">例: ${escapeHtml(testState.current.example)}</div>` : ''}
      <button class="btn btn-primary" style="margin-top:10px" onclick="nextTest()">次へ →</button>`;
  } else {
    testState.wrong++;
    result.className = 'dict-result wrong';
    result.innerHTML = `❌ 違います。<br>あなた: ${escapeHtml(userRaw)}
      <div class="dict-correct-line">正解: ${escapeHtml(testState.current.a)}</div>
      ${testState.current.example ? `<div class="conv-ja">例: ${escapeHtml(testState.current.example)}</div>` : ''}
      <button class="btn btn-primary" style="margin-top:10px" onclick="nextTest()">次へ →</button>`;
  }
}
function skipTest() { nextTest(); }
function nextTest() {
  testState.idx++;
  if (testState.idx >= testState.total) testState.finished = true;
  else testState.current = testState.items[testState.idx];
  renderTest();
}

// =====================================================
// ダッシュボード（学習時間・連続記録・キャラ応援）
// =====================================================
function renderDashboard() {
  endSession(); // commit any in-progress time
  const today = todayKey();
  const todayStat = state.dailyStats[today] || { totalMs: 0, byMode: {} };
  const todayMin = Math.round(todayStat.totalMs / 60000);
  const todayMs = todayStat.totalMs;

  // 今日の詳細
  const detail = (() => {
    if (todayMs < 60000) return 'まだ始めていません';
    const modes = Object.keys(todayStat.byMode || {});
    if (!modes.length) return formatDuration(todayMs);
    const top = modes.sort((a,b) => todayStat.byMode[b] - todayStat.byMode[a])[0];
    const modeName = MODE_LABELS[top] || top;
    return `${formatDuration(todayMs)}（メイン: ${modeName}）`;
  })();
  document.getElementById('todayTime').textContent = formatDuration(todayMs);
  document.getElementById('todayDetail').textContent = detail;

  // 連続記録
  const streak = computeStreak();
  document.getElementById('streakDays').textContent = streak + '日';

  // 今週の合計＋先週比
  const thisWeek = sumLastNDays(0, 7);
  const lastWeek = sumLastNDays(7, 7);
  document.getElementById('weekTime').textContent = formatDuration(thisWeek);
  const diff = thisWeek - lastWeek;
  const diffMin = Math.round(diff / 60000);
  const sign = diffMin >= 0 ? '+' : '';
  document.getElementById('weekCompare').textContent = `先週比 ${sign}${diffMin}分`;

  // 7日チャート
  renderWeekChart();

  // キャラクターメッセージ
  document.getElementById('charMsg').textContent = pickCharMessage(todayMin, streak, thisWeek, lastWeek);
}
const MODE_LABELS = {
  interview: 'インタビュー', conversation: '会話文', vocabulary: '単語学習',
  shadowing: 'シャドーイング', instant: '瞬間英作文', arrange: '単語並べ替え',
  dictation: 'ディクテーション', practice: 'AI実践', test: 'テスト対策'
};
function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}時間${m}分`;
  return `${m}分`;
}
function computeStreak() {
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = todayKey(d);
    const stat = state.dailyStats[k];
    if (stat && stat.totalMs >= 60000) streak++;
    else if (i === 0) {
      // Today not yet studied; check yesterday onwards
      continue;
    } else {
      break;
    }
  }
  return streak;
}
function sumLastNDays(offsetFromToday, days) {
  let sum = 0;
  for (let i = offsetFromToday; i < offsetFromToday + days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = todayKey(d);
    if (state.dailyStats[k]) sum += state.dailyStats[k].totalMs;
  }
  return sum;
}
function renderWeekChart() {
  const chart = document.getElementById('weekChart');
  if (!chart) return;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = todayKey(d);
    const ms = state.dailyStats[k] ? state.dailyStats[k].totalMs : 0;
    const label = ['日','月','火','水','木','金','土'][d.getDay()];
    days.push({ k, ms, label, isToday: i === 0 });
  }
  const max = Math.max(...days.map(d => d.ms), 60000); // at least 1 minute height
  chart.innerHTML = days.map(d => {
    const h = Math.max(2, (d.ms / max) * 50);
    const cls = d.isToday ? 'today' : (d.ms > 0 ? 'has-data' : '');
    return `<div class="bar-col ${d.isToday?'today':''}" title="${d.label}: ${formatDuration(d.ms)}">
      <div class="bar ${cls}" style="height:${h}px"></div>
      <div class="bar-label">${d.label}</div>
    </div>`;
  }).join('');
}
function pickCharMessage(todayMin, streak, thisWeek, lastWeek) {
  // Priority-based selection
  if (streak >= 30) return `🔥 ${streak}日連続！すごすぎる！もう完全に習慣だね！`;
  if (streak >= 14) return `🎉 2週間連続！継続は力なり、本当にすごい！`;
  if (streak >= 7) return `✨ 7日連続達成！1週間がんばったね！`;
  if (todayMin >= 60) return `📚 今日は${todayMin}分も勉強したね！100点満点の集中力！`;
  if (todayMin >= 30) return `👏 今日は${todayMin}分やったね！この調子！`;
  if (thisWeek > lastWeek && lastWeek > 0) {
    const diffMin = Math.round((thisWeek - lastWeek)/60000);
    return `📈 今週は先週より${diffMin}分も多く勉強したね！成長してる！`;
  }
  if (todayMin >= 15) return `😊 今日は${todayMin}分。ちょっとずつでも毎日が大切！`;
  if (todayMin >= 1) return `🌱 今日は${todayMin}分。スタートしたね！もう少しがんばろう！`;
  if (streak >= 1) return `おかえり！昨日の続きから一緒にがんばろう✨`;
  const greetings = [
    'おかえり！今日も一緒にがんばろう✨',
    'こんにちは！今日は何のトピックを勉強する？',
    'まずは1問からでもOK！始めてみよう！',
    '英語は毎日少しずつが大切だよ📖',
    '今日も応援してるよ！✊'
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

// ---------- Helpers ----------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
function escapeJs(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}
function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
