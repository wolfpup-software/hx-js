# hx-js

A hypermedia extension for the browser.

## hx-core

Augment the default `<a>` and `<form>` elements to create rich hypermedia experiences in the browser.

```html
<a href="/some/url" target="selector" hx-placement="before">
    click me!
</a>

<form action="/some/form/url" method="post" target="selector" hx-placement="replace">
    <input type="submit">
</form>
```

Add the `hx-placement` attribute to `<a>` or `<form>` element to send an `hx-anchor` or `hx-form` event.

## hx-callbacks

`Hx` uses the `target` property to query an `element`.

```
target -> event language?
    _self -> the anchor or form element
    selector -> any css selector used on a document, shadow dom, or html element
```

Then `hx` uses the `hx-placement` property to define a placement strategy for the response in relation to the `target`.

```
hx-placement
    none -> nothing will happen
    before -> before selected element
    after -> after selected element
    start -> before descendants
    end -> after descendants
    remove -> remove regardless
    replace -> replace element
```

## License

`Hx-js` is released under the BSD 3-Clause License