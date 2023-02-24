const verifyApiVersion = require("./api-verify.js");
const { concatArrays, traits, str2xml } = require("docxtemplater").DocUtils;
const HtmlTransformer = require("./html-transformer.js");
const { dxaToPixel } = require("./converter.js");
const textStripper = require("./text-stripper.js");
const { isStartingTag } = require("./tag.js");
const { tapRecursive, getTextContent } = require("./html-utils.js");
const { merge, pick, get } = require("lodash");
const StyleManager = require("./style-manager.js");
const moduleNameBlock = "pro-xml-templating/html-module-block";
const moduleNameInline = "pro-xml-templating/html-module-inline";
const ListHandler = require("./list-handler.js");
const docStyles = require("./doc-styles.js");
const { TagRepository } = require("./tags.js");
const Docxtemplater = require("docxtemplater");
const { getSingleAttribute } = require("./attributes.js");
const { forEachStyleDeclaration } = require("./style.js");
const { percentRegex } = require("./regex.js");
const cssParser = require("css/lib/parse/index.js");
const ctXML = "[Content_Types].xml";
const { mainContentType } = require("./content-types.js");
const widthCollector = require("./get-widths.js");

function getResolvedId(part, options) {
	return (
		options.filePath +
		"@" +
		part.lIndex.toString() +
		"-" +
		options.scopeManager.scopePathItem.join("-")
	);
}

function hasColumnBreak(chunk) {
	return chunk.some(function (part) {
		if (part.tag === "w:br" && part.value.indexOf('w:type="column"') !== -1) {
			return true;
		}
	});
}

function getInner({ leftParts, part }) {
	part.hasColumnBreak = hasColumnBreak(leftParts);
	return part;
}

function getInnerInline({ part, leftParts, rightParts, postparse }) {
	const strippedLeft = textStripper(leftParts);
	const strippedRight = textStripper(rightParts);
	strippedLeft.forEach(function (part) {
		if (part.tag === "w:t" && part.position === "start") {
			part.value = '<w:t xml:space="preserve">';
		}
	});
	const p1 = postparse(concatArrays([leftParts, strippedRight]));
	const p2 = postparse(concatArrays([strippedLeft, rightParts]));
	part.expanded = [strippedLeft, strippedRight];
	return concatArrays([p1, [part], p2]);
}

function getTextualPartBefore(expanded) {
	let textualPart = "";
	let hasText = false;
	expanded[0].forEach(function (part) {
		if (part.tag === "w:t" && part.position === "start") {
			textualPart += '<w:t xml:space="preserve">';
		} else {
			textualPart += part.value;
		}
		if (part.type === "content" && part.position === "insidetag") {
			hasText = true;
		}
	});

	if (!hasText) {
		return "";
	}

	expanded[1].forEach(function (part) {
		textualPart += part.value;
	});
	return textualPart;
}

function getProperties(parts, tagName, levelFilter = null) {
	let inTag = false;
	let level = 0;
	const properties = [];
	for (let i = 0, len = parts.length; i < len; i++) {
		const part = parts[i];
		const { type, tag, position } = part;
		if (inTag) {
			if (type === "tag" && tag === tagName && position === "end") {
				inTag = false;
				continue;
			}
			properties.push(part);
		}
		if (type === "tag") {
			if (position === "start") {
				if (
					tag === tagName &&
					(levelFilter === null || levelFilter === level)
				) {
					inTag = true;
				}
				level++;
			}
			if (position === "end") {
				level--;
			}
		}
	}
	return properties;
}

const defaultSizeConverters = {
	paddingLeft: 15,
};

function defaultGetDxaWidth() {
	return 9026;
}
const defaultDeviceWidth = 470.10416666666663;

class HtmlModule {
	constructor(options = {}) {
		this.columnNum = 0;
		this.supportedFileTypes = ["docx"];
		this.requiredAPIVersion = "3.30.0";
		this.resolved = {};
		this.sections = [];
		this.W = {};
		options.deviceWidth ||= defaultDeviceWidth;
		this.prefix = "~";

		this.name = "HtmlModule";
		this.minBookmarkId = 1;
		this.blockPrefix = "~~";
		this.htmlSections = [];
		this.elementCustomizer = options.elementCustomizer || (() => undefined);
		this.tagRepository = new TagRepository({
			getTag(tags, name) {
				if (!tags[name]) {
					if (options.ignoreUnknownTags) {
						return tags.span;
					}
					const err = new Docxtemplater.Errors.RenderingError(
						`Tag ${name} not supported`
					);
					err.properties = {
						explanation: `The tag ${name} is not supported`,
						name,
						id: "html_tag_name_unsupported",
					};
					throw err;
				}
				return tags[name];
			},
		});
		options.getDxaWidth ||= defaultGetDxaWidth;
		this.sizeConverters = merge(
			{},
			defaultSizeConverters,
			options.sizeConverters
		);
		if (options.img) {
			const img = options.img;
			const imModule = (this.img = new options.img.Module({
				getImage(image) {
					return image.src;
				},
				getProps(_, value) {
					if (img.getProps) {
						return img.getProps(value);
					}
				},
				getSize(_, value, __, vals = {}) {
					const { transformer } = value;
					imModule.dpi = transformer.dpi;
					let srcSize = null;
					if (img.getSrcSize) {
						srcSize = img.getSrcSize(value);
					}
					if (img.getSize) {
						return img.getSize(value);
					}
					let percentWidth = null;
					forEachStyleDeclaration(
						value.element,
						value.transformer,
						({ property, value }) => {
							if (
								property === "width" &&
								percentWidth == null &&
								percentRegex.test(value)
							) {
								percentWidth = parseInt(value, 10);
							}
						}
					);
					if (percentWidth && srcSize && value.element.parent) {
						if (
							value.element.parent.name === "td" &&
							value.element.parent.calculatedWidth
						) {
							let imgWidth =
								(dxaToPixel(
									value.element.parent.calculatedWidth,
									transformer.dpi
								) *
									percentWidth) /
								100;
							const imgHeight = Math.round(
								(srcSize[1] / srcSize[0]) * imgWidth
							);
							imgWidth = Math.round(imgWidth);

							return [imgWidth, imgHeight];
						}
					}
					if (vals.svgSize === null) {
						return [500, 500];
					}
					if (vals.svgSize) {
						return vals.svgSize;
					}
					if (value.element.attribs.width && value.element.attribs.height) {
						return [
							parseInt(value.element.attribs.width, 10),
							parseInt(value.element.attribs.height, 10),
						];
					}
					return [200, 200];
				},
			}));
			imModule.W = this.W;
		}
		if (options.styleSheet) {
			const type = typeof options.styleSheet;
			if (type !== "string") {
				const err = new Docxtemplater.Errors.XTError(
					`stylesheet must be a string, but received ${type}`
				);
				err.properties = {
					explanation: "The HTML module styleSheet option must be a string",
					id: "html_module_stylesheet_not_string",
				};
				throw err;
			}
			this.styleSheet = cssParser(options.styleSheet, {
				silent: options.ignoreCssErrors,
			});
			this.rawStyleSheet = options.styleSheet;
		}
		this.options = options;
	}
	clone() {
		return new HtmlModule(this.options);
	}
	set(options) {
		if (this.img) {
			this.img.set(options);
		}
		if (options.xmlDocuments) {
			this.xmlDocuments = options.xmlDocuments;
			this.listHandler = new ListHandler(this);
		}
		if (options.inspect && options.inspect.filePath) {
			this.filePath = options.inspect.filePath;
		}
	}
	addStyles() {
		this.styleManager = new StyleManager(this.xmlDocuments);
		this.styleManager.addStyles();
		this.synonyms = this.styleManager.usedSynonyms;
		this.styleIds = this.styleManager.styleIds;
		this.styleDefaults = this.styleManager.getDefaultStyles();
		if (this.options.styleTransformer) {
			this.tagRepository.tags = this.options.styleTransformer(
				this.tagRepository.tags,
				docStyles(),
				this
			);
		}
		this.tagRepository.styleDefaults = this.styleDefaults;
	}
	getNextWSect(lIndex) {
		if (this.htmlSections.length === 0) {
			// default section
			return {
				width: 11906,
				leftMargin: 1701,
				rightMargin: 850,
			};
		}
		for (let i = 0, len = this.htmlSections.length; i < len; i++) {
			const section = this.htmlSections[i];
			if (section.lIndex > lIndex) {
				return section;
			}
		}
		throw new Error(`Section not found for ${lIndex}`);
	}
	optionsTransformer(options, docxtemplater) {
		verifyApiVersion(docxtemplater, this.requiredAPIVersion);
		this.docxtemplater = docxtemplater;

		const relsFiles = docxtemplater.zip
			.file(/numbering.xml/)
			.concat(docxtemplater.zip.file(/\[Content_Types\].xml/))
			.concat(docxtemplater.zip.file(/word\/styles\.xml/))
			.concat(docxtemplater.zip.file(/document\d*\.xml\.rels/))
			.map((file) => file.name);
		if (docxtemplater.fileType === "pptx") {
			const err = new Docxtemplater.Errors.XTTemplateError(
				"The HTML module only handles docx, not pptx"
			);
			err.properties = {
				explanation: "The HTML module only handles docx",
				id: "html_module_does_not_support_pptx",
			};
			throw err;
		}
		options.xmlFileNames = options.xmlFileNames.concat(relsFiles);
		docxtemplater.fileTypeConfig.tagsXmlLexedArray.push(
			"w:bCs",
			"w:bidi",
			"w:bookmarkStart",
			"w:cols",
			"w:col",
			"w:ind",
			"w:jc",
			"w:pPr",
			"w:pStyle",
			"w:pgMar",
			"w:pgSz",
			"w:rFonts",
			"w:rPr",
			"w:rtl",
			"w:rStyle",
			"w:sdtContent",
			"w:sectPr",
			"w:spacing",
			"w:sz",
			"w:highlight",
			"w:i",
			"w:b",
			"w:color",
			"w:rStyle",
			"w:strike",
			"w:vertAlign",
			"w:u",
			"w:lang",
			"w:szCs"
		);

		const contentTypes = docxtemplater.zip.files[ctXML];
		this.targets = [];
		const contentTypeXml = contentTypes ? str2xml(contentTypes.asText()) : null;
		const overrides = contentTypeXml
			? contentTypeXml.getElementsByTagName("Override")
			: null;

		for (let i = 0, len = overrides.length; i < len; i++) {
			const override = overrides[i];
			const contentType = override.getAttribute("ContentType");
			const partName = override.getAttribute("PartName").substr(1);
			if (contentType === mainContentType) {
				this.mainFile = partName;
				this.mainRelsFile =
					partName.replace(/^(.+?)\/([a-zA-Z0-9]+)\.xml$/, "$1/_rels/$2") +
					".xml.rels";
			}
		}

		if (this.img) {
			return this.img.optionsTransformer(options, docxtemplater);
		}
		return options;
	}
	preparse(parsed, options) {
		this.W[options.filePath] ||= widthCollector(this);
		const W = this.W[options.filePath];
		W.collect(parsed, options);
	}
	matchers() {
		const onMatch = () => {
			if (!this.styleManager) {
				this.addStyles();
			}
		};
		return [
			[this.blockPrefix, moduleNameBlock, { onMatch }],
			[this.prefix, moduleNameInline, { onMatch }],
		];
	}
	postparse(parsed, options) {
		parsed.forEach((part) => {
			if (isStartingTag(part, "w:bookmarkStart")) {
				const id = getSingleAttribute(part.value, "w:id");
				this.minBookmarkId = Math.max(this.minBookmarkId, parseInt(id, 10));
			}
		});
		parsed = traits.expandToOne(parsed, {
			moduleName: moduleNameBlock,
			getInner,
			expandTo: "w:p",
		});
		parsed = traits.expandToOne(parsed, {
			moduleName: moduleNameInline,
			getInner: getInnerInline,
			expandTo: "w:r",
			postparse: options.postparse,
		});
		return parsed;
	}
	resolve(part, options) {
		this.filePath = options.filePath;
		if (
			part.type !== "placeholder" ||
			[moduleNameBlock, moduleNameInline].indexOf(part.module) === -1
		) {
			return null;
		}

		const tagValue = options.scopeManager.getValue(part.value, { part });
		this.dpi = this.W[options.filePath].getDpi(part.lIndex);
		const [containerWidth, containerHeight] = this.W[
			options.filePath
		].getDimensions(part, options);
		part.containerWidth = containerWidth;
		part.containerHeight = containerHeight;
		this.containerWidth = containerWidth;
		const resolvedId = getResolvedId(part, options);
		return Promise.resolve(tagValue).then((tagValue) => {
			if (!tagValue) {
				this.resolved[resolvedId] = {
					tagValue,
					images: {},
				};
				return { value: "" };
			}
			const htmlT = new HtmlTransformer(this, options.filePath, part, options);
			htmlT.parse(tagValue);
			const imagePromises = [];
			const srcs = [];
			if (this.options.img) {
				tapRecursive(htmlT.handler.dom, (el) => {
					if (el.type === "tag" && el.name === "img") {
						const src = el.attribs.src;
						srcs.push(src);
						imagePromises.push(
							this.options.img.getValue
								? this.options.img.getValue(el)
								: el.attribs.rc
						);
					}
				});
			}

			return Promise.all(imagePromises).then((images) => {
				this.resolved[resolvedId] = {
					tagValue,
					images: images.reduce(function (images, image, i) {
						images[srcs[i]] = image;
						return images;
					}, {}),
				};
			});
		});
	}

	render(part, options) {
		this.filePath = options.filePath;
		const { expanded } = part;
		if (part.tag === "w:sectPr") {
			this.columnNum = 0;
		}
		if (hasColumnBreak([part])) {
			this.columnNum++;
		}
		if (
			part.type !== "placeholder" ||
			[moduleNameBlock, moduleNameInline].indexOf(part.module) === -1
		) {
			return null;
		}
		if (part.hasColumnBreak) {
			this.columnNum++;
		}
		part.renderColumnBreak = part.hasColumnBreak;
		const resolvedId = getResolvedId(part, options);
		const W = this.W[options.filePath];
		const [containerWidth, containerHeight] = W.getDimensions(part, options);
		part.containerWidth = containerWidth;
		part.containerHeight = containerHeight;
		this.containerWidth = containerWidth;
		let htmlData;
		if (this.resolved[resolvedId]) {
			const resolvedImages = get(this, ["resolved", resolvedId, "images"]);
			this.resolvedImages = resolvedImages;
			htmlData = this.resolved[resolvedId].tagValue;
		} else {
			this.resolvedImages = [];
			htmlData = options.scopeManager.getValue(part.value, { part });
		}

		if (!htmlData) {
			return { value: "" };
		}

		this.currentPageSize = pick(this.getNextWSect(expanded[0][0].lIndex), [
			"width",
			"leftMargin",
			"rightMargin",
			"cols",
		]);

		const isInline = part.module === moduleNameInline;
		this.dpi = W.getDpi(part.lIndex);

		const htmlT = new HtmlTransformer(this, options.filePath, part, options);
		htmlT.parse(htmlData);

		let tagStyleSheet = null;
		tapRecursive(htmlT.handler.dom, (el) => {
			if (el.type === "style" && el.name === "style") {
				const styleSheet = cssParser(getTextContent(el), {
					silent: this.options.ignoreCssErrors,
				});
				if (!tagStyleSheet) {
					tagStyleSheet = styleSheet;
				} else {
					tagStyleSheet.stylesheet.rules =
						tagStyleSheet.stylesheet.rules.concat(styleSheet.stylesheet.rules);
				}
			}
		});
		htmlT.tagStyleSheet = tagStyleSheet;

		const run = getProperties(part.expanded[0], "w:r", isInline ? 0 : 1);
		const runProperties = getProperties(run, "w:rPr");
		let insideRPR = false;
		const paragraphRunProperties = [];
		const customProperties = getProperties(part.expanded[0], "w:pPr", 1).filter(
			function (p) {
				if (p.tag === "w:rPr" && p.position === "end") {
					insideRPR = false;
					return false;
				}
				if (insideRPR) {
					if (p.type !== "content") {
						paragraphRunProperties.push(p);
					}
				}
				if (p.tag === "w:rPr" && p.position === "start") {
					insideRPR = true;
				}
				return p.type !== "content" && !insideRPR;
			}
		);

		let textualPartBefore = "";
		if (isInline) {
			textualPartBefore = getTextualPartBefore(part.expanded);
		}

		const transformer = isInline
			? htmlT.transformInline.bind(htmlT)
			: htmlT.transformBlock.bind(htmlT);
		const value = transformer(
			runProperties,
			customProperties,
			paragraphRunProperties,
			part
		);

		return { value: textualPartBefore + value };
	}
}

module.exports = HtmlModule;
