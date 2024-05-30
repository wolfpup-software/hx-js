# hx-js

(H)ypermedia e(x)tension for the browser.

## Install

Add `hx-js` to an `html` document.

```html
<script type=module src="https://raw.githubusercontent.com/wolfpup-software/hx-js/main/hx/dist/hx.js"></script>
```

## How to use

Anchor and form elements with an `hx-projection` attribute will fetch html `fragments` and update the dom.

```html
<!-- anchors -->
<a
    href="/document/fragment"
    target="ul"
    hx-projection="start">
    click me!
</a>

<!-- forms -->
<form
    action="/post/something"
    method="post"
    target="li:last-child"
    hx-projection="replace">
    <input type="submit">
</form>
```

Elements _without_ the `hx-projection` attribute behave as normal `<a>` and `<form>` elements.

### target

`Hx` queries an element using the `target` attribute.

A `target` value can be:
- `_target` -> the `target` property of an hx `event`.
- `_currentTarget` -> the `currentTarget` property for hx `event`
- `_document` -> the document
- any valid CSS selector.

### hx-projection

The `hx-projection` property defines how a `fragment` is projected onto a `document` relative to the `target` element.

An `hx-projection` properties can have the following values:
- `none` -> nothing will happen
- `before` -> insert a fragment before the target element
- `after` -> insert a fragment after the target element
- `remove` -> remove the target element
- `replace` -> place the target element with a fragment
- `start` -> insert a fragment before the target element descendants
- `end` -> append a fragment after the target element descendants
- `remove_children` -> remove the target element descendants
- `replace_children` -> replace the target element descendants with a fragment

## But wait, there's more!

`Hx-js` is designed to work as close to the `DOM` as possible. It's modular and easily extensible.

See this [guide](./EXPLAINER.md) for more details and explanations.

## License

`Hx-js` is released under the BSD 3-Clause License.