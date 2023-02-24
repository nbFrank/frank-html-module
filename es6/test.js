const expect = require("chai").expect;
const path = require("path");
const Errors = require("docxtemplater/js/errors.js");
const {
	shouldBeSame,
	setExamplesDirectory,
	createDoc,
	setStartFunction,
	start,
	expectToThrow,
	imageData,
	createDocV4,
} = require("docxtemplater/js/tests/utils.js");
const { repeat } = require("lodash");
const sizeOf = require("image-size");

function base64DataURLToArrayBuffer(dataURL) {
	const stringBase64 = dataURL.replace(/^data:image\/([a-z]+);base64,/, "");
	let binaryString;
	if (typeof window !== "undefined") {
		binaryString = window.atob(stringBase64);
	} else {
		binaryString = Buffer.from(stringBase64, "base64").toString("binary");
	}
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		const ascii = binaryString.charCodeAt(i);
		bytes[i] = ascii;
	}
	return bytes.buffer;
}

function resolveSoon(data) {
	return new Promise(function (resolve) {
		setTimeout(function () {
			resolve(data);
		}, 1);
	});
}

const HtmlModule = require("./index.js");
const {
	fontWeight,
	fontFamily,
	allHeadings,
	backgroundColorParagraph,
	base64GIFIMage,
	listsWithMargins,
	listsWithTopBotomMargins,
	base64JPEGImage,
	base64PNGImage,
	blockquoteJustified,
	blockquotes,
	lorem,
	checkbox,
	checkboxWithLabel,
	specialInputs,
	colorStyles,
	escapedChars,
	fontSizes,
	tableAlignedCenter,
	tableAlignedRight,
	tableMargin0,
	tableMargin100,
	tableStyleTh,
	fullTable,
	preformattedText,
	headings,
	inlineStyle,
	links,
	links2,
	linksWithBookMarks,
	linksWithNames,
	linksWithNoText,
	spaceRegression,
	mixed,
	mixed2,
	mixed3,
	mixed4,
	mixed5,
	nestedLists,
	nestedListsMixed,
	nestedOrderedList,
	oLists,
	marginPaddingLeft,
	paragraphsClassed,
	paragraphsDiv,
	paragraphMargin,
	paragraphLineHeight,
	negativeTextIndent,
	svgImage,
	tableBackgroundColor,
	tableWithULWithoutLi,
	tableColoredText,
	tableClassed,
	tableColSpan,
	tableRowSpan,
	tableColRowSpan,
	tableColRowMulti,
	multiTableRowSpan,
	complexRowSpan,
	oneRowSpan,
	tableColSpanNoWidth,
	tableColSpanNoWidth2,
	tableColSpanWidthStylePrecedence,
	tableColoredBorders,
	tableColSpanOneRow,
	tableWithPtWidth,
	tableWithSpecialUnits,
	tableWithWrongUnit,
	tableComplex,
	divNestedUncentered,
	tableImplicitParagraphs,
	tableImplicitParagraphs2,
	tableImplicitParagraphsStyled,
	tableVerticalAlignTd,
	tableHello,
	tableSimple,
	tableWithPadding,
	tableWithPadding0,
	insAndDel,
	tableWithoutBorder,
	tableWithoutTbody,
	tableColored,
	textAligns,
	titles,
	uLists,
} = require("./fixtures.js");

function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function getString(data, encoding) {
	if (encoding) {
		return Buffer.from(data, "binary").toString(encoding);
	}
	if (encoding) {
		return data.toString(encoding);
	}
	if (data instanceof ArrayBuffer) {
		return ab2str(data);
	}
	return data.toString();
}
let imageModule;
try {
	imageModule = require("../../image/es6/index.js");
} catch (e) {
	/* eslint-disable no-console */
	console.log(JSON.stringify({ msg: "Image module tests skipped" }));
	/* eslint-enable no-console */
}

let async, options, expectedText, name, data, expectedName, v4, modules;

function testStart() {
	beforeEach(function () {
		async = false;
		options = {};
		name = null;
		data = null;
		expectedText = null;
		v4 = false;
		modules = [];
		this.loadAndRender = function () {
			if (modules.length === 0) {
				modules.push(new HtmlModule(options));
			}
			if (v4) {
				this.doc = createDocV4(name, { modules });
			} else {
				this.doc = createDoc(name);
				modules.forEach((module) => {
					this.doc.attachModule(module);
				});
			}
			if (async) {
				return this.doc.renderAsync(data).then(() => {
					shouldBeSame({ doc: this.doc, expectedName });
				});
			}
			this.doc.render(data);
			if (expectedText !== null) {
				expect(this.doc.getFullText()).to.equal(expectedText);
			}
			shouldBeSame({ doc: this.doc, expectedName });
		};
	});

	describe("Adding with {%html} syntax", function () {
		it("should not change style if module not used", function () {
			name = "nohtml.docx";
			expectedName = "nohtml-exp.docx";
			data = {};
			return this.loadAndRender();
		});

		it("should work with constructor v4", function () {
			v4 = true;
			name = "nohtml.docx";
			expectedName = "nohtml-exp.docx";
			data = {};
			return this.loadAndRender();
		});

		it("should work when setting prefix to empty string", function () {
			v4 = true;
			name = "tag-example.docx";
			expectedName = "expected-tag-example.docx";
			const mod = new HtmlModule(options);
			mod.prefix = "";
			modules = [mod];
			data = {
				first_name: "<span style='color: blue; font-weight: bold;'>blue</span>",
				last_name: "Hi",
				phone: "003345345544",
			};
			return this.loadAndRender();
		});

		it("should work when using using a longer prefix for inline", function () {
			v4 = true;
			name = "prefix-changed.docx";
			expectedName = "expected-prefix-ok.docx";
			const mod = new HtmlModule(options);
			mod.prefix = "!!";
			mod.blockPrefix = "!";
			modules = [mod];
			data = {
				first_name: "<span style='color: blue; font-weight: bold;'>blue</span>",
				table: `<table>
					<tr>
						<td>Hello</td>
						<td>World</td>
					</tr>
				</table>
				`,
			};
			return this.loadAndRender();
		});

		it("should work for simple expectedhtmlExample", function () {
			name = "html-example.docx";
			expectedName = "expectedhtml-example.docx";
			data = {
				html: "Foo",
			};
			return this.loadAndRender();
		});

		it("should work to customize pstyle", function () {
			name = "html-block-example.docx";
			expectedName = "expected-pre-pstyle.docx";

			options.elementCustomizer = function ({ name }) {
				if (name === "pre") {
					return { pStyle: "Caption" };
				}
			};
			data = {
				html: "<pre>Hello world</p>",
			};
			return this.loadAndRender();
		});

		it("should work with multiprops expectedMultiPropshtmlExample", function () {
			name = "html-example.docx";
			expectedName = "expected-multi-props-html-example.docx";
			data = {
				html: "Nothing<b>1<u>2<i>3Foo</i>Bar</u>Baz</b>5",
			};
			return this.loadAndRender();
		});

		it("should work with loops expectedhtmlLoop", function () {
			name = "html-loop.docx";
			expectedName = `expected${name}`;
			data = {
				html: "<p>Hello<span> Foo</span><b>how, are you ? </b><u>Im fine thank you.</u><i> Good bye</i></p>",
			};
			return this.loadAndRender();
		});

		it("should work for complex expectedComplexLoophtmlExample", function () {
			const html =
				"Hello<b> bold</b> <span> Foo</span> <b>how, are you ? </b> <u>I'm fine thank you.</u> <i> Good bye</i>";

			name = "html-example.docx";
			expectedName = "expected-complex-loop-html-example.docx";
			data = {
				html,
			};
			return this.loadAndRender();
		});

		it("should work with ins and del tags", function () {
			name = "html-example.docx";
			expectedName = "expected-ins-del.docx";
			data = {
				html: insAndDel,
			};
			return this.loadAndRender();
		});

		it("should not use table width attribute when width === 0", function () {
			const html = `
			<table border='1' cellpadding='0' cellspacing='0' width='0'>
			<thead>
			<tr>
			<td style='width: 380.6pt;vertical-align: top;' valign='top' width='100%'>
			<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
			</p>
			</td>
			</tr>
			</thead>
			</table>
			<p>
			Sunt in culpa qui officia deserunt mollit anim id est laborum.
			</p>
			`;

			name = "html-block-example.docx";
			expectedName = "expected-table-0-width.docx";
			data = {
				html,
			};
			return this.loadAndRender();
		});

		it("should work with complex loops expectedhtmlComplex", function () {
			name = "html-complex.docx";
			expectedName = `expected${name}`;
			const mergedJson = {};
			mergedJson.html =
				"Hello<span> Foo</span><b>how, are you ? </b><u>Im fine thank you.</u><i> Good bye</i>";
			const something = [];
			something.push({
				a: "test",
				b: '<w:p><w:pPr> <w:jc w:val="left"/> </w:pPr><w:r><w:t>For some reason this is not showing up</w:t></w:r></w:p>',
			});
			something.push({
				a: "test2",
				b: '<w:p><w:pPr> <w:jc w:val="left"/> </w:pPr><w:r><w:t>For some reason this is not showing up2</w:t></w:r></w:p>',
			});
			mergedJson.something = something;
			data = mergedJson;
			return this.loadAndRender();
		});

		it("should work when having block tags inside inline-tags", function () {
			name = "html-block-example.docx";
			expectedName = "expected-one-word-per-paragraph.docx";
			data = {
				html: `<p>
					Hello
					<p>Foobar</p>
					<span>Dang <span><p>Space</p>Booh<p>Ding</p></span> Dong</span>
					</p>`,
			};
			return this.loadAndRender();
		});

		it("should work with blocks expectedhtmlBlockExample", function () {
			name = "html-block-example.docx";
			expectedName = `expected${name}`;
			data = { html: titles };
			return this.loadAndRender();
		});

		it("should not corrupt document with empty 'table'", function () {
			name = "html-block-example.docx";
			expectedName = "expected-empty-table.docx";
			data = { html: "<p>Hello</p><table></table><p>Ho</p>" };
			return this.loadAndRender();
		});

		it("should not drop space between inline elements", function () {
			name = "html-block-example.docx";
			expectedName = "expected-html-space-between-inline.docx";
			data = { html: "<b>bold</b> <i>italic</i>" };
			return this.loadAndRender();
		});

		it("should not corrupt document with empty 'tr'", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-empty-tr.docx";
			data = {
				html: "<p>Hello</p><table><tbody><tr></tr></tbody></table><p>Ho</p>",
			};
			return this.loadAndRender();
		});

		it("should work with br inside p to create an empty paragraph", function () {
			name = "html-block-example.docx";
			expectedName = "expected-br-p.docx";
			data = {
				html: `
				<p>Empty</p>
				<p><br/></p>
				<p>Empty</p>
				<p></p>
				<p>Empty</p>
				<p>.</p>
				<p>Empty</p>
				<p><br/><br/><p>
				<p>Empty</p>
				`,
			};
			return this.loadAndRender();
		});

		it("should be possible to set th to repeat across pages", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-repeat.docx";
			data = {
				html: `
				<table>
					<tr class="header">
						<td>Head1</td>
						<td>Head2</td>
					</tr>
					<tr class="header">
						<td>Head3</td>
						<td>Head4</td>
					</tr>
					${repeat(`<tr><td>${lorem}</td><td>${lorem}</td></tr>`, 17)}
				</table>
				`,
			};
			options.elementCustomizer = function (element) {
				if (element.matches("tr.header")) {
					return {
						cantSplit: true,
						repeatHeaderRow: true,
					};
				}
				if (element.matches("tr")) {
					return {
						cantSplit: true,
					};
				}
			};
			options.styleSheet = `
				tr.header {
					background-color: #777777;
				}
			`;
			return this.loadAndRender();
		});

		it("should work with br at end of block tag", function () {
			name = "html-block-example.docx";
			expectedName = "expected-br-block.docx";
			data = {
				html: `
					<p>paragraph 1 - No br</p>
					<p>paragraph 2 - <br/ >1 br in the middle</p>
					<p>paragraph 3 - 1 br at the end<br /></p>
					<p>paragraph 4 - 2 br at the end<br /><br /></p>
					<p>paragraph 5 - 2 BR - <a href="https://www.google.com">with link<br><br /></a></p>
					<p>paragraph 6 - 1 BR - <a href="https://www.google.com">with link<br /></a></p>
				`,
			};
			return this.loadAndRender();
		});

		it("should work with br mixed with link", function () {
			name = "html-block-example.docx";
			expectedName = "expected-br-mixed-link.docx";
			data = {
				html: `
				<p>paragraph 5 - 2 BR - <a href="https://www.google.com">with mixed link<br /></a><br></p>
				<p>END</p>
				`,
			};
			return this.loadAndRender();
		});

		it("should work with br at end of li tag", function () {
			name = "html-block-example.docx";
			expectedName = "expected-br-list.docx";
			data = {
				html: `
				<ul>
					<li>list 1 - No br</li>
					<li>list 2 - <br /> 1 br in the middle</li>
					<li>list 3 - 1 br at the end<br /></li>
					<li>list 3 - 1 br at the end<br /></li>
					<li>list 4 - 2 br at the end<br /><br /></li>
					<li>list 5</li>
					<li>list 6 - 2 BR - <a href="https://www.google.com">with link<br /><br></a></li>
					<li>list 7 - 2 BR - <a href="https://www.google.com">with mixed link<br /></a><br></li>
					<li>list 8</li>
				</ul>
				`,
			};
			return this.loadAndRender();
		});

		it("should work with <p><br></p>", function () {
			name = "html-block-example.docx";
			expectedName = "expected-br-inside-p.docx";
			data = {
				html: `
				<p>Hello</p>
				<p>foobar  <br>   </p>
				<p>Ho</p>
				<p>  fooo<br>	<b></b> <span></span>  </p>
				<p>Hi</p>
				`,
			};
			return this.loadAndRender();
		});

		it("should work with implicit paragraph with br", function () {
			name = "html-block-example.docx";
			expectedName = "expected-br-inside-implicit-p.docx";
			data = {
				html: `
				<p>Hello</p>
				<br>
				<p>Ho</p>
				<br>
				<p>Hi</p>
				`,
			};
			return this.loadAndRender();
		});

		it("should work with br at end of h1-h6 tag", function () {
			name = "html-block-example.docx";
			expectedName = "expected-br-headings.docx";
			data = {
				html: `<h1>h1 - example</h1>
   <br>
<h2>h2 - example</h2>
   <br>
<h3>h3 - example</h3>
   <br>
<h4>h4 - example</h4>
   <br>
<h5>h5 - example</h5>
   <br>
<h6>h6 - example</h6>
   <br>`,
			};
			return this.loadAndRender();
		});

		it("should work with inline code tag", function () {
			name = "html-block-example.docx";
			expectedName = "expected-code.docx";
			data = { html: "<p>Hello <code>foo</code></p>" };
			return this.loadAndRender();
		});

		it("should work with block code tag", function () {
			name = "html-block-example.docx";
			expectedName = "expected-code-block.docx";
			data = { html: "<p>Hello</p><code>foo</code>" };
			return this.loadAndRender();
		});

		it("should work with pre tag", function () {
			name = "html-block-example.docx";
			expectedName = "expected-pre-block.docx";
			data = { html: preformattedText };
			return this.loadAndRender();
		});

		it("should work with pre tag with highlight", function () {
			name = "html-block-example.docx";
			expectedName = "expected-pre-block-gray.docx";
			data = { html: preformattedText };

			options = {
				styleSheet: `pre {
					background-color: #dddddd;
				}
				`,
			};
			return this.loadAndRender();
		});

		it("should work with inline style color", function () {
			name = "html-example.docx";
			expectedName = "expected-inline-style.docx";
			data = { html: inlineStyle };
			return this.loadAndRender();
		});

		it("should work with block escaped chars", function () {
			name = "html-block-example.docx";
			expectedName = "expected-escaped-chars-block.docx";
			data = { html: escapedChars };
			return this.loadAndRender();
		});

		it("should work with inline escaped chars", function () {
			name = "html-example.docx";
			expectedName = "expected-escaped-chars-inline.docx";
			data = { html: escapedChars };
			return this.loadAndRender();
		});

		it("should work with links 1", function () {
			name = "html-example.docx";
			expectedName = "expected-links-1.docx";
			data = { html: links };
			return this.loadAndRender();
		});

		it("should work with links and bookmarks", function () {
			name = "bookmark-links-input.docx";
			expectedName = "expected-bookmark-links.docx";
			data = { html: linksWithBookMarks };
			return this.loadAndRender();
		});

		it("should work with links and linked names", function () {
			name = "bookmark-links-input.docx";
			expectedName = "expected-linked-names.docx";
			data = { html: linksWithNames };
			return this.loadAndRender();
		});

		it("should work with text-align", function () {
			name = "html-block-example.docx";
			expectedName = "expected-text-align.docx";
			data = { html: textAligns };
			return this.loadAndRender();
		});

		it("should work with text-align in table when paragraph is left-aligned explicitly", function () {
			name = "html-block-left-align.docx";
			expectedName = "expected-text-align-regression.docx";
			data = {
				html: `<table style="width:100%">
<tbody>
<tr><td style="text-align:right; width: 100px;">Right aligned</td></tr>
<tr><td style="text-align:left; width: 100px;">Left aligned</td></tr>
<tr><td style="text-align:center; width: 100px;">Center aligned</td></tr>
</tbody>
</table>
`,
			};
			return this.loadAndRender();
		});

		it("should work with nested lists", function () {
			name = "html-block-example.docx";
			expectedName = "expected-nested-list.docx";
			data = { html: nestedLists };
			return this.loadAndRender();
		});

		it("should work when using ol start='3'", function () {
			name = "html-block-example.docx";
			expectedName = "expected-list-start-3.docx";
			data = {
				html: `
				<ol start="3">
					<li>Q3</li>
					<li>Q4</li>
				</ol>
			`,
			};
			return this.loadAndRender();
		});

		it("should work with nested lists on office365 doc", function () {
			name = "office365.docx";
			expectedName = "expected-nested-list-365.docx";
			data = { html: nestedLists };
			return this.loadAndRender();
		});

		it("should keep initial style", function () {
			name = "reuse_style.docx";
			data = {
				html: "<p>Hello<span> Foo</span><b>how, are you ? </b><u>Im fine thank you.</u><i> Good bye</i></p>",
			};
			expectedName = "expected_reuse_style.docx";
			return this.loadAndRender();
		});

		it("should keep heading styles", function () {
			name = "font-test.docx";
			expectedName = "expectedfont-test.docx";
			data = {
				heading: "<h1>Added heading</h1>",
			};
			return this.loadAndRender();
		});
		it("should keep run style for {~html}", function () {
			name = "reuse_style_inline.docx";
			expectedName = "expected_reuse_style_inline.docx";
			data = {
				html: "foo<br>bar<br>baz<br>bang",
			};
			return this.loadAndRender();
		});

		it("should keep alignment paragraph", function () {
			name = "keep-alignment.docx";
			expectedName = "expected-keep-alignment.docx";
			data = {
				html: `<span>foo foo foo foo foo foo foo foo foo foo foofoo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo foo fooo foo foo foo foo foo foo foo foo foo foo foo</span>
				`,
			};
			return this.loadAndRender();
		});

		it("should work with checkbox", function () {
			name = "html-example.docx";
			expectedName = "expected-checkbox.docx";
			data = { html: checkbox };
			return this.loadAndRender();
		});

		it("should work with checkbox and label", function () {
			name = "html-example.docx";
			expectedName = "expected-checkbox-label.docx";
			data = { html: checkboxWithLabel };
			return this.loadAndRender();
		});

		it("should work with hidden input and text input", function () {
			name = "html-block-example.docx";
			expectedName = "expected-special-input.docx";
			data = { html: specialInputs };
			return this.loadAndRender();
		});

		it("should work with paragraph background-color", function () {
			name = "html-block-example.docx";
			expectedName = "expected-background-color-paragraph.docx";
			data = { html: backgroundColorParagraph };
			return this.loadAndRender();
		});

		it("should work with colors and table borders", function () {
			name = "html-block-example.docx";
			expectedName = "expected-colored.docx";
			data = { html: colorStyles };
			return this.loadAndRender();
		});

		it("should work with sub and sup", function () {
			name = "html-example.docx";
			expectedName = "expected-sub-sup.docx";
			data = {
				html: "The chemical formula of water: H<sub>2</sub>O <br>e<sup>x</sup> is a function",
			};
			return this.loadAndRender();
		});

		it("should work with underline", function () {
			name = "html-example.docx";
			expectedName = "expected-underline.docx";
			data = {
				html: '<u>Test</u> <span style="text-decoration: underline;">Test2</span>',
			};
			return this.loadAndRender();
		});

		it("should fail with unknown tags", function () {
			name = "html-block-example.docx";
			expectedName = "expected-unknown-tag-span.docx";
			data = {
				html: "<myFunkyTag>Foo</myFunkyTag>",
			};
			const expectedError = {
				name: "RenderingError",
				message: "Tag myfunkytag not supported",
				properties: {
					id: "html_tag_name_unsupported",
					name: "myfunkytag",
				},
			};
			expectToThrow(
				this.loadAndRender.bind(this),
				Errors.RenderingError,
				expectedError
			);
		});

		it("should transform unknown tags to span when ignoreUnknownTags set", function () {
			name = "html-block-example.docx";
			options.ignoreUnknownTags = true;
			expectedName = "expected-unknown-tag-span.docx";
			data = {
				html: "<myFunkyTag>Foo</myFunkyTag>",
			};
			return this.loadAndRender();
		});

		it("should apply style to unknown tags", function () {
			name = "html-block-example.docx";
			options.ignoreUnknownTags = true;
			expectedName = "expected-unknown-tag-styled.docx";
			data = {
				html: "<myFunkyTag>Foo</myFunkyTag>",
			};
			options.styleSheet = `
				myFunkyTag { font-size: 80px; color: red; }
				`;
			return this.loadAndRender();
		});

		it("should work with headings", function () {
			name = "html-block-example.docx";
			expectedName = "expected-headings.docx";
			data = {
				html: headings,
			};
			return this.loadAndRender();
		});

		it("should parse style tags with column", function () {
			name = "html-block-example.docx";
			expectedName = "expected-style-column.docx";
			data = {
				html: '<div style="background-color&#58;red;">Foo</div>',
			};
			return this.loadAndRender();
		});

		it("should work with blockquote", function () {
			name = "html-block-example.docx";
			expectedName = "expected-blockquote.docx";
			data = { html: blockquotes };
			return this.loadAndRender();
		});

		it("should work with blockquote justified", function () {
			name = "html-block-example.docx";
			expectedName = "expected-blockquote-justified.docx";
			data = { html: blockquoteJustified };
			return this.loadAndRender();
		});
	});

	describe("CSS Ignore option", function () {
		it("should work", function () {
			name = "html-block-example.docx";
			expectedName = "expected-spacing.docx";
			options.ignoreCssErrors = true;
			data = {
				html: '<p style="text-align: left; margin-top; vertical-align: top;"><b>t1</b> <em>t2</em></p>',
			};
			return this.loadAndRender();
		});
	});

	describe("Bullets", function () {
		it("should work with ul", function () {
			name = "html-block-example.docx";
			expectedName = "expected-u-list.docx";
			data = { html: uLists };
			return this.loadAndRender();
		});

		it("should work with ol", function () {
			name = "html-block-example.docx";
			expectedName = "expected-o-list.docx";
			data = { html: oLists };
			return this.loadAndRender();
		});

		it("should show bullets", function () {
			data = {
				test: `<ol>
				<li>Test
					<ul>
						<li>Test
							<ol>
								<li>Test</li>
							</ol>
						</li>
					</ul>
				</li>
				</ol>`,
			};
			name = "bullet-input.docx";
			expectedName = "expected-bullet.docx";
			return this.loadAndRender();
		});

		it("should work with ol and ul mixed", function () {
			name = "html-block-example.docx";
			expectedName = "expected-mixed-list.docx";
			data = {
				html: oLists + uLists + oLists + uLists,
			};
			return this.loadAndRender();
		});

		it("should work with ul and ol mixed and nested", function () {
			name = "html-block-example.docx";
			expectedName = "expected-nested-list-mixed.docx";
			data = {
				html: nestedListsMixed,
			};
			return this.loadAndRender();
		});

		it("should work with nested ordered lists (<ol>)", function () {
			name = "html-block-example.docx";
			expectedName = "expected-nested-ol.docx";
			options = {
				styleSheet: `
				ol {
					list-style-type: upper-alpha;
				}
				ol.roman {
					list-style: url("../img/etoile.jpeg") outside upper-roman;
				}
				`,
			};
			data = {
				html: nestedOrderedList,
			};
			return this.loadAndRender();
		});

		it("should work with bullet list", function () {
			name = "bullet-list.docx";
			expectedName = "expectedbullet-list.docx";
			data = {
				inline: inlineStyle,
			};
			return this.loadAndRender();
		});

		it("should not bug with bullets", function () {
			name = "bullet-bug.docx";
			expectedName = "expected-bullet-bug.docx";
			data = {
				html: "<h1>Foo</h1>",
				has_section: true,
				bullets: [
					{
						data: "Bullet 1",
					},
					{
						data: "Bullet 2",
					},
					{
						data: "Bullet 3",
					},
				],
			};
			return this.loadAndRender();
		});

		it("should be possible to customize bullet text", function () {
			name = "html-block-example.docx";
			expectedName = "expected-u-list-custom.docx";
			data = { html: nestedLists };

			options = {
				elementCustomizer(element) {
					if (element.matches("ul")) {
						return {
							bullets: ["·", "-", "+"],
						};
					}
				},
			};
			return this.loadAndRender();
		});

		it("should be possible to customize bullet color", function () {
			name = "html-block-example.docx";
			expectedName = "expected-u-list-custom-color.docx";
			data = { html: nestedLists };

			options = {
				elementCustomizer(element) {
					if (element.matches("ul")) {
						return {
							bullets: [
								{
									text: " ",
									font: "Wingdings",
									color: "FF0000",
								},
								{
									text: "-",
									color: "00FF00",
								},
								{
									text: "+",
									size: 30,
									color: "0000FF",
								},
							],
						};
					}
				},
			};
			return this.loadAndRender();
		});

		it("should be possible to have bullets with margin-left", function () {
			name = "html-block-example.docx";
			expectedName = "expectedbullet-margin-list.docx";
			options.deviceWidth = 1000;
			data = {
				html: listsWithMargins,
			};
			return this.loadAndRender();
		});

		it("should be possible to have bullets with margin-top-bottom", function () {
			name = "html-block-example.docx";
			expectedName = "expectedbullet-margin-list-top.docx";
			options.deviceWidth = 1000;
			data = {
				html: listsWithTopBotomMargins,
			};
			return this.loadAndRender();
		});

		it("should be possible to set numPr with oneOf", function () {
			name = "bullet-pstyle.docx";
			expectedName = "expected-dynamic-numpr.docx";
			let sd = null;
			let si = null;

			options.elementCustomizer = function ({ name, styleDefaults, styleIds }) {
				if (name === "ul") {
					si = styleIds;
					sd = styleDefaults;
					if (styleIds.indexOf("MyListStyle") !== -1) {
						return { pStyle: "MyListStyle", useNumPr: false };
					}
					if (styleIds.indexOf("MyOtherStyle") !== -1) {
						return { pStyle: "MyOtherStyle", useNumPr: false };
					}
					return { useNumPr: true };
				}
			};

			data = {
				scope: `<ol>
					<li>Lorem</li>
					<ul>
						<li>Ipsum</li>
						<li>Dolor</li>
					</ul>
					<ol style='margin-left:40px'>
					<li>Sit</li>
					<li>Amet</li>
					</ol>
					<li>Foo</li>
					<li>Bar</li>
				</ol>`,
			};

			this.loadAndRender();
			expect(sd.paragraph).to.equal("Normal");
			expect(si.length).to.equal(35);
			expect(si[0]).to.equal("Normal");
			expect(si[2]).to.equal("Tablanormal");
		});

		it("should be possible to customize pstyle bullets with oneOf", function () {
			name = "bullet-pstyle.docx";
			expectedName = "expected-bullet-pstyle.docx";
			options.deviceWidth = 1000;
			let si = null;
			options.styleTransformer = function (tags, docStyles, { styleIds }) {
				si = styleIds;
				tags.ul.data.pStyle = {
					oneOf: ["Prrafodelista", { default: "paragraph" }],
				};
				tags.ol.data.pStyle = {
					oneOf: ["Prrafodelista", { default: "paragraph" }],
				};
				return tags;
			};
			data = {
				scope: `<ol>
					<li>Lorem</li>
					<ul>
						<li>Ipsum</li>
						<li>Dolor</li>
					</ul>
					<ol style='margin-left:40px'>
					<li>Sit</li>
					<li>Amet</li>
					</ol>
					<li>Foo</li>
					<li>Bar</li>
				</ol>`,
			};
			this.loadAndRender();
			expect(si.length).to.equal(35);
			expect(si).to.contain("TextBody");
			expect(si).to.contain("Heading");
			expect(si).to.contain("Heading1Car");
		});

		it("should not regress when using more list levels than are defined in pStyle", function () {
			name = "bullet-pstyle.docx";
			expectedName = "expected-bullet-pstyle-overflow.docx";
			options.styleTransformer = function (tags) {
				tags.ul.data.pStyle = ["Prrafodelista", "Prrafodelista"];
				tags.ol.data.pStyle = ["Prrafodelista", "Prrafodelista"];
				return tags;
			};
			data = {
				scope: `<li>UL Lv1 Item 1
    <ul>
        <li>UL Lv2 Item 1
            <ul>
                <li>UL Lv3 Item 1
                    <ul>
                        <li>UL Lv4 Item 1
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>UL Lv2 Nested Item 2</li>
        <li>UL Lv2 Nested Item 3</li>
    </ul></li>`,
			};
			return this.loadAndRender();
		});
	});

	describe("Device width", function () {
		it("should be possible to change it", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-device-width.docx";
			data = {
				html: tableComplex,
			};
			options.deviceWidth = 580;
			options.getDxaWidth = (sections) => {
				expect(sections.length);
				const firstSection = sections[0];
				// We use the width of the first section (the first page), minus the left and right margins by default
				return (
					(firstSection.width -
						firstSection.leftMargin -
						firstSection.rightMargin) /
					firstSection.cols
				);
			};
			return this.loadAndRender();
		});

		it("should be possible to change it with getDxaWidth", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-device-width-small.docx";
			data = {
				html: tableComplex,
			};
			options.deviceWidth = 580;
			options.getDxaWidth = (sections) => {
				expect(sections.length).to.be.equal(1);
				expect(sections[0].width).to.be.equal(11906);
				expect(sections[0].leftMargin).to.be.equal(1701);
				expect(sections[0].rightMargin).to.be.equal(850);
				return 8000;
			};
			return this.loadAndRender();
		});
	});

	describe("Spacing", function () {
		it("should work correctly for block", function () {
			name = "html-block-example.docx";
			expectedName = "expected-spacing.docx";
			data = {
				html: "<p><b>t1</b> <em>t2</em></p>",
			};
			return this.loadAndRender();
		});

		it("should work correctly for inline", function () {
			name = "html-example.docx";
			expectedName = "expected-spacing-inline.docx";
			data = {
				html: "<b>t1</b> <em>t2</em>",
			};
			return this.loadAndRender();
		});

		it("should work correctly when having multiple spaces /tabs/ newlines inline", function () {
			name = "html-example.docx";
			expectedText = "hello foo t2 bar";
			expectedName = "expected-multispacing-inline.docx";
			data = {
				html: `<b>
				hello  	   foo  </b>
				<em>   t2  bar    </em>`,
			};
			return this.loadAndRender();
		});

		it("should not remove spaces", function () {
			name = "html-example.docx";
			expectedText = "Foo google Bar";
			expectedName = "expected-keep-spaces.docx";
			data = {
				html: "Foo <b>google</b> Bar",
			};
			return this.loadAndRender();
		});

		it("should not remove spaces in lists", function () {
			name = "html-block-example.docx";
			expectedName = "expected-regression-spaces.docx";
			data = {
				html: spaceRegression,
			};
			return this.loadAndRender();
		});

		it("should be possible to set table-layout to fixed", function () {
			name = "html-block-example.docx";
			options.deviceWidth = 705.2;
			expectedName = "expected-table-layout-fixed.docx";
			data = {
				html: `
<table style="table-layout: fixed; margin: 0px auto; width: 620px;">
    <tr>
        <td style="width: 270px;">
            <strong>ABC</strong>
        </td>
        <td style="width: 350px;">
		Loremipsumdolorsitamet,consetetursadipscingelitr,seddiamnonumyeirmodtemporinviduntutlaboreetdoloremagnaaliquyamerat,seddiamvoluptua.Atveroeosetaccusametjustoduodoloresetearebum.Stetclitakasdgubergren,noseatakimatasanctusestLoremipsumdolorsitamet.Loremipsumdolorsitamet,consetetursadipscingelitr,seddiamnonumyeirmodtemporinviduntutlaboreetdoloremagnaaliquyamerat,seddiamvoluptua.Atveroeosetaccusametjustoduodoloresetearebum.Stetclitakasdgubergren,noseatakimatasanctusestLoremipsumdolorsitamet.
        </td>
    </tr>
</table>
				`,
			};
			return this.loadAndRender();
		});

		it("should not remove tags", function () {
			name = "html-block-example.docx";
			expectedName = "expected-keep-tags-in-ul.docx";
			data = {
				html: "<h4>Heading 4</h4><ul><li><p><em>Bullet Title</em> bullet text here</p></li></ul>",
			};
			return this.loadAndRender();
		});

		it("should work correctly when having multiple spaces /tabs/ newlines block", function () {
			name = "html-block-example.docx";
			expectedName = "expected-multispacing-block.docx";
			data = {
				html: `<p><b>
				hello  	   foo  </b>
				<em>   t2  bar    </em></p>`,
			};
			expectedText = "hello foo t2 bar";
			return this.loadAndRender();
		});

		it("should work with break-after: page and break-before: page", function () {
			name = "html-block-example.docx";
			expectedName = "expected-pagebreak.docx";
			data = {
				html: `<p>Hello</p>
				<p class="pba">Hi</p>
				<p class="pba">Hello</p>
				<p>Bye</p>
				<p>Bye</p>
				<p>Bye</p>
				<p>Bye</p>
				<p class="pbb">Good bye</p>
				`,
			};
			options = {
				styleSheet: `
				.pba { break-after: page; }
				.pbb { break-before: page; }
				`,
			};
			return this.loadAndRender();
		});

		it("should work with sub.docx", function () {
			name = "inline-text-around.docx";
			expectedName = "expected-inline-text-around.docx";
			data = {
				inline: "<b>Edgar</b>",
			};
			return this.loadAndRender();
		});
	});

	describe("Margin/Padding", function () {
		it("should work with margin top and bottom on paragraph", function () {
			name = "html-block-example.docx";
			expectedName = "expected-paragraph-margin.docx";
			data = {
				html: paragraphMargin,
			};
			return this.loadAndRender();
		});

		it("should not put NaN with margin top and bottom on paragraph", function () {
			name = "html-template.docx";
			expectedName = "expected-paragraph-margin-no-reg.docx";
			data = {
				html: paragraphMargin,
			};
			return this.loadAndRender();
		});

		it("should work with line-height and margin top and bottom on long paragraphs", function () {
			name = "html-block-example.docx";
			expectedName = "expected-paragraph-line-height.docx";
			data = {
				html: paragraphLineHeight,
			};
			return this.loadAndRender();
		});
	});

	describe("Text Indent", function () {
		it("should work with negative indent", function () {
			name = "html-template.docx";
			expectedName = "expected-negative-indent.docx";
			data = {
				html: negativeTextIndent,
			};
			return this.loadAndRender();
		});
	});

	describe("Table", function () {
		it("should work without p inside td", function () {
			name = "html-block-example.docx";
			expectedName = "expected-td-without-p.docx";
			data = {
				html: `
				<table>
				<tr>
					<td style="width:33.333333333333336%;">foobar<em>italics</em></td>
				</tr>
				</table>
				`,
			};
			return this.loadAndRender();
		});

		it("should do the demo with table", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table.docx";
			data = {
				html: getString(imageData["fixtures/table.html"]),
			};
			return this.loadAndRender();
		});
		it("should work with full table", function () {
			name = "html-block-example.docx";
			expectedName = "expected-full-table.docx";
			data = {
				html: fullTable,
			};
			return this.loadAndRender();
		});

		it("should work with complex table", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-complex.docx";
			data = {
				html: tableComplex,
			};
			options.deviceWidth = 705.2;
			return this.loadAndRender();
		});

		it("should not regress uncentered table", function () {
			name = "html-block-example.docx";
			expectedName = "expected-paragraph-uncentred.docx";
			data = {
				html: divNestedUncentered,
			};
			return this.loadAndRender();
		});

		it("should not regress with pt values", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-pt.docx";
			data = {
				html: tableWithPtWidth,
			};
			return this.loadAndRender();
		});

		it("should not corrupt document with special chars", function () {
			name = "html-block-example.docx";
			expectedName = "expected-escape-char.docx";
			data = {
				html: `
					<div>Hello ${String.fromCharCode(27, 65, 65)}</div>
				`,
			};
			return this.loadAndRender();
		});

		it("should not regress with special units", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-special-unit.docx";
			data = {
				html: tableWithSpecialUnits,
			};
			return this.loadAndRender();
		});

		it("should not make document corrupt with wrong unit", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-default.docx";
			data = {
				html: tableWithWrongUnit,
			};
			return this.loadAndRender();
		});

		it("should work with table colspan", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-colspan.docx";
			data = {
				html: tableColSpan,
			};
			return this.loadAndRender();
		});

		it("should work with table rowspan", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-rowspan.docx";
			data = {
				html: tableRowSpan,
			};
			return this.loadAndRender();
		});

		it("should work with multi rowspan", function () {
			name = "html-block-example.docx";
			expectedName = "expected-multi-table-rowspan.docx";
			data = {
				html: multiTableRowSpan,
			};
			return this.loadAndRender();
		});

		it("should work with complex rowspan", function () {
			name = "html-block-example.docx";
			expectedName = "expected-complex-table-rowspan.docx";
			data = {
				html: complexRowSpan,
			};
			return this.loadAndRender();
		});

		it("should work with one rowspan", function () {
			name = "html-block-example.docx";
			expectedName = "expected-one-rowspan.docx";
			data = {
				html: oneRowSpan,
			};
			return this.loadAndRender();
		});

		it("should work with table colspan and rowspan", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-col-row-span.docx";
			data = {
				html: tableColRowSpan,
			};
			return this.loadAndRender();
		});

		it("should work with multiple table colspan and rowspan", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-multi-col-row-span.docx";
			data = {
				html: tableColRowMulti,
			};
			return this.loadAndRender();
		});

		it("should not corrupt document with colspan when having just one row", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-colspan-without-nan.docx";
			data = {
				html: tableColSpanOneRow,
			};
			return this.loadAndRender();
		});

		it("should work with table colspan without width", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-colspan-without-width.docx";
			data = {
				html: tableColSpanNoWidth,
			};
			return this.loadAndRender();
		});

		it("should work with table colspan without width 2", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-colspan-without-width2.docx";
			data = {
				html: tableColSpanNoWidth2,
			};
			return this.loadAndRender();
		});

		it("should work style precedence", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-colspan-style-precedence.docx";
			data = {
				html: tableColSpanWidthStylePrecedence,
			};
			return this.loadAndRender();
		});

		it("should work with table bg colored", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-colored.docx";
			data = {
				html: tableBackgroundColor,
			};
			return this.loadAndRender();
		});

		it("should work with table with ul list without li", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-list.docx";
			data = {
				html: tableWithULWithoutLi,
			};
			return this.loadAndRender();
		});

		it("should work with table text colored", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-text-colored.docx";
			data = {
				html: tableColoredText,
			};
			return this.loadAndRender();
		});

		it("should not leak table color", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-colored-bg.docx";
			data = {
				html: tableColored,
			};
			return this.loadAndRender();
		});

		it("should do the demo with table2", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table2.docx";
			data = {
				html: getString(imageData["fixtures/table2.html"]),
			};
			return this.loadAndRender();
		});
		it("should work with html in table", function () {
			name = "html-in-table.docx";
			expectedName = "expected-html-in-table.docx";
			data = {
				loop: [
					{ html: mixed, name: "Num 1", description: "....." },
					{ html: mixed2, name: "Num 2", description: "....." },
					{ html: mixed3, name: "Num 3", description: "....." },
					{ html: mixed4, name: "Num 4", description: "....." },
					{ html: mixed5, name: "Num 5", description: "....." },
				],
			};
			return this.loadAndRender();
		});

		it("should work with html in table when not having content", function () {
			name = "html-in-table.docx";
			expectedName = "expected-html-in-table-empty.docx";
			data = {
				loop: [
					{ html: "", name: "Num 1", description: "....." },
					{ html: null, name: "Num 2", description: "....." },
					{ html: false, name: "Num 3", description: "....." },
				],
			};
			return this.loadAndRender();
		});

		it("should work with table without tbody", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-without-tbody.docx";
			data = {
				html: tableWithoutTbody,
			};
			return this.loadAndRender();
		});

		it("should work with borderless table", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-without-border.docx";
			data = {
				html: tableWithoutBorder,
			};
			return this.loadAndRender();
		});

		it("should be possible to make all tables borderless by default", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-without-border-2.docx";
			options = {
				elementCustomizer({ name }) {
					if (name === "table") {
						return {
							htmlStyle: "border: none;",
						};
					}
				},
			};
			data = {
				html: tableClassed,
			};
			return this.loadAndRender();
		});

		it("should be possible to add left borders only", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-with-left-border.docx";
			options = {
				styleSheet: `tr td,tr th {
					border-left: 16px solid orange;
				}`,
			};
			data = {
				html: tableHello,
			};
			return this.loadAndRender();
		});

		it("should not regress if table begins with empty tr", function () {
			name = "html-block-example.docx";
			expectedName = "expected-reg-table-empty-tr.docx";
			data = {
				html: `
					<table>
		<tbody><tr>     </tr>
		<tr>
				<td class='property-label'><label>Foo</label></td>
				<td class='property-label'><label>Foo</label></td>
		</tr>
		<tr></tr>
	</tbody></table>
			`,
			};
			return this.loadAndRender();
		});

		it("should be possible to change table border color", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-colored-borders.docx";
			data = {
				html: tableColoredBorders,
			};
			return this.loadAndRender();
		});

		describe("implicit paragraphs", function () {
			it("should work in table for one <a>", function () {
				name = "html-block-example.docx";
				expectedName = "expected-html-implicit-paragraphs.docx";
				data = {
					html: tableImplicitParagraphs,
					name: "Num 1",
					description: ".....",
				};
				return this.loadAndRender();
			});

			it("should work in table for mixed content", function () {
				name = "html-block-example.docx";
				expectedName = "expected-html-implicit-paragraphs2.docx";
				data = {
					html: tableImplicitParagraphs2,
					name: "Num 1",
					description: ".....",
				};
				return this.loadAndRender();
			});

			it("should be possible to style them", function () {
				name = "html-block-example.docx";
				expectedName = "expected-implicit-styled-paragraphs.docx";
				data = {
					html: tableImplicitParagraphsStyled,
				};
				options.elementCustomizer = function (element) {
					// This will match only paragraphs inside tds
					if (element.matches("td p, td")) {
						return { pStyle: "Heading" };
					}
					if (element.name === "p") {
						return { pStyle: "Heading5" };
					}
				};

				return this.loadAndRender();
			});
		});

		it("should be possible to apply vertical align", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-align-td.docx";
			data = {
				html: tableVerticalAlignTd,
			};
			return this.loadAndRender();
		});

		it("should work with padding", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-with-padding.docx";
			data = {
				html: tableWithPadding,
			};
			return this.loadAndRender();
		});

		it("should work with padding zero", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-with-padding-zero.docx";
			data = {
				html: tableWithPadding0,
			};
			return this.loadAndRender();
		});

		it("should keep the spacing props from paragraph", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-with-parprops.docx";
			data = {
				html: tableSimple,
			};
			return this.loadAndRender();
		});

		it("should be possible to align table center", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-aligned-center.docx";
			data = {
				html: tableAlignedCenter,
			};
			return this.loadAndRender();
		});

		it("should be possible to align table right", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-aligned-right.docx";
			data = {
				html: tableAlignedRight,
			};
			return this.loadAndRender();
		});

		it("should be possible to set margin to 0", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-margin-0.docx";
			data = {
				html: tableMargin0,
			};
			return this.loadAndRender();
		});

		it("should be possible to set margin to 100", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-margin-100.docx";
			data = {
				html: tableMargin100,
			};
			return this.loadAndRender();
		});

		it("should not fail for table", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-th-inline-style.docx";
			data = {
				html: tableStyleTh,
			};
			return this.loadAndRender();
		});

		it("should be possible to specify width in pixels in styleSheet", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-px.docx";
			options = {
				styleSheet: `
				td:nth-child(1) {
					width: 60px;
				}
				td:nth-child(2) {
					width: 60px;
				}
				td:nth-child(3) {
					width: 60px;
				}
				td:nth-child(4) {
					width: 60px;
				}`,
			};
			data = {
				html: tableHello,
			};
			return this.loadAndRender();
		});

		it("should be possible to specify width in percent in styleSheet", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-percent.docx";
			options = {
				styleSheet: `
				td:nth-child(1) {
					width: 8%;
				}
				td:nth-child(2) {
					width: 12%;
				}
				td:nth-child(3) {
					width: 60%;
				}
				td:nth-child(4) {
					width: 20%;
				}`,
			};
			data = {
				html: tableHello,
			};
			return this.loadAndRender();
		});
	});

	describe("Regressions", function () {
		it("should not corrupt document with unnamed styles", function () {
			name = "regression-unnamed-style.docx";
			expectedName = "expected-unnamed-style.docx";
			data = {
				html: allHeadings,
			};
			return this.loadAndRender();
		});

		it("should not corrupt document with paragraph in paragraph", function () {
			name = "regression-par-in-par.docx";
			expectedName = "expected-valid-par-in-par.docx";
			data = {
				loop: {
					html: "<h1>Hello</h1>",
				},
			};
			return this.loadAndRender();
		});

		it("should work with rtl (right to left language)", function () {
			name = "rtl.docx";
			expectedName = "expected-rtl.docx";
			data = {
				html: "<h1>Hello foo</h1>",
			};
			return this.loadAndRender();
		});

		it("should work to add HTML with RTL", function () {
			name = "rtl-add.docx";
			expectedName = "expected-rtl-add.docx";
			data = {
				log: [
					{
						description: "יש בעיה (עם) סוגריים בעברית",
					},
				],
			};
			return this.loadAndRender();
		});

		it("should not corrupt when having multiple loops in td", function () {
			name = "empty-table-empty-content.docx";
			expectedName = "expected-empty-table-empty-content.docx";
			data = {};
			return this.loadAndRender();
		});
	});

	describe("Work with sdtContent paragraph empty", function () {
		it("should not corrupt document", function () {
			name = "regression-sdtcontent-paragraph.docx";
			expectedName = "expected-non-empty-sdtcontent.docx";
			data = {
				loop: {
					Id: 1,
				},
			};
			return this.loadAndRender();
		});

		it("should not corrupt document with async", function () {
			async = true;
			v4 = true;
			name = "regression-sdtcontent-paragraph.docx";
			expectedName = "expected-non-empty-sdtcontent-async.docx";
			data = {
				loop: {
					Id: 1,
				},
			};
			return this.loadAndRender();
		});
	});

	describe("StyleTransformer", function () {
		it("should be possible to customize ul/li styles", function () {
			name = "html-with-bullet-style.docx";
			expectedName = "expected-with-bullet-style.docx";
			data = {
				html: uLists + oLists,
			};
			options.styleTransformer = function (tags) {
				tags.ul.data.pStyle = "ListBullet";
				tags.ul.data.useNumPr = false;
				return tags;
			};
			return this.loadAndRender();
		});

		it("should be possible to customize nested ul styles", function () {
			name = "html-with-bullet-style.docx";
			expectedName = "expected-with-nested-bullet-style.docx";
			data = {
				html: nestedLists,
			};
			options.styleTransformer = function (tags) {
				tags.ul.data.pStyle = ["ListBullet", "ListBullet2", "ListBullet3"];
				tags.ul.data.useNumPr = false;
				return tags;
			};
			return this.loadAndRender();
		});

		it("should be possible to remap HTML", function () {
			name = "html-block-example.docx";
			expectedName = "expected-headings-remapped.docx";
			data = {
				html: allHeadings,
			};
			options.styleTransformer = function (tags, docStyles) {
				tags.h1 = docStyles.Heading1;
				tags.h2 = docStyles.Heading2;
				tags.h3 = docStyles.Heading3;
				tags.h4 = docStyles.Heading4;
				tags.h5 = docStyles.Heading5;
				return tags;
			};
			return this.loadAndRender();
		});
	});

	describe("Fulltest", function () {
		it("should do the demo with presentation docxtemplater", function () {
			name = "html-block-example.docx";
			expectedName = "expecteddemohtml-example.docx";
			data = {
				html: getString(
					imageData["fixtures/demo_presentation_docxtemplater.html"]
				),
			};
			return this.loadAndRender();
		});

		if (typeof window === "undefined") {
			it("should work with encoding", function () {
				name = "html-block-example.docx";
				expectedName = "expected-encoding.docx";
				options.ignoreUnknownTags = true;
				data = {
					html: getString(imageData["fixtures/encoding.html"], "utf-8"),
				};
				return this.loadAndRender();
			});
		}

		it("should work with style inside li", function () {
			name = "grid-loop.docx";
			expectedName = "expected-grid-loop.docx";
			data = {
				htmlArray: [
					{
						htmlText: "<ul><li>italicals</li></ul>",
						name: "italicals",
					},
					{
						htmlText: "<ul><li><i>italicals</i></li></ul>",
						name: "h3",
					},
				],
				simpleArray: [
					{
						text: "hello there",
						name: "hello",
					},
					{
						text: "nice work",
						name: "nice",
					},
				],
				simpleHtml: "<h1>treat <i>time</i></h1>",
			};
			return this.loadAndRender();
		});

		it("should handle multiple paragraphs inside div", function () {
			name = "html-block-example.docx";
			expectedName = "expected-paragraphs-in-div.docx";
			data = {
				html: `<div>
					<p>Paragraph 1</p>
					<p>Paragraph 2</p>
					</div>
				`,
			};
			return this.loadAndRender();
		});

		it("should handle nested paragraphs inside div", function () {
			name = "html-block-example.docx";
			expectedName = "expected-nested-paragraphs-in-div.docx";
			data = {
				html: `<p>
					Foo
					<p>Paragraph 1</p>
					<p>Paragraph 2</p>
					Bar
					</p>
				`,
			};
			return this.loadAndRender();
		});

		it("should work with ul inside paragraphs", function () {
			name = "html-block-example.docx";

			expectedName = "expected-ul-inside-paragraphs.docx";
			data = {
				html: `
					<p>Tag<br/><ul><li>L1</li><!--end of activitylogs--></ul></p>
				`,
			};
			return this.loadAndRender();
		});

		it("should be able to customize pStyle of li inside paragraphs", function () {
			name = "html-block-example.docx";

			options = {
				elementCustomizer({ name }) {
					if (name === "li") {
						return {
							pStyle: "Heading1",
						};
					}
				},
			};

			expectedName = "expected-ul-inside-paragraphs-styled.docx";
			data = {
				html: `
					<p>Tag<br/><ul><li>L1</li><li>L2</li><!--end of activitylogs--></ul></p>
				`,
			};
			return this.loadAndRender();
		});

		it("should work with links", function () {
			name = "html-block-example.docx";
			expectedName = "expected-links.docx";
			data = {
				html: links2,
			};
			return this.loadAndRender();
		});

		it("should work with links with no text", function () {
			name = "html-block-example.docx";
			expectedName = "expected-links-no-text.docx";
			data = {
				html: linksWithNoText,
			};
			return this.loadAndRender();
		});

		it("should work with em inside ul li", function () {
			name = "html-block-example.docx";
			expectedName = "expected-ul-em.docx";
			data = {
				html: "<ul><li><em>TEST1</em> after</li></ul>",
			};
			return this.loadAndRender();
		});

		it("should work with styles", function () {
			name = "style-bug.docx";
			expectedName = "expected-style-bug.docx";
			data = {
				title: "Document Title",
				text1: "This text should be Century Gothic, font size 9, red",
				text2: "This text should be Century Gothic, font size 9, black",
				html1:
					"<p>This html <em>should</em> be Century Gothic, font size 9, black</p>",
				html2:
					"<h3>This template <strong>was</strong> Century Gothic, font size 9, black</h3><h4>But it has header and paragraph tags.</h4><p>Can these tags take on the styles Heading 1, Heading 4, etc. defined in the document?</p>",
				html3:
					"<p>This html <em>hopefully</em> is still Century Gothic, font size 9, red</p>",
			};
			return this.loadAndRender();
		});

		it("should work if textbody not present", function () {
			name = "style-textbody-not-present.docx";
			expectedName = "expected-style-textbody.docx";
			data = {
				html1: "<p>foo</p>",
				html2: "<p>bar</p>",
			};
			return this.loadAndRender();
		});
	});

	describe("Keep run style", function () {
		it("should keep font-family and highlight color", function () {
			name = "keep-run-style.docx";
			expectedName = "expected-kept-run-style.docx";
			data = {
				html:
					"<p>Hello<span> Foo</span><b>how, are you ? </b><u>Im fine thank you.</u><i> Good bye</i></p>" +
					uLists,
			};
			return this.loadAndRender();
		});
	});

	describe("Text attributes", function () {
		it("should work with font-sizes", function () {
			name = "html-block-example.docx";
			expectedName = "expected-font-sizes.docx";
			data = {
				html: fontSizes,
			};
			return this.loadAndRender();
		});

		it("should work with font-weight", function () {
			name = "html-block-example.docx";
			expectedName = "expected-font-weight.docx";
			data = {
				html: fontWeight,
			};
			return this.loadAndRender();
		});

		it("should work with font-family", function () {
			name = "html-block-example.docx";
			expectedName = "expected-font-family.docx";
			data = {
				html: fontFamily,
			};
			return this.loadAndRender();
		});
	});

	describe("Errors", function () {
		it("should fail with unknown tags", function () {
			name = "html-block-example.docx";
			expectedName = "expected-unknown-tag-span.docx";
			data = {
				html: "<myFunkyTag>Foo</myFunkyTag>",
			};
			const expectedError = {
				name: "RenderingError",
				message: "Tag myfunkytag not supported",
				properties: {
					id: "html_tag_name_unsupported",
					name: "myfunkytag",
				},
			};
			expectToThrow(
				this.loadAndRender.bind(this),
				Errors.RenderingError,
				expectedError
			);
		});
		it("should fail with pptx with correct error message", function () {
			name = "test.pptx";
			data = { html: "<p></p>" };
			const expectedError = {
				name: "TemplateError",
				message: "The HTML module only handles docx, not pptx",
				properties: {
					id: "html_module_does_not_support_pptx",
				},
			};
			expectToThrow(
				this.loadAndRender.bind(this),
				Errors.XTTemplateError,
				expectedError
			);
		});
		it("should fail if style tags invalid", function () {
			name = "html-block-example.docx";
			expectedName = "expected-style-column.docx";
			data = {
				html: '<div style="background-color red;">Foo</div>',
			};
			const expectedError = {
				name: "RenderingError",
				message: "Style for element cannot be parsed",
				properties: {
					id: "style_property_invalid",
					name: "div",
					style: "background-color red;",
				},
			};
			expectToThrow(
				this.loadAndRender.bind(this),
				Errors.RenderingError,
				expectedError
			);
		});
	});

	describe("ElementCustomizer class to style", function () {
		describe("map classes to docx styles", function () {
			it("should work for paragraphs and headers", function () {
				name = "html-block-example.docx";
				expectedName = "expected-with-class-docx-style.docx";
				options = {
					elementCustomizer({ classNames, name, part }) {
						expect(part.value).to.be.equal("html");
						if (classNames.indexOf("my-heading-class") !== -1 && name === "p") {
							return {
								pStyle: "Heading",
							};
						}
						if (
							classNames.indexOf("my-heading5-class") !== -1 &&
							name === "h3"
						) {
							return {
								pStyle: "Heading5",
							};
						}
					},
				};
				data = {
					html: paragraphsClassed,
				};
				return this.loadAndRender();
			});

			it("should work for tables to set tblStyle and defaultBorder", function () {
				name = "html-block-styled-table-example.docx";
				expectedName = "expected-with-class-docx-style-table.docx";
				options = {
					elementCustomizer({ classNames, name }) {
						if (classNames.indexOf("newtable") !== -1 && name === "table") {
							return {
								tblStyle: "TableauNormal",
								defaultBorder: null,
							};
						}
					},
				};
				data = {
					html: `<table class="newtable">
<tr>
<td>
<span>Foobar</span>
</td>
<td>
<span>Foobar</span>
</td>
</tr>
<tr>
<td>
<span>Foobar</span>
</td>
<td>
<span>Foobar</span>
</td>
</tr>
</table>`,
				};
				return this.loadAndRender();
			});
		});

		it("should work with paragraph inside div", function () {
			name = "block-text-body.docx";
			expectedName = "expected-text-docx-style.docx";
			options = {
				elementCustomizer({ name }) {
					if (name === "p") {
						return {
							pStyle: "Heading1",
						};
					}
				},
			};
			data = {
				html: paragraphsDiv,
			};
			return this.loadAndRender();
		});

		it("should work with user created tags", function () {
			name = "html-block-example.docx";
			expectedName = "expected-user-created-tags.docx";
			options = {
				elementCustomizer({ name }) {
					if (name === "p2") {
						return { pStyle: "Heading1" };
					}
				},
				styleTransformer(tags) {
					tags.p2 = { type: "block" };
					return tags;
				},
			};
			data = {
				html: "<p2>Hello</p2>",
			};
			return this.loadAndRender();
		});

		it("should be possible to customize nested ul styles", function () {
			name = "html-with-bullet-style.docx";
			expectedName = "expected-with-nested-bullet-style.docx";
			data = {
				html: nestedLists,
			};
			const ulpStyles = ["ListBullet", "ListBullet2", "ListBullet3"];
			options.elementCustomizer = function ({ name, listLevel }) {
				if (name === "ul") {
					return { pStyle: ulpStyles[listLevel], useNumPr: false };
				}
			};
			return this.loadAndRender();
		});

		it("should be possible to customize ol style", function () {
			name = "html-block-example.docx";
			options.elementCustomizer = function ({ name }) {
				if (name === "ol") {
					return { pStyle: "Heading1" };
				}
			};
			expectedName = "expected-ol-styled.docx";
			data = { html: oLists };
			return this.loadAndRender();
		});
	});

	describe("Selector engine", function () {
		it("should work with nested paragraphs", function () {
			name = "html-block-example.docx";
			expectedName = "expected-selector-nested-paragraphs.docx";
			options = {
				elementCustomizer(element) {
					if (element.matches("th h3.p1, tr>th>h3.p3, tr>h3.nomatch")) {
						return {
							htmlStyle: "background-color: #ff0000;",
						};
					}
				},
			};
			data = { html: fullTable };
			return this.loadAndRender();
		});
		it("should work with star selector", function () {
			name = "html-block-example.docx";
			expectedName = "expected-star-selector.docx";
			options = {
				elementCustomizer(element) {
					if (element.matches("*")) {
						return {
							htmlStyle: "background-color: #ff0000;",
						};
					}
				},
			};
			const html = `
			<p>Hello <strong>world</strong></p>
			<blockquote>How are you ?</blockquote>
			<strong>Bye</strong>
			`;

			data = { html };
			return this.loadAndRender();
		});

		it("should work with attribute equals selector", function () {
			name = "html-block-example.docx";
			expectedName = "expected-attribute-selector.docx";
			options = {
				elementCustomizer(element) {
					if (element.matches('a[href="http://google.com"]')) {
						return {
							htmlStyle: "font-size: 40px;",
						};
					}
				},
			};
			const html = '<p>Hello <a href="http://google.com">Google</a></p>';

			data = { html };
			return this.loadAndRender();
		});

		it("should work with attribute exists selector", function () {
			name = "html-block-example.docx";
			expectedName = "expected-attribute-selector.docx";
			options = {
				elementCustomizer(element) {
					if (element.matches("a[href]")) {
						return {
							htmlStyle: "font-size: 40px;",
						};
					}
				},
			};
			const html = '<p>Hello <a href="http://google.com">Google</a></p>';

			data = { html };
			return this.loadAndRender();
		});

		it("should work with star selector strong", function () {
			name = "html-block-example.docx";
			expectedName = "expected-star-selector-strong.docx";
			options = {
				elementCustomizer(element) {
					if (element.matches("* strong")) {
						return {
							htmlStyle: "font-size: 30px;",
						};
					}
				},
			};
			const html = `
			<p>Hello <strong>world</strong></p>
			<blockquote>How are you ?</blockquote>
			<strong>Bye</strong>
			`;

			data = { html };
			return this.loadAndRender();
		});

		it("should work with double star selector strong", function () {
			name = "html-block-example.docx";
			expectedName = "expected-double-star-selector-strong.docx";
			options = {
				elementCustomizer(element) {
					if (element.matches("* * strong")) {
						return {
							htmlStyle: "font-size: 30px;",
						};
					}
				},
			};
			const html = `
			<p>Hello <strong>world</strong></p>
			<blockquote>How are you ?</blockquote>
			<strong>Bye</strong>
			`;

			data = { html };
			return this.loadAndRender();
		});

		it("should work with adjacent selector", function () {
			name = "html-block-example.docx";
			expectedName = "expected-adjacent-selector.docx";
			options = {
				elementCustomizer(element) {
					if (element.matches("span + span")) {
						return {
							htmlStyle: "font-size: 30px;",
						};
					}
				},
			};
			const html = `
			<p>Hello</p>
			<p>Foo</p>
			<span>Foo</span>
			<span>**Bar**</span>
			<p>Nothing</p>
			<span>Baz</span>
			<p><span>Hi <span>Bar</span> <span>**ho**</span> </span></p>
			`;

			data = { html };
			return this.loadAndRender();
		});

		it("should work with id selector", function () {
			name = "html-block-example.docx";
			expectedName = "expected-id-selector.docx";
			options = {
				elementCustomizer(element) {
					if (element.matches("span#foo")) {
						return {
							htmlStyle: "font-size: 30px;",
						};
					}
				},
			};
			const html = `
			<p id="foo">Ho</p>
			<span id="foo">**Hi**</span>
			<span>Hello</span>
			`;

			data = { html };
			return this.loadAndRender();
		});

		it("should work with :last-child", function () {
			name = "html-block-example.docx";
			expectedName = "expected-last-child-selector.docx";
			options = {
				styleSheet: "li:last-child { font-size: 20px }",
			};

			data = { html: uLists };
			return this.loadAndRender();
		});

		it("should work with :first-child", function () {
			name = "html-block-example.docx";
			expectedName = "expected-first-child-selector.docx";
			options = {
				styleSheet: "li:first-child { font-size: 20px }",
			};

			data = { html: uLists };
			return this.loadAndRender();
		});

		it("should work with :nth-child", function () {
			name = "html-block-example.docx";
			expectedName = "expected-nth-child-selector.docx";
			options = {
				styleSheet: "li:nth-child(2) { font-size: 20px }",
			};

			data = { html: uLists };
			return this.loadAndRender();
		});
	});

	describe("Stylesheets", function () {
		it("should fail if passing boolean to stylesheet", function () {
			name = "html-block-example.docx";
			data = {
				html: `
				<p><span id="bar">Hi Hi</span></p>
				`,
			};
			options = { styleSheet: true };
			const expectedError = {
				name: "GenericError",
				message: "stylesheet must be a string, but received boolean",
				properties: {
					id: "html_module_stylesheet_not_string",
				},
			};
			expectToThrow(
				this.loadAndRender.bind(this),
				Errors.XTError,
				expectedError
			);
		});

		it("should work with id selector", function () {
			name = "html-block-example.docx";
			expectedName = "expected-id-selector.docx";
			options = {
				styleSheet: `span#foo {
					font-size: 30px;
				}`,
			};
			const html = `
			<p id="foo">Ho</p>
			<span id="foo">**Hi**</span>
			<span>Hello</span>
			`;

			data = { html };
			return this.loadAndRender();
		});

		it("should work with justify styles in table", function () {
			name = "html-block-example.docx";
			expectedName = "expected-table-with-style.docx";
			data = {
				html: tableHello,
			};
			options = {
				styleSheet: `
				table, tr, td, th {
					border: 1px solid black;
					border-collapse: collapse;
				}

				tr:last-child td {
					font-weight: bold;
					border-top: 4px double;
				}

				th {
					text-align: center;
					font-weight: bold;
				}

				table {
					width: 100%;
				}

				th {
					background-color: #6495ed;
				}

				td:last-child {
					text-align: right;
				}
				`,
			};
			return this.loadAndRender();
		});

		it("should work with comments in stylesheet", function () {
			name = "html-block-example.docx";
			expectedName = "expected-lists.docx";
			options = {
				styleSheet: `
				/*
				 * You can write your stylesheet here, for example :
				 *
				 *   h1 {
				 *       font-size: 60px;
				 *   }
				 *   p code {
				 *       font-size: 30px;
				 *       color: red;
				 *   }
				 *
				 */
				`,
			};

			data = { html: uLists };
			return this.loadAndRender();
		});

		it("should work with <style> tag", function () {
			name = "html-block-example.docx";
			expectedName = "expected-style-from-html-tag.docx";
			data = {
				html: `
				<style>
				p {
					color: red;
				}</style>
				<p>Hello in red</p>
				`,
			};
			return this.loadAndRender();
		});

		it("should work with multiple <style> tags", function () {
			name = "style-bug.docx";
			expectedName = "expected-multiple-style-tags.docx";
			data = {
				title: "Document Title",
				text1: "This text should be Century Gothic, font size 9, red",
				text2: "This text should be Century Gothic, font size 9, black",
				html1: `
				<style>
				p {
					color: cyan;
				}</style>
				<style>
				p {
					color: yellow;
				}</style>
				<p>Hello in yellow</p>
				`,
				html2: `
				<style>
				p {
					color: green;
				}</style>
				<p>Hello in green</p>
				`,
				html3: "<p>Hello in red (default color of the tag)</p>",
			};
			return this.loadAndRender();
		});
	});

	describe("Header/Footer", function () {
		it("should work", function () {
			name = "html-header-footer.docx";
			expectedName = "expected-html-header-footer.docx";
			data = {
				html: links2 + inlineStyle,
			};
			return this.loadAndRender();
		});
	});

	describe("Async", function () {
		it("should work async with block code tag", function () {
			async = true;
			v4 = true;
			name = "html-block-example.docx";
			expectedName = "expected-code-block.docx";
			data = { html: resolveSoon("<p>Hello</p><code>foo</code>") };
			return this.loadAndRender();
		});
	});

	if (imageModule) {
		describe("SVG support", function () {
			it("should work correctly for block", function () {
				options = { img: { Module: imageModule } };
				name = "html-block-example.docx";
				expectedName = "expected-svg.docx";
				data = {
					html: `<p>Hello ${svgImage} <b>Foo</b></p>`,
				};
				return this.loadAndRender();
			});
		});

		describe("Real World", function () {
			it("should work with duckduckgo", function () {
				options = { img: { Module: imageModule } };
				name = "html-block-example.docx";
				expectedName = "expectedduckduckgo.docx";
				options.ignoreUnknownTags = true;
				data = {
					html: getString(
						imageData["fixtures/duckduckgo-search.html"],
						"utf-8"
					),
				};
				return this.loadAndRender();
			});

			it.skip("should work with duckduckgo indented", function () {
				name = "html-block-example.docx";
				expectedName = "expectedduckduckgo.docx";
				options.ignoreUnknownTags = true;
				data = {
					html: getString(
						imageData["fixtures/duckduckgo-search-indented.html"],
						"utf-8"
					),
				};
				return this.loadAndRender();
			});
		});

		describe("Img tag", function () {
			it("should work with block", function () {
				options = { img: { Module: imageModule } };
				name = "html-block-example.docx";
				expectedName = "expected-block-image.docx";
				data = {
					html: `<p>Hello</p><img src="${base64PNGImage}"/>`,
				};
				return this.loadAndRender();
			});

			it("should work with block and centering", function () {
				name = "html-block-example.docx";
				expectedName = "expected-block-image-centered.docx";
				options = {
					img: { Module: imageModule },
					styleSheet: `
					img {
						display: block;
						margin:auto;
					}
					`,
				};
				data = {
					html: `<p>Hello</p><img src="${base64PNGImage}"/>`,
				};
				return this.loadAndRender();
			});

			it("should ignore empty image", function () {
				options = { img: { Module: imageModule } };
				name = "html-block-example.docx";
				expectedName = "expected-empty-image.docx";
				data = {
					html: "<p>Hello</p><img></img><p>Bye</p>",
				};
				return this.loadAndRender();
			});
			it("should work inside li", function () {
				options = { img: { Module: imageModule } };
				name = "html-block-example.docx";
				expectedName = "expected-li-image.docx";
				data = {
					html: `<p><ul><li>Image inside text : <img src="${base64PNGImage}"><br></li></ul> </p> `,
				};
				this.loadAndRender();
			});

			it("should work inside a", function () {
				options = { img: { Module: imageModule } };
				name = "html-block-example.docx";
				expectedName = "expected-link-image.docx";
				data = {
					html: `<p><a href="https://docxtemplater.com">Image inside link : <img src="${base64PNGImage}"></a></p> `,
				};
				this.loadAndRender();
			});

			it("should work with inline", function () {
				options = { img: { Module: imageModule } };
				name = "html-block-example.docx";
				expectedName = "expected-inline-image.docx";
				data = {
					html: `<p>Hello<img src="${base64PNGImage}"/> how are you ?</p>`,
				};
				return this.loadAndRender();
			});

			it("should work with inline image that is empty", function () {
				options = {
					img: { Module: imageModule },
					styleSheet: `img {
						display: block;
						margin: auto;
					}`,
				};
				name = "html-block-example.docx";
				expectedName = "expected-inline-empty-image.docx";
				data = {
					html: "<p>Hello<img  /> how are you ?</p>",
				};
				return this.loadAndRender();
			});

			it("should work with size", function () {
				options = { img: { Module: imageModule } };
				name = "html-block-example.docx";
				expectedName = "expected-inline-resized.docx";
				data = {
					html: `<p>Hello<img src="${base64PNGImage}" width="20" height="50"/> how are you ?</p>`,
				};
				return this.loadAndRender();
			});

			it("should be possible to change the default size to 100%", function () {
				options = {
					img: {
						Module: imageModule,
						getSize({ element, src, part }) {
							expect(element.parsedStyle[0].property).to.be.equal("width");
							expect(element.parsedStyle[0].value).to.be.equal("120px");
							expect(part.value).to.be.equal("html");
							expect(parseInt(part.containerWidth, 10)).to.be.equal(487);
							expect(element.attribs.src.length).to.be.equal(402);
							expect(src.byteLength).to.be.equal(283);
							return [part.containerWidth, part.containerWidth];
						},
					},
				};
				name = "html-block-example.docx";
				expectedName = "expected-inline-resized2.docx";
				data = {
					html: `<img style="width: 120px;" src="${base64PNGImage}"/><p>how are you ?</p>`,
				};
				return this.loadAndRender();
			});

			it("should be possible to add a caption", function () {
				options = {
					img: {
						Module: imageModule,
						getProps({ element, src, part }) {
							expect(part.value).to.be.equal("html");
							expect(element.parsedStyle).to.be.deep.equal([]);
							expect(element.attribs.src.length).to.be.equal(402);
							expect(src.byteLength).to.be.equal(283);
							return {
								caption: {
									text: `: ${element.attribs.title}`,
								},
							};
						},
					},
				};
				name = "html-block-example.docx";
				expectedName = "expected-inline-caption.docx";
				data = {
					html: `<img src="${base64PNGImage}" title="my base64 image"/><p>how are you ?</p>`,
				};
				return this.loadAndRender();
			});

			it("should work with jpeg", function () {
				options = { img: { Module: imageModule } };
				name = "html-block-example.docx";
				expectedName = "expected-block-image-2.docx";
				data = {
					html: `<p>Hello</p><img src="${base64JPEGImage}"/>`,
				};
				return this.loadAndRender();
			});

			it("should work with gif", function () {
				options = { img: { Module: imageModule } };
				name = "html-block-example.docx";
				expectedName = "expected-block-image-3.docx";
				data = {
					html: `<p>Hello</p><img src="${base64GIFIMage}"/>`,
				};
				return this.loadAndRender();
			});

			it("should work with padding left", function () {
				name = "html-block-example.docx";
				expectedName = "expected-margin-padding-left.docx";
				options = { img: { Module: imageModule } };
				data = {
					html:
						marginPaddingLeft +
						`<img width="30" height="30" src="${base64PNGImage}"/>`,
				};
				return this.loadAndRender();
			});

			it("should work asynchronously without specifying getValue", function () {
				async = true;
				v4 = true;
				name = "html-block-example.docx";
				expectedName = "expected-async-image-2.docx";
				options = { img: { Module: imageModule } };
				data = {
					html: resolveSoon(
						`<h1>Foobar<strong>type</strong></h1><img width="30" height="30" src="${base64PNGImage}"/><img width="30" height="30" src="${base64JPEGImage}"/>`
					),
				};
				return this.loadAndRender();
			});

			it("should work asynchronously", function () {
				async = true;
				v4 = true;
				name = "html-block-example.docx";
				expectedName = "expected-async-image.docx";
				const srcs = [];
				options = {
					img: {
						Module: imageModule,
						getValue: (el) => {
							const src = el.attribs.src;
							srcs.push(src);
							if (src.indexOf("foo") !== -1) {
								return resolveSoon(base64DataURLToArrayBuffer(base64GIFIMage));
							} else if (src.indexOf("bar") !== -1) {
								return resolveSoon(base64DataURLToArrayBuffer(base64PNGImage));
							}
							throw new Error(`Image cannot be resolved : ${src}`);
						},
					},
				};
				data = {
					html: resolveSoon(
						"<h1>Foobar<strong>type</strong></h1>" +
							'<img width="30" height="30" src="http://foo.com/img.png"/>' +
							'<img width="30" height="30" src="http://bar.com/img.png"/>'
					),
				};
				return this.loadAndRender().then(function () {
					expect(srcs).deep.equal([
						"http://foo.com/img.png",
						"http://bar.com/img.png",
					]);
				});
			});

			if (typeof window === "undefined") {
				it("should work within table and 100% width", function () {
					name = "html-block-example.docx";
					expectedName = "expected-within-table.docx";
					options = {
						img: {
							Module: imageModule,
							getSrcSize(img) {
								const size = sizeOf(Buffer.from(img.src));
								return [size.width, size.height];
							},
						},
						styleSheet: `table img {
							width: 100%;
						}`,
					};
					data = {
						html: `
						<table width="450">
						<tr>
						<td width="100">Hello</td>
						<td width="250">
						<img style="width: 50%;" src="${base64GIFIMage}"/>
						</td>
						<td width="100">
						<img src="${base64GIFIMage}"/>
						</td>
						</tr>
						</table>
						<img src="${base64GIFIMage}" width="100" height="100"/>
						`,
					};
					return this.loadAndRender();
				});

				it("should work in multi-column section to set width of table and img", function () {
					name = "html-within-multi-column.docx";
					expectedName = "expected-table-within-multi-column.docx";
					data = {
						html: tableHello + `<img src="${base64PNGImage}"/>`,
					};
					options = {
						getDxaWidth: (sections, currentSection) => {
							expect(sections.length).to.equal(3);
							expect(sections[0].width).to.equal(11906);
							expect(sections[0].leftMargin).to.equal(1701);
							expect(sections[0].rightMargin).to.equal(850);
							expect(sections[0].cols).to.equal(1);
							expect(currentSection.cols).to.equal(3);

							return (
								(currentSection.width -
									currentSection.leftMargin -
									currentSection.rightMargin) /
								currentSection.cols
							);
						},
						img: {
							Module: imageModule,
							getSrcSize(img) {
								const size = sizeOf(Buffer.from(img.src));
								return [size.width, size.height];
							},
						},
						styleSheet: "table, img { width: 100%; }",
					};

					return this.loadAndRender();
				});
			}

			it("should work with multi column of different sizes", function () {
				name = "columns-of-different-sizes.docx";
				expectedName = "expected-columns-of-different-sizes.docx";
				const table = `
				<p>paragraph</p>
				<table style='width: 100%; margin: 0'>
					<tr>
						<td colspan="2">Hello</td>
					</tr>
					<tr>
						<td colspan="2">Bye</td>
					</tr>
					<tr>
						<td>1</td>
						<td>2</td>
					</tr>
					</table>`;
				data = {
					table1: table,
					table2: table,
				};
				return this.loadAndRender();
			});
		});

		describe("Image module Failures", function () {
			it("should not fail with async if no image module attached", function () {
				async = true;
				v4 = true;
				name = "html-block-example.docx";
				expectedName = "expected-code-block.docx";
				options.ignoreUnknownTags = true;
				data = {
					html: resolveSoon(
						"<p>Hello</p><code>foo</code><img src='foobar.png'>"
					),
				};
				return this.loadAndRender();
			});

			it("should not fail with sync if no image module attached", function () {
				name = "html-block-example.docx";
				expectedName = "expected-code-block.docx";
				options.ignoreUnknownTags = true;
				data = { html: "<p>Hello</p><code>foo</code><img src='foobar.png'>" };
				return this.loadAndRender();
			});

			it("should not delete around text with inline", function () {
				name = "html-inline-regression-no-delete-text.docx";
				expectedName = "expected-inline-sup.docx";
				data = { html: "<sup>foo</sup>" };
				return this.loadAndRender();
			});
		});

		describe("Should work in header", function () {
			it("should work with link and lists", function () {
				v4 = true;
				name = "header.docx";
				expectedName = "expected-link-header.docx";
				data = {
					html: `<p><a href="https://www.ddg.gg">DDG</a></p>
						<ul>
						<li>foo</li>
						<li>foo</li>
						<li>foo</li>
						</ul>`,
				};
				return this.loadAndRender();
			});
		});
	}
}

if (path.resolve) {
	setExamplesDirectory(path.resolve(__dirname, "..", "examples"));
}
setStartFunction(testStart);
start();
