/**
 * `<part-list>` model class — the typed model AND its editing API in one place.
 *
 * Holds the ordered `items` (score-parts interleaved with part-group start/stop
 * boundaries) as the source of truth; `scoreParts` / `partGroups` are derived
 * flat views. Every editing method is shallow-immutable: it returns a NEW
 * `PartList`, so a large score's note data is never re-copied on an edit.
 *
 * Part `<part>` bodies live in `ScorePartwise.parts` (siblings of the part-list,
 * not inside it). Structural edits that add/remove score-parts therefore can't
 * touch bodies directly — call {@link PartList.reconcileBodies} afterwards to
 * drop orphaned bodies and add an empty body for any new part.
 *
 * @see https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/part-list/
 */

import { ClefSign, PartGroupType } from '../enums';
import type { GroupBarlineValue, GroupSymbolValue } from '../enums';
import { allChildren, attr, childrenOf, el, elementText, tagOf, textEl, type XmlElement } from '../../xml/xml-element';
import { ColorAttrs, PositionAttrs } from '../common/attribute-groups';
import { GroupName } from '../common/group-name';
import { NameDisplay } from '../common/name-display';
import { ScorePart } from './score-part';
import type { Part } from '../part';
import type { PartGroup, PartListItem } from '../score';

/** A matched part-group start/stop pair with a stable document-order id. */
export interface PartListGroupSpan {
  /** Stable id assigned per start in document order (g1, g2…). */
  groupId: string;
  /** Index of the start boundary in `items`. */
  startIndex: number;
  /** Index of the stop boundary in `items`. */
  stopIndex: number;
}

/** Parts to delete (by id) and/or groups to delete (by groupId). */
export interface PartListDeletion {
  partIds?: string[];
  groupIds?: string[];
}

/** Options for {@link PartList.addScorePart}. */
export interface AddScorePartOptions {
  /** Part id to use; auto-generated (P1, P2…) when omitted or already taken. */
  id?: string;
  /** Display name for `<part-name>`; defaults to the id. */
  name?: string;
}

/** The part-list identifies the different musical parts in this document. Each part has an ID that is used later within the musical data. Since parts may be encoded separately and combined later, identification elements are present at both the score and score-part levels. There must be at least one score-part, combined as desired with part-group elements that indicate braces and brackets. Parts are ordered from top to bottom in a score based on the order in which they appear in the part-list. */
export class PartList {
  /** Ordered part-list content (source of truth). */
  readonly items: PartListItem[];
  /** Flat score-parts view in document order (derived from `items`). */
  readonly scoreParts: ScorePart[];
  /** Flat part-group boundaries view in document order (derived from `items`). */
  readonly partGroups: PartGroup[];

  constructor(items: PartListItem[] = []) {
    this.items = items;
    this.scoreParts = items.flatMap((i) => (i.kind === 'score-part' ? [i.scorePart] : []));
    this.partGroups = items.flatMap((i) => (i.kind === 'part-group' ? [i.partGroup] : []));
  }

  /** Builds a flat (group-less, or groups-then-parts) part-list from flat arrays. */
  static fromScoreParts(scoreParts: ScorePart[], partGroups: PartGroup[] = []): PartList {
    return new PartList([
      ...partGroups.map((partGroup): PartListItem => ({ kind: 'part-group', partGroup })),
      ...scoreParts.map((scorePart): PartListItem => ({ kind: 'score-part', scorePart })),
    ]);
  }

  /**
   * Pairs each part-group start with its matching stop and assigns stable ids
   * (g1, g2… in start order), so callers can address a whole group.
   */
  /**
   * Pairs each part-group start with its matching stop and assigns stable ids
   * (g1, g2… in start order), so callers can address a whole group.
   */
  static groupSpans(partList: PartList): PartListGroupSpan[] {
    const spans: PartListGroupSpan[] = [];
    const stack: { groupId: string; startIndex: number }[] = [];
    let counter = 0;
    partList.items.forEach((item, index) => {
      if (item.kind !== 'part-group') return;
      if (item.partGroup.type === PartGroupType.Stop) {
        const open = stack.pop();
        if (open) spans.push({ groupId: open.groupId, startIndex: open.startIndex, stopIndex: index });
      } else {
        counter += 1;
        stack.push({ groupId: `g${counter}`, startIndex: index });
      }
    });
    return spans;
  }

  /**
   * Adds a new empty part-group (start/stop pair containing no parts) at the end
   * of the part-list, numbered just above the highest existing group.
   */
  static addEmptyGroup(partList: PartList, name = 'New Group'): PartList {
    const number = String(PartList.nextGroupNumber(partList));
    return new PartList([
      ...partList.items,
      { kind: 'part-group', partGroup: { type: PartGroupType.Start, number, groupName: new GroupName({ value: name }) } },
      { kind: 'part-group', partGroup: { type: PartGroupType.Stop, number } },
    ]);
  }

  /**
   * Wraps the given score-parts in a new part-group placed where the first of
   * them currently sits. The selected parts are gathered (in document order)
   * inside a fresh start/stop pair numbered just above the highest existing
   * group; every other item keeps its position. No-op (same instance) when
   * fewer than one of the ids matches.
   */
  static groupParts(partList: PartList, partIds: string[], name = 'New Group'): PartList {
    const idSet = new Set(partIds);
    const selectedItems = partList.items.filter(
      (item): item is Extract<PartListItem, { kind: 'score-part' }> => item.kind === 'score-part' && idSet.has(item.scorePart.id),
    );
    if (selectedItems.length === 0) return partList;

    const firstIndex = partList.items.findIndex((item) => item.kind === 'score-part' && idSet.has(item.scorePart.id));
    const number = String(PartList.nextGroupNumber(partList));
    const next: PartListItem[] = [];
    partList.items.forEach((item, index) => {
      if (index === firstIndex) {
        next.push(
          { kind: 'part-group', partGroup: { type: PartGroupType.Start, number, groupName: new GroupName({ value: name }) } },
          ...selectedItems,
          { kind: 'part-group', partGroup: { type: PartGroupType.Stop, number } },
        );
      }
      if (item.kind === 'score-part' && idSet.has(item.scorePart.id)) return; // moved into the group
      next.push(item);
    });
    return new PartList(next);
  }

  /**
   * Adds a new score-part entry at the end of the part-list. Call
   * {@link PartList.reconcileBodies} afterwards to create its `<part>` body.
   */
  static addScorePart(partList: PartList, options: AddScorePartOptions = {}): PartList {
    const existingIds = new Set(partList.scoreParts.map((sp) => sp.id));
    const id = options.id && !existingIds.has(options.id) ? options.id : PartList.nextPartId(existingIds);
    const scorePart: ScorePart = { id, partName: { value: options.name ?? id } };
    return new PartList([...partList.items, { kind: 'score-part', scorePart }]);
  }

  /** Renames a score-part (updates its `<part-name>`). No-op for an unknown id. */
  static renameScorePart(partList: PartList, partId: string, name: string): PartList {
    let changed = false;
    const next = partList.items.map((item): PartListItem => {
      if (item.kind === 'score-part' && item.scorePart.id === partId) {
        changed = true;
        return { kind: 'score-part', scorePart: { ...item.scorePart, partName: { ...item.scorePart.partName, value: name } } };
      }
      return item;
    });
    return changed ? new PartList(next) : partList;
  }

  /** Renames a part-group (updates/sets its `<group-name>`). No-op for an unknown id. */
  static renameGroup(partList: PartList, groupId: string, name: string): PartList {
    const span = PartList.groupSpans(partList).find((s) => s.groupId === groupId);
    if (!span) return partList;
    const next = partList.items.map((item, index): PartListItem => {
      if (index === span.startIndex && item.kind === 'part-group') {
        return { kind: 'part-group', partGroup: { ...item.partGroup, groupName: new GroupName({ ...item.partGroup.groupName, value: name }) } };
      }
      return item;
    });
    return new PartList(next);
  }

  /**
   * Deletes parts and/or groups. Each part id removes its score-part entry; each
   * group id removes the whole group span (start…stop) and every score-part it
   * contains. No-op when nothing matched. Call {@link PartList.reconcileBodies}
   * afterwards to drop the deleted parts' `<part>` bodies.
   */
  static delete(partList: PartList, deletion: PartListDeletion): PartList {
    const spans = PartList.groupSpans(partList);
    const removeIndices = new Set<number>();

    partList.items.forEach((item, index) => {
      if (item.kind === 'score-part' && deletion.partIds?.includes(item.scorePart.id)) {
        removeIndices.add(index);
      }
    });

    for (const groupId of deletion.groupIds ?? []) {
      const span = spans.find((s) => s.groupId === groupId);
      if (!span) continue;
      for (let i = span.startIndex; i <= span.stopIndex; i++) removeIndices.add(i);
    }

    if (removeIndices.size === 0) return partList;
    return new PartList(partList.items.filter((_, index) => !removeIndices.has(index)));
  }

  /**
   * Applies `update` to the score-part with `partId` and returns a new PartList
   * (shallow-immutable, like every editing method). The updater receives the
   * current score-part and returns the replacement — spread-and-override for
   * field edits (name, abbreviation, instruments, MIDI…). The part `id` must be
   * preserved by the updater; it links the entry to its `<part>` body.
   * No-op (same instance) for an unknown id.
   */
  static updateScorePart(partList: PartList, partId: string, update: (scorePart: ScorePart) => ScorePart): PartList {
    let changed = false;
    const next = partList.items.map((item): PartListItem => {
      if (item.kind === 'score-part' && item.scorePart.id === partId) {
        changed = true;
        return { kind: 'score-part', scorePart: update(item.scorePart) };
      }
      return item;
    });
    return changed ? new PartList(next) : partList;
  }

  /**
   * Moves a score-part one step earlier (`up`) or later (`down`) in the
   * part-list. In the ordered `items` representation this is a swap with the
   * adjacent item; swapping over a part-group boundary is exactly how a part
   * enters or leaves that group:
   * - over a sibling score-part → reorders the two parts;
   * - over a group `stop` going up (or `start` going down) → enters the group;
   * - over a group `start` going up (or `stop` going down) → leaves the group.
   * No-op (same instance) at the list edge or for an unknown id. Call
   * {@link PartList.reconcileBodies} afterwards to realign `<part>` body order.
   */
  static movePart(partList: PartList, partId: string, direction: 'up' | 'down'): PartList {
    const index = partList.items.findIndex((i) => i.kind === 'score-part' && i.scorePart.id === partId);
    if (index < 0) return partList;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= partList.items.length) return partList;
    const next = [...partList.items];
    [next[index], next[target]] = [next[target], next[index]];
    return new PartList(next);
  }

  /**
   * Moves a whole part-group span (start…stop, including everything inside) one
   * step earlier (`up`) or later (`down`). The adjacent item hops over the span
   * as a block, which mirrors {@link PartList.movePart}'s boundary semantics:
   * a neighbouring score-part swaps sides with the group, while a neighbouring
   * group boundary makes the span enter or leave that group. Nesting stays
   * valid because the span itself is never split. No-op (same instance) at the
   * list edge or for an unknown group id.
   */
  static moveGroup(partList: PartList, groupId: string, direction: 'up' | 'down'): PartList {
    const span = PartList.groupSpans(partList).find((s) => s.groupId === groupId);
    if (!span) return partList;
    const { startIndex, stopIndex } = span;
    const next = [...partList.items];
    if (direction === 'up') {
      if (startIndex === 0) return partList;
      const [neighbour] = next.splice(startIndex - 1, 1);
      next.splice(stopIndex, 0, neighbour); // indices shifted left by the splice
    } else {
      if (stopIndex === next.length - 1) return partList;
      const [neighbour] = next.splice(stopIndex + 1, 1);
      next.splice(startIndex, 0, neighbour);
    }
    return new PartList(next);
  }

  /**
   * Reconciles `<part>` bodies to this part-list: keeps each part body whose id
   * still has a score-part (in part-list order), drops orphans, and creates a
   * minimal empty body for any score-part that lacks one.
   */
  static reconcileBodies(parts: Part[], partList: PartList): Part[] {
    const byId = new Map(parts.map((p) => [p.id, p]));
    return partList.scoreParts.map((sp) => byId.get(sp.id) ?? PartList.emptyPart(sp.id));
  }

  /** A minimal valid one-measure part body (empty 4/4 measure), so a new part renders. */
  static emptyPart(id: string): Part {
    return {
      id,
      measures: [
        {
          number: '1',
          content: [
            {
              type: 'attributes',
              data: {
                divisions: 1,
                keys: [{ fifths: 0 }],
                times: [{ beats: ['4'], beatTypes: ['4'] }],
                clefs: [{ sign: ClefSign.G, line: 2 }],
              },
            },
            { type: 'note', data: { rest: { measure: 'yes' }, duration: 4 } },
          ],
        },
      ],
    };
  }

  private static nextGroupNumber(partList: PartList): number {
    let max = 0;
    for (const group of partList.partGroups) {
      const n = Number(group.number);
      if (Number.isFinite(n) && n > max) max = n;
    }
    return max + 1;
  }

  private static nextPartId(existing: Set<string>): string {
    let n = existing.size + 1;
    let id = `P${n}`;
    while (existing.has(id)) id = `P${++n}`;
    return id;
  }

  /**
   * Builds the `<part-list>` preserve-order node, covering the full XSD content
   * models for part-group and score-part (lossless round-trip).
   * @see musicxml.xsd "part-list" / "part-group" / "score-part"
   */
  static toXmlElement(partList: PartList): XmlElement {
    const items =
      partList.items && partList.items.length > 0
        ? partList.items
        : partList.scoreParts.map((scorePart) => ({ kind: 'score-part' as const, scorePart }));
    const children = items.map((item) =>
      item.kind === 'score-part' ? ScorePart.toXmlElement(item.scorePart) : partGroupNode(item.partGroup),
    );
    return el('part-list', children);
  }

  /** Parse a `<part-list>` node into an ordered PartList (score-part / part-group). */
  static fromXmlElement(node: XmlElement): PartList {
    const items: PartListItem[] = [];
    for (const child of allChildren(node)) {
      const tag = tagOf(child);
      if (tag === 'score-part') items.push({ kind: 'score-part', scorePart: ScorePart.fromXmlElement(child) });
      else if (tag === 'part-group') items.push({ kind: 'part-group', partGroup: partGroupFrom(child) });
    }
    return new PartList(items);
  }
}

function partGroupFrom(node: XmlElement): PartGroup {
  const one = (tag: string) => childrenOf(node, tag)[0];
  const symbol = one('group-symbol');
  const barline = one('group-barline');
  const gName = one('group-name');
  const gNameDisplay = one('group-name-display');
  const gAbbr = one('group-abbreviation');
  const gAbbrDisplay = one('group-abbreviation-display');
  return {
    type: (attr(node, 'type') as PartGroupType) ?? PartGroupType.Start,
    number: attr(node, 'number'),
    groupName: gName ? GroupName.fromXmlElement(gName) : undefined,
    groupNameDisplay: gNameDisplay ? NameDisplay.fromXmlElement(gNameDisplay) : undefined,
    groupAbbreviation: gAbbr ? GroupName.fromXmlElement(gAbbr) : undefined,
    groupAbbreviationDisplay: gAbbrDisplay ? NameDisplay.fromXmlElement(gAbbrDisplay) : undefined,
    groupSymbol: symbol
      ? { value: (elementText(symbol) ?? 'none') as GroupSymbolValue, ...PositionAttrs.read(symbol), ...ColorAttrs.read(symbol) }
      : undefined,
    groupBarline: barline
      ? { value: (elementText(barline) ?? 'yes') as GroupBarlineValue, ...ColorAttrs.read(barline) }
      : undefined,
    groupTime: childrenOf(node, 'group-time').length > 0 || undefined,
  };
}

function partGroupNode(group: PartGroup): XmlElement {
  if (group.type === PartGroupType.Stop) {
    return el('part-group', [], { type: group.type, number: group.number });
  }
  const c: XmlElement[] = [];
  if (group.groupName) c.push(GroupName.toXmlElement(group.groupName, 'group-name'));
  if (group.groupNameDisplay) c.push(NameDisplay.toXmlElement(group.groupNameDisplay, 'group-name-display'));
  if (group.groupAbbreviation) c.push(GroupName.toXmlElement(group.groupAbbreviation, 'group-abbreviation'));
  if (group.groupAbbreviationDisplay) c.push(NameDisplay.toXmlElement(group.groupAbbreviationDisplay, 'group-abbreviation-display'));
  if (group.groupSymbol) c.push(textEl('group-symbol', group.groupSymbol.value));
  if (group.groupBarline) c.push(textEl('group-barline', group.groupBarline.value));
  if (group.groupTime) c.push(el('group-time', []));
  return el('part-group', c, { type: group.type, number: group.number });
}

