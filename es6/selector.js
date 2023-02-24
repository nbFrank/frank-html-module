const parsedSelectors = {};
const { Errors } = require("docxtemplater");
const selectorParser = require("css-what/lib/parse.js").default;
const { getClassNames } = require("./html-utils.js");

function parseSelector(selector) {
	let mem = parsedSelectors[selector];
	if (mem) {
		if (mem.err) {
			throw mem.err;
		}
		return mem.result;
	}
	parsedSelectors[selector] = {};
	mem = parsedSelectors[selector];
	try {
		mem.result = selectorParser(selector);
		return mem.result;
	} catch (e) {
		const err = new Errors.RenderingError("Selector cannot be parsed");
		err.properties = {
			explanation: "The selector contains unsupported features",
			selector,
			id: "css_selector_parse_error",
		};
		mem.err = err;
		throw err;
	}
}

function classMatcher(element, test) {
	const classNames = getClassNames(element);
	if (classNames.indexOf(test.value) !== -1) {
		return true;
	}
	return false;
}

function getFirstSiblingTag(element) {
	const siblings = element.parent.children;
	for (let i = 0; i < siblings.length; i++) {
		const candidate = siblings[i];
		if (candidate.type === "tag") {
			return candidate;
		}
	}
	return null;
}

function getNthSiblingTag(element, n) {
	let current = 0;
	const siblings = element.parent.children;
	for (let i = 0; i < siblings.length; i++) {
		const candidate = siblings[i];
		if (candidate.type === "tag") {
			current++;
			if (current === n) {
				return candidate;
			}
		}
	}
	return null;
}

function getLastSiblingTag(element) {
	const siblings = element.parent.children;
	for (let i = siblings.length - 1; i >= 0; i--) {
		const candidate = siblings[i];
		if (candidate.type === "tag") {
			return candidate;
		}
	}
	return null;
}

function isLastChild(element) {
	if (!element.parent) {
		return false;
	}
	return getLastSiblingTag(element) === element;
}

function isFirstChild(element) {
	if (!element.parent) {
		return false;
	}
	return getFirstSiblingTag(element) === element;
}

function isNthChild(element, n) {
	if (!element.parent) {
		return false;
	}
	return getNthSiblingTag(element, n) === element;
}

function attributeMatcher(element, test) {
	if (test.name === "class") {
		return classMatcher(element, test);
	}
	if (test.type === "attribute" && test.action === "equals") {
		return element.attribs && test.value === element.attribs[test.name];
	}
	if (test.type === "attribute" && test.action === "exists") {
		return test.name in element.attribs;
	}
	return false;
}

function nameMatcher(element, test) {
	return element.name === test.name;
}
function adjacentMatcher(element, rule, i) {
	let prev = element.prev;
	while (prev) {
		if (prev.type === "tag") {
			return matchesRule(prev, rule.slice(0, i));
		}
		prev = prev.prev;
	}
	return false;
}

function pseudoMatcher(element, test) {
	if (test.name === "last-child") {
		return isLastChild(element);
	}
	if (test.name === "first-child") {
		return isFirstChild(element);
	}
	if (test.name === "nth-child") {
		return isNthChild(element, parseInt(test.data, 10));
	}
	return false;
}

function descendantMatcher(element, rule) {
	let parent = element.parent;
	while (parent) {
		if (parent.type === "root") {
			return false;
		}
		if (matchesRule(parent, rule)) {
			return true;
		}
		parent = parent.parent;
	}
	return false;
}

function matchesRule(element, rule) {
	if (!element) {
		return false;
	}
	let pass = false;
	for (let i = rule.length - 1; i >= 0; i--) {
		const test = rule[i];
		pass = false;
		switch (test.type) {
			case "pseudo":
				pass = pseudoMatcher(element, test);
				break;
			case "attribute":
				pass = attributeMatcher(element, test);
				break;
			case "tag":
				pass = nameMatcher(element, test);
				break;
			case "child":
				return matchesRule(element.parent, rule.slice(0, i));
			case "descendant":
				return descendantMatcher(element, rule.slice(0, i));
			case "universal":
				pass = true;
				break;
			case "adjacent":
				return adjacentMatcher(element, rule, i);
		}

		if (!pass) {
			return false;
		}
	}
	return true;
}

module.exports = {
	parseSelector,
	matchesRule,
};
