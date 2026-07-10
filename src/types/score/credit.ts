/**
 * credit — titling/credit text on a score page.
 *
 * @see musicxml.xsd complexType "credit"
 *   credit-type*, link*, bookmark*, (credit-image | (credit-words | credit-symbol)+)
 *   @page, @id
 *
 * Covered: @page, @id, credit-type*, credit-words* (full text-formatting via
 * TextFormattingAttrs). NOT yet serialized: credit-image / credit-symbol / link /
 * bookmark (await ImageSource / SymbolFormatting attribute groups) — the legacy
 * serializer also dropped these, so no regression. Fields are retained on the
 * model so callers that set them are not broken.
 */

import { attr, childrenOf, el, elementText, type XmlElement } from '../../xml/xml-element';
import { TextFormattingAttrs } from '../common/attribute-groups';
import type { Bookmark, LinkAttributes } from '../common';
import type { CreditImage, CreditSymbol, CreditWords } from '../score';

/** The credit type represents the appearance of the title, composer, arranger, lyricist, copyright, dedication, and other text, symbols, and graphics that commonly appear on the first page of a score. The credit-words, credit-symbol, and credit-image elements are similar to the words, symbol, and image elements for directions. However, since the credit is not part of a measure, the default-x and default-y attributes adjust the origin relative to the bottom left-hand corner of the page. The enclosure for credit-words and credit-symbol is none by default. By default, a series of credit-words and credit-symbol elements within a single credit element follow one another in sequence visually. Non-positional formatting attributes are carried over from the previous element by default. The page attribute for the credit element specifies the page number where the credit should appear. This is an integer value that starts with 1 for the first page. Its value is 1 by default. Since credits occur before the music, these page numbers do not refer to the page numbering specified by the print element's page-number attribute. The credit-type element indicates the purpose behind a credit. Multiple types of data may be combined in a single credit, so multiple elements may be used. Standard values include page number, title, subtitle, composer, arranger, lyricist, rights, and part name. */
export class Credit {
  page?: number;
  id?: string;
  creditTypes?: string[];
  links?: LinkAttributes[];
  bookmarks?: Bookmark[];
  creditImage?: CreditImage;
  creditWords?: CreditWords[];
  creditSymbols?: CreditSymbol[];

  constructor(init?: Partial<Credit>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Credit {
    const creditTypes = childrenOf(node, 'credit-type').map((t) => elementText(t) ?? '');
    const creditWords = childrenOf(node, 'credit-words').map(
      (w): CreditWords => ({ value: elementText(w) ?? '', id: attr(w, 'id'), ...TextFormattingAttrs.read(w) }),
    );
    const page = attr(node, 'page');
    return new Credit({
      page: page === undefined ? undefined : Number(page),
      id: attr(node, 'id'),
      creditTypes: creditTypes.length ? creditTypes : undefined,
      creditWords: creditWords.length ? creditWords : undefined,
    });
  }

  static toXmlElement(credit: Credit): XmlElement {
    const c: XmlElement[] = [];
    for (const ct of credit.creditTypes ?? []) c.push(el('credit-type', [{ '#text': ct }]));
    for (const cw of credit.creditWords ?? []) {
      c.push(el('credit-words', [{ '#text': cw.value }], { ...TextFormattingAttrs.attrs(cw), id: cw.id }));
    }
    return el('credit', c, { page: credit.page, id: credit.id });
  }
}
