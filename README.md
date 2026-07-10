# @ozika-music/musicxml

A comprehensive MusicXML 4.0 parser written in TypeScript.

## Install

Published to GitHub Packages under the `@ozika-music` scope. Add a `.npmrc` so
the scope resolves to the GitHub registry:

```
@ozika-music:registry=https://npm.pkg.github.com
```

Then:

```bash
npm install @ozika-music/musicxml
```

## Usage

```typescript
import { MusicXml } from '@ozika-music/musicxml';

// Parse a MusicXML string
const score = MusicXml.parseFromMusicXml(xmlString);

// Auto-detect and parse MusicXML or compressed MXL bytes
const score2 = await MusicXml.parse(data);

// Serialize back to bytes
const bytes = MusicXml.serializeToMusicXml(score);
```

## Development

```bash
npm ci
npm run build      # bundle to dist/ (ESM + CJS + types) via tsup
npm test           # vitest
npm run typecheck  # tsc --noEmit
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) —
enforced locally by commitlint (husky `commit-msg` hook) and in CI. Releases are
fully automated by [semantic-release](https://semantic-release.gitbook.io/): a
merge to `main` computes the next version from the commit history, publishes to
GitHub Packages, tags the release, and updates `CHANGELOG.md`.

## Specifications

Schema files under `specs/` are extracted from
<http://w3c.github.io/musicxml>. Full documentation:
<https://www.w3.org/2021/06/musicxml40>.

## License

MIT
