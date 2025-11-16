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
from typing import Dict, List, Optional


# --- Core data models -----------------------------------------------------


MIN_ACTION_ST = 5
ATTACK_ST_COST = 5
DEFEND_ST_REFUND = 3
VOLUNTARY_SWAP_COST = 10
BACKLINE_ST_REGEN = 3


@dataclass
class Combatant:
    """Represents a participant in the battle."""

    name: str
    max_hp: int
    max_st: int
    attack: int
    defense: int
    current_hp: int = field(init=False)
    current_st: int = field(init=False)

    def __post_init__(self) -> None:
        self.current_hp = self.max_hp
        self.current_st = self.max_st

    def take_damage(self, amount: int) -> None:
        self.current_hp = max(0, self.current_hp - amount)

    def heal(self, amount: int) -> int:
        before = self.current_hp
        self.current_hp = min(self.max_hp, self.current_hp + amount)
        return self.current_hp - before

    def spend_st(self, amount: int) -> bool:
        if self.current_st < amount:
            return False
        self.current_st -= amount
        return True

    def regen_st(self, amount: int) -> int:
        before = self.current_st
        self.current_st = min(self.max_st, self.current_st + amount)
        return self.current_st - before

    @property
    def is_alive(self) -> bool:
        return self.current_hp > 0

    @property
    def is_exhausted(self) -> bool:
        return self.current_st < MIN_ACTION_ST


@dataclass
class Party:
    """Represents a 3-member party with a designated frontline."""

    label: str
    members: List[Combatant]
    front_index: int = 0

    def front(self) -> Optional[Combatant]:
        if 0 <= self.front_index < len(self.members):
            return self.members[self.front_index]
        return None

    def backline_indexes(self) -> List[int]:
        return [i for i in range(len(self.members)) if i != self.front_index]

    def available_backliner_indexes(self) -> List[int]:
        indexes: List[int] = []
        for idx in self.backline_indexes():
            if self.members[idx].is_alive:
                indexes.append(idx)
        return indexes

    def first_available_backliner(self) -> Optional[int]:
        for idx in self.backline_indexes():
            member = self.members[idx]
            if member.is_alive and member.current_st > 0:
                return idx
        for idx in self.backline_indexes():
            if self.members[idx].is_alive:
                return idx
        return None

    def swap_to(self, index: int) -> Optional[Combatant]:
        if 0 <= index < len(self.members) and self.members[index].is_alive:
            self.front_index = index
            return self.front()
        return None

    def all_defeated(self) -> bool:
        return all(not member.is_alive for member in self.members)


@dataclass
class Item:
    """Usable battle item."""

    id: str
    name: str
    heal_amount: int


# --- Game data ------------------------------------------------------------


def default_player_party() -> Party:
    """Create the 3-member hero party from the gameplay doc."""

    members = [
        Combatant(name="Hero", max_hp=100, max_st=50, attack=20, defense=10),
        Combatant(name="Archer", max_hp=80, max_st=65, attack=24, defense=6),
        Combatant(name="Mage", max_hp=70, max_st=80, attack=28, defense=4),
    ]
    return Party(label="Hero Squad", members=members, front_index=0)


def default_enemy_party() -> Party:
    """Create the Forest Ambush enemy party."""

    members = [
        Combatant(name="Slime", max_hp=50, max_st=40, attack=10, defense=5),
        Combatant(name="Goblin", max_hp=70, max_st=55, attack=15, defense=7),
        Combatant(name="Bat", max_hp=40, max_st=30, attack=12, defense=3),
    ]
    return Party(label="Forest Ambush", members=members, front_index=0)


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


class BattleState:
    """Tracks the current state of an ongoing battle."""

    def __init__(
        self,
        player_party: Party,
        enemy_party: Party,
        player_inventory: Dict[str, int],
    ) -> None:
        self.player_party = player_party
        self.enemy_party = enemy_party
        self.player_inventory = player_inventory
        self.guard_flags = {"player": False, "enemy": False}
        self.log: List[BattleLogEntry] = []

    # ------------------------------------------------------------------
    # Utility helpers
    # ------------------------------------------------------------------
    def add_log(self, message: str) -> None:
        self.log.append(BattleLogEntry(message))
        print(message)

    def apply_guard(self, damage: int, target_label: str) -> int:
        if not self.guard_flags[target_label]:
            return damage
        reduced = max(1, damage // 2)
        self.guard_flags[target_label] = False
        return reduced

    def ensure_actor_ready(self, party: Party, label: str) -> bool:
        front = party.front()
        if front and front.is_alive and not front.is_exhausted:
            return True

        reason = ""
        if front is None or not front.is_alive:
            reason = "戦闘不能"
        else:
            reason = "ST切れ"
        swapped = self.handle_forced_swap(party, reason)
        if swapped:
            new_front = party.front()
            if new_front and new_front.is_alive and not new_front.is_exhausted:
                return True
        if label == "player":
            if front and front.is_exhausted:
                self.add_log(f"{front.name}はSTが不足して行動できない！")
            else:
                self.add_log(f"{party.label}には戦えるメンバーがいない！")
        return False

    def handle_forced_swap(self, party: Party, reason: str) -> bool:
        outgoing = party.front()
        if outgoing and outgoing.is_alive and not outgoing.is_exhausted and reason == "ST切れ":
            return False
        idx = party.first_available_backliner()
        if idx is None:
            if reason:
                self.add_log(f"{party.label}は{reason}だが交代要員がいない！")
            return False
        new_front = party.swap_to(idx)
        if new_front:
            if party is self.player_party:
                self.guard_flags["player"] = False
            else:
                self.guard_flags["enemy"] = False
            reason_text = f"{reason}のため" if reason else ""
            self.add_log(
                f"【強制交代】{new_front.name}が{reason_text}{party.label}の前衛に出てきた！"
            )
            return True
        return False

    def apply_backline_regen(self, party: Party) -> None:
        gains: List[str] = []
        for idx in party.backline_indexes():
            member = party.members[idx]
            if not member.is_alive:
                continue
            restored = member.regen_st(BACKLINE_ST_REGEN)
            if restored > 0:
                gains.append(f"{member.name}+{restored}")
        if gains:
            joined = " / ".join(gains)
            self.add_log(f"{party.label}の後衛がSTを回復: {joined}")

    # ------------------------------------------------------------------
    # Player actions
    # ------------------------------------------------------------------
    def player_attack(self) -> bool:
        if not self.ensure_actor_ready(self.player_party, "player"):
            return False
        attacker = self.player_party.front()
        defender = self.enemy_party.front()
        if not attacker or not defender:
            return False
        if not attacker.spend_st(ATTACK_ST_COST):
            self.add_log("STが不足しています。")
            return False
        damage = calculate_damage(attacker, defender)
        damage = self.apply_guard(damage, "enemy")
        defender.take_damage(damage)
        self.add_log(f"{attacker.name}のこうげき！ {defender.name}に{damage}のダメージ！")
        if not defender.is_alive:
            self.add_log(f"{defender.name}はたおれた！")
            self.handle_forced_swap(self.enemy_party, "戦闘不能")
        return True

    def player_defend(self) -> bool:
        if not self.ensure_actor_ready(self.player_party, "player"):
            return False
        actor = self.player_party.front()
        assert actor
        self.guard_flags["player"] = True
        restored = actor.regen_st(DEFEND_ST_REFUND)
        self.add_log(
            f"{actor.name}はぼうぎょのたいせい！ 次の被ダメージ半減。 STが{restored}回復した。"
        )
        return True

    def player_use_item(self, item_id: str) -> bool:
        remaining = self.player_inventory.get(item_id, 0)
        if remaining <= 0:
            self.add_log("アイテムがありません！")
            return False
        front = self.player_party.front()
        if not front:
            self.add_log("使える味方がいません。")
            return False
        item = load_items()[item_id]
        healed = front.heal(item.heal_amount)
        self.player_inventory[item_id] = remaining - 1
        self.add_log(f"{front.name}は{item.name}を使った！ HPが{healed}回復した。")
        return True

    def player_swap(self, target_index: int) -> bool:
        front = self.player_party.front()
        if not front:
            self.add_log("交代できる味方がいません。")
            return False
        if front.current_st < VOLUNTARY_SWAP_COST:
            self.add_log("ST不足で交代できません。")
            return False
        if target_index == self.player_party.front_index:
            self.add_log("すでに前衛です。")
            return False
        if target_index not in self.player_party.available_backliner_indexes():
            self.add_log("その味方は戦闘不能です。")
            return False
        front.spend_st(VOLUNTARY_SWAP_COST)
        outgoing = front
        incoming = self.player_party.swap_to(target_index)
        if incoming:
            self.guard_flags["player"] = False
            self.add_log(f"{outgoing.name}と{incoming.name}が入れ替わった！")
            return True
        self.add_log("交代に失敗しました。")
        return False

    # ------------------------------------------------------------------
    # Enemy actions
    # ------------------------------------------------------------------
    def enemy_take_turn(self) -> None:
        if not self.ensure_actor_ready(self.enemy_party, "enemy"):
            return
        attacker = self.enemy_party.front()
        defender = self.player_party.front()
        if not attacker or not defender:
            return
        if attacker.current_st < ATTACK_ST_COST:
            self.guard_flags["enemy"] = True
            restored = attacker.regen_st(DEFEND_ST_REFUND)
            self.add_log(
                f"{attacker.name}は体勢を立て直している… STが{restored}回復。次の被ダメージ半減。"
            )
        else:
            attacker.spend_st(ATTACK_ST_COST)
            damage = calculate_damage(attacker, defender)
            damage = self.apply_guard(damage, "player")
            defender.take_damage(damage)
            self.add_log(f"{attacker.name}のこうげき！ {defender.name}に{damage}のダメージ！")
            if not defender.is_alive:
                self.add_log(f"{defender.name}はたおれた！")
                self.handle_forced_swap(self.player_party, "戦闘不能")

    # ------------------------------------------------------------------
    def end_player_turn(self) -> None:
        self.apply_backline_regen(self.player_party)

    def end_enemy_turn(self) -> None:
        self.apply_backline_regen(self.enemy_party)

    def is_battle_over(self) -> bool:
        return self.player_party.all_defeated() or self.enemy_party.all_defeated()


# --- State machine --------------------------------------------------------


class GameState:
    BOOT = "Boot"
    TITLE = "Title"
    BATTLE = "Battle"
    RESULT = "Result"


class Game:
    """Main game class implementing the state machine."""

    def __init__(self) -> None:
        self.state = GameState.BOOT
        self.player_party: Optional[Party] = None
        self.enemy_party: Optional[Party] = None
        self.inventory: Dict[str, int] = {}
        self.last_result: Optional[str] = None
        self.battle_state: Optional[BattleState] = None

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
        self.player_party = default_player_party()
        self.enemy_party = default_enemy_party()
        self.inventory = {"potion_small": 1}
        self.battle_state = BattleState(
            player_party=self.player_party,
            enemy_party=self.enemy_party,
            player_inventory=self.inventory,
        )
        print(f"\n{self.enemy_party.label}とのバトルがはじまった！")

    def battle_screen(self) -> None:
        assert self.battle_state
        while not self.battle_state.is_battle_over():
            self.render_battle_ui()
            command = self.prompt(["1", "2", "3", "4"])
            action_performed = False
            if command == "1":
                action_performed = self.battle_state.player_attack()
            elif command == "2":
                action_performed = self.battle_state.player_defend()
            elif command == "3":
                action_performed = self.battle_state.player_use_item("potion_small")
            elif command == "4":
                action_performed = self.handle_player_swap()
            if not action_performed:
                continue
            self.battle_state.end_player_turn()
            if self.battle_state.is_battle_over():
                break
            self.battle_state.enemy_take_turn()
            self.battle_state.end_enemy_turn()
        assert self.player_party and self.enemy_party
        if not self.player_party.all_defeated():
            self.last_result = "勝利"
            print(f"{self.enemy_party.label}にしょうりした！")
        else:
            self.last_result = "敗北"
            print("パーティーはぜんめつしてしまった...！")
        self.transition(GameState.RESULT)

    def render_battle_ui(self) -> None:
        assert self.player_party and self.enemy_party
        print("\n=== バトル ===")
        self.render_party(self.player_party, show_st=True)
        self.render_party(self.enemy_party, show_st=False)
        item = load_items()["potion_small"]
        item_count = self.inventory.get(item.id, 0)
        print("コマンド: 1) こうげき  2) ぼうぎょ  3) アイテム  4) こうたい")
        print(f"所持アイテム: {item.name} x{item_count}")

    def render_party(self, party: Party, show_st: bool) -> None:
        role_label = "プレイヤー" if party is self.player_party else "てき"
        print(f"[{role_label}] {party.label}")
        for idx, member in enumerate(party.members):
            role = "前衛" if idx == party.front_index else "後衛"
            status = "(戦闘不能)" if not member.is_alive else ""
            st_text = (
                f" ST {member.current_st}/{member.max_st}"
                if show_st and member.is_alive
                else ""
            )
            print(
                f" - {role}: {member.name} {status} HP {member.current_hp}/{member.max_hp}{st_text}"
            )

    def result_screen(self) -> None:
        assert self.player_party and self.enemy_party and self.last_result
        print("\n=== リザルト ===")
        print(f"結果: {self.last_result}")
        self.render_party(self.player_party, show_st=True)
        self.render_party(self.enemy_party, show_st=False)
        print("1) タイトルにもどる")
        print("2) 終了")
        choice = self.prompt(["1", "2"])
        if choice == "1":
            self.transition(GameState.TITLE)
        else:
            print("ゲームを終了します。さようなら！")
            self.transition("Exit")

    def handle_player_swap(self) -> bool:
        assert self.player_party and self.battle_state
        candidates = self.player_party.available_backliner_indexes()
        if not candidates:
            print("後衛に健常者がいません。")
            return False
        print("交代したいメンバーをえらんでください。")
        option_map: Dict[str, int] = {}
        for display_idx, member_index in enumerate(candidates, start=1):
            member = self.player_party.members[member_index]
            print(
                f" {display_idx}) {member.name} HP {member.current_hp}/{member.max_hp} ST {member.current_st}/{member.max_st}"
            )
            option_map[str(display_idx)] = member_index
        choice = self.prompt(list(option_map.keys()))
        return self.battle_state.player_swap(option_map[choice])

    @staticmethod
    def prompt(valid_inputs: List[str]) -> str:
        while True:
            response = input("> ").strip()
            if response in valid_inputs:
                return response
            print(f"{', '.join(valid_inputs)} の中から選択してください。")


def main() -> None:
    if os.getenv("GAME_SEED"):
        print("GAME_SEED is currently unused in this CLI prototype.")
    game = Game()
    game.run()


if __name__ == "__main__":
    main()
