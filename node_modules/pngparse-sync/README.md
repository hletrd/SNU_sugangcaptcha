pngparse-sync
=============
This is a fork of [`pngparse`](https://www.npmjs.org/package/pngparse) that synchronously parses PNG data encoded as buffers.  It works in both node.js and browserify.

# Example

```javascript
var fs = require("fs")
var parsePNG = require("pngparse-sync")

console.log(parsePNG(fs.readFileSync("myimage.png")))
```

# Install

```
npm install pngparse-sync
```

# API

#### `require("pngparse-sync")(buffer)`
Parses a buffer synchronously into a PNG

* `buffer` is a `Buffer`

**Returns** `null` if there was an error parsing the PNG file, or an object with the following properties:

* `width` the width of the image in pixels
* `height` the height of the image in pixels
* `channels` the number of channels in the image
* `data` a Uint8Array storing the pixels of the image

License
=======
This software is available in the public domain.

pngparse was originally written by @ironwallaby

pngparse-sync port by Mikola Lysenko.