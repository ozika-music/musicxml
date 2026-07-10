/**
 * Measure + Part containers — compose every measure-content class.
 * @see musicxml.xsd "measure" (partwise), "part" (partwise)
 */

import { allChildren, attr, el, tagOf, type XmlElement } from '../../xml/xml-element';
import type { Tenths } from '../common';
import { InstrumentType, type YesNo } from '../enums';
import { Bookmark } from '../common/bookmark';
import { Note } from '../note';
import { Direction, FiguredBass, Harmony } from '../direction';
import { Print } from '../score';
import { Attributes } from './attributes';
import { Backup, Forward } from './backup-forward';
import { Barline } from './barline';
import { Sound } from './sound';
import { Grouping, Link, Listening } from './measure-misc';
import type { Measure as MeasureShape, MeasureContent, Part as PartShape } from '../part';

/** Parse one measure child element into a typed MeasureContent item. */
function contentFromNode(node: XmlElement): MeasureContent | undefined {
  switch (tagOf(node)) {
    case 'note': return { type: 'note', data: Note.fromXmlElement(node) };
    case 'backup': return { type: 'backup', data: Backup.fromXmlElement(node) };
    case 'forward': return { type: 'forward', data: Forward.fromXmlElement(node) };
    case 'direction': return { type: 'direction', data: Direction.fromXmlElement(node) };
    case 'attributes': return { type: 'attributes', data: Attributes.fromXmlElement(node) };
    case 'harmony': return { type: 'harmony', data: Harmony.fromXmlElement(node) };
    case 'figured-bass': return { type: 'figured-bass', data: FiguredBass.fromXmlElement(node) };
    case 'print': return { type: 'print', data: Print.fromXmlElement(node) };
    case 'sound': return { type: 'sound', data: Sound.fromXmlElement(node) };
    case 'listening': return { type: 'listening', data: Listening.fromXmlElement(node) };
    case 'barline': return { type: 'barline', data: Barline.fromXmlElement(node) };
    case 'grouping': return { type: 'grouping', data: Grouping.fromXmlElement(node) };
    case 'link': return { type: 'link', data: Link.fromXmlElement(node) };
    case 'bookmark': return { type: 'bookmark', data: Bookmark.fromXmlElement(node) };
    default: return undefined;
  }
}

/** Serialize one typed MeasureContent item to a preserve-order node. */
function contentToNode(item: MeasureContent): XmlElement | undefined {
  switch (item.type) {
    case 'note': return Note.toXmlElement(item.data);
    case 'backup': return Backup.toXmlElement(item.data);
    case 'forward': return Forward.toXmlElement(item.data);
    case 'direction': return Direction.toXmlElement(item.data);
    case 'attributes': return Attributes.toXmlElement(item.data);
    case 'harmony': return Harmony.toXmlElement(item.data);
    case 'figured-bass': return FiguredBass.toXmlElement(item.data);
    case 'print': return Print.toXmlElement(item.data);
    case 'sound': return Sound.toXmlElement(item.data);
    case 'listening': return Listening.toXmlElement(item.data);
    case 'barline': return Barline.toXmlElement(item.data);
    case 'grouping': return Grouping.toXmlElement(item.data);
    case 'link': return Link.toXmlElement(item.data);
    case 'bookmark': return Bookmark.toXmlElement(item.data);
    default: return undefined;
  }
}

/** @see musicxml.xsd "measure" (partwise). */
export class Measure implements MeasureShape {
  number = '';
  implicit?: YesNo;
  nonControlling?: YesNo;
  width?: Tenths;
  text?: string;
  content: MeasureContent[] = [];
  id?: string;
  constructor(init?: Partial<Measure>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Measure {
    const content: MeasureContent[] = [];
    for (const child of allChildren(node)) {
      const item = contentFromNode(child);
      if (item) content.push(item);
    }
    return new Measure({
      number: attr(node, 'number') ?? '',
      implicit: attr(node, 'implicit') as YesNo | undefined,
      nonControlling: attr(node, 'non-controlling') as YesNo | undefined,
      width: attr(node, 'width') === undefined ? undefined : Number(attr(node, 'width')),
      text: attr(node, 'text'),
      id: attr(node, 'id'),
      content,
    });
  }
  static toXmlElement(m: Measure): XmlElement {
    const c: XmlElement[] = [];
    for (const item of m.content) {
      const node = contentToNode(item);
      if (node) c.push(node);
    }
    return el('measure', c, {
      number: m.number,
      implicit: m.implicit,
      'non-controlling': m.nonControlling,
      width: m.width,
      text: m.text,
      id: m.id,
    });
  }

  // ----------------------------------------------------------- behavior ----

  /**
   * Expand `<repeat>`/ending structure into a flat measure list by duplicating
   * repeated sections, stripping repeat/ending markers and renumbering from 1.
   * Static (data-in) so it works on plain `Measure`-shaped objects too.
   */
  static expandRepeats(measures: Measure[]): Measure[] {
    const sequence = buildExpandedMeasureIndexSequence(measures);
    const expanded: Measure[] = [];
    let measureNumber = 1;
    for (const sourceMeasureIndex of sequence) {
      expanded.push(stripRepeatLayout(measures[sourceMeasureIndex], measureNumber));
      measureNumber++;
    }
    return expanded;
  }
}

/** Strip repeat/ending markers from a measure and renumber it. Private; see {@link Measure.expandRepeats}. */
function stripRepeatLayout(measure: Measure, numberedValue: number): Measure {
  const content = measure.content.map((entry) => {
    if (entry.type === 'barline') {
      const { repeat, ending, ...barlineWithoutRepeats } = entry.data;
      return { ...entry, data: barlineWithoutRepeats };
    }
    if (entry.type === 'attributes' && entry.data.measureStyles) {
      const cleanedMeasureStyles = entry.data.measureStyles.map((style) => {
        const { measureRepeat, beatRepeat, ...styleWithoutRepeats } = style;
        return styleWithoutRepeats;
      });
      return { ...entry, data: { ...entry.data, measureStyles: cleanedMeasureStyles } };
    }
    return entry;
  });
  return { ...measure, number: numberedValue.toString(), content };
}

function detectRepeatMarkers(measure: Measure): { hasRepeatStart: boolean; repeatTimes: number | null } {
  let hasRepeatStart = false;
  let repeatTimes: number | null = null;
  for (const content of measure.content) {
    if (content.type !== 'barline') continue;
    const repeat = content.data.repeat;
    if (!repeat) continue;
    if (repeat.direction === 'forward') {
      hasRepeatStart = true;
    } else if (repeat.direction === 'backward') {
      const times = repeat.times ?? 2;
      repeatTimes = repeatTimes === null ? times : Math.max(repeatTimes, times);
    }
  }
  return { hasRepeatStart, repeatTimes };
}

function buildExpandedMeasureIndexSequence(measures: Measure[]): number[] {
  const sequence: number[] = [];
  let repeatStartIndex = -1;
  for (let i = 0; i < measures.length; i++) {
    const { hasRepeatStart, repeatTimes } = detectRepeatMarkers(measures[i]);
    if (hasRepeatStart) repeatStartIndex = sequence.length;
    sequence.push(i);
    if (repeatTimes !== null) {
      let startIdx = repeatStartIndex >= 0 ? repeatStartIndex : 0;
      // Some scores end a local repeated phrase and immediately start a new one on the next measure.
      // In that case, the backward repeat closes the current measure rather than the whole prefix.
      if (repeatStartIndex < 0 && i + 1 < measures.length) {
        if (detectRepeatMarkers(measures[i + 1]).hasRepeatStart) startIdx = sequence.length - 1;
      }
      const sectionToDuplicate = sequence.slice(startIdx);
      for (let rep = 1; rep < repeatTimes; rep++) sequence.push(...sectionToDuplicate);
      repeatStartIndex = -1;
    }
  }
  return sequence;
}

/** @see musicxml.xsd "part" (partwise). */
export class Part implements PartShape {
  id = '';
  measures: Measure[] = [];
  constructor(init?: Partial<Part>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Part {
    return new Part({
      id: attr(node, 'id') ?? '',
      measures: allChildren(node).filter((c) => tagOf(c) === 'measure').map(Measure.fromXmlElement),
    });
  }
  static toXmlElement(p: Part): XmlElement {
    return el('part', p.measures.map(Measure.toXmlElement), { id: p.id });
  }

  // ----------------------------------------------------------- behavior ----
  // Static (data-in) so these work on plain `Part`-shaped objects too.

  /**
   * Staff number carrying tablature, or undefined when the part has none.
   * Detection order: explicit TAB clef → staff-details with tunings → any note
   * with both string and fret data (each defaulting its staff number to 1).
   */
  static getTablatureStaffNumber(part: Part): number | undefined {
    for (const measure of part.measures) {
      for (const content of measure.content) {
        if (content.type !== 'attributes') continue;
        for (const clef of content.data.clefs ?? []) {
          if (clef.sign === 'TAB') return clef.number ?? 1;
        }
      }
    }

    for (let i = 0; i < Math.min(3, part.measures.length); i++) {
      for (const content of part.measures[i].content) {
        if (content.type !== 'attributes') continue;
        for (const staffDetail of content.data.staffDetails ?? []) {
          if (staffDetail.staffTunings?.length) return staffDetail.number ?? 1;
        }
      }
    }

    for (const measure of part.measures) {
      for (const content of measure.content) {
        if (content.type !== 'note') continue;
        const note = content.data;
        if (Note.getStringNumber(note) !== undefined && Note.getFretNumber(note) !== undefined) {
          return note.staff ?? 1;
        }
      }
    }

    return undefined;
  }

  /** Whether a part needs both hands (a keys part with more than one staff). */
  static requireBothHands(part: Part, instrumentType: InstrumentType): boolean {
    if (instrumentType !== InstrumentType.Keys) return false;
    return part.measures.some((measure) =>
      measure.content.some(
        (content) => content.type === 'attributes' && content.data.staves !== undefined && content.data.staves > 1,
      ),
    );
  }

  /**
   * String tunings (highest → lowest pitch) from the part's staff-details, or
   * undefined when there are none. Lowercase for octave ≥ 4, uppercase below.
   */
  static extractTuning(part: Part): string[] | undefined {
    for (let measureIdx = 0; measureIdx < Math.min(3, part.measures.length); measureIdx++) {
      for (const content of part.measures[measureIdx].content) {
        if (content.type !== 'attributes') continue;
        const staffDetail = content.data.staffDetails?.[0];
        const tunings = staffDetail?.staffTunings;
        if (!tunings?.length) continue;
        // TAB line 1 = lowest pitch, line N = highest; sort high → low.
        return [...tunings]
          .sort((a, b) => b.line - a.line)
          .map((st) => {
            let noteName = st.tuningStep;
            if (st.tuningAlter && st.tuningAlter > 0) noteName += '#'.repeat(st.tuningAlter);
            else if (st.tuningAlter && st.tuningAlter < 0) noteName += 'b'.repeat(Math.abs(st.tuningAlter));
            return st.tuningOctave >= 4 ? noteName.toLowerCase() : noteName.toUpperCase();
          });
      }
    }
    return undefined;
  }
}
