const { get, cloneDeep } = require("lodash");

const styles = require("./doc-styles.js")();

const tags = {
	script: {
		type: "ignored",
	},
	link: {
		type: "ignored",
	},
	meta: {
		type: "ignored",
	},
	title: {
		type: "ignored",
	},
	iframe: {
		type: "ignored",
	},
	style: {
		type: "ignored",
	},
	ol: {
		type: "block",
		tags: ["list-container"],
		data: {
			ordered: true,
			pStyle: { oneOf: ["TextBody", { default: "paragraph" }] },
			useNumPr: true,
		},
	},
	ul: {
		type: "block",
		tags: ["list-container"],
		data: {
			ordered: false,
			pStyle: { oneOf: ["TextBody", { default: "paragraph" }] },
			useNumPr: true,
		},
	},
	pre: {
		type: "block",
		tags: ["preformatted"],
		data: {
			xmlproperty: "preformatted",
		},
	},
	img: {
		type: "inline",
		tags: ["img"],
	},
	li: {
		type: "block",
	},
	span: {
		type: "inline",
		data: {
			xmlproperty: "",
		},
	},
	a: {
		type: "inline",
		tags: ["link"],
	},
	br: {
		type: "inline",
	},
	svg: {
		type: "inline",
		tags: ["svg"],
	},
	table: {
		type: "block",
		tags: ["table"],
	},
	thead: {
		type: "block",
		tags: ["table"],
	},
	tbody: {
		type: "block",
		tags: ["table"],
	},
	tfoot: {
		type: "block",
		tags: ["table"],
	},
	tr: {
		type: "block",
		tags: ["table"],
	},
	th: {
		type: "block",
		tags: ["table"],
	},
	td: {
		type: "block",
		tags: ["table"],
	},
	input: {
		type: "inline",
		data: {
			xmlproperty: "",
		},
	},
	b: {
		type: "inline",
		data: {
			xmlproperty: "bold",
		},
	},
	i: {
		type: "inline",
		data: {
			xmlproperty: "italic",
		},
	},
	em: {
		type: "inline",
		data: {
			xmlproperty: "italic",
		},
	},
	strong: {
		type: "inline",
		data: {
			xmlproperty: "bold",
		},
	},
	s: {
		type: "inline",
		data: {
			xmlproperty: "strike",
		},
	},
	del: {
		type: "inline",
		data: {
			xmlproperty: "strike",
		},
	},
	small: {
		type: "inline",
		data: {
			xmlproperty: "small",
		},
	},
	sub: {
		type: "inline",
		data: {
			xmlproperty: "sub",
		},
	},
	sup: {
		type: "inline",
		data: {
			xmlproperty: "sup",
		},
	},
	u: {
		type: "inline",
		data: {
			xmlproperty: "underline",
		},
	},
	ins: {
		type: "inline",
		data: {
			xmlproperty: "underline",
		},
	},
	code: {
		type: "inline",
		data: {
			xmlproperty: "code",
		},
	},
	div: {
		type: "block",
		data: {
			props: [],
		},
	},
	h1: styles.Heading,
	h2: styles.Heading1,
	h3: styles.Heading2,
	h4: styles.Heading3,
	h5: styles.Heading4,
	h6: styles.Heading5,
	p: {
		type: "block",
		data: {
			props: ['<w:u w:val="single"/>'],
		},
	},
};

const attrs = {
	sup: { tag: "w:vertAlign", value: '<w:vertAlign w:val="superscript"/>' },
	sub: { tag: "w:vertAlign", value: '<w:vertAlign w:val="subscript"/>' },
	small: { tag: "w:vertAlign", value: '<w:vertAlign w:val="subscript"/>' },
	bold: { tag: "w:b", value: "<w:b/>" },
	underline: { tag: "w:u", value: '<w:u w:val="single"/>' },
	italic: { tag: "w:i", value: "<w:i/>" },
	strike: { tag: "w:strike", value: "<w:strike/>" },
	code: { tag: "w:highlight", value: '<w:highlight w:val="lightGray"/>' },
	preformatted: {
		tag: "w:rFonts",
		value: '<w:rFonts w:ascii="Courier" w:hAnsi="Courier"/>',
	},
};

tags["o:p"] = tags.p;
tags.article = tags.p;
tags.dl = tags.p;
tags.dt = tags.p;
tags.dd = tags.p;
tags.blockquote = tags.div;
tags.form = tags.div;
tags.button = tags.span;
tags.label = tags.span;
tags.textarea = tags.div;

class TagRepository {
	constructor(options) {
		this.tags = cloneDeep(tags);
		if (!options.getTag) {
			throw new Error("getTag function not defined");
		}
		this.getTag = (name) => {
			return options.getTag(this.tags, name);
		};
		this.getXmlProperties = this.getXmlProperties.bind(this);
		this.hasTag = this.hasTag.bind(this);
		this.isBlock = this.isBlock.bind(this);
		this.isIgnored = this.isIgnored.bind(this);
	}
	getXmlProperties(name) {
		return get(this.getTag(name), "data.xmlproperty");
	}
	hasTag(name, tagName) {
		return get(this.getTag(name), "tags", []).indexOf(tagName) !== -1;
	}
	getProps(name) {
		return get(this.getTag(name), "data.props", []);
	}
	getPStyle(name) {
		return get(this.getTag(name), "data.pStyle", null);
	}
	getOrdered(name) {
		return get(this.getTag(name), "data.ordered", {});
	}
	getNumPr(name) {
		return get(this.getTag(name), "data.useNumPr", false);
	}
	isBlock(name) {
		return this.getTag(name).type === "block";
	}
	isIgnored(name) {
		return this.getTag(name).type === "ignored";
	}
}

module.exports = {
	TagRepository,
	attrs,
};
