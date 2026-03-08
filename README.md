# DD報告書自動生成ツール

M&Aデューデリジェンス報告書をExcel入力 → PowerPoint自動生成するツール。

## テンプレートのダウンロード

入力用Excelテンプレートは以下からダウンロードできます：

[dd_input_template.xlsx をダウンロード](templates/dd_input_template.xlsx)

> GitHubの場合、リンクをクリック後「Download raw file」ボタンを押してください。

## セットアップ

```bash
pip install -r requirements.txt
```

## 使い方

### 1. 空のExcelテンプレートを生成

```bash
python -m dd_report_generator.create_template -o templates/dd_input_template.xlsx
```

### 2. Excelテンプレートにデータを入力

生成されたExcelファイルの各シートにデータを記入する：

| シート名 | 内容 |
|---|---|
| 表紙 | 案件名、対象会社名、報告日、作成者等 |
| 会社概要 | 基本情報（代表者、資本金、事業内容等） |
| 貸借対照表 | 直近3期のBS数値 |
| 損益計算書 | 直近3期のPL数値 |
| 修正貸借対照表 | 時価評価・修正額・修正理由 |
| 科目別検証 | 各科目の検証結果・リスク評価・コメント |
| 税務DD | 税務項目の検証内容・指摘事項・影響額 |
| 総括 | 全体所見・リスクサマリー |

### 3. PowerPointレポートを生成

```bash
python -m dd_report_generator.generate_report -i templates/dd_input_template.xlsx -o output/dd_report.pptx
```

### サンプルデータで試す

```bash
python -m dd_report_generator.create_sample_data
python -m dd_report_generator.generate_report -i templates/dd_sample_data.xlsx -o output/dd_report_sample.pptx
```

## 生成されるスライド構成

1. **表紙** — 案件名・対象会社・作成者情報
2. **会社概要** — 基本情報テーブル
3. **貸借対照表（BS）推移** — 直近3期（データ量に応じて複数ページ）
4. **損益計算書（PL）推移** — 直近3期（データ量に応じて複数ページ）
5. **修正貸借対照表** — 時価純資産・過剰資産
6. **科目別検証結果** — 各科目の検証・修正・リスク評価
7. **税務デューデリジェンス** — 税務リスク評価
8. **総括・リスクサマリー** — 総合所見

## ファイル構成

```
dd_report_generator/
  __init__.py
  create_template.py    # Excelテンプレート生成
  create_sample_data.py # サンプルデータ付きExcel生成
  generate_report.py    # PowerPoint報告書生成
templates/              # Excel入力ファイル置き場
output/                 # 生成されたPowerPoint出力先
```
