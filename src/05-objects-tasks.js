/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const props = JSON.parse(json);
  return Object.create(
    proto,
    Object.keys(props).reduce(
      (acc, k) => ({
        ...acc,
        [k]: {
          value: props[k],
          writable: true,
          configurable: true,
          enumerable: true,
        },
      }),
      {},
    ),
  );
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 */

const cssSelectorBuilder = {
  selector: '',
  orderPremissions: {
    elem: true,
    id: true,
    class: true,
    attr: true,
    pseudoClass: true,
    pseudoElem: true,
  },
  element(value) {
    if (!this.orderPremissions.elem) {
      throw Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    if (this.selector.length) {
      throw Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    return Object.create(cssSelectorBuilder, {
      selector: {
        value: `${this.selector}${value}`,
        writable: true,
        configurable: true,
        enumerable: true,
      },
      orderPremissions: {
        value: {
          elem: true,
          id: true,
          class: true,
          attr: true,
          pseudoClass: true,
          pseudoElem: true,
        },
        writable: true,
        configurable: true,
        enumerable: true,
      },
    });
  },

  id(value) {
    if (this.selector.includes('#')) {
      throw Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    if (!this.orderPremissions.id) {
      throw Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    return Object.create(cssSelectorBuilder, {
      selector: {
        value: `${this.selector}#${value}`,
        writable: true,
        configurable: true,
        enumerable: true,
      },
      orderPremissions: {
        value: {
          elem: false,
          id: false,
          class: true,
          attr: true,
          pseudoClass: true,
          pseudoElem: true,
        },
        writable: true,
        configurable: true,
        enumerable: true,
      },
    });
  },

  class(value) {
    if (!this.orderPremissions.class) {
      throw Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    return Object.create(cssSelectorBuilder, {
      selector: {
        value: `${this.selector}.${value}`,
        writable: true,
        configurable: true,
        enumerable: true,
      },
      orderPremissions: {
        value: {
          elem: false,
          id: false,
          class: true,
          attr: true,
          pseudoClass: true,
          pseudoElem: true,
        },
        writable: true,
        configurable: true,
        enumerable: true,
      },
    });
  },

  attr(value) {
    if (!this.orderPremissions.attr) {
      throw Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    return Object.create(cssSelectorBuilder, {
      selector: {
        value: `${this.selector}[${value}]`,
        writable: true,
        configurable: true,
        enumerable: true,
      },
      orderPremissions: {
        value: {
          elem: false,
          id: false,
          class: false,
          attr: true,
          pseudoClass: true,
          pseudoElem: true,
        },
        writable: true,
        configurable: true,
        enumerable: true,
      },
    });
  },

  pseudoClass(value) {
    if (!this.orderPremissions.pseudoClass) {
      throw Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    return Object.create(cssSelectorBuilder, {
      selector: {
        value: `${this.selector}:${value}`,
        writable: true,
        configurable: true,
        enumerable: true,
      },
      orderPremissions: {
        value: {
          elem: false,
          id: false,
          class: false,
          attr: false,
          pseudoClass: true,
          pseudoElem: true,
        },
        writable: true,
        configurable: true,
        enumerable: true,
      },
    });
  },

  pseudoElement(value) {
    if (this.selector.includes('::')) {
      throw Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    if (!this.orderPremissions.pseudoElem) {
      throw Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    return Object.create(cssSelectorBuilder, {
      selector: {
        value: `${this.selector}::${value}`,
        writable: true,
        configurable: true,
        enumerable: true,
      },
      orderPremissions: {
        value: {
          elem: false,
          id: false,
          class: false,
          attr: false,
          pseudoClass: false,
          pseudoElem: false,
        },
        writable: true,
        configurable: true,
        enumerable: true,
      },
    });
  },

  combine(selector1, combinator, selector2) {
    return Object.create(cssSelectorBuilder, {
      selector: {
        value: `${
          this.selector
        }${selector1.stringify()} ${combinator} ${selector2.stringify()}`,
        writable: true,
        configurable: true,
        enumerable: true,
      },
      orderPremissions: {
        value: selector2.orderPremissions,
        writable: true,
        configurable: true,
        enumerable: true,
      },
    });
  },

  stringify() {
    return this.selector;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
