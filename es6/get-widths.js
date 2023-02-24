const { isStartingTag, isEndingTag } = require("./tag.js");
const {
	mainContentType,
	headerContentType,
	footerContentType,
} = require("./content-types.js");
const RelsManager = require("./relationship-manager.js");
const normalizePath = require("./normalize-path.js");
const { toPixel } = require("./size-converter.js");
const {
	getAttributes,
	getAttribute,
	getSingleAttribute,
} = require("./attributes.js");
const converter = require("./converter.js");

function collectSectionsWidth(parsed, mainRels, sections) {
	let section = null;
	for (let i = 0; i < parsed.length; i++) {
		const part = parsed[i];
		if (isStartingTag(part, "w:sectPr")) {
			section = [];
		}
		if (section) {
			section.push(part);
		}
		if (isEndingTag(part, "w:sectPr")) {
			const content = section.map(({ value }) => value).join("");
			const width = parseInt(getAttribute(section, "w:pgSz", "w:w"), 10);
			const height = parseInt(getAttribute(section, "w:pgSz", "w:h"), 10);
			const leftMargin = parseInt(
				getAttribute(section, "w:pgMar", "w:left"),
				10
			);
			const rightMargin = parseInt(
				getAttribute(section, "w:pgMar", "w:right"),
				10
			);
			const headerRefs = getAttributes(section, "w:headerReference", "r:id");
			const footerRefs = getAttributes(section, "w:footerReference", "r:id");
			const headerFiles = [],
				footerFiles = [];
			headerRefs.forEach(function (ref) {
				const rel = mainRels.getRelationship(ref);
				headerFiles.push(
					normalizePath(rel.getAttribute("Target"), mainRels.dirname)
				);
			});
			footerRefs.forEach(function (ref) {
				const rel = mainRels.getRelationship(ref);
				footerFiles.push(
					normalizePath(rel.getAttribute("Target"), mainRels.dirname)
				);
			});
			const cols = parseInt(getAttribute(section, "w:cols", "w:num"), 10) || 1;
			const colsWidth = getAttributes(section, "w:col", "w:w");
			if (colsWidth.length === 0) {
				const calculatedWidth = (width - leftMargin - rightMargin) / cols;
				for (let i = 0; i < cols; i++) {
					colsWidth.push(calculatedWidth);
				}
			}
			sections.push({
				xmlContent: content,
				lIndex: section[0].lIndex,
				parsed: section,
				cols,
				colsWidth,
				width,
				height,
				leftMargin,
				rightMargin,
				part,
				headerFiles,
				footerFiles,
			});
			section = null;
		}
	}
}

function collectCellsWidth(parsed) {
	const cells = [];
	let inCell = false;
	let width = 0;
	let startLIndex;
	for (let i = 0; i < parsed.length; i++) {
		const part = parsed[i];
		if (isStartingTag(part, "w:tc")) {
			inCell = true;
			width = 0;
			startLIndex = part.lIndex;
		}

		if (inCell && isStartingTag(part, "w:tcW")) {
			width = parseInt(getSingleAttribute(part.value, "w:w"), 10);
		}

		if (isEndingTag(part, "w:tc")) {
			inCell = false;
			cells.push({
				width,
				startLIndex,
				endLIndex: part.lIndex,
			});
		}
	}
	return cells;
}

function collectPicts(parsed) {
	const picts = [];
	let inPict = false;
	let width = 0,
		height = 0;
	let startLIndex;
	for (let i = 0; i < parsed.length; i++) {
		const part = parsed[i];
		if (isStartingTag(part, "w:pict")) {
			inPict = true;
			width = 0;
			height = 0;
			startLIndex = part.lIndex;
		}

		if (
			inPict &&
			(isStartingTag(part, "v:shape") || isStartingTag(part, "v:rect"))
		) {
			const style = getSingleAttribute(part.value, "style");
			const parsedStyle = style.split(";").map(function (rule) {
				const parts = rule.split(":");
				return {
					key: parts[0],
					value: parts[1],
				};
			});
			for (let j = 0, len = parsedStyle.length; j < len; j++) {
				const { key, value } = parsedStyle[j];
				if (key === "width") {
					width = value;
				}
				if (key === "height") {
					height = value;
				}
			}
		}

		if (isEndingTag(part, "w:pict")) {
			inPict = false;
			picts.push({
				width,
				height,
				startLIndex,
				endLIndex: part.lIndex,
			});
		}
	}
	return picts;
}

function collectTextBoxDimensions(parsed) {
	const textBoxes = [];
	let inTextBox = false;
	let width = 0,
		height = 0;
	let startLIndex;
	for (let i = 0; i < parsed.length; i++) {
		const part = parsed[i];
		if (isStartingTag(part, "w:drawing")) {
			inTextBox = true;
			width = 0;
			height = 0;
			startLIndex = part.lIndex;
		}

		if (inTextBox && isStartingTag(part, "wp:extent")) {
			width = parseInt(getSingleAttribute(part.value, "cx"), 10);
			height = parseInt(getSingleAttribute(part.value, "cy"), 10);
		}

		if (isEndingTag(part, "w:drawing")) {
			inTextBox = false;
			textBoxes.push({
				width,
				height,
				startLIndex,
				endLIndex: part.lIndex,
			});
		}
	}
	return textBoxes;
}

function getSectionWidth(dpi, sections, lIndex, contentType, columnNum) {
	for (let i = 0, len = sections.length; i < len; i++) {
		const currentSection = sections[i];
		const { colsWidth } = currentSection;
		const calculatedWidth = colsWidth[columnNum];

		if (contentType !== mainContentType) {
			return converter.dxaToPixel(calculatedWidth, dpi);
		}
		const lastSectionIndex = sections[i - 1] ? sections[i - 1].part.lIndex : -1;
		if (lastSectionIndex < lIndex && lIndex < currentSection.part.lIndex) {
			return converter.dxaToPixel(calculatedWidth, dpi);
		}
	}
	throw new Error("No section found");
}

function getCellWidth(dpi, cells, lIndex) {
	for (let i = 0, len = cells.length; i < len; i++) {
		const cell = cells[i];
		if (cell.startLIndex < lIndex && lIndex < cell.endLIndex) {
			return converter.dxaToPixel(cell.width, dpi);
		}
	}
	return false;
}

function getPictDimensions(dpi, picts, lIndex) {
	for (let i = 0, len = picts.length; i < len; i++) {
		const pict = picts[i];
		if (pict.startLIndex < lIndex && lIndex < pict.endLIndex) {
			return [toPixel(pict.width, { dpi }), toPixel(pict.height, { dpi })];
		}
	}
	return false;
}

function getTextBoxDimensions(dpi, textBoxes, lIndex) {
	for (let i = 0, len = textBoxes.length; i < len; i++) {
		const textBox = textBoxes[i];
		if (textBox.startLIndex < lIndex && lIndex < textBox.endLIndex) {
			return [
				converter.emuToPixel(textBox.width, dpi),
				converter.emuToPixel(textBox.height, dpi),
			];
		}
	}
	return false;
}
const defaultDeviceWidth = 576;

function defaultGetDxaWidth() {
	return 8640;
}

function WidthCollector(module) {
	const data = { sections: module.sections };
	return {
		data,
		collect: (parsed, options) => {
			module.deviceWidth = module.options.deviceWidth || defaultDeviceWidth;
			const contentType = options.contentType;
			if (contentType === mainContentType) {
				const mainFiles =
					module.docxtemplater.invertedContentTypes[mainContentType];
				if (mainFiles && mainFiles.length > 0) {
					const mainFile =
						module.docxtemplater.invertedContentTypes[mainContentType][0];
					const mainRels = new RelsManager(module.docxtemplater, mainFile);
					collectSectionsWidth(parsed, mainRels, data.sections);
				}
			}
			data.cells = collectCellsWidth(parsed);
			data.textBoxes = collectTextBoxDimensions(parsed);
			data.picts = collectPicts(parsed);
		},
		getHeaderFooterSize(file) {
			for (let i = 0, len = data.sections.length; i < len; i++) {
				const sect = data.sections[i];
				if (
					sect.headerFiles.indexOf(file) !== -1 ||
					sect.footerFiles.indexOf(file) !== -1
				) {
					return sect;
				}
			}
		},
		getNextWSect(lIndex) {
			if (!data.sections || data.sections.length === 0) {
				// default section
				return {
					width: 11906,
					leftMargin: 1701,
					rightMargin: 850,
				};
			}
			const filePath = "/" + module.filePath;
			for (let i = 0, len = data.sections.length; i < len; i++) {
				const section = data.sections[i];
				if (
					section.lIndex > lIndex ||
					section.headerFiles.indexOf(filePath) !== -1 ||
					section.footerFiles.indexOf(filePath) !== -1
				) {
					return section;
				}
			}
			throw new Error(`Section not found for ${lIndex}`);
		},
		getDpi(lIndex) {
			let dpi = module.dpi;
			if (!dpi) {
				const dxaWidth = (module.options.getDxaWidth || defaultGetDxaWidth)(
					data.sections,
					this.getNextWSect(lIndex)
				);
				dpi = converter.calculateDpi(module.deviceWidth, dxaWidth);
			}
			return dpi;
		},
		getDimensions(part, options) {
			if (module.docxtemplater.fileType !== "docx") {
				return [null, null];
			}
			let containerWidth, containerHeight;
			const contentType = options.contentType;
			if (
				[headerContentType, footerContentType, mainContentType].indexOf(
					contentType
				) === -1
			) {
				return [null, null];
			}
			const dpi = this.getDpi(part.lIndex);

			const dimension =
				getTextBoxDimensions(dpi, data.textBoxes, part.lIndex) ||
				getPictDimensions(dpi, data.picts, part.lIndex, dpi);

			if (dimension) {
				containerWidth = dimension[0];
				containerHeight = dimension[1];
			} else {
				containerWidth =
					getCellWidth(dpi, data.cells, part.lIndex) ||
					getSectionWidth(
						dpi,
						data.sections,
						part.lIndex,
						contentType,
						module.columnNum
					);
			}
			return [containerWidth, containerHeight];
		},
	};
}

module.exports = WidthCollector;
