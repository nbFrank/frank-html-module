## 3.29.3

Make package size smaller

## 3.29.2

Bugfix corrupt document when adding HTML link inside header

## 3.29.1

Avoid using styles that reference non-existing styles

## 3.29.0

Make module compatible with docxtemplater@3.28.0.
Please make sure to update docxtemplater to 3.28.0 at the same time you update this module.
The internal change made is the use of the new matchers API which fixes bugs that were triggered depending on the order of the modules that are attached to the instance.
Now the order of the modules should not matter as expected.

## 3.28.0

Make module compatible with docxtemplater@3.27.0.
Please make sure to update docxtemplater to 3.27.0 at the same time you update this module

## 3.27.0

-   Use WidthCollector for each parsed file (makes module compatible with image module 3.10.0)

## 3.26.10

-   Add support for `<table align="right">`.
    It is also possible to use `<table style="margin-left: auto">` to align a table to the right.

-   Add support for bordercolor attribute on `<table bordercolor="#bbb">`.

-   Add support for cellpadding attribute on `<table cellpadding="5">`.

## 3.26.9

Make img.getValue optional, even when running docxtemplater in async mode.

## 3.26.8

Update typing to allow ArrayBuffer or Promise<ArrayBuffer> on getValue function

## 3.26.7

Update typing files to add types for using together with image module, with

```js
const htmlOpts = {
    ignoreUnknownTags: true,
    img: {
        Module: ImageModule,
        getValue: (el) => {
            return Promise.resolve(Buffer.from("hhh"));
        },
        getSize: function (data) {
            return [100, 100];
        },
    },
};
const doc = new Docxtemplater(zip, {
    modules: [new HTMLModule(htmlOpts)],
});
```

## 3.26.6

Add internal clone method (to use image tags with the Subtemplate.Segment module)

## 3.26.5

Use @xmldom/xmldom instead of xmldom, see [this github issue](https://github.com/xmldom/xmldom/issues/271)

## 3.26.4

Generate files in built with correct filename
In previous versions, the filename was always `build/docxtemplater.js`.
Now the filename is `build/html-module.js`
The .min.js file is also created now.

## 3.26.3

Add support for `<ol start="3"><li>An item</li></ol>` to start the list items at a different position, to render :

```text
3. An item
4. An other item
```

## 3.26.2

Add support for images without src when using following CSS :

```css
img {
    display: block;
    margin: auto;
}
```

Previously this would result in a corrupt document

## 3.26.1

Add support for setting the prefix to an empty string (to be able to replace normal tags by inline HTML).

To change the prefix for block tags, one will have to change the prefix like this :

For example to use `{!!html}` for block html, and {tag} for inline html :

```js
function getHTMLModule() {
    const htmlModule = new HTMLModule();
    htmlModule.prefix = "";
    htmlModule.blockPrefix = "!!";
    return htmlModule;
}
const doc = new Docxtemplater(zip, {
    modules: [getHTMLModule()],
});
```

## 3.26.0

Add support for centering images in the output word document.

To use it, you need to add following styleSheet :

```js
const htmlOpts = {
    styleSheet: `
        img {
            display: block;
            margin:auto;
        }
`,
};
const doc = new Docxtemplater(zip, {
    modules: [new HtmlModule(htmlOpts)],
});
```

## 3.25.15

Add typescript definitions for public API

## 3.25.14

Improve support for columns width, so that tables inside columns which are of unequal width will render correctly.

For example, if you have a document with two columns, one of width of 2/3 of the document, and an other one of 1/3 of the document width, a table with width of 100% will be calculated correctly.

Previously, the width would be in this case always splitted equally, so you would have a smaller table on the column with 2/3 of the space.

## 3.25.13

Move webpack from dependency to devDependency (which triggered an error during installation on node version 10)

## 3.25.12

Bugfix issue when using "text-align: right", on a table cell, where the {~~html} tag was explicitly left-aligned.

Now, the text-alignment from the HTML style will take precedence and show the text aligned correctly.

## 3.25.11

Add support for `table-layout: fixed;` CSS property (which translates to `<w:tblLayout w:type="fixed"/>`)

## 3.25.10

Add support to customize pStyle for `<pre>` tags, for example

```js
const htmlOpts = {};
htmlOpts.elementCustomizer = function (element) {
    if (element.classNames.indexOf("ql-syntax") !== -1 && element.name === "pre) {
        return { pStyle: "Code" }
    }
}
const doc = new Docxtemplater(zip, {
    modules: [new HtmlModule(htmlOpts)],
});
doc.render({
    html: `<pre>Hello from
        pre tag</pre>`
})
```

## 3.25.9

Add support for repeatHeaderRow and cantSplit on table row elements with elementCustomizer

For example, you can now do :

```js
const htmlOpts = {};
htmlOpts.elementCustomizer = function (element) {
    if (element.matches("tr.header")) {
        return {
            cantSplit: true,
            repeatHeaderRow: true,
        };
    }
    if (element.matches("tr")) {
        return {
            cantSplit: true,
        };
    }
};
const doc = new Docxtemplater(zip, {
    modules: [new HtmlModule(htmlOpts)],
});
doc.render({
    html: `
        <tr class="header">
            <td>Head1</td>
            <td>Head2</td>
        </tr>
        <tr class="header">
            <td>Head3</td>
            <td>Head4</td>
        </tr>
        <tr><td>Some Text</td><td>Other Text</td></tr>
        ....
        ....
        <tr><td>Some Text</td><td>Other Text</td></tr>
    `,
});
```

And this will set the two header table rows to be repeated across each page when the table overflows. The cantSplit property can also be used to avoid the table row to be splitted between two pages.

## 3.25.8

Add support for `<ol type="I">` to show ordered lists with uppercase roman numbers.

Here are the possible types :

-   `type="1"` The list items will be numbered with numbers (default)
-   `type="A"` The list items will be numbered with uppercase letters
-   `type="a"` The list items will be numbered with lowercase letters
-   `type="I"` The list items will be numbered with uppercase roman numbers
-   `type="i"` The list items will be numbered with lowercase roman numbers

Add support for style `list-style-type` and `list-style`, to use CSS to customize numbering.

For example :

```js
const htmlOpts = {
    styleSheet: `
    ol {
        list-style-type: upper-alpha;
    }
    ol.roman {
        list-style: upper-roman;
    }
`,
};
const doc = new Docxtemplater(zip, {
    modules: [new HTMLModule(htmlOpts)],
});
```

The list of possible values are : `decimal-leading-zero, decimal, lower-alpha, lower-latin, upper-alpha, upper-latin, lower-roman, upper-roman`

## 3.25.7

Add support for background-color on table element (previously it could only be set on tr or td)

## 3.25.6

Add support to customize bullet colors and font-family using elementCustomizer

## 3.25.5

Add support to customize li pStyle using elementCustomizer

## 3.25.4

To use this version with the image-module, you need to use the image-module version 3.8.4

Allow to retrieve containerWidth in `getSize` function when using `<img>` tags.

For example :

```js
const options = {
    img: {
        Module: imageModule,
        getSize({ element, src, part }) {
            return [part.containerWidth, part.containerWidth];
        },
    },
};
```

This allows to for example show all images as being the size of the container (most commonly, the size of the page, except when the HTML tag is inside a table).

## 3.25.3

Allow to have comments in stylesheets

## 3.25.2

Bugfix to take into account "border:none" on `<table>` elements

## 3.25.1

Correctly keep `<w:rtl>` tag in order to allow to insert "right-to-left" languages such as Hebrew.

## 3.25.0

Add support for `<style>` tag inside HTML tags

## 3.24.7

Disallow to pass something other than a string to the stylesheet option (because this option only allows to pass a given global stylesheet)

## 3.24.6

Bugfix, when having text surrounding the HTML inline tag, such as in :

```
Hello {~name}, how are you ?
```

The HTML module would sometimes misplace the replacement of {~name} and put it at the end of the paragraph.

Now, the module correctly puts the replacement at the correct position.

## 3.24.5

Use `w:lineRule="exact"` when using CSS `line-height`

## 3.24.4

Add support for `line-height` attribute.

## 3.24.3

Improvements for cell widths.
Now, when you declare only the widths of td (without defining the width of the table itself), the cell widths will be correct (the table width will be the sum of all cell widths).

For example : this will work :

```js
const htmlOpts = {
    styleSheet: `
td {
    width: 50px;
}
`,
};
const doc = new Docxtemplater(zip, {
    modules: [new HTMLModule(htmlOpts)],
});
```

Previously, this would result in having a default table width of 450px, and scaling of the cell widths.

## 3.24.2

Bugfix when having `<br>` in "implicit paragraph", for example in :

```html
<h1>Hello</h1>
<br />
<h1>Hello</h1>
<br />
<h1>Hello</h1>
```

In previous versions, this would render two empty paragraphs between each title, now it correctly renders only one

## 3.24.1

Avoid importing unused styles, such as :

"Heading Car"
"Heading 1 Car"
"Heading 2 Car"
"Citation Car"

Those styles are now imported only if the corresponding style does not exist in the templated document.

## 3.24.0

Add support for :

-   `<table>` that contains some empty `<tr>` elements (it would generate a corrupt document)
-   `<input type="text">`
-   `<form>` tag (no specific style currently)
-   `<textarea>` tag (no specific style currently)
-   `<button>` tag (no specific style currently)
-   `<label>` tag (no specific style currently)

## 3.23.7

Fix issue with css module :

```javascript
Module not found: Error: Can't resolve 'fs' in '[...]\node_modules\css\lib\stringify'
```

Now, the module requires only the part that it uses, which removes this error.

## 3.23.6

Add support for "dotted" border-style.

Add support for border-style with multiple values (one to four values)

## 3.23.5

Bugfix to ignore `<br>` at the end of block elements.

## 3.23.4

Bugfix support for border styles, such as `border: 1px dashed black;`

List of handled styles : solid, dashed, double, outset, none, inset

## 3.23.3

Add third argument to styleTransformer() containing styleIds of the current document.

## 3.23.2

Bugfix to render space in inline HTML tag when using : `<b>Foo</b> <i>Bar</i>`

## 3.23.1

Fix error when using `<img>` tag without any src. The error message was `TypeError: Cannot read property 'replace' of undefined at base64DataURLToArrayBuffer`. Now, those images are ignored but do not fail with an error.

## 3.23.0

Improve table border support :

-   Add support for `border-width` property on border

-   Add support to change default for table borders with elementCustomizer, for example :

```javascript
const options = {
    elementCustomizer({ name }) {
        if (name === "table") {
            return {
                tblStyle: "TableauNormal",
                defaultBorder: null,
            };
        }
    },
};
```

This makes it possible to use border style defined in the Word style.

## 3.22.9

Add support for `<ins>` and `<del>` tags (which will render underline and striked text)

## 3.22.8

Do not produce corrupt output when having either :

-   Tr element without any child : `<table><tr></tr></table>`

-   Table element without any child : `<table></table>`

Instead, the table will not be shown at all.

## 3.22.7

Correctly ignore `width='0'` on `<table>` element.

## 3.22.6.

Do not render newline when it is at the end of a `<li>` element, for example, in :

```html
<ul>
    <li>Hello<br /></li>
    <li>Hello<br /></li>
</ul>
```

## 3.22.5

Render text that is inside an `<ul>` even if it is not in a ul.

In previous versions, the tag `<ul>Hello</ul>` would produce an empty paragraph. Now it will render a paragraph with the word "Hello".

## 3.22.4

Add support for "padding" property.

Previously, only "padding-left", "padding-right", "padding-top" and "padding-top" were working, but not she shorthand `padding: 0` property for example.

For table cell margins, support all common units (not just `px` unit).

## 3.22.3

Make it possible to specify `margin: 0` (or `margin-left: 0`) on table element. (It was ignored in previous versions)

## 3.22.2

Return an empty paragraph when using `<p><br></p>` instead of having a two-line paragraph

## 3.22.1

-   Bugfix `Cannot read property 'getElementsByTagName' of undefined` at addRelationship `(es6/relation-utils.js:25:32)` when using docx file saved from the online office 365 web app.

-   Add styleIds to elementCustomizer API to be able to know which styles are defined in the document when changing pStyle.

## 3.22.0

-   Remove tableRatio option (you should use deviceWidth instead)

-   Add support for "cm", "in", "mm", "pc", "pt" for all measurements

-   Bugfix do not produce a corrupt document when having escape codes such as an "escape character" (`String.fromCharCode(27)`). These characters are now ignored, like what a real browser does.

## 3.21.13

Add support for pt unit in font-size, for example : `font-size: 15pt`

The `pt` unit is for now not supported on all measures however.

## 3.21.12

Declare supportedFileTypes, which allows to use this module with the new
docxtemplater constructor which was [introduced in docxtemplater 3.17](https://github.com/open-xml-templating/docxtemplater/blob/master/CHANGELOG.md#3170).

## 3.21.11

Add `element.parsedStyle` which contains the parsed CSS style for usage in getSize of image module

## 3.21.10

Add support for `text-indent` to indent first line of a paragraph.

## 3.21.9

Bugfix : Do not fail if using more list levels than are defined in pStyle.

For example :

```javascript
const htmlOpts = {
    styleTransformer: (tags, docStyles) => {
        tags.ul.data.pStyle = ["bulletLevel1"];
        tags.ul.data.useNumPr = false;
        return tags;
}
const doc = new Docxtemplater(zip, {modules: [new HtmlModule(htmlOpts)]})
```

will use `bulletLevel1` for each level of bullets.

Previously, this was failing with the following error code :

`TypeError: Cannot read property 'oneOf' of undefined`

## 3.21.8

Bugfix : Previously, when having text just before an inline HTML tag, like in :

```
Hello{~inlineHTML}
```

The text Hello was removed from the output.

This is no longer the case, the text on the left and on the right of the inline tag will be kept.

## 3.21.7

If using ignoreUnknownTags to true, hide images instead of throwing an error.

## 3.21.6

Add support for caption on images when using the image module version 3.7.0 or above.

## 3.21.5

The runProperties (`w:rPr`) used where the first encountered, instead of using the one inside the run itself (`w:r`).

## 3.21.4

For `table` tag, when the {~~htmlTag} is inside a multi-column session, the `width:"100%"` will use the width of one column instead of the width of one page.

## 3.21.3

Add support for `margin-left` on paragraphs

## 3.21.2

Add support for `font-family` in CSS

## 3.21.1

Add support for `break-after: page` and `break-before: page` in CSS

## 3.21.0

Add support for `<pre>` tag

Make it possible to have `width: 100%` for images inside tables

Fix the calculation of width for images so that a table with a width of 200px shows the same width as an image with width of 200px. Before this release, the images were smaller than expected.

## 3.20.3

Keep paragraph style including indents and alignment

## 3.20.2

Add support for `pt` values on table width

## 3.20.1

Add support for `margin: 0` (without any unit)

## 3.20.0

Add support for colspan + rowspan on the same cell.

Multiple improvements for rowspan

## 3.19.5

Add support for Right-To-Left support with `w:bidi` tag.

Add support for margin-top and margin-bottom on li tags

## 3.19.4

Bugfix corrupted document when using margin-top or margin-bottom

## 3.19.3

Add support for margin-top and margin-bottom on paragraphs

## 3.19.2

Bugfix spacing in li :

```
<p>
<ul>
<li><em>Lorem ipsum dolor si amet</em> <strong>Test</strong></li>
</ul>
</p>
```

The space will now be correctly rendered

## 3.19.1

Bugfix : support `vertical-align: middle;` for td

## 3.19.0

Add initial support for rowspan on table td

## 3.18.4

Bugfix of propagation of style to all paragraphs.

For example, when having :

```
<div>
	<p>Uncentered</p>
	<p style="text-align:center">Centered</p>
</div>
```

The first paragraph was centered even if it should not.

## 3.18.3

Bugfix to avoid `Cannot read property 'concat' of undefined"` when defining styles on some elements (such as th).

## 3.18.2

Always generate output with w:sz as integer (instead of float) by using Math.round

## 3.18.1

Add support for `td { width: 20% }` in CSS

Bugfix issue of width of all cols being smaller than width of whole table

## 3.18.0

Add support for :

-   `:first-child`, `:last-child`, `:nth-child(3)` selectors
-   `border-left`, `border-top`, `border-right` and `border-bottom` on td and th for tables
-   `text-align:center` on th/td
-   `border-style` double property

## 3.17.3

Bugfix for "Cannot read property 'getAttribute' of undefined" when having styles without names.

## 3.17.2

Bugfix `[object Object]` shown when using async mode (`resolveData`) with null value

## 3.17.1

Bugfix corrupt document when having empty w:sdtContent

## 3.17.0

Add support for async image generation

## 3.16.9

Keep fontFamily if set in run properties

## 3.16.8

Do not corrupt document if having empty value in block html inside table cell

## 3.16.7

Do not fail if they are no sections at all in the document (return a default size).

## 3.16.6

Bugfix corrupt document when using table colspan with just one row.

## 3.16.5

-   Add support for centered tables with `margin: 0 auto;`

## 3.16.4

Inherit paragraph properties inside tables.

## 3.16.3

-   The table color properties were "leaking" from one cell to the other, resulting in wrong colors being used sometimes. This is now fixed

## 3.16.2

-   Improve list support when `ul` is a direct child of `ol` or `or` is a direct child of `ul`.

-   Add the style (run properties) of the `{~~htmlTag}` to bullet points so that the bullet points have the same size as the text

## 3.16.1

-   Add support for `font-weight:bold` of `font-weight:700`

## 3.16.0

-   Add support for `styleSheet` option in module constructor

## 3.15.1

-   Add support for `margin-left` on `ul` and `ol`

## 3.15.0

-   Better support for ul and ol : when using ols inside uls, if the `TextBody` style did not exist, the ul and ol style were missing bullets.

-   Add way to customize bullets in the elementCustomizer API

## 3.14.1

Update html-parser require calls to work well with Rollup

## 3.14.0

Improve table support (background && background-color, color, font-size.

Do not duplicate runProps anymore

## 3.13.6

Add support for inline and block `<code>` tags

## 3.13.5

Update to support the new image module v3.4.2

## 3.13.4

Update to support new image module with `<svgs>` (3.4.1 of the image-module)

## 3.13.3

Add support for `<a name="mark"></a>` to generate docx bookmarks

## 3.13.2

Add support for `<a href="#mark">Go to mark</a>` and `<p id="mark">Mark</p>` by using docx bookmarks

## 3.13.1

Links with no content are now hidden from the generated document (ignored)

## 3.13.0

Add two additional options for determining the meaning of 1 pixel.

The `deviceWidth` option explicitly permits to say that you want to have a window of for example 1200 pixels.

The `getDxaWidth` option to select how many dxas (20th of a point, or 1440 of an inch) your page is.

With these two options, docxtemplater can then accordingly convert any pixel value to a coherent size in your word document.

## 3.12.0

Add support for setting properties on multiple levels of divs/blockquotes or any block element.

For example :

```html
<div style="text-align: justify;">
    <blockquote>
        Sit aliquid vitae non magni ex Eius saepe molestias
        minima non tempore amet! Accusamus corrupti at ipsa
        necessitatibus consequatur. Corporis autem debitis
        reiciendis illo modi, inventore. Delectus magni sint
        doloremque?
    </blockquote>
</div>
```

## 3.11.10

Add support for images inside link and inside lists, for example :

```html
<ul>
    <li>
        <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIJBywfp3IOswAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAkUlEQVQY052PMQqDQBREZ1f/d1kUm3SxkeAF/FdIjpOcw2vpKcRWCwsRPMFPsaIQSIoMr5pXDGNUFd9j8TOn7kRW71fvO5HTq6qqtnWtzh20IqE3YXtL0zyKwAROQLQ5l/c9gHjfKK6wMZjADE6s49Dver4/smEAc2CuqgwAYI5jU9NcxhHEy60sni986H9+vwG1yDHfK1jitgAAAABJRU5ErkJggg=="
        />
        Docxtemplater
    </li>
</ul>
<p>
    <a>
        Docxtemplater
        <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIJBywfp3IOswAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAkUlEQVQY052PMQqDQBREZ1f/d1kUm3SxkeAF/FdIjpOcw2vpKcRWCwsRPMFPsaIQSIoMr5pXDGNUFd9j8TOn7kRW71fvO5HTq6qqtnWtzh20IqE3YXtL0zyKwAROQLQ5l/c9gHjfKK6wMZjADE6s49Dver4/smEAc2CuqgwAYI5jU9NcxhHEy60sni986H9+vwG1yDHfK1jitgAAAABJRU5ErkJggg=="
        />
    </a>
</p>
```

## 3.11.9

Add part argument to getSize

## 3.11.8

-   Add support for : `text-align: justify`

-   Add support for : `bgcolor` attribute on td and tr

## 3.11.7

-   Add support for : `padding-top,padding-bottom,padding-left,padding-right` on `td`

-   Add support for `valign` attribute on `td`

-   Add support for color in more CSS formats for background-color, color, border-color, for example : `<span style='color: white;background-color: hsl(120, 100%, 50%); '>color output</span>` will now work.

-   Make it possible to use text-align inside td

## 3.11.6

Add support for :

-   `vertical-align` style on `td`
-   `background-color` style on `tr`
-   `border-color` on `td`

## 3.11.5

Make it possible to customize pStyle for list items, for example :

```js
const ulpStyles = ["ListBullet", "ListBullet2", "ListBullet3"];
options.elementCustomizer = function ({ name, listLevel }) {
    if (name === "ul") {
        return {
            pStyle: ulpStyles[listLevel],
            useNumPr: false,
        };
    }
};
```

listLevel will be 0, 1, 2 depending on the nested level of the item in the HTML.

## 3.11.4

Do not apply elementCustomizer on implicit paragraphs.

For example, if you had in your html :

```html
<table>
    <tr>
        <td>Lorem</td>
    </tr>
</table>
```

and wrote :

```js
const opts = {
    // ...,
    elementCustomizer(element) {
        if (element.matches("td")) {
            return {
                pStyle: "TextBody",
            };
        }
        if (element.matches("p")) {
            return {
                pStyle: "Heading",
            };
        }
    },
};
```

Then, before this version, the text "Lorem" would use the "Heading" style.

In this new version the implicit paragraph `<p>Lorem</p>` would not trigger a call to elementCustomizer at all, thus using "TextBody", which is the correct style to apply !

## 3.11.3

Make it possible to style implicit paragraphs in td by setting a pStyle on the td element from elementCustomizer.

-   Fix bug of pStyle not kept in certain cases.

## 3.11.2

-   Add support to set td width with style in px

The style property takes precendence over the style attribute, for example :

```html
<td width="100" style="width: 400px" align="center">John</td>
```

will resolve to a width of 400px.

## 3.11.1

Add ignoreCssErrors to ignore CSS parse errors.

## 3.11.0

-   Add new selector API that makes it possible to style elements with CSS like selectors , for example :

    ```js
    const opts = {
        // ...,
        elementCustomizer(element) {
            if (
                element.matches(
                    "th h3.p1, tr>th>h3.p3, tr>h3.nomatch"
                )
            ) {
                return {
                    htmlStyle: "background-color: #ff0000;",
                };
            }
        },
    };
    ```

-   Add way to remove all table borders by specifying :

    For example

    ```html
    <table style="border: none;">
        <tr>
            <td>Hello</td>
        </tr>
    </table>
    ```

-   Bugfix add possibility to style `<a>` element (link)

## 3.10.5

-   Update browser build to use XMLSerializer instead of xmldom

-   Use requiredAPIVersion

## 3.10.4

-   Fix browser build failing `Nodes of type '#document' may not be inserted inside nodes of type ...`

## 3.10.3

-   Fix browser build "TypeError: Argument 1 of XMLSerializer.serializeToString does not implement interface Node."

## 3.10.2

-   Support elementCustomizer even when having deeply nested paragraphs, for example with `<div><p>Hello</p></div>`

## 3.10.1

Add support for :

-   align attribute on table cell

-   enhance colspan support when widths are not all fixed

-   table width as percentage

## 3.10.0

Add support for :

-   Background-color in tables (in css format)

-   Better use width in tables (which now generates colgrid and gridspan)

-   Add support for align="center"

-   Background-color in span (in css format)

## 3.9.2

-   Add `{part}` argument to elementCustomizer

## 3.9.1

-   Move docxtemplater from devDependencies to dependencies

Explanation : On some versions of npm (notably 5.8.0), when having a package containing docxtemplater-html-module, the installation will generate a tree of node_modules that puts the module on a level where it has no access to docxtemplater. By explicitly asking it as a dependency, this issue is avoided.

## 3.9.0

-   Drop `paragraphCustomizer` api (which was added in 3.8.4), for a more generic `elementCustomizer` API.

## 3.8.4

Make it possible to customize docxstyles depending on classnames.

## 3.8.3

-   Make module compatible with docxtemplater version 3.5 and below.

Explanation : Recently, the scopemananger API (internal API) has changed, this new version of the html module makes the module work with both versions newer than 3.6 and older than 3.6 of docxtemplater.

## 3.8.2

Add support for svg tag (needs the image module too) (this format is only readable on newer Word version : Microsoft Word, PowerPoint, Outlook, and Excel 2016 on Windows, Mac, Android and Windows Mobile).

## 3.8.1

Add meta context argument to custom parser with information about the tag for each types of tags

## 3.8.0

-   Use default paragraph style instead of textbody for paragraphs

## 3.7.1

-   Fix issue with style that were overriden if the styles had the same name

## 3.7.0

-   Add styles only when using an HTML tag

## 3.6.6

-   Add way to change the size of paddingLeft with sizeConverters

## 3.6.5

-   Add support for padding-left : `<p style="padding-left:15px">Hello</span>`

## 3.6.4

-   Add support for font-size : `<span style="font-size: 15px">Hello</span>`

## 3.6.3

-   Add support for more image types in `img` tag : GIF, JPEG, BMP, PNG work now

## 3.6.2

-   Add support for `blockquote` tags

## 3.6.1

-   Correctly handle `&#58` in style attributes (parsed as `:`).
-   Fail with clear error message if style attribute cannot be parsed

## 3.6.0

Add support for `<img>` if using imagemodule.

## 3.5.10

Throw explicit error when using pptx instead of docx

## 3.5.9

Fix bug introduced in 3.5.5 : When using `<li>` elements, all child tags are now correctly rendered (before, only the first child was rendered).

## 3.5.8

When using `<a>Link</a>` without href, set the Target to "" instead of "undefined"

## 3.5.7

Handle multiple occurences of noBreakHyphen in same tag

## 3.5.6

Handle noBreakHyphen

## 3.5.5

Improve whitespace support.

## 3.5.4

-   Fix rendering of space between tags for inline tags too `{~html}`, for example :

```html
<p><b>Foo</b> <u>Bar</u></p>
```

will now correctly render "Foo Bar" instead of "Foobar"

## 3.5.3

-   Fix rendering of space between tags for block tags, eg `{~~html}`, for example :

```html
<p><b>Foo</b> <u>Bar</u></p>
```

will now correctly render "Foo Bar" instead of "Foobar"

## 3.5.2

-   Add possibility to customize styles for nested `<ul>`,

eg :

```js
this.options.styleTransformer = function (tags) {
    tags.ul.data.pStyle = [
        "ListBullet",
        "ListBullet2",
        "ListBullet3",
    ];
    tags.ul.data.useNumPr = false;
    return tags;
};
```

This will set the "ListBullet" for level 0 of `<ul>`, "ListBullet2" for level 1 and so on.

## 3.5.1

-   Add possibility to customize styles for BulletList with styleTransformer

## 3.5.0

-   Add option `styleTransformer` to customize styles.
-   Do not set `<w:spacing w:before="0" w:after="0"/>` for each paragraph, but use the one that is set in the paragraph containing the {~~blockTag}, if present.

This release needs version 3.1.11 of docxtemplater.

## 3.4.5

Bugfix issue with styles of TextBody or BodyText being wrongly changed.

## 3.4.4

Bugfix issue with bullet lists no more appearing

## 3.4.3

-   Fix issue with duplicate list content when using `<ul><li><em>Test</em> after</li></ul>`
-   All html escapes are now currently handled, including `&#xA0`, `&and;`, and all html handled escapes

## 3.4.2

-   Add support for `text-align:center` and `text-align:right`
-   Add correct styles for `h5` and `h6`

## 3.4.1

-   Handle escapes such as `&quot;` `&amp;` `&#x27;` `&gt;` `&lt;`

## 3.4.0

-   Add possibility to ignore unknown tags with an option
-   Add support for `<sub>` and `<sup>`

## 3.3.3

Add support for style="text-decoration: underline"

## 3.3.2

Handle nested ul/li:

```html
<ul>
    <li>Foo</li>
    <li>
        <ul>
            <li>Nested 1</li>
            <li>Nested 2</li>
        </ul>
    </li>
</ul>
```

## 3.3.1

Multiple fixes for tables :

Add support for tables that have :

-   no `<tbody>`, and directly `<tr>`
-   `<thead>` or `<tfoot>`
-   `<th>` instead of `<td>`

Also, allow `td` to be empty, for example :

`<table><tr><td>First</td><td></td><td>Third</td></tr></table>`

Fixes links containing dom children to be shown as "undefined", for example :

`<a href="https://ddg.gg">Foobar <span>Foo</span></a>`

## 3.3.0

Make it possible to add paragraphs nested inside paragraphs, for example :

\`\`\`

<div> <p>Paragraph1</p> <p>Paragraph2</p> <p>Paragraph3</p> </div> \`\`\`

Fix issues with `&amp;` and others not getting decoded

## 3.2.1

Add support for background-color on `p` element. It uses the fill property of word, which sets the background-color for a full paragraph.

## 3.2.0

Add auto wrapping of inline elements in block-elements, so that `<span>Foobar</span>` is also valid in {~~blockElement}. Also, this makes it possible to use `<td>Foobar</td>` (the wrapping of the `<p>` is done for you).

## 3.1.4

Add support for inline style `background-color:blue`

## 3.1.3

Fixes following error in version 3.1.2 : "Cannot find module '../static/styles.json'"

## 3.1.2 [WIPED](Please use 3.1.3)

Bugfix when using multiple `<ol>`, the numbering is reset correctly for each `<ol>`

## 3.1.1

Bugfixes when using elements other than `<p>` inside a `<td>` (eg now `<ul>` works)

## 3.1.0

Bugfixes when using :

-   table inside table
-   multiple lists (`<ul>`, `<li>`\)
-   multiple links to same Target

## 3.0.12

Fix bug when using tags inside lists, for example, `<ul><li><i>Foo</i></li></ul>` now works as expected

## 3.0.11

Update rendering of `<ol>` to use the default symbol.

## 3.0.10

Do not change style of Title, Heading1 - Heading6 of current document

## 3.0.9

Add support for `<input type="checkbox">` and `<input type="checkbox" checked>`

## 3.0.8

Fix right borders for tables

## 3.0.7

Fix corrupted documents with some templates

## 3.0.6

Add support for `<a href="URL">LinkText</a>`

## 3.0.5

Add support for inline style `color:#ef0000`

## 3.0.4

Keep word-run style for inline replacement. For example if, the text that the `{~html}` tag is written in is red, it will also be the base style for the generated elements of the html tag.

## 3.0.3

Keep existing style. For example, if the html is : `<p>Foobar</p>`, the text should be styled the same as the rest of the document.

## 3.0.2

Add support for `ol`,`ul` and `li` tags

## 3.0.1

Update demo and readme

## 3.0.0

Initial release
