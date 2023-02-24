import HTMLModule from "./index.js";
import ImageModule from "../../image/es6/index.js";

const PizZip: any = require("pizzip");
import { expectType, expectError } from "tsd";
const fs = require("fs");

const mod = new HTMLModule();
const mod2 = new HTMLModule({});

expectError(
	new HTMLModule({
		deviceWidth: "foobar",
	})
);

new HTMLModule({
	deviceWidth: 10,
	ignoreUnknownTags: true,
	ignoreCssErrors: false,
	styleSheet: "p { font-size: 15px; }",
	elementCustomizer(el) {
		expectType<string[]>(el.classNames);
	},
});

new HTMLModule({
	ignoreUnknownTags: true,
	img: {
		Module: ImageModule,
		getValue: (el) => {
			return Promise.resolve(Buffer.from("hhh"));
		},
		getSize: function (data) {
			return [100, 100];
		},
		getProps({ element, src, part }) {
			console.log(part.value);
			console.log(element.parsedStyle);
			console.log(element.attribs.src.length);
			console.log(src.byteLength);
			return {
				caption: {
					text: `Hello !`,
				},
			};
		},
	},
});

new HTMLModule({
	ignoreUnknownTags: true,
	img: {
		Module: ImageModule,
		getValue: (el) => {
			return Promise.resolve(new ArrayBuffer(100));
		},
		getSize: function (data) {
			return [100, 100];
		},
		getProps({ element, src, part }) {
			console.log(part.value);
			console.log(element.parsedStyle);
			console.log(element.attribs.src.length);
			console.log(src.byteLength);
			return {
				caption: {
					text: `Hello !`,
				},
			};
		},
	},
});
