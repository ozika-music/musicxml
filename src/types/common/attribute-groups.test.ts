import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { FontWeight, LeftCenterRight, TextDirection, Valign } from '../enums';
import { PrintStyleAttrs, TextFormattingAttrs } from './attribute-groups';

/**
 * Attribute-group read/attrs round-trip via a host element.
 * @see musicxml.xsd attributeGroup "print-style" / "text-formatting"
 */
describe('attribute groups', () => {
  const roundTrip = (attrs: Record<string, string | number | undefined>) => {
    const node = buildElements([{ words: [{ '#text': 'x' }], ':@': clean(attrs) }]);
    return parseElements(node)[0];
  };
  const clean = (m: Record<string, string | number | undefined>) => {
    const o: Record<string, string> = {};
    for (const [k, v] of Object.entries(m)) if (v !== undefined) o[`@_${k}`] = String(v);
    return o;
  };

  it('PrintStyleAttrs round-trips position + font + color', () => {
    const data = { defaultX: 5, fontWeight: FontWeight.Bold, color: '#00FF00' };
    const read = PrintStyleAttrs.read(roundTrip(PrintStyleAttrs.attrs(data)));
    expect(read.defaultX).toBe(5);
    expect(read.fontWeight).toBe(FontWeight.Bold);
    expect(read.color).toBe('#00FF00');
  });

  it('TextFormattingAttrs round-trips justify, decoration, dir, valign', () => {
    const data = {
      justify: LeftCenterRight.Center,
      valign: Valign.Top,
      textDecoration: { underline: 1 as const, overline: undefined, lineThrough: undefined },
      dir: TextDirection.Rtl,
      letterSpacing: 'normal' as const,
    };
    const read = TextFormattingAttrs.read(roundTrip(TextFormattingAttrs.attrs(data)));
    expect(read.justify).toBe(LeftCenterRight.Center);
    expect(read.valign).toBe(Valign.Top);
    expect(read.textDecoration?.underline).toBe(1);
    expect(read.dir).toBe(TextDirection.Rtl);
    expect(read.letterSpacing).toBe('normal');
  });
});
