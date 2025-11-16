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
プレイヤーは3体構成のヒーローパーティを率い、前衛1体＋後衛2体の陣形を維持しながら同規模の敵パーティと戦います。短時間で遊べるターン制バトルの中で、前衛の行動選択や後衛の温存・交代判断が勝敗を左右します。

- **こうげき** – アクティブな前衛のターンを消費し、デフォルトで5ST支払って攻撃します。【F:docs/gameplay.yaml†L65-L85】
- **ぼうぎょ** – ターンを使う代わりに被ダメ軽減＋行動後に3STが還元され、次ターンに備えられます。【F:docs/gameplay.yaml†L82-L85】
- **アイテム** – ターンを消費してHP/STを回復し、プレイヤー側のみ数値が更新される演出で差別化されます。【F:docs/tests.yaml†L71-L78】
- **交代** – 任意交代は前衛の生存と10ST以上が条件で、アクション1回と10STを払い後衛と位置を入れ替えます。強制交代は前衛撃破やスクリプトで即時に発生しSTコストは不要です。【F:docs/gameplay.yaml†L73-L85】
- **バックライン** – 後衛にいる間は自軍ターン終了時に+3STを得て前衛復帰の燃料を溜め、HPはアイテムやスキルがない限り回復しません。【F:docs/gameplay.yaml†L86-L90】

3体パーティと交代・回復ルールを自動チェックする仕組みとして、`docs/tests.yaml`の`party_three_member_support`や`frontline_swap_flow`などの受け入れ項目がCIで必須になっています。【F:docs/tests.yaml†L1-L16】


各ファイルの詳細については`DESIGN_INDEX.md`をご参照ください。

## プロトタイプ実装状況
`game.py`に含まれるCLIサンプルは、素早くロジックを検証するための1vs1ミニマルフローであり、正式な3体パーティ仕様をまだ反映していません。以下の主要機能が未実装です。

- **交代コマンド** – 前衛ST10以上で任意交代、撃破時の強制交代といった条件・コスト（`swapConditions`）がCLIにはありません。【F:docs/gameplay.yaml†L65-L85】
- **パーティインデックス管理** – `frontIndex`とバックライン2枠を持つ3体編成や、それを前提とした受け入れテスト（`party_three_member_support`など）が未対応です。【F:docs/gameplay.yaml†L65-L89】【F:docs/tests.yaml†L10-L16】
- **後衛ST回復** – backline recovery (+3 ST/ターン)や、それを検証する受け入れテストがCLIに組み込まれていません。【F:docs/gameplay.yaml†L86-L89】【F:docs/tests.yaml†L10-L16】

CLIやその他のプロトタイプを拡張する際は、必ず`docs/gameplay.yaml`および`docs/tests.yaml`を権威仕様として参照し、これらの差分を解消してください。ブラウザ向けの`web/`実装は既に3体構成・交代UI・後衛ST回復を備えた振る舞いを持つため、期待挙動の参考になります。【F:web/main.js†L1-L58】【F:web/main.js†L106-L128】

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
