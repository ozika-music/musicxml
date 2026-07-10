/**
 * XSD attributeGroup helpers (position / font / color / print-style).
 *
 * Attribute groups are not elements — they contribute attributes to a parent
 * element. So instead of `fromXmlElement`/`toXmlElement`, each is a class of
 * static `read(node)` (parse attributes into a flat partial) and `attrs(obj)`
 * (emit the attribute map). Element classes compose them.
 *
 * @see musicxml.xsd attributeGroup "position" / "font" / "color" / "print-style"
 */

import { attr, type XmlElement } from '../../xml/xml-element';
import { AboveBelow, CssFontSize, EnclosureShape, FontStyle, FontWeight, LeftCenterRight, LineShape, LineType, TextDirection, Valign } from '../enums';
import type { NumberOfLines } from '../enums';
import type { BendSound, Bezier, ColorAttribute, DashedFormatting, Font, LineShapeAttributes, LineTypeAttributes, PlacementAttributes, Position, PrintStyle, PrintStyleAlign, TextFormatting, TrillSound } from '../common';
import type { YesNo } from '../enums';

type Attrs = Record<string, string | number | undefined>;

function num(node: XmlElement, name: string): number | undefined {
  const v = attr(node, name);
  return v === undefined ? undefined : Number(v);
}

/** Coerce a raw attribute to one of a string enum's values, else undefined. */
export function asEnum<T extends Record<string, string>>(e: T, v: string | undefined): T[keyof T] | undefined {
  return v != null && (Object.values(e) as string[]).includes(v) ? (v as unknown as T[keyof T]) : undefined;
}

export class PositionAttrs {
  static read(node: XmlElement): Position {
    return {
      defaultX: num(node, 'default-x'),
      defaultY: num(node, 'default-y'),
      relativeX: num(node, 'relative-x'),
      relativeY: num(node, 'relative-y'),
    };
  }
  static attrs(p: Position): Attrs {
    return {
      'default-x': p.defaultX,
      'default-y': p.defaultY,
      'relative-x': p.relativeX,
      'relative-y': p.relativeY,
    };
  }
}

export class FontAttrs {
  static read(node: XmlElement): Font {
    const fs = attr(node, 'font-size');
    return {
      fontFamily: attr(node, 'font-family'),
      fontStyle: asEnum(FontStyle, attr(node, 'font-style')),
      fontSize: fs === undefined ? undefined : Number.isNaN(Number(fs)) ? asEnum(CssFontSize, fs) : Number(fs),
      fontWeight: asEnum(FontWeight, attr(node, 'font-weight')),
    };
  }
  static attrs(f: Font): Attrs {
    return {
      'font-family': f.fontFamily,
      'font-style': f.fontStyle,
      'font-size': f.fontSize,
      'font-weight': f.fontWeight,
    };
  }
}

export class ColorAttrs {
  static read(node: XmlElement): ColorAttribute {
    return { color: attr(node, 'color') };
  }
  static attrs(c: ColorAttribute): Attrs {
    return { color: c.color };
  }
}

/** @see musicxml.xsd attributeGroup "placement". */
export class PlacementAttrs {
  static read(node: XmlElement): PlacementAttributes {
    return { placement: asEnum(AboveBelow, attr(node, 'placement')) };
  }
  static attrs(p: PlacementAttributes): Attrs {
    return { placement: p.placement };
  }
}

/** @see musicxml.xsd attributeGroup "line-type". */
export class LineTypeAttrs {
  static read(node: XmlElement): LineTypeAttributes {
    return { lineType: asEnum(LineType, attr(node, 'line-type')) };
  }
  static attrs(l: LineTypeAttributes): Attrs {
    return { 'line-type': l.lineType };
  }
}

/** @see musicxml.xsd attributeGroup "line-shape". */
export class LineShapeAttrs {
  static read(node: XmlElement): LineShapeAttributes {
    return { lineShape: asEnum(LineShape, attr(node, 'line-shape')) };
  }
  static attrs(l: LineShapeAttributes): Attrs {
    return { 'line-shape': l.lineShape };
  }
}

/** @see musicxml.xsd attributeGroup "dashed-formatting". */
export class DashedFormattingAttrs {
  static read(node: XmlElement): DashedFormatting {
    return { dashLength: num(node, 'dash-length'), spaceLength: num(node, 'space-length') };
  }
  static attrs(d: DashedFormatting): Attrs {
    return { 'dash-length': d.dashLength, 'space-length': d.spaceLength };
  }
}

/** @see musicxml.xsd attributeGroup "trill-sound". */
export class TrillSoundAttrs {
  static read(node: XmlElement): TrillSound {
    return {
      startNote: attr(node, 'start-note') as TrillSound['startNote'],
      trillStep: attr(node, 'trill-step') as TrillSound['trillStep'],
      twoNoteTurn: attr(node, 'two-note-turn') as TrillSound['twoNoteTurn'],
      accelerate: attr(node, 'accelerate') as YesNo | undefined,
      beats: num(node, 'beats'),
      secondBeat: num(node, 'second-beat'),
      lastBeat: num(node, 'last-beat'),
    };
  }
  static attrs(t: TrillSound): Attrs {
    return {
      'start-note': t.startNote,
      'trill-step': t.trillStep,
      'two-note-turn': t.twoNoteTurn,
      accelerate: t.accelerate,
      beats: t.beats,
      'second-beat': t.secondBeat,
      'last-beat': t.lastBeat,
    };
  }
}

/** @see musicxml.xsd attributeGroup "bend-sound". */
export class BendSoundAttrs {
  static read(node: XmlElement): BendSound {
    return {
      accelerate: attr(node, 'accelerate') as YesNo | undefined,
      beats: num(node, 'beats'),
      firstBeat: num(node, 'first-beat'),
      lastBeat: num(node, 'last-beat'),
    };
  }
  static attrs(b: BendSound): Attrs {
    return { accelerate: b.accelerate, beats: b.beats, 'first-beat': b.firstBeat, 'last-beat': b.lastBeat };
  }
}

/** @see musicxml.xsd attributeGroup "bezier". */
export class BezierAttrs {
  static read(node: XmlElement): Bezier {
    return {
      bezierX: num(node, 'bezier-x'),
      bezierY: num(node, 'bezier-y'),
      bezierX2: num(node, 'bezier-x2'),
      bezierY2: num(node, 'bezier-y2'),
      bezierOffset: num(node, 'bezier-offset'),
      bezierOffset2: num(node, 'bezier-offset2'),
    };
  }
  static attrs(b: Bezier): Attrs {
    return {
      'bezier-x': b.bezierX,
      'bezier-y': b.bezierY,
      'bezier-x2': b.bezierX2,
      'bezier-y2': b.bezierY2,
      'bezier-offset': b.bezierOffset,
      'bezier-offset2': b.bezierOffset2,
    };
  }
}

/** position + font + color. */
export class PrintStyleAttrs {
  static read(node: XmlElement): PrintStyle {
    return { ...PositionAttrs.read(node), ...FontAttrs.read(node), ...ColorAttrs.read(node) };
  }
  static attrs(p: PrintStyle): Attrs {
    return { ...PositionAttrs.attrs(p), ...FontAttrs.attrs(p), ...ColorAttrs.attrs(p) };
  }
}

/** print-style + halign + valign. */
export class PrintStyleAlignAttrs {
  static read(node: XmlElement): PrintStyleAlign {
    return {
      ...PrintStyleAttrs.read(node),
      halign: asEnum(LeftCenterRight, attr(node, 'halign')),
      valign: asEnum(Valign, attr(node, 'valign')),
    };
  }
  static attrs(p: PrintStyleAlign): Attrs {
    return { ...PrintStyleAttrs.attrs(p), halign: p.halign, valign: p.valign };
  }
}

/** Number or the literal 'normal' (letter-spacing / line-height). */
function numberOrNormal(v: string | undefined): number | 'normal' | undefined {
  if (v === undefined) return undefined;
  return v === 'normal' ? 'normal' : Number(v);
}

/** print-style-align + justify + text-decoration + rotation/spacing/dir/enclosure/lang/space. */
export class TextFormattingAttrs {
  static read(node: XmlElement): TextFormatting {
    const underline = num(node, 'underline') as NumberOfLines | undefined;
    const overline = num(node, 'overline') as NumberOfLines | undefined;
    const lineThrough = num(node, 'line-through') as NumberOfLines | undefined;
    const hasDecoration = underline !== undefined || overline !== undefined || lineThrough !== undefined;
    return {
      ...PrintStyleAlignAttrs.read(node),
      justify: asEnum(LeftCenterRight, attr(node, 'justify')),
      textDecoration: hasDecoration ? { underline, overline, lineThrough } : undefined,
      textRotation: num(node, 'rotation'),
      letterSpacing: numberOrNormal(attr(node, 'letter-spacing')),
      lineHeight: numberOrNormal(attr(node, 'line-height')),
      lang: attr(node, 'xml:lang'),
      space: attr(node, 'xml:space') as TextFormatting['space'],
      dir: asEnum(TextDirection, attr(node, 'dir')),
      enclosure: asEnum(EnclosureShape, attr(node, 'enclosure')),
    };
  }
  static attrs(t: TextFormatting): Attrs {
    return {
      ...PrintStyleAlignAttrs.attrs(t),
      justify: t.justify,
      underline: t.textDecoration?.underline,
      overline: t.textDecoration?.overline,
      'line-through': t.textDecoration?.lineThrough,
      rotation: t.textRotation,
      'letter-spacing': t.letterSpacing,
      'line-height': t.lineHeight,
      'xml:lang': t.lang,
      'xml:space': t.space,
      dir: t.dir,
      enclosure: t.enclosure,
    };
  }
}
