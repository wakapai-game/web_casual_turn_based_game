const DATA = {
  player: {
    name: "Hero",
    maxHP: 100,
    attack: 20,
    defense: 10,
    items: [{ id: "potion_small", count: 1 }],
  },
  enemies: [
    { id: "slime", name: "Slime", maxHP: 50, attack: 10, defense: 5 },
    { id: "goblin", name: "Goblin", maxHP: 70, attack: 15, defense: 7 },
    { id: "bat", name: "Bat", maxHP: 40, attack: 12, defense: 3 },
  ],
  items: {
    potion_small: {
      id: "potion_small",
      names: { en: "Small Potion", ja: "ちいさなポーション" },
      healAmount: 20,
    },
  },
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
    hp_label: "HP",
    result_title: "Result",
    result_player: "Player",
    result_enemy: "Enemy",
    result_back: "Back to Title",
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
    log_victory: "{enemy} was defeated!",
    log_defeat: "The hero collapses...",
    inventory_item: "{item} x{count}",
    result_victory: "Victory",
    result_defeat: "Defeat",
    settings_saved: "Settings saved.",
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
    hp_label: "HP",
    result_title: "リザルト",
    result_player: "プレイヤー",
    result_enemy: "てき",
    result_back: "タイトルにもどる",
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
    log_victory: "{enemy}をたおした！",
    log_defeat: "ヒーローはたおれてしまった...！",
    inventory_item: "{item} x{count}",
    result_victory: "しょうり",
    result_defeat: "はいぼく",
    settings_saved: "設定を保存しました。",
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
        name: DATA.player.name,
        maxHP: DATA.player.maxHP,
        attack: DATA.player.attack,
        defense: DATA.player.defense,
        items: DATA.player.items.map((item) => ({ ...item })),
      },
      progress: { wins: 0, losses: 0 },
      settings: { language: "ja", volume: 0.6 },
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
      result: 262,
    };
    const freq = frequencyMap[name] ?? 220;
    const osc = this.context.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = this.context.createGain();
    gain.gain.value = 0.08;
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
    }[name] || 440;
    osc.frequency.setValueAtTime(base, now);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }
}

class GameApp {
  constructor() {
    this.localization = new Localization();
    this.analytics = new Analytics();
    this.saveManager = new SaveManager();
    this.audio = new AudioManager(this.saveManager);

    this.state = "Boot";
    this.player = null;
    this.enemy = null;
    this.inventory = {};
    this.playerGuard = false;
    this.enemyGuard = false;

    this.lastResult = null;

    this.cacheDom();
    this.bindEvents();
    this.loadFromSave();
    this.bootstrap();
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
    };
    this.dialogs = {
      settings: document.getElementById("settings-dialog"),
      exit: document.getElementById("exit-dialog"),
    };
    this.labels = {
      wins: document.getElementById("wins-count"),
      losses: document.getElementById("losses-count"),
      playerName: document.getElementById("player-name"),
      enemyName: document.getElementById("enemy-name"),
      playerHpText: document.getElementById("player-hp-text"),
      enemyHpText: document.getElementById("enemy-hp-text"),
      playerHpBar: document.getElementById("player-hp-bar"),
      enemyHpBar: document.getElementById("enemy-hp-bar"),
      inventory: document.getElementById("inventory-display"),
      battleLog: document.getElementById("battle-log"),
      resultTitle: document.getElementById("result-title"),
      resultPlayerHp: document.getElementById("result-player-hp"),
      resultEnemyHp: document.getElementById("result-enemy-hp"),
      languageSelect: document.getElementById("settings-language"),
      volumeSlider: document.getElementById("settings-volume"),
    };
  }

  bindEvents() {
    this.buttons.start.addEventListener("click", () => this.handleStart());
    this.buttons.settings.addEventListener("click", () => this.openSettings());
    this.buttons.exit.addEventListener("click", () => this.openExit());
    this.buttons.resultTitle.addEventListener("click", () => this.gotoTitle());
    this.buttons.resultExit.addEventListener("click", () => this.openExit());
    this.buttons.settingsClose.addEventListener("click", () => this.closeSettings());
    this.buttons.exitClose.addEventListener("click", () => this.closeExit());

    this.labels.languageSelect.addEventListener("change", (event) => {
      this.localization.setLanguage(event.target.value);
      this.onLanguageChanged();
      this.saveManager.data.settings.language = this.localization.language;
      this.saveManager.save();
    });

    this.labels.volumeSlider.addEventListener("input", (event) => {
      const value = parseFloat(event.target.value);
      this.audio.setVolume(value);
    });

    this.buttons.attack.addEventListener("click", () => this.playerAction("attack"));
    this.buttons.defend.addEventListener("click", () => this.playerAction("defend"));
    this.buttons.item.addEventListener("click", () => this.playerAction("item"));
  }

  loadFromSave() {
    const { language, volume } = this.saveManager.data.settings;
    this.localization.setLanguage(language);
    this.onLanguageChanged();
    this.labels.languageSelect.value = language;
    this.labels.volumeSlider.value = volume;
    this.audio.setVolume(volume);
    this.updateProgress();
  }

  bootstrap() {
    this.analytics.track("start_game");
    this.setScreen("Boot");
    setTimeout(() => {
      this.gotoTitle();
    }, 800);
  }

  setScreen(name) {
    Object.entries(this.screens).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle("screen--active", key === name);
    });
    this.state = name;
    if (name === "Title") {
      this.audio.playBgm("title");
    } else if (name === "Battle") {
      this.audio.playBgm("battle");
    } else if (name === "Result") {
      this.audio.playBgm("result");
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
    await this.audio.ensureContext();
    this.startBattle();
  }

  startBattle() {
    this.analytics.track("start_battle");
    const playerBase = DATA.player;
    this.player = {
      name: playerBase.name,
      maxHP: playerBase.maxHP,
      attack: playerBase.attack,
      defense: playerBase.defense,
      currentHP: playerBase.maxHP,
    };
    const enemyBase = DATA.enemies[Math.floor(Math.random() * DATA.enemies.length)];
    this.enemy = {
      name: enemyBase.name,
      maxHP: enemyBase.maxHP,
      attack: enemyBase.attack,
      defense: enemyBase.defense,
      currentHP: enemyBase.maxHP,
    };
    this.inventory = {};
    DATA.player.items.forEach((item) => {
      this.inventory[item.id] = item.count;
    });
    this.playerGuard = false;
    this.enemyGuard = false;
    this.lastResult = null;
    this.labels.playerName.textContent = this.player.name;
    this.labels.enemyName.textContent = this.enemy.name;
    this.labels.battleLog.innerHTML = "";
    this.updateHpDisplay();
    this.updateInventoryDisplay();
    this.setCommandsEnabled(true);
    this.setScreen("Battle");
    this.logSystem(this.localization.t("log_enemy_appears", { enemy: this.enemy.name }));
  }

  updateHpDisplay() {
    if (!this.player || !this.enemy) return;
    this.labels.playerHpText.textContent = `${this.player.currentHP}/${this.player.maxHP}`;
    this.labels.enemyHpText.textContent = `${this.enemy.currentHP}/${this.enemy.maxHP}`;
    const playerRatio = Math.max(0, this.player.currentHP) / this.player.maxHP;
    const enemyRatio = Math.max(0, this.enemy.currentHP) / this.enemy.maxHP;
    this.labels.playerHpBar.style.width = `${playerRatio * 100}%`;
    this.labels.enemyHpBar.style.width = `${enemyRatio * 100}%`;
  }

  updateInventoryDisplay() {
    const fragments = Object.entries(this.inventory).map(([id, count]) => {
      const item = DATA.items[id];
      if (!item) return "";
      return this.localization.t("inventory_item", { item: this.getItemName(id), count });
    });
    this.labels.inventory.textContent = fragments.filter(Boolean).join("  ");
  }

  getItemName(itemId) {
    const item = DATA.items[itemId];
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

  setCommandsEnabled(enabled) {
    this.buttons.attack.disabled = !enabled;
    this.buttons.defend.disabled = !enabled;
    this.buttons.item.disabled = !enabled;
  }

  async playerAction(type) {
    if (this.state !== "Battle") return;
    this.setCommandsEnabled(false);
    if (type === "attack") {
      this.analytics.track("button_click", { id: "attack" });
      await this.audio.playSfx("attack");
      this.playerAttack();
    } else if (type === "defend") {
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
    }
    this.updateHpDisplay();
    if (this.enemy.currentHP <= 0) {
      await this.finishBattle(true);
      return;
    }
    await this.delay(650);
    await this.enemyTurn();
    this.updateHpDisplay();
    if (this.player.currentHP <= 0) {
      await this.finishBattle(false);
      return;
    }
    this.setCommandsEnabled(true);
  }

  playerAttack() {
    const baseDamage = Math.max(1, this.player.attack - this.enemy.defense);
    const damage = this.enemyGuard ? Math.max(1, Math.floor(baseDamage / 2)) : baseDamage;
    if (this.enemyGuard) {
      this.logSystem(this.localization.t("log_player_guard_break", { enemy: this.enemy.name }));
      this.enemyGuard = false;
    }
    this.enemy.currentHP = Math.max(0, this.enemy.currentHP - damage);
    this.logSystem(
      this.localization.t("log_player_attack", {
        player: this.player.name,
        enemy: this.enemy.name,
        damage,
      })
    );
  }

  playerDefend() {
    this.playerGuard = true;
    this.logSystem(
      this.localization.t("log_player_defend", {
        player: this.player.name,
      })
    );
  }

  playerUseItem() {
    const itemId = "potion_small";
    const remaining = this.inventory[itemId] || 0;
    if (remaining <= 0) {
      this.logSystem(this.localization.t("log_no_items"));
      return false;
    }
    const item = DATA.items[itemId];
    const before = this.player.currentHP;
    this.player.currentHP = Math.min(this.player.maxHP, this.player.currentHP + item.healAmount);
    const healed = this.player.currentHP - before;
    this.inventory[itemId] = remaining - 1;
    this.updateInventoryDisplay();
    this.logSystem(
      this.localization.t("log_player_item", {
        player: this.player.name,
        item: this.getItemName(itemId),
        amount: healed,
      })
    );
    return true;
  }

  async enemyTurn() {
    if (this.enemy.currentHP <= 0) return;
    if (this.enemy.currentHP <= 20) {
      this.enemyGuard = true;
      this.logSystem(this.localization.t("log_enemy_defend", { enemy: this.enemy.name }));
      await this.audio.playSfx("defend");
      return;
    }
    await this.audio.playSfx("damage");
    const baseDamage = Math.max(1, this.enemy.attack - this.player.defense);
    const damage = this.playerGuard ? Math.max(1, Math.floor(baseDamage / 2)) : baseDamage;
    if (this.playerGuard) {
      this.playerGuard = false;
    }
    this.player.currentHP = Math.max(0, this.player.currentHP - damage);
    this.logSystem(
      this.localization.t("log_enemy_attack", {
        enemy: this.enemy.name,
        player: this.player.name,
        damage,
      })
    );
  }

  async finishBattle(playerWon) {
    this.setCommandsEnabled(false);
    if (playerWon) {
      await this.audio.playSfx("win");
      this.analytics.track("player_win");
      this.saveManager.data.progress.wins += 1;
      this.lastResult = "victory";
      this.logSystem(this.localization.t("log_victory", { enemy: this.enemy.name }));
    } else {
      await this.audio.playSfx("lose");
      this.analytics.track("player_lose");
      this.saveManager.data.progress.losses += 1;
      this.lastResult = "defeat";
      this.logSystem(this.localization.t("log_defeat"));
    }
    this.saveManager.save();
    this.updateProgress();
    this.updateResultScreen();
    await this.delay(900);
    this.setScreen("Result");
  }

  updateResultScreen() {
    if (!this.player || !this.enemy) return;
    const key = this.lastResult === "victory" ? "result_victory" : "result_defeat";
    this.labels.resultTitle.textContent = this.localization.t(key);
    this.labels.resultPlayerHp.textContent = `${this.player.currentHP}/${this.player.maxHP}`;
    this.labels.resultEnemyHp.textContent = `${this.enemy.currentHP}/${this.enemy.maxHP}`;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new GameApp();
});
