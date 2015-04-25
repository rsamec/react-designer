# react-designer
React designer is WYSIWYG enables to create dynamic documents.
It is prototype for creating and designing content (dynamic documents, html, exact printings - pdfs).

Work in progress. 

Features

+   directly manipulate the layout of a document without having to type or remember names of layout commands

Designer parts

Designer
+   WorkplaceToolbar
+   Workplace
    +   Container
    +   Box
        +   CheckBoxInput
        +   ImageBox
        +   TextBox
        +   TextBoxInput
        +   ValueBox
+   JsonViewer
+   ObjectToolbar
+   ObjectBrowser - tree of objects
+   PropertyGrid
+   Palette - components toolbox
+   Modal
+   Editors
    +   BoolEditor
    +   ColorPickerEditor
    +   JsonEditor
    +   DropDownEditor
    +   HtmlEditor - TinyMceEditor
    +   NumberInputEditor



Available publishers

+   PDFRenderer - provide high-quality printed output on a variety of printers
    +   SimplePDFRenderer - transforms directly to PDF
    +   HmtlToPDFRederer - transforms to PDF from HTML
+   HtmlRenderer - provide high-quality on-screen output
    +   InputRenderer - allow the user to fill in data in document
        +   SimpleInputRenderer - usage of simple custom controls
        +   BootstrapInputRenderer - usage of react bootstrap components
        +   MaterialUIRenderer - usage of material-ui components
    +   PrintRenderer - Allow the user to visualize what the document will look like when printed

Write your own publisher.


# Get started

Run watch task and begin to develop your React components.

```
$ npm install
```

```
$ bower install
```

```
$ gulp development
```

```
$ gulp production
```


## Roadmap


+   add export/import json feature
+   add renderer examples
+   add api examples
+   decouple data layer
+   performance issues

+   support css positioning schemas - absolute, relative, normal flow
+   improve current editors + add json editor
+   PDF
    +   better support html fragments -> to pdf (using html parser) - consider using pdfmake
+   consider support for continues saving
+   support for svg - rendering on server
