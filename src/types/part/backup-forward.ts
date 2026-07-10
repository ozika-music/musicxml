/**
 * Backup / Forward — time-travel elements within a measure.
 * @see musicxml.xsd "backup", "forward"
 * Editorial footnote/level (and forward's editorial voice) are carried on the
 * type but not yet serialized (FormattedText not class-migrated).
 */

import { el, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import type { Divisions, Editorial, EditorialVoice } from '../common';
import type { Backup as BackupShape, Forward as ForwardShape } from '../part';

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

/**
 * The backup and forward elements are required to coordinate multiple voices in one part, including music on multiple staves. The backup type is generally used to move between voices and staves. Thus the backup element does not include voice or staff elements. Duration values should always be positive, and should not cross measure boundaries or mid-measure changes in the divisions value.
 * @see musicxml.xsd "backup".
 */
export class Backup implements BackupShape {
  duration: Divisions = 0;
  editorial?: Editorial;
  constructor(init?: Partial<Backup>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Backup {
    return new Backup({ duration: numText(node, 'duration') ?? 0 });
  }
  static toXmlElement(b: Backup): XmlElement {
    return el('backup', [textEl('duration', b.duration)]);
  }
}

/**
 * The backup and forward elements are required to coordinate multiple voices in one part, including music on multiple staves. The forward element is generally used within voices and staves. Duration values should always be positive, and should not cross measure boundaries or mid-measure changes in the divisions value.
 * @see musicxml.xsd "forward".
 */
export class Forward implements ForwardShape {
  duration: Divisions = 0;
  voice?: string;
  staff?: number;
  footnote?: EditorialVoice['footnote'];
  level?: EditorialVoice['level'];
  constructor(init?: Partial<Forward>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Forward {
    return new Forward({
      duration: numText(node, 'duration') ?? 0,
      voice: textOf(node, 'voice'),
      staff: numText(node, 'staff'),
    });
  }
  static toXmlElement(f: Forward): XmlElement {
    const c: XmlElement[] = [textEl('duration', f.duration)];
    if (f.voice !== undefined) c.push(textEl('voice', f.voice));
    if (f.staff !== undefined) c.push(textEl('staff', f.staff));
    return el('forward', c);
  }
}
