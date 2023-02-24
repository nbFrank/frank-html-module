const lorem = `
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const insAndDel = `Hello
	<del>Test</del>
	<ins>foo</ins>
	<b>end</b>
	`;

const titles =
	"<h1>My title</h1> <p>Normal1</p> <h2>My subtitle2</h2> <h3>My subtitle3</h3> <h4>My subtitle4</h4> <h5>My subtitle5</h5><h6>My subtitle6</h6><p>Normal2</p>";

const inlineStyle =
	"<span style='color: #6ca980;background-color: blue'>color output</span>";
const links = "Foobar <a href='https://ddg.gg'>Duck duck go</a>";
const checkboxWithLabel =
	'<label>Foobar</label> <input type="checkbox"> Foobaz <input type="checkbox" checked>';
const specialInputs = `
	<p>Foobar <form>Checkbox :<input type="checkbox"><input type="hidden">Checkbox :<input type="checkbox">Textinput: <input type="text" value="hello"></form></p>
	<p>Foobar <form>Checkbox :<input type="checkbox"><input type="hidden">Checkbox :<input type="checkbox">Textinput: <input type="text"><button>Foobar</button></form></p>
`;
const checkbox =
	'Foobar <input type="checkbox"> Foobaz <input type="checkbox" checked>';
const mixed =
	"<p>This is a minute</p><ul><li>Some text</li><li>More text</li></ul>";
const mixed2 =
	"<p><b>More text</b>with more <span style='color:#ff0000'>formatting</span></p>";
const mixed3 = `
<p>This minute contains HTML markup supported by docxtemplater HTML module. Spec is available <a href="https://docxtemplater.com/modules/ffoooo/" target="_blank">here</a>&nbsp;and <a href="https://docxtemplater.com/modules/html/">not in new window here</a></p>
<p>This is a minute</p><ul><li>Some text</li><li>More text</li></ul>
<h1 style="color:#d31717">Mega minute</h1>
<h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading5</h5>
<h6>Heading 6</h6><p>Back to Paragraphs :)</p><p>Bold <strong>is supported</strong> as you can see.</p><p>As is <em>italics </em> and <span
style="text-decoration:underline;">underlined</span>.</p>
<ul><li>Unordered lists</li><li>Are also usable</li></ul>
<p>As are:</p>
<ol>
<li>Ordered lists</li>
<li>Hooray</li>
</ol>
`;

const tableStyleTh = `
<div>
	<table>
		<thead>
			<tr>
				<th width="40" style="background-color:#003c81">
				Hi
				</th>
				<th width="220" style="background-color:red">
				Ho
				</th>
				<th width="100" style="background-color:yellow">
				Hu
				</th>
				<th width="100" style="background-color:lime">
				Ha
				</th>
			</tr>
		</thead>
		<tbody></tbody>
	</table>
</div>
`;

const tableAlignedRight = `
<table width="200" align="right">
<tr>
	<td>Foo</td>
	<td>Foo</td>
	<td>Foo</td>
</tr>
<tr>
	<td>Bar</td>
	<td>Bar</td>
	<td>Bar</td>
</tr>
</table>
<table width="200" style="margin-left: auto;">
<tr>
	<td>Foo</td>
	<td>Foo</td>
	<td>Foo</td>
</tr>
<tr>
	<td>Bar</td>
	<td>Bar</td>
	<td>Bar</td>
</tr>
</table>
`;

const tableAlignedCenter = `
<table style="width: 200px; margin-left: auto; margin-right: auto">
<tr>
<th>1</th>
<td>2</td>
</tr>
</table>
<table style="width: 200px; margin: auto;">
<tr>
<th>1</th>
<td>2</td>
</tr>
</table>
<table style="width: 200px; margin: 0     auto;">
<tr>
<th>1</th>
<td>2</td>
</tr>
</table>
<table style="width: 200px; margin: auto     auto auto;">
<tr>
<th>1</th>
<td>2</td>
</tr>
</table>
<table style="width: 200px; margin: 0 auto 0 auto;">
<tr>
<th>1</th>
<td>2</td>
</tr>
</table>
`;

const divNestedUncentered = `<div>
	<p>Uncentered</p>
	<p style="text-align:center">Centered</p>
</div>`;

const tableHello = `
<table>
	<tbody>
		<tr>
			<th>Hello</th><th>Hello</th><th>Hello</th><th>Hello</th>
		</tr>
		<tr>
			<td>Hello</td><td>Hello</td><td>Hello</td><td>Hello</td>
		</tr>
		<tr>
			<td>Hello</td><td>Hello</td><td>Hello</td><td>Hello</td>
		</tr>
	</tbody>
</table>
`;

const tableColored = `
<table>
<tr>
<th style="color: #0000FF">Blue</th>
<td style='background-color: #FF1700; color:#00FF00'>Green</td>
</tr>
<tr>
<th>Black</th>
<td style='background-color: #FFC388; color:#FFFFFF;'>White</td>
</tr>
</table>
`;

const fontFamily = `
<p>
<span style='font-family: \"Times New Roman\", Times, serif'>Times</span> <span> normal</span> <span style='font-family: \"courier\", times, serif'> courier </span> <span> normal</span>
</p>
<p>
<span style='font-family: fantasy'>Fantasy</span>
<span style='font-family: serif'>Serif</span>
<span style='font-family: sans-serif'>Sans-Serif</span>
<span style='font-family: cursive'>cursive</span>
<span style='font-family: monospace'>monospace</span>
</p>
`;

const tableMargin0 = `
<div>
    <table style=\"margin: 0 0; border: none; width: 100%\">
        <tbody>
        <tr>
        <td>Hi</td>
        <td>Ho</td>
        </tr>
        <tr>
        <td>Hu</td>
        <td>Ha</td>
        </tr>
        </tbody>
    </table>
</div>
`;

const tableMargin100 = `
<div>
    <table style=\"margin: 100px 100px; border: none; width: 300px;\">
        <tbody>
        <tr>
        <td>Hi</td>
        <td>Ho</td>
        </tr>
        <tr>
        <td>Hu</td>
        <td>Ha</td>
        </tr>
        </tbody>
    </table>
</div>
`;

const fontWeight =
	"<span style='font-weight: bold'>bold</span> <span> normal</span> <span style='font-weight: 700 '> bold 700 </span> <span> normal</span>";

const escapedChars =
	"&quot;Test quote&quot; with ampersand &amp; and apostrophe&#x27;s and &gt;&lt; and ’ , also &#x2019; , &#xE9; , *&#xA0 hyphen : &#8209; hyphen : &#8209;";

const mixed4 = `
<p><a href="https://google.com" target="_blank">here</a>&nbsp;and <a href="https://google.com" target="_blank">here</a></p>
`;

const uLists = `
<ul>
	<li>Foo</li>
	<li>Bar</li>
	<li>Baz</li>
</ul>
`;

const spaceRegression = `
<p>
<ul>
<li><em>Lorem ipsum dolor si amet</em> <strong>Test</strong></li>
</ul>
</p>
`;

const listsWithMargins = `
<ol>
        <li>Lorem</li>
        <li>Ipsum</li>
</ol>
<ul style="margin-left:40px">
        <li>Dolor</li>
        <li>Sit</li>
</ul>
<ol style="margin-left:40px">
        <li>Dolor</li>
        <li>Sit</li>
</ol>
<ol style="margin-left:80px">
        <li>Dolor</li>
        <li>Sit</li>
</ol>
`;

const listsWithTopBotomMargins = `
<ul>
<li style="margin: 0;">HiHo</li>
<li style="margin-top: 0; margin-bottom: 0px;">HiHo</li>
<li style="margin-top: 0px; margin-bottom: 0px;">HiHo</li>
</ul>
`;

const paragraphMargin = `
<p>Hi</p>
<p style="margin-top: 100px">Ho</p>
<p style="margin-bottom: 100px">Hu</p>
<p>Ha</p>
`;

const paragraphLineHeight = `
<p>Hi</p>
<p style="margin-top: 100px; line-height: 30px; font-size: 15px;">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
<p style="margin-bottom: 100px; line-height: 12px; font-size: 10px;">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
<p style="margin-bottom: 100px; line-height: 30pt; font-size: 10pt;">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
<p>Ha</p>
`;

const negativeTextIndent = `
<p style="margin-left: 20px; text-indent: -20px;">
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</p>
`;

const tableColoredText = `<table>
<tbody>
	<tr>
		<td style="background-color: #777777; color: #fff">Hello</td>
	</tr>
</tbody>
</table>
`;

const tableBackgroundColor = `<table>
<tbody>
	<tr>
		<td style="background-color: rgb(204, 204, 204)">Hello</td>
	</tr>
	<tr>
		<td style="background: #FFA74F; color:#FF0000;">Hello 2</td>
	</tr>
	<tr style="background-color: rgb(256, 200, 200)">
		<td>Foo</td>
	</tr>
	<tr>
		<td bgcolor="red">Red</td>
	</tr>
	<tr bgcolor="red">
		<td>Red</td>
	</tr>
	<tr style='background: blue url("foo.png") no-repeat fixed center;'>
		<td>Blue</td>
	</tr>
</tbody>
</table>
<table style="border: none; background-color: #ff0000">
	<tr>
		<td>Red</td>
	</tr>
	<tr style="background-color: #00ff00">
		<td>Green</td>
	</tr>
</table>
`;

const tableWithPadding = `
<table border="1">
	<tr>
		<td style="padding-top: 30px; padding-bottom: 30px; padding-left: 30px; padding-right: 30px;">Table with padding</td>
	</tr>
</table>
`;

const tableWithPadding0 = `
<table border="1">
	<tr>
		<td style="padding: 0">Cell with padding zero</td>
	</tr>
</table>
`;

const tableComplex = `<table border="1" cellpadding="0" cellspacing="0" width="576">
<tbody>
<tr>
<td colspan="3" style="background-color: rgb(204, 204, 204);" valign="top" width="576">
<p align="center">
Lorem ipsum dolor sit amet, consectetur elit
</p>
</td>
</tr>
<tr>
<td width="123">
<p>
<br>
</p>
</td>
<td style="background-color: rgb(239, 239, 239);" width="228">
<p align="center">
<span style="background-color: rgb(247, 218, 100);">
Lorem (m²)</span>
</p>
</td>
<td style="background-color: rgb(239, 239, 239);" width="226">
<p align="center">
<span style="background-color: rgb(247, 218, 100);">
Lorem ipsum dolor (m²)</span>
</p>
</td>
</tr>
<tr>
<td style="background-color: rgb(239, 239, 239);" width="123">
<p>
Ut enim ad minim veniam, quis nostrud
</p>
</td>
<td width="228">
<p align="center">
<br>
</p>
</td>
<td width="226">
<p align="center">
<br>
</p>
</td>
</tr>
<tr>
<td style="background-color: rgb(239, 239, 239);" width="123">
<p>
Nostrud</p>
</td>
<td width="228">
<p align="center">
7.213</p>
</td>
<td style="background-color: rgb(239, 239, 239);" width="226">
<p align="center">
<br>
</p>
</td>
</tr>
</tbody>
</table>
`;

const tableRowSpan = `
<table>
	<tr>
		<td>item 1</td>
		<td rowspan=2>item 2</td>
		<td>item 3</td>
	</tr>
	<tr>
		<td>item 4</td> <td>item 5</td>
	</tr>
</table>
`;

const multiTableRowSpan = `
<table>
	<tr>
		<td>item 1</td>
		<td rowspan=3>rowspan</td>
		<td>item 3</td>
		<td rowspan=3>rowspan</td>
	</tr>
	<tr>
		<td>item 4</td> <td>item 5</td>
	</tr>
	<tr>
		<td>item 6</td> <td>item 7</td>
	</tr>
	<tr>
		<td>item 8</td> <td>item 9</td>
		<td>item 10</td> <td>item 11</td>
	</tr>
</table>
`;

const complexRowSpan = `
<table>
	<tr>
		<td>item 1</td>
		<td rowspan=4>rowspan 4</td>
		<td>item 3</td>
		<td rowspan=2>rowspan 2</td>
	</tr>
	<tr>
		<td rowspan=2>rowspan 2</td>
		<td>item 5</td>
	</tr>
	<tr>
		 <td>item 7</td> <td rowspan=2>rowspan 2</td>
	</tr>
	<tr>
		 <td>item 9</td>
		<td>item 10</td>
	</tr>
</table>
`;

const oneRowSpan = `
<table>
	<tr>
		<td rowspan=4 style="vertical-align:middle">span 4</td>
		<td>Hi</td>
	</tr>
	<tr>
		<td>Hi</td>
	</tr>
	<tr>
		<td>Hi</td>
	</tr>
	<tr>
		<td>Hi</td>
	</tr>
	</table>
`;

const tableColRowSpan = `
<table>
	<tr>
		<td colspan=2 rowspan=2>Merged</td>
		<td>Cell 1</td>
	</tr>
	<tr>
		<td>Cell 2</td>
	</tr>
	<tr>
		<td>Cell 3</td>
		<td>Cell 4</td>
		<td>Cell 5</td>
	</tr>
</table>
`;

const tableColRowMulti = `
<table border>
	<tr>
		<td colspan=2 rowspan=2>Merged</td>
		<td rowspan=4>Cell 1</td>
		<td>Cell 2</td>
		<td rowspan=2>Cell 3</td>
	</tr>
	<tr>
		<td>Cell 4</td>
	</tr>
	<tr>
		<td>Cell 6</td>
		<td>Cell 7</td>
		<td>Cell 8</td>
		<td>Cell 9</td>
	</tr>
	<tr>
		<td colspan=2 rowspan=2>Cell 10</td>
		<td colspan=2>Cell 11</td>
	</tr>
	<tr>
		<td>Cell 13</td>
		<td>Cell 14</td>
		<td>Cell 15</td>
	</tr>
	</table>
`;

const tableColSpan = `<table width="576">
   <tbody>
      <tr>
         <td colspan="3" valign="top" width="576">
            <p>Merged</p>
         </td>
      </tr>
      <tr>
         <td width="123">
            <p>1</p>
         </td>
         <td width="228">
            <p>2</p>
         </td>
         <td width="226">
            <p>3</p>
         </td>
      </tr>
   </tbody>
</table>
`;

const tableWithSpecialUnits = `<table style="width:4in">
	<tbody>
	<tr>
	<td style="width:144pt">Two</td>
	<td style="width:1.3in">1.3</td>
	<td style="width:0.7in">0.7</td>
	</tr>
	<tr>
	<td style="width:144pt">Text</td>
	<td style="width:1.3in">Text</td>
	<td style="width:.7in">Text</td>
	</tr>
	</tbody>
</table>

<table style="width:5.08cm">
	<tbody>
	<tr>
	<td style="width:2cm">Cm</td>
	<td style="width:1.44cm">.72</td>
	<td style="width:1.44cm">.72</td>
	</tr>
	<tr>
	<td style="width:2cm">Text</td>
	<td style="width:1.44cm">Text</td>
	<td style="width:1.44cm">Text</td>
	</tr>
	</tbody>
</table>

<table style="width:50.8mm">
	<tbody>
	<tr>
	<td style="width:20mm">Millimeters</td>
	<td style="width:14.4mm">.72</td>
	<td style="width:14.4mm">.72</td>
	</tr>
	<tr>
	<td style="width:20mm">Text</td>
	<td style="width:14.4mm">Text</td>
	<td style="width:14.4mm">Text</td>
	</tr>
	</tbody>
</table>

<table style="width:24pc">
	<tr>
		<td style="width:12pc">Half</td>
		<td style="width:12pc">Half</td>
	</tr>
	<tr>
		<td style="width:12pc">Hello</td>
		<td style="width:12pc">Hello</td>
	</tr>
</table>
`;
const tableWithWrongUnit = `
<table style="width:24wrongunit">
	<tr>
		<td style="width:12wrongunit">Half</td>
		<td style="width:12wrongunit">Half</td>
	</tr>
	<tr>
		<td style="width:12wrongunit">Hello</td>
		<td style="width:12wrongunit">Hello</td>
	</tr>
</table>
`;

const tableColSpanOneRow =
	'<table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td colspan="1" rowspan="1">Training Days</td><td colspan="3">5.00</td></tr></tbody></table>';

const tableWithoutBorder = `
	<table style="border: none;">
		<tr>
			<td>Hello</td>
			<td>Foo</td>
			<td>Bar</td>
		</tr>
		<tr>
			<td>Hello</td>
			<td>Foo</td>
			<td>Bar</td>
		</tr>
	</table>
`;

const tableColoredBorders = `
<table style="border-collapse: collapse;">
<tr>
<td style="border-style:solid; border-color:#FF0000">Hello</td>
<td style="border-style:solid; border-color:#FF0000">Hello</td>
<td style="border-style:solid; border-color:#FF0000">Hello</td>
</tr>
<tr>
<td style="border-style:solid; border-color:#00FF00; border-width: 10px;">Hello</td>
<td style="border-style:solid; border-color:#00FF00; border-width: 10px;">Hello</td>
<td style="border-style:solid; border-color:#00FF00; border-width: 10px;">Hello</td>
</tr>
</table>
`;

const tableColSpanNoWidth = `
<table
	style="width: 50%;"
	border="1"
>
	<tbody>
		<tr>
			<td colspan="3" align="center">Hello</td>
		</tr>
		<tr>
			<td colspan="1">John</td>
			<td colspan="2">Doe</td>
		</tr>
		<tr>
			<td>A</td>
			<td>B</td>
			<td>C</td>
		</tr>
	</tbody>
</table>
`;

const tableColSpanNoWidth2 = `
<table>
	<tbody><tr>
		<td colspan="3" align="center">Hello</td>
	</tr>
	<tr>
		<td colspan="1" width="100" align="center">John</td>
		<td colspan="1" width="100" align="center">Doe</td>
		<td colspan="1" width="100" align="center">Doe</td>
	</tr>
	<tr>
		<td colspan="3" width="300" align="center"><b>Hello</b></td>
	</tr>
</tbody></table>
`;

const tableColSpanWidthStylePrecedence = `
<table width="450" border="1">
	<tbody>
	<tr>
		<td width="100" style="width: 400px" align="center">John</td>
		<td width="100" align="center">Doe</td>
		<td width="100" align="center">Doe</td>
	</tr>
</tbody></table>
`;

const tableVerticalAlignTd = `<table border="1">
	<tr>
		<td style="vertical-align: bottom">Bottom</td>
		<td style="vertical-align: middle">Middle</td>
		<td style="vertical-align: center">Middle</td>
		<td style="vertical-align: top">Top <br> Top line2</td>
		<td valign="bottom">Bottom</td>
	</tr>
	<tr>
		<td>Default</td>
		<td><p>Default</p></td>
		<td valign="top">Top</td>
		<td>Default</td>
	</tr>
</table>`;

const marginPaddingLeft = `
<p style="padding-left: 30px; margin-left: 30px">Should</p>
<p style="padding-left: 60px;">Be</p>
<p style="margin-left: 60px;">Aligned</p>
<p>None</p>
<p style="margin-left: 30px;">Half</p>
<p style="margin: 0 30px;">Half (v2)</p>
<p style="margin: 0 0 0 30px;">Half (v3)</p>
`;

const oLists = `
<ol>
	<li>Foo</li>
	<li>Bar</li>
	<li>Baz</li>
</ol>
`;

const textAligns = `
<p style="text-align:justify">${lorem}</p>
<p style="text-align:center">Center</p>
<p style="text-align:right">Right</p>
<p style="text-align:left">Left</p>
<p align="justify">${lorem}</p>
<table border="1">
	<tr>
		<td width="200" style="text-align:right">Hello</td>
		<td width="200" style="text-align:justify">${lorem}</td>
	</tr>
	<tr>
		<td width="200" align="justify">${lorem}</td>
		<td width="200">empty</td>
	</tr>
</table>
`;

const nestedLists = `<ul>
	<li>Foo</li>
	<li>
		<ul>
			<li>Nested 1</li>
			<li>Nested 2</li>
		</ul>
	</li>
	<li>Bar</li>
	<li>
		<ul>
			<li>Nested 3</li>
			<li>
				<ul>
					<li>Deep Nested 1</li>
					<li>Deep Nested 2</li>
				</ul>
			</li>
		</ul>
	</li>
	<li>Baz</li>
</ul>`;

const nestedOrderedList = `
<ol type="A">
<li>Foo</li>
<li>
	Test
	<ol type="I">
		<li>Bar</li>
		<li>Baz
		<ol type="i">
			<li>Baz</li>
			<li>Bazar</li>
			<li>Bazardous</li>
		</ol>
		</li>
	</ol>
</li>
</ol>
<ol>
	<li>Default from stylesheet (alphanumeric Upper)</li>
	<li>Next</li>
</ol>
<ol class="roman">
	<li>Roman Upper</li>
	<li>Next</li>
</ol>
`;

const nestedListsMixed = `<ol>
	<li>Foo</li>
	<li>
		<ul>
			<li>Nested 1</li>
			<li>Nested 2</li>
			<li><ol>
				<li>Foo</li>
			</ol>
			</li>
		</ul>
	</li>
	<li>Bar</li>
	<li>
		<ul>
			<li>Nested 3</li>
			<li>
				<ul>
					<li>Deep Nested 1</li>
					<li>Deep Nested 2</li>
				</ul>
			</li>
		</ul>
	</li>
	<li>Baz</li>
</ol>`;

const tableWithULWithoutLi = `
	<table>
		<tr>
			<td>
			<ul>
			Foobar
			Foobar
			Foobar
			Foobar
			</ul>
			</td>
		</tr>
	</table>
`;

const mixed5 = `
<h1 style="color:#d31717">Mega minute
</h1>
<p>This minute contains HTML markup supported by docxtemplater HTML module. Spec is available
<a href="https://docxtemplater.com/modules/html/" target="_blank">here
</a>&nbsp;and
<a href="https://docxtemplater.com/modules/html/">not in new window here
</a>
</p>
<h2>Heading 2
</h2>
<h3>Heading 3
</h3>
<h4>Heading 4
</h4>
<h5>Heading 5
</h5>
<h6>Heading 6
</h6>
<p>Back to Paragraphs :)
</p>
<p>Bold
<strong>is supported
</strong> as you can see.
</p>
<p>As is
<em>italics
</em> and
<span style="text-decoration:underline;">underlined
</span>.
</p>
<ul>
<li>Unordered lists
</li>
<li>Are also usable
</li>
</ul>
<p>As are:
</p>
<ol>
<li>Ordered lists
</li>
<li>Hooray
</li>
</ol>
<table>
<tbody>
<tr style="height:50%;">
<td style="width:33.333333333333336%;">
<p>
Tables&nbsp;
<strong>bold
</strong>
</p>
</td>
<td style="width:33.333333333333336%;">
<p>
are&nbsp;
<em>italics
</em>
</p>
</td>
<td style="width:33.333333333333336%;">
<p>
<span style="text-decoration:underline;">nicely
</span>
</p>
</td>
</tr>
<tr style="height:50%;">
<td style="width:33.333333333333336%;">
<p>Foobar</p>
<h3>supported
</h3>
</td>
<td style="width:33.333333333333336%;">
<p>as are HTML in the tables
</p>
<ol>
<li>such as OL
</li>
<li>and others
</li>
</ol>
<p>plus
</p>
<ul>
<li>ul
</li>
<li>lists
</li>
</ul>
</td>
<td style="width:33.333333333333336%;">
<p>also
<a href="https://docxtemplater.com/modules/html/">supported
</a>
</p>
</td>
</tr>
</tbody>
</table>
`;

const tableImplicitParagraphs = `
<table>
<tbody>
<tr style="height:50%;">
<td style="width:33.333333333333336%;">
also
<a href="https://docxtemplater.com/modules/html/">supported</a>
</td>
</tr>
</tbody>
</table>
`;

const tableImplicitParagraphs2 = `
<table>
<tbody>
<tr style="height:50%;">
<td style="width:33.333333333333336%;">
<span>Foobar</span>
also <a href='https://ddg.gg'>Duck duck go</a>supported
<ul>
<li>Foo</li>
<li>Bar</li>
</ul>
End
</a>
</td>
</tr>
</tbody>
</table>
`;

const tableImplicitParagraphsStyled = `
<table>
<tbody>
<tr>
<td>a) Heading 1 expected</td>
<td><p>b) Heading 1 expected</p></td>
</tr>
<tr>
<td><p>c) Heading 1 expected</p></td>
<td>d) Heading 1 expected</td>
</tr>
</tbody>
</table>
<p>Heading 5 expected</p>
`;

const fullTable = `
<table class="products-table">
	<thead>
		<tr>
			<th></th>
			<th>
				<h3 class="p1">P1</h3>
			</th>
			<th>
				<h3 class="nomatch">P2</h3>
			</th>
			<th>
				<h3 class="p3">P3</h3>
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td class="key">Audience</td>
			<td>A1</td>
			<td>A2</td>
			<td>A3</td>
		</tr>
	</tbody>
	<tfoot>
		<tr>
			<th></th>
			<th>
				<a href="https://github.com/open-xml-templating/docxtemplater" class="btn btn-primary btn-white">Get Started <span class="glyphicon glyphicon-new-window"></span></a>
			</th>
			<th>
				<a href="https://plasso.com/" class="btn btn-black btn-primary">Link 1 <span class="glyphicon glyphicon-chevron-right"></span></a>
			</th>
			<th>
				<a href="https://plasso.com/" class="btn btn-black btn-primary">Link 2 <span class="glyphicon glyphicon-chevron-right"></span></a>
			</th>
		</tr>
	</tfoot>
</table>
`;

const links2 = `
<a href="https://google.com">My link <span>to google</span></a>
`;

const linksWithNoText = `
<a href="https://google.com"></a>
`;

const linksWithBookMarks = `
<a href="#mark1">Go to mark 1</a>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p id="mark1">This is mark 1</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
`;

const linksWithNames = `
<a href="#mark1">Go to mark 1</a>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p><a name="mark1"></a>This is mark 1</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
<p align="justify">${lorem}</p>
`;

const tableWithoutTbody = `
<table>
<tr>
<td>
<span>Foobar</span>
</td>
</tr>
</table>
`;

const tableSimple = `
<table>
<tbody>
<tr>
<td>
<span>Foobar</span>
</td>
</tr>
</tbody>
</table>
`;

const headings = `
<h2>Heading 2
</h2>
<h3>Heading 3
</h3>
<h4>Heading 4
</h4>
<h5>Heading 5
</h5>
<h6>Heading 6
</h6>
`;

const allHeadings = `
<h1>H1</h1>
<h2>H2</h2>
<h3>H3</h3>
<h4>H4</h4>
<h5>H5</h5>
`;

const backgroundColorParagraph = `
<p style="background-color:#ff0000;">
Foobar
</p>
`;

const colorStyles = `
<p>
<span style='color: #6ca980;background-color: blue'>color output</span>
</p>
<p>
<span style='color: #aaa;background-color: rgba(255, 0, 0, 0.3); '>color output</span>
</p>
<p>
<span style='color: white;background-color: hsl(120, 100%, 50%); '>color output</span>
</p>
<table style="border-collapse: collapse;">
<tr>
<td style="border-style:double; border-color:blue;">1</td>
<td style="border-style:solid; border-color:rgba(255, 0, 255, 1);">2</td>
<td style="border-style:dashed; border-color:#FF0;">3</td>
<td style="border-style:outset; border-color:#FF0;">4</td>
<td style="border-style:inset; border-color:#FF0;">5</td>
<td style="border: 8px dashed lime;">6</td>
<td style="border: none;">7</td>
</tr>
<tr>
	<td style="border-style:dotted solid double dotted; border-color:rgba(0, 100, 0, 1); border-width: 15px 6px">1</td>
</tr>
</table>
`;

const preformattedText = `<pre>
Text in a pre element
is displayed in a fixed-width
font, and it preserves
both      spaces and
line breaks
{
  "name": "John",
  "age": 22,
  "hobbies": [
    {
      "name": "Dance"
    }
  ]
}
</pre>
`;

const blockquotes = `<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<blockquote>
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</blockquote>`;

const blockquoteJustified = `
<div style="text-align: justify;">
<blockquote>
	Sit aliquid vitae non magni ex Eius saepe molestias minima non tempore amet! Accusamus corrupti at ipsa necessitatibus consequatur. Corporis autem debitis reiciendis illo modi, inventore. Delectus magni sint doloremque?
</blockquote>
</div>
`;

const fontSizes = `
<p>
    <span style="font-size:17pt">17pt</span>
    <span style="font-size:18px">Hello</span>
    <span style="font-size:11px"> John, </span>
    <span style="font-size:7px">how are you</span>
</p>
<p style="font-size: 22px">In paragraph</p>
<div style="font-size: 25px">
<p>
In nested paragraph
</p>
</div>
<table>
	<tr>
		<td style="font-size: 30px">In td</td>
	</tr>
</table>
<table>
	<tr style="font-size: 8px">
		<td>In tr</td>
	</tr>
</table>
<table>
<tbody style="font-size: 20px">
<tr>
<td>In tbody</td>
</tr>
</tbody>
</table>
`;

const base64PNGImage =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIJBywfp3IOswAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAkUlEQVQY052PMQqDQBREZ1f/d1kUm3SxkeAF/FdIjpOcw2vpKcRWCwsRPMFPsaIQSIoMr5pXDGNUFd9j8TOn7kRW71fvO5HTq6qqtnWtzh20IqE3YXtL0zyKwAROQLQ5l/c9gHjfKK6wMZjADE6s49Dver4/smEAc2CuqgwAYI5jU9NcxhHEy60sni986H9+vwG1yDHfK1jitgAAAABJRU5ErkJggg==";

const base64JPEGImage =
	"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD//gATQ3JlYXRlZCB3aXRoIEdJTVD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAAMAAwDAREAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQGB//EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAbs2EB0//8QAGBABAQADAAAAAAAAAAAAAAAABAcGEBT/2gAIAQEAAQUCoFARiDBJ7BpEdmv/xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAEDAQE/AR//xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAECAQE/AR//xAAfEAACAQQCAwAAAAAAAAAAAAACAwEREhMxAAQQUWH/2gAIAQEABj8C6aEdMXZRyEba0pXUfeIfYS8oQdhbGsangZ0LfZNw5AgrZ9x4/8QAHRAAAgIBBQAAAAAAAAAAAAAAAREAIUEQYXGhwf/aAAgBAQABPyGxtiAdFfbDFFzB9dSg8gc9H2wAo76f/9oADAMBAAIAAwAAABAST//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8QH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8QH//EABwQAQABBAMAAAAAAAAAAAAAAAERACExURBBcf/aAAgBAQABPxCSNowKbMi2VSDSPIT2EnVgmxrDKbYOJKDSHj//2Q==";

const base64GIFIMage =
	"data:image/gif;base64,R0lGODlhDAAMAIQZAAAAAAEBAQICAgMDAwQEBCIiIiMjIyQkJCUlJSYmJigoKC0tLaSkpKampqenp6ioqKurq66urrCwsPb29vr6+vv7+/z8/P39/f7+/v///////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAADAAMAAAFSiCWjRmViVVmZRWWjiurXrBI2uMkFcdjrRfaJQIQCAKQTDBmKAYACAwuswAABoBEDMUgYAkOpWiFeRgUDZIKNnqpLaJLXM2KjaYhADs=";

const svgImage = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="300px" height="200px" viewBox="0 0 800 600" xml:space="preserve">
            <g id="cameraTarget" style="visibility: visible;" transform="matrix(11.2969 2.52207 -2.52207 11.2969 -3539.44 -4144.95)">
                <g id="items" transform2="translate(-40,-68)">
                    <g id="wherever" transform="matrix(3.67394e-17 -0.6 0.6 3.67394e-17 148.052 549.951)" style="opacity: 1;">
                        <path d="M202.35,163.64l-4.38-13.1h-2.13v-3.85h9.1v3.85h-1.82l2.05,6.2l3.41-10.05h4.43l3.3,10.06l2.05-6.21h-1.88v-3.85h8.08   v3.85h-2.09l-4.33,13.1h-4.63l-3.28-9.82l-3.23,9.82H202.35z"/>
                        <path d="M224.64,163.39v-3.85h2.69v-16.31h-2.69v-3.85h8v8.64c1.68-1.17,3.26-1.76,4.75-1.76c3.42,0,5.12,2.05,5.12,6.16v7.11h2.45   v3.85h-7.78v-10.71c0-0.78-0.14-1.32-0.42-1.61c-0.28-0.29-0.71-0.44-1.27-0.44c-0.8,0-1.74,0.35-2.85,1.05v7.87h2.39v3.85H224.64z   "/>
                        <path d="M260.47,158.36l4.14,1.33c-1.74,2.73-4.45,4.09-8.14,4.09c-2.94,0-5.24-0.78-6.89-2.33c-1.65-1.55-2.48-3.6-2.48-6.13   c0-2.57,0.85-4.73,2.55-6.45s3.88-2.59,6.51-2.59c1.91,0,3.56,0.48,4.95,1.45c1.39,0.97,2.36,2.17,2.9,3.61   c0.54,1.44,0.81,3.04,0.81,4.81h-12.44c0.08,1.52,0.56,2.59,1.44,3.23c0.88,0.63,1.81,0.95,2.78,0.95   C257.89,160.32,259.17,159.67,260.47,158.36z M259.46,153.18c-0.12-0.93-0.49-1.72-1.09-2.38c-0.6-0.66-1.43-0.99-2.48-0.99   c-1.96,0-3.09,1.12-3.42,3.37H259.46z"/>
                        <path d="M278.72,159.55v3.85h-11.75v-3.85h3.09v-9.01h-2.9v-3.85h7.78v4.25c0.3-1.22,0.98-2.28,2.04-3.17   c1.06-0.89,2.32-1.34,3.77-1.34c0.25,0,0.53,0,0.86,0.02v5.04c-1.35,0-2.44,0.15-3.29,0.45c-0.85,0.3-1.55,0.96-2.1,1.97   c-0.55,1.01-0.83,2.21-0.83,3.59v2.05H278.72z"/>
                        <path d="M296.57,158.36l4.14,1.33c-1.74,2.73-4.45,4.09-8.14,4.09c-2.94,0-5.24-0.78-6.89-2.33c-1.65-1.55-2.48-3.6-2.48-6.13   c0-2.57,0.85-4.73,2.55-6.45c1.7-1.72,3.88-2.59,6.51-2.59c1.91,0,3.56,0.48,4.95,1.45c1.39,0.97,2.36,2.17,2.9,3.61   c0.53,1.44,0.81,3.04,0.81,4.81h-12.44c0.08,1.52,0.56,2.59,1.44,3.23c0.88,0.63,1.81,0.95,2.78,0.95   C293.98,160.32,295.27,159.67,296.57,158.36z M295.55,153.18c-0.13-0.93-0.49-1.72-1.09-2.38c-0.6-0.66-1.43-0.99-2.48-0.99   c-1.96,0-3.1,1.12-3.42,3.37H295.55z"/>
                        <path d="M310.1,163.64l-5.64-13.1h-2.42v-3.85h10.13v3.85h-2.08l2.62,7.6l3.07-7.6h-2.19v-3.85h8.85v3.85h-2.38l-5.42,13.1H310.1z"/>
                        <path d="M336.2,158.36l4.14,1.33c-1.74,2.73-4.45,4.09-8.14,4.09c-2.94,0-5.24-0.78-6.89-2.33c-1.65-1.55-2.48-3.6-2.48-6.13   c0-2.57,0.85-4.73,2.55-6.45s3.88-2.59,6.51-2.59c1.91,0,3.56,0.48,4.95,1.45s2.36,2.17,2.9,3.61c0.54,1.44,0.81,3.04,0.81,4.81   h-12.44c0.08,1.52,0.56,2.59,1.44,3.23c0.88,0.63,1.81,0.95,2.78,0.95C333.61,160.32,334.9,159.67,336.2,158.36z M335.18,153.18   c-0.13-0.93-0.49-1.72-1.09-2.38c-0.6-0.66-1.43-0.99-2.48-0.99c-1.96,0-3.09,1.12-3.42,3.37H335.18z"/>
                        <path d="M354.44,159.55v3.85h-11.75v-3.85h3.09v-9.01h-2.9v-3.85h7.78v4.25c0.3-1.22,0.98-2.28,2.04-3.17   c1.06-0.89,2.32-1.34,3.77-1.34c0.25,0,0.53,0,0.86,0.02v5.04c-1.35,0-2.44,0.15-3.29,0.45c-0.85,0.3-1.55,0.96-2.1,1.97   c-0.55,1.01-0.83,2.21-0.83,3.59v2.05H354.44z"/>
                    </g>
                    <g id="there" transform="matrix(0.224764 -0.55631 0.55631 0.224764 240.258 499.021)" style="opacity: 1; display: none;">
                        <path d="M429.47,313.97l0.01-4.66l3.47,0l0-4.1l5.24-4.78l-0.01,8.89l4.93,0.01l0,4.65l-4.93-0.01l-0.01,12.94   c0,2.08,0.11,3.36,0.34,3.84c0.23,0.49,0.8,0.73,1.72,0.73c0.97,0,1.93-0.18,2.86-0.55l-0.01,4.77c-1.34,0.47-2.68,0.71-4.02,0.71   c-1.6,0-2.9-0.36-3.88-1.06c-0.99-0.71-1.62-1.59-1.87-2.66c-0.26-1.07-0.38-2.91-0.38-5.51l0.01-13.22L429.47,313.97z"/>
                        <path d="M450.74,331.34l0.03-29h-4.82l0-4.66l10.05,0.01l-0.01,14.71c3.14-2.53,6.13-3.79,8.95-3.79c1.76,0,3.21,0.37,4.35,1.11   c1.14,0.74,1.91,1.71,2.32,2.91c0.41,1.21,0.62,2.96,0.61,5.28l-0.02,13.47l4.54,0l0,4.65l-9.78-0.01l0.02-16.3   c0-2.02-0.06-3.37-0.19-4.04c-0.13-0.68-0.48-1.24-1.06-1.69c-0.58-0.44-1.26-0.66-2.05-0.66c-2.02,0-4.59,1.14-7.72,3.43   l-0.01,14.6l4.63,0l0,4.65l-14.68-0.01l0-4.65L450.74,331.34z"/>
                        <path d="M507.33,324.05l-22.42-0.02c0.33,2.46,1.3,4.46,2.91,5.98c1.62,1.52,3.68,2.29,6.19,2.29c3.65,0.01,6.54-1.46,8.68-4.4   l4.63,2.04c-1.51,2.33-3.46,4.06-5.87,5.19c-2.41,1.13-4.93,1.69-7.55,1.69c-4.08-0.01-7.56-1.28-10.45-3.83s-4.33-5.97-4.32-10.29   c0-4.09,1.42-7.46,4.24-10.1s6.06-3.96,9.71-3.96c3.58,0,6.82,1.3,9.73,3.88C505.73,315.1,507.23,318.94,507.33,324.05z    M501.94,320.24c-0.37-1.87-1.34-3.57-2.92-5.08c-1.58-1.52-3.51-2.27-5.81-2.28c-2.09-0.01-3.88,0.68-5.37,2.04   c-1.49,1.37-2.4,3.13-2.73,5.3L501.94,320.24z"/>
                        <path d="M516.03,331.41l0.02-17.35l-5.37-0.01l0-4.65l9.56,0.01l-0.01,6c0.59-1.56,1.41-2.86,2.46-3.88   c1.05-1.03,2.15-1.71,3.32-2.03c1.17-0.33,2.76-0.49,4.78-0.49h1.38l-0.01,5.29l-1.04,0c-2.67,0-4.65,0.26-5.96,0.79   s-2.29,1.5-2.92,2.9c-0.63,1.4-0.95,3.92-0.95,7.56l-0.01,5.87l5.81,0.01l0,4.65l-16.41-0.02l0.01-4.65L516.03,331.41z"/>
                        <path d="M560.38,324.11l-22.42-0.03c0.33,2.46,1.3,4.46,2.91,5.98c1.62,1.53,3.68,2.29,6.2,2.29c3.65,0.01,6.54-1.46,8.68-4.4   l4.62,2.04c-1.51,2.33-3.46,4.06-5.87,5.18c-2.4,1.13-4.93,1.69-7.55,1.69c-4.07-0.01-7.56-1.28-10.44-3.83   c-2.89-2.54-4.33-5.97-4.33-10.29c0-4.09,1.42-7.46,4.24-10.11c2.82-2.64,6.06-3.95,9.71-3.95c3.58,0.01,6.82,1.3,9.73,3.88   C558.76,315.16,560.27,319,560.38,324.11z M554.98,320.3c-0.37-1.87-1.34-3.57-2.92-5.08c-1.58-1.52-3.51-2.28-5.81-2.28   c-2.09-0.01-3.88,0.68-5.37,2.04s-2.4,3.13-2.73,5.29L554.98,320.3z"/>
                    </g>
                    <g id="are" transform="matrix(3.06162e-17 -0.5 0.5 3.06162e-17 225.35 562.778)" style="opacity: 0.5; display: none;">
                        <path d="M391.1,432.82v3h-6.25v-1.03c-1.12,0.81-2.3,1.22-3.55,1.22c-1.29,0-2.4-0.37-3.34-1.1c-0.94-0.74-1.4-1.72-1.4-2.96   c0-1.25,0.49-2.29,1.48-3.13c0.99-0.84,2.26-1.26,3.82-1.26c0.87,0,1.87,0.22,3,0.66v-0.79c0-0.66-0.22-1.21-0.67-1.63   c-0.45-0.43-1.05-0.64-1.8-0.64c-0.93,0-1.73,0.34-2.39,1.02l-3.35-0.61c0.97-2.05,3.07-3.08,6.3-3.08c1.26,0,2.29,0.14,3.12,0.42   c0.82,0.28,1.44,0.65,1.84,1.1c0.4,0.45,0.69,0.94,0.85,1.47c0.17,0.53,0.25,1.4,0.25,2.6v4.75H391.1z M384.85,431   c-1-0.63-1.81-0.94-2.41-0.94c-0.47,0-0.91,0.14-1.3,0.42c-0.39,0.28-0.58,0.68-0.58,1.21c0,0.48,0.16,0.88,0.47,1.22   c0.31,0.34,0.72,0.51,1.21,0.51c0.77,0,1.64-0.45,2.61-1.36V431z"/>
                        <path d="M399.32,432.82v3h-9.15v-3h2.41v-7.02h-2.26v-3h6.06v3.31c0.23-0.95,0.76-1.77,1.59-2.47c0.83-0.69,1.81-1.04,2.94-1.04   c0.19,0,0.41,0,0.67,0.01v3.92c-1.05,0-1.9,0.12-2.57,0.35c-0.66,0.23-1.21,0.75-1.64,1.53c-0.43,0.79-0.65,1.72-0.65,2.8v1.6   H399.32z"/>
                        <path d="M411.16,431.89l3.23,1.04c-1.35,2.12-3.47,3.19-6.35,3.19c-2.29,0-4.08-0.61-5.37-1.82c-1.29-1.21-1.93-2.8-1.93-4.77   c0-2.01,0.66-3.68,1.99-5.03c1.33-1.34,3.01-2.02,5.07-2.02c1.49,0,2.77,0.38,3.86,1.13c1.08,0.75,1.84,1.69,2.26,2.81   c0.42,1.12,0.63,2.37,0.63,3.75h-9.69c0.06,1.18,0.44,2.02,1.12,2.51c0.69,0.49,1.41,0.74,2.17,0.74   C409.15,433.42,410.15,432.91,411.16,431.89z M410.37,427.86c-0.1-0.73-0.38-1.34-0.85-1.86s-1.12-0.77-1.93-0.77   c-1.52,0-2.41,0.87-2.66,2.62H410.37z"/>
                    </g>
                    <g id="bigYou" transform="matrix(-1 1.22465e-16 -1.22465e-16 -1 836.695 596.755)" style="opacity: 1;">
                        <path d="M229.02,356.49v-30.71h25.61l8.87-23.71l-48.53-108.34H195.7v-30.71h79.86v30.71h-15.7l22.19,60.02l23.66-60.02h-17.35   v-30.71h70.08v30.71h-19l-63.89,162.75H229.02z"/>
                        <path d="M607.69,265.62v30.7h-64.03v-11.36c-12.76,8.86-25.7,13.29-38.83,13.29c-12.85,0-22.93-3.61-30.22-10.82   c-7.3-7.21-10.95-17.39-10.95-30.54v-63.15H443.7v-30.71h62.37v83.03c0,6.61,1.01,11.13,3.03,13.56c2.02,2.43,5.69,3.65,11.01,3.65   c7.16,0,15.01-3.17,23.55-9.5v-60.04h-20.52v-30.71h63.06v102.58H607.69z"/>
                        <path fill="#FF1200" d="M396.25,163.03c37.27,0,67.59,30.33,67.59,67.61c0,37.28-30.32,67.61-67.59,67.61   c-37.28,0-67.6-30.33-67.6-67.61C328.65,193.36,358.98,163.03,396.25,163.03L396.25,163.03z M396.25,269.03   c21.16,0,38.37-17.22,38.37-38.39c0-21.16-17.21-38.38-38.37-38.38c-21.16,0-38.38,17.22-38.38,38.38   C357.88,251.81,375.09,269.03,396.25,269.03L396.25,269.03z"/>
                    </g>
                    <g id="go" transform="translate(0,0)translate(388,304)scale(0.3)rotate(0)translate(-358.4499816894531,-348.74998474121094)" style="opacity: 1; display: inline;">
                        <path d="M366.8,299.33v15.8h-11.34v50.71c0,22.65-11.95,33.98-35.86,33.98c-13.7,0-23.91-2.48-30.62-7.44l10.63-14.53   c5.53,3.4,11.08,5.1,16.65,5.1c4.87,0,8.97-1.25,12.3-3.76c3.33-2.5,5-7.37,5-14.6v-5.24c-7.13,6.38-14.08,9.57-20.84,9.57   c-7.94,0-14.71-3.32-20.31-9.96c-5.6-6.64-8.4-15.11-8.4-25.41c0-10.35,2.88-18.82,8.65-25.41c5.76-6.59,12.8-9.89,21.12-9.89   c7.98,0,14.58,3.16,19.77,9.48v-8.41H366.8z M333.64,333.84c0-5.53-1.23-9.9-3.69-13.11c-2.46-3.21-5.81-4.82-10.06-4.82   c-4.35,0-7.67,1.65-9.96,4.96c-2.29,3.31-3.44,7.56-3.44,12.76c0,5.2,1.19,9.44,3.58,12.72c2.39,3.28,5.66,4.93,9.82,4.93   c3.83,0,7.08-1.52,9.74-4.57S333.64,339.37,333.64,333.84z"/>
                        <path fill="#FF1200" d="M397.02,369.43c-19.78,0-35.87-16.09-35.87-35.87c0-19.78,16.09-35.88,35.87-35.88   c19.78,0,35.87,16.1,35.87,35.88C432.89,353.34,416.8,369.43,397.02,369.43L397.02,369.43z M397.02,313.19   c-11.23,0-20.36,9.13-20.36,20.37c0,11.23,9.13,20.36,20.36,20.36c11.23,0,20.36-9.13,20.36-20.36   C417.38,322.33,408.25,313.19,397.02,313.19L397.02,313.19z"/>
                    </g>
                    <g id="smallYou" transform="matrix(1 0 0 1 2.98499 494.265)" style="opacity: 0;">
                        <path stroke="#FFFFFF" d="M332.2,442.05v-11.53h9.61l3.33-8.9l-18.22-40.67h-7.24v-11.53h29.98v11.53h-5.89l8.33,22.53l8.88-22.53   h-6.51v-11.53h26.31v11.53h-7.13l-23.98,61.09H332.2z"/>
                        <path d="M474.35,407.94v11.53h-24.03v-4.27c-4.79,3.33-9.65,4.99-14.58,4.99c-4.83,0-8.61-1.35-11.35-4.06s-4.11-6.53-4.11-11.46   v-23.7h-7.49v-11.53h23.41v31.17c0,2.48,0.38,4.18,1.14,5.09c0.76,0.91,2.14,1.37,4.13,1.37c2.69,0,5.63-1.19,8.84-3.57v-22.54   h-7.7v-11.53h23.67v38.51H474.35z"/>
                        <path fill="#FF1200" d="M394.98,369.43c13.99,0,25.37,11.38,25.37,25.38s-11.38,25.38-25.37,25.38   c-13.99,0-25.38-11.39-25.38-25.38S380.99,369.43,394.98,369.43L394.98,369.43z M394.98,409.22c7.94,0,14.4-6.46,14.4-14.41   c0-7.94-6.46-14.41-14.4-14.41c-7.94,0-14.41,6.46-14.41,14.41C380.57,402.76,387.04,409.22,394.98,409.22L394.98,409.22z"/>
                    </g>
                </g>
            </g>

            <g id="loading-message" display="inline">

            </g>
        </svg>`;

const paragraphsClassed = `<p>Paragraph</p>
<p class="my-heading-class">Paragraph - Type 2</p>
<p>Normal paragraph</p>
<h3 class="my-heading5-class">Heading 5</h3>
`;

const paragraphsDiv = `
<div>
<div>
<div>
<h4>Summary</h4>
</div>
<div>
<div>
<div>
<p>Sample.</p>
<p>Paragraph.</p>
</div>
</div>
</div>
</div>
`;

const tableWithPtWidth = `
<table cellspacing="0" style="width:454pt">
<tbody>
<tr>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap; width:108pt">
<span>
<strong>
<span>
Foo
</span>
</strong>
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap; width:60pt">
<span>
<strong>
<span>
Bar
</span>
</strong>
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap; width:87pt">
<span>
<strong>
<span>
BanBang
</span>
</strong>
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap; width:76pt">
<span>
<strong>
<span>
Baz
</span>
</strong>
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap; width:123pt">
<span>
<strong>
<span>
Bing
</span>
</strong>
</span>
</td>
</tr>
<tr>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
ff-09-2000-00X
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
foo-bang
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
ping-ping
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
10
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
NA
</span>
</td>
</tr>
<tr>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
gg-10-3000-00F
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
foo-baz
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
banr
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
22
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
Available
</span>
</td>
</tr>
<tr>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
gg-33-3332-00X
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
ping-deng
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
baz
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
33
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
NA
</span>
</td>
</tr>
<tr>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
XX-444-44-44R
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
mous-tic
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
barr
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
66
</span>
</td>
<td style="height:15.0pt; text-align:center; vertical-align:bottom; white-space:nowrap">
<span>
NA
</span>
</td>
</tr>
</tbody>
</table>
<p style="text-align: justify;">
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</p>
`;

const tableClassed = `
<table class="newtable">
<tr>
<td>
<span>Foobar</span>
</td>
</tr>
</table>
`;

module.exports = {
	allHeadings,
	backgroundColorParagraph,
	base64GIFIMage,
	base64JPEGImage,
	base64PNGImage,
	blockquoteJustified,
	blockquotes,
	checkbox,
	specialInputs,
	checkboxWithLabel,
	colorStyles,
	escapedChars,
	fontSizes,
	fullTable,
	headings,
	inlineStyle,
	links,
	links2,
	linksWithBookMarks,
	linksWithNames,
	linksWithNoText,
	mixed,
	mixed2,
	mixed3,
	mixed4,
	mixed5,
	nestedLists,
	nestedListsMixed,
	nestedOrderedList,
	listsWithMargins,
	paragraphMargin,
	paragraphLineHeight,
	listsWithTopBotomMargins,
	oLists,
	marginPaddingLeft,
	paragraphsClassed,
	paragraphsDiv,
	svgImage,
	tableBackgroundColor,
	tableClassed,
	tableRowSpan,
	tableColRowSpan,
	tableColRowMulti,
	multiTableRowSpan,
	complexRowSpan,
	oneRowSpan,
	tableColSpan,
	tableColSpanOneRow,
	tableColSpanNoWidth,
	tableColSpanNoWidth2,
	tableColSpanWidthStylePrecedence,
	tableColoredBorders,
	tableColoredText,
	tableComplex,
	tableImplicitParagraphs,
	tableImplicitParagraphs2,
	tableImplicitParagraphsStyled,
	tableSimple,
	tableWithSpecialUnits,
	tableWithWrongUnit,
	tableWithPtWidth,
	tableHello,
	tableAlignedCenter,
	tableAlignedRight,
	tableStyleTh,
	tableMargin0,
	tableMargin100,
	spaceRegression,
	tableVerticalAlignTd,
	divNestedUncentered,
	fontWeight,
	fontFamily,
	tableWithPadding,
	tableWithPadding0,
	tableWithoutBorder,
	tableWithoutTbody,
	tableWithULWithoutLi,
	tableColored,
	textAligns,
	titles,
	uLists,
	lorem,
	preformattedText,
	negativeTextIndent,
	insAndDel,
};
