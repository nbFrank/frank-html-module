const numberingXml = require("./numbering.xml.js");
const { str2xml } = require("docxtemplater").DocUtils;
const { addRelationship, addExtensionRels } = require("./relation-utils.js");

module.exports = function addListSupport(xmlDocuments, mainRelsFile) {
	xmlDocuments["word/numbering.xml"] ||= str2xml(numberingXml);
	addExtensionRels(
		"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml",
		"/word/numbering.xml",
		xmlDocuments
	);
	addRelationship(
		{
			Type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering",
			Target: "numbering.xml",
		},
		xmlDocuments[mainRelsFile]
	);
};
