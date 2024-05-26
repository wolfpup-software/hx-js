# hx-js

Hypermedia for the browser.

## Install

Add `hx-js` to an `html` document.

```html
<script type=module src="https://github.com/wolfpup-software/hx-js/hx/dist/mod.js"></script>
```

Now `<a>` and `<form>` elements with an `hx-placement` attribute will fetch html `fragments` and update the dom!

Elements _without_ the `hx-placement` attribute behave as normal `<a>` and `<form>` elements.

## How to use

### target

`Hx` queries `elements` using the `target` attribute.

A `target` value can be:
- `_target` -> the `target` property of an `hx` event.
- `_currentTarget` -> the `currentTarget` property for `hx` event
- `_document` -> the document
- any valid CSS selector.

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

After a `target` is queried, the `hx-placement` property defines how to place a document `fragment` relative to the `target`.

An `hx-placement` properties can have the following values:
- none -> nothing will happen
- before -> before selected element
- after -> after selected element
- start -> before descendants
- end -> after descendants
- remove -> remove regardless
- replace -> replace element

## That's it?

That's it!

`Hx-js` is designed to work as close to the `DOM` as possible. It's modular and easily extensible.

See this [guide](./EXPLAINER.md) for more details and explanations.

## License

`Hx-js` is released under the BSD 3-Clause License.