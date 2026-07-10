import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Player } from './player';

/** @see musicxml.xsd "player". */
describe('Player', () => {
  it('round-trips id + player-name', () => {
    const p = Player.fromXmlElement(parseElements('<player id="P1-1"><player-name>Violin I</player-name></player>')[0]);
    expect(p).toMatchObject({ id: 'P1-1', playerName: 'Violin I' });
    const round = Player.fromXmlElement(parseElements(buildElements([Player.toXmlElement(p)]))[0]);
    expect(round).toMatchObject({ id: 'P1-1', playerName: 'Violin I' });
  });
});
