# Battle Data Sets

`data/monsters.json`, `data/moves.json`, and `data/types.json` implement the schemas described in `docs/vision.md` and power the battle prototype. All files use two-space indentation and UTF-8 encoding so tooling diffs remain stable.

## Files
### monsters.json
- Wraps every monster in the `monsters` array with the ordered keys `id`, `name`, `hp`, `st`, `atk`, `def`, `mag`, `spd`, `type`.
- `hp`/`st` must be positive integers. Other stats are integers ≥0.
- `type` references one of the elemental IDs declared in `types.json`. Maintain at least one monster per element to keep AI tutorials meaningful.

### moves.json
- Contains a `moves` array with ordered keys `id`, `name`, `type`, `power`, `stCost`, `element`, `hits`.
- `type` is one of `physical`, `magical`, `support`; support moves always use `power: 0` and `hits: 0`.
- Every elemental ID from `types.json` needs at least one physical / magical / support move. Neutral moves stay at the top for readability.

### types.json
- Declares eight canonical elements plus their localized names and icon keys.
- `effectiveness` lists only the 1.5× weakness pairs and the 0.5× resistances from `docs/vision.md`. All other combinations fall back to `defaultMultiplier: 1.0`.

## Editing Guidelines
- Keep entries grouped by element to simplify reviews.
- IDs are snake_case (`mon_*`, `fire_*`), unique, and stable so save data stays compatible.
- Stick to the stat ranges in `docs/vision.md` (HP 60–120, ST 20–32, power 0–120). If you need to exceed them, document the reason in your pull request.
- Use `python -m json.tool <file>` or `npm exec jsonlint -q <file>` before committing to avoid malformed JSON.

## Validation
Run the following commands from the repository root before committing or cutting a build:

```bash
npm exec jsonlint -q data/monsters.json
python -m json.tool data/moves.json > /dev/null
python tools/validate_data.py --all
```

The Python script enforces:
- `monsters.json` has ≥12 entries, each stat respects the schema, and all eight elements appear at least once.
- `moves.json` has ≥24 entries, each element features physical/magical/support coverage, and STコストは0以上です。
- `types.json` declares exactly eight elements and only uses 0.5 / 1.0 / 1.5 multipliers.
