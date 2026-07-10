import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import { MusicXml } from './musicxml';
import { PartList } from './types';

const XML =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">' +
  '<score-partwise version="4.0">' +
  '<movement-title>Test</movement-title>' +
  '<part-list><score-part id="P1"><part-name>Violin</part-name></score-part></part-list>' +
  '<part id="P1"><measure number="1"><note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration></note></measure></part>' +
  '</score-partwise>';

describe('MusicXml facade', () => {
  it('parseFromMusicXml parses a document into a ScorePartwise', () => {
    const score = MusicXml.parseFromMusicXml(XML);
    expect(score.version).toBe('4.0');
    expect(score.movementTitle).toBe('Test');
    expect(score.partList).toBeInstanceOf(PartList);
    expect(score.partList.scoreParts[0]).toMatchObject({ id: 'P1' });
    expect(score.partList.scoreParts[0].partName.value).toBe('Violin');
    expect(score.parts[0].measures[0].content).toHaveLength(1);
  });

  it('parseFromMusicXml throws on a missing / timewise root', () => {
    expect(() => MusicXml.parseFromMusicXml('<other/>')).toThrow(/score-partwise/);
    expect(() => MusicXml.parseFromMusicXml('<score-timewise/>')).toThrow(/timewise/);
  });

  it('serializeToMusicXml emits a full document with declaration + doctype', () => {
    const score = MusicXml.parseFromMusicXml(XML);
    const out = new TextDecoder().decode(MusicXml.serializeToMusicXml(score));
    expect(out).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(out).toContain('<!DOCTYPE score-partwise');
    expect(out).toContain('<score-partwise version="4.0">');
    // round-trips back to the same model
    const round = MusicXml.parseFromMusicXml(out);
    expect(round.movementTitle).toBe('Test');
    expect(round.parts[0].measures[0].content).toHaveLength(1);
  });

  it('serializeToMxl produces a ZIP with container.xml + the root MusicXML', async () => {
    const score = MusicXml.parseFromMusicXml(XML);
    const mxl = await MusicXml.serializeToMxl(score);
    expect(mxl[0]).toBe(0x50); // 'P'
    expect(mxl[1]).toBe(0x4b); // 'K'
    const zip = await JSZip.loadAsync(mxl);
    const container = await zip.file('META-INF/container.xml')!.async('string');
    expect(container).toContain('full-path="score.musicxml"');
    expect(container).toContain('application/vnd.recordare.musicxml+xml');
    expect(zip.file('score.musicxml')).not.toBeNull();
  });

  it('serializeToMxl → parseFromMxl round-trips the score', async () => {
    const score = MusicXml.parseFromMusicXml(XML);
    const round = await MusicXml.parseFromMxl(await MusicXml.serializeToMxl(score));
    expect(round.movementTitle).toBe('Test');
    expect(round.partList.scoreParts[0].partName.value).toBe('Violin');
  });

  it('parse auto-detects MXL vs uncompressed MusicXML', async () => {
    const score = MusicXml.parseFromMusicXml(XML);
    const fromXml = await MusicXml.parse(MusicXml.serializeToMusicXml(score));
    const fromMxl = await MusicXml.parse(await MusicXml.serializeToMxl(score));
    expect(fromXml.movementTitle).toBe('Test');
    expect(fromMxl.movementTitle).toBe('Test');
  });

  it('parseFromMxl rejects an archive without container.xml', async () => {
    const zip = new JSZip();
    zip.file('score.musicxml', XML);
    const data = await zip.generateAsync({ type: 'uint8array' });
    await expect(MusicXml.parseFromMxl(data)).rejects.toThrow(/container\.xml/);
  });
});
