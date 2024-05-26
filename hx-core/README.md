# hx-core

`Hx-core` callbacks dispatch `hx-anchor` and `hx-submit` events.

## events

`hx-event`
- e.target -> the `anchor` element
- e.currentTarget -> the "root" element, assumed to be a `body` or `shadow root`
-e.originalEvent -> the `DOM` event triggering an `hx-anchor` event

## why

`Hx-core` separates a hypermedia request from the a hypermedia response by using DOM `events`.

Hacker pups can tailor their own response to an `hx-event`.

It also avoids "espressive" apis and middleware gymnastics.
