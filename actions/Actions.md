# Actions

Action events allow developers to declaratively interact with local javascript through html.

## Syntax

Actions events are declared by attributes with the following syntax: `_event="action"`.

```html
<button _click="increment">+1</button>
<button _click="decrement">+1</button>

<form _submit="update_state" _submit_prevent-default>
	<input />
	<input type="submit" />
</form>
```

## Bubbles Paths

Actions follow a similar logic to events, bubbling from a source element to the document.

Action behavior can be modified with the following syntax:

- `_event_prevent_default` to call `e.preventDefault()` on the source event
- `_event_stop_propagation` to call to stop searching for actions in the composed path of a source event

This helps developers control action order and correlate multiple actions to one event type.

In the following example hx will:

- listen for submit events
- call `e.preventDefault()` on the `submit` event
- dispatch an action event from the form element
- stop looking for `submit` actions on the composed path of the submit event
- fail to dispatch the `update_state_one_more_time` action on `submit`

```html
<section _submit="update_state_one_more_time">
	<form _submit="update_state" _submit_stop-propagation _submit_prevent-default>
		<input value="UwU" />
		<button type="submit">yus</button>
	</form>
</section>
```
