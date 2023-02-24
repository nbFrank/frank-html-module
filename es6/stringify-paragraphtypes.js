const { str2xml } = require("docxtemplater").DocUtils;
const columnReplacer = "CCOOLLUUMMNN";
const { merge, map } = require("lodash");
function stringifyParagraphTypes(paragraphTypes) {
	const parsedParagraphTypes = paragraphTypes.map(function (paragraphType) {
		const xml = str2xml(paragraphType.replace(/:/g, columnReplacer));
		const node = xml.childNodes[0];
		const parsed = {
			name: node.tagName.replace(columnReplacer, ":"),
			attributes: {},
		};
		for (let i = 0, len = node.attributes.length; i < len; i++) {
			const attr = node.attributes[i];
			parsed.attributes[attr.name.replace(columnReplacer, ":")] =
				attr.value.replace(columnReplacer, ":");
		}
		return parsed;
	});
	const result = parsedParagraphTypes.reduce(function (
		result,
		{ name, attributes }
	) {
		if (!result[name]) {
			result[name] = attributes;
		} else {
			result[name] = merge({}, result[name], attributes);
		}
		return result;
	},
	{});

	const s = map(result, function (attributes, key) {
		const stringifiedAttributes = map(
			attributes,
			function (attributeVal, attributeKey) {
				return `${attributeKey}="${attributeVal}"`;
			}
		).join(" ");
		return `<${key} ${stringifiedAttributes}/>`;
	})
		.sort()
		.join("");
	return s;
}

module.exports = stringifyParagraphTypes;
