import { EventsTargetMixin } from '@advanced-rest-client/events-target-mixin';
import { VariablesMixin } from '@advanced-rest-client/variables-evaluator/index.js';
import { mapActions } from '../Utils.js';
import { ActionRunner } from './ActionRunner.js';

/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */

/** @typedef {import('../ArcAction.js').ArcAction} ArcAction */
/** @typedef {import('../ArcAction.js').ArcActionConfiguration} ArcActionConfiguration */

/**
 * @typedef {Object} ActionsRunnerConfig
 * @property {HTMLElement|Window=} config.eventsTarget A node to be used to dispat events on.
 * @property {Object=} config.context Variables context
 * @property {String=} config.jexlPath JavaScript path to Jexl library
 * @property {Object=} config.jexl A reference to Jexl object. When set `jexlPath` is not needed.
 */

/**
 * Runs acrions recuresively until all actions are executed.
 * @param {Array<ArcAction>} actions Action definition
 * @param {Object} request ARC request object
 * @param {Object=} response ARC response object
 * @return {Promise}
 */
async function runActions(actions, request, response) {
 if (!actions || !actions.length) {
   return;
 }
 for (let i = 0; i < actions.length; i++) {
   const action = actions[i];
   const runner = new ActionRunner(action);
   await runner.run(request, response);
 }
}

/**
 * @mixes EventsTargetMixin
 * @mixes VariablesMixin
 */
export class ActionsRunner extends VariablesMixin(EventsTargetMixin(Object)) {
  /**
   * @param {ActionsRunnerConfig=} config Configuration options
   */
  constructor(config = {}) {
    const { context, jexlPath, jexl, eventsTarget } = config;
    super();
    this.context = context;
    this.jexlPath = jexlPath;
    this.jexl = jexl;
    this.eventsTarget = eventsTarget;
    this._eventsTargetChanged(eventsTarget);
  }

  dispatchEvent(e) {
    this.eventsTarget.dispatchEvent(e);
  }

  /**
   * The actions run before other transformations are made to the request object like applying cookies or variables.
   * @param {Array<Object>|Array<ArcAction>} actions A list of actions to perform
   * @param {Object} request ArcRequest object. See this doc for data model:
   * https://github.com/advanced-rest-client/api-components-api/blob/master/docs/api-request-and-response.md#api-request
   * @return {Promise} Promise resolved when all actions has been executed.
   * If an actionm fails and it is set up to fail on error then the entire operation
   * fails. Rollback is not performed.
   * @throws {Error} When required arguments are not set.
   */
  async processRequestActions(actions, request) {
    if (!actions || !request) {
      throw new Error('Expecting 2 arguments.');
    }
    const arcActions = mapActions(actions);
    for (let i = 0, len = arcActions.length; i < len; i++) {
      const action = arcActions[i];
      if (action.enabled === false) {
        continue;
      }
      actions[i] = await this._evaluateAction(action);
    }
    return runActions(actions, request);
  }

  /**
   * Processes actions when response object is ready.
   * @param {Array<Object>|Array<ArcAction>} actions List of actions to perform
   * @param {Object} request ArcRequest object. See this doc for data model:
   * https://github.com/advanced-rest-client/api-components-api/blob/master/docs/api-request-and-response.md#api-request
   * @param {Object} response ArcResponse object. See this doc for data model:
   * https://github.com/advanced-rest-client/api-components-api/blob/master/docs/api-request-and-response.md#api-request
   * @return {Promise} A promise resolved when actions were performed.
   */
  async processResponseActions(actions, request, response) {
    if (!actions || !request || !response) {
      throw new Error('Expecting 3 arguments.');
    }
    const arcActions = mapActions(actions);
    for (let i = 0, len = arcActions.length; i < len; i++) {
      const action = arcActions[i];
      if (action.enabled === false) {
        continue;
      }
      actions[i] = await this._evaluateAction(action);
    }
    return runActions(actions, request, response);
  }

  /**
   * Evaluates variables in the action.
   * @param {ArcAction} action An action to evaluate.
   * @return {Promise<ArcAction>} Resolved to an action without variables.
   */
  async _evaluateAction(action) {
    const copy = action.clone();
    const { config } = copy;
    await this.evaluateVariables(config);
    const { source } = /** @type any */ (config);
    if (source && source.iterator) {
      await this.evaluateVariables(source.iterator,);
    }
    return copy;
  }
}
