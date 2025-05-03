# Actions

Action events allow developers to interact with local javascript through html.


## Syntax

Actions events are declared by adding an attribute with the following syntax: `_event_="action"`.

```html
<button _click="increment">+1</button>
<button _click="decrement">+1</button>

<form _submit="update_form">
	<input>
	<input type="submit">
</form>
```

## Composed Paths

In the following example:
- the action event will call `e.preventPropagation()`
- the action event will call `e.preventDefault()`
- the "update_forms_again" action will not be dispatched on `submit`

```html
<section _submit="update_forms_again">
	<form _submit="submit the form!" _submit_stop-propagation _submit_prevent-default>
		<button type="submit"></button>
	</form>
</section>
```
