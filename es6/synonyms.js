const synonyms = {
	BodyText: "TextBody",
};

function getSynonym(name, existingSynonyms) {
	return existingSynonyms[name] || name;
}

function reverseSynonyms(synonyms) {
	return Object.keys(synonyms).reduce(function (reversedSynonyms, synKey) {
		const synValue = synonyms[synKey];
		reversedSynonyms[synValue] = reversedSynonyms[synValue] || [];
		reversedSynonyms[synValue].push(synKey);
		return reversedSynonyms;
	}, {});
}

const reversedSynonyms = reverseSynonyms(synonyms);

module.exports = {
	synonyms,
	reversedSynonyms,
	reverseSynonyms,
	getSynonym,
};
