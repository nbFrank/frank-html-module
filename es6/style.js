const cssParser = require("css/lib/parse/index.js");
const { get } = require("lodash");
const { Errors } = require("docxtemplater");
const { numberRegex, sizeRegex } = require("./regex.js");
const { toDXA, toPoint } = require("./size-converter.js");
const color = require("./color-parser.js");
const isValidColor = require("color-js").isValid;
const { getSingleAttribute } = require("./attributes.js");
const borderStyles = [
	"dotted",
	"solid",
	"dashed",
	"double",
	"outset",
	"none",
	"inset",
];

const listStyleToNumFmt = {
	"decimal-leading-zero": "decimalZero",
	decimal: "decimal",
	"lower-alpha": "lowerLetter",
	"lower-latin": "lowerLetter",
	"upper-alpha": "upperLetter",
	"upper-latin": "upperLetter",
	"lower-roman": "lowerRoman",
	"upper-roman": "upperRoman",
};

function directionHandler(values, str, functor) {
	if (values.length === 3) {
		functor({ property: str.replace("*", "top"), value: values[0] });
		functor({ property: str.replace("*", "right"), value: values[1] });
		functor({ property: str.replace("*", "left"), value: values[1] });
		functor({ property: str.replace("*", "bottom"), value: values[2] });
		return;
	}
	if (values.length === 4) {
		functor({ property: str.replace("*", "top"), value: values[0] });
		functor({ property: str.replace("*", "right"), value: values[1] });
		functor({ property: str.replace("*", "bottom"), value: values[2] });
		functor({ property: str.replace("*", "left"), value: values[3] });
		return;
	}
	if (values.length === 2) {
		functor({ property: str.replace("*", "top"), value: values[0] });
		functor({ property: str.replace("*", "bottom"), value: values[0] });
		functor({ property: str.replace("*", "right"), value: values[1] });
		functor({ property: str.replace("*", "left"), value: values[1] });
		return;
	}
	if (values.length === 1) {
		functor({ property: str.replace("*", "top"), value: values[0] });
		functor({ property: str.replace("*", "bottom"), value: values[0] });
		functor({ property: str.replace("*", "right"), value: values[0] });
		functor({ property: str.replace("*", "left"), value: values[0] });
		return;
	}
}

function getDeclarations(element, transformer, style) {
	style = style.replace(/&#58;/g, ":");
	try {
		return cssParser(`body { ${style} }`, {
			silent: transformer.ignoreCssErrors,
		}).stylesheet.rules[0].declarations;
	} catch (e) {
		const err = new Errors.RenderingError("Style for element cannot be parsed");
		err.properties = {
			explanation: `The tag ${element.name} contains invalid style properties`,
			name: element.name,
			style,
			id: "style_property_invalid",
		};
		throw err;
	}
}

function forEachStyleDeclaration(element, transformer, functor) {
	if (typeof element !== "object") {
		throw new Error(
			`Element in forEachStyleDeclaration should be an object, given ${typeof element}`
		);
	}
	const stdStyle = get(element, "attribs.style");
	const htmlStyle = get(element, "customProperties.htmlStyle");
	if (!stdStyle && !htmlStyle) {
		element.parsedStyle = [];
		return;
	}
	let declarations = [];
	if (element.parsedStyle) {
		declarations = element.parsedStyle;
	} else {
		if (stdStyle) {
			declarations = declarations.concat(
				getDeclarations(element, transformer, stdStyle)
			);
		}
		if (htmlStyle) {
			declarations = declarations.concat(
				getDeclarations(element, transformer, htmlStyle)
			);
		}
		declarations = declarations.filter(function (d) {
			return typeof d === "object";
		});
	}
	element.parsedStyle = declarations;

	// eslint-disable-next-line complexity
	declarations.forEach(function (declaration) {
		const { property, value } = declaration;
		const values = value.split(/ +/);
		if (property === "padding") {
			directionHandler(values, "padding-*", functor);
		}
		if (property === "list-style") {
			if (listStyleToNumFmt[values[0]]) {
				functor({ property: "list-style-type", value: values[0] });
			}
			if (listStyleToNumFmt[values[1]]) {
				functor({ property: "list-style-type", value: values[1] });
			}
			if (listStyleToNumFmt[values[2]]) {
				functor({ property: "list-style-type", value: values[2] });
			}
		}

		if (property === "margin") {
			directionHandler(values, "margin-*", functor);
		}
		if (property === "border-style") {
			functor({ property: "border-style", value });
			directionHandler(values, "border-*-style", functor);
		}
		if (property === "border") {
			values.forEach(function (value) {
				if (borderStyles.indexOf(value) !== -1) {
					functor({ property: "border-style", value });
					functor({ property: "border-left-style", value });
					functor({ property: "border-right-style", value });
					functor({ property: "border-top-style", value });
					functor({ property: "border-bottom-style", value });
					return;
				}
				if (sizeRegex.test(value)) {
					functor({ property: "border-left-width", value });
					functor({ property: "border-right-width", value });
					functor({ property: "border-top-width", value });
					functor({ property: "border-bottom-width", value });
					return;
				}
				if (isValidColor(value)) {
					functor({ property: "border-color", value });
					functor({ property: "border-left-color", value });
					functor({ property: "border-right-color", value });
					functor({ property: "border-top-color", value });
					functor({ property: "border-bottom-color", value });
					return;
				}
			});
			return;
		}
		if (property === "border-width") {
			directionHandler(values, "border-*-width", functor);
		}
		if (property === "border-color") {
			if (isValidColor(value)) {
				functor({ property: "border-color", value });
				functor({ property: "border-left-color", value });
				functor({ property: "border-right-color", value });
				functor({ property: "border-top-color", value });
				functor({ property: "border-bottom-color", value });
				return;
			}
		}
		if (property === "border-bottom") {
			values.forEach(function (value) {
				if (borderStyles.indexOf(value) !== -1) {
					functor({ property: "border-bottom-style", value });
					return;
				}
				if (sizeRegex.test(value)) {
					functor({ property: "border-bottom-width", value });
					return;
				}
				if (isValidColor(value)) {
					functor({ property: "border-bottom-color", value });
					return;
				}
			});
			return;
		}
		if (property === "border-right") {
			values.forEach(function (value) {
				if (borderStyles.indexOf(value) !== -1) {
					functor({ property: "border-right-style", value });
					return;
				}
				if (sizeRegex.test(value)) {
					functor({ property: "border-right-width", value });
					return;
				}
				if (isValidColor(value)) {
					functor({ property: "border-right-color", value });
					return;
				}
			});
			return;
		}
		if (property === "border-left") {
			values.forEach(function (value) {
				if (borderStyles.indexOf(value) !== -1) {
					functor({ property: "border-left-style", value });
					return;
				}
				if (sizeRegex.test(value)) {
					functor({ property: "border-left-width", value });
					return;
				}
				if (isValidColor(value)) {
					functor({ property: "border-left-color", value });
					return;
				}
			});
			return;
		}
		if (property === "border-top") {
			values.forEach(function (value) {
				if (borderStyles.indexOf(value) !== -1) {
					functor({ property: "border-top-style", value });
					return;
				}
				if (sizeRegex.test(value)) {
					functor({ property: "border-top-width", value });
					return;
				}
				if (isValidColor(value)) {
					functor({ property: "border-top-color", value });
					return;
				}
			});
			return;
		}
		functor(declaration);
	});
}

function addRunStyle({ element, props, transformer }) {
	const { name } = element;
	if (!name) {
		return props;
	}
	const { getXmlProperties } = transformer.tagRepository;
	const xmlProperties = getXmlProperties(name);
	if (xmlProperties != null) {
		props = props.concat([xmlProperties]);
	}
	// eslint-disable-next-line complexity
	forEachStyleDeclaration(element, transformer, function ({ property, value }) {
		if (property === "color") {
			props = props.concat([
				{
					type: "string",
					tag: "w:color",
					value: `<w:color w:val="${color(value)}"/>`,
				},
			]);
		}

		if (property === "break-after" && value === "page") {
			props.push("break-page-after");
		}
		if (property === "break-before" && value === "page") {
			props.push("break-page-before");
		}

		if (property === "font-weight") {
			if (value === "bold" || value === "bolder") {
				props.push("bold");
			} else if (numberRegex.test(value)) {
				const number = parseInt(value, 10);
				if (number >= 700) {
					props.push("bold");
				}
			}
		}

		if (property === "font-size") {
			const point = toPoint(value, transformer);
			if (point != null) {
				const fontsize = Math.round(2 * point);
				props = props.concat([
					{
						type: "string",
						tag: "w:sz",
						value: `<w:sz w:val="${fontsize}"/>`,
					},
					{
						type: "string",
						tag: "w:szCs",
						value: `<w:szCs w:val="${fontsize}"/>`,
					},
				]);
			}
		}

		if (property === "font-family") {
			value = value
				.split(",")[0]
				.trim()
				.replace(/^['"]/, "")
				.replace(/['"]$/, "");
			if (value === "initial" || value === "inherit") {
				return;
			}

			if (value === "monospace") {
				value = "DejaVu Sans Mono";
			}

			if (value === "cursive") {
				value = "Brush Script";
			}

			if (value === "monospace") {
				value = "DejaVu Sans Mono";
			}

			if (value === "fantasy") {
				value = "DejaVu Sans Mono";
			}

			if (value === "serif") {
				value = "DejaVu Serif";
			}

			if (value === "sans-serif") {
				value = "DejaVu Sans";
			}

			props = props.concat([
				{
					type: "string",
					tag: "w:rFonts",
					value: `<w:rFonts w:ascii="${value}" w:hAnsi="${value}"/>`,
				},
			]);
		}

		if (property === "background-color") {
			props = props.concat([
				{
					type: "string",
					value: `<w:shd w:val="clear" w:color="auto" w:fill="${color(
						value
					)}"/>`,
				},
			]);
		}

		if (property === "text-decoration" && value === "underline") {
			props = props.concat("underline");
		}
	});
	return props;
}

// eslint-disable-next-line complexity
function addParagraphStyle({ element, transformer, customProperties }) {
	const paragraphTypes = element.paragraphTypes;
	if (element.name === "p" && transformer.styleDefaults.paragraph) {
		const containsStyle = paragraphTypes.some(function (paragraphType) {
			return paragraphType.indexOf("<w:pStyle ") === 0;
		});
		if (!containsStyle) {
			paragraphTypes.push(
				`<w:pStyle w:val="${transformer.styleDefaults.paragraph}"/>`
			);
		}
	}

	let leftIndent = 0;
	let textIndent = 0;

	if (element.name === "blockquote") {
		paragraphTypes.push('<w:ind w:left="721"/>');
	}
	let align, before, after, lineHeight;

	/* eslint-disable-next-line complexity */
	forEachStyleDeclaration(element, transformer, function ({ property, value }) {
		if (property === "background-color") {
			paragraphTypes.push(
				`<w:shd w:val="clear" w:color="auto" w:fill="${color(value)}"/>`
			);
		}
		if (property === "text-align") {
			if (["center", "left", "right"].indexOf(value) !== -1) {
				align = value;
			}
			if (value === "justify") {
				align = "both";
			}
		}
		if (property === "padding-left") {
			const dxa = toDXA(value, transformer);
			if (dxa != null) {
				leftIndent += dxa;
			}
		}
		if (property === "margin-left") {
			const dxa = toDXA(value, transformer);
			if (dxa != null) {
				leftIndent += dxa;
			}
		}
		if (property === "text-indent") {
			const dxa = toDXA(value, transformer);
			if (dxa != null) {
				textIndent += dxa;
			}
		}
		if (property === "margin-top") {
			const dxa = toDXA(value, transformer);
			if (dxa != null) {
				before = dxa;
			}
		}
		if (property === "margin-bottom") {
			const dxa = toDXA(value, transformer);
			if (dxa != null) {
				after = dxa;
			}
		}

		if (property === "line-height") {
			const dxa = toDXA(value, transformer);
			if (dxa != null) {
				lineHeight = dxa;
			}
		}
	});

	if (before != null || after != null) {
		(customProperties || []).forEach(function ({ tag, value }) {
			if (["w:spacing"].indexOf(tag) !== -1) {
				const beforeAttribute = getSingleAttribute(value, "w:before");
				const afterAttribute = getSingleAttribute(value, "w:after");

				before = before == null ? beforeAttribute : before;
				after = after == null ? afterAttribute : after;
			}
		});

		element.paragraphTypes.push(
			`<w:spacing ${[
				before != null ? `w:before="${before}"` : "",
				after != null ? `w:after="${after}"` : "",
				lineHeight != null ? `w:line="${lineHeight}"` : "",
				lineHeight != null ? 'w:lineRule="exact"' : "",
			]
				.filter((f) => f)
				.join(" ")}/>`
		);
	}

	align ||= get(element, "attribs.align");
	if (align === "justify") {
		align = "both";
	}
	if (["center", "left", "right", "both"].indexOf(align) !== -1) {
		paragraphTypes.push(`<w:jc w:val="${align}"/>`);
	}
	if (leftIndent || textIndent) {
		paragraphTypes.push(
			`<w:ind w:left="${leftIndent}" w:right="0" w:hanging="${-textIndent}"/>`
		);
	}
	return paragraphTypes;
}

module.exports = {
	forEachStyleDeclaration,
	addRunStyle,
	addParagraphStyle,
	listStyleToNumFmt,
};
