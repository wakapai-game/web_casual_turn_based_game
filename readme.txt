Unity カジュアルターン制バトルゲーム
====================================

このリポジトリには、Unityで開発されるシンプルなカジュアルターン制バトルゲームの完全な設計仕様が含まれています。コードやアセット、ビルドを生成する際の唯一の真実源としてお使いください。

## 構成
- **/design/docs** – YAML、JSON、Markdownなどの機械可読な設計ファイルおよびドキュメント。
- **/design/data** – 敵、アイテム、ステージなどのゲームデータ定義。
- **/design/schemas** – ゲームデータを検証するためのJSONスキーマ。
- **/design/ui** – UIフロー定義。
- **/design/audio** – オーディオ仕様とマッピング。

## クイックスタート
1. `project.yaml`を確認し、Unityバージョンやテンプレートを正しく設定します。
2. プレースホルダをプロジェクト固有の値で埋めます。
3. コード生成工具を用いてYAML/JSONをC#クラスやScriptableObjectに変換します。
4. 用意されているCIワークフロー（`build_workflow.yml`）を実行し、プロジェクトの検証とビルドを行います。

## ゲーム概要
プレイヤーはヒーローキャラクターを操作し、可愛らしい敵との1対1のバトルを短時間で楽しみます。コマンドは「こうげき」「ぼうぎょ」「アイテム」の3つが基本で、勝敗に応じてリザルト画面が表示され、タイトル画面に戻ります。

各ファイルの詳細については`DESIGN_INDEX.md`をご参照ください。

## データ検証ワークフロー
バトル用データ（`data/monsters.json` / `moves.json` / `types.json`）は`docs/vision.md`で定義されたスキーマに従っています。コミット前・CI前に以下のコマンドで検証してください。

### ローカル
```bash
npm exec jsonlint -q data/monsters.json
python -m json.tool data/moves.json > /dev/null
python tools/validate_data.py --all
```

### CI / QA
- `docs/tests.yaml`の`data_validation_script`エントリで`python tools/validate_data.py --all`を参照しています。
- `build_workflow.yml`や任意のCI設定で上記コマンドをジョブに追加し、PRごとにデータの件数・属性網羅・スキーマエラーを検知できるようにしてください。
