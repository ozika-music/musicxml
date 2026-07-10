/**
 * MusicXml — the single parse/serialize facade for MusicXML documents.
 *
 * Parse methods return a typed {@link ScorePartwise}; serialize methods take one
 * and return the encoded bytes. Everything routes through the class model
 * (`ScorePartwise.fromXmlElement` / `toXmlElement`) — there is no separate
 * hand-written parser or string serializer.
 *
 * Both parse and serialize accept {@link MusicXmlOptions} to transform the model
 * in passing (expand repeats, normalize drum voices).
 *
 * @module musicxml-4.0
 */

import { buildElements, decodeXmlBytes, parseElements, tagOf } from './xml/xml-element';
import { Measure, ScorePartwise } from './types';
import { applyDrumsVoiceModeToScore, type DrumsVoiceMode } from './utils/drums-voice-utils';

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>\n';
const PARTWISE_DOCTYPE =
  '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n';
const MXL_MEDIA_TYPE = 'application/vnd.recordare.musicxml+xml';
const MXL_ROOT_FILE = 'score.musicxml';

/** Model transforms applied while parsing (after read) or serializing (before write). */
export interface MusicXmlOptions {
  /** Expand `<repeat>`/ending structure into a flat measure list. */
  expandRepeats?: boolean;
  /** Re-voice unpitched drum notes (`MergeVoices` / `SplitVoices`; `AsIs` = no-op). */
  drumsVoiceMode?: DrumsVoiceMode;
}

export class MusicXml {
  // --------------------------------------------------------------- parse ----

  /** True when the bytes are a compressed `.mxl` archive (ZIP magic `PK`). */
  static isMxl(data: Uint8Array): boolean {
    return isMxl(data);
  }

  /** Parse a `.musicxml` / `.mxl` file content (auto-detected by ZIP magic) into a score. */
  static async parse(data: Uint8Array, options?: MusicXmlOptions): Promise<ScorePartwise> {
    return isMxl(data)
      ? MusicXml.parseFromMxl(data, options)
      : MusicXml.parseFromMusicXml(decodeXmlBytes(data), options);
  }

  /** Parse an uncompressed MusicXML string into a score. */
  static parseFromMusicXml(xml: string, options?: MusicXmlOptions): ScorePartwise {
    const nodes = parseElements(xml);
    const root = nodes.find((n) => tagOf(n) === 'score-partwise');
    if (!root) {
      if (nodes.some((n) => tagOf(n) === 'score-timewise')) {
        throw new Error('score-timewise is not supported; convert to score-partwise first');
      }
      throw new Error('Invalid MusicXML: missing score-partwise root element');
    }
    return applyOptions(ScorePartwise.fromXmlElement(root), options);
  }

  /** Parse a compressed `.mxl` (ZIP) document into a score. */
  static async parseFromMxl(data: Uint8Array, options?: MusicXmlOptions): Promise<ScorePartwise> {
    return MusicXml.parseFromMusicXml(await unzipRootMusicXml(data), options);
  }

  // ----------------------------------------------------------- serialize ----

  /** Serialize a score to an uncompressed MusicXML document (UTF-8 bytes). */
  static serializeToMusicXml(score: ScorePartwise, options?: MusicXmlOptions): Uint8Array {
    return new TextEncoder().encode(toMusicXmlString(applyOptions(score, options)));
  }

  /** Serialize a score to a compressed `.mxl` (ZIP) document. */
  static async serializeToMxl(score: ScorePartwise, options?: MusicXmlOptions): Promise<Uint8Array> {
    return zipMusicXml(toMusicXmlString(applyOptions(score, options)));
  }
}

// ---------------------------------------------------------------- helpers ----

/** Apply the optional model transforms (non-mutating) in passing. */
function applyOptions(score: ScorePartwise, options?: MusicXmlOptions): ScorePartwise {
  if (!options) return score;
  let result = score;
  if (options.expandRepeats) {
    result = {
      ...result,
      parts: result.parts.map((part) => ({ ...part, measures: Measure.expandRepeats(part.measures) })),
    };
  }
  if (options.drumsVoiceMode) {
    result = applyDrumsVoiceModeToScore(result, options.drumsVoiceMode);
  }
  return result;
}

/** Full MusicXML document string: declaration + doctype + serialized root. */
function toMusicXmlString(score: ScorePartwise): string {
  return XML_DECLARATION + PARTWISE_DOCTYPE + buildElements([ScorePartwise.toXmlElement(score)]);
}

/** True when the bytes begin with the ZIP magic number (`PK`). */
function isMxl(data: Uint8Array): boolean {
  return data.length >= 2 && data[0] === 0x50 && data[1] === 0x4b;
}

async function loadJSZip(): Promise<typeof import('jszip')> {
  const mod = await import('jszip');
  return mod.default || mod;
}

/** Extract the root MusicXML text from an `.mxl` archive (via META-INF/container.xml). */
async function unzipRootMusicXml(data: Uint8Array): Promise<string> {
  const JSZip = await loadJSZip();
  const zip = await JSZip.loadAsync(data);
  const container = zip.file('META-INF/container.xml');
  if (!container) throw new Error('Invalid MXL file: missing META-INF/container.xml');
  const rootPath = rootFilePath(await container.async('text'));
  const rootFile = zip.file(rootPath);
  if (!rootFile) throw new Error(`Invalid MXL file: root file not found: ${rootPath}`);
  return decodeXmlBytes(await rootFile.async('uint8array'));
}

/** Build an `.mxl` archive embedding `xml` as the root file. */
async function zipMusicXml(xml: string): Promise<Uint8Array> {
  const JSZip = await loadJSZip();
  const zip = new JSZip();
  zip.file('META-INF/container.xml', containerXml(MXL_ROOT_FILE));
  zip.file(MXL_ROOT_FILE, xml);
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE', compressionOptions: { level: 9 } });
}

function containerXml(rootFileName: string): string {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n' +
    '  <rootfiles>\n' +
    `    <rootfile full-path="${escapeXmlAttr(rootFileName)}" media-type="${MXL_MEDIA_TYPE}"/>\n` +
    '  </rootfiles>\n' +
    '</container>'
  );
}

function rootFilePath(containerXmlText: string): string {
  const match = containerXmlText.match(/<rootfile\b[^>]*\bfull-path\s*=\s*(['"])(.*?)\1/i);
  if (!match) throw new Error('Invalid container.xml: missing rootfile full-path');
  return match[2]
    .replace(/^\//, '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function escapeXmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
