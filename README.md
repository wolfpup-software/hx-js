# hx-js

A hypermedia extension for the browser.

## semantics

Augment the default `<a>` and `<form>` elements to create rich hypermedia experiences in the browser.

```html
<a hx href="/some/url" target="selector" placement="replace">
    click me!
</a>

<form hx action="/some/form/url" method="post" target="selector" placement="before">
    <input type="submit">
</form>
```

Add the `hx` attribute to any `<anchor>` or `<form>` element.

target
    selector: any css selector
    _self
    _parent
    _top

placement
    start
    end
    before
    after
    first-child
    last-child
    remove
    replace

## bring your own middleware

Create your own hypermedia responses 