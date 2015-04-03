# react-designer
React designer is WYSIWYG enables to create dynamic documents.

+   directly manipulate the layout of a document without having to type or remember names of layout commands

Designer parts

+   Workplace
+   MainToolbar
+   ObjectToolbar
+   Toolbox
+   PropertyGrid
    +   DropDownEditor
    +   NumberInputEditor
    +   JsonEditor
    +   HtmlEditor - TinyMceEditor
+   ObjectBrowser
+   JsonViewer
+   JsonEditor


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
