function clearLeadingWhitespace(text) {
	return text.replace(/^ +/g, "");
}
function clearTrailingWhitespace(text) {
	return text.replace(/ +$/g, "");
}

function stripRunsWhiteSpace(runs) {
	return runs
		.map(function (run, index) {
			const previousRun = runs[index - 1] || {};
			if (run.whitespace && (index === 0 || index === runs.length - 1)) {
				return "";
			}
			if (run.whitespace && previousRun.endsWhitespace) {
				return "";
			}
			let newText = run.text;
			if (run.calc) {
				if (index === 0 || previousRun.endsWhitespace) {
					newText = clearLeadingWhitespace(newText);
				}
				if (index === runs.length - 1) {
					newText = clearTrailingWhitespace(newText);
				}
				if (run.text !== newText) {
					return run.calc(newText);
				}
			}
			return run.data;
		})
		.join("");
}

function isWhiteSpace(text) {
	return /^[\t\r\n ]*$/g.test(text);
}
function startsWhiteSpace(text) {
	return /^[\t\r\n ]+/.test(text);
}
function endsWhiteSpace(text) {
	return /[\t\r\n ]+$/.test(text);
}
function clearWhitespace(text) {
	return text.replace(/[\n\t\r ]+/g, " ");
}

module.exports = {
	stripRunsWhiteSpace,
	isWhiteSpace,
	startsWhiteSpace,
	endsWhiteSpace,
	clearWhitespace,
};
