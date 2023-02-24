const { max, get, last } = require("lodash");
const { str2xml } = require("docxtemplater").DocUtils;
const addListSupport = require("./add-list-support.js");
const { forEachStyleDeclaration, listStyleToNumFmt } = require("./style.js");
const { toDXA } = require("./size-converter.js");

const defaultBullets = ["", "o", "", "", "o", "", "", "o", ""];

const abbreviationToTypes = {
	1: "decimal",
	A: "upperLetter",
	a: "lowerLetter",
	I: "upperRoman",
	i: "lowerRoman",
};

class ListHandler {
	constructor({ xmlDocuments, tagRepository }) {
		this.xmlDocuments = xmlDocuments;
		this.tagRepository = tagRepository;
		this.listSupport = false;
	}
	addAbstractNum(element, transformer, abstractNum, numberingParent) {
		const start = element.attribs.start
			? parseInt(element.attribs.start, 10)
			: 1;
		const { name } = element;
		let marginLeft = 0;
		let numFmt;
		forEachStyleDeclaration(
			element,
			transformer,
			function ({ property, value }) {
				if (property === "margin-left") {
					marginLeft = toDXA(value, transformer);
				}
				if (property === "list-style-type") {
					if (listStyleToNumFmt[value]) {
						numFmt = listStyleToNumFmt[value];
					}
				}
			}
		);
		numFmt = abbreviationToTypes[element.attribs.type] || numFmt;
		numFmt ||= "decimal";

		const useCustomBullets = !!get(element, "customProperties.bullets");
		const bullets = get(element, "customProperties.bullets", defaultBullets);
		const lastBullet = last(bullets);
		function getBullet(i) {
			const bullet = bullets[i] || lastBullet;
			if (typeof bullet === "string") {
				return bullet;
			}
			return bullet.text;
		}
		function getColor(i) {
			if (typeof bullets[i] === "object" && bullets[i].color) {
				return `<w:color w:val="${bullets[i].color}"/>`;
			}
			return "";
		}
		function getSize(i) {
			if (typeof bullets[i] === "object" && bullets[i].size) {
				return `<w:sz w:val="${bullets[i].size * 2}"/>`;
			}
			return "";
		}
		function getRPr(i) {
			return getFont(i) + getColor(i) + getSize(i);
		}
		function getFont(i) {
			let font;
			if (typeof bullets[i] === "object" && bullets[i].font) {
				font = bullets[i].font;
			}
			if (!useCustomBullets) {
				switch (i % 3) {
					case 0:
						font = "Symbol";
						break;
					case 1:
						font = "Courier New";
						break;
					case 2:
						font = "Wingdings";
						break;
				}
			}
			if (!font) {
				return "";
			}
			if (font === "Wingdings" || font === "Symbol") {
				return `<w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:hint="default"/>`;
			}
			return `<w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}" w:hint="default"/>`;
		}
		function getLeft(level) {
			return 720 + 360 * level + marginLeft;
		}
		const ordered = this.tagRepository.getOrdered(name);
		let str;
		if (!ordered) {
			str = `<w:abstractNum xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" w:abstractNumId="${abstractNum}">
			<w:nsid w:val="5F6B5EB${abstractNum}"/>
			<w:multiLevelType w:val="hybridMultilevel"/>
			<w:tmpl w:val="21E2${abstractNum}4FE"/>
			<w:lvl w:ilvl="0" w:tplc="08090001">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="bullet"/>
			<w:lvlText w:val="${getBullet(0)}"/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:ind w:left="${getLeft(0)}" w:hanging="360"/>
			</w:pPr>
			<w:rPr>
			${getRPr(0)}
			</w:rPr>
			</w:lvl>
			<w:lvl w:ilvl="1" w:tplc="08090003" w:tentative="1">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="bullet"/>
			<w:lvlText w:val="${getBullet(1)}"/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:ind w:left="${getLeft(1)}" w:hanging="360"/>
			</w:pPr>
			<w:rPr>
			${getRPr(1)}
			</w:rPr>
			</w:lvl>
			<w:lvl w:ilvl="2" w:tplc="08090005" w:tentative="1">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="bullet"/>
			<w:lvlText w:val="${getBullet(2)}"/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:ind w:left="${getLeft(2)}" w:hanging="360"/>
			</w:pPr>
			<w:rPr>
			${getRPr(2)}
			</w:rPr>
			</w:lvl>
			<w:lvl w:ilvl="3" w:tplc="08090001" w:tentative="1">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="bullet"/>
			<w:lvlText w:val="${getBullet(3)}"/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:ind w:left="${getLeft(3)}" w:hanging="360"/>
			</w:pPr>
			<w:rPr>
			${getRPr(3)}
			</w:rPr>
			</w:lvl>
			<w:lvl w:ilvl="4" w:tplc="08090003" w:tentative="1">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="bullet"/>
			<w:lvlText w:val="${getBullet(4)}"/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:ind w:left="${getLeft(4)}" w:hanging="360"/>
			</w:pPr>
			<w:rPr>
			${getRPr(4)}
			</w:rPr>
			</w:lvl>
			<w:lvl w:ilvl="5" w:tplc="08090005" w:tentative="1">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="bullet"/>
			<w:lvlText w:val="${getBullet(5)}"/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:ind w:left="${getLeft(5)}" w:hanging="360"/>
			</w:pPr>
			<w:rPr>
			${getRPr(5)}
			</w:rPr>
			</w:lvl>
			<w:lvl w:ilvl="6" w:tplc="08090001" w:tentative="1">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="bullet"/>
			<w:lvlText w:val="${getBullet(6)}"/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:ind w:left="${getLeft(6)}" w:hanging="360"/>
			</w:pPr>
			<w:rPr>
			${getRPr(6)}
			</w:rPr>
			</w:lvl>
			<w:lvl w:ilvl="7" w:tplc="08090003" w:tentative="1">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="bullet"/>
			<w:lvlText w:val="${getBullet(7)}"/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:ind w:left="${getLeft(7)}" w:hanging="360"/>
			</w:pPr>
			<w:rPr>
			${getRPr(7)}
			</w:rPr>
			</w:lvl>
			<w:lvl w:ilvl="8" w:tplc="08090005" w:tentative="1">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="bullet"/>
			<w:lvlText w:val="${getBullet(8)}"/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:ind w:left="${getLeft(8)}" w:hanging="360"/>
			</w:pPr>
			<w:rPr>
			${getRPr(8)}
			</w:rPr>
			</w:lvl>
			</w:abstractNum>
			`;
		} else {
			str = `<w:abstractNum xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" w:abstractNumId="${abstractNum}" w15:restartNumberingAfterBreak="0">
			<w:lvl w:ilvl="0">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="${numFmt}"/>
			<w:lvlText w:val="%1."/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:tabs>
			<w:tab w:val="num" w:pos="${getLeft(0)}"/>
			</w:tabs>
			<w:ind w:left="${getLeft(0)}" w:hanging="360"/>
			</w:pPr>
			</w:lvl>
			<w:lvl w:ilvl="1">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="${numFmt}"/>
			<w:lvlText w:val="%2."/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:tabs>
			<w:tab w:val="num" w:pos="${getLeft(1)}"/>
			</w:tabs>
			<w:ind w:left="${getLeft(1)}" w:hanging="360"/>
			</w:pPr>
			</w:lvl>
			<w:lvl w:ilvl="2">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="${numFmt}"/>
			<w:lvlText w:val="%3."/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:tabs>
			<w:tab w:val="num" w:pos="${getLeft(2)}"/>
			</w:tabs>
			<w:ind w:left="${getLeft(2)}" w:hanging="360"/>
			</w:pPr>
			</w:lvl>
			<w:lvl w:ilvl="3">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="${numFmt}"/>
			<w:lvlText w:val="%4."/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:tabs>
			<w:tab w:val="num" w:pos="${getLeft(3)}"/>
			</w:tabs>
			<w:ind w:left="${getLeft(3)}" w:hanging="360"/>
			</w:pPr>
			</w:lvl>
			<w:lvl w:ilvl="4">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="${numFmt}"/>
			<w:lvlText w:val="%5."/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:tabs>
			<w:tab w:val="num" w:pos="${getLeft(4)}"/>
			</w:tabs>
			<w:ind w:left="${getLeft(4)}" w:hanging="360"/>
			</w:pPr>
			</w:lvl>
			<w:lvl w:ilvl="5">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="${numFmt}"/>
			<w:lvlText w:val="%6."/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:tabs>
			<w:tab w:val="num" w:pos="${getLeft(5)}"/>
			</w:tabs>
			<w:ind w:left="${getLeft(5)}" w:hanging="360"/>
			</w:pPr>
			</w:lvl>
			<w:lvl w:ilvl="6">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="${numFmt}"/>
			<w:lvlText w:val="%7."/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:tabs>
			<w:tab w:val="num" w:pos="${getLeft(6)}"/>
			</w:tabs>
			<w:ind w:left="${getLeft(6)}" w:hanging="360"/>
			</w:pPr>
			</w:lvl>
			<w:lvl w:ilvl="7">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="${numFmt}"/>
			<w:lvlText w:val="%8."/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:tabs>
			<w:tab w:val="num" w:pos="${getLeft(7)}"/>
			</w:tabs>
			<w:ind w:left="${getLeft(7)}" w:hanging="360"/>
			</w:pPr>
			</w:lvl>
			<w:lvl w:ilvl="8">
			<w:start w:val="${start}"/>
			<w:numFmt w:val="${numFmt}"/>
			<w:lvlText w:val="%9."/>
			<w:lvlJc w:val="left"/>
			<w:pPr>
			<w:tabs>
			<w:tab w:val="num" w:pos="${getLeft(8)}"/>
			</w:tabs>
			<w:ind w:left="${getLeft(8)}" w:hanging="360"/>
			</w:pPr>
			</w:lvl>
			</w:abstractNum>`;
		}
		numberingParent.insertBefore(
			str2xml(str).childNodes[0],
			numberingParent.firstChild
		);
		return abstractNum;
	}
	addListSupport(transformer) {
		if (this.listSupport) {
			return;
		}
		addListSupport(this.xmlDocuments, transformer.mainRelsFile);
	}
	addList(element, transformer) {
		// We create a new list for each "ul", "ol", ... because else, the numbering would go like this :
		//
		// 1. Go to the mall
		// 2. Buy some tea
		//
		// Other unrelated content
		//
		// 3. Take a nap
		//
		// Obviously we want the numbering to restart for each list, this is why there is no "caching"
		const numberingDoc = this.xmlDocuments["word/numbering.xml"];
		const numberingParent = numberingDoc.getElementsByTagName("w:numbering")[0];

		let nums = numberingParent.getElementsByTagName("w:num");
		nums = Array.prototype.map.call(nums, function (n) {
			return parseInt(n.getAttribute("w:numId"), 10);
		});
		nums.push(0);
		const num = max(nums) + 1;
		const abstractNum = this.addAbstractNum(
			element,
			transformer,
			num,
			numberingParent
		);

		const numToAbstractNum = `<w:num xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:numId="${num}">
			<w:abstractNumId w:val="${abstractNum}"/>
		</w:num>
		`;

		numberingParent.appendChild(str2xml(numToAbstractNum).childNodes[0]);
		return num;
	}
}
module.exports = ListHandler;
