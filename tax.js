/* ========================================================================
   申告書チェック工房 - 法人税申告書 自主点検アシスタント
   国税庁「申告書確認表（内国法人用 R7）」に基づく自主点検支援ツール
   完全クライアントサイド動作 (PDF.js) ・ データは外部送信されません
   ======================================================================== */

if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

/* ====================================================================
   国税庁 申告書確認表（内国法人用）チェック項目
   出典: 国税庁「決算書・申告書作成時の自主点検と税務上の自主監査に
        活用できるチェックシート（申告書確認表）」令和7年版
   各項目: q=確認内容 / why=留意事項 / forms=関連別表・書類
   ==================================================================== */
const CHECKLIST = [
  { key:'common', title:'共通事項', forms:['別表全般'], items:[
    { q:'電子申告義務がある法人の場合、法人税及び地方法人税の申告書並びにこれらの申告書に添付すべきものとされている書類の全てを、電子申告により提出しようとしていますか。',
      why:'電子申告義務がある法人（当事業年度開始時の資本金等が1億円超の法人、相互会社、投資法人、特定目的会社）は、令和2年4月1日以後開始事業年度について、申告書及び添付書類（貸借対照表・損益計算書等）の全てを電子申告により提出しなければなりません（一定の場合を除く）。',
      forms:['共通'] },
    { q:'当事業年度に適用される別表を使用していますか。',
      why:'当事業年度に対応した別表を使用していない場合、税制改正に伴う改正事項が反映されず、所得金額や税額の計算に誤りが生じることがあります。',
      forms:['別表全般'] },
    { q:'各別表に記載している前事業年度からの繰越額（期首現在利益積立金額・期首現在資本金等の額を含む）は、前事業年度の申告書の金額と一致していますか。',
      why:'繰越額が前事業年度の申告書と一致していない場合、所得金額や税額の計算に誤りが生じます。特に別表五(一)の期首現在利益積立金額・資本金等の額が不一致の場合、前期に加算した項目の減算漏れ等につながります。',
      forms:['別表五(一)'] },
    { q:'組織再編成が行われた場合、適格判定を行っていますか。',
      why:'適格判定に誤りがあった場合、移転資産等に係る譲渡損益等の申告調整が必要となることがあります。',
      forms:['別表全般'] },
  ]},
  { key:'b1', title:'法人税額及び地方法人税額の計算', forms:['別表一','別表一次葉'], items:[
    { q:'別表一の14欄及び39欄に、中間申告分の税額を正しく記載していますか。',
      why:'中間申告分の税額を正しく記載していない場合、税額の計算に誤りが生じます。', forms:['別表一'] },
    { q:'地方法人税額の計算につき別表一次葉の51〜54欄により計算し、別表一次葉の65欄の金額が別表六(二)の56欄の金額と一致していますか。',
      why:'これらの金額が一致していない場合、地方法人税額の計算に誤りが生じます。', forms:['別表一次葉','別表六(二)'] },
    { q:'期末資本金1億円超の法人等である場合、年800万円以下の所得について軽減税率を適用していませんか。また適用除外事業者は、措法上の軽減税率（15％・17％）を適用していませんか。',
      why:'期末資本金等が1億円超の法人や、大法人に発行済株式等の全部を保有される法人等には軽減税率の適用はありません。適用除外事業者は措法上の軽減税率を適用できません。', forms:['別表一'] },
  ]},
  { key:'b2', title:'同族会社等の判定（別表二）', forms:['別表二'], items:[
    { q:'21欄又は22欄に記載すべきものを19欄又は20欄に記載していませんか。また、同一の株主グループに含めて判定すべき個人株主・法人株主を別グループとしていませんか。',
      why:'記載誤りの結果、同族会社等の判定に誤りがあった場合、特定同族会社の課税留保金額が生じることがあります。', forms:['別表二'] },
    { q:'17欄が50％超かつ期末資本金1億円超である場合等、別表三(一)を作成・添付していますか。',
      why:'別表三(一)を作成していない場合、特定同族会社の課税留保金額の計算に誤りが生じます。', forms:['別表二','別表三(一)'] },
    { q:'貸借対照表に自己株式を計上している場合、その株式数を1欄の内書に記載し、3欄及び12欄の記載に当たり内書きした数を分母（1欄の数）から控除していますか。',
      why:'自己株式数を分母から控除していない結果、同族会社等の判定に誤りがあった場合、特定同族会社の課税留保金額が生じることがあります。', forms:['別表二'] },
  ]},
  { key:'b3', title:'特定同族会社の留保金額に対する税額の計算（別表三(一)）', forms:['別表三(一)'], items:[
    { q:'10欄の金額は、前事業年度の11欄の金額と一致していますか。',
      why:'一致していない場合、特定同族会社の課税留保金額の計算に誤りが生じます。', forms:['別表三(一)'] },
    { q:'11欄には、当事業年度中に基準日等があり、当事業年度終了日の翌日から決算確定日までに決議があった配当等の額を記載していますか。',
      why:'株主資本等変動計算書の「当事業年度中に行った剰余金の配当」の額を記載した場合、課税留保金額の計算に誤りが生じます。', forms:['別表三(一)'] },
  ]},
  { key:'b45', title:'所得金額の計算・利益積立金額及び資本金等の額の計算（別表四・別表五(一)）', forms:['別表四','別表五(一)'], items:[
    { q:'別表四の1③「配当」欄の金額は、株主資本等変動計算書等に記載の剰余金の配当等の額と一致していますか。',
      why:'一致していない場合、特定同族会社の課税留保金額の計算に誤りが生じます。', forms:['別表四'] },
    { q:'別表四と別表五(一)の検算が合っていますか。【検算式】別表五(一)31①＋別表四52②＋別表五(一)27・29・30の③の合計 ＝ 別表五(一)31④',
      why:'中間納付額の還付金、適格合併等による移転資産、寄附修正を行った場合等には一致しないことがあります。', forms:['別表四','別表五(一)'] },
    { q:'前期以前に所得金額に加算した有価証券・ゴルフ会員権等の評価損や減損損失の額で、当期に売却等の減算事由が生じたものを減算していますか。',
      why:'これ以外にも、前期以前に申告調整した項目の受入処理が正しく行われているか併せて確認が必要です。', forms:['別表四'] },
    { q:'貸借対照表の任意引当金・繰延税金資産（負債）等の金額は、別表五(一)の④欄の金額と一致していますか。',
      why:'一致していない場合、申告調整が正しく行われておらず、所得金額の計算に誤りが生じる可能性があります。', forms:['別表五(一)'] },
    { q:'組織再編成が行われた場合、利益積立金額及び資本金等の額の調整を行っていますか。',
      why:'調整を行っていない場合、特定同族会社の課税留保金額等の計算に誤りが生じます。', forms:['別表五(一)'] },
  ]},
  { key:'b52', title:'租税公課の納付状況等（別表五(二)）', forms:['別表五(二)'], items:[
    { q:'5・10・15及び24〜29の⑤欄でプラス表示している金額を、別表四の2・3・5欄で加算していますか。',
      why:'これによっていない場合、租税公課に係る申告調整が正しく行われず、所得金額の計算に誤りが生じる可能性があります。', forms:['別表五(二)','別表四'] },
    { q:'5・10・15の⑤欄でマイナス表示している還付法人税等・還付所得税等（還付加算金を除く）で雑収入等に計上したものを、別表四の18欄又は19欄で減算していますか。',
      why:'還付額を雑収入計上したまま減算しないと、所得金額が過大となります。', forms:['別表五(二)','別表四'] },
    { q:'19の③④欄でプラス表示の事業税等を別表四13欄等で減算し、マイナス表示の還付事業税等を別表四で加算していますか。',
      why:'事業税の損金算入時期に係る調整漏れにより、所得金額の計算に誤りが生じます。', forms:['別表五(二)','別表四'] },
    { q:'「その他」の③欄の充当金取崩し又は④欄の仮払経理により納付した源泉所得税・外国法人税等の額を、別表四で減算していますか。',
      why:'減算漏れにより所得金額が過大となります。', forms:['別表五(二)','別表四'] },
    { q:'41欄の金額は、貸借対照表等の記載額（未納税額・納税充当金等）と一致していますか。',
      why:'納税充当金の期首・期末残高が貸借対照表と不一致の場合、申告調整に誤りが生じます。', forms:['別表五(二)'] },
  ]},
  { key:'b61', title:'所得税額の控除（別表六(一)）', forms:['別表六(一)'], items:[
    { q:'復興特別所得税額について所得税額控除制度の適用を受ける場合、各欄並びに8・14・21欄に所得税額及び復興特別所得税額を記載していますか。',
      why:'復興特別所得税額を記載していない場合、所得税の控除税額が過少となります。', forms:['別表六(一)'] },
    { q:'所有期間によるあん分計算を要しないにもかかわらず、あん分計算を行った金額を12欄又は19欄に記載していませんか。',
      why:'公社債・預貯金の利子、一定の投資信託の収益分配等はあん分計算不要です。あん分計算を行うと控除税額が過少となります。', forms:['別表六(一)'] },
    { q:'集団投資信託の収益分配に係る源泉所得税から控除された分配時調整外国税相当額がある場合、その金額を控除し、別表六(五の二)を作成・添付していますか。',
      why:'令和2年1月1日以後に支払を受ける分配時調整外国税相当額は、所得税額と区分して法人税額等から控除します。', forms:['別表六(一)','別表六(五の二)'] },
  ]},
  { key:'b62', title:'外国税額の控除（別表六(二)・同付表一）', forms:['別表六(二)'], items:[
    { q:'国外事業所等を通じて事業を行う場合、国外所得金額・非課税国外所得金額の計算において国外事業所等帰属所得とその他の国外源泉所得に区分し、別表六(二)付表一等を作成・添付していますか。',
      why:'帰属主義の導入に伴い、平成28年4月1日以後開始事業年度はこれらを区分して計算します。', forms:['別表六(二)','別表六(二)付表一'] },
    { q:'国外事業所等帰属所得とその他の国外源泉所得ごとに、共通費用及び共通利子の配賦計算をしていますか。',
      why:'配賦計算を行わないと国外所得金額の計算に誤りが生じます。', forms:['別表六(二)'] },
    { q:'別表六(二)の24欄及び付表一の5欄の金額は税引後の金額とし、計算明細を記載した書類を添付していますか。',
      why:'税引後としていない場合、国外所得金額が過大となり、外国税額の控除額が過大となることがあります。', forms:['別表六(二)'] },
    { q:'国外所得金額の計算において、別表四の加減算額を調整していますか。',
      why:'外国子会社配当の益金不算入額や課税対象金額等を調整していない場合、控除額の計算に誤りが生じます。', forms:['別表六(二)','別表四'] },
  ]},
  { key:'b63', title:'外国税額の繰越控除余裕額・繰越控除限度超過額の計算（別表六(三)）', forms:['別表六(三)'], items:[
    { q:'12〜29の②⑤欄の金額は、最も古い事業年度のものから順に、また同一事業年度内は国税・道府県民税・市町村民税の順に充当していますか。',
      why:'充当の順序に誤りがあった場合、外国税額の控除額の計算に誤りが生じます。', forms:['別表六(三)'] },
  ]},
  { key:'b645', title:'控除対象外国法人税額（別表六(四)〜(五)）', forms:['別表六(四)','別表六(五)'], items:[
    { q:'益金不算入の対象となる外国子会社配当等に係る外国源泉税等を別表六(四)に記載していませんか。また法法23条の2第2項1号適用配当等に係る外国源泉税等は別表六(四の二)を作成・添付していますか。',
      why:'外国子会社配当に係る外国源泉税等は、原則として外国税額控除の対象となりません。', forms:['別表六(四)','別表六(四の二)'] },
    { q:'別表六(四)の4欄・別表六(四の二)の7欄・別表六(五)の3欄は、当事業年度中の日付となっていますか。',
      why:'外国税額控除は原則として外国法人税を納付することとなる日の属する事業年度で適用します（継続適用を条件に費用計上日基準も可）。', forms:['別表六(四)','別表六(五)'] },
    { q:'別表六(四)の8欄・別表六(四の二)の9欄・別表六(五)の5欄は、租税条約及び日台民間租税取決めの限度税率を超えていませんか。',
      why:'限度税率を超える部分は外国税額控除の対象とならず、損金算入されます。', forms:['別表六(四)','別表六(五)'] },
    { q:'別表六(四)の12欄等に租税条約・相手国法令の根拠規定を記載し、みなし外国税額を証する書類を添付していますか。',
      why:'みなし外国税額控除は租税条約で定めた国・税目に限り適用されるため、適用関係を租税条約により確認する必要があります。', forms:['別表六(四)'] },
    { q:'外国法人税に該当しない税を記載していませんか。',
      why:'法人の所得を課税標準としない税や、任意に還付請求できる税（令141条3項各号）は外国法人税に該当せず、控除対象となりません。', forms:['別表六(四)'] },
  ]},
  { key:'b66', title:'法人税額から控除される特別控除額（別表六(六)）', forms:['別表六(六)'], items:[
    { q:'複数の法人税額の特別控除制度の適用を受ける場合、各制度の別表に記載した当期税額控除可能額を転記していますか。',
      why:'税額控除可能額の合計が調整前法人税額の90％相当額を超える場合、超える部分は控除されず各制度の繰越税額控除限度超過額となります。', forms:['別表六(六)'] },
  ]},
  { key:'b67', title:'特定税額控除規定の適用可否の判定（別表六(七)）', forms:['別表六(七)'], items:[
    { q:'中小企業者に該当しない・適用除外事業者に該当する場合で一定の特別控除制度の適用を受けるとき、別表六(七)を作成・添付し、6・7・11・12・16欄のいずれかが「該当」となっていますか。',
      why:'一般／特別試験研究費の特別控除、地域経済牽引事業、生産工程効率化等設備の特別控除等が対象です。', forms:['別表六(七)'] },
  ]},
  { key:'b69', title:'試験研究費の特別控除（別表六(九)・(十)・(十一)・(十二)）', forms:['別表六(九)','別表六(十一)','別表六(十二)'], items:[
    { q:'別表六(九)（中小は(十)）の1欄及び別表六(十二)の1欄の金額は、棚卸資産・固定資産・繰延資産に係るものを除き、申告調整額を加減算した税務上の金額となっていますか。他の者から受けた試験研究費充当金は控除していますか。',
      why:'試験研究費の額が税務上の金額となっていない場合、税額の控除額の計算に誤りが生じます。売上原価等は試験研究費に含まれません。', forms:['別表六(九)','別表六(十二)'] },
    { q:'別表六(十一)の比較試験研究費の各調整対象年度2欄の金額は、申告調整額を加減算した税務上の金額で、当事業年度に適用される規定により計算していますか。',
      why:'各調整対象年度の金額が税務上の金額でない場合、控除額の計算に誤りが生じます。', forms:['別表六(十一)'] },
    { q:'別表六(十一)の平均売上金額の各売上調整年度7欄及び当期9欄の金額は、申告調整額を加減算した税務上の金額となっていますか。',
      why:'税務上の金額でない場合、税額の控除額の計算に誤りが生じます。', forms:['別表六(十一)'] },
    { q:'別表六(十一)の調整対象年度・売上調整年度に、試験研究費の額がない事業年度を含めて5欄・10欄を計算していますか。',
      why:'当事業年度開始の日前3年以内に開始した各事業年度（試験研究費がない年度を含む）を含める必要があります。', forms:['別表六(十一)'] },
    { q:'合併等が行われた場合、比較試験研究費の額及び平均売上金額の調整を行い、所定の書類を添付していますか。',
      why:'調整を行わない場合、税額の控除額の計算に誤りが生じます。', forms:['別表六(十一)'] },
  ]},
  { key:'b624', title:'給与等の支給額が増加した場合の特別控除（別表六(二十四)・同付表一）', forms:['別表六(二十四)'], items:[
    { q:'別表六(二十四)の5欄は前事業年度の4欄と、16欄に記載がある場合は前事業年度の15欄と一致していますか。',
      why:'比較雇用者給与等支給額・比較教育訓練費の額は、決算期変更や組織再編成があった場合等を除き前事業年度の金額と一致します。', forms:['別表六(二十四)'] },
    { q:'給与等に充てるため他の者から支払を受ける金額・雇用安定助成金額がある場合、別表六(二十四)付表一の2欄・3欄に記載していますか。',
      why:'記載すべき金額を記載しないと税額の控除額の計算に誤りが生じます。8・9・15・16欄も同様です。', forms:['別表六(二十四)付表一'] },
    { q:'別表六(二十四)の4・11欄並びに5・12欄の金額は、当事業年度に適用される規定により計算していますか。',
      why:'令和6年度改正により、令和6年4月1日以後開始事業年度は役務提供対価を除いて計算します。', forms:['別表六(二十四)'] },
  ]},
  { key:'b71', title:'欠損金の損金算入等（別表七(一)・同付表一）', forms:['別表七(一)'], items:[
    { q:'別表七(一)の2欄の損金算入限度額は、欠損金控除前の所得金額の50％相当額となっていますか（中小法人等・更生手続中・設立7年内の法人等は100％）。',
      why:'期末資本金1億円以下で大法人に全部保有されない法人等、更生手続中、設立後7年内の法人等は100％相当額となります。', forms:['別表七(一)'] },
    { q:'適格合併等に係る被合併法人等に未処理欠損金額がある場合等、別表七(一)付表一を作成・添付していますか。',
      why:'支配関係5年継続要件・みなし共同事業要件のいずれも満たさない場合、欠損金の引継ぎ・使用が制限（切捨て）されます。', forms:['別表七(一)付表一'] },
  ]},
  { key:'b81', title:'受取配当等の益金不算入（別表八(一)）', forms:['別表八(一)'], items:[
    { q:'9・16・26・33欄の金額に、益金不算入の対象とならないもの（公社債の利子、公社債投資信託の収益分配、不動産投資信託の収益分配、外国法人・特定目的会社・投資法人からの配当、匿名組合分配等）を含めていませんか。',
      why:'生命保険の契約者配当金、協同組合等の事業分量配当金等も益金不算入の対象となりません。', forms:['別表八(一)'] },
    { q:'9欄の金額に、完全子法人株式等に係る配当等に該当しないものを含めていませんか。',
      why:'完全子法人株式等は計算期間を通じて完全支配関係があった内国法人の株式等をいいます（令和4年4月1日以後はグループ全体で判定）。', forms:['別表八(一)'] },
    { q:'14欄の金額に、関連法人株式等（保有割合1/3超）に係る配当等に該当しないものを含めていませんか。',
      why:'関連法人株式等は基準日の翌日から引き続き保有割合1/3超で保有する株式等をいいます。', forms:['別表八(一)'] },
    { q:'24欄の金額に、その他株式等に係る配当等に該当しないものを含めていませんか。',
      why:'その他株式等は完全子法人・関連法人・非支配目的株式等のいずれにも該当しない株式等です。', forms:['別表八(一)'] },
    { q:'31欄の金額に、非支配目的株式等（保有割合5％以下）に係る配当等に該当しないものを含めていませんか。',
      why:'外国株価指数連動型以外の特定株式投資信託（ETF）の収益分配は、非支配目的株式等として益金不算入の対象となります。', forms:['別表八(一)'] },
  ]},
  { key:'b82', title:'外国子会社から受ける配当等の益金不算入等（別表八(二)）', forms:['別表八(二)'], items:[
    { q:'5欄は、25％（租税条約で軽減されている場合はその割合）以上となっていますか。',
      why:'保有割合の判定に当たっては、自己株式を除きます。', forms:['別表八(二)'] },
    { q:'7欄は、当事業年度中の日付となっていますか。',
      why:'継続して支払を受けた日の属する事業年度の収益としている場合、当事業年度中の日付とならないことがあります。', forms:['別表八(二)'] },
    { q:'8欄は、6月以上の期間となっていますか。',
      why:'配当等の額の支払義務確定日以前6月以上継続保有している株式等が対象です。', forms:['別表八(二)'] },
    { q:'27欄の金額（損金不算入とされる外国源泉税等）を別表四で加算していますか。',
      why:'損金不算入とされる外国源泉税等は、外国税額控除の国外所得金額の計算に含まれます。', forms:['別表八(二)','別表四'] },
  ]},
  { key:'b106', title:'収用換地等の所得の特別控除等（別表十(六)・同付表・別表十三(四)）', forms:['別表十(六)','別表十三(四)'], items:[
    { q:'別表十(六)の3欄は、2欄に記載した日（買取り等の申出日）から6月を経過した日までの日付となっていますか。',
      why:'申出日から6月経過後に譲渡した資産は、所得の特別控除の適用を受けられません（圧縮記帳は可）。', forms:['別表十(六)'] },
    { q:'建物を取り壊して土地を譲渡している場合、別表十(六)14欄又は別表十三(四)12欄の金額に建物の帳簿価額・取壊費用等を含めていますか。',
      why:'建物の帳簿価額等は譲渡経費に該当します。含めない場合、特別控除額や圧縮限度額の計算に誤りが生じます（廃材売却代金は譲渡経費から控除。帳簿価額は税務上の金額）。', forms:['別表十(六)','別表十三(四)'] },
    { q:'同一事業年度内の同一暦年において、所得の特別控除と圧縮記帳（特別勘定設定を含む）を重複適用していませんか。',
      why:'同一暦年では重複適用できません。異なる暦年では暦年ごとに選択適用できます。', forms:['別表十(六)'] },
    { q:'同一暦年での所得の特別控除額の合計が5,000万円を超えていませんか（完全支配関係グループ全体で判定）。',
      why:'令和4年4月1日以後開始事業年度の5,000万円は、完全支配関係があるグループ全体で判定します。別表十(六)付表は譲渡資産ごとに作成・添付します。', forms:['別表十(六)'] },
  ]},
  { key:'b135', title:'特定資産の買換えの圧縮額等の損金算入（別表十三(五)）', forms:['別表十三(五)'], items:[
    { q:'適用を受けようとする譲渡資産・買換資産は措法65条の7第1項の表の各号の要件を満たし、届出書に記載した買換資産となっていますか。',
      why:'対象資産は税制改正で見直されることが多く、法令適合を確認する必要があります。令和6年4月1日以後の譲渡は、一事業年度内の譲渡・取得につき事前届出が要件に追加されました。', forms:['別表十三(五)'] },
    { q:'建物を取り壊して土地を譲渡している場合、9欄の金額に建物の帳簿価額・取壊費用等を含めていますか。',
      why:'建物の帳簿価額等は譲渡経費に該当します。含めない場合、圧縮限度額の計算に誤りが生じます（帳簿価額は税務上の金額）。', forms:['別表十三(五)'] },
    { q:'買換資産が措法65条の7第1項の表第3号下欄の土地等である場合、その面積は300㎡以上となっていますか。',
      why:'面積要件を満たさない場合、買換えの特例の適用を受けられません（特定施設の敷地・駐車場用に限る）。', forms:['別表十三(五)'] },
    { q:'買換資産が土地等の場合、21欄に20欄のうち5欄の5倍を超える部分の面積を記載し、明細を別紙添付していますか。',
      why:'譲渡土地等の面積の5倍を超える部分は買換資産とすることができません。', forms:['別表十三(五)'] },
    { q:'譲渡資産が集中地域以外・買換資産が集中地域内の場合、「80/100」の圧縮割合で29欄を算出していませんか。',
      why:'地域区分により圧縮割合（90/100・80/100・75/100・70/100・60/100）が異なります。所有期間10年超の国内資産間の買換えは原則80/100です。', forms:['別表十三(五)'] },
    { q:'一定期間内に買換資産を取得しなかった場合、45欄に益金算入される特別勘定の金額を記載していますか。',
      why:'譲渡日を含む事業年度の翌事業年度開始日から1年以内（承認期間）に取得しないと、特別勘定の金額は益金算入されます。', forms:['別表十三(五)'] },
  ]},
  { key:'b142', title:'寄附金の損金算入（別表十四(二)）', forms:['別表十四(二)'], items:[
    { q:'10欄の金額は、別表五(一)の32④欄＋33④欄の合計額を記載していますか。',
      why:'資本金等の額に基づく損金算入限度額の計算に用います。', forms:['別表十四(二)','別表五(一)'] },
    { q:'損金算入限度額の計算を、当事業年度に適用される基準（資本金＋資本準備金又は出資金）で行っていますか。',
      why:'令和4年4月1日以後開始事業年度は、資本金の額及び資本準備金の額の合計額又は出資金の額を基礎として計算します。', forms:['別表十四(二)'] },
  ]},
  { key:'b146', title:'完全支配関係がある法人間取引の損益調整（別表十四(六)）', forms:['別表十四(六)'], items:[
    { q:'5欄の金額（譲渡損益調整資産の譲渡原価）は、1,000万円以上の金額を記載していますか。',
      why:'譲渡損益調整資産は譲渡直前の帳簿価額が1,000万円以上の固定資産・土地等・有価証券（売買目的を除く）・金銭債権・繰延資産等をいい、手数料等の付随費用は原価に含まれません。', forms:['別表十四(六)'] },
    { q:'譲渡損益調整資産が減価償却資産又は繰延資産である場合、13欄又は16欄に金額を記載していますか。',
      why:'戻入れ計算は原則法又は簡便法を資産ごとに選択でき、適用後は継続適用が必要です。', forms:['別表十四(六)'] },
    { q:'譲渡損益調整額の戻入れ計算を、譲渡年度に適用した原則法又は簡便法により継続適用していますか。',
      why:'譲渡年度に適用した方法を、その後の年度も継続適用する必要があります。', forms:['別表十四(六)'] },
  ]},
  { key:'b15', title:'交際費等の損金算入（別表十五）', forms:['別表十五'], items:[
    { q:'資本金等100億円超の法人である場合、9欄を記載していませんか。また資本金等1億円超の法人等である場合、3欄（定額控除限度額）の計算をしていませんか。',
      why:'資本金等100億円超は接待飲食費の50％控除も適用なし。資本金等1億円超の法人等は定額控除（年800万円）の適用がありません。', forms:['別表十五'] },
    { q:'交際費等の額に係る控除対象外消費税額等を、支出交際費等の額の明細の各欄に記載していますか。',
      why:'控除対象外消費税額等も交際費等の額に含めて損金不算入額を計算します。', forms:['別表十五'] },
  ]},
  { key:'b16', title:'減価償却資産の償却額の計算（別表十六(一)・(二)・特別償却付表）', forms:['別表十六(一)','別表十六(二)'], items:[
    { q:'平成28年4月1日以後に取得した建物附属設備・構築物（及び鉱業用のうち建物等）の償却方法について、定率法を適用していませんか。',
      why:'平成28年度改正により、これらの資産は定率法を適用できません（定額法）。', forms:['別表十六(二)'] },
    { q:'特別償却の適用を受けた資産について、措法による圧縮記帳又は他の特別償却を重複適用していませんか。',
      why:'法法による圧縮記帳との重複は可能ですが、措法による圧縮記帳・他の特別償却との重複適用はできません。', forms:['特別償却付表'] },
    { q:'特別償却の制度ごとに適用すべき基準取得価額割合及び償却率によって計算していますか。',
      why:'基準取得価額割合・償却率は税制改正で見直されることが多く、法令適合を確認する必要があります。', forms:['特別償却付表'] },
    { q:'中小企業者向けの特別償却・特別控除について、中小企業者に該当しない又は適用除外事業者に該当する場合に適用していませんか。',
      why:'資本金1億円以下でも、大規模法人の子会社である等一定の要件に該当する場合は中小企業者に該当しません。', forms:['別表十六(一)','別表十六(二)'] },
  ]},
  { key:'b173', title:'外国関係会社に係る課税対象金額等の計算（別表十七(三)・(三の二)・(三の五)）', forms:['別表十七(三)','別表十七(三の二)','別表十七(三の五)'], items:[
    { q:'租税負担割合20％未満の外国関係会社（特定外国関係会社等を除く）又は27％未満の特定外国関係会社を有する場合、別表十七(三)等を作成・添付していますか。',
      why:'合算課税の適用を受けない場合でも、これらの会社の財務諸表・申告書等を添付する必要があります。', forms:['別表十七(三)'] },
    { q:'別表十七(三)等の各欄は、添付した外国関係会社の財務諸表・申告書等の記載内容と一致していますか。',
      why:'記載内容が一致していない場合、課税対象金額の計算に誤りが生じます。', forms:['別表十七(三)'] },
    { q:'別表十七(三の二)24欄は、2欄の事業年度中に確定した法人所得税の額を記載していますか（その事業年度の所得に対する税額を記載していませんか）。',
      why:'当該事業年度の所得に対する法人所得税の額を記載した場合、課税対象金額の計算に誤りが生じます。', forms:['別表十七(三の二)'] },
    { q:'換算レート（別表十七(三の二)28欄・(三の五)36・37欄）は、事業年度終了の日の翌日から4月を経過する日のTTMを適用していますか（自社決算日のTTM継続適用も可）。',
      why:'自社決算日のTTMを継続適用する場合、2以上の外国関係会社の全てにつき同じレートを適用する必要があります。', forms:['別表十七(三の二)','別表十七(三の五)'] },
    { q:'別表十七(三の五)6・8・12欄は、4欄の事業年度の所得に係る外国法人税額・適用対象金額・課税対象金額を記載し、申告書等を添付していますか。',
      why:'4欄の事業年度が別表十七(三の二)2欄と異なる場合、4欄の事業年度に係る金額を記載する必要があります。', forms:['別表十七(三の五)'] },
  ]},
  { key:'b1737', title:'特定課税対象金額等がある場合の外国法人からの配当等の益金不算入等（別表十七(三の七)）', forms:['別表十七(三の七)'], items:[
    { q:'5欄は、当事業年度中の日付となっていますか。',
      why:'継続して支払を受けた日の属する事業年度の収益としている場合、当事業年度中の日付とならないことがあります。', forms:['別表十七(三の七)'] },
  ]},
  { key:'b174', title:'国外関連者（別表十七(四)）', forms:['別表十七(四)'], items:[
    { q:'国外関連者との取引がある場合、全ての国外関連者について「国外関連者の名称等」欄及び「取引状況等」欄を記載していますか（対価の授受がない取引も含む）。',
      why:'記載がない場合、移転価格上の問題の有無を正しく判定できず、所得金額の計算に誤りが生じることがあります。', forms:['別表十七(四)'] },
  ]},
  { key:'bspl', title:'B/S・P/L・勘定科目内訳明細書', forms:['貸借対照表','損益計算書','勘定科目内訳明細書'], items:[
    { q:'【評価損等】有価証券・ゴルフ会員権等の評価損又は減損損失の額のうち、税務上損金算入されない金額を別表四で加算していますか。',
      why:'資産の評価損の計上に当たっては、物損等の事実や法的整理の事実が生じているかを確認する必要があります。', forms:['損益計算書','別表四'] },
    { q:'【役員給与】役員給与等の内訳書の「事前確定届出給与」欄の金額は、事前確定届出給与に関する届出書に記載した金額と一致していますか。',
      why:'届け出た支給額と実際の支給額が異なる場合、実際の支給額の全額が損金不算入となります。確定数給与は交付決議時価額が損金算入額です。', forms:['勘定科目内訳明細書'] },
    { q:'【役員給与】業績連動給与の額を損金算入している場合、非同族会社又は非同族会社による完全支配関係がある同族会社に該当していますか。',
      why:'非同族会社による完全支配関係がない同族会社が支給した業績連動給与は損金不算入です。', forms:['勘定科目内訳明細書'] },
    { q:'【役員給与】役員給与のうち、定期同額給与・事前確定届出給与・損金となる業績連動給与のいずれにも該当しないものを別表四で加算していますか。',
      why:'使用人兼務役員の使用人職務分を除く役員給与で、上記いずれにも該当しないものは損金不算入です。出向役員に係る給与負担金も確認が必要です。', forms:['別表四'] },
    { q:'【役員給与】使用人兼務役員になれない役員（専務・常務・監査役等）に対する給与を「使用人職務分」欄に記載していませんか。',
      why:'非常勤役員も使用人兼務役員になれません。「使用人職務分」に金額がある場合、職制上の地位を「役職名」「担当業務」欄に記載しているか確認します。', forms:['勘定科目内訳明細書'] },
    { q:'【特別損失・雑損失等】損金算入されない租税公課・罰科金等の額を別表四で加算していますか。',
      why:'罰金・科料に相当する外国又は外国の地方公共団体により課されるものも別表四で加算する必要があります。', forms:['損益計算書','別表四'] },
  ]},
  { key:'shohi', title:'消費税及び地方消費税の申告書（一般用）・添付書類', forms:['消費税申告書','付表'], items:[
    { q:'電子申告義務がある法人の場合、消費税・地方消費税の申告書及び添付書類（付表1-3等）の全てを電子申告により提出しようとしていますか。',
      why:'資本金等1億円超の法人等は、令和2年4月1日以後開始課税期間について全て電子申告で提出しなければなりません。', forms:['消費税申告書'] },
    { q:'申告書第一表①欄の金額は、付表2-1①のD・E欄又は2-3①のA・B欄の1,000円未満切捨て後の金額の合計額と一致していますか。',
      why:'法人税の申告で課税売上げに係る申告調整がある場合、調整後の金額を記載します。返還等対価がある場合は加算します。', forms:['消費税申告書','付表'] },
    { q:'非居住者から受け取る利子等がある場合、付表2-1③F欄又は2-3③C欄に記載していますか。',
      why:'債務者が非居住者である金銭の貸付け・国債等は輸出取引とみなされ、課税売上割合の分母分子に算入されます。', forms:['付表'] },
    { q:'付表2-1⑥F欄又は2-3⑥C欄（非課税売上）に、有価証券譲渡対価の5％・土地譲渡対価・受取利子・集団投資信託収益分配・社宅家賃等を含めていますか。',
      why:'非課税売上額に誤りがあると課税売上割合が変動し、控除対象仕入税額の計算に誤りが生じます。', forms:['付表'] },
    { q:'売上税額を積上げ計算している場合、仕入税額を割戻し計算していませんか（経過措置適用の仕入税額も同様）。',
      why:'売上税額を積上げ計算する場合、仕入税額も積上げ計算とします。売上税額が割戻し計算なら仕入税額はいずれかを選択できます。', forms:['付表'] },
    { q:'課税売上高5億円超又は課税売上割合95％未満であるにもかかわらず、課税仕入れに係る消費税額を全額控除していませんか。',
      why:'この場合は個別対応方式又は一括比例配分方式により控除税額を計算する必要があります。', forms:['付表'] },
    { q:'貸倒れに係る税額について、税抜相当額（6.24/108・7.8/110等）で計算し、不課税・非課税取引に係る貸倒れを控除対象としていませんか。',
      why:'地方消費税額を含めた割合（5/105・8/108・10/110等）で記載すると、貸倒れに係る税額が過大となります。', forms:['付表'] },
    { q:'課税売上割合95％未満かつ特定課税仕入れ（リバースチャージ）がある場合、第二表⑧〜⑩欄に支払対価の額を記載していますか。',
      why:'課税売上割合に準ずる割合が95％以上でも、課税売上割合が95％未満ならリバースチャージ方式による申告が必要です。', forms:['消費税申告書'] },
    { q:'申告書第一表⑩・㉑欄について、消費税・地方消費税の集計・配賦誤りや中間申告11回目分の記載漏れはありませんか。',
      why:'集計・配賦誤りは修正申告・更正の請求につながります。課税期間末日に納期限未到来の中間11回目分の記載漏れも確認します。', forms:['消費税申告書'] },
    { q:'法人税申告書別表四の加減算項目中、消費税法上課税取引となるものについて、消費税申告書で調整を行っていますか。',
      why:'課税売上割合の計算上、免税取引・非課税取引についても調整が必要です。', forms:['消費税申告書','別表四'] },
    { q:'申告書第一表㉖欄の金額は、貸借対照表と別表五(一)の未払（未収）消費税額等の合計額と一致していますか。',
      why:'加減算項目の調整を行った場合は、調整額を考慮した金額と一致します。', forms:['消費税申告書','別表五(一)'] },
    { q:'控除対象外消費税額等を損金算入している場合、別表十六(十)を添付し、課税売上割合80％未満なら繰延消費税額等の損金算入限度額を計算していますか。',
      why:'別表十六(十)の各欄の消費税額等は、消費税額と地方消費税額の合計額を記載します。', forms:['別表十六(十)'] },
  ]},
  { key:'attach', title:'法人税確定申告書への添付書類', forms:['添付書類'], items:[
    { q:'法人税の確定申告書に、貸借対照表・損益計算書（販管費内訳書を含む）を添付していますか。',
      why:'確定申告書には貸借対照表及び損益計算書の添付が必要です。', forms:['貸借対照表','損益計算書'], auto:'attach_bspl' },
    { q:'株主資本等変動計算書等（株主資本等変動計算書・社員資本等変動計算書又は損益金の処分表）を添付していますか。',
      why:'剰余金の配当等の額の確認に用いられます。', forms:['株主資本等変動計算書'], auto:'attach_sshs' },
    { q:'勘定科目内訳明細書を添付していますか。',
      why:'役員給与等の内訳・各勘定科目の内訳の確認に用いられます。', forms:['勘定科目内訳明細書'], auto:'attach_uchiwake' },
    { q:'会社事業概況書（完全支配関係がある法人との関係を示した図を含む）を添付していますか。',
      why:'税務署所管法人用の法人事業概況説明書とは異なります。⑩欄に申告書確認表等の活用状況を記載します。', forms:['会社事業概況書'], auto:'attach_gaikyo' },
    { q:'組織再編成が行われた場合、契約書等の写し及び主要な事項の明細書を添付していますか。',
      why:'組織再編成が行われた場合に必要となる添付書類です。', forms:['添付書類'] },
    { q:'適用額明細書（税額又は所得金額を減少させる特別措置の適用を受ける場合）を添付していますか。',
      why:'租特透明化法第3条により、法人税関係特別措置の適用を受ける場合に添付が必要です。', forms:['適用額明細書'], auto:'attach_tekiyo' },
  ]},
];

/* ---------- 添付書類・別表 検出キーワード ---------- */
const DETECT = {
  // ドキュメント分類
  docs: {
    '法人税申告書': ['法人税','地方法人税','別表一','内国法人の確定申告','課税標準'],
    '決算書(B/S・P/L)': ['貸借対照表','損益計算書','資産の部','負債の部','純資産の部'],
    '勘定科目内訳明細書': ['勘定科目内訳','内訳明細書','内訳書'],
    '消費税申告書': ['消費税及び地方消費税','課税標準額','消費税申告','付表'],
  },
  // 添付書類（item.auto に対応）
  attach: {
    attach_bspl:   { label:'貸借対照表・損益計算書', kw:['貸借対照表','損益計算書'] },
    attach_sshs:   { label:'株主資本等変動計算書等', kw:['株主資本等変動計算書','社員資本等変動計算書','損益金の処分'] },
    attach_uchiwake:{ label:'勘定科目内訳明細書', kw:['勘定科目内訳','内訳明細書'] },
    attach_gaikyo: { label:'会社事業概況書', kw:['会社事業概況書','事業概況'] },
    attach_tekiyo: { label:'適用額明細書', kw:['適用額明細書'] },
  },
  // 別表インベントリ（正規化後の検出トークン）
  forms: [
    '別表一','別表二','別表三(一)','別表四','別表五(一)','別表五(二)',
    '別表六(一)','別表六(二)','別表六(三)','別表六(四)','別表六(五)','別表六(六)',
    '別表六(七)','別表六(九)','別表六(十)','別表六(十一)','別表六(十二)','別表六(二十四)',
    '別表七(一)','別表八(一)','別表八(二)','別表十(六)','別表十三(四)','別表十三(五)',
    '別表十四(二)','別表十四(六)','別表十五','別表十六(一)','別表十六(二)','別表十六(十)',
    '別表十七(三)','別表十七(四)',
  ],
};

/* ====================================================================
   State
   ==================================================================== */
const state = {
  files: [],            // {name,size,pages,hasText,chars,status}
  text: '',             // 全PDF結合テキスト（正規化前）
  normText: '',         // 正規化テキスト（検出用）
  detected: { docs:[], attach:{}, forms:[] },
  profile: {
    period: '',
    capital: '',          // 期末資本金の額（円）
    isOver1oku: false,    // 資本金1億円超
    isDozoku: false,      // 同族会社
    isTokuteiDozoku: false,// 特定同族会社
    isChusho: false,      // 中小企業者
    isTekiyojogai: false, // 適用除外事業者
    isEtaxObligated: false,// 電子申告義務
  },
  // チェック状態: status[sectionKey+'_'+idx] = {status:'',memo:''}
  status: {},
};

const STATUS_LABELS = {
  '': '未確認',
  ok: '確認済',
  na: '該当なし',
  warn: '要修正',
};

/* ====================================================================
   ナビゲーション
   ==================================================================== */
function showStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step-${n}`).classList.add('active');
  document.querySelectorAll('.nav-item[data-step]').forEach(i => i.classList.remove('active'));
  document.querySelector(`.nav-item[data-step="${n}"]`)?.classList.add('active');
  if (n === 3) renderChecklist();
  if (n === 4) generateSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ====================================================================
   PDF ドロップ・テキスト抽出
   ==================================================================== */
function initDropZone() {
  const dz = document.getElementById('dropZone');
  const input = document.getElementById('fileInput');
  if (!dz) return;
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
  const pdfs = Array.from(fileList).filter(f =>
    f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
  if (!pdfs.length) { setStatus('PDFファイルが見つかりませんでした。', 'error'); return; }

  for (const f of pdfs) {
    const rec = { name: f.name, size: f.size, pages: 0, hasText: false, chars: 0, status: '解析中…' };
    state.files.push(rec);
    renderFileList();
    try {
      const { text, pages, chars } = await extractPDFText(f);
      rec.pages = pages;
      rec.chars = chars;
      rec.hasText = chars > 30;
      rec.status = rec.hasText ? '✓ 解析済' : '⚠ テキスト無し（スキャン）';
      state.text += `\n\n===== ${f.name} =====\n${text}`;
    } catch (err) {
      console.error(err);
      rec.status = '✗ 失敗';
      rec.error = true;
    }
    renderFileList();
  }

  state.normText = normalize(state.text);
  runDetection();
  renderDetection();
  document.getElementById('toStep2').disabled = state.files.length === 0;
  setStatus(`${state.files.length}件のPDFを読み込みました。`, 'ok');
}

async function extractPDFText(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let lines = [];
  let chars = 0;
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const rows = {};
    for (const item of content.items) {
      const y = Math.round(item.transform[5]);
      let key = null;
      for (const k of Object.keys(rows)) { if (Math.abs(k - y) < 4) { key = k; break; } }
      if (key === null) key = y;
      (rows[key] = rows[key] || []).push({ x: item.transform[4], str: item.str });
      chars += (item.str || '').length;
    }
    const sortedKeys = Object.keys(rows).map(Number).sort((a, b) => b - a);
    for (const k of sortedKeys) {
      const line = rows[k].sort((a, b) => a.x - b.x).map(s => s.str).join(' ').replace(/\s+/g, ' ').trim();
      if (line) lines.push(line);
    }
  }
  return { text: lines.join('\n'), pages: pdf.numPages, chars };
}

/* ====================================================================
   検出ロジック
   ==================================================================== */
function normalize(s) {
  return (s || '')
    .replace(/[（）]/g, m => (m === '（' ? '(' : ')'))
    .replace(/[\s　]/g, '')
    .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
}

function runDetection() {
  const t = state.normText;
  // docs
  state.detected.docs = [];
  for (const [name, kws] of Object.entries(DETECT.docs)) {
    if (kws.some(kw => t.includes(normalize(kw)))) state.detected.docs.push(name);
  }
  // attachments
  state.detected.attach = {};
  for (const [id, def] of Object.entries(DETECT.attach)) {
    state.detected.attach[id] = def.kw.some(kw => t.includes(normalize(kw)));
  }
  // forms
  state.detected.forms = DETECT.forms.filter(f => t.includes(normalize(f)));
  // 自動推定: 資本金（最初に出現する「資本金（の額）」近傍の数値）
  guessCapital();
  // 同族会社の手掛かり
  if (t.includes('同族会社') || state.detected.forms.includes('別表二')) state.profile.isDozoku = true;
}

function guessCapital() {
  if (state.profile.capital) return;
  // 「資本金」の直後に現れる数値（円・千円表記を考慮）
  const m = state.text.match(/資本金(?:の額)?[^\d０-９]{0,12}([0-9０-９,，]{4,})/);
  if (m) {
    const num = parseInt(normalize(m[1]).replace(/,/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      state.profile.capital = String(num);
      state.profile.isOver1oku = num > 100000000;
    }
  }
}

/* ====================================================================
   レンダリング: ファイル一覧・検出結果
   ==================================================================== */
function renderFileList() {
  const el = document.getElementById('fileList');
  if (!state.files.length) { el.innerHTML = ''; return; }
  el.innerHTML = state.files.map((f, i) => `
    <div class="file-row ${f.error ? 'err' : ''}">
      <span class="file-ic">📄</span>
      <div class="file-meta">
        <div class="file-name">${escapeHtml(f.name)}</div>
        <div class="file-sub">${f.pages ? f.pages + 'ページ・' : ''}${formatBytes(f.size)}</div>
      </div>
      <span class="file-status ${f.hasText ? 'st-ok' : (f.error ? 'st-err' : 'st-warn')}">${f.status}</span>
      <button class="file-del" onclick="removeFile(${i})" title="削除">✕</button>
    </div>`).join('');
}

function removeFile(i) {
  state.files.splice(i, 1);
  // テキストは全消去して残ファイルがあれば注意（簡易化のため再解析を促す）
  if (!state.files.length) { state.text = ''; state.normText = ''; }
  renderFileList();
  runDetection();
  renderDetection();
  document.getElementById('toStep2').disabled = state.files.length === 0;
}

function renderDetection() {
  const box = document.getElementById('detectBox');
  if (!box) return;
  if (!state.files.length) { box.innerHTML = ''; return; }
  const d = state.detected;
  const docBadges = d.docs.length
    ? d.docs.map(x => `<span class="badge b-doc">${escapeHtml(x)}</span>`).join('')
    : '<span class="muted">分類できませんでした</span>';
  const formBadges = d.forms.length
    ? d.forms.map(x => `<span class="badge b-form">${escapeHtml(x)}</span>`).join('')
    : '<span class="muted">別表を検出できませんでした（スキャンPDFの可能性）</span>';
  const scanned = state.files.filter(f => !f.hasText && !f.error);
  box.innerHTML = `
    <div class="detect-grp">
      <div class="detect-label">検出した書類</div>
      <div class="detect-badges">${docBadges}</div>
    </div>
    <div class="detect-grp">
      <div class="detect-label">検出した別表（${d.forms.length}）</div>
      <div class="detect-badges">${formBadges}</div>
    </div>
    ${scanned.length ? `<div class="detect-warn">⚠ ${scanned.length}件のPDFはテキストが抽出できませんでした（画像スキャン）。自動検出・自動チェックは行えないため、手動で確認してください。</div>` : ''}
  `;
}

/* ====================================================================
   会社プロファイル
   ==================================================================== */
function bindProfile() {
  const p = state.profile;
  const cap = document.getElementById('pf-capital');
  if (cap) {
    cap.value = p.capital;
    cap.addEventListener('input', () => {
      p.capital = cap.value.replace(/[^\d]/g, '');
      const n = parseInt(p.capital, 10);
      p.isOver1oku = !isNaN(n) && n > 100000000;
      document.getElementById('pf-over1oku').checked = p.isOver1oku;
      cap.value = p.capital ? Number(p.capital).toLocaleString() : '';
    });
  }
  const period = document.getElementById('pf-period');
  if (period) period.addEventListener('input', () => p.period = period.value);
  const map = {
    'pf-over1oku':'isOver1oku', 'pf-dozoku':'isDozoku', 'pf-tokutei':'isTokuteiDozoku',
    'pf-chusho':'isChusho', 'pf-tekiyojogai':'isTekiyojogai', 'pf-etax':'isEtaxObligated',
  };
  for (const [id, key] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) { el.checked = p[key]; el.addEventListener('change', () => p[key] = el.checked); }
  }
}

function syncProfileToForm() {
  const p = state.profile;
  const cap = document.getElementById('pf-capital');
  if (cap) cap.value = p.capital ? Number(p.capital).toLocaleString() : '';
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.checked = !!v; };
  set('pf-over1oku', p.isOver1oku); set('pf-dozoku', p.isDozoku);
  set('pf-tokutei', p.isTokuteiDozoku); set('pf-chusho', p.isChusho);
  set('pf-tekiyojogai', p.isTekiyojogai); set('pf-etax', p.isEtaxObligated);
  const period = document.getElementById('pf-period'); if (period) period.value = p.period;
}

/* ====================================================================
   チェックリスト描画
   ==================================================================== */
function itemId(sk, i) { return `${sk}_${i}`; }

function autoEval(item) {
  // item.auto に応じた自動判定（参考）。{status,msg} を返す
  if (!item.auto) return null;
  if (!state.normText) return { state:'unknown', msg:'PDF未読込のため自動判定できません' };
  if (item.auto.startsWith('attach_')) {
    const found = state.detected.attach[item.auto];
    return found
      ? { state:'found', msg:'該当書類のキーワードを検出しました' }
      : { state:'missing', msg:'該当書類のキーワードを検出できませんでした（添付漏れの可能性／スキャンPDF）' };
  }
  return null;
}

function formDetected(formName) {
  return state.detected.forms.some(f => normalize(f) === normalize(formName) ||
    normalize(f).startsWith(normalize(formName)) || normalize(formName).startsWith(normalize(f)));
}

function renderChecklist() {
  const root = document.getElementById('checklistRoot');
  const hideUnrelated = document.getElementById('filterUnrelated')?.checked;
  let html = '';
  for (const sec of CHECKLIST) {
    const items = sec.items.map((it, i) => ({ it, i }));
    const rows = items.map(({ it, i }) => {
      const id = itemId(sec.key, i);
      const st = state.status[id] || { status:'', memo:'' };
      const auto = autoEval(it);
      // 関連別表の検出状況
      const related = (it.forms || []).filter(f => f.startsWith('別表'));
      const relatedDetected = related.filter(f => formDetected(f));
      const relevance = related.length === 0 ? 'na'
        : relatedDetected.length ? 'hit' : 'miss';
      if (hideUnrelated && relevance === 'miss') return '';
      const autoBadge = auto ? `<span class="auto-badge auto-${auto.state}">自動: ${auto.state === 'found' ? '検出' : auto.state === 'missing' ? '未検出' : '—'}</span>` : '';
      const formBadges = (it.forms || []).map(f => {
        const hit = formDetected(f);
        return `<span class="mini-badge ${hit ? 'mb-hit' : ''}">${escapeHtml(f)}${hit ? ' ✓' : ''}</span>`;
      }).join('');
      return `
        <div class="check-item state-${st.status || 'none'}" data-id="${id}">
          <div class="ci-head">
            <div class="ci-q">${escapeHtml(it.q)}</div>
            <div class="ci-status">
              ${['ok','na','warn'].map(s => `
                <button class="st-btn st-${s} ${st.status === s ? 'on' : ''}" onclick="setItemStatus('${id}','${s}')">${STATUS_LABELS[s]}</button>`).join('')}
            </div>
          </div>
          <div class="ci-why">${escapeHtml(it.why)}</div>
          <div class="ci-foot">
            <div class="ci-forms">${formBadges}${autoBadge}</div>
            <input class="ci-memo" type="text" placeholder="メモ（任意）" value="${escapeHtml(st.memo || '')}" oninput="setItemMemo('${id}', this.value)">
          </div>
        </div>`;
    }).join('');
    if (!rows.trim()) continue;
    const detCount = sec.items.filter((it,i)=> (state.status[itemId(sec.key,i)]||{}).status==='ok').length;
    html += `
      <section class="check-sec">
        <h3 class="cs-title"><span>${escapeHtml(sec.title)}</span>
          <span class="cs-count">${detCount}/${sec.items.length}</span></h3>
        ${rows}
      </section>`;
  }
  root.innerHTML = html || '<p class="muted">表示する項目がありません。</p>';
  renderProgress();
}

function setItemStatus(id, s) {
  const cur = state.status[id] || { status:'', memo:'' };
  cur.status = (cur.status === s) ? '' : s;   // 同じボタンで解除
  state.status[id] = cur;
  // UI更新
  const el = document.querySelector(`.check-item[data-id="${id}"]`);
  if (el) {
    el.className = `check-item state-${cur.status || 'none'}`;
    el.querySelectorAll('.st-btn').forEach(b => b.classList.remove('on'));
    if (cur.status) el.querySelector(`.st-${cur.status}`)?.classList.add('on');
  }
  // セクションカウント・進捗を更新
  renderProgress();
}

function setItemMemo(id, v) {
  const cur = state.status[id] || { status:'', memo:'' };
  cur.memo = v;
  state.status[id] = cur;
}

function totalCounts() {
  let total = 0, ok = 0, na = 0, warn = 0;
  for (const s of CHECKLIST) {
    s.items.forEach((it, i) => {
      total++;
      const st = (state.status[itemId(s.key, i)] || {}).status;
      if (st === 'ok') ok++; else if (st === 'na') na++; else if (st === 'warn') warn++;
    });
  }
  return { total, ok, na, warn, remaining: total - ok - na - warn };
}

function renderProgress() {
  const c = totalCounts();
  const done = c.ok + c.na;
  const pct = Math.round(done / c.total * 100);
  const bar = document.getElementById('progressBar');
  const txt = document.getElementById('progressText');
  if (bar) bar.style.width = pct + '%';
  if (txt) txt.textContent = `確認済 ${c.ok} / 該当なし ${c.na} / 要修正 ${c.warn} / 未確認 ${c.remaining}（全${c.total}項目・進捗 ${pct}%）`;
  // セクションカウント
  document.querySelectorAll('.check-sec').forEach(sec => {
    const title = sec.querySelector('.cs-title span')?.textContent;
    const def = CHECKLIST.find(s => s.title === title);
    if (!def) return;
    const det = def.items.filter((it, i) => (state.status[itemId(def.key, i)] || {}).status === 'ok').length;
    const cnt = sec.querySelector('.cs-count');
    if (cnt) cnt.textContent = `${det}/${def.items.length}`;
  });
}

function bulkSet(status) {
  const hideUnrelated = document.getElementById('filterUnrelated')?.checked;
  for (const s of CHECKLIST) {
    s.items.forEach((it, i) => {
      const related = (it.forms || []).filter(f => f.startsWith('別表'));
      const relevance = related.length === 0 ? 'na' : (related.some(f => formDetected(f)) ? 'hit' : 'miss');
      if (hideUnrelated && relevance === 'miss') return;
      const id = itemId(s.key, i);
      const cur = state.status[id] || { status:'', memo:'' };
      cur.status = status;
      state.status[id] = cur;
    });
  }
  renderChecklist();
}

function clearAllStatus() {
  if (!confirm('全てのチェック状態とメモをクリアします。よろしいですか？')) return;
  state.status = {};
  renderChecklist();
}

/* ====================================================================
   結果サマリ・レポート
   ==================================================================== */
function generateSummary() {
  const c = totalCounts();
  const box = document.getElementById('summaryBox');
  const warns = [], remains = [], autoMiss = [];
  for (const s of CHECKLIST) {
    s.items.forEach((it, i) => {
      const id = itemId(s.key, i);
      const st = (state.status[id] || {});
      if (st.status === 'warn') warns.push({ s, it, memo: st.memo });
      if (!st.status) remains.push({ s, it });
      const auto = autoEval(it);
      if (auto && auto.state === 'missing') autoMiss.push({ s, it });
    });
  }
  const done = c.ok + c.na;
  const pct = Math.round(done / c.total * 100);

  box.innerHTML = `
    <div class="sum-cards">
      <div class="sum-card sc-ok"><div class="sc-n">${c.ok}</div><div>確認済</div></div>
      <div class="sum-card sc-na"><div class="sc-n">${c.na}</div><div>該当なし</div></div>
      <div class="sum-card sc-warn"><div class="sc-n">${c.warn}</div><div>要修正</div></div>
      <div class="sum-card sc-rem"><div class="sc-n">${c.remaining}</div><div>未確認</div></div>
    </div>
    <div class="sum-prog"><div class="sum-prog-bar" style="width:${pct}%"></div></div>
    <p class="sum-prog-txt">進捗 ${pct}%（全${c.total}項目）</p>

    ${warns.length ? `<h3 class="sum-h warn">要修正（${warns.length}件）</h3>
      <ul class="sum-list">${warns.map(w => `<li><b>[${escapeHtml(w.s.title)}]</b> ${escapeHtml(w.it.q)}${w.memo ? `<span class="sum-memo">📝 ${escapeHtml(w.memo)}</span>` : ''}</li>`).join('')}</ul>` : ''}

    ${autoMiss.length ? `<h3 class="sum-h auto">自動チェックで未検出の添付書類（${autoMiss.length}件・参考）</h3>
      <ul class="sum-list">${autoMiss.map(w => `<li><b>[${escapeHtml(w.s.title)}]</b> ${escapeHtml(w.it.q)}</li>`).join('')}</ul>
      <p class="muted small">※ スキャンPDF（テキスト無し）や表記ゆれで検出できない場合があります。必ず原本でご確認ください。</p>` : ''}

    ${remains.length ? `<h3 class="sum-h rem">未確認（${remains.length}件）</h3>
      <details><summary>未確認項目を表示</summary>
      <ul class="sum-list">${remains.map(w => `<li><b>[${escapeHtml(w.s.title)}]</b> ${escapeHtml(w.it.q)}</li>`).join('')}</ul></details>` : '<p class="sum-done">✓ すべての項目を確認しました。</p>'}
  `;
}

function buildReportHTML() {
  const c = totalCounts();
  const p = state.profile;
  const now = new Date();
  const dstr = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`;
  const yesno = b => b ? '該当' : '—';
  let sections = '';
  for (const s of CHECKLIST) {
    const rows = s.items.map((it, i) => {
      const st = (state.status[itemId(s.key, i)] || {});
      const label = STATUS_LABELS[st.status || ''];
      const cls = st.status === 'warn' ? 'r-warn' : st.status === 'ok' ? 'r-ok' : st.status === 'na' ? 'r-na' : 'r-rem';
      return `<tr class="${cls}">
        <td>${escapeHtml(it.q)}${st.memo ? `<br><span class="memo">📝 ${escapeHtml(st.memo)}</span>` : ''}</td>
        <td class="st">${label}</td></tr>`;
    }).join('');
    sections += `<h2>${escapeHtml(s.title)}</h2>
      <table><thead><tr><th>確認内容</th><th class="st">結果</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  return `
    <h1>法人税申告書 自主点検チェック結果</h1>
    <p class="report-subtitle">国税庁「申告書確認表（内国法人用）」に基づく自主点検 ／ 作成日 ${dstr}</p>
    <table class="meta-table">
      <tr><td>事業年度</td><td>${escapeHtml(p.period || '—')}</td></tr>
      <tr><td>期末資本金の額</td><td>${p.capital ? Number(p.capital).toLocaleString() + ' 円' : '—'}</td></tr>
      <tr><td>区分</td><td>${[p.isOver1oku?'資本金1億円超':'',p.isDozoku?'同族会社':'',p.isTokuteiDozoku?'特定同族会社':'',p.isChusho?'中小企業者':'',p.isTekiyojogai?'適用除外事業者':'',p.isEtaxObligated?'電子申告義務':''].filter(Boolean).join(' / ') || '—'}</td></tr>
      <tr><td>読込ファイル</td><td>${state.files.map(f=>escapeHtml(f.name)).join('、') || '—'}</td></tr>
      <tr><td>検出した別表</td><td>${state.detected.forms.map(escapeHtml).join('、') || '—'}</td></tr>
    </table>
    <div class="summary-box">
      <b>集計</b>：確認済 ${c.ok} ／ 該当なし ${c.na} ／ 要修正 ${c.warn} ／ 未確認 ${c.remaining}（全 ${c.total} 項目）
    </div>
    ${sections}
    <p class="disclaimer">※ 本チェック結果は自主点検を補助するものであり、申告内容の正確性を保証するものではありません。最終的な確認は申告者の責任において行ってください。本ツールは国税庁の確認表を基に作成した非公式のものです。</p>
  `;
}

function printReport() { window.print(); }

function downloadReportHTML() {
  const css = reportCSS();
  const body = buildReportHTML();
  const full = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>申告書チェック結果</title>
<style>${css}</style></head><body><div class="wrap">${body}</div></body></html>`;
  const fname = `申告書チェック結果_${(state.profile.period || '').replace(/[\\/:*?"<>|]/g,'') || nowStamp()}.html`;
  downloadFile(fname, full, 'text/html');
}

function downloadJSON() {
  const data = {
    generatedAt: new Date().toISOString(),
    profile: state.profile,
    files: state.files.map(f => ({ name: f.name, pages: f.pages, hasText: f.hasText })),
    detected: state.detected,
    results: [],
  };
  for (const s of CHECKLIST) {
    s.items.forEach((it, i) => {
      const st = (state.status[itemId(s.key, i)] || {});
      data.results.push({ section: s.title, q: it.q, status: STATUS_LABELS[st.status || ''], memo: st.memo || '' });
    });
  }
  downloadFile(`申告書チェック_${nowStamp()}.json`, JSON.stringify(data, null, 2), 'application/json');
}

function reportCSS() {
  return `
  body{font-family:'Hiragino Kaku Gothic ProN','Yu Gothic','Meiryo',sans-serif;color:#1f2937;line-height:1.6;background:#f8fafc;}
  .wrap{max-width:900px;margin:30px auto;padding:40px;background:#fff;}
  h1{font-size:1.6rem;text-align:center;color:#1f4768;border-bottom:3px double #2b5d8c;padding-bottom:12px;margin-bottom:4px;}
  .report-subtitle{text-align:center;color:#4b5563;margin-bottom:20px;font-size:.85rem;}
  h2{font-size:1.02rem;color:#1f4768;border-left:5px solid #2b5d8c;padding-left:10px;margin:22px 0 8px;}
  table{width:100%;border-collapse:collapse;margin-bottom:10px;font-size:.85rem;}
  th{background:#e8f0f8;padding:7px 9px;text-align:left;border:1px solid #cbd5e1;}
  td{padding:7px 9px;border:1px solid #cbd5e1;vertical-align:top;}
  th.st,td.st{width:84px;text-align:center;white-space:nowrap;}
  .meta-table td:first-child{background:#f8fafc;font-weight:600;width:28%;}
  .summary-box{background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin:14px 0;}
  .r-warn td.st{color:#dc2626;font-weight:700;} .r-warn td:first-child{background:#fef2f2;}
  .r-ok td.st{color:#16a34a;font-weight:700;}
  .r-na td.st{color:#64748b;}
  .r-rem td.st{color:#b45309;}
  .memo{color:#6d28d9;font-size:.8rem;}
  .disclaimer{margin-top:20px;font-size:.78rem;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:10px;}
  @media print{body{background:#fff;}.wrap{margin:0;padding:0;}}
  `;
}

/* ====================================================================
   ユーティリティ
   ==================================================================== */
function setStatus(msg, type) {
  const el = document.getElementById('dropStatus');
  if (!el) return;
  el.textContent = msg;
  el.className = 'drop-status ' + (type || '');
}
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, m =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}
function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
  return (b/1048576).toFixed(1) + ' MB';
}
function nowStamp() {
  const d = new Date();
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}_${z(d.getHours())}${z(d.getMinutes())}`;
}
function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type: type + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initDropZone();
  bindProfile();
});
