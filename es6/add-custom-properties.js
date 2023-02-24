const { parseSelector, matchesRule } = require("./selector.js");
const { getClassNames } = require("./html-utils.js");

module.exports = function addCustomProperties(element, transformer) {
	if (element.implicit) {
		return;
	}
	let htmlStyle = "";
	if (transformer.tagStyleSheet) {
		const rules = transformer.tagStyleSheet.stylesheet.rules || [];
		rules.forEach(function ({ selectors, declarations, type }) {
			if (type !== "rule") {
				return;
			}
			selectors.forEach(function (selector) {
				const rules = parseSelector(selector);
				if (rules.some(matchesRule.bind(null, element))) {
					declarations.forEach(function (declaration) {
						htmlStyle += `${declaration.property}: ${declaration.value};`;
					});
				}
			});
		});
	}
	if (transformer.styleSheet) {
		const rules = transformer.styleSheet.stylesheet.rules || [];
		rules.forEach(function ({ selectors, declarations, type }) {
			if (type !== "rule") {
				return;
			}
			selectors.forEach(function (selector) {
				const rules = parseSelector(selector);
				if (rules.some(matchesRule.bind(null, element))) {
					declarations.forEach(function (declaration) {
						htmlStyle += `${declaration.property}: ${declaration.value};`;
					});
				}
			});
		});
	}

	element.customProperties = transformer.elementCustomizer({
		classNames: element.attribs ? getClassNames(element) : [],
		...element,
		styleDefaults: transformer.styleDefaults,
		styleIds: transformer.styleIds,
		part: transformer.part,
		matches: (selector) => {
			const rules = parseSelector(selector);
			if (rules.some(matchesRule.bind(null, element))) {
				return true;
			}
		},
	});

	if (htmlStyle.length > 0) {
		element.customProperties ||= {};
		element.customProperties.htmlStyle =
			htmlStyle + (element.customProperties.htmlStyle || "");
	}
};
