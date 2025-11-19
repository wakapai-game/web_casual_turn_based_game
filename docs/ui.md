# UI/UX仕様

## タイトル画面
- ゲームロゴと「スタート」「終了」の2つのボタンを表示します。
- 「スタート」を押すとバトルを開始し、「終了」を押すとゲームを終了します（モバイルではアプリを閉じます）。

## バトル画面
プレイヤー／敵ともに前衛1体＋後衛2体で表示し、カード単位で情報量とレイアウトを切り替えます。

### Ally Front Status Card
- カードサイズ: 250×300px。中央下部に配置し、opacity 1.0、太さ3pxのハイライト枠。
- ラベル: 左上に`[FRONT]`バッジ、右上にモンスター名と属性アイコン（🔥/💧/⚡/🌱/🌪️/🪨/🌙/☀️など）を併記。
- HPゲージ: 現在値/最大値を`80 / 100`形式で表示し、ゲージバーは以下で色分岐。70%以上=緑、30〜69%=黄、29%以下=赤。0.3sのwidthトランジションで滑らかに更新。
- STゲージ: 味方前衛のみ表示。現在値/最大値、50%以上=青、10〜49%=橙、0%=赤の点滅（1秒周期CSSアニメーション）。`0`時はゲージ全体に赤背景+opacityアニメを付与。
- 能力値: ATK/DEF/MAG/SPDを⚔️🛡️✨💨アイコン付きで縦並び表示。バフ中は数値/アイコンを緑、デバフ中は赤に着色。
- バフ/デバフエリア: カード下部に4枠確保。Update 25でアイコンを実装予定だが、現状はスロット見出しのみ。
- 属性/ステータスの数値はリアルタイムで更新され、交代やダメージ時に`updateMonsterDisplay`からバインドされる。

### Ally Back Slot
- カードサイズ: 120×150px。前衛カードの左右後方に横並びで配置し、opacity 0.7、枠線は1px。
- 表示内容: `[BACK]`バッジ、モンスター名（小さめフォント）、属性アイコン。
- HPゲージのみ表示（ST非表示）。色分岐は前衛HPと共通。
- 交代可能状態はフルカラー+ホバー可能なボーダー、HP0の場合はグレーアウト＋「戦闘不能」テキストとロックアイコン。クリックできない状態は`aria-disabled=true`を付与。

### Enemy Front Status Card
- カードサイズ/配置/枠線は味方前衛と同一だが、配色を反転（ダーク背景＋ライト枠）。
- 表示内容: `[FRONT]`バッジ、敵名、属性アイコン、HPゲージのみ（色分岐は味方と同じ）。
- 能力値 ATK/DEF/MAG/SPD を数値＋アイコンで表示し、バフ/デバフ色替えルールも味方と揃える。
- STゲージはDOMに存在させず、内部ログのみ。受け入れテストではST関連クラスが描画されないことを確認する。

### Enemy Back Slot
- カードサイズ/配置は味方バックと同じ。`[BACK]`バッジ、敵名、属性アイコン、HPゲージのみ表示。
- ST情報は一切表示しない。HP0時はグレーアウト＋「戦闘不能」表示。

### Layout & Responsiveness
- PC基準では前衛カードを中央に、バックカードは左右に10pxオフセットして背面に配置。z-indexで前衛>後衛を維持。
- カードの視差: 前衛にはドロップシャドウ（0 8px 20px #0008）、後衛は軽い影（0 4px 12px #0005）。
- スマホ幅（<=768px）では縦並びに切り替え、前衛カード→バックカード→コマンドメニューの順で縦積み。能力値ブロックはアコーディオン化し、折りたたみ時でもHP/ST/属性は常時表示。
- ラベルとアイコンは8px余白で揃え、タップターゲット最小44pxを確保。

### Animations & Feedback
- HP/STゲージ更新はCSS transition 0.3s。被ダメ時はカード全体に`shake`アニメ（0.4s、transform: translateX±6px）。
- ST=0の点滅は`@keyframes st-zero-blink`で1秒周期、赤背景→透明を交互に繰り返す。
- 交代成立時は新前衛カードをフェードイン(0.2s)＋スケール1.05→1.0。後衛に下がったカードはopacity 0.7で安定。
- ログイベント（`hp_update`, `st_update`, `swap_confirmed`等）と同期してアニメーションを開始し、アニメ完了後に`animationend`でクラスを外す。

### Status Update Flow
```
function updateMonsterDisplay(party, monsterIndex) {
  const monster = party.monsters[monsterIndex];
  const isFront = party.frontIndex === monsterIndex;
  const isPlayer = party.isPlayer;

  updateHpGauge(monster.id, monster.currentHp, monster.hp);

  if (isPlayer && isFront) {
    updateStGauge(monster.id, monster.currentSt, monster.st);
  } else {
    hideStGauge(monster.id);
  }

  updateStats(monster.id, monster.stats, monster.buffs);
  updateAttributeBadge(monster.id, monster.element);
  updateFrontBackBadge(monster.id, isFront ? 'FRONT' : 'BACK');

  if (monster.currentHp == 0) {
    markAsFainted(monster.id);
  } else {
    markAsActive(monster.id, isFront ? 'front' : 'back');
  }
}
```
- `party.frontIndex`と`party.backIndices`を監視し、交代時に前衛/後衛カードのDOMツリーを差し替える。
- `markAsFainted`はHPゲージを0に固定し、カードをグレーアウト、交代ボタンを無効化して「戦闘不能」ラベルを出す。
- バックラインはターン終了ごとに`backlineRecovery`でSTを回復するが、UIにはHPのみ表示。内部ログでSTを管理し、前衛に出た瞬間にSTゲージを再度描画する。

### コマンドメニューとログ
- コマンドメニューには「こうげき」「ぼうぎょ」「アイテム」「交代」を表示し、選択中の項目をハイライトします。
- 「交代」を選ぶとバックライン候補がモーダルで開き、HP値、属性、交代可否（ST不足はツールチップ＋警告アイコン）を表示。条件未達の候補はタップ不可でグレーアウトします。
- 強制交代が発生した場合は、テキストログと画面上部に赤いバナーを表示し、原因（HP0、STロック等）と次に出るモンスター名を2秒間掲示します。
- テキストログエリアには行動内容やダメージ結果に加え、交代理由と後衛ST回復量を表示します。

## リザルト画面
- バトル結果に応じて「勝利」または「敗北」を表示します。
- ヒーローと敵の最終HPを表示します。
- タイトル画面に戻るボタンを表示します。

## レイアウトとDPI
- Canvasのスケーラーモードは「Scale With Screen Size」とし、基準解像度は1920x1080とします。
- モバイル端末では、重要なUI要素がセーフエリア内に収まるように注意します。

## アクセシビリティ
- 全ての文字列はローカライズ可能とし、ボタン内に収まるよう簡潔にします。
- メニュー操作はキーボードやゲームパッドによるナビゲーションをサポートします。
- カラーブラインド対応としてHPは赤+模様付き、STは青+点滅アニメーションを併用し、数値表示も常時併記します。
