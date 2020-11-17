/* eslint-disable no-param-reassign */
import { ArcAction, mapActions } from './ArcAction.js';
import { RequestDataExtractor } from './runner/RequestDataExtractor.js';
import { checkCondition } from './runner/ConditionRunner.js';
import { recursiveDeepCopy } from './Copy.js';

/** @typedef {import('@advanced-rest-client/arc-types').Actions.RunnableAction} RunnableAction */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.Condition} Condition */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.Action} Action */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.ActionType} ActionType */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ArcBaseRequest} ArcBaseRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ARCSavedRequest} ARCSavedRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ARCHistoryRequest} ARCHistoryRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.TransportRequest} TransportRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.Response} Response */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.ErrorResponse} ErrorResponse */

/**
 * A class that represents ARC condition that runs actions when the condition is met.
 */
export class ActionCondition {
  /**
   * Creates a default value for a condition.
   * @param {ActionType} [type='response'] The type of the condition.
   * @return {Condition}
   */
  static defaultCondition(type='response') {
    const source = 'url';
    const operator = 'equal';
    const result = /** @type Condition */ ({
      type,
      alwaysPass: true,
      source,
      operator,
      value: '',
      view: {
        opened: true,
      }
    });
    return result;
  }

  /**
   * Creates a default configuration of an action
   * @param {ActionType} [type='response'] The type of the action.
   * @return {Action}
   */
  static defaultAction(type='response') {
    return {
      type,
      name: 'New action',
      config: {},
      failOnError: false,
      priority: 0,
      sync: false,
      view: {},
      enabled: true,
    };
  }
  
  /**
   * @param {RunnableAction} init The condition configuration.
   */
  constructor(init) {
    /**
     * @type {Condition}
     */
    this.condition = init.condition;
    /**
     * @type {ActionType}
     */
    this.type = init.type;
    /**
     * @type {ArcAction[]}
     */
    this.actions = mapActions(init.actions);
    /**
     * @type {boolean}
     */
    this.enabled = init.enabled || false;
  }

  /**
   * Tests whether the condition is satisfied for request and/or response.
   *
   * @param {ArcBaseRequest | ARCSavedRequest | ARCHistoryRequest | TransportRequest} request The ARC request object.
   * @param {Response|ErrorResponse=} response The ARC response object, if available.
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
   * If actions list hasn't been initialized then it creates the list.
   *
   * @param {string} name The name of the action to add.
   */
  add(name) {
    if (!Array.isArray(this.actions)) {
      this.actions = [];
    }
    const { type } = this;
    const init = ActionCondition.defaultAction(type);
    init.name = name;
    const action = new ArcAction(init);
    this.actions.push(action);
  }

  /**
   * Makes a clone of the condition with actions.
   * @returns {ActionCondition} A deep copy of this object.
   */
  clone() {
    const init = recursiveDeepCopy(this);
    const copy = new ActionCondition(init);
    return copy;
  }
}


/**
 * Maps runnables interface to 
 * If an item is not an instance of `ArcAction` then it creates an instance of it
 * by passing the map as an argument.
 *
 * @param {(RunnableAction|ActionCondition)[]} value Passed list of actions.
 * @returns {ActionCondition[]} Mapped actions.
 */
export const mapRunnables = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => {
    if (!(item instanceof ActionCondition)) {
      return new ActionCondition(item);
    }
    return item;
  });
};
