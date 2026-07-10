# @ozika-music/musicxml

[![CI](https://github.com/ozika-music/musicxml/actions/workflows/ci.yml/badge.svg)](https://github.com/ozika-music/musicxml/actions/workflows/ci.yml)
[![Release](https://github.com/ozika-music/musicxml/actions/workflows/release.yml/badge.svg)](https://github.com/ozika-music/musicxml/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

A comprehensive, strongly-typed **MusicXML 4.0** parser and serializer for
TypeScript. Reads and writes both uncompressed `.musicxml` and compressed
`.mxl` documents, and gives you back a fully typed score model instead of a raw
DOM.

## Features

- **Round-trip** — parse MusicXML → typed model → serialize back to MusicXML/MXL.
- **Auto-detection** — `MusicXml.parse()` sniffs ZIP magic to handle `.musicxml` and `.mxl` transparently.
- **Fully typed model** — every MusicXML element is a TypeScript class/interface (`ScorePartwise`, `Part`, `Measure`, `Note`, `Pitch`, …).
- **Behavior on the model** — static helpers such as `Note.getDuration`, `Pitch.toMidiNote`, `Measure.expandRepeats`, `Time.parseSignature`.
- **In-flight transforms** — expand repeats or re-voice drum parts while parsing or serializing.
- **Batteries included** — General MIDI program map, the 894-entry standard sounds catalog, and a drum-kit source of truth (MIDI ↔ staff position ↔ notehead).
- **Runtime-agnostic** — pure ESM, no DOM dependency; works in Node ≥ 18, Deno, and bundled browser apps.

## Install

This package is published to **GitHub Packages** under the `@ozika-music`
scope. Point the scope at the GitHub registry via an `.npmrc` next to your
project:

```ini
# .npmrc
@ozika-music:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

> GitHub Packages requires authentication even for public packages, so a token
> with the `read:packages` scope must be available as `GITHUB_TOKEN` (or inline
> the token). See [Working with the npm registry][gh-packages].

Then install:

```bash
npm install @ozika-music/musicxml
```

## Quick start

```typescript
import { MusicXml } from '@ozika-music/musicxml';
import { readFile } from 'node:fs/promises';

// Auto-detect .musicxml (plain XML) or .mxl (zipped) from raw bytes.
const bytes = await readFile('song.mxl');
const score = await MusicXml.parse(bytes);

console.log(score.movementTitle);

for (const part of score.parts) {
  for (const measure of part.measures) {
    for (const content of measure.content) {
      if (content.type === 'note') {
        console.log(content.data.pitch);
      }
    }
  }
}

// Serialize back out — to plain MusicXML or compressed MXL.
const xmlBytes = MusicXml.serializeToMusicXml(score);
const mxlBytes = await MusicXml.serializeToMxl(score);
```

## API

### `MusicXml` facade

Every read/write routes through the static `MusicXml` class.

| Method | Signature | Description |
| --- | --- | --- |
| `parse` | `(data: Uint8Array, opts?) => Promise<ScorePartwise>` | Parse `.musicxml` or `.mxl` (auto-detected by ZIP magic). |
| `parseFromMusicXml` | `(xml: string, opts?) => ScorePartwise` | Parse an uncompressed MusicXML string. |
| `parseFromMxl` | `(data: Uint8Array, opts?) => Promise<ScorePartwise>` | Parse a compressed `.mxl` archive. |
| `serializeToMusicXml` | `(score: ScorePartwise, opts?) => Uint8Array` | Serialize to uncompressed MusicXML (UTF-8 bytes). |
| `serializeToMxl` | `(score: ScorePartwise, opts?) => Promise<Uint8Array>` | Serialize to a compressed `.mxl` archive. |
| `isMxl` | `(data: Uint8Array) => boolean` | True when the bytes are a compressed `.mxl` (ZIP) archive. |

> Only `score-partwise` documents are supported. A `score-timewise` document
> throws — convert it to partwise first.

### `MusicXmlOptions`

Both parse and serialize accept options that transform the model in passing
(non-mutating):

```typescript
interface MusicXmlOptions {
  /** Expand <repeat>/ending structure into a flat measure list. */
  expandRepeats?: boolean;
  /** Re-voice unpitched drum notes: 'MergeVoices' | 'SplitVoices' | 'AsIs'. */
  drumsVoiceMode?: DrumsVoiceMode;
}
```

```typescript
const flat = await MusicXml.parse(bytes, { expandRepeats: true });
```

### Model helpers

Single-element behavior lives as static methods on the model classes exported
from the package root, for example:

```typescript
import { Note, Pitch, Measure, Time } from '@ozika-music/musicxml';

Pitch.toMidiNote(pitch);          // → MIDI note number
Note.getDuration(note, divisions);
Measure.expandRepeats(measures);
Time.parseSignature(time);        // → { beats, beatType }
```

### Extra exports

```typescript
import {
  TimeUtils,                      // playback timing (BPM → ms)
  decodeXmlBytes,                 // BOM-aware bytes → XML string (UTF-8/UTF-16)
  GENERAL_MIDI_PROGRAM_SOUNDS,    // GM program → sound id map
  INSTRUMENT_SOUND_IDS,           // standard sounds catalog (894 ids)
  getDrumPart, getAllDrumParts,   // drum kit source of truth
  getDrumDisplay, getDrumNotehead, getDrumMidiFromDisplay,
} from '@ozika-music/musicxml';
```

## Development

```bash
npm ci
npm run build       # bundle src/ → dist/ (ESM + .d.ts) via tsup
npm test            # vitest
npm run test:coverage
npm run typecheck   # tsc --noEmit
npm run lint
```

### Conventional Commits & releases

Commits follow [Conventional Commits][conventional] and are validated by
commitlint — locally through the husky `commit-msg` hook, and in CI over every
commit in a pull request.

Releases are fully automated by [semantic-release][semrel]: on every merge to
`main`, the commit history determines the next [SemVer][semver] version
(`feat:` → minor, `fix:` → patch, `feat!:`/`BREAKING CHANGE:` → major), which is
then published to GitHub Packages, tagged, released with generated notes, and
recorded in `CHANGELOG.md`. No manual version bumps.

## Specifications

Schema files under [`specs/`](./specs) are extracted from
<http://w3c.github.io/musicxml> and are used only as the source of truth for
generated data (e.g. the standard sounds catalog). They are **not** part of the
published package. Full MusicXML 4.0 documentation:
<https://www.w3.org/2021/06/musicxml40>.

## License

[MIT](./LICENSE) © Ozika

[gh-packages]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
[conventional]: https://www.conventionalcommits.org/
[semrel]: https://semantic-release.gitbook.io/
[semver]: https://semver.org/
