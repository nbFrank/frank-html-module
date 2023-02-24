export namespace docxtemplater_html_module_namespace {
	type integer = number;
	interface Part {
		type: string;
		value: string;
		module: string;
		raw: string;
		offset: integer;
		lIndex: integer;
		num: integer;
		inverted?: boolean;
		endLIndex?: integer;
		expanded?: Part[];
		subparsed?: Part[];
	}

	interface Element {
		classNames: string[];
		styleDefaults: { [x: string]: string };
		part: Part;
		matches(selector: string): boolean;
		styleIds: string[];
		attribs: { [x: string]: string };
		parsedStyle: string;
	}

	interface Border {
		size: integer;
		color: string;
		type: string;
	}

	interface CustomizedElement {
		htmlStyle?: string;
		pStyle?: string;
		tblStyle?: string;
		defaultBorder?: Border;
		bullets?: string[];
		cantSplit?: boolean;
		repeatHeaderRow?: boolean;
		useNumPr?: boolean;
	}

	type ZipInput =
		| string
		| number[]
		| Uint8Array
		| ArrayBuffer
		| Blob
		| NodeJS.ReadableStream
		| Promise<string>
		| Promise<number[]>
		| Promise<Uint8Array>
		| Promise<ArrayBuffer>
		| Promise<Blob>
		| Promise<NodeJS.ReadableStream>;

	interface HTMLOptions {
		deviceWidth?: integer;
		ignoreUnknownTags?: boolean;
		ignoreCssErrors?: boolean;
		styleSheet?: string;
		elementCustomizer?(element: Element): CustomizedElement | void;
		img?: {
			Module: any;
			getValue?(el: Element): ZipInput;
			getSize?(data: {
				part: Part;
				element: Element;
				src: any;
			}): [integer, integer] | Promise<[integer, integer]>;
			getSrcSize?(data: { src: string }): [integer, integer];
			getProps?(data: { element: Element; src: any; part: Part }): {
				[x: string]: any;
			};
		};
	}
}

declare class docxtemplater_html_module {
	constructor(options?: docxtemplater_html_module_namespace.HTMLOptions);
}
export default docxtemplater_html_module;
