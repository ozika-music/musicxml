/**
 * Note auxiliary elements: notehead-text, play, listen.
 * @see musicxml.xsd "notehead-text", "play", "listen"
 *
 * notehead-text deep print-style attrs are captured at the NameDisplay level
 * (text + smufl round-trip; per-text print-style deferred like name-display).
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import type { TimeOnly } from '../common';
import type { YesNo } from '../enums';
import type {
  Assess as AssessShape,
  Listen as ListenShape,
  NoteheadText as NoteheadTextShape,
  OtherListen as OtherListenShape,
  OtherPlay as OtherPlayShape,
  Play as PlayShape,
  Wait as WaitShape,
} from '../note';

/**
 * The notehead-text type represents text that is displayed inside a notehead, as is done in some educational music. It is not needed for the numbers used in tablature or jianpu notation. The presence of a TAB or jianpu clefs is sufficient to indicate that numbers are used. The display-text and accidental-text elements allow display of fully formatted text and accidentals.
 * @see musicxml.xsd "notehead-text".
 */
export class NoteheadText implements NoteheadTextShape {
  displayTexts?: { value: string }[];
  accidentalTexts?: { value: string; smufl?: string }[];
  constructor(init?: Partial<NoteheadText>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): NoteheadText {
    const dt = childrenOf(node, 'display-text').map((c) => ({ value: elementText(c) ?? '' }));
    const at = childrenOf(node, 'accidental-text').map((c) => ({ value: elementText(c) ?? '', smufl: attr(c, 'smufl') }));
    return new NoteheadText({ displayTexts: dt.length ? dt : undefined, accidentalTexts: at.length ? at : undefined });
  }
  static toXmlElement(t: NoteheadText): XmlElement {
    const c: XmlElement[] = [];
    for (const d of t.displayTexts ?? []) c.push(textEl('display-text', d.value));
    for (const a of t.accidentalTexts ?? []) c.push(el('accidental-text', a.value ? [{ '#text': a.value }] : [], { smufl: a.smufl }));
    return el('notehead-text', c);
  }
}

/**
 * The play type specifies playback techniques to be used in conjunction with the instrument-sound element. When used as part of a sound element, it applies to all notes going forward in score order. In multi-instrument parts, the affected instrument should be specified using the id attribute. When used as part of a note element, it applies to the current note only.
 * @see musicxml.xsd "play".
 */
export class Play implements PlayShape {
  ipa?: string;
  mute?: string;
  semiPitched?: string;
  otherPlay?: OtherPlayShape;
  id?: string;
  constructor(init?: Partial<Play>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Play {
    const other = childrenOf(node, 'other-play')[0];
    return new Play({
      ipa: textOf(node, 'ipa'),
      mute: textOf(node, 'mute'),
      semiPitched: textOf(node, 'semi-pitched'),
      otherPlay: other ? { type: attr(other, 'type') ?? '', value: elementText(other) ?? '' } : undefined,
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(p: Play): XmlElement {
    const c: XmlElement[] = [];
    if (p.ipa !== undefined) c.push(textEl('ipa', p.ipa));
    if (p.mute !== undefined) c.push(textEl('mute', p.mute));
    if (p.semiPitched !== undefined) c.push(textEl('semi-pitched', p.semiPitched));
    if (p.otherPlay) c.push(el('other-play', [{ '#text': p.otherPlay.value }], { type: p.otherPlay.type }));
    return el('play', c, { id: p.id });
  }
}

/**
 * The listen and listening types, new in Version 4.0, specify different ways that a score following or machine listening application can interact with a performer. The listen type handles interactions that are specific to a note. If multiple child elements of the same type are present, they should have distinct player and/or time-only attributes.
 * @see musicxml.xsd "listen".
 */
export class Listen implements ListenShape {
  assess?: AssessShape;
  wait?: WaitShape;
  otherListen?: OtherListenShape;
  constructor(init?: Partial<Listen>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Listen {
    const a = childrenOf(node, 'assess')[0];
    const w = childrenOf(node, 'wait')[0];
    const o = childrenOf(node, 'other-listen')[0];
    return new Listen({
      assess: a ? { type: attr(a, 'type') as YesNo, player: attr(a, 'player'), timeOnly: attr(a, 'time-only') as TimeOnly | undefined } : undefined,
      wait: w ? { player: attr(w, 'player'), timeOnly: attr(w, 'time-only') as TimeOnly | undefined } : undefined,
      otherListen: o ? { type: attr(o, 'type') ?? '', player: attr(o, 'player'), timeOnly: attr(o, 'time-only') as TimeOnly | undefined, value: elementText(o) ?? '' } : undefined,
    });
  }
  static toXmlElement(l: Listen): XmlElement {
    const c: XmlElement[] = [];
    if (l.assess) c.push(el('assess', [], { type: l.assess.type, player: l.assess.player, 'time-only': l.assess.timeOnly }));
    if (l.wait) c.push(el('wait', [], { player: l.wait.player, 'time-only': l.wait.timeOnly }));
    if (l.otherListen) c.push(el('other-listen', l.otherListen.value ? [{ '#text': l.otherListen.value }] : [], { type: l.otherListen.type, player: l.otherListen.player, 'time-only': l.otherListen.timeOnly }));
    return el('listen', c);
  }
}
