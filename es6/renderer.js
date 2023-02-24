const { stripRunsWhiteSpace } = require("./whitespace.js");
const { get, cloneDeep } = require("lodash");
const { addParagraphStyle } = require("./style.js");

const stringifyParagraphTypes = require("./stringify-paragraphtypes.js");

function surroundParagraph({
	content,
	element,
	transformer,
	customProperties,
	paragraphRunProperties,
}) {
	const { name } = element;
	const tr = transformer.tagRepository;

	function addPStyle(paragraphTypes) {
		let pStyle = get(element, "customProperties.pStyle");
		if (!pStyle) {
			if (name === "p") {
				for (let i = customProperties.length - 1; i >= 0; i--) {
					const { tag, value } = customProperties[i];
					if (tag === "w:pStyle") {
						paragraphTypes.push(value);
						return paragraphTypes;
					}
				}
			}
			pStyle = tr.getPStyle(name);
		}
		if (pStyle) {
			paragraphTypes.push(`<w:pStyle w:val="${pStyle}"/>`);
		}
		return paragraphTypes;
	}
	const { isBlock, getXmlProperties } = tr;
	const xmlProperties = getXmlProperties(name);
	if (xmlProperties != null) {
		throw new Error(
			`Tag '${name}' is of type inline, it is not supported as the root of a block-scoped tag`
		);
	}
	if (!isBlock(name)) {
		throw new Error(`Tag '${name}' not supported as a block element`);
	}
	element.paragraphTypes = element.paragraphTypes.concat(
		addPStyle(cloneDeep(tr.getProps(name)))
	);

	addParagraphStyle({ element, transformer, customProperties });

	(customProperties || []).forEach(function ({ tag, value }) {
		if (["w:bidi"].indexOf(tag) !== -1) {
			element.paragraphTypes.unshift(value);
		}
	});
	if (name === "p") {
		(customProperties || []).forEach(function ({ tag, value }) {
			if (["w:spacing", "w:jc", "w:ind"].indexOf(tag) !== -1) {
				element.paragraphTypes.unshift(value);
			}
		});
	}
	const parProps = stringifyParagraphTypes(element.paragraphTypes);
	let bookmark = "";
	if (element.bookmark) {
		const bmId = transformer.minBookmarkId++;
		bookmark = `<w:bookmarkStart w:id="${bmId}" w:name="${element.bookmark}"/><w:bookmarkEnd w:id="${bmId}"/>`;
	}
	let columnBreak = "";
	if (transformer.part.renderColumnBreak) {
		columnBreak = '<w:r><w:br w:type="column"/></w:r>';
		transformer.part.renderColumnBreak = false;
	}
	return `<w:p>
	${bookmark}
	<w:pPr>
		${parProps}
		${
			paragraphRunProperties.length === 0
				? "<w:rPr/>"
				: `<w:rPr>${paragraphRunProperties
						.map(function ({ value }) {
							return value;
						})
						.join("")}</w:rPr>`
		}
	</w:pPr>
	${columnBreak}
	${content}
	</w:p>`;
}

const corruptCharacters = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;
// 00    NUL '\0' (null character)
// 01    SOH (start of heading)
// 02    STX (start of text)
// 03    ETX (end of text)
// 04    EOT (end of transmission)
// 05    ENQ (enquiry)
// 06    ACK (acknowledge)
// 07    BEL '\a' (bell)
// 08    BS  '\b' (backspace)
// 0B    VT  '\v' (vertical tab)
// 0C    FF  '\f' (form feed)
// 0E    SO  (shift out)
// 0F    SI  (shift in)
// 10    DLE (data link escape)
// 11    DC1 (device control 1)
// 12    DC2 (device control 2)
// 13    DC3 (device control 3)
// 14    DC4 (device control 4)
// 15    NAK (negative ack.)
// 16    SYN (synchronous idle)
// 17    ETB (end of trans. blk)
// 18    CAN (cancel)
// 19    EM  (end of medium)
// 1A    SUB (substitute)
// 1B    ESC (escape)
// 1C    FS  (file separator)
// 1D    GS  (group separator)
// 1E    RS  (record separator)
// 1F    US  (unit separator)
function stripEscapeChars(str) {
	return str.replace(corruptCharacters, "");
}

module.exports = function paragraphsToText({
	paragraphs,
	transformer,
	customProperties,
	paragraphRunProperties,
}) {
	return paragraphs
		.map(function (paragraph) {
			if (typeof paragraph.data === "string") {
				return paragraph.data;
			}
			const runs = paragraph.data;
			const runsText = stripEscapeChars(stripRunsWhiteSpace(runs));
			return surroundParagraph({
				content: runsText,
				element: paragraph.element,
				paragraphRunProperties,
				transformer,
				customProperties,
			});
		})
		.join("");
};
