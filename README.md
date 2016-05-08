# react-designer

React designer is WYSIWYG editor for **easy content creation** (legal contracts, business forms, marketing leaflets, inforgrafics, technical guides, visual reports, rich dashboards, tutorials and other content, etc.).

**Warning**: Nevertheless, i must repeatedly stress that it is still a prototype and work in progress.

![designerScreen](https://github.com/rsamec/react-designer/blob/master/designer_roses.jpg)

## Demo
[Live demo](http://rsamec.github.io/react-designer/)


## Features

+   directly manipulate the layout of a document without having to type or remember names of components, elements, properties or other layout commands.
+   precise visual layout that corresponds to an existing paper version
    +   support for various output formats - html, pdf, ...
+   high-quality on-screen output and on-printer output (only partially implemented)
+   comfortable user experience - basic WYSIWYG features
    +   support drag nad drop - resize object length, move object positions
    +   support manipulating objects -> copy, move, up, down objects in object schema hierarchy
    +   highlighting currently selected object and its parent
	+   minimum input, maximum output
	+	remove the barriers of entry
+   build-in html content publishing (preview of html dynamic document)
+   binding support using [react-binding](https://github.com/rsamec/react-binding) - experimental
+   props inheritance - when rendering occurs -> the props value is resolved by using a value resolution strategy (Binding Value -> Local Value -> Style Value -> Default Value)
+   usable for big documents - careful designed to use react performance
    +   we won't render the component if it doesn't need it
    +   simple comparison is fast because of using immutable data structure
+   undo/redo functionality


## Content publishing 
 
There are many ways how you can publish content created in react-designer. Feel free to write your own content publisher.



+   PDFRenderer - provide high-quality printed output on a variety of printers
    +   PDFRenderer - transforms directly to PDF (not implemented yet)
    +   HmtlToPDFRenderer - transforms to PDF from HTML (implemented using phantomjs - [node-html-pdf](https://github.com/marcbachmann/node-html-pdf))
+   HtmlRenderer [react-html-pages-renderer](https://github.com/rsamec/react-html-pages-renderer)- provide high-quality on-screen output
    +   HtmlRenderer - renders html - expands to full screen
    +   HtmlPagesRenderer - allow the user to visualize what the document will look like when printed

# Get started

```
$ npm start
```

## Roadmap

+   support for more positioning schemas (especially to support for responsive design)
	+	[Responsive grid system] (http://getbootstrap.com/css/#grid)
	+	[CSS Flex box](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)
	+	[Grid Style Sheets](http://gridstylesheets.org/)
+   support for typography (vertical rhythm, modular scale, web fonts, etc.)
+   support for more fonts (google fonts)
+   support for print (PDF) - 300 DPI pixel perfect print
	+	support html fragments -> to pdf (using html parser)
	+	custom PDF rendering - (no dependency on PhantomJS or Electron)
+   improve designer experience
    +   move objects in object browser
    +   disabled add widget when box is selected
    +   improve property editor
+   performance issues
    +   recheck - should component update
    +   parse property values (parseInt,etc.) - to many places - remove defensive programming favor contract by design
+   data binding refactoring    
    +   support for binding to remote stores (consider falcor)
    +   data watchers - if some data changes, it changes on the other site

### License

MIT. Copyright (c) 2015 Roman Samec

