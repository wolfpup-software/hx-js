# hx-request

`Hx-request` callbacks dispatch `hx-request` events.

## events

`hx-request`
- e.target -> the `anchor` or `form` element
- e.currentTarget -> the element listening for interactions, assumed to be a `body` or `shadow root`
- e.sourceEvent -> the `DOM` event triggering an `hx-request` event

## about

`Hx-request` events define a barrier between hypermedia requests and their responses with DOM `events`.

Hacker pups can tailor their own response to `hx-request` event without "espressive" apis and middleware gymnastics.

WOOOF!
