/**
 * player — a performer for a score-part (listening applications).
 * @see musicxml.xsd complexType "player" — player-name; @id (required)
 */

import { attr, el, textEl, textOf, type XmlElement } from '../../xml/xml-element';

/** The player type allows for multiple players per score-part for use in listening applications. One player may play multiple instruments, while a single instrument may include multiple players in divisi sections. */
export class Player {
  id = '';
  playerName = '';

  constructor(init?: Partial<Player>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Player {
    return new Player({ id: attr(node, 'id') ?? '', playerName: textOf(node, 'player-name') ?? '' });
  }

  static toXmlElement(p: Player): XmlElement {
    return el('player', [textEl('player-name', p.playerName)], { id: p.id });
  }
}
