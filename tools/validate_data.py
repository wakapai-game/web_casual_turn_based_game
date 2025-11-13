#!/usr/bin/env python3
"""Validation utilities for the JSON datasets described in docs/vision.md."""
from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Dict, List, Sequence, Set

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
MONSTER_FILE = DATA_DIR / "monsters.json"
MOVE_FILE = DATA_DIR / "moves.json"
TYPE_FILE = DATA_DIR / "types.json"

REQUIRED_MONSTER_FIELDS = ("id", "name", "hp", "st", "atk", "def", "mag", "spd", "type")
MOVE_TYPES = {"physical", "magical", "support"}
ATTACK_ELEMENTS = ["fire", "water", "wind", "earth", "thunder", "ice", "light", "dark"]
ALLOWED_MOVE_ELEMENTS = set(ATTACK_ELEMENTS) | {"neutral"}


def _load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:  # pragma: no cover - defensive
        raise SystemExit(f"Missing required data file: {path}") from exc


def validate_types() -> List[str]:
    errors: List[str] = []
    payload = _load_json(TYPE_FILE)
    elements = payload.get("elements")
    if not isinstance(elements, list):
        return ["types.json must contain an 'elements' array"]

    ids = [entry.get("id") for entry in elements]
    missing_ids = set(ATTACK_ELEMENTS) - set(ids)
    if missing_ids:
        errors.append(f"types.json is missing element ids: {sorted(missing_ids)}")
    if len(set(ids)) != len(ids):
        dupes = [item for item, count in Counter(ids).items() if count > 1]
        errors.append(f"types.json has duplicate element ids: {sorted(dupes)}")

    effectiveness = payload.get("effectiveness", [])
    strong_pairs = {
        ("fire", "ice"),
        ("water", "fire"),
        ("water", "earth"),
        ("wind", "earth"),
        ("earth", "thunder"),
        ("thunder", "water"),
        ("ice", "wind"),
        ("light", "dark"),
        ("dark", "light"),
    }
    weak_pairs = {
        ("fire", "water"),
        ("water", "thunder"),
        ("earth", "water"),
        ("wind", "ice"),
        ("earth", "wind"),
        ("thunder", "earth"),
        ("ice", "fire"),
    }

    table = {(entry.get("attacker"), entry.get("defender")): entry.get("multiplier") for entry in effectiveness}
    for pair in strong_pairs:
        if table.get(pair) != 1.5:
            errors.append(f"missing 1.5x effectiveness entry for {pair[0]} -> {pair[1]}")
    for pair in weak_pairs:
        if table.get(pair) != 0.5:
            errors.append(f"missing 0.5x effectiveness entry for {pair[0]} -> {pair[1]}")

    invalid_values = [value for value in table.values() if value not in {0.5, 1.5}]
    if invalid_values:
        errors.append("effectiveness multipliers must be 0.5 or 1.5; use defaultMultiplier for 1.0")

    return errors


def _require_int(value: object, field: str, errors: List[str], minimum: int = 0) -> None:
    if not isinstance(value, int):
        errors.append(f"{field} must be an integer")
    elif value < minimum:
        errors.append(f"{field} must be >= {minimum}")


def validate_monsters(type_ids: Sequence[str]) -> List[str]:
    errors: List[str] = []
    payload = _load_json(MONSTER_FILE)
    monsters = payload.get("monsters")
    if not isinstance(monsters, list):
        return ["monsters.json must contain a 'monsters' array"]

    if len(monsters) < 12:
        errors.append(f"monsters.json must contain at least 12 entries (found {len(monsters)})")

    type_usage = Counter()
    for index, monster in enumerate(monsters):
        context = f"monsters[{index}]"
        if not isinstance(monster, dict):
            errors.append(f"{context} must be an object")
            continue
        for field in REQUIRED_MONSTER_FIELDS:
            if field not in monster:
                errors.append(f"{context} is missing '{field}'")
        _require_int(monster.get("hp"), f"{context}.hp", errors, minimum=1)
        _require_int(monster.get("st"), f"{context}.st", errors, minimum=1)
        _require_int(monster.get("atk"), f"{context}.atk", errors, minimum=0)
        _require_int(monster.get("def"), f"{context}.def", errors, minimum=0)
        _require_int(monster.get("mag"), f"{context}.mag", errors, minimum=0)
        _require_int(monster.get("spd"), f"{context}.spd", errors, minimum=0)
        m_type = monster.get("type")
        if m_type not in type_ids:
            errors.append(f"{context}.type '{m_type}' is not defined in data/types.json")
        else:
            type_usage[m_type] += 1

    missing_types = [elem for elem in type_ids if type_usage[elem] == 0]
    if missing_types:
        errors.append(f"monsters.json must include at least one entry for each element: missing {missing_types}")

    return errors


def validate_moves(type_ids: Sequence[str]) -> List[str]:
    errors: List[str] = []
    payload = _load_json(MOVE_FILE)
    moves = payload.get("moves")
    if not isinstance(moves, list):
        return ["moves.json must contain a 'moves' array"]

    if len(moves) < 24:
        errors.append(f"moves.json must contain at least 24 entries (found {len(moves)})")

    coverage: Dict[str, Dict[str, int]] = {elem: {kind: 0 for kind in MOVE_TYPES} for elem in type_ids}
    ids_seen: Set[str] = set()
    for index, move in enumerate(moves):
        context = f"moves[{index}]"
        if not isinstance(move, dict):
            errors.append(f"{context} must be an object")
            continue
        move_id = move.get("id")
        if move_id in ids_seen:
            errors.append(f"duplicate move id detected: {move_id}")
        else:
            ids_seen.add(move_id)
        if move.get("type") not in MOVE_TYPES:
            errors.append(f"{context}.type must be one of {sorted(MOVE_TYPES)}")
        element = move.get("element")
        if element not in ALLOWED_MOVE_ELEMENTS:
            errors.append(f"{context}.element '{element}' is invalid")
        elif element in coverage:
            coverage[element][move["type"]] += 1

        if not isinstance(move.get("name"), str):
            errors.append(f"{context}.name must be a string")
        _require_int(move.get("power"), f"{context}.power", errors, minimum=0)
        _require_int(move.get("stCost"), f"{context}.stCost", errors, minimum=0)
        _require_int(move.get("hits"), f"{context}.hits", errors, minimum=0)
        if move.get("type") in {"physical", "magical"} and move.get("hits", 0) < 1:
            errors.append(f"{context}.hits must be >= 1 for attacking moves")
        if move.get("type") in {"physical", "magical"} and move.get("power", 0) <= 0:
            errors.append(f"{context}.power must be > 0 for attacking moves")
        if move.get("type") == "support" and move.get("power", 0) != 0:
            errors.append(f"{context}.power must be 0 for support moves")

    for element, buckets in coverage.items():
        missing_roles = [role for role, count in buckets.items() if count == 0]
        if missing_roles:
            errors.append(
                f"moves.json lacks {missing_roles} move(s) for element '{element}'"
            )

    return errors


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate battle data JSON files")
    parser.add_argument("--monsters", action="store_true", help="Validate data/monsters.json")
    parser.add_argument("--moves", action="store_true", help="Validate data/moves.json")
    parser.add_argument("--types", action="store_true", help="Validate data/types.json")
    parser.add_argument("--all", action="store_true", help="Validate every dataset")
    args = parser.parse_args(argv)

    if not any((args.monsters, args.moves, args.types, args.all)):
        parser.error("Please specify --monsters, --moves, --types, or --all")

    type_errors: List[str] = []
    type_ids: Sequence[str] = ATTACK_ELEMENTS
    if args.types or args.all:
        type_errors = validate_types()
        if type_errors:
            for message in type_errors:
                print(message, file=sys.stderr)
        type_payload = _load_json(TYPE_FILE)
        type_ids = [entry["id"] for entry in type_payload.get("elements", [])]

    errors: List[str] = []
    if args.monsters or args.all:
        errors.extend(validate_monsters(type_ids))
    if args.moves or args.all:
        errors.extend(validate_moves(type_ids))

    errors.extend(type_errors)
    if errors:
        for message in errors:
            print(message, file=sys.stderr)
        return 1

    if args.all:
        print("All datasets validated successfully.")
    else:
        print("Validation finished with no issues.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
