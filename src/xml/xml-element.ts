/**
 * Shared fast-xml-parser preserve-order node layer.
 *
 * One home for the node type, the parser/builder singletons, and the small
 * helpers used by every class's `fromXmlElement` / `toXmlElement`. Parsing keeps
 * document order (`preserveOrder`) so child sequences round-trip faithfully.
 */

import { XMLParser } from 'fast-xml-parser';
import XMLBuilder from 'fast-xml-builder';

/**
 * A node in fast-xml-parser's `preserveOrder` representation:
 *   `{ <tag>: XmlElement[], ':@'?: { '@_<attr>': string }, '#text'?: string }`
 * Element nodes have exactly one tag key; text nodes carry only `#text`.
 */
export interface XmlElement {
  ':@'?: Record<string, string>;
  '#text'?: string | number;
  [tag: string]: XmlElement[] | Record<string, string> | string | number | undefined;
}

const PARSER = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: false,
  parseTagValue: false,
  trimValues: true,
  preserveOrder: true,
});

const BUILDER = new XMLBuilder({
  preserveOrder: true,
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  indentBy: '  ',
  suppressEmptyNode: true,
});

/** Parse an XML string into ordered nodes (with source-offset metadata). */
export function parseElements(xml: string): XmlElement[] {
  return PARSER.parse(xml) as XmlElement[];
}

/** Serialize ordered nodes back to an XML string. */
export function buildElements(nodes: XmlElement[]): string {
  return BUILDER.build(nodes);
}

/**
 * Decode raw XML bytes to a string, handling UTF-16 LE/BE and UTF-8 BOMs — use
 * this instead of a bare `TextDecoder` when the byte encoding is unknown.
 */
export function decodeXmlBytes(bytes: Uint8Array): string {
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    // UTF-16 BE → swap to LE for TextDecoder.
    const swapped = new Uint8Array(bytes.length - 2);
    for (let i = 2; i < bytes.length; i += 2) {
      swapped[i - 2] = bytes[i + 1];
      swapped[i - 1] = bytes[i];
    }
    return new TextDecoder('utf-16le').decode(swapped);
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(bytes.slice(2));
  }
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(bytes.slice(3));
  }
  return new TextDecoder('utf-8').decode(bytes);
}

/** The element's tag name (its single non-`:@`, non-`#text` key). */
export function tagOf(node: XmlElement): string {
  for (const key of Object.keys(node)) {
    if (key !== ':@' && key !== '#text') return key;
  }
  return '';
}

/** Ordered child elements of `node` with the given `tag` (empty if none). */
export function childrenOf(node: XmlElement, tag: string): XmlElement[] {
  const kids = node[tagOf(node)];
  if (!Array.isArray(kids)) return [];
  return kids.filter((k) => tagOf(k) === tag);
}

/** All ordered child elements of `node`, regardless of tag (text/attr nodes excluded). */
export function allChildren(node: XmlElement): XmlElement[] {
  const kids = node[tagOf(node)];
  if (!Array.isArray(kids)) return [];
  return kids.filter((k) => tagOf(k) !== '');
}

/** Attribute value (without the `@_` prefix), if present. */
export function attr(node: XmlElement, name: string): string | undefined {
  return node[':@']?.[`@_${name}`];
}

/** Text of the first `tag` child of `node`. */
export function textOf(node: XmlElement, tag: string): string | undefined {
  const child = childrenOf(node, tag)[0];
  return child ? elementText(child) : undefined;
}

/** The element node's own text content (preserve-order form). */
export function elementText(node: XmlElement): string | undefined {
  const kids = node[tagOf(node)];
  if (!Array.isArray(kids)) return undefined;
  for (const k of kids) {
    if (k['#text'] !== undefined) return String(k['#text']);
  }
  return undefined;
}

function cleanAttrs(map?: Record<string, string | number | undefined>): Record<string, string> | undefined {
  if (!map) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(map)) {
    if (v !== undefined && v !== null) out[`@_${k}`] = String(v);
  }
  return Object.keys(out).length ? out : undefined;
}

/** Build an element node with ordered children and optional attributes. */
export function el(
  tag: string,
  children: XmlElement[],
  attrs?: Record<string, string | number | undefined>,
): XmlElement {
  const node: XmlElement = { [tag]: children };
  const a = cleanAttrs(attrs);
  if (a) node[':@'] = a;
  return node;
}

/** Build an element node holding a single text value. */
export function textEl(
  tag: string,
  value: string | number,
  attrs?: Record<string, string | number | undefined>,
): XmlElement {
  return el(tag, [{ '#text': value }], attrs);
}
