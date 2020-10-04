import { recursiveDeepCopy } from './Copy.js';

/** @typedef {import('./types').SetCookieConfig} SetCookieConfig */
/** @typedef {import('./types').DeleteCookieConfig} DeleteCookieConfig */
/** @typedef {import('./types').SetVariableConfig} SetVariableConfig */
/** @typedef {import('./types').ActionConfiguration} ActionConfiguration */
/** @typedef {import('./types').ArcActionViewConfiguration} ArcActionViewConfiguration */
/** @typedef {import('./types').ArcActionConfiguration} ArcActionConfiguration */

/**
 * A class describing a runnable action in Advanced REST Client.
 */
export class ArcAction {
  /**
   * @param {ArcActionConfiguration} init The initialization object with predefined values
   */
  constructor(init) {
    const {
      type = 'request',
      name = null,
      enabled = false,
      priority = 5,
      config = {},
      sync = true,
      failOnError = true,
      view = {
        opened: true,
      },
    } = init;
    /**
     * Type of the action. Can be either `request` or `response`. Default to
     * request.
     * @type {string}
     */
    this.type = type;
    /**
     * Action name.
     * @type {string}
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
     * @type {ActionConfiguration}
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
