# hx-js

A hypermedia extension for the browser.

## semantics

Augment the default `<a>` and `<form>` elements to create rich hypermedia experiences in the browser.

```html
<a href="/some/url" target="selector" hx-placement="replace">
    click me!
</a>

<form action="/some/form/url" method="post" target="selector" hx-placement="before">
    <input type="submit">
</form>
```

Add the `hx-placement` attribute to `<a>` or `<form>` element.

This changes the behavior of the `<anchor>` or `<form>` elements.

`Hx` uses the `target` property to query an `element`.

```
target
    _self -> the anchor or form element
    _parent -> the parent element
    _root -> the document or shadow root or "event root"
    selector -> any css selector
```

Then `hx` uses the `hx-placement` property to define a placement strategy for the response in relation to the `target`.

```
hx-placement
    before -> before selected element
    after -> after selected element
    start -> before descendants
    end -> after descendants
    remove -> remove regardless
    replace -> replace element
    none -> nothing will happen
```

## What about styles and scripts and ???

Nope.

This is it. Simply augmenting default elements for hypermedia experiences.

There is an escape hatch with webcomponents.

A response header `hx-resources` contains a list or urls (or none). This will trigger an asyncronous fetch of any external resources like web components, styles, etc.

```
hx-resources: "uwu.com/components/button.js;..."
```

## bring your own middleware

Create your own hypermedia responses 

## License

`Hx` is released under the BSD 3-Clause License