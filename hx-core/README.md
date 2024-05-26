# hx-core

`Hx-core` callbacks dispatch `hx-request` events.

## events

`hx-request`
- e.target -> the `anchor` or `form` element
- e.currentTarget -> the "root" element, assumed to be a `body` or `shadow root`
-e.originalEvent -> the `DOM` event triggering an `hx-request` event

## why

`Hx-core` separates a hypermedia request from the a hypermedia response by using DOM `events`.

Hacker pups can tailor their own response to an `hx-event`.

It also avoids "espressive" apis and middleware gymnastics.
