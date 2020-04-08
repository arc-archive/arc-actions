// https://www.measurethat.net/Benchmarks/ShowResult/25487
function recursiveDeepCopy(obj) {
  return Object.keys(obj).reduce((v, d) => Object.assign(v, {
    [d]: (obj[d].constructor === Object) ? recursiveDeepCopy(obj[d]) : obj[d]
  }), {});
}

/**
 * A class describing a runnable action in Advanced REST Client.
 *
 * The difference to using regular object is that it contains utility methods
 * for generating JSON and cloning the object.
 */
export class ArcAction {
  /**
   * @param {Object} init The initialization object with predefined values
   * @param {String} [init.type='request']
   * @param {?String} [init.name=null]
   * @param {?Boolean} [init.enabled=false]
   * @param {?Number} [init.priority=5]
   * @param {?Object} [init.config={}]
   * @param {?Boolean} [init.sync=true]
   * @param {?Boolean} [init.failOnError=true]]
   * @param {?Object} [init.view={ opened: true }={}]
   */
  constructor(init = {}) {
    const {
      type = 'request',
      name = null,
      enabled = false,
      priority = 5,
      config = {},
      sync = true,
      failOnError = true,
      view = {
        opened: true
      }
    } = init;
    this.type = type;
    this.name = name;
    this.enabled = enabled;
    this.priority = priority;
    this.config = config;
    this.sync = sync;
    this.failOnError = failOnError;
    this.view = view;
  }

  /**
   * Returns a clone if this object.
   * @return {ArcAction}
   */
  clone() {
    const init = recursiveDeepCopy(this);
    return new ArcAction(init);
  }
}
