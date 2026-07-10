/**
 * ScorePartwise — the root partwise document.
 * @see musicxml.xsd "score-partwise"
 *
 * Both parse and serialize run through this class: `fromXmlElement` composes the
 * header + part-list + parts from their leaf classes, and `toXmlElement` is the
 * inverse. The `MusicXml` facade (`parseFromMusicXml` / `serializeToMusicXml`)
 * is a thin wrapper over these.
 */

import { attr, childrenOf, el, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import { PartList } from './part-list';
import { Credit } from './credit';
import { Defaults } from './defaults';
import { Identification } from './identification';
import { Work } from './work';
import { Part } from '../part/measure';
import type { ScorePartwise as ScorePartwiseShape } from '../score';

/** Score-level metadata extracted from a {@link ScorePartwise} via practical fallbacks. */
export interface ExtractedScoreMetadata {
  title?: string;
  artist?: string;
}

/** @see musicxml.xsd "score-partwise". */
export class ScorePartwise implements ScorePartwiseShape {
  version?: string;
  work?: Work;
  movementNumber?: string;
  movementTitle?: string;
  identification?: Identification;
  defaults?: Defaults;
  credits?: Credit[];
  partList: PartList = new PartList();
  parts: Part[] = [];
  constructor(init?: Partial<ScorePartwise>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): ScorePartwise {
    const one = (tag: string) => childrenOf(node, tag)[0];
    const work = one('work');
    const identification = one('identification');
    const defaults = one('defaults');
    const partList = one('part-list');
    const credits = childrenOf(node, 'credit').map(Credit.fromXmlElement);
    return new ScorePartwise({
      version: attr(node, 'version'),
      work: work ? Work.fromXmlElement(work) : undefined,
      movementNumber: textOf(node, 'movement-number'),
      movementTitle: textOf(node, 'movement-title'),
      identification: identification ? Identification.fromXmlElement(identification) : undefined,
      defaults: defaults ? Defaults.fromXmlElement(defaults) : undefined,
      credits: credits.length ? credits : undefined,
      partList: partList ? PartList.fromXmlElement(partList) : new PartList(),
      parts: childrenOf(node, 'part').map(Part.fromXmlElement),
    });
  }

  static toXmlElement(score: ScorePartwise): XmlElement {
    const c: XmlElement[] = [];
    if (score.work) c.push(Work.toXmlElement(score.work));
    if (score.movementNumber !== undefined) c.push(textEl('movement-number', score.movementNumber));
    if (score.movementTitle !== undefined) c.push(textEl('movement-title', score.movementTitle));
    if (score.identification) c.push(Identification.toXmlElement(score.identification));
    if (score.defaults) c.push(Defaults.toXmlElement(score.defaults));
    for (const credit of score.credits ?? []) c.push(Credit.toXmlElement(credit));
    c.push(PartList.toXmlElement(score.partList));
    for (const part of score.parts) c.push(Part.toXmlElement(part));
    return el('score-partwise', c, { version: score.version });
  }

  // ----------------------------------------------------------- behavior ----

  /**
   * Extract score-level {@link ExtractedScoreMetadata} (title / artist) using
   * common practical fallbacks: title ← movement-title, work-title, then a
   * title/subtitle credit; artist ← composer creator, first creator, then a
   * composer/arranger/lyricist credit. Static (data-in).
   */
  static extractMetadata(score: ScorePartwise): ExtractedScoreMetadata {
    const creators = Array.isArray(score.identification?.creators) ? score.identification.creators : [];
    const composer = creators.find((creator) => (creator.type ?? '').trim().toLowerCase() === 'composer');

    const title = firstNonEmptyMetadataValue(
      score.movementTitle,
      score.work?.workTitle,
      firstCreditWordsByTypes(score, ['title', 'movement title', 'subtitle']),
    );

    const artist = firstNonEmptyMetadataValue(
      composer?.value,
      creators[0]?.value,
      firstCreditWordsByTypes(score, ['composer', 'arranger', 'lyricist']),
    );

    return { title, artist };
  }
}

function normalizeMetadataValue(value: string | null | undefined): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function firstNonEmptyMetadataValue(...values: Array<string | null | undefined>): string | undefined {
  for (const value of values) {
    const normalized = normalizeMetadataValue(value);
    if (normalized) return normalized;
  }
  return undefined;
}

function firstCreditWordsByTypes(score: ScorePartwise, targetTypes: string[]): string | undefined {
  if (!Array.isArray(score.credits) || score.credits.length === 0) return undefined;
  const targetTypeSet = new Set(targetTypes.map((type) => type.toLowerCase()));
  for (const credit of score.credits) {
    const creditTypes = Array.isArray(credit.creditTypes) ? credit.creditTypes.map((type) => type.toLowerCase()) : [];
    if (!creditTypes.some((type) => targetTypeSet.has(type))) continue;
    if (!Array.isArray(credit.creditWords)) continue;
    for (const words of credit.creditWords) {
      const value = normalizeMetadataValue(words?.value);
      if (value) return value;
    }
  }
  return undefined;
}
