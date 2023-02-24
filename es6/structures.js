function runify(data) {
	if (data == null) {
		return [];
	}
	return [
		{
			type: "run",
			data,
		},
	];
}
function paragraphify(data) {
	if (data == null) {
		return [];
	}
	return [
		{
			type: "paragraph",
			data,
		},
	];
}

module.exports = {
	runify,
	paragraphify,
};
