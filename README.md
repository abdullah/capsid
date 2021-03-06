<img src="http://capsidjs.github.io/capsid/asset/capsid.svg" />

[![Circle CI](https://circleci.com/gh/capsidjs/capsid.svg?style=svg)](https://circleci.com/gh/capsidjs/capsid)
[![codecov.io](https://codecov.io/github/capsidjs/capsid/coverage.svg?branch=master)](https://codecov.io/github/capsidjs/capsid?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![bitHound Overall Score](https://www.bithound.io/github/capsidjs/capsid/badges/score.svg)](https://www.bithound.io/github/capsidjs/capsid)
[![npm](https://img.shields.io/npm/v/capsid.svg)](https://npm.im/capsid)

> Class driven component framework

`capsid` is a framework for creating UI Component based on HTML classes.

`capsid` supposes the use of MVP design pattern. Components work as Presenter and Dom Elements work as (Passive) View of MVP. See the below for details.

`capsid` doesn't suppose the use of virtual dom for updating the dom tree, rather it recommends updating dom using native DOM API.

# Features

- It's an **UI framework**.
- Works well with **real** DOM APIs. Plays nice with `jQuery` or `Umbrella`.
- **no virtual dom, no template, no rendering**
- **small APIs**: 6 apis & 4 decorators
- **small size**: **1.2KB** gzipped

# Hello world

The hello world example:

```html
<script src="path/to/capsid"></script>
<script>
class Hello {
  __init__ () {
    this.el.textContent = 'Hello, world!'
  }
}

capsid.def('hello', Hello)
</script>

<span class="hello"></span>
```

[See working example](https://codepen.io/kt3k/pen/MmYxBB?editors=1010)

When you *define* the component, then dom elements which has `hello` class is automatically mounted by Hello component and becomes Hello component.

# The timer

The timer example:

```html
<span class="timer"></span>

<script src="https://unpkg.com/capsid"></script>
<script>
class Timer {
  __init__ () {
    this.secondsElapsed = 0
    this.start()
  }

  // Starts the timer
  start () {
    this.interval = setInterval(() => { this.tick() }, 1000)
  }

  // Ticks the timer
  tick () {
    this.secondsElapsed++
    this.el.textContent = `Seconds Elapsed: ${this.secondsElapsed}`
  }

  // Stops the timer
  stop () {
    clearInterval(this.interval)
  }
}

capsid.def('timer', Timer)
</script>
```

See [the working demo](https://capsidjs.github.io/capsid/demo/timer.html).

# The concept

See [Component and Coelement](http://capsidjs.github.io/capsid/basics/component.html) section of the document.

# :cd: Install

## Via npm

    npm install --save capsid

then:

```js
const capsid = require('capsid')
```

## Via file

Download [capsid.min.js](https://unpkg.com/capsid@0.8.1/dist/capsid.min.js) Then:

```html
<script src="path/to/capsid.js"></script>
```

In this case, the library exports the global variable `capsid`.

```js
window.capsid.def('timer', Timer)
```

# APIs

```js
const capsid = require('capsid')
```

- `capsid.def(name, constructor)`
  - Registers class-component.
- `capsid.prep(name[, element])`
  - Initialize class-component on the given range.
- `capsid.init(name, element)`
  - Initializes the element with the class-component of the given name.
- `capsid.make(name, element)`
  - Initializes the element with the class-component of the given name and return the coelement instance.
- `capsid.get(name, element)`
  - Gets the coelement instance from the given element.

## `capsid` namespace

### `capsid.def(name, constructor)`

- @param {string} name The class name of the component
- @param {Function} constructor The constructor of the coelement of the component

This registers `constructor` as the constructor of the coelement of the class component of the given name `name`. The constructor is called with a jQuery object of the dom as the first parameter and the instance of the coelement is attached to the dom. The instance of coelement can be obtained by calling `elem.cc.get(name)`.

Example:

```js
class TodoItem {
  // ...behaviours...
}

capsid.def('todo-item', TodoItem)
```

```html
<li class="todo-item"></li>
```

### `capsid.prep([name], [element])`

- @param {string} [name] The class-component name to intialize
- @param {HTMLElement} [element] The range to initialize

This initializes the class components of the given name under the given element. If the element is omitted, it initializes in the entire page. If the name is omitted, then it initializes all the registered class components in the given range.

### `capsid.init(name, element)`

- @param {string} name The class-component name to initialize
- @param {HTMLElement} element The element to initialize

Initializes the element as the class-component.

```js
capsid.init('timer', dom)
```

The above initializes `dom` as `timer` class-component.

### `capsid.make(name, element)`

- @param {string} name The class-component name to initialize
- @param {HTMLElement} element The element to initialize

Initializes the element as the class-component (the same as `init`) and returns the coelement instance.

```js
const timer = make('timer', dom)
```

### `capsid.get(name, element)`

- @param {string} name The class-component name to get
- @param {HTMLElement} element The element
- @return The coelement instance

Gets the coelement instance from the element.

```js
const timer = capsid.get('timer', dom)
```

The above gets `Timer` class instance (coelement) from dom. In this case, dom need to be initialized as `timer` class-component before this call.


# Decorators

There are 4 decorators.

- `@component`
  - optionally `@component(name)`
- `@on(event, {at})`
- `@emit(event)`
  - optionally `@emit.last(event)`
- `@wire`
  - optionally `@wire(name, [selector])`

## `@component(className)`

capsid.component(className) is class decorator. With this decorator, you can regiter the js class as class component.

This is a shorthand of `capsid.def('component', Component)`.

```js
const { component } = require('capsid')

@component('timer')
class Timer {
  ...definitions...
}
```

The above registers `Timer` class as `timer` component.

## `@component`

`@component` is similar to the above. This decorator registers the js class as the class component of the same name. If the js class is in `CamelCase`, then the component name is made `kebab-cased`.

```js
const { component } = require('capsid')

@component
class Timer {} // This registers Timer class as `timer` component

@component
class FooBar {} // This registers FooBar class as `foo-bar` component
```

## `@on(eventName)`

`@on` is a method decorator. With this decorator, you can register the method as the event handler of the element.

```js
const { on } = capsid

class FooButton {

  @on('click')
  onClick (e) {
    ...definitions...
  }
}

capsid.def('foo-btn', FooButton)
```

The above binds `onClick` method to its element's 'click' event automatically.

The above is equivalent of:

```js
class FooButton {
  __init__ () {
    this.el.addEventListener('click', e => {
      this.onClick(e)
    })
  }

  onClick (e) {
    ...definitions...
  }
}

capsid.def('foo-btn', FooButton)
```

## `@on(name, { at: selector })`

`@on(name, { at: selector })` is a method decorator. It's similar to `@on`, but it only handles the event from `selector` in the component.

```js
const { on } = capsid

class Btn {
  @on('click', { at: '.btn' })
  onBtnClick (e) {
    ...definitions...
  }
}

capsid.def('btn', Btn)
```

In the above example, `onBtnClick` method listens to the click event of the `.btn` element in the `Btn`'s element.

## `@emit(startEvent)`

`@emit()` is a method decorator. This decorator makes the method trigger the given event at the start of the method. The first parameter of the method is passed as event.detail object.

```js
const { emit, def } = require('capsid')

class Manager {
  @emit('manager.started')
  start () {
    ...definitions...
  }
}

def('manager', Manager)
```

The above `start` method automatically triggers `manager.started` event at the begining of the method process.

The above is equivalent of:

```js
class Manager {
  start () {
    this.$el.trigger('manager.started', arguments)
    ...definitions...
  }
}

capsid.def('manager', Manager)
```

## `@emit.last(eventName)`

`@emit.last(eventName)` is similar to `@emit()`, but it triggers the event at the last of the method.

```js
const { emit, def } = require('capsid')

class Manager {
  @emit.last('manager.ended')
  start() {
    ...definitions...
  }
}

def('manager', Manager)
```

In the above example, `start` method triggers the `manager.ended` event when it finished. The returns value of the method is passed as the second arguments of the event handler.

If the method returns a promise, then the event is triggered after the promise is resolved.

```js
const { emit, def } = require('capsid')

class Manager {
  @emit.last('manager.ended')
  start () {
    ...definitions...

    return promise
  }
}

def('manager', Manager)
```

In the above example, `manager.ended` event is triggered after `promise` is resolved. The resolved value of the promise is passed as the second argument of the event handler.

## `@wire`

`@wire` is a getter decorator. If a getter is decorated by this, it returns the class component of the name of the decorated method.

```js
const { wire, component } = require('class-component')

@component
class Foo {
  @wire get bar () {}

  processBar () {
    this.bar.process()
  }
}

@component
class Bar {
  process () {
    console.log('processing bar!')
  }
}

$('body').append('<div class="foo"><div class="bar"></div></div>')
```

In the above situation, the getter `bar` of Foo class is wired to `bar` component inside the foo component. Technically accessing `bar` property almost equals to the call of `this.$el.find('.bar').cc.get('bar')`. With the above settings you can call the following:

```js
$('.foo').cc.get('foo').processBar()
```

And the above prints `processing bar!`.

When the decorated getter name is in `CamelCase`, then it's replaced by the `kebab-cased` version. For example, the expression `@wire get primaryButton` wires to `primary-button` component, not to `primaryButton` component. If you need to wire it to `primaryButton` component, then use the one below.

## `@wire(className)`

This is also a getter decorator. The difference is that `@wire(className)` specify the wired class component name explicitly (`className`).

```js
const { wire, component } = require('capsid')

@component
class Foo {
  @wire('long-name-component') get it () {}
}

@component
class LongNameComponent {
  process () {
    console.log('processing long name component!')
  }
}

$('body').append('<div class="foo"><div class="long-name-component"></div></div>')
```

With the above settings, you can call the following:

```js
$('.foo').cc.get('foo').it.process()
```

And this prints `processing long name component`.

`@wire` and `@wire(name)` decorators are convenient when you nest the class components and parents ask children do the jobs.

# Plugins

## jQuery Plugin

To use Capsid jQuery plugin, do the following:

```
const $ = require('jquery')
const capsid = require('capsid')

require('capsid/jquery')(capsid, $)
```

Then, your components automatically have `this.$el` property and it points the dom element wrapped by jQuery.

By using jQuery plugin, the hello world example is written like the below:

```html
<script src="https://unpkg.com/jquery"></script>
<script src="https://unpkg.com/capsid"></script>
<script src="https://unpkg.com/capsid/dist/capsid-jquery.js"></script>
<script>
class Hello {
  __init__ () {
    this.$el.text('Hello, world!')
  }
}

capsid.def('hello', Hello)
</script>

<span class="hello"></span>
```

[See the working demo]()

### Plugin APIs

- `$dom.cc(name)`
  - Initializes the element as a component.
- `$dom.cc.get(name)`
  - Gets the coelement of the element.

## `$dom.cc` namespace

These APIs are available via jQuery selection object's `.cc` property like `$('<div />').cc('timer')` or `$('#main').cc.get('app')`.

### `$dom.cc(name)`

- @param {string} name The class-component name to initialize
- @return {jQuery}

This initializes the class-compenents of the given name on the element and returns the element itself.

```js
$('<div />').cc('timer').cc('modal').appendTo('body')
```

The above example creates a `div` element, initializes it as `timer` and `modal` class components, and appends it to the body.

### `$dom.cc()`

This initializes all the class component on the element which it already has. This returns the the element (jquery-wrapped) itself.

```js
$('<div class="timer modal"/>').cc().appendTo('body')
```

The above example is the same as the previous one.

```js
const div = $('<div/>')

classes.forEach(cls => div.addClass(cls))

div.cc().appendTo('body')
```

The above example creates a `div` element and initializes all the classes in `classes` variable on in.

### `$dom.cc.get(name)`

- @param {string} name The class name of the component

This gets the coelement of the component of the given name if exists. It throws if none.

```js
const todoItem = $dom.cc.get('todo-item');

todoItem.update({id: 'milk', title: 'Buy a milk'});
```

## Umbrella JS plugin

TBD

# History

- 2017-03-01   v0.8.0   Modify init sequence.
- 2017-02-26   v0.7.0   Add static capsid object to each coelement class.
- 2017-02-26   v0.6.0   static __init__ rule.
- 2017-02-25   v0.5.0   coelem.capsid, initComponent APIs.
- 2017-01-19   v0.3.0   API reorganization.
- 2017-01-19   v0.2.2   Rename to capsid.
- 2017-01-17   v0.1.1   Add plugin system.

# History of class-component.js (former project)

- 2017-01-02   v13.0.0   Add __init__ instead of init.
- 2017-01-01   v12.1.1   Fix bug of event bubbling.
- 2017-01-01   v12.1.0   Remove @emit.first. Use native dispatchEvent.
- 2016-12-31   v12.0.0   Remove __cc_init__ feature. Add init feature.
- 2016-09-30   v10.7.1   Refactor @emit.last decorator
- 2016-09-11   v10.7.0   Add @on(event, {at}) @emit.first and @emit.last
- 2016-08-22   v10.6.2   Refactor the entrypoint.
- 2016-08-22   v10.6.1   Improved the event listener registration process.
- 2016-08-20   v10.6.0   Cleaned up some private APIs.
- 2016-08-20   v10.5.0   Cleaned up codebase and made the bundle smaller. Remove some private APIs.
- 2016-08-17   v10.4.1   Made built version smaller.
- 2016-08-16   v10.4.0   Switched to babel-preset-es2015-loose.
- 2016-08-16   v10.3.0   Modified bare @wire decorator.
- 2016-08-02   v10.2.0   Added bare @component decorator.
- 2016-07-21   v10.1.0   Added @wire decorator.
- 2016-06-19   v10.0.0   Removed deprecated decorators `@event` and `@trigger`, use `@on` and `@emit` instead.
- 2016-06-09   v9.2.0    Fixed bug of `@emit().last` decorator.

# The user projects

The projects which uses capsid.

- [capsid-todomvc](https://github.com/capsidjs/capsid-todomvc)
  - Implementation of TodoMVC in capsid, 100% unit tested
- [multiflip](https://github.com/kt3k/multiflip)
- [multiflip-bubble](https://github.com/kt3k/multiflip-bubble)
- [puncher](https://github.com/kt3k/puncher)
- [event-hub](https://github.com/capsidjs/event-hub)
- [spn](https://github.com/kt3k/spn)
- [view-todo](https://github.com/kt3k/view-todo)
- [pairs](https://github.com/kt3kstudio/pairs)
  - Pairs is the primary user project and inspiration source of capsid.
  - capsid is basically created for developing this project.

# Notes

## The name

> capsid /ˈkapsəd/ n.
>
> the protein coat or shell of a virus particle, surrounding the nucleic acid or nucleoprotein core.

The purpose of capsid is to encapsulate the details of its contents just like capsid for virus cells. Its has the same origin *capsa* ("box" in Latin) as the word *capsule*.

## Why 'coelement'

`co-` means the dual or the other aspect of something like `cosine` to `sine` `cotangent` to `tangent` etc. Coelement is the other aspect of `element` and it works together in the 1-to-1 relationship and in the same lifecycle with the element.

# License

MIT
