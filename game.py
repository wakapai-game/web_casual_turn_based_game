"""Text-based casual turn-based battle game based on design docs.

This module provides a small command line game that follows the
specifications described in the design documentation stored alongside the
project.  The game features a simple state machine with Title, Battle, and
Result screens and implements the combat rules defined in the gameplay
document.
"""
from __future__ import annotations

from dataclasses import dataclass, field
import os
import random
from typing import Dict, List, Optional


# --- Core data models -----------------------------------------------------


@dataclass
class Combatant:
    """Represents a participant in the battle."""

    name: str
    max_hp: int
    attack: int
    defense: int
    current_hp: int = field(init=False)

    def __post_init__(self) -> None:
        self.current_hp = self.max_hp

    def take_damage(self, amount: int) -> None:
        self.current_hp = max(0, self.current_hp - amount)

    def heal(self, amount: int) -> int:
        before = self.current_hp
        self.current_hp = min(self.max_hp, self.current_hp + amount)
        return self.current_hp - before

    @property
    def is_alive(self) -> bool:
        return self.current_hp > 0


@dataclass
class Item:
    """Usable battle item."""

    id: str
    name: str
    heal_amount: int


# --- Game data ------------------------------------------------------------


def default_player() -> Combatant:
    """Create the default hero described in the gameplay document."""

    return Combatant(name="Hero", max_hp=100, attack=20, defense=10)


def load_enemies() -> List[Combatant]:
    """Create the enemies defined in the gameplay document."""

    return [
        Combatant(name="Slime", max_hp=50, attack=10, defense=5),
        Combatant(name="Goblin", max_hp=70, attack=15, defense=7),
        Combatant(name="Bat", max_hp=40, attack=12, defense=3),
    ]


def load_items() -> Dict[str, Item]:
    """Return available items for the player's inventory."""

    potion = Item(id="potion_small", name="Small Potion", heal_amount=20)
    return {potion.id: potion}


# --- Combat logic ---------------------------------------------------------


def calculate_damage(attacker: Combatant, defender: Combatant) -> int:
    """Calculate damage according to the formula in the design doc."""

    return max(1, attacker.attack - defender.defense)


@dataclass
class BattleLogEntry:
    message: str


@dataclass
class BattleState:
    """Tracks the current state of an ongoing battle."""

    player: Combatant
    enemy: Combatant
    player_inventory: Dict[str, int]
    defending: bool = False
    log: List[BattleLogEntry] = field(default_factory=list)

    def add_log(self, message: str) -> None:
        self.log.append(BattleLogEntry(message))
        print(message)

    def player_attack(self) -> None:
        damage = calculate_damage(self.player, self.enemy)
        self.enemy.take_damage(damage)
        self.add_log(f"{self.player.name}のこうげき！ {self.enemy.name}に{damage}のダメージ！")

    def player_defend(self) -> None:
        self.defending = True
        self.add_log(f"{self.player.name}はぼうぎょのたいせいをとった！ 次の攻撃のダメージが半減する。")

    def player_use_item(self, item_id: str) -> bool:
        remaining = self.player_inventory.get(item_id, 0)
        if remaining <= 0:
            self.add_log("アイテムがありません！")
            return False

        item = load_items()[item_id]
        healed = self.player.heal(item.heal_amount)
        self.player_inventory[item_id] = remaining - 1
        self.add_log(f"{self.player.name}は{item.name}を使った！ HPが{healed}回復した。")
        return True

    def enemy_attack(self) -> None:
        damage = calculate_damage(self.enemy, self.player)
        if self.defending:
            damage = max(1, damage // 2)
            self.defending = False
        self.player.take_damage(damage)
        self.add_log(f"{self.enemy.name}のこうげき！ {self.player.name}は{damage}のダメージを受けた！")

    def is_battle_over(self) -> bool:
        return not (self.player.is_alive and self.enemy.is_alive)


# --- State machine --------------------------------------------------------


class GameState:
    BOOT = "Boot"
    TITLE = "Title"
    BATTLE = "Battle"
    RESULT = "Result"


class Game:
    """Main game class implementing the state machine."""

    def __init__(self, rng: Optional[random.Random] = None) -> None:
        self.state = GameState.BOOT
        self.player: Optional[Combatant] = None
        self.enemy: Optional[Combatant] = None
        self.inventory: Dict[str, int] = {}
        self.last_result: Optional[str] = None
        self.battle_state: Optional[BattleState] = None
        self.rng = rng or random.Random()

    def run(self) -> None:
        self.state = GameState.BOOT
        print("ゲームを起動しています...")
        self.transition(GameState.TITLE)
        while True:
            if self.state == GameState.TITLE:
                if not self.title_screen():
                    break
            elif self.state == GameState.BATTLE:
                self.battle_screen()
            elif self.state == GameState.RESULT:
                self.result_screen()
            else:
                break

    def transition(self, next_state: str) -> None:
        self.state = next_state

    # --- Screen implementations -----------------------------------------

    def title_screen(self) -> bool:
        print("\n=== タイトル画面 ===")
        print("1) スタート")
        print("2) 終了")
        choice = self.prompt(["1", "2"])
        if choice == "1":
            self.start_battle()
            self.transition(GameState.BATTLE)
            return True
        print("ゲームを終了します。")
        return False

    def start_battle(self) -> None:
        self.player = default_player()
        self.enemy = self.rng.choice(load_enemies())
        self.inventory = {"potion_small": 1}
        self.battle_state = BattleState(
            player=self.player,
            enemy=self.enemy,
            player_inventory=self.inventory,
        )
        print(f"\n{self.enemy.name}があらわれた！")

    def battle_screen(self) -> None:
        assert self.battle_state
        while not self.battle_state.is_battle_over():
            self.render_battle_ui()
            command = self.prompt(["1", "2", "3"])
            if command == "1":
                self.battle_state.player_attack()
            elif command == "2":
                self.battle_state.player_defend()
            elif command == "3":
                if not self.battle_state.player_use_item("potion_small"):
                    continue
            if self.battle_state.enemy.is_alive:
                self.battle_state.enemy_attack()
        if self.player and self.player.is_alive:
            self.last_result = "勝利"
            print(f"{self.enemy.name}をたおした！")
        else:
            self.last_result = "敗北"
            print("ヒーローはたおれてしまった...！")
        self.transition(GameState.RESULT)

    def render_battle_ui(self) -> None:
        assert self.player and self.enemy
        print("\n=== バトル ===")
        print(self.format_hp(self.player))
        print(self.format_hp(self.enemy))
        item = load_items()["potion_small"]
        item_count = self.inventory.get(item.id, 0)
        print("コマンド: 1) こうげき  2) ぼうぎょ  3) アイテム")
        print(f"所持アイテム: {item.name} x{item_count}")

    def format_hp(self, combatant: Combatant) -> str:
        return f"{combatant.name} HP: {combatant.current_hp}/{combatant.max_hp}"

    def result_screen(self) -> None:
        assert self.player and self.enemy and self.last_result
        print("\n=== リザルト ===")
        print(f"結果: {self.last_result}")
        print(self.format_hp(self.player))
        print(self.format_hp(self.enemy))
        print("1) タイトルにもどる")
        print("2) 終了")
        choice = self.prompt(["1", "2"])
        if choice == "1":
            self.transition(GameState.TITLE)
        else:
            print("ゲームを終了します。さようなら！")
            self.transition("Exit")

    @staticmethod
    def prompt(valid_inputs: List[str]) -> str:
        while True:
            response = input("> ").strip()
            if response in valid_inputs:
                return response
            print(f"{', '.join(valid_inputs)} の中から選択してください。")


def main() -> None:
    seed_value = os.getenv("GAME_SEED")
    rng = random.Random(int(seed_value)) if seed_value is not None else None
    game = Game(rng=rng)
    game.run()


if __name__ == "__main__":
    main()
