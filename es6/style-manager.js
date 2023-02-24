const stylePath = "word/styles.xml";
const { str2xml, xml2str } = require("docxtemplater").DocUtils;
/* eslint-disable import/no-unresolved */
const baseStylesText = require("../static/styles.xml.js");
const { reversedSynonyms } = require("./synonyms.js");
/* eslint-enable import/no-unresolved */

module.exports = class StyleManager {
	constructor(xmlDocuments) {
		this.xmlDocuments = xmlDocuments;
		this.stylesXml = this.xmlDocuments[stylePath];
		this.styles = this.stylesXml.getElementsByTagName("w:styles")[0];
		this.usedSynonyms = {};
		this.styleIds = [];
	}
	getDefaultStyles() {
		const s = this.stylesXml.getElementsByTagName("w:style");
		const list = Array.prototype.slice.call(s);
		return list
			.map(function (element) {
				return {
					type: element.getAttribute("w:type"),
					default: element.getAttribute("w:default"),
					styleId: element.getAttribute("w:styleId"),
				};
			})
			.filter(function (o) {
				return o.default;
			})
			.reduce(function (defaults, { type, styleId }) {
				defaults[type] = styleId;
				return defaults;
			}, {});
	}

	addStyles() {
		const baseStylesXml = str2xml(baseStylesText);
		const s = this.stylesXml.getElementsByTagName("w:style");
		const list = Array.prototype.slice.call(s);
		const styleIds = list.map(function (element) {
			return element.getAttribute("w:styleId");
		});
		this.styleIds = list.map(function (element) {
			return element.getAttribute("w:styleId");
		});
		const styleNames = list.map(function (element) {
			const names = element.getElementsByTagName("w:name");
			if (names.length !== 0) {
				return names[0].getAttribute("w:val");
			}
		});
		const styleArr = [];
		list.forEach(function (baseStyle) {
			const key = baseStyle.getAttribute("w:styleId");
			const name = baseStyle
				.getElementsByTagName("w:name")[0]
				?.getAttribute("w:val");
			styleArr.push({ key, name });
		});

		const baseStyles = Array.prototype.slice.call(
			baseStylesXml.getElementsByTagName("w:style")
		);
		baseStyles.forEach(function (baseStyle) {
			const key = baseStyle.getAttribute("w:styleId");
			const name = baseStyle
				.getElementsByTagName("w:name")[0]
				.getAttribute("w:val");
			const rSynonyms = reversedSynonyms[key];
			if (
				[
					"HeadingCar",
					"Heading1Car",
					"Heading2Car",
					"Heading3Car",
					"Heading4Car",
					"Heading5Car",
					"CitationCar",
				].indexOf(key) !== -1
			) {
				const mainKey = key.replace("Car", "");
				if (styleIds.indexOf(mainKey) !== -1) {
					return;
				}
			}
			if (rSynonyms) {
				for (let i = 0, len = rSynonyms.length; i < len; i++) {
					if (styleIds.indexOf(rSynonyms[i]) !== -1) {
						this.usedSynonyms[key] = rSynonyms[i];
						return;
					}
				}
			}
			if (styleIds.indexOf(key) !== -1) {
				return;
			}
			if (styleNames.indexOf(name) !== -1) {
				styleArr.forEach((styleObj) => {
					if (styleObj.name === name) {
						this.usedSynonyms[key] = styleObj.key;
					}
				});
				return;
			}
			function translator(tagName, usedSynonyms) {
				const attributeValue = baseStyle
					.getElementsByTagName(tagName)[0]
					?.getAttribute("w:val");
				if (attributeValue) {
					const newBasedOn = usedSynonyms[attributeValue];
					if (newBasedOn) {
						baseStyle
							.getElementsByTagName(tagName)[0]
							.setAttribute("w:val", newBasedOn);
					}
				}
			}

			translator("w:basedOn", this.usedSynonyms);
			translator("w:link", this.usedSynonyms);
			translator("w:next", this.usedSynonyms);

			this.styleIds.push(key);
			this.styles.appendChild(str2xml(xml2str(baseStyle)).childNodes[0]);
		}, this);
	}
};
