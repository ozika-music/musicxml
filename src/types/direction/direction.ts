/**
 * Direction + DirectionType aggregate.
 * @see musicxml.xsd "direction", "direction-type"
 *
 * Covers the common direction-type children. The rare/large ones (harp-pedals,
 * scordatura, image, principal-voice, percussion) are carried on the type but
 * not yet serialized. Direction listening is likewise carried.
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import type { AboveBelow, YesNo } from '../enums';
import type { Divisions, Editorial } from '../common';
import { PlacementAttrs } from '../common/attribute-groups';
import { Coda, Segno } from '../common/segno-coda';
import { Dynamics } from '../note';
import { Metronome } from './metronome';
import {
  AccordionRegistration,
  Bracket,
  Dashes,
  EmptyPrintStyleAlign,
  OctaveShift,
  OtherDirection,
  Pedal,
  Rehearsal,
  StaffDivide,
  StringMute,
  Symbol as SymbolEl,
  Wedge,
  Words,
} from './direction-leaves';
import { HarpPedals, Image, Percussion, PrincipalVoice, Scordatura } from './direction-extra';
import type {
  Direction as DirectionShape,
  DirectionListening,
  DirectionSound,
  DirectionType as DirectionTypeShape,
} from '../direction';

function numAttr(node: XmlElement, name: string): number | undefined {
  const v = attr(node, name);
  return v === undefined ? undefined : Number(v);
}

/**
 * Textual direction types may have more than 1 component due to multiple fonts. The dynamics element may also be used in the notations element. Attribute groups related to print suggestions apply to the individual direction-type, not to the overall direction.
 * @see musicxml.xsd "direction-type".
 */
export class DirectionType implements DirectionTypeShape {
  rehearsals?: Rehearsal[];
  segnos?: Segno[];
  codas?: Coda[];
  words?: Words[];
  symbols?: SymbolEl[];
  wedge?: Wedge;
  dynamics?: Dynamics[];
  dashes?: Dashes;
  bracket?: Bracket;
  pedal?: Pedal;
  metronome?: Metronome;
  octaveShift?: OctaveShift;
  harpPedals?: HarpPedals;
  damp?: EmptyPrintStyleAlign;
  dampAll?: EmptyPrintStyleAlign;
  eyeglasses?: EmptyPrintStyleAlign;
  stringMute?: StringMute;
  scordatura?: Scordatura;
  image?: Image;
  principalVoice?: PrincipalVoice;
  percussions?: Percussion[];
  accordionRegistration?: AccordionRegistration;
  staffDivide?: StaffDivide;
  otherDirection?: OtherDirection;
  id?: string;
  constructor(init?: Partial<DirectionType>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): DirectionType {
    const one = <T>(tag: string, f: (n: XmlElement) => T): T | undefined => {
      const c = childrenOf(node, tag)[0];
      return c ? f(c) : undefined;
    };
    const many = <T>(tag: string, f: (n: XmlElement) => T): T[] | undefined => {
      const arr = childrenOf(node, tag).map(f);
      return arr.length ? arr : undefined;
    };
    return new DirectionType({
      rehearsals: many('rehearsal', Rehearsal.fromXmlElement),
      segnos: many('segno', Segno.fromXmlElement),
      codas: many('coda', Coda.fromXmlElement),
      words: many('words', Words.fromXmlElement),
      symbols: many('symbol', SymbolEl.fromXmlElement),
      wedge: one('wedge', Wedge.fromXmlElement),
      dynamics: many('dynamics', Dynamics.fromXmlElement),
      dashes: one('dashes', Dashes.fromXmlElement),
      bracket: one('bracket', Bracket.fromXmlElement),
      pedal: one('pedal', Pedal.fromXmlElement),
      metronome: one('metronome', Metronome.fromXmlElement),
      octaveShift: one('octave-shift', OctaveShift.fromXmlElement),
      harpPedals: one('harp-pedals', HarpPedals.fromXmlElement),
      damp: one('damp', EmptyPrintStyleAlign.fromXmlElement),
      dampAll: one('damp-all', EmptyPrintStyleAlign.fromXmlElement),
      eyeglasses: one('eyeglasses', EmptyPrintStyleAlign.fromXmlElement),
      stringMute: one('string-mute', StringMute.fromXmlElement),
      scordatura: one('scordatura', Scordatura.fromXmlElement),
      image: one('image', Image.fromXmlElement),
      principalVoice: one('principal-voice', PrincipalVoice.fromXmlElement),
      percussions: many('percussion', Percussion.fromXmlElement),
      accordionRegistration: one('accordion-registration', AccordionRegistration.fromXmlElement),
      staffDivide: one('staff-divide', StaffDivide.fromXmlElement),
      otherDirection: one('other-direction', OtherDirection.fromXmlElement),
      id: attr(node, 'id'),
    });
  }

  static toXmlElement(d: DirectionType): XmlElement {
    const c: XmlElement[] = [];
    for (const r of d.rehearsals ?? []) c.push(Rehearsal.toXmlElement(r));
    for (const s of d.segnos ?? []) c.push(Segno.toXmlElement(s));
    for (const co of d.codas ?? []) c.push(Coda.toXmlElement(co));
    for (const w of d.words ?? []) c.push(Words.toXmlElement(w));
    for (const s of d.symbols ?? []) c.push(SymbolEl.toXmlElement(s));
    if (d.wedge) c.push(Wedge.toXmlElement(d.wedge));
    for (const dyn of d.dynamics ?? []) c.push(Dynamics.toXmlElement(dyn));
    if (d.dashes) c.push(Dashes.toXmlElement(d.dashes));
    if (d.bracket) c.push(Bracket.toXmlElement(d.bracket));
    if (d.pedal) c.push(Pedal.toXmlElement(d.pedal));
    if (d.metronome) c.push(Metronome.toXmlElement(d.metronome));
    if (d.octaveShift) c.push(OctaveShift.toXmlElement(d.octaveShift));
    if (d.harpPedals) c.push(HarpPedals.toXmlElement(d.harpPedals));
    if (d.damp) c.push(EmptyPrintStyleAlign.toXmlElement(d.damp, 'damp'));
    if (d.dampAll) c.push(EmptyPrintStyleAlign.toXmlElement(d.dampAll, 'damp-all'));
    if (d.eyeglasses) c.push(EmptyPrintStyleAlign.toXmlElement(d.eyeglasses, 'eyeglasses'));
    if (d.stringMute) c.push(StringMute.toXmlElement(d.stringMute));
    if (d.scordatura) c.push(Scordatura.toXmlElement(d.scordatura));
    if (d.image) c.push(Image.toXmlElement(d.image));
    if (d.principalVoice) c.push(PrincipalVoice.toXmlElement(d.principalVoice));
    for (const perc of d.percussions ?? []) c.push(Percussion.toXmlElement(perc));
    if (d.accordionRegistration) c.push(AccordionRegistration.toXmlElement(d.accordionRegistration));
    if (d.staffDivide) c.push(StaffDivide.toXmlElement(d.staffDivide));
    if (d.otherDirection) c.push(OtherDirection.toXmlElement(d.otherDirection));
    return el('direction-type', c, { id: d.id });
  }
}

/**
 * A direction is a musical indication that is not necessarily attached to a specific note. Two or more may be combined to indicate words followed by the start of a dashed line, the end of a wedge followed by dynamics, etc. For applications where a specific direction is indeed attached to a specific note, the direction element can be associated with the first note element that follows it in score order that is not in a different voice. By default, a series of direction-type elements and a series of child elements of a direction-type within a single direction element follow one another in sequence visually. For a series of direction-type children, non-positional formatting attributes are carried over from the previous element by default.
 * @see musicxml.xsd "direction".
 */
export class Direction implements DirectionShape {
  directionTypes: DirectionType[] = [];
  offset?: { value: Divisions; sound?: YesNo };
  voice?: string;
  staff?: number;
  sound?: DirectionSound;
  listening?: DirectionListening;
  directive?: YesNo;
  system?: 'only-top' | 'only-bottom' | 'also-top' | 'also-bottom';
  placement?: AboveBelow;
  footnote?: Editorial['footnote'];
  level?: Editorial['level'];
  id?: string;
  constructor(init?: Partial<Direction>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Direction {
    const offsetEl = childrenOf(node, 'offset')[0];
    const soundEl = childrenOf(node, 'sound')[0];
    return new Direction({
      directionTypes: childrenOf(node, 'direction-type').map(DirectionType.fromXmlElement),
      offset: offsetEl
        ? { value: Number(elementText(offsetEl) ?? 0), sound: attr(offsetEl, 'sound') as YesNo | undefined }
        : undefined,
      voice: textOf(node, 'voice'),
      staff: numAttrText(node, 'staff'),
      sound: soundEl ? readDirectionSound(soundEl) : undefined,
      directive: attr(node, 'directive') as YesNo | undefined,
      system: attr(node, 'system') as Direction['system'],
      ...PlacementAttrs.read(node),
      id: attr(node, 'id'),
    });
  }

  static toXmlElement(d: Direction): XmlElement {
    const c: XmlElement[] = [];
    for (const dt of d.directionTypes ?? []) c.push(DirectionType.toXmlElement(dt));
    if (d.offset) c.push(el('offset', [{ '#text': String(d.offset.value) }], { sound: d.offset.sound }));
    if (d.voice !== undefined) c.push(textEl('voice', d.voice));
    if (d.staff !== undefined) c.push(textEl('staff', d.staff));
    if (d.sound) c.push(writeDirectionSound(d.sound));
    return el('direction', c, {
      ...PlacementAttrs.attrs({ placement: d.placement }),
      directive: d.directive,
      system: d.system,
      id: d.id,
    });
  }

  // ----------------------------------------------------------- behavior ----
  // Static (data-in) so these work on plain `Direction`-shaped objects too.

  /** Tempo (BPM) from `sound.tempo`, else the first `metronome.perMinute`. */
  static extractTempo(direction: Direction): number | undefined {
    if (direction.sound?.tempo) return direction.sound.tempo;
    for (const dirType of direction.directionTypes ?? []) {
      if (dirType.metronome?.perMinute) {
        const bpm = parseInt(dirType.metronome.perMinute.value, 10);
        if (!isNaN(bpm)) return bpm;
      }
    }
    return undefined;
  }

  /** First rehearsal mark text (e.g. "A", "Verse 1") in the direction, if any. */
  static extractRehearsalMark(direction: Direction): string | undefined {
    for (const dirType of direction.directionTypes ?? []) {
      if (dirType.rehearsals && dirType.rehearsals.length > 0) {
        return dirType.rehearsals[0].value;
      }
    }
    return undefined;
  }
}

function numAttrText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

function readDirectionSound(node: XmlElement): DirectionSound {
  const pedal = (name: string): YesNo | number | undefined => {
    const v = attr(node, name);
    if (v === undefined) return undefined;
    return v === 'yes' || v === 'no' ? (v as YesNo) : Number(v);
  };
  return {
    tempo: numAttr(node, 'tempo'),
    dynamics: numAttr(node, 'dynamics'),
    dacapo: attr(node, 'dacapo') as YesNo | undefined,
    segno: attr(node, 'segno'),
    dalsegno: attr(node, 'dalsegno'),
    coda: attr(node, 'coda'),
    tocoda: attr(node, 'tocoda'),
    divisions: numAttr(node, 'divisions'),
    forwardRepeat: attr(node, 'forward-repeat') as YesNo | undefined,
    fine: attr(node, 'fine'),
    timeOnly: attr(node, 'time-only'),
    pizzicato: attr(node, 'pizzicato') as YesNo | undefined,
    pan: numAttr(node, 'pan'),
    elevation: numAttr(node, 'elevation'),
    damperPedal: pedal('damper-pedal'),
    softPedal: pedal('soft-pedal'),
    sostenutoPedal: pedal('sostenuto-pedal'),
    id: attr(node, 'id'),
  };
}

function writeDirectionSound(s: DirectionSound): XmlElement {
  return el('sound', [], {
    tempo: s.tempo,
    dynamics: s.dynamics,
    dacapo: s.dacapo,
    segno: s.segno,
    dalsegno: s.dalsegno,
    coda: s.coda,
    tocoda: s.tocoda,
    divisions: s.divisions,
    'forward-repeat': s.forwardRepeat,
    fine: s.fine,
    'time-only': s.timeOnly,
    pizzicato: s.pizzicato,
    pan: s.pan,
    elevation: s.elevation,
    'damper-pedal': s.damperPedal,
    'soft-pedal': s.softPedal,
    'sostenuto-pedal': s.sostenutoPedal,
    id: s.id,
  });
}
