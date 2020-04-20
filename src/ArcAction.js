// https://www.measurethat.net/Benchmarks/ShowResult/25487
function recursiveDeepCopy(obj) {
  return Object.keys(obj).reduce(
    (v, d) =>
      Object.assign(v, {
        [d]: obj[d].constructor === Object ? recursiveDeepCopy(obj[d]) : obj[d]
      }),
    {}
  );
}

/** @typedef {import('./EditorMixins/SetCookieEditorMixin.js').SetCookieConfig} SetCookieConfig */
/** @typedef {import('./EditorMixins/DeleteCookieEditorMixin.js').DeleteCookieConfig} DeleteCookieConfig */
/** @typedef {import('./EditorMixins/SetVariableEditorMixin.js').SetVariableConfig} SetVariableConfig */
/** @typedef {import('./Utils.js').SupportedActions} SupportedActions */

/**
 * @typedef {Object} ArcActionViewConfiguration
 * @property {?boolean} [opened=true] Whether the action is "opened" in the editor UI.
 */

/**
 * @typedef {Object |
 *  SetCookieConfig |
 *  SetVariableConfig |
 *  DeleteCookieConfig} ActionConfiguration
 */

/**
 * @typedef {Object} ArcActionConfiguration
 * @property {TypeEnum} [type=TypeEnum.request] Type of the action.
 * Can be either `request` or `response`. Default to request.
 * @property {?SupportedActions} [name=null] Action name. Default to `null` which is unknown action.
 * @property {?boolean} [enabled=false] Whether the action is enabled. `false` by default.
 * @property {?number} [priority=5] Execution priority.
 * @property {ActionConfiguration} [config={}] Action configuration.
 * Depends on `name`.
 * @property {?boolean} [sync=true] Whether or not the action is executed synchronously to request / response
 * @property {?boolean} [failOnError=true]]
 * @property {?ArcActionViewConfiguration} [view={ opened: true }] View configuration unrelated to action logic.
 */

/**
 * Enum for action type
 * @readonly
 * @enum {string}
 */
export const TypeEnum = {
  request: 'request',
  response: 'response'
};

/**
 * A class describing a runnable action in Advanced REST Client.
 *
 * The difference to using regular object is that it contains utility methods
 * for generating JSON and cloning the object.
 *
 * @module src/ArcAction
 */
export class ArcAction {
  /**
   * @param {?ArcActionConfiguration} init The initialization object with predefined values
   */
  constructor(init = {}) {
    const {
      type = TypeEnum.request,
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
    /**
     * Type of the action. Can be either `request` or `response`. Default to
     * request.
     * @type {TypeEnum}
     */
    this.type = type;
    /**
     * Action name.
     * @type {SupportedActions}
     */
    this.name = name;
    /**
     * Whether the action is enabled.
     * @type {boolean}
     */
    this.enabled = enabled;
    /**
     * Action priority
     * @type {number}
     */
    this.priority = priority;
    /**
     * Action configuration
     * @type {SetCookieConfig|SetVariableConfig|DeleteCookieConfig}
     */
    this.config = config;
    /**
     * Whether or not the action is executed synchronously to request / response
     * @type {boolean}
     */
    this.sync = sync;
    /**
     * Whether or not the request should fail when the action fails.
     * @type {boolean}
     */
    this.failOnError = failOnError;
    /**
     * @type {ArcActionViewConfiguration}
     */
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
