# Actions

Actions are the value of an event attribute that loos like this: `_event_`.

## Syntax

Hx can listen for events like `click` and `keydown`.

```html
<button _click_="increment_count">+1</button>

<a _click_="decrement_count">+1</a>

<form _submit_="update_form">
	<input />
	<input type="submit" />
</form>
```

## Composed Paths

```html
<section _click_="do_something_else!">
	<button _click_="increment"></button>
	<button _click_="decrement"></button>
</section>
```

```html
<section _submit_="update_forms">
	<form _submit_="submit the form!">
		<input type="checkbox" _input_="increment"></button>
		<button type="submit" _click_="decrement"></button>
	</form>
</section>
```
