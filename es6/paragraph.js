const {
	flattenDeep,
	get,
	cloneDeep,
	isArray,
	every,
	reduceRight,
} = require("lodash");
const { getSingleAttribute } = require("./attributes.js");
const { utf8ToWord } = require("docxtemplater").DocUtils;
const stringifyParagraphTypes = require("./stringify-paragraphtypes.js");
const { merge } = require("lodash");
const {
	isWhiteSpace,
	startsWhiteSpace,
	endsWhiteSpace,
	clearWhitespace,
} = require("./whitespace.js");

const { runify, paragraphify } = require("./structures.js");
const { forEachStyleDeclaration } = require("./style.js");
const { toDXA } = require("./size-converter.js");

const { addRunStyle, addParagraphStyle } = require("./style.js");
const { getTextContent, isEndingText } = require("./html-utils.js");
const handleImage = require("./image-handler.js");
const { addRelationship } = require("./relation-utils.js");
const { attrs } = require("./tags.js");
const getTable = require("./table.js");
const he = require("he");
const { getSynonym } = require("./synonyms.js");
const addCustomProperties = require("./add-custom-properties.js");

function htmlEscape(text) {
	return utf8ToWord(
		he.decode(text, {
			isAttributeValue: false,
		})
	).replace(/‑/g, "</w:t><w:noBreakHyphen/><w:t>");
}

function runHandler({ element, transformer }) {
	const { name } = element;
	switch (name) {
		case "br":
			return "<w:r><w:br/></w:r>";
		case "input":
			const type = get(element, "attribs.type");
			const value = get(element, "attribs.value");
			const checked = get(element, "attribs.checked") != null;
			if (type === "checkbox") {
				return `<w:sdt>
					<w:sdtPr>
					<w:id w:val="-1884711366"/>
					<w14:checkbox>
					<w14:checked w14:val="0"/>
					<w14:checkedState w14:val="2612" w14:font="MS Gothic"/>
					<w14:uncheckedState w14:val="2610" w14:font="MS Gothic"/>
					</w14:checkbox>
					</w:sdtPr>
					<w:sdtContent>
					<w:r>
					<w:rPr>
					<w:rFonts w:ascii="MS Gothic" w:eastAsia="MS Gothic" w:hAnsi="MS Gothic" w:hint="eastAsia"/>
					</w:rPr>
					<w:t>${checked ? "☒" : "☐"}</w:t>
					</w:r>
					</w:sdtContent>
					</w:sdt>`;
			}
			if (type === "text") {
				let valuePart = "";
				if (value) {
					valuePart = `<w:r>
					<w:rPr>
					<w:rFonts w:hint="default"/>
					<w:lang w:val="en"/>
					</w:rPr>
					<w:t>${htmlEscape(value)}</w:t>
					</w:r>`;
				}
				return `<w:r>
					<w:fldChar w:fldCharType="begin">
					<w:ffData>
					<w:name w:val="${transformer.textinputcount++}"/>
					<w:enabled/>
					<w:calcOnExit w:val="0"/>
					<w:textInput/>
					</w:ffData>
					</w:fldChar>
					</w:r>
					<w:r>
					<w:instrText xml:space="preserve">FORMTEXT</w:instrText>
					</w:r>
					<w:r>
					<w:fldChar w:fldCharType="separate"/>
					</w:r>
					<w:r>
					<w:rPr>
					<w:rFonts w:hint="default"/>
					<w:lang w:val="en-US"/>
					</w:rPr>
					<w:t>     </w:t>
					</w:r>
					${valuePart}
					<w:r>
					<w:fldChar w:fldCharType="end"/>
					</w:r>
				`;
			}
			return "";
	}
	return null;
}

const tagHandlers = [
	{
		tag: "svg",
		functor(element, runProperties, transformer) {
			return runify(handleImage("svg", element, runProperties, transformer));
		},
		inRun: true,
	},
	{
		tag: "img",
		functor(element, runProperties, transformer) {
			let displayStyle = "inline-block";
			let leftMargin = "";
			let rightMargin = "";
			forEachStyleDeclaration(
				element,
				transformer,
				function ({ property, value }) {
					if (property === "display") {
						displayStyle = value;
					}
					if (property === "margin-left") {
						leftMargin = value;
					}
					if (property === "margin-right") {
						rightMargin = value;
					}
				}
			);

			if (
				displayStyle === "block" &&
				leftMargin === "auto" &&
				rightMargin === "auto"
			) {
				element.centered = true;
				return paragraphify(
					handleImage("img", element, runProperties, transformer)
				);
			}
			return runify(handleImage("img", element, runProperties, transformer));
		},
		inRun: true,
	},
	{
		tag: "link",
		functor(element, runProperties, transformer, props) {
			return runify(handleLink({ element, runProperties, transformer, props }));
		},
		inRun: true,
	},
	{
		tag: "list-container",
		functor(element, runProperties, transformer) {
			return handleList(element, runProperties, transformer);
		},
	},
	{
		tag: "table",
		functor(
			element,
			runProperties,
			transformer,
			_,
			customProperties,
			paragraphRunProperties
		) {
			return paragraphify(
				getTable(
					element,
					runProperties,
					transformer,
					customProperties,
					paragraphRunProperties
				)
			);
		},
	},
	{
		tag: "preformatted",
		functor(element, runProperties, transformer, props) {
			const pStyle = get(element, "customProperties.pStyle");
			let text = getTextContent(element);
			if (text[0] === "\n") {
				text = text.substr(1);
			}
			if (text[text.length - 1] === "\n") {
				text = text.substr(0, text.length - 1);
			}
			const childs = text
				.split("\n")
				.map(function (text) {
					const run = runify(getRElement(text, props, runProperties));
					run[0].calc = function (text) {
						return getRElement(text, props, runProperties);
					};
					run[0].text = element.data;
					run[0].whitespace = isWhiteSpace(element.data);
					run[0].startsWhitespace = startsWhiteSpace(element.data);
					run[0].endsWhitespace = endsWhiteSpace(element.data);
					return run
						.map(function (r) {
							return r.data.replace(/<\/w:r>/, "<w:br/></w:r>");
						})
						.join("");
				})
				.join("");

			const parProps = pStyle ? `<w:pStyle w:val="${pStyle}"/>` : "";
			return paragraphify(`<w:p><w:pPr>${parProps}</w:pPr>${childs}</w:p>`);
		},
	},
];

function getRelationElement(element, props, runProperties, transformer) {
	const { hasTag } = transformer.tagRepository;
	const { name, type } = element;
	if (!Array.isArray(runProperties)) {
		throw new Error(`runProperties undefined, ${typeof runProperties}`);
	}
	if (type === "comment") {
		return [];
	}

	function handleChildren(element) {
		const result = element.children.map((children) => {
			return getRelationElement(children, props, runProperties, transformer);
		});
		return flattenDeep(result);
	}

	function isIgnored(element) {
		if (!element.name) {
			return false;
		}
		if (
			transformer.tagRepository.isIgnored(element.name) ||
			(element.name === "br" && isEndingText(element, transformer.rootEl))
		) {
			return true;
		}
		return false;
	}

	if (isIgnored(element)) {
		return [];
	}

	if (name) {
		for (let i = 0, len = tagHandlers.length; i < len; i++) {
			const { tag, functor, inRun } = tagHandlers[i];
			if (inRun && hasTag(name, tag)) {
				return functor(element, runProperties, transformer, props);
			}
		}
	}

	if (element.data != null) {
		element.data = clearWhitespace(element.data);
		const run = runify(getRElement(element.data, props, runProperties));
		run[0].calc = function (text) {
			return getRElement(text, props, runProperties);
		};
		run[0].text = element.data;
		run[0].whitespace = isWhiteSpace(element.data);
		run[0].startsWhitespace = startsWhiteSpace(element.data);
		run[0].endsWhitespace = endsWhiteSpace(element.data);
		return run;
	}

	props = addRunStyle({ element, props, transformer });

	if (element.children) {
		const result = runHandler({ element, transformer, getRElement, props });
		if (result === null) {
			return handleChildren(element);
		}
		const run = runify(result);
		return run;
	}

	const error = new Error("Error while fetching getRelationElement");
	error.properties = { element };
	throw error;
}

function stringifyRunProps(props) {
	return props
		.map((prop) => {
			if (
				!prop ||
				prop === "break-page-after" ||
				prop === "break-page-before"
			) {
				return "";
			}
			if (prop.type === "string") {
				return prop;
			}
			return attrs[prop];
		})
		.filter(function (x) {
			return !!x;
		});
}

function deduplicateRunProps(runProperties) {
	const result = reduceRight(
		runProperties,
		function (result, { value, tag, type }) {
			if (type === "content") {
				result.runProperties = value + result.runProperties;
				return result;
			}
			if (result.seen.indexOf(tag) !== -1) {
				return result;
			}
			result.seen.push(tag);
			result.runProperties = value + result.runProperties;
			return result;
		},
		{
			seen: [],
			runProperties: "",
		}
	);
	return result.runProperties;
}

function getRElement(text, props, runProperties) {
	if (isWhiteSpace(text)) {
		text = " ";
	}

	if (typeof runProperties === "string") {
		throw new Error("runProperties is not a string");
	}
	const stringified = stringifyRunProps(props);
	const breakAfter = props.indexOf("break-page-after") !== -1;
	const breakBefore = props.indexOf("break-page-before") !== -1;
	runProperties = deduplicateRunProps(runProperties.concat(stringified));

	return `<w:r>
		<w:rPr>
		${runProperties}
		</w:rPr>
		${breakBefore ? '<w:br w:type="page"/>' : ""}
		<w:t xml:space="preserve">${htmlEscape(text)}</w:t>
		${breakAfter ? '<w:br w:type="page"/>' : ""}
		</w:r>`;
}

function handleLink({ element, transformer, runProperties, props }) {
	const Name = get(element, "attribs.name", "");
	let bookmark = "";
	if (Name) {
		const bmId = transformer.minBookmarkId++;
		bookmark = `<w:bookmarkStart w:id="${bmId}" w:name="${Name}"/><w:bookmarkEnd w:id="${bmId}"/>`;
	}
	if (element.children.length === 0) {
		return bookmark;
	}
	const Target = get(element, "attribs.href", "");
	let hyperlinkStart;
	if (Target[0] === "#" && Target.length > 1) {
		hyperlinkStart = `<w:hyperlink w:anchor="${Target.substr(
			1
		)}" w:history="1">`;
	} else {
		const rId = addRelationship(
			{
				Type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
				Target,
				TargetMode: "External",
			},
			transformer.xmlDocuments[transformer.relsFilePath]
		);
		hyperlinkStart = `<w:hyperlink r:id="rId${rId}">`;
	}
	const newProps = [
		{ type: "string", value: '<w:rStyle w:val="Hyperlink"/>' },
	].concat(props);
	const childs = element.children
		.map(function (child) {
			return getRelationElement(child, newProps, runProperties, transformer)
				.map(function (r) {
					return r.data;
				})
				.join("");
		})
		.join("");
	return `${hyperlinkStart}
	${bookmark}
	${childs}
	</w:hyperlink>
	`;
}

function addLiStyle(element, transformer) {
	const { customProperties } = element;
	const paragraphTypes = [];
	let before, after;
	forEachStyleDeclaration(element, transformer, function ({ property, value }) {
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

		paragraphTypes.push(
			`<w:spacing ${[
				before != null ? `w:before="${before}"` : "",
				after != null ? `w:after="${after}"` : "",
			]
				.filter((f) => f)
				.join(" ")}/>`
		);
	}

	return paragraphTypes;
}

function handleList(element, runProperties, transformer) {
	const tr = transformer.tagRepository;
	const { hasTag } = transformer.tagRepository;
	transformer.listHandler.addListSupport(transformer);

	function commit(data) {
		if (data.currentGroup.length > 0) {
			data.groups.push({
				runs: cloneDeep(data.currentGroup),
				level: data.element.listLevel,
				num: data.num,
				name: data.element.name,
				customProperties: merge(
					{},
					data.element.customProperties,
					data.subElement.customProperties
				),
				paragraphTypes: data.paragraphTypes,
			});
			data.currentGroup = [];
		}
	}

	function recursiveHandleList(element, data, currentLevel) {
		commit(data);
		// element : ul or ol
		if (element.name && hasTag(element.name, "list-container")) {
			element.listLevel = currentLevel;
			addCustomProperties(element, transformer);
			const num = transformer.listHandler.addList(element, transformer);
			element.children.forEach(function (c) {
				if (c.type === "comment") {
					return;
				}
				if (c.type === "text") {
					if (!isWhiteSpace(c.data)) {
						commit(data);
						const customProperties = addRunStyle({
							element: c,
							props: [],
							transformer,
						});
						data.groups.push({
							childLess: true,
							runs: [
								getRelationElement(
									c,
									customProperties,
									runProperties,
									transformer
								),
							],
						});
					}
					return null;
				}
				addCustomProperties(c, transformer);
				data.num = num;
				commit(data);
				data.paragraphTypes = [];
				if (c.name && hasTag(c.name, "list-container")) {
					// c is <ul> or <ol>
					commit(data);
					recursiveHandleList(c, data, currentLevel + 1);
					return;
				}
				data.paragraphTypes = addLiStyle(c, transformer);
				data.subElement = c;
				// c is <li> most of the time (!= ul/ol)
				let lastWasContainerTag = true;

				function ignoredInsideList(cc) {
					if (cc.name === "br" && isEndingText(cc, cc.parent)) {
						// Ignore the last <br> within a paragraph, and also return an empty paragraph when using `<p><br></p>`
						return true;
					}
					// double child of <ul>/<ol>, usually it is child of <li>
					if (
						cc.type === "text" &&
						isWhiteSpace(cc.data) &&
						lastWasContainerTag
					) {
						return true;
					}
				}
				c.children.forEach(function (cc) {
					if (ignoredInsideList(cc)) {
						return;
					}
					if (cc.type === "text") {
						lastWasContainerTag = false;
					}
					if (cc.name && hasTag(cc.name, "list-container")) {
						lastWasContainerTag = true;
						commit(data);
						recursiveHandleList(cc, data, currentLevel + 1);
						return;
					}
					lastWasContainerTag = false;
					data.element = element;
					addCustomProperties(cc, transformer);
					cc.customProperties = cc.customProperties || {};
					cc.customProperties.htmlStyle = cc.customProperties.htmlStyle || "";
					if (c.customProperties && c.customProperties.htmlStyle) {
						cc.customProperties.htmlStyle += c.customProperties.htmlStyle;
					}
					const customProperties = addRunStyle({
						element: c,
						props: [],
						transformer,
					});
					data.currentGroup.push(
						getRelationElement(cc, customProperties, runProperties, transformer)
					);
				});
				data.num = num;
				commit(data);
			});
		}
		commit(data);
	}
	const data = {
		currentGroup: [],
		groups: [],
		elementName: null,
		numPerLevels: [],
	};
	recursiveHandleList(element, data, 0);
	commit(data);
	return paragraphify(
		data.groups
			.map(function ({
				childLess,
				runs,
				level,
				name,
				customProperties,
				num,
				paragraphTypes,
			}) {
				if (childLess) {
					return `<w:p>
					${flattenDeep(runs)
						.map(({ data }) => data)
						.join("")}
						</w:p>`;
				}
				const parProps = stringifyParagraphTypes(paragraphTypes);
				let numPr = get(customProperties, "useNumPr", null);
				if (numPr == null) {
					numPr = tr.getNumPr(name);
				}
				let pStyle = get(customProperties, "pStyle");
				if (!pStyle) {
					pStyle = tr.getPStyle(name);
					if (isArray(pStyle)) {
						if (level >= pStyle.length) {
							level = pStyle.length - 1;
						}
						pStyle = pStyle[level];
					}
					pStyle = getSynonym(pStyle, transformer.synonyms);
				}
				if (isArray(pStyle)) {
					if (level >= pStyle.length) {
						level = pStyle.length - 1;
					}
					pStyle = pStyle[level];
				}

				if (pStyle.oneOf) {
					let chosenStyle = null;
					pStyle.oneOf.some(function (style) {
						if (
							typeof style === "string" &&
							transformer.styleIds.indexOf(style) !== -1
						) {
							chosenStyle = style;
							return true;
						}
						if (typeof style === "string") {
							style = getSynonym(style, transformer.synonyms);
							if (transformer.styleIds.indexOf(style) !== -1) {
								chosenStyle = style;
								return true;
							}
						}
						if (typeof style === "object" && style.default) {
							chosenStyle = transformer.styleDefaults[style.default];
							if (chosenStyle) {
								return true;
							}
						}
						return false;
					});
					pStyle = chosenStyle;
				}
				return `<w:p>
		<w:pPr>
		<w:pStyle w:val="${pStyle}"/>
		${
			numPr
				? `<w:numPr>
		<w:ilvl w:val="${level}"/>
		<w:numId w:val="${num}"/>
		</w:numPr>`
				: ""
		}
		${
			runProperties.length !== 0
				? `<w:rPr>${deduplicateRunProps(runProperties)}</w:rPr>`
				: "<w:rPr/>"
		}
		${parProps}
		</w:pPr>
		${flattenDeep(runs)
			.map(({ data }) => data)
			.join("")}
		</w:p>`;
			})
			.join("")
	);
}

function getChildParagraphs(childs, element) {
	let currentRuns = [];
	const paragraphs = [];
	function addRuns() {
		if (currentRuns.length > 0) {
			if (!every(currentRuns, (r) => r.whitespace)) {
				paragraphs.push({
					element,
					type: "paragraph",
					data: currentRuns,
				});
			}
			currentRuns = [];
		}
	}
	childs.forEach(function (child) {
		if (child.type === "run") {
			currentRuns.push(child);
		}
		if (child.type === "paragraph") {
			addRuns();
			paragraphs.push(child);
		}
	});
	addRuns();
	return paragraphs;
}

function getParagraphs({
	element,
	level,
	runProperties,
	props,
	transformer,
	customProperties,
	paragraphRunProperties,
}) {
	const { name, type } = element;
	const { hasTag, isBlock, isIgnored } = transformer.tagRepository;
	if (!Array.isArray(runProperties)) {
		throw new Error(`runProperties undefined, ${typeof runProperties}`);
	}
	if (type === "comment") {
		return [];
	}

	function handleChildren(element, props) {
		const result = element.children
			.map((children) => {
				if (children.name === "br") {
					const ie = isEndingText(children, transformer.rootEl);
					if (ie) {
						// Ignore the last <br> within a paragraph, and also return an empty paragraph when using `<p><br></p>`
						return runify("");
					}
				}
				children.paragraphTypes = element.paragraphTypes;
				return getParagraphs({
					level: level + 1,
					customProperties,
					element: children,
					props,
					runProperties,
					transformer,
					paragraphRunProperties,
				});
			})
			.filter((r) => r);
		return flattenDeep(result);
	}

	if (name) {
		if (isIgnored(name)) {
			return [];
		}
		addCustomProperties(element, transformer);
		props = addRunStyle({ element, props, transformer });
		for (let i = 0, len = tagHandlers.length; i < len; i++) {
			const { tag, functor } = tagHandlers[i];
			if (hasTag(name, tag)) {
				return functor(
					element,
					runProperties,
					transformer,
					props,
					customProperties,
					paragraphRunProperties
				);
			}
		}

		if (isBlock(name)) {
			transformer.rootEl = element;
			element.paragraphTypes = cloneDeep(element.paragraphTypes || []);
			element.bookmark = get(element, "attribs.id", false);
			addParagraphStyle({ element, transformer, customProperties });
			const childs = handleChildren(element, props);
			return getChildParagraphs(childs, element);
		}
	} else {
		props = addRunStyle({ element, props, transformer });
	}

	if (element.data != null) {
		element.data = clearWhitespace(element.data);

		const innerRun = getRElement(element.data, props, runProperties);
		const run = runify(innerRun);
		run[0].calc = function (text) {
			return getRElement(text, props, runProperties);
		};
		run[0].text = element.data;
		run[0].whitespace = isWhiteSpace(element.data);
		run[0].startsWhitespace = startsWhiteSpace(element.data);
		run[0].endsWhitespace = endsWhiteSpace(element.data);
		return run;
	}

	if (!element.children) {
		const error = new Error(
			"Error while fetching getParagraphs, could not find children"
		);
		error.properties = { element };
		throw error;
	}
	const data = runHandler({
		element,
		transformer,
		getRElement() {
			return runify(getRElement.apply(getRElement, arguments));
		},
		props,
	});
	if (data === null) {
		return handleChildren(element, props);
	}
	return runify(data);
}

module.exports = {
	getParagraphs,
	getRelationElement,
};
