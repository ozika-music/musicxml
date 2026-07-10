/**
 * Notation curve elements: tied, slur (shared attribute groups).
 * @see musicxml.xsd "tied", "slur"
 */

import { attr, el, type XmlElement } from '../../xml/xml-element';
import { StartStopContinue, TiedType } from '../enums';
import type { AboveBelow, LineType, NumberLevel } from '../enums';
import type { Color, Divisions, Tenths } from '../common';
import {
  asEnum,
  BezierAttrs,
  ColorAttrs,
  DashedFormattingAttrs,
  LineTypeAttrs,
  PlacementAttrs,
  PositionAttrs,
} from '../common/attribute-groups';
import type { Slur as SlurShape, Tied as TiedShape } from '../note';

/** Position + line-type + dashed + bezier + color + placement, shared by tied/slur. */
function readCurveAttrs(node: XmlElement) {
  return {
    ...PositionAttrs.read(node),
    ...LineTypeAttrs.read(node),
    ...DashedFormattingAttrs.read(node),
    ...BezierAttrs.read(node),
    ...ColorAttrs.read(node),
    ...PlacementAttrs.read(node),
    number: ((): NumberLevel | undefined => {
      const n = attr(node, 'number');
      return n === undefined ? undefined : (Number(n) as NumberLevel);
    })(),
    orientation: attr(node, 'orientation') as 'over' | 'under' | undefined,
  };
}

interface CurveAttrFields {
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  lineType?: LineType;
  dashLength?: Tenths;
  spaceLength?: Tenths;
  bezierX?: Tenths;
  bezierY?: Tenths;
  bezierX2?: Tenths;
  bezierY2?: Tenths;
  bezierOffset?: Divisions;
  bezierOffset2?: Divisions;
  color?: Color;
  placement?: AboveBelow;
  number?: NumberLevel;
  orientation?: 'over' | 'under';
}

function curveAttrs(c: CurveAttrFields & { type: string; id?: string }) {
  return {
    type: c.type,
    number: c.number,
    ...PositionAttrs.attrs(c),
    ...PlacementAttrs.attrs(c),
    ...LineTypeAttrs.attrs(c),
    ...DashedFormattingAttrs.attrs(c),
    ...BezierAttrs.attrs(c),
    ...ColorAttrs.attrs(c),
    orientation: c.orientation,
    id: c.id,
  };
}

/**
 * The tied element represents the notated tie. The tie element represents the tie sound. The number attribute is rarely needed to disambiguate ties, since note pitches will usually suffice. The attribute is implied rather than defaulting to 1 as with most elements. It is available for use in more complex tied notation situations. Ties that join two notes of the same pitch together should be represented with a tied element on the first note with type="start" and a tied element on the second note with type="stop". This can also be done if the two notes being tied are enharmonically equivalent, but have different step values. It is not recommended to use tied elements to join two notes with enharmonically inequivalent pitches. Ties that indicate that an instrument should be undamped are specified with a single tied element with type="let-ring". Ties that are visually attached to only one note, other than undamped ties, should be specified with two tied elements on the same note, first type="start" then type="stop". This can be used to represent ties into or out of repeated sections or codas.
 * @see musicxml.xsd "tied".
 */
export class Tied implements TiedShape, CurveAttrFields {
  type: TiedType = TiedType.Start;
  id?: string;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  lineType?: LineType;
  dashLength?: Tenths;
  spaceLength?: Tenths;
  bezierX?: Tenths;
  bezierY?: Tenths;
  bezierX2?: Tenths;
  bezierY2?: Tenths;
  bezierOffset?: Divisions;
  bezierOffset2?: Divisions;
  color?: Color;
  placement?: AboveBelow;
  number?: NumberLevel;
  orientation?: 'over' | 'under';

  constructor(init?: Partial<Tied>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Tied {
    return new Tied({
      type: asEnum(TiedType, attr(node, 'type')) ?? TiedType.Start,
      id: attr(node, 'id'),
      ...readCurveAttrs(node),
    });
  }

  static toXmlElement(t: Tied): XmlElement {
    return el('tied', [], curveAttrs(t));
  }
}

/**
 * Slur types are empty. Most slurs are represented with two elements: one with a start type, and one with a stop type. Slurs can add more elements using a continue type. This is typically used to specify the formatting of cross-system slurs, or to specify the shape of very complex slurs.
 * @see musicxml.xsd "slur".
 */
export class Slur implements SlurShape, CurveAttrFields {
  type: StartStopContinue = StartStopContinue.Start;
  id?: string;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  lineType?: LineType;
  dashLength?: Tenths;
  spaceLength?: Tenths;
  bezierX?: Tenths;
  bezierY?: Tenths;
  bezierX2?: Tenths;
  bezierY2?: Tenths;
  bezierOffset?: Divisions;
  bezierOffset2?: Divisions;
  color?: Color;
  placement?: AboveBelow;
  number?: NumberLevel;
  orientation?: 'over' | 'under';

  constructor(init?: Partial<Slur>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Slur {
    return new Slur({
      type: asEnum(StartStopContinue, attr(node, 'type')) ?? StartStopContinue.Start,
      id: attr(node, 'id'),
      ...readCurveAttrs(node),
    });
  }

  static toXmlElement(s: Slur): XmlElement {
    return el('slur', [], curveAttrs(s));
  }
}
