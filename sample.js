const fs = require("fs");
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const HtmlModule = require("./es6/index.js");

const htmlModule = new HtmlModule({});
const content = fs.readFileSync("demo_template.docx");

const zip = new PizZip(content);
const doc = new Docxtemplater(zip, { modules: [htmlModule] });
doc.render({
	html: `
<h1>Apollo 11</h1>

<p><strong>Apollo 11</strong> was the spaceflight that landed the first humans, Americans <a href='http://en.wikipedia.org/wiki/Neil_Armstrong'>Neil Armstrong</a> and <a href='http://en.wikipedia.org/wiki/Buzz_Aldrin'>Buzz Aldrin</a>, on the Moon on July 20, 1969, at 20:18 UTC. Armstrong became the first to step onto the lunar surface 6 hours later on July 21 at 02:56 UTC.</p>

<p>Armstrong spent about <s>three and a half</s> two and a half hours outside the spacecraft, Aldrin slightly less; and together they collected 47.5 pounds (21.5&nbsp;kg) of lunar material for return to Earth. A third member of the mission, <a href='http://en.wikipedia.org/wiki/Michael_Collins_(astronaut)'>Michael Collins</a>, piloted the <a href='http://en.wikipedia.org/wiki/Apollo_Command/Service_Module'>command</a> spacecraft alone in lunar orbit until Armstrong and Aldrin returned to it for the trip back to Earth.</p>

<h2>Broadcasting and <em>quotes</em> <a id='quotes' name='quotes'></a></h2>

<p>Broadcast on live TV to a world-wide audience, Armstrong stepped onto the lunar surface and described the event as:</p>


<p>Apollo 11 effectively ended the <a href='http://en.wikipedia.org/wiki/Space_Race'>Space Race</a> and fulfilled a national goal proposed in 1961 by the late U.S. President <a href='http://en.wikipedia.org/wiki/John_F._Kennedy'>John F. Kennedy</a> in a speech before the United States Congress:</p>


<h2>Technical details <a id='tech-details' name='tech-details'></a></h2>

<table align='right' border='1' bordercolor='#ccc' cellpadding='5' cellspacing='0' style='border-collapse:collapse'>
	<caption><strong>Mission crew</strong></caption>
	<thead>
		<tr>
			<th scope='col'><p>Position</p></th>
			<th scope='col'><p>Astronaut</p></th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><p>Commander</p></td>
			<td><p>Neil A. Armstrong</p></td>
		</tr>
		<tr>
			<td><p>Command Module Pilot</p></td>
			<td><p>Michael Collins</p></td>
		</tr>
		<tr>
			<td><p>Lunar Module Pilot</p></td>
			<td><p>Edwin &quot;Buzz&quot; E. Aldrin, Jr.</p></td>
		</tr>
	</tbody>
</table>

<p>Launched by a <strong>Saturn V</strong> rocket from <a href='http://en.wikipedia.org/wiki/Kennedy_Space_Center'>Kennedy Space Center</a> in Merritt Island, Florida on July 16, Apollo 11 was the fifth manned mission of <a href='http://en.wikipedia.org/wiki/NASA'>NASA</a>&#39;s Apollo program. The Apollo spacecraft had three parts:</p>

<p>After being sent to the Moon by the Saturn V&#39;s upper stage, the astronauts separated the spacecraft from it and travelled for three days until they entered into lunar orbit. Armstrong and Aldrin then moved into the Lunar Module and landed in the <a href='http://en.wikipedia.org/wiki/Mare_Tranquillitatis'>Sea of Tranquility</a>. They stayed a total of about 21 and a half hours on the lunar surface. After lifting off in the upper part of the Lunar Module and rejoining Collins in the Command Module, they returned to Earth and landed in the <a href='http://en.wikipedia.org/wiki/Pacific_Ocean'>Pacific Ocean</a> on July 24.</p>

<p><small>Source: <a href='http://en.wikipedia.org/wiki/Apollo_11'>Wikipedia.org</a></small></p>`,
});

const buffer = doc
	.getZip()
	.generate({ compression: "DEFLATE", type: "nodebuffer" });
fs.writeFileSync("demo_generated.docx", buffer);
