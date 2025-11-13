# Battle Data Sets

`data/monsters.json`, `data/moves.json`, and `data/types.json` implement the schemas described in `docs/vision.md` and power the battle prototype. All files use two-space indentation and UTF-8 encoding so tooling diffs remain stable.

## Files
- **monsters.json** – Contains a `monsters` array with objects that expose `id`, `name`, `hp`, `st`, `atk`, `def`, `mag`, `spd`, and elemental `type`. Each element (`fire`, `water`, `wind`, `earth`, `thunder`, `ice`, `light`, `dark`) appears at least once.
- **moves.json** – Contains a `moves` array. Every entry declares `id`, `name`, `type` (`physical` / `magical` / `support`), `power`, `stCost`, `element`, and `hits`. Every element receives one move per category plus the global neutral moves (`guard`, `quick_slash`, `focus_shot`).
- **types.json** – Defines the eight supported elements plus the 1.5 / 0.5 affinity pairs (`fire>ice`, `water>fire/earth`, `wind>earth`, `earth>thunder`, `thunder>water`, `ice>wind`, `light↔dark`). Unspecified pairs fall back to `defaultMultiplier: 1.0`.

## Validation
Run the following commands from the repository root before committing or cutting a build:

```bash
npm exec jsonlint -q data/monsters.json
python -m json.tool data/moves.json > /dev/null
python tools/validate_data.py --all
```

The Python script enforces:
- `monsters.json` has ≥12 entries, all stats are integers ≥0 (HP/ST ≥1), and every element appears at least once.
- `moves.json` has ≥24 entries, neutral moves only use the `neutral` element, and every element has physical/magical/support coverage.
- `types.json` contains the eight canonical IDs and all affinity multipliers are 0.5 or 1.5.
