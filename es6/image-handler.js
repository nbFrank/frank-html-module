const { get } = require("lodash");
const { getHtmlContent } = require("./html-utils.js");
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

module.exports = function handleImage(
	type,
	element,
	runProperties,
	transformer
) {
	if (!transformer.img) {
		if (transformer.ignoreUnknownTags) {
			return "";
		}
		const error = new Error(
			`Tag ${type} is not supported if imagemodule not included (See https://docxtemplater.com/modules/html/#supportforimageswithimg)`
		);
		throw error;
	}
	let src;
	if (type === "svg") {
		src = getHtmlContent(element);
	} else {
		if (!element.attribs.src) {
			if (element.centered) {
				return "";
			}
			return "<w:r><w:t></w:t></w:r>";
		}
		const resolvedSrc = get(transformer, [
			"resolvedImages",
			element.attribs.src,
		]);
		if (resolvedSrc) {
			src = resolvedSrc;
		} else if (type === "img") {
			src = base64DataURLToArrayBuffer(element.attribs.src);
		}
	}
	transformer.img.dpi = transformer.dpi;
	const { lIndex, containerWidth, containerHeight } = transformer.part;
	const value = transformer.img.render(
		{
			type: "placeholder",
			module: element.centered
				? "open-xml-templating/docxtemplater-image-module-centered"
				: "open-xml-templating/docxtemplater-image-module",
			value: { element, src, part: transformer.part, transformer },
			lIndex,
			containerWidth,
			containerHeight,
		},
		{
			filePath: transformer.filePath,
			scopeManager: {
				...transformer.scopeManager,
				getValue(src) {
					return src;
				},
			},
		}
	).value;
	if (element.centered) {
		return value;
	}
	return `<w:r>
		<w:rPr/>
		${value}
		</w:r>
		`;
};
