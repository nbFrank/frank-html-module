const { map } = require("lodash");
function paragraph(text) {
	return text.content;
}
const defaultLeftMargin = 47;

// eslint-disable-next-line complexity
function getBorder(border, borderProps) {
	if (border == null) {
		return "";
	}
	if (border === "none" || border.type === "none") {
		return `<w:tcBorders>
<w:top w:val="nil"/>
<w:left w:val="nil"/>
<w:bottom w:val="nil"/>
<w:right w:val="nil"/>
<w:insideH w:val="nil"/>
<w:insideV w:val="nil"/>
</w:tcBorders>`;
	}

	border.size ||= 4;
	border.color ||= "000000";
	border.val = "single";

	return `<w:tcBorders>
		<w:top w:val="${borderProps.top.style || border.val}" w:sz="${
		borderProps.top.sz || border.size
	}" w:space="0" w:color="${borderProps.top.color || border.color}"/>
		<w:left w:val="${borderProps.left.style || border.val}" w:sz="${
		borderProps.left.sz || border.size
	}" w:space="0" w:color="${borderProps.left.color || border.color}"/>
		<w:bottom w:val="${borderProps.bottom.style || border.val}" w:sz="${
		borderProps.bottom.sz || border.size
	}" w:space="0" w:color="${borderProps.bottom.color || border.color}"/>
		<w:right w:val="${borderProps.right.style || border.val}" w:sz="${
		borderProps.right.sz || border.size
	}" w:space="0" w:color="${borderProps.right.color || border.color}"/>
		<w:insideH w:val="${border.val}" w:sz="${border.size}" w:space="0" w:color="${
		border.color
	}"/>
		<w:insideV w:val="${border.val}" w:sz="${border.size}" w:space="0" w:color="${
		border.color
	}"/>
	</w:tcBorders>`;
}

module.exports = function table(table, element) {
	function tr(row) {
		const trProps = [];
		if (row.repeatHeaderRow) {
			trProps.push("<w:tblHeader/>");
		}
		if (row.cantSplit) {
			trProps.push("<w:cantSplit/>");
		}
		return `<w:tr>
		${trProps.length > 0 ? `<w:trPr>${trProps.join("")}</w:trPr>` : "<w:trPr/>"}
		${row.parts.map(tc.bind(null)).join("\n")}
		</w:tr>`;
	}
	if (
		table.data.length === 0 ||
		(table.data.length === 1 &&
			table.data[0].length === 1 &&
			table.data[0][0].empty === true)
	) {
		return "";
	}

	function tc(element) {
		const {
			empty,
			colspan,
			rowspan,
			bgColor,
			width,
			vAlign,
			borderColor,
			padding,
			border: borderProps,
		} = element;
		if (empty === true) {
			return `<w:tc>
			<w:tcPr>
			</w:tcPr>
			<w:p>
			<w:r>
			<w:t></w:t>
			</w:r>
			</w:p>
			</w:tc>`;
		}
		let border = table.border;
		if (borderColor && typeof table.border !== "string") {
			border = { ...table.border, color: borderColor };
		}
		const gridSpan = colspan ? `<w:gridSpan w:val="${colspan}"/>` : "";
		let { vMerge } = element;
		if (vMerge === "continue") {
			return `<w:tc>
			<w:tcPr>
			${getBorder(border, borderProps)}
			${gridSpan}
			<w:vMerge w:val="continue"/>
			</w:tcPr>
			<w:p>
			<w:pPr>
			<w:rPr/>
			</w:pPr>
			<w:r>
			<w:rPr/>
			</w:r>
			</w:p>
			</w:tc>`;
		}
		let tcMarContent;
		if (Object.keys(padding).length > 0) {
			tcMarContent = map(padding, function (value, key) {
				return `<w:${key} w:w="${value}" w:type="dxa"/>`;
			}).join("");
		} else {
			tcMarContent = '<w:left w:w="45" w:type="dxa"/>';
		}
		const wtcMar = `<w:tcMar>${tcMarContent}</w:tcMar>`;
		vMerge = rowspan > 1 ? '<w:vMerge w:val="restart"/>' : "";
		const wvAlign = vAlign ? `<w:vAlign w:val="${vAlign}"/>` : "";
		const wshd = bgColor
			? `<w:shd w:val="clear" w:color="${bgColor}" w:fill="${bgColor}"/>`
			: '<w:shd w:fill="auto" w:val="clear"/>';
		let paragraphContent = paragraph(element);
		if (paragraphContent.indexOf("<w:p") === -1) {
			paragraphContent = "<w:p><w:r><w:t></w:t></w:r></w:p>";
		}
		return `
			<w:tc>
			<w:tcPr>
			<w:tcW w:w="${width}" w:type="dxa"/>
			${getBorder(border, borderProps)}
			${gridSpan}
			${vMerge}
			${wshd}
			${wvAlign}
			${wtcMar}
			</w:tcPr>
			${paragraphContent}
			</w:tc>
			`;
	}

	const { data, colGrid } = table;
	const wtblGrid = colGrid
		.map(function (width) {
			return `<w:gridCol w:w="${width}"/>`;
		})
		.join("");

	let props = [];
	if (element.customProperties) {
		props = Object.keys(element.customProperties).reduce(function (props, key) {
			if (key === "tblStyle") {
				props.push(`<w:${key} w:val="${element.customProperties[key]}"/>`);
			}
			return props;
		}, []);
	}
	const leftMargin =
		table.margin.left == null ? defaultLeftMargin : table.margin.left;
	const fixed = table.layout === "fixed";
	const value = `
    <w:tbl>
      <w:tblPr>
        ${props.join("")}
        <w:tblW w:w="${table.width}" w:type="dxa"/>
        <w:jc w:val="${table.alignment}"/>
        <w:tblInd w:w="${leftMargin}" w:type="dxa"/>
        ${fixed ? '<w:tblLayout w:type="fixed"/>' : ""}
        <w:tblCellMar>
          <w:top w:w="55" w:type="dxa"/>
          <w:left w:w="45" w:type="dxa"/>
          <w:bottom w:w="55" w:type="dxa"/>
          <w:right w:w="55" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>
      <w:tblGrid>
      ${wtblGrid}
      </w:tblGrid>
      ${data.map(tr).join("\n")}
    </w:tbl>
	<w:p>
	<w:pPr>
	<w:pStyle w:val="Normal"/>
	<w:spacing w:before="0" w:after="200"/>
	<w:rPr/>
	</w:pPr>
	<w:r>
	<w:rPr/>
	</w:r>
	</w:p>
    `;
	return value;
};
