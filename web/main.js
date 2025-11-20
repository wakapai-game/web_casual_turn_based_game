const PARTY_PRESETS = {
  player: {
    label: "Hero Squad",
    frontIndex: 0,
    members: [
      { monsterId: "mon_flame_drake", name: "Hero", traits: ["balanced", "frontline"] },
      { monsterId: "mon_tide_stalker", name: "Archer", traits: ["backline", "focus"] },
      { monsterId: "mon_gale_rogue", name: "Mage", traits: ["burst"] },
    ],
  },
  enemy: {
    label: "Forest Ambush",
    frontIndex: 0,
    members: [
      { monsterId: "mon_magma_tortoise", traits: ["tank"] },
      { monsterId: "mon_gale_rogue", name: "Bandit", traits: ["agile"] },
      { monsterId: "mon_storm_jaguar", name: "Beast", traits: ["agile"] },
    ],
  },
};

const ACTION_RULES = {
  attackCost: 5,
  defendReward: -3,
  swapCost: 10,
  minActionSt: 5,
  backlineRegen: 3,
  heavySkillCost: 15,
  heavySkillThreshold: 20,
  considerSwapHp: 30,
  considerSwapSt: 15,
  voluntarySwapDelta: 10,
};

const ENEMY_AI_TUNING = {
  heavyBonusLowHp: 12,
};

const ITEM_DEFS = {
  potion_small: {
    id: "potion_small",
    names: { en: "Small Potion", ja: "ちいさなポーション" },
    healAmount: 20,
  },
};

const ELEMENT_INFO = {
  fire: { icon: "🔥", labels: { en: "Fire", ja: "火" } },
  water: { icon: "💧", labels: { en: "Water", ja: "水" } },
  wind: { icon: "🌪️", labels: { en: "Wind", ja: "風" } },
  earth: { icon: "🪨", labels: { en: "Earth", ja: "土" } },
  thunder: { icon: "⚡", labels: { en: "Thunder", ja: "雷" } },
  ice: { icon: "❄️", labels: { en: "Ice", ja: "氷" } },
  light: { icon: "✨", labels: { en: "Light", ja: "光" } },
  dark: { icon: "🌑", labels: { en: "Dark", ja: "闇" } },
  neutral: { icon: "❔", labels: { en: "Neutral", ja: "無" } },
};

const TRANSLATIONS = {
  en: {
    game_title: "Casual Turn Battle",
    wins_label: "Wins",
    losses_label: "Losses",
    boot_loading: "Loading game assets...",
    title_start: "Start",
    title_settings: "Settings",
    title_exit: "Exit",
    cmd_attack: "Attack",
    cmd_defend: "Defend",
    cmd_item: "Item",
    cmd_swap: "Swap",
    hp_label: "HP",
    st_label: "ST",
    stats_label: "Stats",
    player_party_label: "Player Party",
    enemy_party_label: "Enemy Party",
    swap_title: "Choose a backliner",
    swap_cancel: "Cancel",
    swap_confirm: "Confirm",
    result_title: "Result",
    result_player: "Player",
    result_enemy: "Enemy",
    result_back: "Back to Title",
    result_player_party: "Player Party",
    result_enemy_party: "Enemy Party",
    settings_title: "Settings",
    settings_language: "Language",
    settings_volume: "Volume",
    ok: "OK",
    exit_title: "Exit Game",
    exit_description: "Thanks for playing!",
    log_enemy_appears: "{enemy} appears!",
    log_player_attack: "{player} attacks! {enemy} takes {damage} damage!",
    log_player_defend: "{player} braces for impact! Incoming damage will be halved.",
    log_player_guard_break: "{enemy}'s guard softens the blow!",
    log_player_item: "{player} uses {item}! Recovers {amount} HP.",
    log_no_items: "No items remaining!",
    log_enemy_attack: "{enemy} attacks! {player} takes {damage} damage!",
    log_enemy_defend: "{enemy} raises its guard! Next damage will be halved.",
    log_enemy_heavy: "{enemy} unleashes a heavy strike! {player} takes {damage} damage!",
    log_enemy_swap: "Enemy repositions {outgoing} and sends in {incoming}.",
    log_victory: "{enemy} was defeated!",
    log_defeat: "The hero collapses...",
    inventory_item: "{item} x{count}",
    result_victory: "Victory",
    result_defeat: "Defeat",
    settings_saved: "Settings saved.",
    log_swap_request: "Swap request opened. Choose a backliner.",
    log_swap_confirmed: "{outgoing} swaps with {incoming}.",
    log_forced_swap: "{incoming} rushes in due to {reason}.",
    log_backline_regen: "{party} backline recovers {amount} ST.",
    log_st_lockout: "{name} cannot act until ST recovers!",
    log_no_swap_targets: "No healthy backline members remain.",
    log_enemy_hp_update: "{enemy} HP {current}/{max}.",
    log_item_front: "{player} shares {item} with {target} and recovers {amount} HP.",
    log_turn_end: "{actor} turn complete.",
    low_st_label: "Low ST",
    ko_label: "Down",
  },
  ja: {
    game_title: "カジュアルターンバトル",
    wins_label: "勝利",
    losses_label: "敗北",
    boot_loading: "ゲーム資産を読み込み中...",
    title_start: "スタート",
    title_settings: "せってい",
    title_exit: "終了",
    cmd_attack: "こうげき",
    cmd_defend: "ぼうぎょ",
    cmd_item: "アイテム",
    cmd_swap: "こうたい",
    hp_label: "HP",
    st_label: "ST",
    stats_label: "能力値",
    player_party_label: "プレイヤーパーティー",
    enemy_party_label: "てきパーティー",
    swap_title: "後衛を選択",
    swap_cancel: "キャンセル",
    swap_confirm: "決定",
    result_title: "リザルト",
    result_player: "プレイヤー",
    result_enemy: "てき",
    result_back: "タイトルにもどる",
    result_player_party: "プレイヤーパーティー",
    result_enemy_party: "てきパーティー",
    settings_title: "設定",
    settings_language: "言語",
    settings_volume: "音量",
    ok: "OK",
    exit_title: "ゲーム終了",
    exit_description: "プレイしてくれてありがとう！",
    log_enemy_appears: "{enemy}があらわれた！",
    log_player_attack: "{player}のこうげき！ {enemy}に{damage}のダメージ！",
    log_player_defend: "{player}はぼうぎょのたいせいをとった！ 次の攻撃のダメージが半減する。",
    log_player_guard_break: "{enemy}はぼうぎょでダメージをおさえた！",
    log_player_item: "{player}は{item}を使った！ HPが{amount}回復した。",
    log_no_items: "アイテムがありません！",
    log_enemy_attack: "{enemy}のこうげき！ {player}は{damage}のダメージを受けた！",
    log_enemy_defend: "{enemy}はぼうぎょのたいせいをとった！ 次の攻撃が半減する。",
    log_enemy_heavy: "{enemy}の強攻撃！ {player}に{damage}のダメージ！",
    log_enemy_swap: "てきは{outgoing}をさげ{incoming}が前に出た。",
    log_victory: "{enemy}をたおした！",
    log_defeat: "ヒーローはたおれてしまった...！",
    inventory_item: "{item} x{count}",
    result_victory: "しょうり",
    result_defeat: "はいぼく",
    settings_saved: "設定を保存しました。",
    log_swap_request: "こうたいモーダルをひらきました。後衛をえらんでください。",
    log_swap_confirmed: "{outgoing}と{incoming}が入れ替わった！",
    log_forced_swap: "{reason}で{incoming}が強制的に前衛へ！",
    log_backline_regen: "{party}後衛が{amount}ST回復。",
    log_st_lockout: "{name}はST不足で行動できない！",
    log_no_swap_targets: "健常な後衛が残っていません。",
    log_enemy_hp_update: "{enemy}のHP {current}/{max}。",
    log_item_front: "{player}は{target}に{item}をわたし{amount}回復した。",
    log_turn_end: "{actor}のターン終了。",
    low_st_label: "ST不足",
    ko_label: "戦闘不能",
  },
};

const STORAGE_KEY = "casual-turn-battle-save";

class Localization {
  constructor() {
    this.language = "ja";
  }

  setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    this.language = lang;
    document.documentElement.lang = lang;
  }

  t(key, params = {}) {
    const dict = TRANSLATIONS[this.language] || TRANSLATIONS.en;
    const template = dict[key] ?? TRANSLATIONS.en[key] ?? key;
    return template.replace(/\{(.*?)\}/g, (_, name) => {
      return params[name] ?? "";
    });
  }

  apply() {
    const dict = TRANSLATIONS[this.language] || TRANSLATIONS.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const template = dict[key] ?? TRANSLATIONS.en[key];
      if (template) {
        el.textContent = template;
      }
    });
  }
}

class Analytics {
  constructor() {
    this.events = [];
  }

  track(event, payload = {}) {
    const entry = {
      event,
      payload,
      timestamp: new Date().toISOString(),
    };
    this.events.push(entry);
    console.info("[Analytics]", event, payload);
  }
}

class SaveManager {
  constructor() {
    this.data = this.load();
  }

  defaultData() {
    return {
      version: 1,
      player: {
        items: Object.values(ITEM_DEFS).map((item) => ({ id: item.id, count: 1 })),
      },
      progress: { wins: 0, losses: 0 },
      settings: { language: "ja", volume: 0.8 },
    };
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.defaultData();
      const parsed = JSON.parse(raw);
      if (parsed.version !== 1) {
        return this.defaultData();
      }
      return {
        ...this.defaultData(),
        ...parsed,
        player: { ...this.defaultData().player, ...parsed.player },
        progress: { ...this.defaultData().progress, ...parsed.progress },
        settings: { ...this.defaultData().settings, ...parsed.settings },
      };
    } catch (err) {
      console.warn("Failed to parse save data", err);
      return this.defaultData();
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }
}

class AudioManager {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.context = null;
    this.masterGain = null;
    this.bgmNode = null;
    this.bgmGain = null;
    this.currentBgm = null;
  }

  async ensureContext() {
    if (this.context) return;
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = this.saveManager.data.settings.volume;
    this.masterGain.connect(this.context.destination);
  }

  setVolume(volume) {
    if (this.masterGain && this.context) {
      this.masterGain.gain.setTargetAtTime(volume, this.context.currentTime, 0.01);
    }
    this.saveManager.data.settings.volume = volume;
    this.saveManager.save();
  }

  async playBgm(name) {
    await this.ensureContext();
    if (!this.context) return;
    if (this.currentBgm === name) return;
    this.stopBgm();
    const frequencyMap = {
      title: 220,
      battle: 330,
      bgm_victory: 392,
      bgm_defeat: 196,
    };
    const freq = frequencyMap[name] ?? 220;
    const osc = this.context.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = this.context.createGain();
    gain.gain.value = 0.5;
    osc.connect(gain).connect(this.masterGain);
    osc.start();
    this.bgmNode = osc;
    this.bgmGain = gain;
    this.currentBgm = name;
  }

  stopBgm() {
    if (this.bgmNode) {
      try {
        this.bgmNode.stop();
      } catch (err) {
        /* noop */
      }
      this.bgmNode.disconnect();
      this.bgmNode = null;
      this.currentBgm = null;
    }
  }

  async playSfx(name) {
    await this.ensureContext();
    if (!this.context) return;
    const now = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = "triangle";
    const base = {
      attack: 660,
      defend: 440,
      item: 550,
      damage: 320,
      win: 880,
      lose: 200,
      swap: 520,
    }[name] || 440;
    osc.frequency.setValueAtTime(base, now);
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }
}

class GameDataLoader {
  constructor() {
    this.monsters = {};
    this.moves = {};
  }

  async load() {
    const [monstersRes, movesRes] = await Promise.all([
      fetch("../data/monsters.json").then((res) => res.json()),
      fetch("../data/moves.json").then((res) => res.json()),
    ]);
    this.monsters = Object.fromEntries(monstersRes.monsters.map((monster) => [monster.id, monster]));
    this.moves = Object.fromEntries(movesRes.moves.map((move) => [move.id, move]));
  }

  getMonster(id) {
    return this.monsters[id];
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

class EnemyAI {
  constructor(game) {
    this.game = game;
    this.state = "EvaluateFrontline";
    this.pendingForcedReason = null;
    this.pendingSwapIndex = null;
  }

  reset() {
    this.state = "EvaluateFrontline";
    this.pendingForcedReason = null;
    this.pendingSwapIndex = null;
  }

  async takeTurn() {
    const party = this.game.parties.enemy;
    if (!party) return;
    const front = this.game.getFrontMember(party);
    if (!front) {
      this.game.applyBacklineRegen(party);
      return;
    }
    this.game.logBattleEvent("turn_start", `Enemy turn ${this.game.turnCount}`, { actor: "enemy" });
    this.state = "EvaluateFrontline";
    let resolved = false;
    while (!resolved && this.state) {
      switch (this.state) {
        case "EvaluateFrontline": {
          this.state = this.evaluateFrontline();
          if (!this.state) {
            resolved = true;
          }
          break;
        }
        case "ConsiderSwap": {
          this.state = this.considerSwap();
          break;
        }
        case "DecideAction": {
          this.state = this.decideAction();
          break;
        }
        case "Attack": {
          await this.game.audio.playSfx("damage");
          this.game.enemyAttack();
          resolved = true;
          break;
        }
        case "Defend": {
          await this.game.audio.playSfx("defend");
          this.game.enemyDefend();
          resolved = true;
          break;
        }
        case "HeavySkill": {
          await this.game.audio.playSfx("damage");
          this.game.enemyHeavySkill();
          resolved = true;
          break;
        }
        case "VoluntarySwap": {
          await this.performVoluntarySwap();
          this.state = "EvaluateFrontline";
          resolved = true;
          break;
        }
        case "ForcedSwap": {
          const reason = this.pendingForcedReason || "front_ko";
          if (this.performForcedSwap(reason)) {
            if (reason === "st_lockout") {
              resolved = true;
            } else {
              this.state = "EvaluateFrontline";
            }
          } else {
            resolved = true;
          }
          break;
        }
        default:
          resolved = true;
          break;
      }
    }
    this.game.applyBacklineRegen(party);
  }

  evaluateFrontline() {
    this.pendingForcedReason = null;
    const party = this.game.parties.enemy;
    const front = this.game.getFrontMember(party);
    if (!party || !front) {
      return null;
    }
    const hasBackline = this.game.hasAvailableBackliner(party);
    if (front.currentHP <= 0) {
      if (hasBackline) {
        this.pendingForcedReason = "front_ko";
        return "ForcedSwap";
      }
      return null;
    }
    if (front.currentST < ACTION_RULES.minActionSt) {
      if (hasBackline) {
        this.pendingForcedReason = "st_lockout";
        return "ForcedSwap";
      }
      this.game.logBattleEvent(
        "st_lockout",
        this.game.localization.t("log_st_lockout", { name: front.name }),
        { actor: "enemy" }
      );
      return null;
    }
    if (
      hasBackline &&
      (front.currentHP <= ACTION_RULES.considerSwapHp || front.currentST < ACTION_RULES.considerSwapSt)
    ) {
      return "ConsiderSwap";
    }
    return "DecideAction";
  }

  considerSwap() {
    const party = this.game.parties.enemy;
    const front = this.game.getFrontMember(party);
    if (!front) {
      return null;
    }
    const bestIndex = this.getBestBacklinerIndex(party);
    if (!Number.isInteger(bestIndex)) {
      return "DecideAction";
    }
    const candidate = party.members[bestIndex];
    if (!candidate) {
      return "DecideAction";
    }
    if (candidate.currentST - front.currentST >= ACTION_RULES.voluntarySwapDelta) {
      this.pendingSwapIndex = bestIndex;
      return "VoluntarySwap";
    }
    return "DecideAction";
  }

  decideAction() {
    const party = this.game.parties.enemy;
    const front = this.game.getFrontMember(party);
    if (!front) {
      return null;
    }
    const playerFront = this.game.getFrontMember(this.game.parties.player);
    const playerFrontHp = playerFront ? playerFront.currentHP : 0;
    const heavyReady = front.currentST >= Math.max(ACTION_RULES.heavySkillThreshold, ACTION_RULES.heavySkillCost);
    if (heavyReady && playerFrontHp < 40) {
      return "HeavySkill";
    }
    if (front.currentST >= ACTION_RULES.attackCost && front.currentHP > 20) {
      return "Attack";
    }
    if (front.currentHP <= 20 && front.currentST < ACTION_RULES.attackCost) {
      return "Defend";
    }
    if (front.currentST >= ACTION_RULES.attackCost) {
      return "Attack";
    }
    return "Defend";
  }

  async performVoluntarySwap() {
    const party = this.game.parties.enemy;
    const front = this.game.getFrontMember(party);
    const targetIndex = this.pendingSwapIndex;
    if (!party || !front || !Number.isInteger(targetIndex)) {
      return;
    }
    const incoming = party.members[targetIndex];
    if (!incoming) {
      return;
    }
    await this.game.audio.playSfx("swap");
    this.game.consumeStamina(front, ACTION_RULES.swapCost);
    party.frontIndex = targetIndex;
    party.guard = false;
    this.game.logBattleEvent(
      "enemy_swap",
      this.game.localization.t("log_enemy_swap", { outgoing: front.name, incoming: incoming.name }),
      { actor: "enemy" }
    );
    this.pendingSwapIndex = null;
  }

  performForcedSwap(reasonOverride) {
    const party = this.game.parties.enemy;
    if (!party) {
      return false;
    }
    const swapped = this.game.forceSwap(party, reasonOverride || this.pendingForcedReason || "front_ko");
    this.pendingForcedReason = null;
    return swapped;
  }

  getBestBacklinerIndex(party) {
    const indexes = this.game.findBacklineIndexes(party);
    let bestIndex = null;
    let bestScore = -Infinity;
    indexes.forEach((idx) => {
      const member = party.members[idx];
      if (!member || member.currentST < ACTION_RULES.heavySkillThreshold) {
        return;
      }
      const hpRatio = member.maxHP > 0 ? member.currentHP / member.maxHP : 0;
      const score = hpRatio * 100 + member.currentST;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = idx;
      }
    });
    return bestIndex;
  }
}

class GameApp {
  constructor() {
    this.localization = new Localization();
    this.analytics = new Analytics();
    this.saveManager = new SaveManager();
    this.audio = new AudioManager(this.saveManager);
    this.dataLoader = new GameDataLoader();
    this.enemyAI = new EnemyAI(this);

    this.state = "Boot";
    this.parties = { player: null, enemy: null };
    this.inventory = {};
    this.lastResult = null;
    this.dataReady = false;
    this.turnOwner = "player";
    this.turnCount = 0;
    this.swapSelectionIndex = null;
    this.forcedSwapTimeout = null;
    this.frontlineMembers = { player: null, enemy: null };
    this.transientClassTimers = {};

    this.cacheDom();
    this.bindEvents();
    this.setupResponsiveStatPanels();
    this.initialize();
  }

  async initialize() {
    await this.loadGameData();
    this.loadFromSave();
    this.bootstrap();
  }

  async loadGameData() {
    try {
      await this.dataLoader.load();
      this.dataReady = true;
    } catch (err) {
      console.error("Failed to load data", err);
      this.logSystem("Failed to load battle data.");
    }
  }

  cacheDom() {
    this.screens = {
      Boot: document.getElementById("boot-screen"),
      Title: document.getElementById("title-screen"),
      Battle: document.getElementById("battle-screen"),
      Result: document.getElementById("result-screen"),
    };
    this.buttons = {
      start: document.getElementById("btn-start"),
      exit: document.getElementById("btn-exit"),
      settings: document.getElementById("btn-settings"),
      resultTitle: document.getElementById("btn-result-title"),
      resultExit: document.getElementById("btn-result-exit"),
      settingsClose: document.getElementById("btn-settings-close"),
      exitClose: document.getElementById("btn-exit-close"),
      attack: document.getElementById("cmd-attack"),
      defend: document.getElementById("cmd-defend"),
      item: document.getElementById("cmd-item"),
      swap: document.getElementById("cmd-swap"),
      swapCancel: document.getElementById("btn-swap-cancel"),
      swapConfirm: document.getElementById("btn-swap-confirm"),
    };
    this.dialogs = {
      settings: document.getElementById("settings-dialog"),
      exit: document.getElementById("exit-dialog"),
    };
    this.labels = {
      wins: document.getElementById("wins-count"),
      losses: document.getElementById("losses-count"),
      battleLog: document.getElementById("battle-log"),
      inventory: document.getElementById("inventory-display"),
      playerFrontCard: document.getElementById("player-front-card"),
      playerFrontName: document.getElementById("player-front-name"),
      playerFrontElementIcon: document.getElementById("player-front-element-icon"),
      playerFrontElementLabel: document.getElementById("player-front-element-label"),
      playerFrontStatus: document.getElementById("player-front-status"),
      playerFrontHpGauge: document.getElementById("player-front-hp-gauge"),
      playerFrontHpText: document.getElementById("player-front-hp-text"),
      playerFrontHpBar: document.getElementById("player-front-hp-bar"),
      playerFrontStGauge: document.getElementById("player-front-st-gauge"),
      playerFrontStText: document.getElementById("player-front-st-text"),
      playerFrontStBar: document.getElementById("player-front-st-bar"),
      playerFrontAtk: document.getElementById("player-front-atk"),
      playerFrontDef: document.getElementById("player-front-def"),
      playerFrontMag: document.getElementById("player-front-mag"),
      playerFrontSpd: document.getElementById("player-front-spd"),
      playerBackline: document.getElementById("player-backline"),
      enemyFrontCard: document.getElementById("enemy-front-card"),
      enemyFrontName: document.getElementById("enemy-front-name"),
      enemyFrontElementIcon: document.getElementById("enemy-front-element-icon"),
      enemyFrontElementLabel: document.getElementById("enemy-front-element-label"),
      enemyFrontStatus: document.getElementById("enemy-front-status"),
      enemyFrontHpGauge: document.getElementById("enemy-front-hp-gauge"),
      enemyFrontHpText: document.getElementById("enemy-front-hp-text"),
      enemyFrontHpBar: document.getElementById("enemy-front-hp-bar"),
      enemyFrontAtk: document.getElementById("enemy-front-atk"),
      enemyFrontDef: document.getElementById("enemy-front-def"),
      enemyFrontMag: document.getElementById("enemy-front-mag"),
      enemyFrontSpd: document.getElementById("enemy-front-spd"),
      enemyBackline: document.getElementById("enemy-backline"),
      swapPanel: document.getElementById("swap-panel"),
      swapCandidates: document.getElementById("swap-candidates"),
      forcedSwapBanner: document.getElementById("forced-swap-banner"),
      forcedSwapText: document.getElementById("forced-swap-text"),
      backlineLiveRegion: document.getElementById("backline-st-live"),
      resultTitle: document.getElementById("result-title"),
      resultPlayerList: document.getElementById("result-player-party"),
      resultEnemyList: document.getElementById("result-enemy-party"),
    };
    this.inputs = {
      language: document.getElementById("settings-language"),
      volume: document.getElementById("settings-volume"),
    };
  }

  setupResponsiveStatPanels() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    this.statPanels = document.querySelectorAll(".frontline-card__stats-panel");
    if (!this.statPanels.length) {
      return;
    }
    this.statPanelMedia = window.matchMedia("(max-width: 768px)");
    const applyState = () => {
      const shouldCollapse = this.statPanelMedia?.matches;
      this.statPanels.forEach((panel) => {
        if (shouldCollapse) {
          panel.removeAttribute("open");
        } else {
          panel.setAttribute("open", "true");
        }
      });
    };
    this.statPanelMediaHandler = () => applyState();
    if (typeof this.statPanelMedia.addEventListener === "function") {
      this.statPanelMedia.addEventListener("change", this.statPanelMediaHandler);
    } else if (typeof this.statPanelMedia.addListener === "function") {
      this.statPanelMedia.addListener(this.statPanelMediaHandler);
    }
    applyState();
  }

  bindEvents() {
    this.buttons.start?.addEventListener("click", () => this.handleStart());
    this.buttons.settings?.addEventListener("click", () => this.openSettings());
    this.buttons.settingsClose?.addEventListener("click", () => this.closeSettings());
    this.buttons.exit?.addEventListener("click", () => this.openExit());
    this.buttons.exitClose?.addEventListener("click", () => this.closeExit());
    this.buttons.resultTitle?.addEventListener("click", () => this.gotoTitle());
    this.buttons.resultExit?.addEventListener("click", () => this.openExit());

    this.buttons.attack?.addEventListener("click", () => this.playerAction("attack"));
    this.buttons.defend?.addEventListener("click", () => this.playerAction("defend"));
    this.buttons.item?.addEventListener("click", () => this.playerAction("item"));
    this.buttons.swap?.addEventListener("click", () => this.openSwapPanel());
    this.buttons.swapCancel?.addEventListener("click", () => this.closeSwapPanel());
    this.buttons.swapConfirm?.addEventListener("click", () => this.executeSelectedSwap());
    this.labels.swapCandidates?.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-index]");
      if (!target || target.disabled) return;
      const index = Number(target.getAttribute("data-index"));
      this.setSwapSelection(Number.isNaN(index) ? null : index);
    });

    this.inputs.language?.addEventListener("change", (event) => {
      this.localization.setLanguage(event.target.value);
      this.saveManager.data.settings.language = this.localization.language;
      this.saveManager.save();
      this.onLanguageChanged();
    });

    this.inputs.volume?.addEventListener("input", (event) => {
      const volume = Number(event.target.value);
      this.audio.setVolume(volume);
    });
  }

  loadFromSave() {
    this.localization.setLanguage(this.saveManager.data.settings.language);
    this.localization.apply();
    this.inputs.language.value = this.localization.language;
    this.inputs.volume.value = this.saveManager.data.settings.volume;
    this.updateProgress();
  }

  bootstrap() {
    this.setScreen("Boot");
    this.analytics.track("start_game");
    setTimeout(() => {
      this.setScreen("Title");
    }, 600);
  }

  setScreen(name) {
    Object.entries(this.screens).forEach(([key, el]) => {
      el?.classList.toggle("screen--active", key === name);
    });
    this.state = name;
    if (name === "Title") {
      this.audio.playBgm("title");
    } else if (name === "Battle") {
      this.audio.playBgm("battle");
    } else if (name === "Result") {
      const cue = this.lastResult === "victory" ? "bgm_victory" : this.lastResult === "defeat" ? "bgm_defeat" : "bgm_victory";
      this.audio.playBgm(cue);
    }
  }

  onLanguageChanged() {
    this.localization.apply();
    this.updateInventoryDisplay();
    if (this.lastResult) {
      this.updateResultScreen();
    } else {
      this.labels.resultTitle.textContent = this.localization.t("result_title");
    }
    if (this.state === "Battle") {
      this.renderParties();
      if (this.labels.swapPanel?.getAttribute("aria-hidden") === "false") {
        this.renderSwapCandidates();
      }
    }
  }

  updateProgress() {
    this.labels.wins.textContent = this.saveManager.data.progress.wins;
    this.labels.losses.textContent = this.saveManager.data.progress.losses;
  }

  gotoTitle() {
    this.setScreen("Title");
    this.closeExit();
    this.closeSettings();
  }

  openSettings() {
    this.analytics.track("button_click", { id: "settings" });
    this.dialogs.settings.setAttribute("aria-hidden", "false");
  }

  closeSettings() {
    this.dialogs.settings.setAttribute("aria-hidden", "true");
  }

  openExit() {
    this.analytics.track("button_click", { id: "exit" });
    this.dialogs.exit.setAttribute("aria-hidden", "false");
  }

  closeExit() {
    this.dialogs.exit.setAttribute("aria-hidden", "true");
  }

  async handleStart() {
    this.analytics.track("button_click", { id: "start" });
    if (!this.dataReady) {
      await this.loadGameData();
    }
    await this.audio.ensureContext();
    this.startBattle();
  }

  createPartyState(preset, options = {}) {
    const members = preset.members.map((slot) => {
      const base = this.dataLoader.getMonster(slot.monsterId);
      if (!base) {
        throw new Error(`Missing monster ${slot.monsterId}`);
      }
      return {
        id: base.id,
        name: slot.name ?? base.name,
        maxHP: slot.maxHP ?? base.hp,
        currentHP: slot.currentHP ?? base.hp,
        maxST: slot.maxST ?? base.st,
        currentST: slot.currentST ?? base.st,
        attack: slot.attack ?? base.atk,
        defense: slot.defense ?? base.def,
        magic: slot.magic ?? base.mag ?? 0,
        speed: slot.speed ?? base.spd ?? 0,
        element: slot.element ?? base.type ?? "neutral",
        traits: slot.traits ?? [],
      };
    });
    return {
      label: preset.label,
      members,
      frontIndex: Math.min(preset.frontIndex ?? 0, members.length - 1),
      guard: false,
      isPlayer: Boolean(options.isPlayer),
    };
  }

  startBattle() {
    if (!this.dataReady) return;
    this.analytics.track("start_battle");
    this.parties.player = this.createPartyState(PARTY_PRESETS.player, { isPlayer: true });
    this.parties.enemy = this.createPartyState(PARTY_PRESETS.enemy, { isPlayer: false });
    this.enemyAI.reset();
    this.inventory = {};
    this.saveManager.data.player.items.forEach((item) => {
      this.inventory[item.id] = item.count;
    });
    this.lastResult = null;
    this.turnOwner = "player";
    this.turnCount = 1;
    this.labels.battleLog.innerHTML = "";
    if (this.labels.backlineLiveRegion) {
      this.labels.backlineLiveRegion.textContent = "";
    }
    this.renderParties();
    this.updateInventoryDisplay();
    this.setScreen("Battle");
    this.closeSwapPanel();
    const enemyFront = this.getFrontMember(this.parties.enemy);
    if (enemyFront) {
      this.logBattleEvent(
        "turn_start",
        this.localization.t("log_enemy_appears", { enemy: enemyFront.name }),
        { actor: "enemy" }
      );
    }
    this.setCommandsEnabled(true);
  }

  getFrontMember(party) {
    if (!party) return null;
    return party.members[party.frontIndex] ?? null;
  }

  findBacklineIndexes(party) {
    if (!party) return [];
    return party.members
      .map((_, idx) => idx)
      .filter((idx) => idx !== party.frontIndex && party.members[idx].currentHP > 0);
  }

  hasAvailableBackliner(party) {
    return this.findBacklineIndexes(party).length > 0;
  }

  setCommandsEnabled(enabled) {
    this.buttons.attack.disabled = !enabled;
    this.buttons.defend.disabled = !enabled;
    this.buttons.item.disabled = !enabled;
    this.buttons.swap.disabled = !enabled || !this.canVoluntarySwap();
  }

  canVoluntarySwap() {
    const playerParty = this.parties.player;
    const front = this.getFrontMember(playerParty);
    if (!playerParty || !front) return false;
    if (front.currentHP <= 0) return false;
    if (front.currentST < ACTION_RULES.swapCost) return false;
    return this.hasAvailableBackliner(playerParty);
  }

  async playerAction(type) {
    if (this.state !== "Battle") return;
    if (type === "swap") {
      this.openSwapPanel();
      return;
    }
    let front = this.getFrontMember(this.parties.player);
    if (!front || front.currentHP <= 0) return;
    if (front.currentST < ACTION_RULES.minActionSt && type !== "item") {
      const swapped = this.handleStLockout(this.parties.player, "player");
      this.renderParties();
      front = this.getFrontMember(this.parties.player);
      if (!swapped || !front || front.currentST < ACTION_RULES.minActionSt) {
        this.logBattleEvent(
          "st_lockout",
          this.localization.t("log_st_lockout", { name: front ? front.name : "" }),
          { actor: "player" }
        );
        this.setCommandsEnabled(false);
        return;
      }
    }
    this.setCommandsEnabled(false);
    let loggedTurn = false;
    const ensureTurnLogged = () => {
      if (!loggedTurn) {
        this.logBattleEvent("turn_start", `Player turn ${this.turnCount}`, { actor: "player" });
        loggedTurn = true;
      }
    };
    if (type === "attack") {
      ensureTurnLogged();
      this.analytics.track("button_click", { id: "attack" });
      await this.audio.playSfx("attack");
      this.playerAttack();
    } else if (type === "defend") {
      ensureTurnLogged();
      this.analytics.track("button_click", { id: "defend" });
      await this.audio.playSfx("defend");
      this.playerDefend();
    } else if (type === "item") {
      this.analytics.track("button_click", { id: "item" });
      await this.audio.playSfx("item");
      const used = this.playerUseItem();
      if (!used) {
        this.setCommandsEnabled(true);
        return;
      }
      ensureTurnLogged();
    }
    this.renderParties();
    if (await this.checkBattleResolution()) {
      return;
    }
    await this.finalizePlayerTurn();
  }

  async finalizePlayerTurn() {
    this.applyBacklineRegen(this.parties.player);
    this.renderParties();
    this.logTurnEnd("player");
    if (await this.checkBattleResolution()) {
      return;
    }
    await this.delay(650);
    await this.enemyTurn();
    this.renderParties();
    this.logTurnEnd("enemy");
    if (await this.checkBattleResolution()) {
      return;
    }
    this.turnCount += 1;
    this.setCommandsEnabled(true);
  }

  playerAttack() {
    const attackerParty = this.parties.player;
    const defenderParty = this.parties.enemy;
    const attacker = this.getFrontMember(attackerParty);
    const defender = this.getFrontMember(defenderParty);
    if (!attacker || !defender) return;
    const damage = this.calculateDamage(attacker, defender, defenderParty);
    this.logBattleEvent(
      "action_attack",
      this.localization.t("log_player_attack", { player: attacker.name, enemy: defender.name, damage }),
      { actor: "player" }
    );
    defender.currentHP = clamp(defender.currentHP - damage, 0, defender.maxHP);
    this.logBattleEvent("damage_resolve", `${defender.name} HP ${defender.currentHP}/${defender.maxHP}`, {
      actor: "player",
      damage,
    });
    this.logBattleEvent(
      "enemy_hp_update",
      this.localization.t("log_enemy_hp_update", { enemy: defender.name, current: defender.currentHP, max: defender.maxHP }),
      { enemy: defender.name, hp: defender.currentHP }
    );
    this.consumeStamina(attacker, ACTION_RULES.attackCost);
    this.triggerDamageFeedback("enemy");
    this.handleKnockout(defenderParty, "front_ko");
  }

  playerDefend() {
    const party = this.parties.player;
    const front = this.getFrontMember(party);
    if (!front) return;
    party.guard = true;
    this.consumeStamina(front, ACTION_RULES.defendReward);
    this.logBattleEvent("action_defend", this.localization.t("log_player_defend", { player: front.name }), {
      actor: "player",
    });
  }

  playerUseItem() {
    const itemId = "potion_small";
    const remaining = this.inventory[itemId] || 0;
    if (remaining <= 0) {
      this.logSystem(this.localization.t("log_no_items"));
      return false;
    }
    const item = ITEM_DEFS[itemId];
    const target = this.getFrontMember(this.parties.player);
    if (!target) return false;
    const before = target.currentHP;
    target.currentHP = Math.min(target.maxHP, target.currentHP + item.healAmount);
    const healed = target.currentHP - before;
    this.inventory[itemId] = remaining - 1;
    this.updateInventoryDisplay();
    this.logBattleEvent(
      "item_use",
      this.localization.t("log_player_item", { player: target.name, item: this.getItemName(itemId), amount: healed }),
      { actor: "player", item: itemId }
    );
    return true;
  }

  consumeStamina(member, amount) {
    member.currentST = clamp(member.currentST - amount, 0, member.maxST);
  }

  calculateDamage(attacker, defender, defenderParty) {
    const baseDamage = Math.max(1, attacker.attack - defender.defense);
    if (defenderParty.guard) {
      defenderParty.guard = false;
      return Math.max(1, Math.floor(baseDamage / 2));
    }
    return baseDamage;
  }

  async enemyTurn() {
    if (!this.enemyAI) {
      this.enemyAI = new EnemyAI(this);
    }
    await this.enemyAI.takeTurn();
  }

  enemyAttack() {
    const attackerParty = this.parties.enemy;
    const defenderParty = this.parties.player;
    const attacker = this.getFrontMember(attackerParty);
    const defender = this.getFrontMember(defenderParty);
    if (!attacker || !defender) return;
    const damage = this.calculateDamage(attacker, defender, defenderParty);
    this.logBattleEvent(
      "enemy_action_attack",
      this.localization.t("log_enemy_attack", { enemy: attacker.name, player: defender.name, damage }),
      { actor: "enemy" }
    );
    defender.currentHP = clamp(defender.currentHP - damage, 0, defender.maxHP);
    this.logBattleEvent("damage_resolve", `${defender.name} HP ${defender.currentHP}/${defender.maxHP}`, {
      actor: "enemy",
      damage,
    });
    this.consumeStamina(attacker, ACTION_RULES.attackCost);
    this.triggerDamageFeedback("player");
    this.handleKnockout(defenderParty, "front_ko");
  }

  enemyDefend() {
    const party = this.parties.enemy;
    const front = this.getFrontMember(party);
    if (!front) return;
    party.guard = true;
    this.consumeStamina(front, ACTION_RULES.defendReward);
    this.logBattleEvent("enemy_action_defend", this.localization.t("log_enemy_defend", { enemy: front.name }), {
      actor: "enemy",
    });
  }

  enemyHeavySkill() {
    const attackerParty = this.parties.enemy;
    const defenderParty = this.parties.player;
    const attacker = this.getFrontMember(attackerParty);
    const defender = this.getFrontMember(defenderParty);
    if (!attacker || !defender) return;
    const baseDamage = this.calculateDamage(attacker, defender, defenderParty);
    const damage = baseDamage + ENEMY_AI_TUNING.heavyBonusLowHp;
    this.logBattleEvent(
      "enemy_action_heavy",
      this.localization.t("log_enemy_heavy", { enemy: attacker.name, player: defender.name, damage }),
      { actor: "enemy", bonus: ENEMY_AI_TUNING.heavyBonusLowHp }
    );
    defender.currentHP = clamp(defender.currentHP - damage, 0, defender.maxHP);
    this.logBattleEvent("damage_resolve", `${defender.name} HP ${defender.currentHP}/${defender.maxHP}`, {
      actor: "enemy",
      damage,
    });
    this.consumeStamina(attacker, ACTION_RULES.heavySkillCost);
    this.triggerDamageFeedback("player");
    this.handleKnockout(defenderParty, "front_ko");
  }

  applyBacklineRegen(party) {
    if (!party) return;
    const updates = [];
    const isPlayerParty = party === this.parties.player;
    const stText = this.localization.t("st_label");
    party.members.forEach((member, idx) => {
      if (idx === party.frontIndex) return;
      if (member.currentHP <= 0) return;
      const before = member.currentST;
      const after = clamp(member.currentST + ACTION_RULES.backlineRegen, 0, member.maxST);
      member.currentST = after;
      if (after !== before) {
        updates.push({ name: member.name, amount: after - before });
      }
    });
    if (updates.length) {
      const total = updates.reduce((sum, entry) => sum + entry.amount, 0);
      const message = this.localization.t("log_backline_regen", { party: party.label, amount: total });
      this.logBattleEvent("backline_st_regen", message, { party: party.label, updates });
      if (isPlayerParty && this.labels.backlineLiveRegion) {
        const detail = updates.map((entry) => `${entry.name}+${entry.amount}`).join(", ");
        const detailSuffix = detail ? ` (${detail} ${stText})` : "";
        this.labels.backlineLiveRegion.textContent = `${message}${detailSuffix}`;
      }
    } else if (isPlayerParty && this.labels.backlineLiveRegion) {
      this.labels.backlineLiveRegion.textContent = "";
    }
  }

  handleKnockout(party, reason) {
    if (!party) return;
    const front = this.getFrontMember(party);
    if (front && front.currentHP > 0) {
      return;
    }
    if (!this.hasAvailableBackliner(party)) {
      return;
    }
    this.forceSwap(party, reason);
  }

  handleStLockout(party, side) {
    const front = this.getFrontMember(party);
    if (!front) return false;
    if (front.currentST >= ACTION_RULES.minActionSt) {
      return false;
    }
    if (!this.hasAvailableBackliner(party)) {
      this.logBattleEvent(
        "st_lockout",
        this.localization.t("log_st_lockout", { name: front.name }),
        { actor: side }
      );
      return false;
    }
    return this.forceSwap(party, "st_lockout");
  }

  forceSwap(party, reason) {
    const candidates = this.findBacklineIndexes(party);
    if (!candidates.length) {
      this.logBattleEvent("no_swap_available", this.localization.t("log_no_swap_targets"), { party: party.label });
      return false;
    }
    const nextIndex = candidates[0];
    const incoming = party.members[nextIndex];
    party.frontIndex = nextIndex;
    party.guard = false;
    const message = this.localization.t("log_forced_swap", { incoming: incoming.name, reason });
    this.logBattleEvent(
      "forced_swap",
      message,
      { party: party.label, reason }
    );
    this.showForcedSwapBanner(message);
    return true;
  }

  showForcedSwapBanner(message) {
    if (!this.labels.forcedSwapBanner || !this.labels.forcedSwapText) return;
    this.labels.forcedSwapText.textContent = message;
    this.labels.forcedSwapBanner.setAttribute("aria-hidden", "false");
    if (this.forcedSwapTimeout) {
      clearTimeout(this.forcedSwapTimeout);
    }
    this.forcedSwapTimeout = window.setTimeout(() => {
      this.labels.forcedSwapBanner?.setAttribute("aria-hidden", "true");
    }, 2600);
  }

  openSwapPanel() {
    if (!this.canVoluntarySwap()) {
      this.logBattleEvent("swap_unavailable", this.localization.t("log_no_swap_targets"), { actor: "player" });
      return;
    }
    this.setSwapSelection(null);
    this.renderSwapCandidates();
    this.labels.swapPanel.setAttribute("aria-hidden", "false");
    this.logBattleEvent("swap_request", this.localization.t("log_swap_request"), { actor: "player" });
  }

  closeSwapPanel() {
    this.labels.swapPanel.setAttribute("aria-hidden", "true");
    this.setSwapSelection(null);
  }

  renderSwapCandidates() {
    const party = this.parties.player;
    const container = this.labels.swapCandidates;
    if (!container) return;
    container.innerHTML = "";
    if (!party) return;
    const indexes = party.members
      .map((_, idx) => idx)
      .filter((idx) => idx !== party.frontIndex);
    if (!indexes.length) {
      const empty = document.createElement("p");
      empty.className = "candidate-grid__empty";
      empty.textContent = this.localization.t("log_no_swap_targets");
      container.appendChild(empty);
      this.swapSelectionIndex = null;
      this.updateSwapSelectionUI();
      return;
    }
    const hpLabel = this.localization.t("hp_label");
    const stLabel = this.localization.t("st_label");
    indexes.forEach((idx) => {
      const member = party.members[idx];
      if (!member) return;
      const button = document.createElement("button");
      button.className = "candidate-card";
      button.type = "button";
      button.setAttribute("data-index", String(idx));
      button.setAttribute("role", "option");
      const isDown = member.currentHP <= 0;
      if (isDown) {
        button.classList.add("candidate-card--disabled");
        button.disabled = true;
        button.setAttribute("aria-disabled", "true");
      } else {
        button.setAttribute("aria-disabled", "false");
      }
      const name = document.createElement("div");
      name.className = "candidate-card__name";
      name.textContent = member.name;
      const stats = document.createElement("div");
      stats.className = "candidate-card__stats";
      const hpStat = document.createElement("span");
      hpStat.textContent = `${hpLabel} ${member.currentHP}/${member.maxHP}`;
      const stStat = document.createElement("span");
      stStat.textContent = `${stLabel} ${member.currentST}/${member.maxST}`;
      stats.appendChild(hpStat);
      stats.appendChild(stStat);
      const bars = document.createElement("div");
      bars.className = "candidate-card__bars";
      const hpBar = document.createElement("div");
      hpBar.className = "candidate-card__bar";
      const hpFill = document.createElement("div");
      hpFill.className = "candidate-card__fill";
      hpFill.style.width = `${(member.currentHP / member.maxHP) * 100}%`;
      hpBar.appendChild(hpFill);
      bars.appendChild(hpBar);
      const stBar = document.createElement("div");
      stBar.className = "candidate-card__bar";
      const stFill = document.createElement("div");
      stFill.className = "candidate-card__fill candidate-card__fill--st";
      stFill.style.width = `${(member.currentST / member.maxST) * 100}%`;
      stBar.appendChild(stFill);
      bars.appendChild(stBar);
      const traits = document.createElement("div");
      traits.className = "candidate-card__traits";
      (member.traits || []).forEach((trait) => {
        const badge = document.createElement("span");
        badge.className = "party__trait";
        badge.textContent = trait;
        traits.appendChild(badge);
      });
      const warnings = [];
      if (isDown) {
        warnings.push(this.localization.t("ko_label"));
      } else if (member.currentST < ACTION_RULES.minActionSt) {
        warnings.push(this.localization.t("low_st_label"));
      }
      button.appendChild(name);
      button.appendChild(stats);
      button.appendChild(bars);
      if (traits.childElementCount) {
        button.appendChild(traits);
      }
      if (warnings.length) {
        const warning = document.createElement("div");
        warning.className = "candidate-card__warning";
        const icon = document.createElement("span");
        icon.className = "candidate-card__warning-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "⚠️";
        const text = document.createElement("span");
        text.textContent = warnings.join(" / ");
        warning.appendChild(icon);
        warning.appendChild(text);
        button.appendChild(warning);
      }
      container.appendChild(button);
    });
    this.updateSwapSelectionUI();
  }

  setSwapSelection(index) {
    if (Number.isInteger(index)) {
      this.swapSelectionIndex = index;
    } else {
      this.swapSelectionIndex = null;
    }
    this.updateSwapSelectionUI();
  }

  updateSwapSelectionUI() {
    const hasSelection = Number.isInteger(this.swapSelectionIndex);
    if (this.buttons.swapConfirm) {
      this.buttons.swapConfirm.disabled = !hasSelection;
    }
    this.labels.swapCandidates?.querySelectorAll("button[data-index]").forEach((btn) => {
      const idx = Number(btn.getAttribute("data-index"));
      const isSelected = hasSelection && idx === this.swapSelectionIndex;
      btn.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
  }

  executeSelectedSwap() {
    if (!Number.isInteger(this.swapSelectionIndex)) return;
    this.executeVoluntarySwap(this.swapSelectionIndex);
  }

  async executeVoluntarySwap(index) {
    const party = this.parties.player;
    const front = this.getFrontMember(party);
    if (!front) return;
    const target = party.members[index];
    if (!target || target.currentHP <= 0) return;
    if (front.currentST < ACTION_RULES.swapCost) {
      this.logBattleEvent("swap_unavailable", this.localization.t("log_st_lockout", { name: front.name }), { actor: "player" });
      return;
    }
    this.logBattleEvent("turn_start", `Player turn ${this.turnCount}`, { actor: "player" });
    await this.audio.playSfx("swap");
    this.consumeStamina(front, ACTION_RULES.swapCost);
    party.frontIndex = index;
    this.closeSwapPanel();
    this.logBattleEvent(
      "swap_confirmed",
      this.localization.t("log_swap_confirmed", { outgoing: front.name, incoming: target.name }),
      { actor: "player" }
    );
    this.renderParties();
    if (await this.checkBattleResolution()) {
      return;
    }
    await this.finalizePlayerTurn();
  }

  renderParties() {
    const playerParty = this.parties.player;
    if (playerParty) {
      this.updateMonsterDisplay(playerParty, playerParty.frontIndex, {
        context: "player",
        cardEl: this.labels.playerFrontCard,
        nameEl: this.labels.playerFrontName,
        elementIconEl: this.labels.playerFrontElementIcon,
        elementLabelEl: this.labels.playerFrontElementLabel,
        statusEl: this.labels.playerFrontStatus,
        hpTextEl: this.labels.playerFrontHpText,
        hpBarEl: this.labels.playerFrontHpBar,
        hpGaugeEl: this.labels.playerFrontHpGauge,
        stTextEl: this.labels.playerFrontStText,
        stBarEl: this.labels.playerFrontStBar,
        stGaugeEl: this.labels.playerFrontStGauge,
        showSt: true,
        stats: {
          atk: this.labels.playerFrontAtk,
          def: this.labels.playerFrontDef,
          mag: this.labels.playerFrontMag,
          spd: this.labels.playerFrontSpd,
        },
      });
      this.updateMonsterDisplay(playerParty, -1, {
        backlineContainer: this.labels.playerBackline,
        context: "player",
      });
    }
    const enemyParty = this.parties.enemy;
    if (enemyParty) {
      this.updateMonsterDisplay(enemyParty, enemyParty.frontIndex, {
        context: "enemy",
        cardEl: this.labels.enemyFrontCard,
        nameEl: this.labels.enemyFrontName,
        elementIconEl: this.labels.enemyFrontElementIcon,
        elementLabelEl: this.labels.enemyFrontElementLabel,
        statusEl: this.labels.enemyFrontStatus,
        hpTextEl: this.labels.enemyFrontHpText,
        hpBarEl: this.labels.enemyFrontHpBar,
        hpGaugeEl: this.labels.enemyFrontHpGauge,
        stats: {
          atk: this.labels.enemyFrontAtk,
          def: this.labels.enemyFrontDef,
          mag: this.labels.enemyFrontMag,
          spd: this.labels.enemyFrontSpd,
        },
      });
      this.updateMonsterDisplay(enemyParty, -1, {
        backlineContainer: this.labels.enemyBackline,
        context: "enemy",
      });
    }
    this.updateInventoryDisplay();
    this.buttons.swap.disabled = !this.canVoluntarySwap();
  }

  updateMonsterDisplay(party, monsterIndex, refs = {}) {
    if (!party) return;
    const isFrontMonster = party.frontIndex === monsterIndex;
    if (isFrontMonster) {
      this.renderFrontCard(party, refs);
    } else if (refs.backlineContainer && refs.context) {
      this.renderBackline(party, refs.backlineContainer, refs.context);
    }
  }

  renderFrontCard(party, refs = {}) {
    const front = this.getFrontMember(party);
    const hpMax = front?.maxHP ?? 0;
    const hpCurrent = front ? clamp(front.currentHP, 0, hpMax) : 0;
    const hpPercent = hpMax > 0 ? clamp((hpCurrent / hpMax) * 100, 0, 100) : 0;
    const stMax = front?.maxST ?? 0;
    const stCurrent = front ? clamp(front.currentST, 0, stMax) : 0;
    const stPercent = stMax > 0 ? clamp((stCurrent / stMax) * 100, 0, 100) : 0;
    const elementInfo = this.getElementDisplay(front?.element);

    refs.nameEl?.textContent = front ? front.name : "-";
    refs.elementIconEl?.setAttribute("data-element", front?.element ?? "neutral");
    if (refs.elementIconEl) {
      refs.elementIconEl.textContent = elementInfo.icon;
    }
    if (refs.elementLabelEl) {
      refs.elementLabelEl.textContent = elementInfo.label;
    }
    if (refs.hpTextEl) {
      refs.hpTextEl.textContent = `${hpCurrent}/${hpMax}`;
    }
    if (refs.hpBarEl) {
      refs.hpBarEl.style.width = `${hpPercent}%`;
    }
    if (refs.hpGaugeEl) {
      this.applyGaugeState(refs.hpGaugeEl, "hp", hpPercent);
    }
    if (refs.showSt && refs.stTextEl && refs.stBarEl && refs.stGaugeEl) {
      refs.stTextEl.textContent = `${stCurrent}/${stMax}`;
      refs.stBarEl.style.width = `${stPercent}%`;
      this.applyGaugeState(refs.stGaugeEl, "st", stPercent);
    } else if (refs.stGaugeEl) {
      this.applyGaugeState(refs.stGaugeEl, "st", 0);
      if (refs.stTextEl) {
        refs.stTextEl.textContent = "0/0";
      }
      if (refs.stBarEl) {
        refs.stBarEl.style.width = "0%";
      }
    }
    if (refs.stats) {
      refs.stats.atk && (refs.stats.atk.textContent = front ? front.attack : 0);
      refs.stats.def && (refs.stats.def.textContent = front ? front.defense : 0);
      refs.stats.mag && (refs.stats.mag.textContent = front ? front.magic : 0);
      refs.stats.spd && (refs.stats.spd.textContent = front ? front.speed : 0);
    }
    const isDown = !front || front.currentHP <= 0;
    if (refs.cardEl) {
      refs.cardEl.classList.toggle("frontline-card--down", isDown);
    }
    if (refs.statusEl) {
      refs.statusEl.textContent = isDown ? this.localization.t("ko_label") : "";
    }
    if (refs.context) {
      this.rememberFrontline(refs.context, front?.id ?? null);
    }
  }

  renderBackline(party, container, context) {
    if (!container || !party) return;
    container.innerHTML = "";
    const hpLabel = this.localization.t("hp_label");
    const koLabel = this.localization.t("ko_label");
    const swapLabel = this.localization.t("cmd_swap");
    const isPlayerSide = context === "player";
    party.members.forEach((member, idx) => {
      if (idx === party.frontIndex) return;
      const card = document.createElement("div");
      card.className = `backline-card${context === "enemy" ? " backline-card--enemy" : ""}`;
      card.setAttribute("role", "listitem");
      const isDown = member.currentHP <= 0;
      card.setAttribute("aria-disabled", isDown ? "true" : "false");
      card.classList.toggle("backline-card--down", isDown);
      card.classList.toggle("backline-card--interactive", isPlayerSide && !isDown);
      const badge = document.createElement("span");
      badge.className = "backline-card__badge";
      badge.setAttribute("aria-hidden", "true");
      badge.textContent = "[BACK]";
      card.appendChild(badge);
      const header = document.createElement("div");
      header.className = "backline-card__header";
      const name = document.createElement("div");
      name.className = "backline-card__name";
      name.textContent = member.name;
      header.appendChild(name);
      const element = document.createElement("div");
      element.className = "backline-card__element";
      const elementInfo = this.getElementDisplay(member.element);
      const icon = document.createElement("span");
      icon.className = "backline-card__element-icon";
      icon.textContent = elementInfo.icon;
      const label = document.createElement("span");
      label.className = "backline-card__element-label";
      label.textContent = elementInfo.label;
      element.appendChild(icon);
      element.appendChild(label);
      header.appendChild(element);
      card.appendChild(header);
      card.appendChild(
        this.createMiniGauge({
          label: hpLabel,
          current: member.currentHP,
          max: member.maxHP,
          type: "hp",
        })
      );
      const status = document.createElement("div");
      status.className = "backline-card__status";
      status.textContent = isDown ? koLabel : isPlayerSide ? swapLabel : "";
      card.appendChild(status);
      container.appendChild(card);
    });
  }

  createMiniGauge({ label, current, max, type = "hp" }) {
    const wrapper = document.createElement("div");
    wrapper.className = `mini-gauge mini-gauge--${type}`;
    const meta = document.createElement("div");
    meta.className = "mini-gauge__meta";
    const left = document.createElement("span");
    left.textContent = label;
    const right = document.createElement("span");
    right.textContent = `${current}/${max}`;
    meta.appendChild(left);
    meta.appendChild(right);
    const track = document.createElement("div");
    track.className = "mini-gauge__track";
    const fill = document.createElement("div");
    fill.className = "mini-gauge__fill";
    const percent = max > 0 ? clamp((current / max) * 100, 0, 100) : 0;
    fill.style.width = `${percent}%`;
    track.appendChild(fill);
    wrapper.appendChild(meta);
    wrapper.appendChild(track);
    this.applyMiniGaugeState(wrapper, type, percent);
    return wrapper;
  }

  applyGaugeState(gaugeEl, type, percent) {
    if (!gaugeEl) return;
    const states = type === "hp" ? ["healthy", "warning", "critical"] : ["full", "low", "zero"];
    states.forEach((state) => gaugeEl.classList.remove(`gauge--${type}-${state}`));
    const state = this.resolveGaugeState(type, percent);
    gaugeEl.classList.add(`gauge--${type}-${state}`);
    if (type === "st") {
      gaugeEl.classList.toggle("gauge--st-zero", state === "zero");
    }
  }

  applyMiniGaugeState(wrapper, type, percent) {
    if (!wrapper) return;
    const states = type === "hp" ? ["healthy", "warning", "critical"] : ["full", "low", "zero"];
    states.forEach((state) => wrapper.classList.remove(`mini-gauge--${type}-${state}`));
    const state = this.resolveGaugeState(type, percent);
    wrapper.classList.add(`mini-gauge--${type}-${state}`);
  }

  resolveGaugeState(type, percent) {
    const value = clamp(percent, 0, 100);
    if (type === "st") {
      if (value <= 0) return "zero";
      if (value < 50) return "low";
      return "full";
    }
    if (value >= 70) return "healthy";
    if (value >= 30) return "warning";
    return "critical";
  }

  getElementDisplay(elementType) {
    const info = ELEMENT_INFO[elementType] || ELEMENT_INFO.neutral;
    const label = info.labels?.[this.localization.language] ?? info.labels?.en ?? elementType ?? "-";
    return { icon: info.icon, label };
  }

  rememberFrontline(side, monsterId) {
    if (!side) return;
    if (!monsterId) {
      this.frontlineMembers[side] = null;
      return;
    }
    if (this.frontlineMembers[side] === monsterId) {
      return;
    }
    this.frontlineMembers[side] = monsterId;
    this.triggerFrontlineEntry(side);
  }

  triggerFrontlineEntry(side) {
    const card = side === "enemy" ? this.labels.enemyFrontCard : this.labels.playerFrontCard;
    this.applyTransientClass(card, "frontline-card--enter", 700);
  }

  triggerDamageFeedback(side) {
    const card = side === "enemy" ? this.labels.enemyFrontCard : this.labels.playerFrontCard;
    this.applyTransientClass(card, "frontline-card--shake", 520);
  }

  applyTransientClass(element, className, duration = 600) {
    if (!element || typeof window === "undefined") return;
    const key = `${element.id || className}-${className}`;
    if (!this.transientClassTimers) {
      this.transientClassTimers = {};
    }
    if (this.transientClassTimers[key]) {
      clearTimeout(this.transientClassTimers[key]);
    }
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    this.transientClassTimers[key] = window.setTimeout(() => {
      element.classList.remove(className);
      delete this.transientClassTimers[key];
    }, duration);
  }

  updateInventoryDisplay() {
    const fragments = Object.entries(this.inventory).map(([id, count]) => {
      const item = ITEM_DEFS[id];
      if (!item) return "";
      return this.localization.t("inventory_item", { item: this.getItemName(id), count });
    });
    this.labels.inventory.textContent = fragments.filter(Boolean).join("  ");
  }

  getItemName(itemId) {
    const item = ITEM_DEFS[itemId];
    if (!item) return itemId;
    if (item.names) {
      return item.names[this.localization.language] || item.names.en || Object.values(item.names)[0];
    }
    return item.name || itemId;
  }

  logSystem(message) {
    if (!message) return;
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.textContent = message;
    this.labels.battleLog.appendChild(entry);
    this.labels.battleLog.scrollTop = this.labels.battleLog.scrollHeight;
  }

  logBattleEvent(key, message, payload = {}) {
    const text = key ? `[${key}] ${message}` : message;
    this.logSystem(text);
    if (key) {
      const payloadWithContext = { ...payload, turn: this.turnCount };
      console.info("[BattleEvent]", key, { message, ...payloadWithContext });
      this.analytics.track(key, payloadWithContext);
    } else if (message) {
      console.info("[BattleLog]", message);
    }
  }

  logTurnEnd(actor) {
    if (this.state !== "Battle") return;
    const labelKey = actor === "enemy" ? "enemy_party_label" : "player_party_label";
    const actorLabel = this.localization.t(labelKey);
    this.logBattleEvent("turn_end", this.localization.t("log_turn_end", { actor: actorLabel }), { actor });
  }

  async checkBattleResolution() {
    const playerDefeated = this.isPartyDefeated(this.parties.player);
    const enemyDefeated = this.isPartyDefeated(this.parties.enemy);
    if (enemyDefeated && !playerDefeated) {
      await this.finishBattle(true);
      return true;
    }
    if (playerDefeated) {
      await this.finishBattle(false);
      return true;
    }
    return false;
  }

  isPartyDefeated(party) {
    if (!party) return true;
    return party.members.every((member) => member.currentHP <= 0);
  }

  async finishBattle(playerWon) {
    this.closeSwapPanel();
    this.setCommandsEnabled(false);
    if (playerWon) {
      await this.audio.playSfx("win");
      this.analytics.track("player_win");
      this.saveManager.data.progress.wins += 1;
      this.lastResult = "victory";
      this.logBattleEvent("battle_end", this.localization.t("log_victory", { enemy: this.parties.enemy.label }));
    } else {
      await this.audio.playSfx("lose");
      this.analytics.track("player_lose");
      this.saveManager.data.progress.losses += 1;
      this.lastResult = "defeat";
      this.logBattleEvent("battle_end", this.localization.t("log_defeat"));
    }
    this.saveManager.save();
    this.updateProgress();
    this.updateResultScreen();
    await this.delay(900);
    this.setScreen("Result");
  }

  updateResultScreen() {
    const key = this.lastResult === "victory" ? "result_victory" : "result_defeat";
    this.labels.resultTitle.textContent = this.localization.t(key);
    this.renderResultList(this.parties.player, this.labels.resultPlayerList, true);
    this.renderResultList(this.parties.enemy, this.labels.resultEnemyList, false);
  }

  renderResultList(party, container, showSt) {
    container.innerHTML = "";
    if (!party) return;
    party.members.forEach((member) => {
      const item = document.createElement("li");
      const stText = showSt ? ` / ST ${member.currentST}/${member.maxST}` : "";
      item.textContent = `${member.name}: ${member.currentHP}/${member.maxHP}${stText}`;
      container.appendChild(item);
    });
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new GameApp();
  if (typeof window !== "undefined") {
    window.__casualGameApp = app;
  }
});
