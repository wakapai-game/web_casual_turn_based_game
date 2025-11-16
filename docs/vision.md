# ゲームビジョンとスコープ

## コンセプト
「Battle Critters（バトルクリッターズ）」は、モバイルやPCで短時間のセッションに合わせて設計されたシンプルでカジュアルなターン制バトルゲームです。プレイヤーは3体で構成されるヒーローパーティを操作し、前衛1体＋後衛2体という陣形を維持しながら可愛らしい敵パーティと戦います。各バトルは数分で終了し、操作は簡単で読み込みも最小限です。

## コア体験
- 前衛／後衛を切り替えつつ優位を作るスピーディな1対パーティのターン制バトル。
- 基本コマンドは「こうげき」「ぼうぎょ」「アイテム」に加えて「交代」。交代は前衛のターンを消費しST（スタミナ）をコストとして扱う。
- HPとSTを同時に管理し、前衛は攻撃頻度を高め、後衛はSTを蓄えるといったテンポ差を味わえるシステム。
- 愛らしいイラスト調のデザイン。
- ストーリー要素は最小限で、ゲームプレイのループに集中。

## 対象ユーザー
8歳以上のカジュアルゲーマーを想定しており、モバイルやPCで短時間に軽く遊びたい人向けです。覚えやすいシステムと手軽な操作感を目指します。

## MVP範囲
- 「Boot」「Title」「Battle」「Result」の各シーン。
- プレイヤー1パーティ（3体）対AI敵パーティ（3体）のシングルプレイ。
- 基本コマンドメニュー（こうげき、ぼうぎょ、アイテム、交代）。
- ヒーローキャラクター3体と敵キャラ3種類（前衛差し替え前提）。
- 前衛大型表示と後衛縮小表示を備えたHP/STバーUIとダメージ表示。
- 効果音とBGM。
- 勝利／敗北を表示するリザルト画面。

## 非対象項目
- マルチプレイやネットワーク機能。
- アイテム管理やキャラクター成長システム。
- 複雑なストーリーやナラティブ。
- HDRPなどの高度なグラフィックス。

## 完了条件
プレイヤーがBootからTitleに遷移し、バトルを開始して敵に勝利または敗北し、リザルト画面を確認してタイトルに戻れるようになれば、ゲームは完成とみなします。さらに、基本アクション4種（こうげき・ぼうぎょ・アイテム・交代）が`docs/tests.yaml`の`frontline_swap_flow`や`バトルフロー検証`テストケースに沿って完全に動作し、ログ／UIのフィードバックも揃っていることを定義済みのDone条件に含めます。パーティ管理も同様に重視し、`docs/gameplay.yaml`の`playerParty.frontIndex`/`backIndexes`や`turnRules.swapConditions`、`backlineRecovery`で規定されたルール（ST回復量・前衛交代コスト）を守り、`docs/tests.yaml`の`backline_st_recovery`受け入れチェックで検証される水準まで実装されていることが必要です。これらの条件を満たすことで、QAと開発の期待値を一致させます。

## モンスター定義サブセクション
今後の`data/monsters.json`を正しく運用するために、モンスター定義のスキーマと記述ルールを標準化します。以下のフィールドは必須であり、UIやバトル計算で共通に参照されます。

### 必須フィールドと理由
- `id` (string): 永続データとローカライズキーを結び付けるための一意識別子。英数字とアンダースコアのみを使用し、重複を禁止します。
- `name` (string): プレイヤー向け表示名。ローカライズ済みテキストまたはローカライズキーを格納します。
- `hp` (integer): 最大HP。バトル持久力を決定し、平均プレイヤー攻撃（20）で3〜6ターン程度の戦闘時間を狙います。
- `st` (integer): スタミナ。敵AIの行動選択（強攻撃や魔法）のトリガーとして消費する予定で、ターン開始時の行動幅を制御します。
- `atk` (integer): 物理攻撃力。標準防御10を基準に、`atk - def`ベースのダメージ式へ入力されます。
- `def` (integer): 物理防御力。与ダメージの下限（最低1）に影響し、長期戦の際の耐久バリエーションを作ります。
- `mag` (integer): 魔力。属性攻撃や状態異常の付与率に利用し、魔法寄りの個性を表現します。
- `spd` (integer): 素早さ。行動順の決定や回避率ボーナス計算に使用し、戦闘テンポを差別化します。
- `type` (string): 生物カテゴリ（例: `ooze`, `beast`, `elemental`など）。属性相性テーブルとエフェクト選択のキーになります。

### JSONリファレンス構造とサンプル
以下のスニペットは、統一されたキー順と2スペースインデントで記述された`data/monsters.json`の参考例です。各モンスターは上記フィールドのみを持たせ、追加情報は将来の拡張で別キーにまとめます。

```json
{
  "monsters": [
    { "id": "slime_basic", "name": "バブルスライム", "hp": 48, "st": 18, "atk": 12, "def": 8, "mag": 4, "spd": 6, "type": "ooze" },
    { "id": "goblin_scout", "name": "ゴブリンスカウト", "hp": 62, "st": 22, "atk": 16, "def": 9, "mag": 6, "spd": 10, "type": "beast" },
    { "id": "ember_sprite", "name": "エンバースプライト", "hp": 40, "st": 24, "atk": 11, "def": 6, "mag": 18, "spd": 12, "type": "elemental" },
    { "id": "stone_tortoise", "name": "ストーンタートル", "hp": 95, "st": 15, "atk": 14, "def": 18, "mag": 5, "spd": 4, "type": "guardian" },
    { "id": "shadow_bat", "name": "シャドウバット", "hp": 55, "st": 20, "atk": 13, "def": 7, "mag": 12, "spd": 16, "type": "spirit" },
    { "id": "mech_beetle", "name": "メカビートル", "hp": 70, "st": 26, "atk": 17, "def": 14, "mag": 8, "spd": 9, "type": "mechanical" }
  ]
}
```

- `hp`と`def`はプレイヤーの平均DPSを想定し、低位エネミーで合計100前後、中堅で150〜180程度に収めてテンポを維持します。
- `st`は特殊行動1回につき10〜12消費と想定し、3ターンに1回は固有アクションを放てるよう20以上を推奨します。
- `atk`/`mag`は1ターンのダメージ差分が±5以内になるよう、タイプごとにレンジを分けて尖りすぎを防ぎます。
- JSONは2スペースインデント、キーの順序は上記フィールド順を必須とし、末尾カンマは禁止、ダブルクォートのみ使用します。
- `id`は`[type]_[role or adjective]`形式のスネークケース、`type`は単数英単語小文字で統一し、複数語の場合はアンダースコアで接続します。

## ムーブ定義サブセクション
今後の`data/moves.json`を保守しやすくするために、スタミナ（ST）を消費して発動するムーブのスキーマ、代表例、バランス指針を標準化します。プレイヤーと敵AIの双方が同じ仕様を参照する前提です。

### 必須フィールドと許容値
- `id` (string): 一意なスネークケースID。英数字とアンダースコアのみを使用し、`[element]_[action]`を基本形とします。
- `name` (string): ローカライズ済み表示名。漢字仮名混じりや英語のいずれでも可ですが、UI幅に収まる12文字以内を推奨します。
- `type` (enum): `physical` / `magical` / `support`。物理攻撃はATK、防御貫通や状態異常はMAGを参照し、`support`は直接ダメージを持たない補助行動です。
- `power` (int): 0〜120。単発物理の基準は20、魔法の基準は24で、ヒット数に応じて÷hits。`support`は0固定で、追加効果テキストで効能を記述します。
- `stCost` (int): 0〜30。プレイヤーの毎ターン自然回復を10と想定し、連続使用可能な軽技は6〜10、中技は12〜16、奥義は20以上。`guard`のみ0で常時選択可とします。
- `element` (enum): `neutral`, `fire`, `water`, `earth`, `air`, `light`, `shadow`。弱点・耐性計算やエフェクト切替のキーになります。
- `hits` (int): 0〜3。物理/魔法は最低1。多段攻撃は2または3。`support`行動は0にしてダメージ計算をスキップさせます。値を省略する場合のデフォルトは1です。

### 代表ムーブ一覧
各属性につき2〜3個の代表例を挙げ、物理/魔法/支援カテゴリをすべてカバーします。`guard`は被ダメージを次ターンまで50%軽減し、スタミナ消費0で連打可能ですが、攻撃行動に換算されないためチェイン倍率は上昇しません。

| id | name | type | element | power | stCost | hits | 概要 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `neutral_guard` | ガード | support | neutral | 0 | 0 | 0 | 次の被ダメージを50%軽減し、状態異常耐性を一時的に+20% |
| `neutral_quick_slash` | クイックスラッシュ | physical | neutral | 16 | 8 | 2 | 低威力2連撃で確定1ターンの行動保証を得る基礎技 |
| `neutral_focus_shot` | 集中射撃 | magical | neutral | 18 | 10 | 1 | 素早さ依存で命中補正+15%を持つ単発魔法 |
| `fire_ember_jab` | エンバージャブ | physical | fire | 22 | 10 | 1 | 火傷(10%/2T)を狙える近接突き |
| `fire_blaze_wave` | ブレイズウェーブ | magical | fire | 28 | 16 | 1 | 全体演出の高威力火炎。防御無視率10% |
| `fire_cauterize` | カウタライズ | support | fire | 0 | 12 | 0 | 自HPを12回復し、2ターンの間継続火傷ダメージ+20% |
| `water_aqua_cleave` | アクアクリーヴ | physical | water | 20 | 12 | 1 | 防御ダウン中の敵に追加ダメージ+25% |
| `water_tidal_hex` | タイダルヘックス | magical | water | 24 | 14 | 2 | 2ヒット呪文で命中時に敏捷-2(2T) |
| `water_mist_shell` | ミストシェル | support | water | 0 | 10 | 0 | 味方側に回避+15%と魔防+5(2T)を付与 |
| `earth_stone_crash` | ストーンクラッシュ | physical | earth | 26 | 18 | 1 | 自身の防御値の15%を威力に加算する重撃 |
| `earth_quake_orb` | クエイクオーブ | magical | earth | 22 | 15 | 3 | 3ヒット魔法で敵のガードを解除 |
| `earth_bulwark` | アースブルワーク | support | earth | 0 | 14 | 0 | 2ターンの間、防御+8 & ノックバック耐性 |
| `air_gale_edge` | ゲイルエッジ | physical | air | 18 | 8 | 2 | 先制補正+5を持つ2連撃で、クリティカル率+10% |
| `air_storm_lance` | ストームランス | magical | air | 26 | 16 | 1 | 敵の命中-10%(1T)を伴う突風魔法 |
| `air_tailwind` | テイルウィンド | support | air | 0 | 12 | 0 | 味方の素早さ+6(2T)と行動順ブースト |
| `light_radiant_cut` | ラディアントカット | physical | light | 24 | 14 | 1 | 闇属性の敵へ追加倍率1.2x |
| `light_sunbeam` | サンビーム | magical | light | 27 | 18 | 1 | 命中時に暗闇解除＆自己HP5回復 |
| `light_blessing_pulse` | ブレッシングパルス | support | light | 0 | 15 | 0 | パーティ全体の状態異常を1つ解除し、次の攻撃に聖属性付与 |
| `shadow_night_blade` | ナイトブレード | physical | shadow | 23 | 12 | 1 | 背面からの攻撃時に威力+40% |
| `shadow_void_surge` | ヴォイドサージ | magical | shadow | 29 | 20 | 2 | ST最大時のみ選択可。命中毎にST3吸収 |
| `shadow_veil_step` | ヴェールステップ | support | shadow | 0 | 13 | 0 | 1ターン透明化して回避+40%、次攻撃の威力+30% |

### フォーマットとバランス指針
- JSONは2スペースインデントを必須とし、ルートに`{"moves": [ ... ]}`構造を使用。各ムーブのキーは`id`, `name`, `type`, `power`, `stCost`, `element`, `hits`の順に並べます。
- 属性ごとにまとめ、同じ属性内では`type`→`id`順でソートすることで差分確認を容易にします。`guard`などのデフォルト技は配列の先頭に配置してください。
- `power`は`20 + (elemental_bonus)`を基準とし、`stCost`との比率は凡そ`power : stCost = 1.5 : 1`を上限にします。多段攻撃は`power / hits`が12を超えないように調整します。
- `stCost`は回復手段を想定し、同属性内で段階的に8/12/16/20といった階段を作るとAIチューニングが安定します。サポート技は効果が強いほどコストを12以上に設定し、永続効果は禁止です。
- 新規ムーブは必ず1つの`element`か`neutral`に属させ、同名の重複を避けるため`rg neutral_* data/moves.json`のような検索で衝突を確認します。
- 代表表に無いムーブを追加するときも、物理/魔法/支援が各属性で最低1つずつ存在する状態を維持し、`guard`のような行動保険技を削除しないでください。

## 属性システムサブセクション
属性のローカライズ名やUIアイコンを固定し、バトル計算で使用する相性倍率と`data/types.json`の構造を明文化します。ここでは8種類の属性（`fire`, `water`, `wind`, `earth`, `thunder`, `ice`, `light`, `dark`）を扱います。

### 属性一覧（ローカライズ／アイコン）
| Element ID | 表示名 (JA) | Display (EN) | アイコン例 | Sprite Key |
| --- | --- | --- | --- | --- |
| `fire` | 火焔（かえん） | Fire | 🔥 | `icon_element_fire` |
| `water` | 水流（すいりゅう） | Water | 💧 | `icon_element_water` |
| `wind` | 疾風（しっぷう） | Wind | 🌪️ | `icon_element_wind` |
| `earth` | 大地（だいち） | Earth | 🪨 | `icon_element_earth` |
| `thunder` | 雷鳴（らいめい） | Thunder | ⚡ | `icon_element_thunder` |
| `ice` | 氷結（ひょうけつ） | Ice | ❄️ | `icon_element_ice` |
| `light` | 聖光（せいこう） | Light | ✨ | `icon_element_light` |
| `dark` | 幽闇（ゆうあん） | Dark | 🌑 | `icon_element_dark` |

`data/types.json`内の`elements`配列でも同じID・ローカライズ名・スプライトキーを保持し、UI/演出とデータ駆動の差異が出ないようにしています。

### 相性マトリクスと倍率
相性倍率は「強い 1.5」「等倍 1.0」「耐性 0.5」を統一ルールとして採用します。下表は攻撃側（行）→防御側（列）へ適用する倍率です。

| 攻撃\防御 | fire | water | wind | earth | thunder | ice | light | dark |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **fire** | 1.0 | **0.5** | 1.0 | 1.0 | 1.0 | **1.5** | 1.0 | 1.0 |
| **water** | **1.5** | 1.0 | 1.0 | 1.0 | **0.5** | 1.0 | 1.0 | 1.0 |
| **wind** | 1.0 | 1.0 | 1.0 | **1.5** | 1.0 | **0.5** | 1.0 | 1.0 |
| **earth** | 1.0 | 1.0 | **0.5** | 1.0 | **1.5** | 1.0 | 1.0 | 1.0 |
| **thunder** | 1.0 | **1.5** | 1.0 | **0.5** | 1.0 | 1.0 | 1.0 | 1.0 |
| **ice** | **0.5** | 1.0 | **1.5** | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
| **light** | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | **1.5** |
| **dark** | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | **1.5** | 1.0 |

- 火 → 氷、氷 → 風、風 → 大地、大地 → 雷、雷 → 水、水 → 火の6ループが主な相性チェーンです。
- 光と闇は互いに弱点（1.5倍）を持ち、他属性には干渉しません。これによりリザルト表示や敵AIで「聖／闇の優劣」を簡潔に説明できます。

### `data/types.json`との対応
- `effectiveness`配列には、上記マトリクスで1.5または0.5となる組み合わせだけを列挙します（未定義は自動的に1.0扱い）。
- `multiplier`値は`1.5`（弱点）、`1.0`（等倍／`defaultMultiplier`で定義）、`0.5`（耐性）の3値のみを使用します。これによりゲームコード側は浮動小数比較を避け、`switch`/`dictionary`で即時参照できます。
- ローカライズ名とアイコンキーを`elements`配列が提供するため、UIやバトルログで同じデータを共有できます。
- 将来属性を追加する場合も、このJSONにID・相性・UI情報を追加し、上表を同期するだけで済みます。

## データ検証と受け入れ基準
`data/monsters.json`と`data/moves.json`は実装開始前に一括でレビューし、`data/types.json`と整合が取れている状態を保証します。以下の手順と基準を守ることで、実装チームが安全にデータを取り込み、テストケースを自動生成できます。

### 検証ステップ
1. **JSONリント** – `npm exec jsonlint -q data/monsters.json`や`python -m json.tool data/moves.json > /dev/null`で構文チェックを行い、2スペースインデントを維持します。
2. **属性クロスチェック** – モンスターにも`element`フィールドを追加し、ムーブの`element`と合わせて`types.json`の`elements[].id`に含まれるIDのみを採用します。以下のようなスクリプトで差異を検出します。

```bash
python - <<'PY'
from pathlib import Path
import json

types = {e["id"] for e in json.loads(Path("data/types.json").read_text())["elements"]}
monsters = json.loads(Path("data/monsters.json").read_text())["monsters"]
moves = json.loads(Path("data/moves.json").read_text())["moves"]

def check(label, rows):
    missing = sorted({row["element"] for row in rows} - types)
    if missing:
        raise SystemExit(f"{label} uses undefined elements: {missing}")

check("monsters", monsters)
check("moves", moves)
print("element ids OK")
PY
```

3. **サンプルロードスクリプト** – データチームがUnityやツールチェーンに渡す前に`python tools/load_samples.py --dataset monsters`（仮）などで`dataclasses`にマッピングし、全レコードが`hp > 0`や`stCost >= 0`といったビジネスロジック条件を満たすか確認します。上記Pythonスニペットを`tools/validate_data.py`としてバージョン管理し、CIから`python tools/validate_data.py --all`を呼び出してリグレッションを防ぎます。

### 受け入れ基準
- **エントリー数** – `monsters.json`は12体以上、`moves.json`は24個以上のムーブを収録し、チュートリアル〜ミッドゲームまでの敵・行動バリエーションを確保します。
- **属性カバレッジ** – `types.json`に列挙された8属性それぞれについて、モンスターは最低1体、ムーブは物理／魔法／支援のいずれかで最低1件ずつ存在すること。欠けている属性がある場合はリリースをブロックします。
- **スキーマ準拠** – 本ドキュメントで定義したキー順・型（整数、列挙値、文字列長など）に沿うJSON Schema（`docs/save_schema.json`を参考に派生）を用意し、CIで`npm exec ajv -s schema/monsters.schema.json -d data/monsters.json`のように静的検証します。

### ドキュメント更新
- データセットが確定したタイミングで`data/README.md`を追加・更新し、各JSONの目的、検証コマンド、CIフック名、生成スクリプトを記載します。
- `docs/tests.yaml`にもデータ検証チェックリストを追記してQAが数値基準（最小件数や属性網羅）を確認できるようにします。
- 追加した`tools/validate_data.py`や関連シェルスクリプトの使い方を`readme.txt`の「開発者向け」節でリンクし、オンボーディングを容易にします。
