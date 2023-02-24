The HTML module currently supports:

-   `<br>`
-   `<p>`
-   `<h1-h6>` tags, `<h1>` translates to `Title`, `<h2>` translates to `Header1`, `<h3>` translates to `Header2`, because there is no concept of title in the body of HTML
-   `<p>`
-   `<b>`
-   `<i>`
-   `<u>`
-   `<ul>`, `<ol>` and `<li>` for ordered and unordered lists
-   `<span>`
-   `<small>`
-   `<s>`
-   `<ins>` and `<del>`
-   `<strong>`
-   `<em>`
-   `<code>`
-   `<table>`, `<tr>`, `<td>`, `<tbody>`, `<thead>`, `<tfoot>`, `<th>` tags
-   `<a href="URL">Linktext</a>`
-   `<input type="checkbox">` and `<input type="checkbox" checked>`
-   `<sub>` and `<sup>`
-   `<pre>`, by using Courrier font and retaining all spaces
-   `<img>` **only if** including the imageModule too, by using base64 src
-   `<svg>` **only if** including the imageModule too, but this format is only readable on newer Word version : Microsoft Word, PowerPoint, Outlook, and Excel 2016 on Windows, Mac, Android and Windows Mobile. See [this article](https://support.office.com/en-us/article/edit-svg-images-in-microsoft-office-2016-69f29d39-194a-4072-8c35-dbe5e7ea528c) for details about this feature
-   `style="color: #bbbbbb"` property
-   `style="font-size: 30px"` property
-   `style="font-family: 'Times New Roman'"` property
-   `style="background-color: blue"` property (or with rgb codes)
-   `style="text-decoration: underline"` property
-   `style="padding-left: 30px"`
-   `style="width:33%; height: 50%;"` (on td only)
-   `style="text-align:justify"` (or other values)
-   `style="vertical-align: bottom"` (on td)
-   `style="border: none"` (on table)
-   `style="break-after:page"`
-   `style="break-before:page"`

**Important** : This module only supports docx, not pptx, see [the html-pptx module](/modules/html-pptx/) if you to include HTML inside powerpoint.

# Usage (nodejs)

```js
var HTMLModule = require("docxtemplater-html-module");

var zip = new PizZip(content);
var doc = new Docxtemplater(zip, {
    modules: [new HTMLModule({})],
}).render({ html: "<b>Hello</b>, Foo !" });

var buffer = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
});

fs.writeFile("test.docx", buffer);
```

# Usage (browser)

```html
<html>
    <script src="node_modules/docxtemplater/build/docxtemplater.js"></script>
    <script src="node_modules/pizzip/dist/pizzip.js"></script>
    <script src="node_modules/pizzip/vendor/FileSaver.js"></script>
    <script src="node_modules/pizzip/dist/pizzip-utils.js"></script>
    <script src="build/html-module.js"></script>
    <script>
        PizZipUtils.getBinaryContent(
            "examples/html-block-example.docx",
            function (error, content) {
                if (error) {
                    console.error(error);
                    return;
                }

                var zip = new PizZip(content);
                var doc = new docxtemplater(zip, {
                    modules: [new DocxtemplaterHtmlModule({})],
                });

                doc.render({
                    html: "<p>Hello <b>John</b></p>",
                });
                var out = doc.getZip().generate({
                    type: "blob",
                    mimeType:
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });
                saveAs(out, "generated.docx");
            }
        );
    </script>
</html>
```

Your docx should contain the text: `{~html}`. After installing the module, you can use a working demo by running `node sample.js`.

-   Any tag starting with `~` is used for inline HTML, such as : `{~html}` or {~inlineComment} which will use the "inlineComment" data
-   Any tag starting with `~~` is used for block HTML, such as : `{~~html}` or {~~styledTable} which will use the "styledTable" data

To be clear :

-   The `{~inline}` tag is used when you want to replace part of a paragraph. For example you can write :

```txt
My product is {~blueText} and costs ...
```

The tag is inline, there is other text in the paragraph. In this case, you can only use inline HTML elements (`<span>` , `<b>` , `<i>`, `<u>`\, ...)

-   The `{~~block}` tag is used when you want to replace a whole paragraph, and you want to insert multiple elements

```txt
{~~block}
```

The tag is block, there is no other text in the paragraph. In this case, you can only use block HTML elements (`<p>`, `<ul>`, `<table>`, `<ol>`, `<h1>`\)

# Options

It is possible to set options to the htmlModule.

Description of the options :

-   **ignoreUnknownTags** [default=false]: If this option is set to true, and the module finds an HTML tag that it doesn't handle, it will not fail but instead make as if the tag was of type `<span>`;
-   **ignoreCssErrors** [default=false]: If this option is set to true, all CSS errors are ignored and the library tries to parse the CSS with a best-effort algorithm;
-   **styleTransformer** makes it possible to rewrite the styles that are used by the HTML module, see below for an example;
-   **sizeConverters** makes it possible to change the ratio between px and dxa for different tags;
-   **styleSheet** makes it possible to add style to all HTML tags that are inserted.

To ignore all unknown tags:

```js
var doc = new Docxtemplater(zip, {
    modules: [
        new HTMLModule({
            ignoreUnknownTags: true,
        }),
    ],
});
```

To remap the styles so that h1 maps to Heading1 (instead of the default Title)

```js
function styleTransformer(tags, docStyles, opts) {
    tags.h1 = docStyles.Heading1;
    tags.h2 = docStyles.Heading2;
    tags.h3 = docStyles.Heading3;
    tags.h4 = docStyles.Heading4;
    tags.h5 = docStyles.Heading5;

    // Note that docStyles.Heading1 is a hardcoded value in the docxtemplater html code, it is exactly the same as writing :
    // tags.h1 = {
    //     type: "block",
    //     data: {
    //         pStyle: "Heading",
    //         props: [],
    //     },
    // }
    return tags;
}

var doc = new Docxtemplater(zip, {
    modules: [
        new HTMLModule({
            styleTransformer: styleTransformer,
        }),
    ],
});
```

If you want to remap h1 to an other paragraphStyle (w:styleId property in styles.xml), you can do the following :

```js
function styleTransformer(tags, docStyles, opts) {
    if (opts.styleIds.indexOf("Titre1") !== -1) {
        tags.h1.data.pStyle = "Titre1";
    }
    return tags;
}
```

To change the size of "padding-left":

```js
var doc = new Docxtemplater(zip, {
    modules: [
        new HTMLModule({
            sizeConverters: {
                paddingLeft: 20,
            },
        }),
    ],
});
```

This will make paddingLeft a little bit larger on word than the default (which is 15).

To add a global stylesheet

```js
const htmlModuleOptions = {
    styleSheet: `
        h1 {
            font-size: 60px;
        }
        span#foo {
            font-size: 30px;
            color: red;
        }
    `,
};
var doc = new Docxtemplater(zip, {
    modules: [new HTMLModule(htmlModuleOptions)],
});
```

# Reasons for not supporting pptx

This module handles only docx documents, not pptx.

The reason for that is that HTML maps well to docx because they use the same
linear flow, eg elements are placed one after the other in the document.
However PPTX documents have multiple slides, which are stored in different
files, and each element is positioned absolutely in the slide. For example, in
PPTX if you have a table element and a paragraph in the same slide, they need
to be placed in two "different" blocks.

There is the [HTML-pptx-module](https://docxtemplater.com/modules/html-pptx/) that handles HTML insertion for PPTX.

# Support for images with `<img>` !!support-for-images-with-img-tag

To be able to replace the `<img>` tag, you have to also have access to the Image Module.

Then, you can do :

```js
const HTMLModule = require("docxtemplater-html-module");
const ImageModule = require("docxtemplater-image-module");

const htmlModuleOptions = {
    img: {
        Module: ImageModule,
        /*
         * By default getSize returns the width and height attributes if both are present,
         * or 200x200px as a default value.
         */
        getSize: function (data) {
            /* The html element, for example, if the data is :
             * '<img width="20" src="...">'
             * you will have :
             *
             * data.element.attribs.width = '20'
             *
             */

            /* If the data is '<img style="width:200px;" src="...">'
             * '<img width="20" src="...">'
             * you will have
             *
             * data.parsedStyle = [
             *   { property: "width", value: "200px"}
             * ]
             *
             * on which you could do :
             *
             * data.parsedStyle.forEach(function({ property, value}) {
             *     if(property === "width") {
             *          width = parseInt(value.replace(/px$/, ""), 10);
             *     }
             * });
             */
            console.log(data.element);
            /* data.src is the arraybuffer of your image
             * (you could use the image-size library to to calculate the size)
             * (https://github.com/image-size/image-size)
             */
            console.log(data.src);
            // data.part.value is 'myTag' if your tag is {~myTag}
            console.log(data.part.value);
            // You return an array in pixel (here we have width 50px and height 100px)
            return [50, 100];
        },
    },
};

var doc = new Docxtemplater(zip, {
    modules: [new HTMLModule(htmlModuleOptions)],
});
```

The `<img>` tag supports base64 and also urls, so for example, you can do :

```html
<p>Hello</p>
<img
    src="data:image/gif;base64,R0lGODlhDAAMAIQZAAAAAAEBAQICAgMDAwQEBCIiIiMjIyQkJCUlJSYmJigoKC0tLaSkpKampqenp6ioqKurq66urrCwsPb29vr6+vv7+/z8/P39/f7+/v///////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAADAAMAAAFSiCWjRmViVVmZRWWjiurXrBI2uMkFcdjrRfaJQIQCAKQTDBmKAYACAwuswAABoBEDMUgYAkOpWiFeRgUDZIKNnqpLaJLXM2KjaYhADs="
    alt=""
/>
```

Note that HTTP URLs in src will not work by default, you have to configure docxtemplater in async mode to do so.

You can use the following getSize function if you would like to use the same width and height as the image source.

```js
import sizeOf from "image-size";
function getSize(img) {
    const buffer = new Buffer(img.src);
    const sizeObj = sizeOf(buffer);
    return [sizeObj.width, sizeObj.height];
}
```

You can also add a caption to the image if using image module 3.7.0 or above, and use the following :

```js
const HTMLModule = require("docxtemplater-html-module");
const ImageModule = require("docxtemplater-image-module");

const htmlModuleOptions = {
    img: {
        Module: ImageModule,
        // By default getSize returns the width and height attributes if both are present, or 200x200px as a default value.
        getProps: function (data) {
            return {
                caption: {
                    text: `: ${data.element.attribs.title}`,
                },
            };
        },
    },
};

var doc = new Docxtemplater(zip, {
    modules: [new HTMLModule(htmlModuleOptions)],
});
```

# Support for images in async support (for urls)

It is possible to add images with `src="http://......"` by using async docxtemplater.

You can customize the image resolver with the `getValue` function.

Here is an example showing how to retrieve the data form `https://avatars3.githubusercontent.com/u/2071336?v=3&s=100` :

```js
const fs = require("fs");
const https = require("https");
const http = require("http");
const url = require("url");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module");
const HTMLModule = require("docxtemplater-html-module");
const PizZip = require("pizzip");

function base64DataURLToArrayBuffer(dataURL) {
    const stringBase64 = dataURL.replace(
        /^data:image\/([a-z]+);base64,/,
        ""
    );
    let binaryString;
    if (typeof window !== "undefined") {
        binaryString = window.atob(stringBase64);
    } else {
        binaryString = Buffer.from(
            stringBase64,
            "base64"
        ).toString("binary");
    }
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes.buffer;
}
const defaultImage = base64DataURLToArrayBuffer(
    "data:image/gif;base64,R0lGODlhDAAMAIQZAAAAAAEBAQICAgMDAwQEBCIiIiMjIyQkJCUlJSYmJigoKC0tLaSkpKampqenp6ioqKurq66urrCwsPb29vr6+vv7+/z8/P39/f7+/v///////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAADAAMAAAFSiCWjRmViVVmZRWWjiurXrBI2uMkFcdjrRfaJQIQCAKQTDBmKAYACAwuswAABoBEDMUgYAkOpWiFeRgUDZIKNnqpLaJLXM2KjaYhADs="
);
const base64Regex =
    /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
const htmlOpts = {
    img: {
        Module: ImageModule,
        getValue: (el) => {
            const src = el.attribs.src;
            return new Promise(function (resolve) {
                // You should handle any errors here, if the promise rejects,
                // the rendering will fail with that error.
                // This is to continue to handle base64 images
                if (base64Regex.test(src)) {
                    resolve(base64DataURLToArrayBuffer(src));
                    return;
                }

                let parsedUrl;
                try {
                    parsedUrl = url.parse(src);
                } catch (e) {
                    resolve(defaultImage);
                    return;
                }

                let client;
                if (parsedUrl.protocol === "https:") {
                    client = https;
                }
                if (parsedUrl.protocol === "http:") {
                    client = http;
                }
                if (!client) {
                    resolve(defaultImage);
                    return;
                }

                client
                    .get(parsedUrl, function (res) {
                        const data = [];

                        res.on("error", function (err) {
                            console.log(
                                "Error during HTTP request",
                                err
                            );
                            resolve(defaultImage);
                        });

                        res.on("data", function (chunk) {
                            data.push(chunk);
                        }).on("end", function () {
                            resolve(Buffer.concat(data));
                        });
                    })
                    .on("error", () => {
                        resolve(defaultImage);
                    });
            });
        },
    },
};

const content = fs.readFileSync("demo_template.docx");
const zip = new PizZip(content);
const doc = new DocxTemplater(zip, {
    modules: [new HTMLModule(htmlOpts)],
});
doc.renderAsync({
    html: '<img width="30" height="30" src="https://avatars3.githubusercontent.com/u/2071336?v=3&s=100"/>',
}).then(function () {
    const buffer = doc.getZip().generate({
        compression: "DEFLATE",
        type: "nodebuffer",
    });
    fs.writeFileSync("demo_generated.docx", buffer);
});
```

# How are pixels converted to word ?

The problem is that a pixel is not a distance, but just the smallest entity on a given screen. Our usual devices will get more and more pixels but use the same size.

Thus we can't set in stone how long a pixel (in inches or centimeters).

To specify the conversion, we ask two questions :

-   `deviceWidth` : How large is your HTML document in pixels (typically it would be 1024px).

-   `getDxaWidth` : How large is your Docx document in dxas (1/1440 of an inch), for a standard A4 document, the total width (including margins) is 11906 dxas, and the width without margins (1 inch margin on the left and 1 inch margin on the right), is 11906-2880=9026 dxas

With these two options, docxtemplater can then accordingly convert any pixel value to a coherent size in your word document.

By default the options are as follows :

```js
const htmlOpts = {
    deviceWidth: 487,
    getDxaWidth: function defaultGetDxaWidth(
        allSections,
        currentSection
    ) {
        return 9026;
    },
};
```

It is possible to calculate the size in dxa directly from the template :

```js
const htmlOpts = {
    // ...,
    getDxaWidth: function (allSections, currentSection) {
        return (
            (currentSection.width -
                currentSection.leftMargin -
                currentSection.rightMargin) /
            currentSection.cols
        );
    },
};
```

You can change your deviceWidth to 1200, to be able to have a `<table width="1200">...</table>` fit into the page for example.

# Customize docx-styles with classes

For block elements (`p`, `h1`,`h2`,`h3`,`h4`,`h5`,`h6`, `ul`, `ol`, and `table`), it is now possible to customize the docxstyle that is used depending on the html class of that element.

```js
const htmlOpts = {
    elementCustomizer: function (element) {
        if (
            element.classNames.indexOf("my-heading-class") !==
                -1 &&
            element.name === "p"
        ) {
            return { pStyle: "Heading" };
        }
        // element.part.value will be the string "html1" if the tag used is {~~html1}
    },
};
const doc = new Docxtemplater(zip, {
    modules: [new HTMLModule(htmlOpts)],
});
```

The following HTML :

```html
<p>Paragraph</p>
<p class="my-heading-class">Paragraph - heading</p>
<p>Normal paragraph</p>
```

will have the second paragraph rendered by using the Heading type.

Of course, you can use any docx style that you have defined in your docx template.

# CSS Selectors

It is also possible to add CSS style with CSS selectors.

For example, if you want to change the font size with the CSS selector : `h4, th p.important`

```js
const htmlOpts = {
    elementCustomizer(element) {
        if (element.matches("h4, th p.important")) {
            return {
                // htmlStyle must be valid CSS style
                htmlStyle: "font-size: 30px;",
            };
        }
    },
};
const doc = new Docxtemplater(zip, {
    modules: [new HTMLModule(htmlOpts)],
});
```

You can use following selectors currently :

| Selector             | Example         | Example description                                                       |
| -------------------- | --------------- | ------------------------------------------------------------------------- |
| .class               | .intro          | Elements with class="intro"                                               |
| \#id                 | #firstname      | Element with id="firstname"                                               |
| \*                   | \*              | All elements                                                              |
| element              | p               | &lt;p&gt; elements                                                        |
| element, element     | div, p          | All &lt;div&gt; elements and all &lt;p&gt; elements                       |
| element element      | div p           | &lt;p&gt; elements inside &lt;div&gt; elements                            |
| element &gt; element | div &gt; p      | &lt;p&gt; elements where the direct parent is a &lt;div&gt; element       |
| element \+ element   | div + p         | &lt;p&gt; elements that are placed immediately after &lt;div&gt; elements |
| \[attribute\]        | [target]        | Elements with a target attribute                                          |
| \[attribute=value\]  | [target=_blank] | Elements with target="\_blank"                                            |

# Customize bullets

It is possible to customize bullets with the elementCustomizer API

For example, you can write :

```js
const htmlOpts = {
    elementCustomizer(element) {
        if (element.matches("ul")) {
            return {
                bullets: ["·", "-", "+"],
            };
        }
    },
};
const doc = new Docxtemplater(zip, {
    modules: [new HTMLModule(htmlOpts);],
});
```

It is also possible to customize the color, font and text with the elementCustomizer API :

```js
const htmlOpts = {
    elementCustomizer(element) {
        if (element.matches("ul")) {
            return {
                bullets: [
                    {
                        text: " ",
                        font: "Wingdings",
                        color: "FF0000",
                    },
                    {
                        text: "-",
                        color: "00FF00",
                    },
                    {
                        text: "+",
                        size: 30,
                        color: "0000FF",
                    },
                ],
            };
        }
    },
};
const doc = new Docxtemplater(zip, {
    modules: [new HTMLModule(htmlOpts)],
});
```

# Limitations

For tables, there is no difference between `table-layout:fixed` and `table-layout:auto`.

Also, unlike the `auto` algorithm, the width of the column does not depend on the content of the table, but just on the width applied in the CSS style.

This means that if you want to have columns of different sizes in your generated document, you should specify the width in the first column on all `tr` elements.

# Adding page breaks

It is possible to use the `break-after: page` or `break-before: page` styles.

Here is an example :

```js
const htmlOpts = {
    styleSheet: `
        .pba { break-after: page; }
        .pbb { break-before: page; }
    `,
};
const doc = new Docxtemplater(zip, {
    modules: [new HTMLModule(htmlOpts)],
});
doc.render({
    html: `<p>Hello</p>
           <p class="pba">Hi</p>
           <p class="pba">Hello</p>
           <p>Bye</p>
           <p>Bye</p>
           <p>Bye</p>
           <p>Bye</p>
           <p class="pbb">Good bye</p>
           `,
});
```

This will put a pagebreak after "Hi", after "Hello", and before "Good bye".

# Unsupported properties

Here is a list of properties that cannot be supported, and I explain a bit why :

-   `display: inline-block;` or other "display" properties : In Word, everything is just simply a paragraph, or a table or an image (or some other things such as graphs, smartarts, ...). And all these elements always behave like block elements. They can be positioned relatively, but inline-block, flex, grid, do not have any translation in the docx format.
-   `position: absolute;` or `position: fixed` properties : There is no translation of this property into the docx format that would render anything near this.
-   `width`/`height` on div elements : div's do not exist in the docx format as well, only paragraphs, tables, and images, and putting constraints on the width and height is not feasible except for tables and table cells.
