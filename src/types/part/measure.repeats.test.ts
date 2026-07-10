import { describe, expect, it } from 'vitest';
import { BackwardForward, BarlineLocation, Measure } from '..';
import { MusicXml } from '../../musicxml';

const parseMxl = async (data: Uint8Array) => ({ score: await MusicXml.parseFromMxl(data) });

// MXL-level repeat expansion is now the `expandRepeats` serialize option:
// parse the archive, then re-serialize with the option applied.
const expandMxlRepeats = async (data: Uint8Array): Promise<Uint8Array> =>
  MusicXml.serializeToMxl(await MusicXml.parseFromMxl(data), { expandRepeats: true });

function makeMeasure(number: string, content: Measure['content']): Measure {
  return {
    number,
    content,
  };
}

async function makeMxl(rootXml: string, rootFilePath: string = 'score.musicxml'): Promise<Uint8Array> {
  const jszipModule = await import('jszip');
  const JSZip = jszipModule.default || jszipModule;
  const zip = new JSZip();

  zip.file(
    'META-INF/container.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n  <rootfiles>\n    <rootfile full-path="${rootFilePath}" media-type="application/vnd.recordare.musicxml+xml"/>\n  </rootfiles>\n</container>`
  );
  zip.file(rootFilePath, rootXml);

  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE', compressionOptions: { level: 9 } });
}

async function readRootXml(mxlData: Uint8Array): Promise<string> {
  const jszipModule = await import('jszip');
  const JSZip = jszipModule.default || jszipModule;
  const zip = await JSZip.loadAsync(mxlData);
  const containerXml = await zip.file('META-INF/container.xml')!.async('string');
  const rootMatch = containerXml.match(/full-path="([^"]+)"/i);
  const rootPath = rootMatch?.[1] ?? 'score.musicxml';
  return zip.file(rootPath)!.async('string');
}

describe('repeat-utils', () => {
  it('expandRepeats expands section and strips repeat markers', () => {
    const measures: Measure[] = [
      makeMeasure('1', [
        { type: 'barline', data: { location: BarlineLocation.Left, repeat: { direction: BackwardForward.Forward } } },
      ]),
      makeMeasure('2', [
        { type: 'barline', data: { location: BarlineLocation.Right, repeat: { direction: BackwardForward.Backward, times: 2 } } },
      ]),
      makeMeasure('3', [
        { type: 'barline', data: { location: BarlineLocation.Right } },
      ]),
    ];

    const expanded = Measure.expandRepeats(measures);

    expect(expanded).toHaveLength(5); // 1,2,(1,2),3
    expect(expanded.map(m => m.number)).toEqual(['1', '2', '3', '4', '5']);
    for (const measure of expanded) {
      for (const entry of measure.content) {
        if (entry.type !== 'barline') continue;
        expect(entry.data.repeat).toBeUndefined();
        expect(entry.data.ending).toBeUndefined();
      }
    }
  });

  it('expandMxlRepeats expands all parts with same measure count and strips repeat directives', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list>
    <score-part id="P1"><part-name>Part 1</part-name></score-part>
    <score-part id="P2"><part-name>Part 2</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <barline location="left"><repeat direction="forward"/></barline>
      <note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><type>whole</type></note>
    </measure>
    <measure number="2">
      <barline location="right"><repeat direction="backward" times="2"/></barline>
      <note><pitch><step>D</step><octave>4</octave></pitch><duration>1</duration><type>whole</type></note>
    </measure>
    <measure number="3">
      <note><pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><type>whole</type></note>
    </measure>
  </part>
  <part id="P2">
    <measure number="1">
      <barline location="left"><repeat direction="forward"/></barline>
      <note><pitch><step>G</step><octave>3</octave></pitch><duration>1</duration><type>whole</type></note>
    </measure>
    <measure number="2">
      <barline location="right"><repeat direction="backward" times="2"/></barline>
      <note><pitch><step>A</step><octave>3</octave></pitch><duration>1</duration><type>whole</type></note>
    </measure>
    <measure number="3">
      <note><pitch><step>B</step><octave>3</octave></pitch><duration>1</duration><type>whole</type></note>
    </measure>
  </part>
</score-partwise>`;

    const mxl = await makeMxl(xml);
    const expandedMxl = await expandMxlRepeats(mxl);
    const parsed = await parseMxl(expandedMxl);

    expect(parsed.score.parts).toHaveLength(2);
    expect(parsed.score.parts[0].measures).toHaveLength(5);
    expect(parsed.score.parts[1].measures).toHaveLength(5);

    for (const part of parsed.score.parts) {
      for (const measure of part.measures) {
        const barlines = measure.content.filter(c => c.type === 'barline');
        for (const barline of barlines) {
          expect(barline.data.repeat).toBeUndefined();
          expect(barline.data.ending).toBeUndefined();
        }
      }
    }
  });

  it('expandMxlRepeats keeps non-repeat musical content', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list>
    <score-part id="P1"><part-name>Part 1</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <barline location="left"><repeat direction="forward"/></barline>
      <direction>
        <direction-type><words>Intro</words></direction-type>
      </direction>
      <note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><type>whole</type></note>
    </measure>
    <measure number="2">
      <barline location="right"><repeat direction="backward" times="2"/></barline>
      <note><pitch><step>D</step><octave>4</octave></pitch><duration>1</duration><type>whole</type></note>
    </measure>
  </part>
</score-partwise>`;

    const mxl = await makeMxl(xml, 'nested/score.musicxml');
    const expandedMxl = await expandMxlRepeats(mxl);
    const expandedXml = await readRootXml(expandedMxl);

    const wordsCount = (expandedXml.match(/<words>Intro<\/words>/g) ?? []).length;
    expect(wordsCount).toBe(2); // measure 1 appears twice after expansion
    expect(expandedXml).not.toMatch(/<repeat\b/i);
    expect(expandedXml).not.toMatch(/<ending\b/i);
  });

  it('expandMxlRepeats preserves measure labels while renumbering expanded measures', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list>
    <score-part id="P1"><part-name>Part 1</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1" text="Verse A">
      <barline location="left"><repeat direction="forward"/></barline>
      <note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><type>whole</type></note>
    </measure>
    <measure number="2" text="Bridge B">
      <barline location="right"><repeat direction="backward" times="2"/></barline>
      <note><pitch><step>D</step><octave>4</octave></pitch><duration>1</duration><type>whole</type></note>
    </measure>
    <measure number="3" text="Outro C">
      <note><pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><type>whole</type></note>
    </measure>
  </part>
</score-partwise>`;

    const mxl = await makeMxl(xml);
    const expandedMxl = await expandMxlRepeats(mxl);
    const expandedXml = await readRootXml(expandedMxl);

    // Sequence is 1,2,1,2,3 after repeat expansion.
    const verseCount = (expandedXml.match(/text="Verse A"/g) ?? []).length;
    const bridgeCount = (expandedXml.match(/text="Bridge B"/g) ?? []).length;
    const outroCount = (expandedXml.match(/text="Outro C"/g) ?? []).length;
    expect(verseCount).toBe(2);
    expect(bridgeCount).toBe(2);
    expect(outroCount).toBe(1);

    // Measure numbering is rewritten sequentially for the expanded timeline.
    const measureNumbers = [...expandedXml.matchAll(/<measure\b[^>]*\bnumber="(\d+)"/g)].map(m => m[1]);
    expect(measureNumbers).toEqual(['1', '2', '3', '4', '5']);
  });
});
