# SpineDropdown
A barebone class to create dropdown functionality within projects.
## Dependencies
*Disclosure - Little to no testing has been performed and there are likely more dependencies*
- Support for [`insertRule()`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule)

**Tested environments (Successful)**
- [Electron](https://www.electronjs.org/) v14.0.0
## Quickstart
### Installation
```sh
npm install spine-dropdown --save-dev
```
### Usage
*app.js*
```js
const { SpineDropdown } = require('spine-dropdown')

function main() {

    // Lists
    const list1 = ['one', 'two', 'three', 'four', 'five']
    const list2 = ['aaa', 'bbb', 'ccc', 'ddd', 'eee']
    const list3 = ['not', 'added', 'to', 'doc', 'yet']

    // Create instance of SpineDropdown with target stylesheet 'app.css'
    const sdd = new SpineDropdown('app')

    // Attach dropdown as the last child of target html element
    sdd.make(list1, {
        target: 'dropdown',
        class: 'black',
        classBody: 'white'
    })

    // Replace the target html element with dropdown
    sdd.make(list2, {
        target: 'another-dropdown',
        replace: true
    })

    // Store document fragment locally without adding to document
    const dropdown = sdd.make(list3)

    // Initialise all 'made' dropdowns
    sdd.init()

}
main()
```
*index.html*
```html
<!DOCTYPE html>
<html>

<head>
    <title id="title">Title</title>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="script-src 'self';">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="app.css" defer/>
</head>

<body>

    <div id="dropdown"></div>
    <div id="another-dropdown"></div>

    <script src="app.js"></script>

</body>

</html>
```
*app.css*
```css
.black {
    color: #fff;
    background-color: #000;
}

.white {
    color: #000;
    background-color: #fff;
}
```
## Documentation
### Constructor
**Parameters**
- `stylesheet` (String) (required)

    Linked stylesheet in html (typically `app.css` or `style.css`)

*Example initialisation (index.html)*
```html
<head>
    <link href="app.css" rel="stylesheet">
</head>
```
*Example initialisation (app.js)*
```js
const sdd = new SpineDropdown('app')
```
### Methods
#### `make`
Create dropdown html with provided list
- **Parameters**
  - `list` (Array) (required)
  - `options` (Object)

    | property      | type      | Action                                                            | Default           |
    | ------------- | --------- | ----------------------------------------------------------------- | ----------------- |
    | `target`      | String    | HTML element index                                                | `null`            |
    | `selected`    | String    | Initial selected dropdown text (similate HMTL selected attribute) | First list item   |
    | `replace`     | Boolean   | Insert dropdown in-place of given element id                      | `appendChild()`   |
    | `class`       | String    | Class/es string to add to dropdown parent div                     | `null`            |
    | `classBody`   | String    | Class/es string to add to dropdown list (body) div                | `null`            |
- **Return value**
  - Default
    - document fragment
  - If `target` property is passed
    - none
#### `init`
Attach functionality to all 'made' dropdowns with event listeners
- **Parameters**
  - none
- **Return value**
  - Promise
    - Success: `true`
    - Error or Warning: `null`