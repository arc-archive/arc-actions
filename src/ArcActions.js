/** @typedef {import('./types').ActionsCondition} ActionsCondition */
/** @typedef {import('./types').ArcActionsOptions} ArcActionsOptions */
/** @typedef {import('./types').ConditionSourceEnum} ConditionSourceEnum */
/** @typedef {import('./types').OperatorEnum} OperatorEnum */
/** @typedef {import('./types').ActionTypeEnum} ActionTypeEnum */

import { ArcAction } from './ArcAction.js';
import { RequestDataExtractor } from './runner/RequestDataExtractor.js';
import { checkCondition } from './runner/ConditionRunner.js';
import { mapActions } from './Utils.js';

/**
 * A class that represents ARC actions that run after meeting a condition.
 */
export class ArcActions {
  /**
   * Creates a default value for a condition.
   * @param {string} [defType='response'] The type of the condition.
   * @return {ActionsCondition}
   */
  static defaultCondition(defType='response') {
    const source = /** @type ConditionSourceEnum */ ('url');
    const operator = /** @type OperatorEnum */ ('equal');
    const type = /** @type ActionTypeEnum */ (defType);
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
   * @param {object[]} actions
   * @return {ArcActions[]}
   */
  static importExternal(actions) {
    if (!Array.isArray(actions)) {
      return [];
    }
    return actions.map((item) => ArcActions.importAction(item));
  }

  /**
   * @param {object} item
   * @return {ArcActions} Instance of ArcActions from passed values.
   */
  static importAction(item) {
    const { condition = ArcActions.defaultCondition(), type = 'request', actions, enabled } = item;
    return new ArcActions(condition, type, {
      actions,
      enabled,
    });
  }

  /**
   * @param {ActionsCondition} condition The condition definition
   * @param {string} type The type of actions held in the `actions`. Either `request` or `response`.
   * @param {ArcActionsOptions} [opts={}] Optional parameters
   */
  constructor(condition, type, opts={}) {
    /**
     * @type {ActionsCondition}
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
}
