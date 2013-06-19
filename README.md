# flip-counter

Apple style flip counter

[Interactive Readme](http://tryme.jit.su/shtylman/flip-counter/)

## use

```js
var flipcounter = require('flip-counter');

var div = document.createElement('div');
div.className = 'flip-counter';

var counter = flipcounter(div, {
    value: 3
});

div // =>
```

## style

You can either copy the style file to your project, or reference it using `npm-css` in your style files.

```css
@import 'flip-counter';
```

All rules are namespaced under `flip-counter`

## image assets

The default stylesheet references image files found at `/img/digits.png`. You should make sure the `img/digits.png` is accessible via this path (copy or symlink) or provide your own css rule for the background image.

```
ln -s ../node_modules/flip-counter/img/digits.png .
```

If you wish to provide your own rule, see the `css/counter.css` file for which style to override.

## install

```
npm install flip-counter
```

## Credits
Based on work by Chris Nanney

* http://cnanney.com/journal/code/apple-style-counter-revisited/
* https://bitbucket.org/cnanney/apple-style-flip-counter/src

## License
MIT
