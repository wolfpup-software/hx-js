# hex-js

(H)ypermedia e(x)tension for the browser.

## Install

Add `hx-js` to an `html` document.

```html
<script type=module src="https://github.com/wolfpup-software/hex-js/hex/dist/min.js"></script>
```

## How to use

Anchor and form elements with an `hx-placement` attribute will fetch html `fragments` and update the dom.

```html
<!-- anchors -->
<a
    href="/document/fragment"
    target="ul"
    hx-placement="start">
    click me!
</a>

<!-- forms -->
<form
    action="/post/something"
    method="post"
    target="li:last-child"
    hx-placement="replace">
    <input type="submit">
</form>
```

Elements _without_ the `hx-placement` attribute behave as normal `<a>` and `<form>` elements.

### target

`Hx` queries `elements` using the `target` attribute.

A `target` value can be:
- `_target` -> the `target` property of an hx `event`.
- `_currentTarget` -> the `currentTarget` property for hx `event`
- `_document` -> the document
- any valid CSS selector.

### hx-placement

The `hx-placement` property defines how to place a document `fragment` relative to the `target`.

An `hx-placement` properties can have the following values:
- `none` -> nothing will happen
- `before` -> insert fragment before the target element
- `after` -> insert fragment after the target element
- `start` -> insert fragment before the target element descendants
- `end` -> append fragment after the target element descendants
- `remove` -> remove the target element
- `replace` -> replace the target element with the fragment

## That's it?

That's it!

`Hx-js` is designed to work as close to the `DOM` as possible. It's modular and easily extensible.

See this [guide](./EXPLAINER.md) for more details and explanations.

## License

`Hx-js` is released under the BSD 3-Clause License.