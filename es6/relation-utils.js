const { map } = require("lodash");

function getRelationRid(relationship) {
	const id = relationship.getAttribute("Id");
	if (/^rId[0-9]+$/.test(id)) {
		return parseInt(id.substr(3), 10);
	}
	return -1;
}

function getRid(relsDoc) {
	const iterable = relsDoc.getElementsByTagName("Relationship");
	return Array.prototype.reduce.call(
		iterable,
		function (max, relationship) {
			return Math.max(max, getRelationRid(relationship));
		},
		0
	);
}

function addRelationship(objMap, relsDoc) {
	const relationships = relsDoc.getElementsByTagName("Relationships")[0];
	const currentRelationships = relsDoc.getElementsByTagName("Relationship");

	const registeredTargets = Array.prototype.filter.call(
		currentRelationships,
		function (rel) {
			return rel.getAttribute("Target") === objMap.Target;
		}
	);
	if (registeredTargets.length > 0) {
		return getRelationRid(registeredTargets[0]);
	}

	const newTag = relsDoc.createElement("Relationship");
	const maxRid = getRid(relsDoc) + 1;
	newTag.setAttribute("Id", `rId${maxRid}`);
	map(objMap, (value, key) => newTag.setAttribute(key, value));
	relationships.appendChild(newTag);
	return maxRid;
}

function addExtensionRels(contentType, partName, xmlDocuments) {
	const contentTypeDoc = xmlDocuments["[Content_Types].xml"];
	const overrideTags = contentTypeDoc.getElementsByTagName("Override");
	const overrideRegistered = Array.prototype.some.call(
		overrideTags,
		function (tag) {
			return tag.getAttribute("PartName") === partName;
		}
	);
	if (overrideRegistered) {
		return;
	}
	const types = contentTypeDoc.getElementsByTagName("Types")[0];
	const newTag = contentTypeDoc.createElement("Override");
	newTag.setAttribute("ContentType", contentType);
	newTag.setAttribute("PartName", partName);
	types.appendChild(newTag);
}

module.exports = {
	addRelationship,
	addExtensionRels,
};
