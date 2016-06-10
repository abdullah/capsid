const {expect} = require('chai')
const {div} = require('dom-gen')
const $ = jQuery

/**
 * @param {Function} decorator The decorator
 * @param {Function} cls The class
 * @param {string} key The key of the method to decorate
 */
function callDecorator(decorator, cls, key) {
  const descriptor = Object.getOwnPropertyDescriptor(cls.prototype, key)
  const result = decorator(cls.prototype, key, descriptor)
  Object.defineProperty(cls.prototype, key, result || descriptor)
}

describe('@event(event, selector)', () => {

  it('binds event handlers if the event decorators are present', done => {
    class Class3 {
      handler() {
        done()
      }
    }

    callDecorator($.cc.event('click', '.inner'), Class3, 'handler')

    $.cc('elem-test3', Class3)

    const elem = $('<div class="elem-test3"><span class="inner"></span></div>').appendTo('body')

    $.cc.init('elem-test3')

    elem.find('.inner').trigger('click')
  })

})

describe('@on(event)', () => {
  it('registers the method as the event listener of the given event name', done => {
    class OnTest0 {
      handler() { done() }
    }
    $.cc('on-test0', OnTest0)
    callDecorator($.cc.on('click'), OnTest0, 'handler')

    div().cc('on-test0').trigger('click')
  })
})

describe('@on(event).at(selector)', () => {
  it('registers the method as the event listener of the given event name and selector', done => {
    class OnAtTest0 {
      foo() { done() }
      bar() { done(new Error('bar should not be called')) }
    }
    $.cc('on-at-test0', OnAtTest0)
    callDecorator($.cc.on('foo-event').at('.inner'), OnAtTest0, 'foo')
    callDecorator($.cc.on('bar-event').at('.inner'), OnAtTest0, 'bar')

    const elem = div(div({addClass: 'inner'})).cc('on-at-test0')

    elem.trigger('bar-event')
    elem.find('.inner').trigger('foo-event')
  })
})

describe('@emit(event)', () => {
  it('makes the method emits the event', done => {
    class EmitTest0 {
      foo() {}
    }
    $.cc('emit-test0', EmitTest0)
    callDecorator($.cc.emit('event-foo'), EmitTest0, 'foo')

    div().on('event-foo', () => done()).cc.init('emit-test0').foo()
  })
})

describe('@emit(event).first', () => {
  it('makes the method emits the event', done => {
    class EmitFirstTest0 {
      foo() {}
    }
    $.cc('emit-first-test0', EmitFirstTest0)
    callDecorator($.cc.emit('event-foo').first, EmitFirstTest0, 'foo')

    div().on('event-foo', () => done()).cc.init('emit-first-test0').foo()
  })
})

describe('@emit(event).last', () => {
  it('makes the method emit the event with the returned value', done => {
    class EmitLastTest0 {
      foo() {
        return 321
      }
    }
    $.cc('emit-last-test0', EmitLastTest0)
    callDecorator($.cc.emit('event-foo').last, EmitLastTest0, 'foo')

    div().on('event-foo', (e, param) => {
      expect(param).to.equal(321)

      done()
    }).cc.init('emit-last-test0').foo()
  })

  it('makes the method emit the event with the resolved value after the promise resolved', done => {
    let promiseResolved = false

    class EmitLastTest1 {
      foo() {
        return new Promise(resolve => {
          setTimeout(() => {
            promiseResolved = true
            resolve(123)
          }, 100)
        })
      }
    }
    $.cc('emit-last-test1', EmitLastTest1)
    callDecorator($.cc.emit('event-foo').last, EmitLastTest1, 'foo')

    div().on('event-foo', (e, param) => {
      expect(promiseResolved).to.be.true
      expect(param).to.equal(123)

      done()
    }).cc.init('emit-last-test1').foo()
  })
})

describe('@emit(event).on.error', () => {
  it('makes the method emit the event with the error as the parameter when the method throws', done => {
    class EmitOnErrorTest0 {
      foo() {
        throw new Error('abc')
      }
    }
    $.cc('emit-on-error-test0', EmitOnErrorTest0)
    callDecorator($.cc.emit('event-foo').on.error, EmitOnErrorTest0, 'foo')

    div().on('event-foo', (e, err) => {
      expect(err).to.be.instanceof(Error)
      expect(err.message).to.equal('abc')

      done()
    }).cc.init('emit-on-error-test0').foo()
  })

  it('makes the method emit the event with the error as the parameter when the method returns rejected promise', () => {
    let promiseRejected = true

    class EmitOnErrorTest1 {
      foo() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            promiseRejected = true

            reject(new Error('abc'))
          }, 100)
        })
      }
    }
    $.cc('emit-on-error-test1', EmitOnErrorTest1)
    callDecorator($.cc.emit('event-foo').on.error, EmitOnErrorTest1, 'foo')

    div().on('event-foo', (e, err) => {
      expect(err).to.be.instanceof(Error)
      expect(err.message).to.equal('abc')
      expect(promiseRejected).to.be.true

      done()
    }).cc.init('emit-on-error-test1').foo()
  })
})

describe('@component(className)', () => {
  it('works as a class decorator and registers the class as a class component of the given name', () => {
    class Cls {
      constructor(elem) {
        elem.attr('this-is', 'decorated-component')
      }
    }

    $.cc.component('decorated-component')(Cls)

    const elem = $('<div />')

    elem.cc.init('decorated-component')

    expect(elem.attr('this-is')).to.equal('decorated-component')
  })
})

describe('@trigger(start, end, error)', () => {
  it('prepends the trigger of the start event to the method', done => {
    class Class4 {
      method() {}
    }

    callDecorator($.cc.trigger('class4-start'), Class4, 'method')

    $.cc('class4', Class4)

    const elem = $('<div />').cc('class4').appendTo('body')

    $('body').on('class4-start', () => done())

    elem.cc.get('class4').method()
  })

  it('appends the trigger of the end event to the method', done => {
    class Class5 {
      method() {
        return new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    callDecorator($.cc.trigger(null, 'class5-ended'), Class5, 'method')

    $.cc('class5', Class5)

    const elem = $('<div />').cc('class5').appendTo('body')

    let flag = false

    setTimeout(() => {
      flag = true
    }, 100)
    setTimeout(() => {
      flag = false
    }, 300)

    $('body').on('class5-ended', () => {
      expect(flag).to.be.true
      done()
    })

    elem.cc.get('class5').method()
  })

  it('appends the trigger of the error event to the method', done => {
    class Class6 {
      method() {
        return new Promise((resolve, reject) => setTimeout(() => reject(new Error()), 200))
      }
    }

    callDecorator($.cc.trigger(null, null, 'class6-error'), Class6, 'method')

    $.cc('class6', Class6)

    const elem = $('<div />').cc('class6').appendTo('body')

    let flag = false

    setTimeout(() => {
      flag = true
    }, 100)
    setTimeout(() => {
      flag = false
    }, 300)

    $('body').on('class6-error', () => {
      expect(flag).to.be.true
      done()
    })

    elem.cc.get('class6').method()
  })
})