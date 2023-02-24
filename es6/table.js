const tableCreator = require("./tablecreator.js");
const { get, times, cloneDeep } = require("lodash");
const { forEachStyleDeclaration, addRunStyle } = require("./style.js");
const color = require("./color-parser.js");
const converter = require("./converter.js");
const { percentRegex, numberRegex } = require("./regex.js");
const { toPixel, toDXA } = require("./size-converter.js");
const addCustomProperties = require("./add-custom-properties.js");
const { attrs } = require("./tags.js");
const isValidColor = require("color-js").isValid;

function sum(ints) {
	return ints.reduce(function (sum, i) {
		return sum + i;
	}, 0);
}

function translateValign(vAlign) {
	if (vAlign === "middle") {
		return "center";
	}
	return vAlign;
}
function translateAlign(align) {
	if (align === "justify") {
		return "both";
	}
	return align;
}

function compare(a, b) {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	// a must be equal to b
	return 0;
}

module.exports = function getTable(
	element,
	runProperties,
	transformer,
	customProperties,
	paragraphRunProperties
) {
	let tableWidth,
		trIndex = 0,
		tdIndex = 0;
	const rowSpans = [];
	const defaultPadding = {
		left: 45,
	};
	function getColsCount(tableParts) {
		return tableParts.reduce(function (max, row) {
			const sum = row.parts.reduce(function (sum, row) {
				return sum + (row.colspan || 1);
			}, 0);
			return Math.max(max, sum);
		}, 0);
	}
	function convert(input) {
		return converter.pixelToDXA(input, transformer.dpi);
	}
	function scaleWidths(widths, tableWidth) {
		let widthSum = sum(widths);
		if (widthSum !== tableWidth) {
			const ratio = tableWidth / widthSum;
			widths = widths.map(function (width) {
				return Math.floor(width * ratio);
			});
		}
		widthSum = sum(widths);
		if (widthSum !== tableWidth) {
			const points = tableWidth - widthSum;
			for (let i = 0; i < points; i++) {
				widths[i % widths.length]++;
			}
		}
		return widths;
	}

	function getTableWidth() {
		forEachStyleDeclaration(
			element,
			transformer,
			function ({ property, value }) {
				if (property === "width") {
					tableWidth = value;
				}
			}
		);
		if (!tableWidth && element.attribs.width !== "0") {
			tableWidth = element.attribs.width;
		}
		if (numberRegex.test(tableWidth)) {
			tableWidth += "px";
		}
		if (percentRegex.test(tableWidth)) {
			const percent = parseFloat(tableWidth.substr(0, tableWidth.length - 1));
			tableWidth = convert(
				parseFloat((percent / 100) * transformer.containerWidth, 10)
			);
		} else {
			const dxa = toDXA(tableWidth, transformer);
			if (dxa != null) {
				tableWidth = dxa;
			} else {
				return null;
			}
		}
		return tableWidth;
	}

	// eslint-disable-next-line complexity
	function getWidths(tableParts) {
		const rows = tableParts.length;
		const colCount = getColsCount(tableParts);
		let rowsFinished = 0,
			col = 0;

		const colOffset = times(rows, () => 0);
		const widths = [];
		const defaultWidths = {};
		const absoluteWidths = {};
		tableWidth = getTableWidth();
		let defaultTableWidth = false;
		if (tableWidth == null) {
			defaultTableWidth = true;
			tableWidth = toDXA("450px", transformer);
		}
		while (rowsFinished < rows) {
			for (let i = 0; i < rows; i++) {
				const row = tableParts[i].parts;
				if (col === row.length) {
					rowsFinished++;
				}
				const cell = row[col];
				if (cell) {
					if (cell.colspan > 1) {
						colOffset[i] += cell.colspan - 1;
					}
					if (cell.width && cell.colspan === 1) {
						if (typeof cell.width === "string") {
							defaultWidths[col] = true;
							widths[col + colOffset[i]] = parseInt(
								(tableWidth * parseInt(cell.width, 10)) / 100,
								10
							);
						} else {
							widths[col + colOffset[i]] = convert(cell.width);
							absoluteWidths[col + colOffset[i]] = true;
						}
					}
				}
			}
			if (rowsFinished === rows) {
				break;
			}
			if (!widths[col]) {
				defaultWidths[col] = true;
				widths[col] = Math.round(tableWidth / colCount);
			}
			col++;
		}
		if (Object.keys(absoluteWidths).length === 0) {
			return scaleWidths(widths, tableWidth);
		}
		if (defaultTableWidth) {
			const sumWidths = sum(widths);
			if (Object.keys(defaultWidths).length === 0) {
				tableWidth = sumWidths;
			} else {
				tableWidth =
					(sumWidths * Object.keys(defaultWidths).length) / widths.length;
				return widths;
			}
		}
		return scaleWidths(widths, tableWidth);
	}
	function calculateWidth(tableParts) {
		const widths = getWidths(tableParts);
		const rows = tableParts.length;
		let rowsFinished = 0,
			col = 0;
		const colOffset = times(rows, () => 0);
		while (rowsFinished < rows) {
			for (let i = 0; i < rows; i++) {
				const row = tableParts[i].parts;
				if (col === row.length) {
					rowsFinished++;
				}
				const cell = row[col];
				if (cell) {
					if (cell.empty) {
						continue;
					}
					const colspan = cell.colspan;
					let totalWidth = 0;
					for (let j = 0; j < colspan; j++) {
						if (widths[col + j + colOffset[i]]) {
							totalWidth += widths[col + j + colOffset[i]];
						}
					}
					cell.width = totalWidth;
					cell.element.calculatedWidth = cell.width;
					colOffset[i] += colspan - 1;
				}
			}
			col++;
		}
	}
	function getTd(element, customProperties) {
		const colspan = parseInt(get(element, "attribs.colspan", 1), 10);
		const rowspan = parseInt(get(element, "attribs.rowspan", 1), 10);
		let bgColor;
		let align;
		let tdWidth;
		let vAlign;
		let borderColor;
		const border = {
			top: {},
			right: {},
			bottom: {},
			left: {},
		};
		const padding = cloneDeep(defaultPadding);
		customProperties = cloneDeep(customProperties);
		const newRunProperties = cloneDeep(runProperties);
		addCustomProperties(element, transformer);
		forEachStyleDeclaration(
			element,
			transformer,
			/* eslint-disable-next-line complexity */
			function ({ property, value }) {
				if (property === "background-color") {
					bgColor = color(value);
				}
				if (property === "background") {
					bgColor = color(value.split(" ")[0]);
				}
				if (property === "width") {
					if (percentRegex.test(value)) {
						tdWidth = value;
					} else {
						const px = toPixel(value, transformer);
						if (px != null) {
							tdWidth = px;
						}
					}
				}
				if (
					property === "vertical-align" &&
					["top", "center", "bottom", "middle"].indexOf(value)
				) {
					vAlign = value;
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
					padding.left = toDXA(value, transformer);
				}
				if (property === "padding-right") {
					padding.right = toDXA(value, transformer);
				}
				if (property === "padding-top") {
					padding.top = toDXA(value, transformer);
				}
				if (property === "padding-bottom") {
					padding.bottom = toDXA(value, transformer);
				}
				function translateBorderStyle(val) {
					if (val === "solid") {
						return "single";
					}
					return val;
				}
				if (property === "border-top-style") {
					border.top.style = translateBorderStyle(value);
				}
				if (property === "border-bottom-style") {
					border.bottom.style = translateBorderStyle(value);
				}
				if (property === "border-right-style") {
					border.right.style = translateBorderStyle(value);
				}
				if (property === "border-left-style") {
					border.left.style = translateBorderStyle(value);
				}
				if (property === "border-top-width") {
					const px = toPixel(value, transformer);
					if (px != null) {
						border.top.sz = px * 2;
					}
				}
				if (property === "border-bottom-width") {
					const px = toPixel(value, transformer);
					if (px != null) {
						border.bottom.sz = px * 2;
					}
				}
				if (property === "border-right-width") {
					const px = toPixel(value, transformer);
					if (px != null) {
						border.right.sz = px * 2;
					}
				}
				if (property === "border-left-width") {
					const px = toPixel(value, transformer);
					if (px != null) {
						border.left.sz = px * 2;
					}
				}
				if (property === "border-top-color" && isValidColor(value)) {
					border.top.color = color(value);
				}
				if (property === "border-bottom-color" && isValidColor(value)) {
					border.bottom.color = color(value);
				}
				if (property === "border-right-color" && isValidColor(value)) {
					border.right.color = color(value);
				}
				if (property === "border-left-color" && isValidColor(value)) {
					border.left.color = color(value);
				}
				if (property === "border-color") {
					borderColor = color(value);
				}
			}
		);
		if (!tdWidth) {
			tdWidth = get(element, "attribs.width", null);
			if (tdWidth) {
				tdWidth = parseInt(tdWidth, 10);
			}
		}
		const pStyle = get(element, "customProperties.pStyle");
		if (pStyle) {
			customProperties.push({
				type: "tag",
				position: "selfclosing",
				text: false,
				value: `<w:pStyle w:val="${pStyle}"/>`,
				tag: "w:pStyle",
			});
		}
		vAlign ||= get(element, "attribs.valign");
		vAlign = translateValign(vAlign);
		const bgAttribute = get(element, "attribs.bgcolor");
		if (bgAttribute && !bgColor) {
			bgColor = color(bgAttribute);
		}
		align ||= get(element, "attribs.align");
		align = translateAlign(align);
		if (align && ["center", "left", "right", "both"].indexOf(align) !== -1) {
			customProperties.unshift({
				type: "tag",
				tag: "w:jc",
				value: `<w:jc w:val="${align}"/>`,
			});
		}

		customProperties = addRunStyle({
			element,
			props: customProperties,
			transformer,
		});
		customProperties.forEach(function (input) {
			let tag, value;
			if (typeof input === "string") {
				tag = attrs[input].tag;
				value = attrs[input].value;
			} else {
				tag = input.tag;
				value = input.value;
			}
			if (["w:sz", "w:szCs", "w:color", "w:b", "w:jc"].indexOf(tag) !== -1) {
				newRunProperties.push({ tag, value });
			}
		});

		const value = {
			width: tdWidth,
			newRunProperties,
			customProperties,
			colspan,
			rowspan,
			vAlign,
			align,
			padding,
			element,
			bgColor,
			borderColor,
			border,
		};
		if (rowspan > 1) {
			rowSpans.push({
				trIndex,
				tdIndex,
				height: rowspan - 1,
				value,
			});
		}
		tdIndex += colspan;
		return value;
	}
	function getVMergeTd(value) {
		tdIndex += value.colspan;
		return {
			...value,
			content: "",
			vMerge: "continue",
		};
	}
	function getEmptyTd() {
		tdIndex += 1;
		return {
			content: "",
			empty: true,
		};
	}
	function getBody(element, customProperties) {
		customProperties = cloneDeep(customProperties);
		customProperties = addRunStyle({
			element,
			props: customProperties,
			transformer,
		});
		return element.children
			.filter(function (children) {
				const hasTd = children.children
					? children.children.some(function (c) {
							return c.type === "tag";
					  })
					: false;

				return children.type === "tag" && children.name === "tr" && hasTd;
			})
			.map(function (children) {
				return getTr(children, customProperties);
			});
	}

	function getTr(element, customProperties) {
		tdIndex = 0;
		let bgColor;
		addCustomProperties(element, transformer);

		forEachStyleDeclaration(
			element,
			transformer,
			function ({ property, value }) {
				if (property === "background-color") {
					bgColor = color(value);
				}
				if (property === "background") {
					bgColor = color(value.split(" ")[0]);
				}
			}
		);
		const bgAttribute = get(element, "attribs.bgcolor");
		if (bgAttribute && !bgColor) {
			bgColor = color(bgAttribute);
		}
		customProperties = cloneDeep(customProperties);
		customProperties = addRunStyle({
			element,
			props: customProperties,
			transformer,
		});
		const fakeCells = [];
		rowSpans.forEach(function (rowSpan) {
			if (
				rowSpan.trIndex < trIndex &&
				trIndex <= rowSpan.trIndex + rowSpan.height
			) {
				fakeCells.push({ index: rowSpan.tdIndex, value: rowSpan.value });
			}
		});
		fakeCells.sort((c1, c2) => {
			if (c1.index === c2.index) {
				return 0;
			}
			return c1.index > c2.index ? 1 : -1;
		});
		const interestingChilds = element.children.filter(function (children) {
			return (
				children.type !== "text" && ["td", "th"].indexOf(children.name) !== -1
			);
		});

		const parts = interestingChilds.reduce(function (parts, children, i, all) {
			fakeCells.forEach(function (fakeCell) {
				if (fakeCell.index === tdIndex) {
					parts.push(getVMergeTd(fakeCell.value));
				}
			});
			const value = getTd(children, customProperties);
			if (bgColor && !value.bgColor) {
				value.bgColor = bgColor;
			}
			parts.push(value);
			if (all.length - 1 === i) {
				fakeCells.forEach(function (fakeCell) {
					if (fakeCell.index === tdIndex) {
						parts.push(getVMergeTd(fakeCell.value));
					}
				});
			}
			return parts;
		}, []);

		if (interestingChilds.length === 0) {
			parts.push(getEmptyTd());
		}
		trIndex++;

		return {
			parts,
			repeatHeaderRow: get(element, "customProperties.repeatHeaderRow"),
			cantSplit: get(element, "customProperties.cantSplit"),
		};
	}
	let border = null;
	const defaultBorder = get(element, "customProperties.defaultBorder", {
		size: 2,
		color: "000001",
		type: "all",
	});

	let bgColor;
	forEachStyleDeclaration(element, transformer, function ({ property, value }) {
		if (property === "border-style" && value === "none") {
			border ||= defaultBorder;
			border.type = "none";
		}
		if (property === "background-color") {
			bgColor = color(value);
		}
		if (property === "background") {
			bgColor = color(value.split(" ")[0]);
		}
	});

	border ||= defaultBorder;
	if (element.attribs.bordercolor) {
		border.color = color(element.attribs.bordercolor);
	}
	if (element.attribs.cellpadding) {
		const val = toDXA(element.attribs.cellpadding + "px", transformer);
		defaultPadding.top = val;
		defaultPadding.left = val;
		defaultPadding.right = val;
		defaultPadding.bottom = val;
	}

	const colGridSum = [];
	const bgAttribute = get(element, "attribs.bgcolor");
	if (bgAttribute && !bgColor) {
		bgColor = color(bgAttribute);
	}
	const tableParts = element.children.reduce(function (tableParts, children) {
		let newCustomProperties = cloneDeep(customProperties);
		if (children.type === "text") {
			return tableParts;
		}
		if (children.name === "tr") {
			tableParts.push(getTr(children, newCustomProperties));
			return tableParts;
		}
		if (["tbody", "thead", "tfoot"].indexOf(children.name) !== -1) {
			newCustomProperties = cloneDeep(newCustomProperties);
			newCustomProperties = addRunStyle({
				element,
				props: newCustomProperties,
				transformer,
			});
			return tableParts.concat(getBody(children, newCustomProperties));
		}
		return tableParts;
	}, []);
	tableParts.forEach(function (tr) {
		tr.parts.forEach(function (td) {
			td.bgColor ||= bgColor;
		});
	});

	calculateWidth(tableParts);

	tableParts.forEach(function (rows) {
		let currentSum = 0;
		rows.parts.forEach(function ({ width }) {
			currentSum += width;
			if (colGridSum.indexOf(currentSum) === -1) {
				colGridSum.push(currentSum);
			}
		});
	});

	colGridSum.sort(compare);

	tableParts.forEach(function (rows) {
		let currentSum = 0;
		rows.parts.forEach(function (element) {
			const { width } = element;
			let startIndex;
			if (currentSum === 0) {
				startIndex = -1;
			} else {
				startIndex = colGridSum.indexOf(currentSum);
			}
			currentSum += width;
			const endIndex = colGridSum.indexOf(currentSum);
			element.colspan = endIndex - startIndex;
			if (element.colspan === 1) {
				delete element.colspan;
			}
		});
	});

	tableParts.forEach(function (tdParts) {
		tdParts.parts.forEach(function (tc) {
			if (tc.empty === true) {
				return;
			}
			tc.content = transformer.getBlockContent(
				tc.element.children,
				tc.newRunProperties,
				tc.customProperties,
				paragraphRunProperties
			);
		});
	});
	const colGrid = colGridSum.map(function (value, i) {
		const last = i === 0 ? 0 : colGridSum[i - 1];
		return value - last;
	});

	let leftAuto = false,
		rightAuto = false;

	let tableAlign = element.attribs.align;
	const margin = {};
	let layout = "";
	forEachStyleDeclaration(element, transformer, function ({ property, value }) {
		if (property === "margin-left" && value === "auto") {
			leftAuto = true;
		}
		if (property === "margin-left") {
			const dxa = toDXA(value, transformer);
			if (dxa != null) {
				margin.left = dxa;
			}
		}
		if (property === "margin-right" && value === "auto") {
			rightAuto = true;
		}
		if (property === "table-layout" && value === "fixed") {
			layout = "fixed";
		}
	});

	if (!tableAlign) {
		if (leftAuto) {
			if (rightAuto) {
				tableAlign = "center";
			} else {
				tableAlign = "right";
			}
		}
	}
	if (!tableAlign) {
		tableAlign = "left";
	}

	const table = {
		margin,
		data: tableParts,
		alignment: tableAlign,
		layout,
		border,
		colGrid,
		width: tableWidth,
	};
	return tableCreator(table, element, transformer);
};
