#!/usr/bin/env python3
"""Validate core JSON datasets for Battle Critters."""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path
from typing import Iterable, List, Sequence

REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = REPO_ROOT / "data"

MONSTER_KEYS = ["id", "name", "hp", "st", "atk", "def", "mag", "spd", "type"]
MOVE_KEYS = ["id", "name", "type", "power", "stCost", "element", "hits"]
MOVE_TYPES = {"physical", "magical", "support"}


def load_json(path: Path) -> dict:
  with path.open(encoding="utf-8") as fh:
    return json.load(fh)


def require(condition: bool, message: str, errors: List[str]) -> None:
  if not condition:
    errors.append(message)


def validate_monsters(type_ids: Sequence[str]) -> List[str]:
  data = load_json(DATA_DIR / "monsters.json")
  monsters = data.get("monsters", [])
  errors: List[str] = []

  require(len(monsters) >= 12, f"monsters.json must contain at least 12 entries (found {len(monsters)})", errors)

  type_usage = set()
  for idx, monster in enumerate(monsters):
    prefix = f"monsters[{idx}]"
    keys = list(monster.keys())
    require(keys == MONSTER_KEYS, f"{prefix} keys must match {MONSTER_KEYS}", errors)

    for stat in ("hp", "st", "atk", "def", "mag", "spd"):
      value = monster.get(stat)
      require(isinstance(value, int), f"{prefix}.{stat} must be an integer", errors)
      if stat in ("hp", "st"):
        require(value is not None and value > 0, f"{prefix}.{stat} must be > 0", errors)
      else:
        require(value is not None and value >= 0, f"{prefix}.{stat} must be >= 0", errors)

    monster_type = monster.get("type")
    require(isinstance(monster_type, str) and monster_type, f"{prefix}.type must be a non-empty string", errors)
    if isinstance(monster_type, str):
      require(monster_type in type_ids, f"{prefix}.type '{monster_type}' must exist in types.json", errors)
      type_usage.add(monster_type)

    require(isinstance(monster.get("id"), str) and monster["id"], f"{prefix}.id must be a non-empty string", errors)
    require(isinstance(monster.get("name"), str) and monster["name"], f"{prefix}.name must be a non-empty string", errors)

  missing_types = sorted(set(type_ids) - type_usage)
  require(not missing_types, f"monsters.json is missing entries for types: {', '.join(missing_types)}", errors)
  return errors


def validate_moves(type_ids: Sequence[str]) -> List[str]:
  data = load_json(DATA_DIR / "moves.json")
  moves = data.get("moves", [])
  errors: List[str] = []

  require(len(moves) >= 24, f"moves.json must contain at least 24 entries (found {len(moves)})", errors)

  coverage = defaultdict(set)

  for idx, move in enumerate(moves):
    prefix = f"moves[{idx}]"
    keys = list(move.keys())
    require(keys == MOVE_KEYS, f"{prefix} keys must match {MOVE_KEYS}", errors)

    move_type = move.get("type")
    require(move_type in MOVE_TYPES, f"{prefix}.type must be one of {sorted(MOVE_TYPES)}", errors)

    power = move.get("power")
    require(isinstance(power, int), f"{prefix}.power must be an integer", errors)
    if move_type == "support":
      require(power == 0, f"{prefix}.power must be 0 for support moves", errors)
    else:
      require(power is not None and 0 < power <= 120, f"{prefix}.power must be between 1 and 120", errors)

    st_cost = move.get("stCost")
    require(isinstance(st_cost, int) and st_cost >= 0, f"{prefix}.stCost must be an integer >= 0", errors)

    hits = move.get("hits")
    require(isinstance(hits, int), f"{prefix}.hits must be an integer", errors)
    if move_type == "support":
      require(hits == 0, f"{prefix}.hits must be 0 for support moves", errors)
    else:
      require(1 <= hits <= 3, f"{prefix}.hits must be between 1 and 3 for offensive moves", errors)

    element = move.get("element")
    require(isinstance(element, str) and element, f"{prefix}.element must be a non-empty string", errors)
    if isinstance(element, str):
      if element == "neutral":
        pass
      else:
        require(element in type_ids, f"{prefix}.element '{element}' must exist in types.json", errors)
        coverage[element].add(move_type)

    require(isinstance(move.get("id"), str) and move["id"], f"{prefix}.id must be a non-empty string", errors)
    require(isinstance(move.get("name"), str) and move["name"], f"{prefix}.name must be a non-empty string", errors)

  for element in type_ids:
    missing = sorted(MOVE_TYPES - coverage[element])
    require(not missing, f"moves.json is missing {', '.join(missing)} move(s) for element '{element}'", errors)

  return errors


def validate_types() -> List[str]:
  data = load_json(DATA_DIR / "types.json")
  elements = data.get("elements", [])
  errors: List[str] = []

  require(len(elements) == 8, f"types.json must declare 8 elements (found {len(elements)})", errors)
  ids = [element.get("id") for element in elements]
  require(len(set(ids)) == len(ids), "types.json elements must have unique ids", errors)

  for idx, element in enumerate(elements):
    prefix = f"types.elements[{idx}]"
    require(isinstance(element.get("id"), str) and element["id"], f"{prefix}.id must be a non-empty string", errors)
    name = element.get("name")
    require(isinstance(name, dict) and "ja" in name and "en" in name, f"{prefix}.name must include ja/en", errors)
    require(isinstance(element.get("icon"), str) and element["icon"], f"{prefix}.icon must be a non-empty string", errors)

  effect_rows = data.get("effectiveness", [])
  allowed_multipliers = {0.5, 1.0, 1.5}
  for idx, row in enumerate(effect_rows):
    prefix = f"types.effectiveness[{idx}]"
    attacker = row.get("attacker")
    defender = row.get("defender")
    multiplier = row.get("multiplier")
    require(attacker in ids, f"{prefix}.attacker '{attacker}' must be defined in elements", errors)
    require(defender in ids, f"{prefix}.defender '{defender}' must be defined in elements", errors)
    require(multiplier in allowed_multipliers, f"{prefix}.multiplier must be one of {sorted(allowed_multipliers)}", errors)

  default_multiplier = data.get("defaultMultiplier")
  require(default_multiplier == 1.0, "types.json defaultMultiplier must be 1.0", errors)

  return errors


def parse_args() -> argparse.Namespace:
  parser = argparse.ArgumentParser(description="Validate monsters, moves, and type datasets.")
  parser.add_argument("--monsters", action="store_true", help="Validate data/monsters.json")
  parser.add_argument("--moves", action="store_true", help="Validate data/moves.json")
  parser.add_argument("--types", action="store_true", help="Validate data/types.json")
  parser.add_argument("--all", action="store_true", help="Validate all datasets (default)")
  return parser.parse_args()


def main() -> None:
  args = parse_args()
  selected = []
  if args.all or not (args.monsters or args.moves or args.types):
    selected = ["types", "monsters", "moves"]
  else:
    if args.types:
      selected.append("types")
    if args.monsters:
      selected.append("monsters")
    if args.moves:
      selected.append("moves")

  type_ids: Iterable[str]
  types_data = load_json(DATA_DIR / "types.json")
  type_ids = [element["id"] for element in types_data.get("elements", [])]

  errors: List[str] = []
  for target in selected:
    if target == "types":
      errors.extend(validate_types())
      types_data = load_json(DATA_DIR / "types.json")
      type_ids = [element["id"] for element in types_data.get("elements", [])]
    elif target == "monsters":
      errors.extend(validate_monsters(type_ids))
    elif target == "moves":
      errors.extend(validate_moves(type_ids))

  if errors:
    print("Validation failed:")
    for err in errors:
      print(f"- {err}")
    sys.exit(1)

  print("All selected datasets are valid.")


if __name__ == "__main__":
  main()
