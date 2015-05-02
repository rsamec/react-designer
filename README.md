# react-designer

React designer is WYSIWYG editor for **easy content creation** (dynamic documents, presentations, reports, contracts, etc.)

It is prototype and work in progress. It is supposed to be professional content editor.
It can be useful for rapid application prototyping (sketch your application skeleton by drawing your screens, compose it with basic widgets and describe its functionality with useful hints).


## Features - (work in progress)

+   directly manipulate the layout of a document without having to type or remember names of components, elements, properties or other layout commands. 
+   high-quality on-screen output and on-printer output
+   precise visual layout that corresponds to an existing paper version
    +   support for various output formats - html, pdf, etc. 
+   support for various position schemas -> absolute, relative position of elements
+   comfortable user experience - basic WYSIWYG features
    +   support drag nad drop - resize object length, move object positions
    +   support manipulating objects -> copy, move, up, down objects in object schema hierarchy
    +   highlighting currently selected object and its parent
+   possible to use build-in editors 
    +   html editors - html fragments  - using [TinyMceEditor]
    +   json editors - json configuration, data 
    +   JSX editor -  custom react component - JSX editor - using [code-mirror]
    +   color picker - select color from color palette
    +   test data generator - enables to generate test data - useful for charts
    +   other standard basic editors - number, date, select editors
+   support for inspectors (html, json inspector)
+   search and filter options
+   toolbox can be extensible with any widget (react component) - hundreds of [react-components] or create your custom component (even directly in designer)
+   undo/redo functionality
+   build-in html content publishing (preview of html dynamic document)
+   usable for big documents - careful designed to use react performance
    +   we won't render the component if it doesn't need it
    +   simple comparison is fast because of using immutable data structure

## Designer components

react-designer consists of these parts

Left panel

+   Workplace
    +   Container and Repeater Container - components that can have children
    +   Box - leaf node (can not have children)
        +   CheckBoxInput
        +   ImageBox
        +   TextBox
        +   TextBoxInput
        +   ValueBox
        +   other react components
+   WorkplaceToolbar
+   JsonViewer

Right panel

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

Workplace consists of containers that are invisible elements and boxes (visible components, widgets). 

## Content publishing 
 
There are many ways how you can publish content created in react-designer.

There is basic build-in content publisher in the form of dynamic html document.
There is basic build-in service for content publishing HTML or PDF output (API).

Feel free to write your own content publisher.

List of available publishers.

+   PDFRenderer - provide high-quality printed output on a variety of printers
    +   SimplePDFRenderer - transforms directly to PDF
    +   HmtlToPDFRederer - transforms to PDF from HTML
+   HtmlRenderer - provide high-quality on-screen output
    +   InputRenderer - allow the user to fill in data in document
        +   SimpleInputRenderer - usage of simple custom controls
        +   BootstrapInputRenderer - usage of react bootstrap components
        +   MaterialUIRenderer - usage of material-ui components
    +   PrintRenderer - Allow the user to visualize what the document will look like when printed

+   some wizards publishers
+   some MDI publishers


# List of widgets

Flipper - credits to [https://www.codementor.io/reactjs/tutorial/building-a-flipper-using-react-js-and-less-css]
CollapsibleTree - credits to [http://bl.ocks.org/mbostock/4339083]

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


## Road map

+   full support for css positioning schemas - absolute, relative, normal flow
+   improve current editors + add json editor
+   PDF
    +   publish pdfkit service 
    +   better support html fragments -> to pdf (using html parser) - consider using pdfmake

+   support for svg - rendering on server

## Coming soon - TODO

+   examples 
    +   add renderer examples (8)
    +   add api examples (?)
    +   add document examples (8)
    +   add examples how to add widgets (8)
+   add more widgets
    +   reactions
    +   material-ui

+   improve - move objects in object browser
+   improve - resize    
+   decouple data layer (local storage, any document db)
+   disabled add widget when box is selected (1)
+   performance issues
    +   recheck - should component update
    +   parse property values (parseInt,etc.) - to many places - remove defensive programming favor contract by design
+   consider support for continues saving
