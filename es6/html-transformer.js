const { flatten } = require("lodash");
const paragraph = require("./paragraph.js");
const { stripRunsWhiteSpace } = require("./whitespace.js");
const paragraphsToText = require("./renderer.js");
const { Parser } = require("htmlparser2");
const { DomHandler } = require("domhandler");
const getRelsFilePath = require("./rels-file-path.js");
const { str2xml } = require("docxtemplater").DocUtils;

class HtmlTransformer {
	constructor(
		{
			xmlDocuments,
			resolvedImages,
			listHandler,
			synonyms,
			containerWidth,
			styleIds,
			tagRepository,
			img,
			sizeConverters,
			mainRelsFile,
			dpi,
			sections,
			styleDefaults,
			elementCustomizer,
			minBookmarkId,
			styleSheet,
			options: { ignoreCssErrors, ignoreUnknownTags },
		},
		filePath,
		part,
		{ scopeManager }
	) {
		this.mainRelsFile = mainRelsFile;
		this.scopeManager = scopeManager;
		this.sections = sections;
		this.part = part;
		this.synonyms = synonyms;
		this.styleIds = styleIds;
		this.sizeConverters = sizeConverters;
		this.resolvedImages = resolvedImages;
		this.dpi = dpi;
		this.ignoreUnknownTags = ignoreUnknownTags;
		this.ignoreCssErrors = ignoreCssErrors;
		this.tagRepository = tagRepository;
		this.containerWidth = containerWidth;
		this.listHandler = listHandler;
		this.xmlDocuments = xmlDocuments;
		this.handler = new DomHandler();
		this.parser = new Parser(this.handler);
		this.img = img;
		this.minBookmarkId = minBookmarkId;
		this.filePath = filePath;
		this.relsFilePath = getRelsFilePath(filePath);
		this.xmlDocuments[this.relsFilePath] =
			this.xmlDocuments[this.relsFilePath] ||
			str2xml(
				'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'
			);

		this.styleDefaults = styleDefaults;
		this.elementCustomizer = elementCustomizer;
		this.styleSheet = styleSheet;
		this.textinputcount = 1;
	}

	parse(html) {
		this.parser.parseComplete(html);
	}

	transformInline(runProperties) {
		const runs = flatten(
			this.handler.dom.map((element) => {
				return paragraph.getRelationElement(element, [], runProperties, this);
			})
		);
		return stripRunsWhiteSpace(runs);
	}

	getBlockContent(
		elements,
		runProperties,
		customProperties,
		paragraphRunProperties
	) {
		let chunk;
		const elementsWithImplicit = elements.reduce((result, element) => {
			const { name } = element;
			if (name && this.tagRepository.isBlock(name)) {
				if (chunk) {
					chunk[chunk.length - 1].next = null;
					const element = {
						children: chunk,
						name: "p",
						type: "tag",
						customProperties,
						implicit: true,
					};
					chunk.forEach(function (part) {
						part.parent = element;
					});
					result.push(element);
					chunk = null;
				}

				result.push(element);
				return result;
			}
			chunk ||= [];
			chunk.push(element);
			return result;
		}, []);
		if (chunk) {
			const element = {
				children: chunk,
				name: "p",
				type: "tag",
				customProperties,
				implicit: true,
			};
			elementsWithImplicit.push(element);
			chunk = null;
		}
		return elementsWithImplicit
			.map((element) => {
				const { type } = element;
				if (type === "tag") {
					const pars = paragraph.getParagraphs({
						element,
						level: 0,
						props: [],
						runProperties,
						transformer: this,
						customProperties,
						paragraphRunProperties,
					});
					return paragraphsToText({
						paragraphs: pars,
						transformer: this,
						customProperties,
						paragraphRunProperties,
					});
				}
				return "";
			})
			.join("")
			.replace(/&amp;nbsp;/g, " ")
			.replace(/\t|\n/g, "");
	}

	transformBlock(runProperties, customProperties, paragraphRunProperties) {
		return this.getBlockContent(
			this.handler.dom,
			runProperties,
			customProperties,
			paragraphRunProperties
		);
	}
}

module.exports = HtmlTransformer;
