# hx-request

`Hx-request` callbacks dispatch `hx-request` events.

## events

`hx-request`
- e.target -> the `anchor` or `form` element
- e.currentTarget -> the element listening for interactions, assumed to be a `body` or `shadow root`
- e.sourceEvent -> the `DOM` event triggering an `hx-request` event

## about

`Hx-request` defines a barrier between hypertext requests and their responses with DOM `events`.

Hacker pups can tailor their own `hx-request` callbacks to fetch custom responses.

WOOOF!
