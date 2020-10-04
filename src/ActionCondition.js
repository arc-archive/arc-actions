import { ArcAction } from './ArcAction.js';
import { RequestDataExtractor } from './runner/RequestDataExtractor.js';
import { checkCondition } from './runner/ConditionRunner.js';
import { mapActions } from './Utils.js';
import { recursiveDeepCopy } from './Copy.js';

/** @typedef {import('./types').ConditionSchema} ConditionSchema */
/** @typedef {import('./types').ArcActionsOptions} ArcActionsOptions */
/** @typedef {import('./types').ConditionSourceEnum} ConditionSourceEnum */
/** @typedef {import('./types').OperatorEnum} OperatorEnum */

/**
 * A class that represents ARC condition that runs actions when the condition is met.
 */
export class ActionCondition {
  /**
   * Creates a default value for a condition.
   * @param {string} [defType='response'] The type of the condition.
   * @return {ConditionSchema}
   */
  static defaultCondition(defType='response') {
    const source = 'url';
    const operator = 'equal';
    const type = defType;
    const result = {
      type,
      alwaysPass: true,
      source,
      operator,
      value: '',
      view: {
        opened: true,
      }
    };
    return result;
  }

  /**
   * Creates a list of actions from an external source.
   *
   * @param {any[]} actions
   * @return {ActionCondition[]}
   */
  static importExternal(actions) {
    if (!Array.isArray(actions)) {
      return [];
    }
    return actions.map((item) => ActionCondition.importAction(item));
  }

  /**
   * @param {any} item
   * @return {ActionCondition} Instance of ArcActions from passed values.
   */
  static importAction(item) {
    const { condition = ActionCondition.defaultCondition(), type = 'request', actions, enabled } = item;
    return new ActionCondition(condition, type, {
      actions,
      enabled,
    });
  }

  /**
   * @param {ConditionSchema} condition The condition definition
   * @param {string} type The type of actions held in the `actions`. Either `request` or `response`.
   * @param {ArcActionsOptions} [opts={}] Optional parameters
   */
  constructor(condition, type, opts={}) {
    /**
     * @type {ConditionSchema}
     */
    this.condition = condition;
    /**
     * @type {string}
     */
    this.type = type;
    /**
     * @type {ArcAction[]}
     */
    this.actions = mapActions(opts.actions);
    /**
     * @type {boolean}
     */
    this.enabled = opts.enabled || false;
  }

  /**
   * Tests whether the condition is satisfied for request and/or response.
   *
   * @param {Object} request The ARC request object.
   * @param {Object=} response The ARC response object, if available.
   * @return {boolean} True when the condition is satisfied.
   */
  satisfied(request, response) {
    if (!this.enabled) {
      return false;
    }
    if (!this.condition.alwaysPass === true) {
      return true;
    }
    const extractor = new RequestDataExtractor({
      request,
      response,
      path: this.condition.source,
    });
    const value = extractor.extract();
    return checkCondition(value, this.condition.operator, this.condition.value);
  }

  /**
   * Adds a new, empty action to the list of actions.
   * If actions list hasn't been initialized then it creates it.
   *
   * @param {String} name The name of the action to add.
   */
  add(name) {
    if (!Array.isArray(this.actions)) {
      this.actions = [];
    }
    const { type } = this;
    const action = new ArcAction({ name, type });
    this.actions.push(action);
  }

  /**
   * Makes a clone of the condition with actions.
   * @returns {ActionCondition} A deep copy of this object.
   */
  clone() {
    const init = recursiveDeepCopy(this);
    const copy = new ActionCondition(init.condition, init.type);
    copy.actions = init.actions;
    copy.enabled = init.enabled;
    return copy;
  }
}
