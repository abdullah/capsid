/**
 * class-component.js v11.0.1
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
import './decorators.js'
import {register as cc, init, ccc} from './class-component-manager.js'
import assert from './assert.js'
import $ from './jquery.js'
import {COELEMENT_DATA_KEY_PREFIX} from './const'

// Initializes the module object.
if (!$.cc) {
  $.cc = cc

  cc.init = init

  // Expose __ccc__
  cc.__ccc__ = ccc

  // Defines the special property cc on the jquery prototype.
  Object.defineProperty($.fn, 'cc', {get () {
    const elem = this
    const dom = elem[0]

    assert(dom, 'cc (class-component context) is unavailable at empty dom selection')

    let cc = dom.cc

    if (!cc) {
      /**
       * Initializes the element as class-component of the given names. If the names not given, then initializes it by the class-component of the class names it already has.
       * @param {string} classNames The class component names
       * @return {jQuery}
       */
      cc = classNames => {
        (typeof classNames === 'string' ? classNames : dom.className).split(/\s+/).forEach(className => {
          if (ccc[className]) {
            elem.addClass(className)
            ccc[className](dom)
          }
        })

        return elem
      }
      dom.cc = cc

      /**
       * Gets the coelement of the given name.
       * @param {String} coelementName The name of the coelement
       * @return {Object}
       */
      cc.get = coelementName => {
        const coelement = dom[COELEMENT_DATA_KEY_PREFIX + coelementName]

        assert(coelement, 'no coelement named: ' + coelementName + ', on the dom: ' + dom.tagName)

        return coelement
      }

      cc.init = className => cc(className).cc.get(className)
    }

    return cc
  }})
}
